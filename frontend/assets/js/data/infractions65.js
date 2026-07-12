/**
 * Base juridique évolutive : 65 infractions du Code du Travail RDC.
 * Source : synthèse OMBENI BAKUNGU LAVIE PAUL + Code du Travail
 * loi n°015-2002 modifiée par Ord.-loi n°16/010 du 15/07/2016.
 * @module data/infractions65
 */

export const INFRACTIONS = [
  { id: 1,  libelle: "Non affichage de l'horaire du travail visé", articles: "Art. 119, 222 CT ; Arrêté 40/2013 Art. 3-4", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 2,  libelle: "Défaut de classification générale des emplois", articles: "Art. 90 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 3,  libelle: "Contrat de travail non constaté par écrit, signé et visé par l'ONEM", articles: "Art. 44, 46, 47, 212 CT", sanction: "Devient CDI + Amende 20 000 FC", refSanction: "Art. 44 et 321", gravite: "grave" },
  { id: 4,  libelle: "Défaut du Règlement Intérieur de l'entreprise", articles: "Art. 157 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 5,  libelle: "Défaut du SMIG", articles: "Art. 87, 94-96 CT", sanction: "Fermeture possible + salaires dus", refSanction: "Art. 318 et 321", gravite: "grave" },
  { id: 6,  libelle: "Faire travailler au-delà de 45h/semaine sans rémunération des heures supplémentaires", articles: "Art. 119, 120 CT", sanction: "Fermeture possible", refSanction: "Art. 318 et 321", gravite: "grave" },
  { id: 7,  libelle: "Privation du jour de repos hebdomadaire", articles: "Art. 121 CT", sanction: "Fermeture possible", refSanction: "Art. 318 et 321", gravite: "grave" },
  { id: 8,  libelle: "Faire travailler enfants/personnes handicapées la nuit ; non-respect du repos", articles: "Art. 125, 126 CT", sanction: "Fermeture possible", refSanction: "Art. 318 et 321", gravite: "tres_grave" },
  { id: 9,  libelle: "Violation des droits des femmes, enfants, personnes handicapées ; test de grossesse", articles: "Art. 128, 129 CT", sanction: "Fermeture possible", refSanction: "Art. 318 et 321", gravite: "tres_grave" },
  { id: 10, libelle: "Employer enfants 15-17 ans sans autorisation IT et parentale", articles: "Art. 133 CT", sanction: "Fermeture possible", refSanction: "Art. 321", gravite: "tres_grave" },
  { id: 11, libelle: "Mauvaises conditions d'hygiène et sécurité", articles: "Art. 171 CT", sanction: "Mise en demeure par l'IT", refSanction: "Art. 171", gravite: "grave" },
  { id: 12, libelle: "Non-assurance d'un service médical aux employés", articles: "Art. 177 CT", sanction: "Amende", refSanction: "Art. 321", gravite: "grave" },
  { id: 13, libelle: "Violation de la convention collective", articles: "Art. 320 CT", sanction: "Amende 7 500 FC", refSanction: "Art. 320", gravite: "moyenne" },
  { id: 14, libelle: "Défaut de formation/perfectionnement via l'INPP", articles: "Art. 8 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 15, libelle: "Recevoir des apprentis sans en avoir la qualité", articles: "Art. 18 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 16, libelle: "Absence de contrat d'apprentissage conforme (max 4 ans)", articles: "Art. 19, 20 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 17, libelle: "Contrat d'apprentissage non visé par l'ONEM", articles: "Art. 21 CT", sanction: "Devient contrat de travail + Amende 20 000 FC", refSanction: "Art. 21 et 312", gravite: "moyenne" },
  { id: 18, libelle: "Non-rémunération de l'apprenti", articles: "Art. 25 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 19, libelle: "Apprenti n'exécutant pas ses obligations", articles: "Art. 26 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "legere" },
  { id: 20, libelle: "Cessation contrat d'apprentissage sans informer IT et ONEM", articles: "Art. 33 al.2 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 21, libelle: "CDD conclu avec travailleur ayant dépassé 22 jours/2 mois (réputé CDI)", articles: "Art. 40 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "grave" },
  { id: 22, libelle: "Divulgation frauduleuse de secrets / concurrence déloyale", articles: "Art. 325 CT", sanction: "Amende 30 000 FC et/ou servitude pénale 3 mois", refSanction: "Art. 325", gravite: "tres_grave" },
  { id: 23, libelle: "Travailleur ne respectant pas les bonnes pratiques/sécurité", articles: "Art. 51 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "legere" },
  { id: 24, libelle: "Absence d'exemplaire du Code du travail à jour pour les représentants", articles: "Art. 55 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "legere" },
  { id: 25, libelle: "Non-prise en charge des frais de transport des travailleurs", articles: "Art. 56 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 26, libelle: "Rupture de contrat en violation de l'Art. 60", articles: "Art. 60 CT", sanction: "Amendes", refSanction: "Art. 321", gravite: "grave" },
  { id: 27, libelle: "Violation des prescriptions sur le préavis (14 + 7 × années)", articles: "Art. 64, 65, 66 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "grave" },
  { id: 28, libelle: "Licenciements massifs en violation de l'Art. 78", articles: "Art. 78 CT", sanction: "Amendes", refSanction: "Art. 321", gravite: "grave" },
  { id: 29, libelle: "Non-remise de l'attestation de services rendus (2 jours)", articles: "Art. 79 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 30, libelle: "Non-affichage/mise à jour de la liste des sous-entreprises", articles: "Art. 84 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "legere" },
  { id: 31, libelle: "Non-rémunération en monnaie légale RDC selon classification", articles: "Art. 89, 90 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "grave" },
  { id: 32, libelle: "Paiement de rémunération hors prescriptions (heures/dates/lieu)", articles: "Art. 98, 99, 100, 101 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 33, libelle: "Paiement de rémunération sans décompte écrit", articles: "Art. 103 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 34, libelle: "Employeur s'attribuant le droit d'infliger des amendes aux travailleurs", articles: "Art. 111, 112 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "grave" },
  { id: 35, libelle: "Violation des conditions des économats", articles: "Art. 116 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 36, libelle: "Discrimination femmes/handicapés ; travail au-delà des capacités", articles: "Art. 136, 137 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "grave" },
  { id: 37, libelle: "Défaut de logement décent ou indemnités de logement", articles: "Art. 138 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 38, libelle: "Défaut de planning de congés annuels", articles: "Art. 140-146 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 39, libelle: "Défaut de frais de transport A/R employé et famille", articles: "Art. 147-156 CT", sanction: "Amende 20 000 FC (IT peut saisir le Tribunal Art. 152)", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 40, libelle: "Absence d'un comité d'hygiène et sécurité", articles: "Art. 167 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "grave" },
  { id: 41, libelle: "Défaut de signalement des accidents/maladies du travail (CNSS + IT)", articles: "Art. 176 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "grave" },
  { id: 42, libelle: "Défaut d'une convention médicale viable", articles: "Art. 177, 178 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "grave" },
  { id: 43, libelle: "Défaut de tenue d'un livre de paie à jour", articles: "Art. 213-216 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 44, libelle: "Défaut de déclaration du mouvement du personnel à l'ONEM", articles: "Art. 217 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 45, libelle: "Défaut de déclaration de la main-d'œuvre et du bilan social", articles: "Art. 218 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 46, libelle: "Ouverture d'un secrétariat social sans caution/autorisation", articles: "Art. 221 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 47, libelle: "Priver un employé membre du CNT du temps de réunion", articles: "Art. 229 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 48, libelle: "Subordonner l'emploi / licencier pour affiliation syndicale", articles: "Art. 234 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "grave" },
  { id: 49, libelle: "Licencier un délégué syndical sans approbation de l'IT", articles: "Art. 258 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "grave" },
  { id: 50, libelle: "Non-octroi de 15h/mois aux représentants des travailleurs", articles: "Art. 265 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 51, libelle: "Non-octroi du congé de stage aux membres du comité", articles: "Art. 268 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 52, libelle: "Privation d'un congé d'éducation ouvrière", articles: "Art. 269 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 53, libelle: "Non-respect des jours fériés légaux", articles: "Art. 123 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 54, libelle: "Contrat exécuté sans certificat médical d'aptitude", articles: "Art. 38 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "grave" },
  { id: 55, libelle: "Violence/menace/manœuvres frauduleuses (engagement, grève)", articles: "Art. 323 CT", sanction: "Amende 25 000 FC et/ou servitude pénale 1 mois", refSanction: "Art. 323", gravite: "tres_grave" },
  { id: 56, libelle: "Violation des prescriptions sur la suspension du contrat", articles: "Art. 57, 58 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 57, libelle: "Excéder les heures de nuit sans majoration", articles: "Art. 124 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "grave" },
  { id: 58, libelle: "Violation des prescriptions logement/restauration", articles: "Art. 139 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 59, libelle: "Défaut du Règlement d'Entreprise", articles: "Art. 158 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "moyenne" },
  { id: 60, libelle: "Défaut d'organisation du comité d'hygiène et sécurité", articles: "Art. 169 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "grave" },
  { id: 61, libelle: "Ne pas répondre à la 3e invitation de l'IT (litige/conflit)", articles: "Art. 321 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "grave" },
  { id: 62, libelle: "Obstacle à l'exercice des fonctions des inspecteurs/contrôleurs", articles: "Art. 322 CT", sanction: "Amende 30 000 FC + servitude pénale 30 jours", refSanction: "Art. 322", gravite: "tres_grave" },
  { id: 63, libelle: "Incitation au refus d'obligations / destruction de contrat", articles: "Art. 323 CT", sanction: "Amende 25 000 FC et/ou servitude pénale 1 mois", refSanction: "Art. 323", gravite: "tres_grave" },
  { id: 64, libelle: "Atteinte à la désignation des représentants / rétention de cautionnement", articles: "Art. 324 CT", sanction: "Amende 25 000 FC et/ou servitude pénale 2 mois", refSanction: "Art. 324", gravite: "tres_grave" },
  { id: 65, libelle: "Priver l'employé du décompte final (2 jours après fin du contrat)", articles: "Art. 100-104 CT", sanction: "Amende 20 000 FC", refSanction: "Art. 321", gravite: "grave" }
];

/**
 * Note : les amendes en FC sont actualisées en USD par l'arrêté
 * interministériel N°CAB/MIN/ETPS/CNM/HMK/JBI/006/09/2023
 * et N°CAB/MIN/FINANCES/127/09/2023 du 03/10/2023.
 */

export function getInfractionById(id) {
  return INFRACTIONS.find(i => i.id === id) || null;
}

export function searchInfractions(query) {
  const q = query.toLowerCase();
  return INFRACTIONS.filter(i =>
    i.libelle.toLowerCase().includes(q) ||
    i.articles.toLowerCase().includes(q)
  );
}

export const NIVEAUX_GRAVITE = {
  legere:     { label: "Légère",     couleur: "#4caf50", poids: 1 },
  moyenne:    { label: "Moyenne",    couleur: "#ff9800", poids: 2 },
  grave:      { label: "Grave",      couleur: "#f44336", poids: 3 },
  tres_grave: { label: "Très grave", couleur: "#b71c1c", poids: 4 }
};
