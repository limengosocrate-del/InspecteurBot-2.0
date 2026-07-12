/**
 * Moteur IA juridique local d'InspecteurBot.
 * Analyse des faits, détection d'infractions, cohérence, rédaction assistée.
 * @module ai/aiEngine
 */
import { REGLES_DETECTION, FAQ } from './knowledgeBase.js';
import { getInfractionById } from '../data/infractions65.js';
import { construireLigne, calculerTotaux } from '../modules/infractions.js';
import { normaliser, contientMotCle, similarite } from './nlpAnalyzer.js';

/**
 * Analyse un texte de faits et propose les infractions applicables.
 * @param {string} faits
 * @returns {object} { infractions, articles, lignes, totaux, confiance }
 */
export function analyserFaits(faits) {
  const texte = normaliser(faits);
  const detectees = new Map();

  REGLES_DETECTION.forEach(regle => {
    regle.motsCles.forEach(mc => {
      if (contientMotCle(texte, mc)) {
        const inf = getInfractionById(regle.infractionId);
        if (inf && !detectees.has(inf.id)) {
          detectees.set(inf.id, { infraction: inf, declencheur: mc });
        }
      }
    });
  });

  const infractions = [...detectees.values()].map(d => d.infraction);
  const lignes = infractions.map(i => construireLigne(i.id));
  const totaux = calculerTotaux(lignes);

  return {
    infractions,
    articles: infractions.map(i => i.articles),
    lignes,
    totaux,
    confiance: infractions.length ? Math.min(0.95, 0.5 + infractions.length * 0.1) : 0,
    message: infractions.length
      ? `${infractions.length} infraction(s) identifiée(s) automatiquement.`
      : "Aucune infraction détectée. Précisez les faits ou sélectionnez manuellement."
  };
}

/**
 * Vérifie la cohérence juridique d'un PV et détecte les omissions.
 * @param {object} pv
 * @returns {object} { valide, erreurs, avertissements, suggestions }
 */
export function verifierCoherence(pv) {
  const erreurs = [], avertissements = [], suggestions = [];

  if (!pv.inspecteur) erreurs.push("Nom de l'inspecteur/contrôleur manquant.");
  if (!pv.numeroHabilitation && pv.type === 'constat_infraction')
    avertissements.push("Numéro d'habilitation absent.");
  if (!pv.ordreMission) avertissements.push("Ordre de mission non renseigné.");
  if (!pv.entreprise) erreurs.push("Entreprise contrôlée non renseignée.");
  if (pv.aTableauInfractions !== false && (!pv.infractions || !pv.infractions.length))
    avertissements.push("Aucune infraction listée dans le PV.");
  if (!pv.dateFait && !pv.date) avertissements.push("Date du PV manquante.");

  // Cohérence des montants
  if (pv.infractions && pv.infractions.length) {
    const t = calculerTotaux(pv.infractions);
    if (pv.totalGeneral != null && pv.totalGeneral !== t.totalGeneral)
      erreurs.push(`Incohérence de total : affiché ${pv.totalGeneral}, calculé ${t.totalGeneral}.`);
  }

  // Suggestions
  if (pv.infractions?.some(i => i.gravite === 'tres_grave'))
    suggestions.push("Infraction très grave détectée : envisager la saisine du Parquet.");
  if (pv.type === 'constat_obstruction')
    suggestions.push("Rappeler l'Art. 322 CT et transmettre au Procureur près le TGI.");

  return {
    valide: erreurs.length === 0,
    erreurs, avertissements, suggestions
  };
}

/** Suggère un texte d'observation pour une infraction. */
export function suggererObservation(infractionId) {
  const inf = getInfractionById(infractionId);
  if (!inf) return '';
  const modeles = {
    tres_grave: `Infraction très grave (${inf.refSanction}). Mise en conformité immédiate exigée sous peine de poursuites pénales.`,
    grave: `Manquement grave constaté (${inf.articles}). L'entreprise doit régulariser dans les meilleurs délais.`,
    moyenne: `Régularisation requise conformément à ${inf.articles}.`,
    legere: `À corriger. Référence : ${inf.articles}.`
  };
  return modeles[inf.gravite] || modeles.moyenne;
}

/** Assistant conversationnel (questions/réponses). */
export function repondre(question) {
  const q = normaliser(question);

  // FAQ
  for (const item of FAQ) {
    if (item.q.every(kw => q.includes(normaliser(kw))) ||
        item.q.some(kw => similarite(q, kw) > 0.6)) {
      return { type: 'faq', reponse: item.r };
    }
  }

  // Détection d'infractions dans la question
  const analyse = analyserFaits(question);
  if (analyse.infractions.length) {
    const liste = analyse.infractions
      .map(i => `• ${i.libelle} (${i.articles}) — ${i.sanction}`).join('\n');
    return {
      type: 'analyse',
      reponse: `D'après votre description, voici les infractions applicables :\n${liste}\n\nTotal indicatif : ${analyse.totaux.totalAffiche}.`
    };
  }

  return {
    type: 'defaut',
    reponse: "Je suis l'assistant juridique d'InspecteurBot. Décrivez les faits constatés, posez une question sur le Code du Travail, les infractions, les amendes ou la procédure, et je vous assisterai dans la rédaction du PV."
  };
}

/** Rédaction assistée complète d'un PV à partir de données partielles. */
export function redigerPV(type, donnees) {
  const analyse = donnees.faits ? analyserFaits(donnees.faits) : { lignes: [], totaux: {} };
  return {
    ...donnees,
    infractions: donnees.infractions?.length ? donnees.infractions : analyse.lignes,
    totalGeneral: analyse.totaux.totalGeneral,
    totalAffiche: analyse.totaux.totalAffiche,
    totalLettres: analyse.totaux.totalLettres,
    coherence: verifierCoherence({ ...donnees, type, infractions: analyse.lignes })
  };
    }
