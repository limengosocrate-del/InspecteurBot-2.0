/**
 * Tableau intelligent des infractions - ajout dynamique + auto-remplissage.
 * @module modules/infractions
 */
import { INFRACTIONS, getInfractionById, NIVEAUX_GRAVITE } from '../data/infractions65.js';
import eventBus from '../core/eventBus.js';

/**
 * Construit une ligne d'infraction complète à partir de l'ID.
 * Auto-remplit : article, référence, montant, gravité.
 */
export function construireLigne(infractionId, options = {}) {
  const inf = getInfractionById(infractionId);
  if (!inf) return null;

  const quantite = options.quantite || 1;
  const montantUnitaire = options.montantUnitaire != null
    ? options.montantUnitaire
    : extraireMontant(inf.sanction);

  return {
    infractionId: inf.id,
    libelle: inf.libelle,
    articles: inf.articles,
    refSanction: inf.refSanction,
    gravite: inf.gravite,
    graviteLabel: NIVEAUX_GRAVITE[inf.gravite].label,
    montantUnitaire,
    quantite,
    montant: montantUnitaire * quantite,
    montantAffiche: formaterMontant(montantUnitaire * quantite, options.devise),
    observation: options.observation || '',
    statut: 'constaté',
    modifiable: options.modifiable !== false
  };
}

/** Extrait un montant numérique d'un libellé de sanction. */
function extraireMontant(sanction) {
  const m = sanction.match(/(\d[\d\s]*\d|\d)/);
  return m ? Number(m[0].replace(/\s/g, '')) : 0;
}

export function formaterMontant(montant, devise = 'USD') {
  const symbole = devise === 'USD' ? '$' : 'FC';
  return montant.toLocaleString('fr-FR') + ' ' + symbole;
}

/**
 * Recalcule tous les totaux d'un tableau.
 * @returns {object} { lignes, totalGeneral, totalAffiche, totalLettres }
 */
export function calculerTotaux(lignes, devise = 'USD') {
  const recalc = lignes.map(l => ({
    ...l,
    montant: l.montantUnitaire * l.quantite,
    montantAffiche: formaterMontant(l.montantUnitaire * l.quantite, devise)
  }));
  const total = recalc.reduce((s, l) => s + l.montant, 0);

  return {
    lignes: recalc,
    totalGeneral: total,
    totalAffiche: formaterMontant(total, devise),
    totalLettres: montantEnLettres(total) + (devise === 'USD' ? ' dollars américains' : ' francs congolais')
  };
}

/** Conversion nombre -> lettres (français). */
export function montantEnLettres(n) {
  if (n === 0) return 'zéro';
  const unites = ['','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf'];
  const dizaines = ['','','vingt','trente','quarante','cinquante','soixante','septante','quatre-vingt','nonante'];

  function tranche(x) {
    let s = '';
    const c = Math.floor(x / 100), r = x % 100;
    if (c > 0) s += (c > 1 ? unites[c] + ' cent' : 'cent') + (r === 0 && c > 1 ? 's' : '') + ' ';
    if (r < 20) s += unites[r];
    else { s += dizaines[Math.floor(r/10)]; if (r % 10) s += '-' + unites[r % 10]; }
    return s.trim();
  }

  let res = '';
  const millions = Math.floor(n / 1e6);
  const milliers = Math.floor((n % 1e6) / 1000);
  const reste = n % 1000;
  if (millions) res += (millions > 1 ? tranche(millions)+' millions ' : 'un million ');
  if (milliers) res += (milliers > 1 ? tranche(milliers)+' mille ' : 'mille ');
  if (reste) res += tranche(reste);
  return res.trim();
}

/** Ajoute une infraction et émet l'événement de recalcul. */
export function ajouterInfraction(lignes, infractionId, options) {
  const ligne = construireLigne(infractionId, options);
  if (!ligne) return lignes;
  const nouvelles = [...lignes, ligne];
  eventBus.emit('infractions:changed', nouvelles);
  return nouvelles;
}

export function supprimerInfraction(lignes, index) {
  const nouvelles = lignes.filter((_, i) => i !== index);
  eventBus.emit('infractions:changed', nouvelles);
  return nouvelles;
}
