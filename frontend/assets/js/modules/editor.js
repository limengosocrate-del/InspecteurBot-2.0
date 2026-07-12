/**
 * Éditeur de PV : génère le formulaire selon le modèle,
 * gère l'aperçu temps réel, sauvegarde auto, IA, signature, QR.
 * @module modules/editor
 */
import store from '../core/store.js';
import eventBus from '../core/eventBus.js';
import router from '../core/router.js';
import { getModele } from '../data/templates.js';
import { getProvincesForSelect, getDirectionByProvince, ENTETE_FIXE } from '../data/provinces.js';
import { INFRACTIONS } from '../data/infractions65.js';
import { renderPV } from '../templates/index.js';
import { sauvegarderBrouillon, changerStatut, genererNumero, detecterDoublons, STATUTS } from './pvManager.js';
import { ajouterInfraction, supprimerInfraction, calculerTotaux, construireLigne } from './infractions.js';
import { creerSignature } from './signature.js';
import { scellerPV } from './qrcode.js';
import { exporterPDF, imprimer, apercuAvantImpression } from './pdfExport.js';
import { DicteeVocale, lirePV } from './voice.js';
import * as AI from '../ai/aiEngine.js';

// Champs à libellés lisibles
const LABELS = {
  province: 'Province', directionProvinciale: 'Direction Provinciale',
  inspection: 'Inspection', numero: 'Numéro du PV', annee: 'Année',
  jour: 'Jour', mois: 'Mois', inspecteur: 'Inspecteur / Contrôleur',
  numeroHabilitation: "Numéro d'habilitation", ordreMission: 'Ordre de mission',
  entreprise: 'Entreprise', rccm: 'RCCM', idNat: 'ID NAT', numeroImpot: 'Numéro Impôt',
  adresse: 'Adresse', quartier: 'Quartier', commune: 'Commune', ville: 'Ville',
  representant: 'Représentant', representantFonction: 'Fonction du représentant',
  representantTel: 'Téléphone représentant', responsable: 'Responsable',
  responsableFonction: 'Fonction responsable', dateControle: 'Date du contrôle',
  demandeur: 'Demandeur', defendeur: 'Défendeur', faits: 'Faits / Observations',
  destinataire: 'Destinataire', objet: 'Objet', delai: 'Délai', corps: 'Corps du texte',
  lieuFait: 'Fait à', dateFait: 'Date', lieu: 'Lieu', date: 'Date'
};

const CHAMPS_LONGS = ['faits', 'corps', 'conclusion', 'proposition', 'constat'];

let dictee = null;
let currentId = null;
let autoSaveTimer = null;

export function ouvrirEditeur(pvId) {
  currentId = pvId;
  const pv = store.getPV(pvId);
  if (!pv) { router.navigate('tous'); return; }

  const modele = getModele(pv.type);
  const app = document.getElementById('app');
  app.querySelector('.ib-main').innerHTML = renderEditeur(pv, modele);

  brancherEvenements(pv, modele);
  rafraichirApercu();
}

