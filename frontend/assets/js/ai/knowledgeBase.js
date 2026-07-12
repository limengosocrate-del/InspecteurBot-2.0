/**
 * Base de connaissances locale (mots-clés -> infractions).
 * 100% hors-ligne, sans dépendance cloud.
 * @module ai/knowledgeBase
 */
export const REGLES_DETECTION = [
  { motsCles: ['horaire','affichage horaire','pas d\'horaire'], infractionId: 1 },
  { motsCles: ['classification','emploi non classé','grille'], infractionId: 2 },
  { motsCles: ['contrat','pas de contrat','sans contrat','verbal','écrit'], infractionId: 3 },
  { motsCles: ['règlement intérieur','pas de règlement'], infractionId: 4 },
  { motsCles: ['smig','salaire minimum','sous-payé'], infractionId: 5 },
  { motsCles: ['heures supplémentaires','45 heures','trop d\'heures','sans rémunération'], infractionId: 6 },
  { motsCles: ['repos','jour de repos','pas de congé hebdomadaire'], infractionId: 7 },
  { motsCles: ['enfant nuit','mineur nuit','handicapé nuit'], infractionId: 8 },
  { motsCles: ['discrimination','grossesse','test grossesse','femme enceinte'], infractionId: 9 },
  { motsCles: ['enfant','mineur','15 ans','travail des enfants'], infractionId: 10 },
  { motsCles: ['hygiène','sécurité','insalubre','conditions'], infractionId: 11 },
  { motsCles: ['médical','service médical','infirmerie','pas de médecin'], infractionId: 12 },
  { motsCles: ['convention collective'], infractionId: 13 },
  { motsCles: ['inpp','formation','perfectionnement'], infractionId: 14 },
  { motsCles: ['préavis','sans préavis'], infractionId: 27 },
  { motsCles: ['licenciement massif','compression'], infractionId: 28 },
  { motsCles: ['attestation','services rendus'], infractionId: 29 },
  { motsCles: ['livre de paie','registre paie'], infractionId: 43 },
  { motsCles: ['mouvement personnel','onem','déclaration personnel'], infractionId: 44 },
  { motsCles: ['bilan social','main d\'œuvre','déclaration annuelle'], infractionId: 45 },
  { motsCles: ['comité hygiène','cshe','comité sécurité'], infractionId: 40 },
  { motsCles: ['accident','maladie professionnelle','cnss'], infractionId: 41 },
  { motsCles: ['congé annuel','planning congé'], infractionId: 38 },
  { motsCles: ['transport','frais transport'], infractionId: 25 },
  { motsCles: ['syndical','syndicat','délégué'], infractionId: 48 },
  { motsCles: ['obstacle','obstruction','refus contrôle','empêcher','refus de recevoir'], infractionId: 62 },
  { motsCles: ['certificat médical','aptitude'], infractionId: 54 },
  { motsCles: ['décompte final','solde de tout compte'], infractionId: 65 },
  { motsCles: ['jours fériés','férié'], infractionId: 53 }
];

export const FAQ = [
  { q: ['quel article','obstruction'], r: "L'obstruction au contrôle est réprimée par l'Art. 322 du Code du Travail : amende de 30 000 FC + servitude pénale de 30 jours." },
  { q: ['délai','mise en demeure'], r: "Le délai d'une mise en demeure est fixé par l'inspecteur (souvent 24h à quelques jours). Passé ce délai, saisine de la juridiction ou application des sanctions de l'arrêté du 03/10/2023." },
  { q: ['taux','carte de travail','étranger'], r: "Carte de travail étranger : Cat.A=500$, B=700$, C=1000$, D=1500$, E=2000$, F=2800$ (arrêté du 03/10/2023)." },
  { q: ['combien','ampliations'], r: "Le PV de constat d'infraction est établi en 4 ampliations ; le PV d'obstruction en 3 ampliations." }
];
