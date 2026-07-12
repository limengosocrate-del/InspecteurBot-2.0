/**
 * Rendu HTML fidèle du PV de Constat d'Infraction (format A4).
 * @module templates/pvConstatInfraction
 */
import { INFRACTIONS } from '../data/infractions65.js';

/**
 * @param {object} d - données du PV
 * @returns {string} HTML
 */
export function renderConstatInfraction(d = {}) {
  const infractionsRows = (d.infractions || []).map((inf, i) => `
    <tr>
      <td class="c-num">${String(i + 1).padStart(2, '0')}.</td>
      <td>${inf.libelle || ''}</td>
      <td>${inf.articles || ''}</td>
      <td class="c-montant">${inf.montantAffiche || ''}</td>
    </tr>`).join('');

  const totalGeneral = (d.infractions || [])
    .reduce((s, i) => s + (Number(i.montant) || 0), 0);

  return `
  <div class="pv-page a4" id="pv-render">
    <!-- EN-TÊTE -->
    <header class="pv-entete">
      <div class="pv-logo"><img src="assets/img/armoirie-rdc.png" alt="RDC" class="armoirie"/>
        <div class="igt-label">I.G.T</div>
      </div>
      <div class="pv-entete-text">
        <p class="rdc">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</p>
        <p>Ministère de l'Emploi et Travail</p>
        <p class="bleu">${d.inspection || 'Inspection Générale du Travail'}</p>
        <p class="rouge">${d.administration || 'Administration Centrale'}</p>
        ${d.directionProvinciale ? `<p>${d.directionProvinciale}</p>` : ''}
      </div>
    </header>

    <!-- TITRE -->
    <h1 class="pv-titre">PROCÈS-VERBAL DE CONSTAT D'INFRACTION</h1>
    <p class="pv-numero">${d.numero || 'N°......./MET/IGT/ADMC/DEP/IT/OPJ/___/___/____'}</p>

    <!-- CORPS -->
    <div class="pv-corps">
      <p class="indent">L'an ${d.anneeLettres || 'deux mille vingt-six'}, le ${d.jourLettres || '.....'} jour du mois de ${d.mois || '.....'} ;</p>

      <p class="indent">Nous <strong>${d.inspecteur || '.....'}</strong>, Inspecteur du travail en compétence territoriale générale et officier de police judiciaire à compétence matérielle restreinte en matière du travail, dûment assermenté sous le numéro d'habilitation ${d.numeroHabilitation || '.....'} ;
      Agissant en vertu des dispositions légales en la matière, notamment en ses articles 187, 196 et 197 de la loi n°015-2002 du 16 octobre 2002 portant code du travail, telle que modifiée et complétée à ce jour ainsi que ses mesures d'application ;
      En exécution de l'ordre de mission ${d.ordreMission || '.....'} ;
      Avons effectué une mission officielle de contrôle au sein de l'entreprise <strong>${d.entreprise || '.....'}</strong> sise au ${d.adresse || '.....'}, quartier ${d.quartier || '.....'}, Commune de ${d.commune || '.....'} dans la ville Province de ${d.ville || '.....'} ;
      Avons constaté les infractions suivantes à la charge de l'entreprise précitée, en présence de ${d.representant || '.....'} en qualité de ${d.representantFonction || '.....'}, téléphone : ${d.representantTel || '.....'}${d.temoin2 ? ` et ${d.temoin2} en qualité de ${d.temoin2Fonction}, téléphone : ${d.temoin2Tel}` : ''}.</p>
    </div>

    <!-- TABLEAU DES CONTRAVENTIONS -->
    <h2 class="pv-sous-titre">LES CONTRAVENTIONS CI-DESSOUS</h2>
    <table class="pv-table">
      <thead>
        <tr><th>N°</th><th>INFRACTIONS</th><th>TEXTE VIOLÉ</th><th>AMENDE TRANSACTIONNELLE</th></tr>
      </thead>
      <tbody>${infractionsRows}</tbody>
      <tfoot>
        <tr><td colspan="3"><strong>Total général</strong></td><td class="c-montant"><strong>${d.totalAffiche || totalGeneral + ' $'}</strong></td></tr>
        <tr><td colspan="4"><strong>En lettre :</strong> ${d.totalLettres || '.....'}</td></tr>
      </tfoot>
    </table>

    <!-- CLÔTURE -->
    <div class="pv-corps">
      <p class="indent">Ces amendes sont mises à sa charge suite aux infractions constatées au regard des dispositions du ministère de l'emploi et du travail. L'entreprise est obligée de se soumettre aux prescriptions de la loi dans un bref délai. En outre, nonobstant le paiement desdites amendes, elle reste telle qu'elle est définie en la matière.</p>
      <p class="indent">En foi de quoi, nous avons établi le présent procès-verbal d'infraction en quatre ampliations dont chacun sera transmis à qui de droit conformément aux dispositions légales susmentionnées.</p>
      <p class="indent">Fait au jour, mois et an que dessus. Nous jurons le présent Procès-Verbal sincère.</p>
      <p class="pv-lieu-date">Fait à ${d.lieuFait || 'Kinshasa'}, le ${d.dateFait || '.....'}</p>
    </div>

    <!-- SIGNATURES -->
    <div class="pv-signatures">
      <div class="sig-bloc">
        <p class="sig-titre">POUR LE CONTREVENANT</p>
        <p>NOMS : ${d.contrevenantNom || ''}</p>
        <p>FONCTION : ${d.contrevenantFonction || ''}</p>
        <div class="sig-zone" data-role="contrevenant">${d.signatureContrevenant ? `<img src="${d.signatureContrevenant}" class="sig-img"/>` : ''}</div>
      </div>
      <div class="sig-bloc">
        <p class="sig-titre">VERBALISATEUR</p>
        <p><strong>${d.inspecteur || ''}</strong></p>
        <p>Inspecteur du Travail et Officier de Police Judiciaire</p>
        <div class="sig-zone" data-role="verbalisateur">${d.signatureVerbalisateur ? `<img src="${d.signatureVerbalisateur}" class="sig-img"/>` : ''}</div>
        ${d.cachet ? `<img src="${d.cachet}" class="cachet" style="left:${d.cachetX||0}px;top:${d.cachetY||0}px"/>` : ''}
      </div>
    </div>

    <!-- QR CODE -->
    ${d.qrCode ? `<div class="pv-qr"><img src="${d.qrCode}" alt="QR"/><span>${d.identifiantUnique || ''}</span></div>` : ''}
  </div>`;
}
