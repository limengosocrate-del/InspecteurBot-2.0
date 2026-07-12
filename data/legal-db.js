/* ============================================================================
 * InspecteurBot — Module PV
 * BASE JURIDIQUE (évolutive) — Code du Travail RDC
 * Loi n°015-2002 du 16 octobre 2002 portant Code du Travail
 * Source infractions : "65 infractions et sanctions prévues par le Code du Travail"
 *  — OMBENI BAKUNGU LAVIE PAUL, Inspecteur du Travail (Mai 2024)
 * Amendes actualisées : Arrêté interministériel
 *  N° CAB/MIN/ETPS/CNM/HMK/JBL/006/09/2023 et
 *  N° CAB/MIN/FINANCES/127/09/2023 du 03/10/2023
 * ==========================================================================*/

/* --------------------------------------------------------------------------
 * 1) PROVINCES + DIRECTIONS PROVINCIALES (26 provinces de la RDC)
 * ------------------------------------------------------------------------*/
const RDC_PROVINCES = [
  { province: "Kinshasa",        direction: "Direction Provinciale de Kinshasa",         chefLieu: "Kinshasa" },
  { province: "Kongo Central",   direction: "Direction Provinciale du Kongo Central",    chefLieu: "Matadi" },
  { province: "Kwango",          direction: "Direction Provinciale du Kwango",           chefLieu: "Kenge" },
  { province: "Kwilu",           direction: "Direction Provinciale du Kwilu",            chefLieu: "Bandundu" },
  { province: "Mai-Ndombe",      direction: "Direction Provinciale du Mai-Ndombe",       chefLieu: "Inongo" },
  { province: "Kasaï",           direction: "Direction Provinciale du Kasaï",            chefLieu: "Tshikapa" },
  { province: "Kasaï Central",   direction: "Direction Provinciale du Kasaï Central",     chefLieu: "Kananga" },
  { province: "Kasaï Oriental",  direction: "Direction Provinciale du Kasaï Oriental",    chefLieu: "Mbuji-Mayi" },
  { province: "Lomami",          direction: "Direction Provinciale de la Lomami",        chefLieu: "Kabinda" },
  { province: "Sankuru",         direction: "Direction Provinciale du Sankuru",          chefLieu: "Lusambo" },
  { province: "Maniema",         direction: "Direction Provinciale du Maniema",          chefLieu: "Kindu" },
  { province: "Sud-Kivu",        direction: "Direction Provinciale du Sud-Kivu",         chefLieu: "Bukavu" },
  { province: "Nord-Kivu",       direction: "Direction Provinciale du Nord-Kivu",        chefLieu: "Goma" },
  { province: "Ituri",           direction: "Direction Provinciale de l'Ituri",          chefLieu: "Bunia" },
  { province: "Haut-Uélé",       direction: "Direction Provinciale du Haut-Uélé",        chefLieu: "Isiro" },
  { province: "Bas-Uélé",        direction: "Direction Provinciale du Bas-Uélé",         chefLieu: "Buta" },
  { province: "Tshopo",          direction: "Direction Provinciale du Tshopo",           chefLieu: "Kisangani" },
  { province: "Mongala",         direction: "Direction Provinciale de la Mongala",       chefLieu: "Lisala" },
  { province: "Nord-Ubangi",     direction: "Direction Provinciale du Nord-Ubangi",      chefLieu: "Gbadolite" },
  { province: "Sud-Ubangi",      direction: "Direction Provinciale du Sud-Ubangi",       chefLieu: "Gemena" },
  { province: "Équateur",        direction: "Direction Provinciale de l'Équateur",       chefLieu: "Mbandaka" },
  { province: "Tanganyika",      direction: "Direction Provinciale du Tanganyika",       chefLieu: "Kalemie" },
  { province: "Haut-Lomami",     direction: "Direction Provinciale du Haut-Lomami",      chefLieu: "Kamina" },
  { province: "Lualaba",         direction: "Direction Provinciale du Lualaba",          chefLieu: "Kolwezi" },
  { province: "Haut-Katanga",    direction: "Direction Provinciale du Haut-Katanga",     chefLieu: "Lubumbashi" },
  { province: "Tshuapa",         direction: "Direction Provinciale de la Tshuapa",       chefLieu: "Boende" }
];