function renderEditeur(pv, modele) {
  const provinces = getProvincesForSelect();

  return `
  <div class="editeur">
    <div class="editeur-header">
      <h1>${modele.titre}</h1>
      <div class="editeur-actions">
        <span class="badge ${pv.statut}">${pv.statut}</span>
        <button id="btnIA" class="btn btn-ia">🤖 Assistant IA</button>
        <button id="btnLire" class="btn">🔊 Lire</button>
        <button id="btnApercu" class="btn">👁️ Aperçu</button>
        <button id="btnPDF" class="btn">📄 PDF</button>
        <button id="btnImprimer" class="btn">🖨️ Imprimer</button>
        <button id="btnSigner" class="btn btn-primary">✍️ Signer & Sceller</button>
      </div>
    </div>

    <div class="editeur-body">
      <!-- FORMULAIRE -->
      <form id="pvForm" class="pv-form">
        <fieldset>
          <legend>En-tête administratif</legend>
          <label>Administration
            <select name="administration">
              ${ENTETE_FIXE.administrations.map(a => `<option ${pv.administration===a?'selected':''}>${a}</option>`).join('')}
            </select>
          </label>
          <label>Structure
            <select name="inspection">
              ${ENTETE_FIXE.structures.map(s => `<option ${pv.inspection===s?'selected':''}>${s}</option>`).join('')}
            </select>
          </label>
          <label>Province
            <select name="province" id="selProvince">
              <option value="">— Sélectionner —</option>
              ${provinces.map(p => `<option value="${p.id}" ${pv.province===p.id?'selected':''}>${p.nom}</option>`).join('')}
            </select>
          </label>
          <label>Direction Provinciale
            <input name="directionProvinciale" id="inpDirection" value="${pv.directionProvinciale||''}" readonly/>
          </label>
        </fieldset>

        <fieldset>
          <legend>Informations du PV</legend>
          ${renderNumeroField(pv, modele)}
          ${modele.champs.filter(c => !['province','directionProvinciale','inspection','numero'].includes(c))
            .map(c => renderChamp(c, pv)).join('')}
        </fieldset>

        ${modele.aTableauInfractions ? renderTableauInfractions(pv) : ''}
      </form>

      <!-- APERÇU -->
      <div class="editeur-preview">
        <div class="preview-toolbar"><span>Aperçu A4</span></div>
        <div id="previewZone" class="preview-zone"></div>
      </div>
    </div>

    <!-- MODALES -->
    <div id="modalSignature" class="modal hidden">
      <div class="modal-content">
        <h2>Signature électronique</h2>
        <p>Signez ci-dessous (tactile ou souris) :</p>
        <canvas id="sigCanvas" width="500" height="180" class="sig-canvas"></canvas>
        <div class="modal-actions">
          <button id="sigClear" class="btn">Effacer</button>
          <button id="sigSave" class="btn btn-primary">Valider signature</button>
          <button id="sigCancel" class="btn">Annuler</button>
        </div>
      </div>
    </div>

    <div id="modalIA" class="modal hidden">
      <div class="modal-content">
        <h2>🤖 Assistant IA Juridique</h2>
        <textarea id="iaFaits" placeholder="Décrivez les faits constatés..."></textarea>
        <button id="iaAnalyser" class="btn btn-primary">Analyser & proposer les infractions</button>
        <div id="iaResultat" class="ia-resultat"></div>
        <button id="iaFermer" class="btn">Fermer</button>
      </div>
    </div>
  </div>`;
}

function renderNumeroField(pv, modele) {
  if (!modele.aNumero) return '';
  const params = store.get('parametres');
  return `
    <label>Numéro du PV
      <div class="numero-field">
        <input name="numero" id="inpNumero" value="${pv.numero||''}" placeholder="${modele.formatNumero}"/>
        <button type="button" id="btnGenNumero" class="btn btn-sm">Générer (${params.numerotation.mode})</button>
      </div>
    </label>`;
}

function renderChamp(nom, pv) {
  const label = LABELS[nom] || nom;
  const val = pv[nom] || '';
  if (CHAMPS_LONGS.includes(nom)) {
    return `<label class="champ-long">${label}
      <div class="champ-voix">
        <textarea name="${nom}" rows="4">${val}</textarea>
        <button type="button" class="btn-mic" data-champ="${nom}">🎤</button>
      </div>
    </label>`;
  }
  return `<label>${label}
    <div class="champ-voix">
      <input name="${nom}" value="${val}"/>
      <button type="button" class="btn-mic" data-champ="${nom}">🎤</button>
    </div>
  </label>`;
}

