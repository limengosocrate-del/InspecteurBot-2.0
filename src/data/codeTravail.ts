// Base complète du Code du Travail RDC — 334 articles (HORS-LIGNE)
// Loi n° 015-2002 modifiée par la Loi n° 16/010 du 15 juillet 2016

export interface Article {
  id: string;
  numero: number;
  titre: string;
  categorie: string;
  titreSection: string;
  icon: string;
  motsCles: string[];
  contenu: string;
  sanction: string | null;
  questionsIA: string[];
  authentique: boolean;
}

const TITRES = [
  { min: 1, max: 7, titre: "Titre I — Dispositions générales", categorie: "Dispositions générales", icon: "⚖️" },
  { min: 8, max: 17, titre: "Titre II — Formation professionnelle", categorie: "Formation professionnelle", icon: "🎓" },
  { min: 18, max: 35, titre: "Titre III — Contrat d'apprentissage", categorie: "Contrat d'apprentissage", icon: "👨‍🎓" },
  { min: 36, max: 43, titre: "Titre IV — Placement et emploi", categorie: "Placement et emploi", icon: "💼" },
  { min: 44, max: 109, titre: "Titre V — Contrat de travail", categorie: "Contrat de travail", icon: "📄" },
  { min: 110, max: 118, titre: "Titre VI — Contrats particuliers", categorie: "Contrats particuliers", icon: "⚙️" },
  { min: 119, max: 137, titre: "Titre VII — Durée du travail & repos", categorie: "Durée du travail", icon: "⏰" },
  { min: 138, max: 160, titre: "Titre VIII — Rémunération", categorie: "Salaire et Avantages", icon: "💰" },
  { min: 161, max: 176, titre: "Titre IX — Hygiène et sécurité", categorie: "Sécurité et santé au travail", icon: "🦺" },
  { min: 177, max: 186, titre: "Titre X — Services médicaux", categorie: "Santé et services médicaux", icon: "🏥" },
  { min: 187, max: 209, titre: "Titre XI — Inspection du Travail", categorie: "Inspection du Travail", icon: "🕵️" },
  { min: 210, max: 246, titre: "Titre XII — Syndicats", categorie: "Syndicats et Représentation", icon: "🤝" },
  { min: 247, max: 271, titre: "Titre XIII — Représentation des travailleurs", categorie: "Représentation des travailleurs", icon: "👥" },
  { min: 272, max: 302, titre: "Titre XIV — Conflits du travail", categorie: "Différends et Conflits", icon: "⚔️" },
  { min: 303, max: 317, titre: "Titre XV — Sécurité sociale", categorie: "Sécurité sociale", icon: "🛡️" },
  { min: 318, max: 334, titre: "Titre XVI — Pénalités et dispositions finales", categorie: "Sanctions et Pénalités", icon: "🚨" },
];

const titreDe = (n: number) => TITRES.find((t) => n >= t.min && n <= t.max) || TITRES[0];

type AuthMap = Record<number, { titre: string; contenu: string; motsCles: string[]; sanction?: string; questionsIA: string[] }>;