/* --------------------------------------------------------------------------
 * 2) TEXTES DE RÉFÉRENCE (base légale évolutive)
 * ------------------------------------------------------------------------*/
const TEXTES_REFERENCE = [
  { id: "CT", label: "Loi n°015-2002 du 16 octobre 2002 portant Code du Travail (modifiée par l'Ordonnance-loi n°16/010 du 15 juillet 2016)" },
  { id: "AI-2023", label: "Arrêté interministériel n° CAB/MIN/ETPS/CNM/HMK/JBL/006/09/2023 et n° CAB/MIN/FINANCES/127/09/2023 du 03/10/2023 portant fixation des taux des droits, taxes et redevances" },
  { id: "AM-040-2013", label: "Arrêté ministériel n°40/CAB/MIN/ETPS/MBL/MMG/pkg/2013 du 09/04/2013 (horaire de travail)" },
  { id: "AM-SMIG", label: "Décret fixant le SMIG (Salaire Minimum Interprofessionnel Garanti)" }
];

/* --------------------------------------------------------------------------
 * 3) LES 65 INFRACTIONS
 * Champs : num, libelle, articles (article violé), sanction (texte),
 *          refSanction, montantFC (amende en FC selon Code), gravite,
 *          keywords (pour l'IA locale)
 * Gravité : "legere" | "moyenne" | "grave"
 * ------------------------------------------------------------------------*/