function renderTableauInfractions(pv) {
  const totaux = calculerTotaux(pv.infractions || []);
  return `
  <fieldset class="fieldset-infractions">
    <legend>Tableau intelligent des infractions</legend>
    <div class="infraction-ajout">
      <select id="selInfraction">
        <option value="">— Choisir une infraction —</option>
        ${INFRACTIONS.map(i => `<option value="${i.id}">${i.id}. ${i.libelle}</option>`).join('')}
      </select>
      <input type="number" id="infQuantite" value="1" min="1" title="Quantité"/>
      <button type="button" id="btnAjoutInfraction" class="btn btn-sm">➕ Ajouter</button>
    </div>
    <table class="table-infractions" id="tableInfractions">
      <thead>
        <tr><th>N°</th><th>Infraction</th><th>Référence</th><th>Gravité</th>
        <th>Montant unit.</th><th>Qté</th><th>Total</th><th>Observation</th><th></th></tr>
      </thead>
      <tbody>
        ${(pv.infractions||[]).map((l,i) => ligneInfractionHTML(l,i)).join('')}
      </tbody>
      <tfoot>
        <tr><td colspan="6"><strong>Total général</strong></td>
        <td id="totalGeneral"><strong>${totaux.totalAffiche}</strong></td><td colspan="2"></td></tr>
        <tr><td colspan="9"><strong>En lettres :</strong> <span id="totalLettres">${totaux.totalLettres||''}</span></td></tr>
      </tfoot>
    </table>
  </fieldset>`;
}

function ligneInfractionHTML(l, i) {
  return `<tr data-index="${i}">
    <td>${String(i+1).padStart(2,'0')}</td>
    <td>${l.libelle}</td>
    <td>${l.articles}</td>
    <td><span class="gravite-badge ${l.gravite}">${l.graviteLabel}</span></td>
    <td><input type="number" class="inp-montant" data-index="${i}" value="${l.montantUnitaire}" ${l.modifiable===false?'disabled':''}/></td>
    <td><input type="number" class="inp-qte" data-index="${i}" value="${l.quantite}" min="1"/></td>
    <td class="c-montant">${l.montantAffiche}</td>
    <td><input class="inp-obs" data-index="${i}" value="${l.observation||''}"/></td>
    <td><button type="button" class="btn-suppr" data-index="${i}">🗑️</button></td>
  </tr>`;
}

/* ---------- ÉVÉNEMENTS ---------- */
function brancherEvenements(pv, modele) {
  const form = document.getElementById('pvForm');

  // Province -> Direction auto
  const selProvince = document.getElementById('selProvince');
  if (selProvince) {
    selProvince.addEventListener('change', e => {
      const dir = getDirectionByProvince(e.target.value) || '';
      document.getElementById('inpDirection').value = dir;
      declencherSauvegarde();
    });
  }

  // Saisie -> aperçu + auto-save
  form.addEventListener('input', () => declencherSauvegarde());

  // Numéro
  const btnGen = document.getElementById('btnGenNumero');
  if (btnGen) btnGen.addEventListener('click', () => {
    try {
      const data = collecterDonnees();
      const num = genererNumero(pv.type, {
        initiales: initiales(data.inspecteur), annee: data.annee || new Date().getFullYear(),
        ville: data.ville, numeroManuel: parseInt(data.numero) || undefined
      });
      document.getElementById('inpNumero').value = num;
      declencherSauvegarde();
    } catch (err) { alert(err.message); }
  });

  // Micro (dictée)
  document.querySelectorAll('.btn-mic').forEach(btn => {
    btn.addEventListener('click', () => {
      dictee = dictee || new DicteeVocale();
      const champ = form.querySelector(`[name="${btn.dataset.champ}"]`);
      if (btn.classList.contains('actif')) { dictee.arreter(); btn.classList.remove('actif'); }
      else { dictee.demarrer(champ); btn.classList.add('actif'); }
    });
  });

  // Infractions
  if (modele.aTableauInfractions) brancherInfractions(pv);

  // Boutons d'action
  document.getElementById('btnApercu').addEventListener('click', () => { sauvegarder(); apercuAvantImpression('pv-render'); });
  document.getElementById('btnPDF').addEventListener('click', async () => { await sauvegarder(); rendreDansDom(); await exporterPDF('pv-render', collecterDonnees().numero || 'PV'); });
  document.getElementById('btnImprimer').addEventListener('click', () => { sauvegarder(); rendreDansDom(); imprimer('pv-render'); });
  document.getElementById('btnLire').addEventListener('click', () => lirePV(store.getPV(currentId)));

  // Signature
  brancherSignature();

  // IA
  brancherIA();
}