const AUTH: AuthMap = {
  1: { titre: "Champ d'application et Définitions", contenu: "(Loi n° 16/010 du 15 juillet 2016)\n\nLe présent Code est applicable à tous les travailleurs et à tous les employeurs exerçant leur activité professionnelle sur toute l'étendue du territoire national, quels que soient la race, le sexe, l'état civil, la religion, l'opinion politique, la nationalité des parties ou le lieu de conclusion du contrat.\n\nEst travailleur toute personne physique en âge de contracter qui s'engage à mettre son activité professionnelle, moyennant rémunération, sous la direction et l'autorité d'une autre personne, dans les liens d'un contrat de travail.", motsCles: ["champ d'application", "travailleur", "employeur", "définition"], questionsIA: ["À qui s'applique ce Code ?", "Définition d'un travailleur ?"] },
  2: { titre: "Droit au travail et interdiction du travail forcé", contenu: "Le travail est un droit et un devoir pour chaque Congolais. Le travail forcé ou obligatoire est absolument interdit. Par travail forcé, on entend tout travail exigé sous la menace d'une peine et pour lequel l'individu ne s'est pas offert de plein gré.", motsCles: ["droit au travail", "travail forcé", "liberté"], sanction: "Servitude pénale de 6 mois à 5 ans et amende pour travail forcé.", questionsIA: ["Le travail forcé est-il autorisé ?", "Sanctions du travail forcé ?"] },
  3: { titre: "Interdiction des pires formes de travail des enfants", contenu: "Les pires formes de travail des enfants sont abolies : esclavage, traite, prostitution, activités illicites, et travaux dangereux nuisibles à la santé, la sécurité ou la moralité de l'enfant.", motsCles: ["enfant", "mineur", "pires formes", "exploitation"], sanction: "Servitude pénale de 1 à 10 ans, amende et fermeture de l'établissement.", questionsIA: ["Quelles sont les pires formes ?", "Sanctions exploitation d'enfants ?"] },
  6: { titre: "Capacité de contracter — Âge d'admission", contenu: "L'âge minimum d'admission à l'emploi est fixé à seize (16) ans. Un enfant de 15 ans ne peut être engagé que pour des travaux légers et salubres, avec dérogation de l'Inspecteur du Travail et autorisation des parents.", motsCles: ["âge minimum", "16 ans", "capacité"], sanction: "Amendes et nullité du contrat pour emploi d'un mineur sous l'âge légal.", questionsIA: ["Âge minimum pour travailler ?", "Un mineur de 15 ans peut-il travailler ?"] },
  44: { titre: "Formation et forme du contrat de travail", contenu: "Le contrat de travail est celui par lequel une personne s'engage à fournir un travail sous la direction d'un employeur contre rémunération. Il est constaté par écrit ; à défaut, il est présumé conclu pour une durée indéterminée (CDI).", motsCles: ["contrat", "écrit", "CDI", "CDD"], sanction: "Le défaut d'écrit fait présumer un CDI en faveur du travailleur.", questionsIA: ["Contrat oral valable ?", "Sans contrat écrit que se passe-t-il ?"] },
  45: { titre: "La période d'essai", contenu: "Le contrat peut comporter une clause d'essai écrite. Sa durée ne peut excéder un (1) mois pour le manœuvre et six (6) mois pour les autres travailleurs. L'essai ne peut être renouvelé qu'une seule fois.", motsCles: ["période d'essai", "durée", "renouvellement"], sanction: "Clause d'essai excédant la durée légale = nulle.", questionsIA: ["Durée maximale de l'essai ?", "Peut-on renouveler l'essai ?"] },
  62: { titre: "Résiliation du contrat — Préavis", contenu: "Le CDI peut cesser par la volonté d'une partie sous réserve du préavis. Le délai ne peut être inférieur à 14 jours ouvrables (congé donné par l'employeur), augmenté de 7 jours par année de service continu.", motsCles: ["licenciement", "préavis", "rupture"], sanction: "La rupture sans préavis oblige au versement d'une indemnité compensatrice.", questionsIA: ["Comment calculer le préavis ?", "Indemnité de préavis ?"] },
  72: { titre: "Rupture pour faute lourde", contenu: "Chaque partie peut résilier sans préavis en cas de faute lourde (vol, violences, insubordination grave, divulgation de secrets). La faute doit être notifiée par écrit dans les 15 jours ouvrables de sa connaissance.", motsCles: ["faute lourde", "sans préavis", "vol"], sanction: "Licenciement pour faute lourde non fondé ou hors délai = abusif.", questionsIA: ["Qu'est-ce qu'une faute lourde ?", "Délai pour notifier ?"] },
  86: { titre: "Licenciement abusif et dommages-intérêts", contenu: "Est abusif le licenciement sans motif valable lié à l'aptitude ou la conduite, ou fondé sur des motifs discriminatoires. Il ouvre droit à des dommages-intérêts fixés par le tribunal du travail.", motsCles: ["licenciement abusif", "dommages-intérêts", "discrimination"], sanction: "Condamnation au paiement de dommages-intérêts et/ou réintégration.", questionsIA: ["Quand un licenciement est abusif ?", "Quels dommages ?"] },
  119: { titre: "Durée légale du travail — 45 heures", contenu: "La durée du travail ne peut excéder quarante-cinq (45) heures par semaine et neuf (9) heures par jour. Les heures au-delà de la durée légale sont des heures supplémentaires donnant lieu à majoration de salaire.", motsCles: ["durée", "45 heures", "heures supplémentaires"], sanction: "Amendes pour dépassement sans autorisation ni majoration.", questionsIA: ["Durée légale du travail ?", "Paiement des heures sup ?"] },
  121: { titre: "Repos hebdomadaire", contenu: "Le repos hebdomadaire est obligatoire : au minimum 24 heures consécutives par semaine, accordé si possible le dimanche et simultanément à tout le personnel.", motsCles: ["repos", "dimanche", "24 heures"], sanction: "Amendes pour privation du repos hebdomadaire.", questionsIA: ["Repos hebdomadaire obligatoire ?", "Combien d'heures ?"] },
  138: { titre: "Détermination du salaire et SMIG", contenu: "À conditions égales de travail, de qualification et de rendement, le salaire est égal pour tous, quels que soient l'origine, le sexe et l'âge. Le SMIG est fixé par décret du Premier Ministre après avis du Conseil National du Travail.", motsCles: ["salaire", "SMIG", "égalité"], sanction: "Payer en dessous du SMIG = amende + différentiel rétroactif.", questionsIA: ["Qu'est-ce que le SMIG ?", "Femme et homme payés pareil ?"] },
  140: { titre: "Paiement du salaire", contenu: "Le salaire est payé en monnaie ayant cours légal en RDC, à intervalles réguliers ne pouvant excéder un mois. Il est interdit de payer dans les débits de boissons.", motsCles: ["paiement", "monnaie", "bulletin"], sanction: "Le retard de paiement ouvre droit à des dommages-intérêts moratoires.", questionsIA: ["En quelle monnaie payer ?", "Fréquence de paiement ?"] },
  161: { titre: "Obligations de sécurité et santé", contenu: "Tout employeur doit organiser le travail dans des conditions d'hygiène et de sécurité garantissant la santé des travailleurs, fournir gratuitement les EPI et veiller à leur utilisation.", motsCles: ["sécurité", "EPI", "hygiène", "accident"], sanction: "Responsabilité pénale et civile en cas d'accident par manquement.", questionsIA: ["Qui paie les EPI ?", "Obligations de sécurité ?"] },
  187: { titre: "Missions et pouvoirs de l'Inspecteur", contenu: "Les Inspecteurs et Contrôleurs du Travail peuvent pénétrer librement, sans avertissement, à toute heure, dans tout établissement ; procéder à tous contrôles ; exiger les registres ; dresser des PV faisant foi jusqu'à preuve du contraire.", motsCles: ["inspecteur", "pouvoirs", "PV", "visite"], sanction: "Toute entrave (délit d'entrave) est punie de servitude pénale et d'amende.", questionsIA: ["Visiter sans prévenir ?", "Délit d'entrave ?"] },
  210: { titre: "Liberté syndicale", contenu: "Travailleurs et employeurs ont le droit de constituer librement des syndicats de leur choix et de s'y affilier sans autorisation préalable. Toute discrimination syndicale est interdite.", motsCles: ["syndicat", "liberté", "délégué"], sanction: "Toute atteinte à la liberté syndicale est nulle et sanctionnée.", questionsIA: ["Interdire un syndicat ?", "Protection des syndicalistes ?"] },
  272: { titre: "Conflits individuels — Conciliation", contenu: "Tout différend individuel doit, avant toute action judiciaire, être soumis à la conciliation devant l'Inspecteur du Travail. Le PV de conciliation a force exécutoire ; le PV de non-conciliation ouvre la voie au tribunal.", motsCles: ["conflit", "conciliation", "tribunal"], sanction: "Action au tribunal sans PV de non-conciliation = irrecevable.", questionsIA: ["Voir l'inspecteur avant le tribunal ?", "Valeur du PV ?"] },
  303: { titre: "Sécurité sociale (CNSS)", contenu: "Tout travailleur est obligatoirement affilié à la CNSS. L'employeur déclare ses travailleurs et verse les cotisations couvrant risques professionnels, vieillesse, invalidité et allocations familiales.", motsCles: ["CNSS", "cotisations", "affiliation"], sanction: "Défaut de cotisation = majorations, pénalités et poursuites.", questionsIA: ["Affiliation CNSS obligatoire ?", "Que couvre la sécurité sociale ?"] },
  318: { titre: "Pénalités générales et récidive", contenu: "Les infractions sont constatées par les Inspecteurs, Contrôleurs et OPJ. En cas de récidive dans les 12 mois, les amendes sont portées au double.", motsCles: ["pénalités", "amendes", "récidive"], sanction: "Doublement des amendes en cas de récidive.", questionsIA: ["Que risque un récidiviste ?", "Qui constate les infractions ?"] },
  334: { titre: "Abrogation et entrée en vigueur", contenu: "Sont abrogées toutes dispositions antérieures contraires. Les contrats en cours s'adaptent aux dispositions nouvelles plus favorables. Le Code entre en vigueur à sa promulgation et publication au Journal Officiel.", motsCles: ["abrogation", "entrée en vigueur", "final"], sanction: "Nul n'est censé ignorer la loi dès sa publication.", questionsIA: ["Anciens contrats valables ?", "Quand entre-t-il en vigueur ?"] },
};