const INFRACTIONS_65 = [
  {num:1, libelle:"Non affichage de l'horaire du travail", articles:"Art. 119 et 222 CT ; Arrêté Min n°40/2013 Art. 3 et 4", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["horaire","affichage","119","222"]},
  {num:2, libelle:"Défaut de classification générale des emplois", articles:"Art. 90 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["classification","emploi","90"]},
  {num:3, libelle:"Contrat de travail non constaté par écrit, signé et visé par l'ONEM", articles:"Art. 44, 46, 47 et 212 CT", sanction:"Devient un CDI, Amende 20.000 FC", refSanction:"Art. 44 et 321 CT", montantFC:20000, gravite:"moyenne", keywords:["contrat","écrit","onem","44","cdi"]},
  {num:4, libelle:"Défaut du règlement intérieur de l'entreprise", articles:"Art. 157 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["règlement","intérieur","157"]},
  {num:5, libelle:"Défaut du SMIG", articles:"Art. 87 et 94-96 CT", sanction:"Sur proposition de l'IT, le Ministre peut ordonner la fermeture de l'entreprise jusqu'à régularisation. Salaires et avantages dus pendant cette période", refSanction:"Art. 318 et 321 CT", montantFC:20000, gravite:"grave", keywords:["smig","salaire minimum","87","94"]},
  {num:6, libelle:"Faire travailler les employés au-delà de 45 h/semaine sans rémunération des heures supplémentaires", articles:"Art. 119, 120 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["45 heures","heures supplémentaires","119","120","surcharge"]},
  {num:7, libelle:"Privation du jour de repos dans la semaine", articles:"Art. 121 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["repos","hebdomadaire","121"]},
  {num:8, libelle:"Faire travailler enfants et personnes handicapées la nuit / non-respect de leur repos", articles:"Art. 125, 126 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"grave", keywords:["enfants","handicapées","nuit","125","126"]},
  {num:9, libelle:"Violation des droits des femmes, enfants et personnes handicapées ; discrimination pour maternité ; test de grossesse à l'embauche", articles:"Art. 128 et 129 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"grave", keywords:["femmes","discrimination","grossesse","maternité","128","129"]},
  {num:10, libelle:"Employer des enfants de 15 à 17 ans sans autorisation de l'IT et de l'autorité parentale", articles:"Art. 133 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"grave", keywords:["enfants","mineurs","133","autorisation"]},
  {num:11, libelle:"Mauvaises conditions d'hygiène et sécurité", articles:"Art. 171 CT", sanction:"Mise en demeure par l'IT + Amende", refSanction:"Art. 171 CT", montantFC:20000, gravite:"grave", keywords:["hygiène","sécurité","171","conditions"]},
  {num:12, libelle:"Non-assurance d'un service médical aux employés", articles:"Art. 177 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["service médical","médical","177"]},
  {num:13, libelle:"Violation de la convention collective", articles:"Art. 320 CT", sanction:"Amende 7.500 FC", refSanction:"Art. 320 CT", montantFC:7500, gravite:"moyenne", keywords:["convention collective","320"]},
  {num:14, libelle:"Ne pas assurer la formation/perfectionnement des travailleurs via l'INPP", articles:"Art. 8 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["formation","inpp","8","perfectionnement"]},
  {num:15, libelle:"Recevoir des apprentis sans en avoir la qualité (+18 ans, bonnes mœurs, qualifié)", articles:"Art. 18 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["apprentis","18","qualité"]},
  {num:16, libelle:"Absence de contrat d'apprentissage écrit ou non conforme (max 4 ans)", articles:"Art. 19 et 20 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["apprentissage","contrat","19","20"]},
  {num:17, libelle:"Absence du contrat d'apprentissage ou non visé par l'ONEM", articles:"Art. 21 CT", sanction:"Devient contrat de travail, Amende 20.000 FC", refSanction:"Art. 21 et 312 CT", montantFC:20000, gravite:"legere", keywords:["apprentissage","onem","21"]},
  {num:18, libelle:"Non-rémunération de l'apprenti", articles:"Art. 25 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["apprenti","rémunération","25"]},
  {num:19, libelle:"L'apprenti qui n'exécute pas ses obligations", articles:"Art. 26 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["apprenti","obligations","26"]},
  {num:20, libelle:"Cessation du contrat d'apprentissage sans informer l'IT et l'ONEM", articles:"Art. 33 al.2 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["apprentissage","cessation","33","onem"]},
  {num:21, libelle:"Conclure un CDD avec un travailleur ayant dépassé 22 jours sur 2 mois (réputé CDI)", articles:"Art. 40 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["cdd","cdi","40","22 jours"]},
  {num:22, libelle:"Divulguer frauduleusement des secrets de fabrication/affaires ; concurrence déloyale", articles:"Art. 325 CT", sanction:"Amende 30.000 FC et/ou servitude pénale de 3 mois", refSanction:"Art. 325 CT", montantFC:30000, gravite:"grave", keywords:["secret","concurrence déloyale","325"]},
  {num:23, libelle:"Travailleur ne respectant pas les bonnes pratiques / sécurité / respect des collègues", articles:"Art. 51 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["bonnes pratiques","51","travailleur"]},
  {num:24, libelle:"Ne pas mettre à disposition des représentants un exemplaire du Code du travail à jour", articles:"Art. 55 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["code du travail","représentants","55"]},
  {num:25, libelle:"Ne pas supporter les frais de transport des travailleurs (résidence–lieu de travail)", articles:"Art. 56 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["transport","56","frais"]},
  {num:26, libelle:"Mettre fin à un contrat en cours de validité en violation de l'art. 60", articles:"Art. 60 CT", sanction:"Amendes", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["rupture","contrat","60","licenciement"]},
  {num:27, libelle:"Violation des prescriptions sur la durée du préavis (14 + 7 × nb d'années)", articles:"Art. 64, 65, 66 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["préavis","64","65","66"]},
  {num:28, libelle:"Procéder à des licenciements massifs en violant l'art. 78", articles:"Art. 78 CT", sanction:"Amendes", refSanction:"Art. 321 CT", montantFC:20000, gravite:"grave", keywords:["licenciement massif","78"]},
  {num:29, libelle:"Non-remise de l'attestation de services rendus 2 jours après la fin du contrat", articles:"Art. 79 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["attestation","services rendus","79"]},
  {num:30, libelle:"L'entrepreneur qui n'affiche pas / ne met pas à jour la liste de ses sous-entreprises", articles:"Art. 84 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["sous-entreprises","84","liste"]},
  {num:31, libelle:"Non-rémunération en monnaie légale RDC selon la classification des emplois", articles:"Art. 89 et 90 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["monnaie","rémunération","89","90"]},
  {num:32, libelle:"Payer la rémunération hors prescriptions (heures, dates, lieu)", articles:"Art. 98, 99, 100, 101 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["paiement","rémunération","98","99","100","101"]},
  {num:33, libelle:"Paiement de rémunération sans décompte écrit", articles:"Art. 103 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["décompte","103","bulletin"]},
  {num:34, libelle:"Employeur s'attribuant le droit d'infliger amendes/réductions sur rémunérations", articles:"Art. 111, 112 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["amende","retenue","111","112"]},
  {num:35, libelle:"Violer les conditions des économats", articles:"Art. 116 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["économat","116","denrées"]},
  {num:36, libelle:"Discriminer femmes/personnes handicapées ; faire travailler enfants/femmes/handicapés au-delà de leur capacité", articles:"Art. 136 et 137 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"grave", keywords:["discrimination","136","137","capacité"]},
  {num:37, libelle:"Défaut de logement décent ou d'indemnité de logement (engagement hors lieu d'emploi)", articles:"Art. 138 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["logement","indemnité","138"]},
  {num:38, libelle:"Défaut de planning de congés annuels et violation des prescriptions y afférentes", articles:"Art. 140-146 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["congé","planning","140","146"]},
  {num:39, libelle:"Défaut de supporter les frais de transport A/R de l'employé et sa famille (début/fin de contrat)", articles:"Art. 147-156 CT", sanction:"Amende 20.000 FC — l'IT peut saisir le Tribunal du travail (Art. 152)", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["transport","famille","147","152","156"]},
  {num:40, libelle:"Absence d'un comité d'hygiène et sécurité", articles:"Art. 167 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["comité","hygiène","sécurité","167"]},
  {num:41, libelle:"Défaut de signaler les accidents/maladies du travail à la CNSS et à l'IT", articles:"Art. 176 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"grave", keywords:["accident","cnss","176","maladie"]},
  {num:42, libelle:"Défaut d'une convention médicale viable", articles:"Art. 177 et 178 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["convention médicale","177","178"]},
  {num:43, libelle:"Défaut de tenir un livre de paie à jour", articles:"Art. 213-216 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["livre de paie","213","216","registre"]},
  {num:44, libelle:"Défaut de déclarer le mouvement du personnel à l'ONEM et au Ministère de l'ETPS", articles:"Art. 217 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["mouvement","personnel","onem","217","déclaration"]},
  {num:45, libelle:"Défaut de déclaration de la main-d'œuvre nationale/étrangère et du bilan social", articles:"Art. 218 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["main d'œuvre","bilan social","218","déclaration"]},
  {num:46, libelle:"Ouverture d'un secrétariat social sans caution / sans autorisation du Ministre", articles:"Art. 221 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["secrétariat social","221","caution"]},
  {num:47, libelle:"Priver l'employé membre du Conseil National du Travail du temps de réunion", articles:"Art. 229 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["conseil national","229","réunion"]},
  {num:48, libelle:"Subordonner l'emploi ou licencier pour affiliation à une organisation syndicale", articles:"Art. 234 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"grave", keywords:["syndicat","affiliation","234","discrimination syndicale"]},
  {num:49, libelle:"Licencier un délégué syndical sans l'approbation de l'IT", articles:"Art. 258 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"grave", keywords:["délégué syndical","258","licenciement"]},
  {num:50, libelle:"Non-octroi d'un minimum de 15 h/mois aux représentants des travailleurs", articles:"Art. 265 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["représentants","15 heures","265"]},
  {num:51, libelle:"Ne pas accorder aux membres du comité de représentants le congé pour stage", articles:"Art. 268 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["congé stage","268","représentants"]},
  {num:52, libelle:"Privation d'un congé d'éducation ouvrière", articles:"Art. 269 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["éducation ouvrière","269","congé"]},
  {num:53, libelle:"Non-respect des jours fériés légaux", articles:"Art. 123 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["jours fériés","123"]},
  {num:54, libelle:"Contrat exécuté sans certificat médical d'aptitude", articles:"Art. 38 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["certificat médical","aptitude","38"]},
  {num:55, libelle:"Violence, menace, promesses mensongères ou manœuvres frauduleuses (engagement / cessation collective / entrave au travail)", articles:"Art. 323 CT", sanction:"Amende 25.000 FC et/ou servitude pénale d'un mois", refSanction:"Art. 323 CT", montantFC:25000, gravite:"grave", keywords:["violence","menace","fraude","323"]},
  {num:56, libelle:"Violation des prescriptions légales sur la suspension du contrat de travail", articles:"Art. 57 et 58 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["suspension","57","58","contrat"]},
  {num:57, libelle:"Excéder les heures de travail de nuit et ne pas les payer en majoration", articles:"Art. 124 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["nuit","majoration","124","heures"]},
  {num:58, libelle:"Violation des prescriptions sur le logement et la restauration des travailleurs", articles:"Art. 139 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["logement","restauration","139"]},
  {num:59, libelle:"Défaut du règlement d'entreprise", articles:"Art. 158 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"legere", keywords:["règlement d'entreprise","158"]},
  {num:60, libelle:"Défaut d'organisation du comité d'hygiène et sécurité", articles:"Art. 169 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["comité hygiène","169","organisation"]},
  {num:61, libelle:"Ne pas répondre jusqu'à la 3e invitation de l'IT (litige individuel / conflit de travail)", articles:"Art. 321 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["invitation","convocation","321","litige"]},
  {num:62, libelle:"Faire obstacle à l'exercice des fonctions des inspecteurs/contrôleurs du travail et de la commission de médiation", articles:"Art. 322 CT", sanction:"Amende 30.000 FC + peine de servitude pénale de 30 jours", refSanction:"Art. 322 CT", montantFC:30000, gravite:"grave", keywords:["obstruction","obstacle","322","entrave","refus de contrôle"]},
  {num:63, libelle:"Inciter au refus d'obligations / détruire ou altérer frauduleusement un contrat / infraction à la protection de la main-d'œuvre nationale", articles:"Art. 323 CT", sanction:"Amende 25.000 FC et/ou servitude pénale d'un mois", refSanction:"Art. 323 CT", montantFC:25000, gravite:"grave", keywords:["incitation","destruction contrat","main d'œuvre nationale","323"]},
  {num:64, libelle:"Atteinte à la libre désignation/exercice des représentants ; rétention du cautionnement des travailleurs", articles:"Art. 324 CT", sanction:"Amende 25.000 FC et/ou servitude pénale de 2 mois", refSanction:"Art. 324 CT", montantFC:25000, gravite:"grave", keywords:["représentants","cautionnement","324"]},
  {num:65, libelle:"Priver l'employé du décompte final / de la rémunération restante après 2 jours de la fin du contrat", articles:"Art. 100-104 CT", sanction:"Amende 20.000 FC", refSanction:"Art. 321 CT", montantFC:20000, gravite:"moyenne", keywords:["décompte final","100","104","rémunération"]}
];

/* --------------------------------------------------------------------------
 * 4) TYPES DE PV (architecture extensible : ajout de modèles sans refonte)
 * ------------------------------------------------------------------------*/
const TYPES_PV = [
  { id: "constat-infraction",  nom: "Procès-verbal de constat d'infraction",      icon: "📋", hasNumero: true,  hasTableau: true,  hasSignatures: ["Verbalisateur","Contrevenant"] },
  { id: "constat-obstruction", nom: "Procès-verbal de constat d'obstruction",     icon: "🚫", hasNumero: true,  hasTableau: false, hasSignatures: ["Inspecteur","Contrevenant"] },
  { id: "non-conciliation",    nom: "Procès-verbal de non-conciliation",          icon: "⚖️", hasNumero: true,  hasTableau: false, hasSignatures: ["Demandeur","Défendeur","Inspecteur"] },
  { id: "mise-en-demeure",     nom: "Mise en demeure",                            icon: "📨", hasNumero: true,  hasTableau: false, hasSignatures: ["OPJ"] }
];

/* Exposition globale (mode navigateur, hors ligne) */
if (typeof window !== "undefined") {
  window.LEGAL_DB = { RDC_PROVINCES, TEXTES_REFERENCE, INFRACTIONS_65, TYPES_PV };
}