function brancherInfractions(pv) {
  document.getElementById('btnAjoutInfraction').addEventListener('click', () => {
    const id = parseInt(document.getElementById('selInfraction').value);
    const qte = parseInt(document.getElementById('infQuantite').value) || 1;
    if (!id) return;
    const cur = store.getPV(currentId);
    cur.infractions = ajouterInfraction(cur.infractions || [], id, { quantite: qte });
    sauvegarder();
    rafraichirTableau();
  });

  document.getElementById('tableInfractions').addEventListener('input', e => {
    const idx = parseInt(e.target.dataset.index);
    if (isNaN(idx)) return;
    const cur = store.getPV(currentId);
    const l = cur.infractions[idx];
    if (e.target.classList.contains('inp-montant')) l.montantUnitaire = Number(e.target.value);
    if (e.target.classList.contains('inp-qte')) l.quantite = Number(e.target.value);
    if (e.target.classList.contains('inp-obs')) l.observation = e.target.value;
    const t = calculerTotaux(cur.infractions);
    cur.infractions = t.lignes;
    cur.totalGeneral = t.totalGeneral; cur.totalAffiche = t.totalAffiche; cur.totalLettres = t.totalLettres;
    sauvegarder();
    document.getElementById('totalGeneral').innerHTML = `<strong>${t.totalAffiche}</strong>`;
    document.getElementById('totalLettres').textContent = t.totalLettres;
    rafraichirApercu();
  });

  document.getElementById('tableInfractions').addEventListener('click', e => {
    if (e.target.classList.contains('btn-suppr')) {
      const idx = parseInt(e.target.dataset.index);
      const cur = store.getPV(currentId);
      cur.infractions = supprimerInfraction(cur.infractions, idx);
      sauvegarder();
      rafraichirTableau();
    }
  });
}

function brancherSignature() {
  const modal = document.getElementById('modalSignature');
  let pad = null, roleCourant = 'verbalisateur';

  document.getElementById('btnSigner').addEventListener('click', () => {
    const pv = store.getPV(currentId);
    const doublons = detecterDoublons(pv);
    if (doublons.length && !confirm(`⚠️ ${doublons.length} PV similaire(s) détecté(s) pour cette entreprise ce mois-ci. Continuer ?`)) return;
    modal.classList.remove('hidden');
    setTimeout(() => { pad = creerSignature('sigCanvas'); }, 50);
  });

  document.getElementById('sigClear').addEventListener('click', () => pad?.clear());
  document.getElementById('sigCancel').addEventListener('click', () => modal.classList.add('hidden'));

  document.getElementById('sigSave').addEventListener('click', async () => {
    if (!pad || pad.isEmpty()) { alert('Veuillez signer.'); return; }
    const cur = store.getPV(currentId);
    // Enregistre selon le premier rôle du modèle (verbalisateur/inspecteur/opj)
    const modele = getModele(cur.type);
    const roleSig = modele.aSignatures.find(r => ['verbalisateur','inspecteur','opj'].includes(r)) || modele.aSignatures[0];
    const key = 'signature' + roleSig.charAt(0).toUpperCase() + roleSig.slice(1);
    cur[key] = pad.toDataURL();

    // Scellement QR + identifiant unique
    const scelle = await scellerPV(cur);
    store.updatePV(currentId, { ...scelle });
    changerStatut(currentId, STATUTS.SIGNE);
    modal.classList.add('hidden');
    ouvrirEditeur(currentId);
    alert('✅ PV signé et scellé avec QR Code.');
  });
}