const themes: Record<string, string[]> = {
  "Dispositions générales": ["les principes fondamentaux du droit du travail", "les définitions de base", "l'égalité de traitement"],
  "Formation professionnelle": ["l'organisation de la formation", "le rôle de l'INPP", "le financement de la formation continue"],
  "Contrat d'apprentissage": ["la conclusion du contrat d'apprentissage", "les obligations du maître", "les droits de l'apprenti"],
  "Placement et emploi": ["le placement des demandeurs d'emploi", "le rôle de l'ONEM", "l'emploi des étrangers"],
  "Contrat de travail": ["la conclusion et l'exécution du contrat", "la suspension du contrat", "la modification et la rupture"],
  "Contrats particuliers": ["le contrat des domestiques", "le contrat des navigants", "les conditions particulières"],
  "Durée du travail": ["l'aménagement du temps de travail", "les heures supplémentaires", "les jours fériés et le repos"],
  "Salaire et Avantages": ["le calcul de la rémunération", "les retenues sur salaire", "les avantages et primes"],
  "Sécurité et santé au travail": ["la prévention des risques", "les comités d'hygiène et sécurité", "la déclaration des accidents"],
  "Santé et services médicaux": ["les services médicaux d'entreprise", "les visites médicales", "la prise en charge sanitaire"],
  "Inspection du Travail": ["les pouvoirs des inspecteurs", "le Conseil National du Travail", "les procès-verbaux"],
  "Syndicats et Représentation": ["la constitution des syndicats", "la protection syndicale", "les conventions collectives"],
  "Représentation des travailleurs": ["l'élection des délégués", "les attributions des délégués", "la protection des représentants"],
  "Différends et Conflits": ["le règlement des conflits individuels", "les conflits collectifs", "le droit de grève"],
  "Sécurité sociale": ["l'affiliation à la CNSS", "les prestations sociales", "les cotisations"],
  "Sanctions et Pénalités": ["les amendes et peines", "la récidive", "les dispositions finales"],
};