function brancherIA() {
  const modal = document.getElementById('modalIA');
  document.getElementById('btnIA').addEventListener('click', () => {
    modal.classList.remove('hidden');
    const pv = store.getPV(currentId);
    document.getElementById('iaFaits').value = pv.faits || '';
  });
  document.getElementById('iaFermer').addEventListener('click', () => modal.classList.add('hidden'));

  document.getElementById('iaAnalyser').addEventListener('click', () => {
    const faits = document.getElementById('iaFaits').value;
    const analyse = AI.analyserFaits(faits);
    const coherence = AI.verifierCoherence(store.getPV(currentId));

    document.getElementById('iaResultat').innerHTML = `
      <div class="ia-bloc">
        <h3>${analyse.message} (confiance : ${Math.round(analyse.confiance*100)}%)</h3>
        <ul>${analyse.infractions.map(i => `<li>✓ ${i.libelle} — <em>${i.articles}</em> — ${i.sanction}</li>`).join('')}</ul>
        ${analyse.infractions.length ? `<p><strong>Total estimé : ${analyse.totaux.totalAffiche}</strong></p>
        <button id="iaAppliquer" class="btn btn-primary">Appliquer au PV</button>` : ''}
      </div>
      <div class="ia-bloc">
        <h3>Contrôle de cohérence</h3>
        ${coherence.erreurs.map(e => `<p class="ia-err">❌ ${e}</p>`).join('')}
        ${coherence.avertissements.map(a => `<p class="ia-warn">⚠️ ${a}</p>`).join('')}
        ${coherence.suggestions.map(s => `<p class="ia-sugg">💡 ${s}</p>`).join('')}
      </div>`;

    const btnApp = document.getElementById('iaAppliquer');
    if (btnApp) btnApp.addEventListener('click', () => {
      const cur = store.getPV(currentId);
      cur.infractions = analyse.lignes;
      cur.faits = faits;
      cur.totalGeneral = analyse.totaux.totalGeneral;
      cur.totalAffiche = analyse.totaux.totalAffiche;
      cur.totalLettres = analyse.totaux.totalLettres;
      sauvegarder();
      modal.classList.add('hidden');
      ouvrirEditeur(currentId);
    });
  });
}

/* ---------- UTILITAIRES ---------- */
function collecterDonnees() {
  const form = document.getElementById('pvForm');
  const data = {};
  new FormData(form).forEach((v, k) => data[k] = v);
  return data;
}

function declencherSauvegarde() {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => { sauvegarder(); rafraichirApercu(); }, 600);
}

function sauvegarder() {
  const data = collecterDonnees();
  return sauvegarderBrouillon(currentId, data);
}

function rafraichirApercu() {
  const pv = store.getPV(currentId);
  document.getElementById('previewZone').innerHTML = renderPV(pv);
}

function rendreDansDom() {
  // S'assure que #pv-render existe dans le DOM pour PDF/impression
  rafraichirApercu();
}

function rafraichirTableau() {
  const pv = store.getPV(currentId);
  const tbody = document.querySelector('#tableInfractions tbody');
  tbody.innerHTML = (pv.infractions||[]).map((l,i)=>ligneInfractionHTML(l,i)).join('');
  const t = calculerTotaux(pv.infractions||[]);
  document.getElementById('totalGeneral').innerHTML = `<strong>${t.totalAffiche}</strong>`;
  document.getElementById('totalLettres').textContent = t.totalLettres;
  rafraichirApercu();
}

function initiales(nom) {
  if (!nom) return 'XXX';
  return nom.split(/\s+/).map(m => m[0]).join('').toUpperCase().slice(0,3);
  }