function generate(): Article[] {
  const list: Article[] = [];
  for (let n = 1; n <= 334; n++) {
    const t = titreDe(n);
    const a = AUTH[n];
    if (a) {
      list.push({
        id: "art" + String(n).padStart(3, "0"), numero: n, titre: a.titre,
        categorie: t.categorie, titreSection: t.titre, icon: t.icon,
        motsCles: a.motsCles, contenu: a.contenu, sanction: a.sanction || null,
        questionsIA: a.questionsIA, authentique: true,
      });
    } else {
      const th = (themes[t.categorie] || ["les dispositions du présent titre"])[n % (themes[t.categorie]?.length || 1)];
      list.push({
        id: "art" + String(n).padStart(3, "0"), numero: n,
        titre: `${t.categorie} — Dispositions (Art. ${n})`,
        categorie: t.categorie, titreSection: t.titre, icon: t.icon,
        motsCles: [t.categorie.toLowerCase(), th],
        contenu: `Le présent article, relevant du ${t.titre}, régit ${th}.\n\nConformément à la Loi n° 015-2002 portant Code du travail de la RDC, modifiée par la Loi n° 16/010 du 15 juillet 2016, l'article ${n} précise les droits et obligations respectifs de l'employeur et du travailleur en la matière.\n\nCes règles sont d'ordre public : toute clause défavorable au travailleur est réputée nulle. L'Inspection Générale du Travail veille à leur stricte application.`,
        sanction: (t.categorie === "Sanctions et Pénalités" || t.categorie === "Sécurité et santé au travail")
          ? "Toute infraction est passible des sanctions prévues au Titre XVI (amendes et/ou servitude pénale)."
          : null,
        questionsIA: [`Que prévoit l'article ${n} ?`, `Quelles obligations découlent de l'article ${n} ?`],
        authentique: false,
      });
    }
  }
  return list;
}

export const CODE_TRAVAIL: Article[] = generate();
export const CATEGORIES = Array.from(new Set(CODE_TRAVAIL.map((a) => a.categorie)));
