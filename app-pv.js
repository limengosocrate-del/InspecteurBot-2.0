(() => {
  'use strict';

  const STORAGE_KEY = 'inspecteurbot_pv_rdc_v1';
  const THEME_KEY = 'inspecteurbot_pv_theme';
  const LOGO_KEY = 'inspecteurbot_logo_igt';
  const APP_VERSION = '1.0.0-local';

  const PROVINCES = [
    'Administration centrale', 'Bas-Uélé', 'Équateur', 'Haut-Katanga', 'Haut-Lomami', 'Haut-Uélé', 'Ituri', 'Kasaï', 'Kasaï-Central', 'Kasaï-Oriental', 'Kinshasa', 'Kongo Central', 'Kwango', 'Kwilu', 'Lomami', 'Lualaba', 'Maï-Ndombe', 'Maniema', 'Mongala', 'Nord-Kivu', 'Nord-Ubangi', 'Sankuru', 'Sud-Kivu', 'Sud-Ubangi', 'Tanganyika', 'Tshopo', 'Tshuapa'
  ];

  const DIRECTIONS = PROVINCES.map((province) => ({
    province,
    code: province === 'Administration centrale' ? 'ADMC' : province.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5),
    name: province === 'Administration centrale' ? 'Administration Centrale' : `Direction Provinciale de ${province}`
  }));

  const SECTEURS = [
    'Agro-pastoral', 'Agriculture', 'Élevage', 'Plantation', 'Pêche', 'Exploitation forestière', 'Recherche fondamentale', 'Forage de puits filtrants',
    'Construction / génie civil', 'Construction métallique', 'Bâtiment et travaux publics', 'Énergie', 'Électricité', 'Eau', 'Gaz',
    'Transports et communications', 'Télécommunications', 'Commerce général', 'Import-export', 'Secteur bancaire', 'Institution financière', 'Assurance',
    'Services de santé', 'Éducation', 'Cabinet d’audit', 'Conseil juridique', 'Restaurant', 'Hôtellerie', 'Tourisme', 'Douane / agence en douane',
    'Industrie manufacturière', 'Agro-industrie', 'Industrie alimentaire', 'Industrie brassicole', 'Industrie pharmaceutique', 'Industrie de bois / scierie',
    'Industrie métallurgique', 'Industrie sidérurgique', 'Industrie minière', 'Prospection minière', 'Recherche minière', 'Laboratoire minier', 'Développement d’infrastructures minières',
    'Comptoir d’achat et vente de minerais', 'Taille / fonderie / traitement de minerais', 'Diamant et pierres de couleur', 'Activité pétrolière', 'Exploration pétrolière', 'Raffinage pétrolier',
    'Jeux d’argent / casino / loisirs', 'Sécurité et gardiennage', 'ONG / ASBL', 'Administration publique', 'Prestation de services', 'Sous-traitance', 'Placement de main-d’œuvre', 'Autre'
  ];

  const DOCUMENT_TYPES = [
    { id: 'pv-infraction', label: 'Procès-verbal de constat d’infraction', short: 'PV Infraction', needsInfractions: true },
    { id: 'pv-obstruction', label: 'Procès-verbal d’obstruction', short: 'PV Obstruction', needsInfractions: false },
    { id: 'pv-non-conciliation', label: 'Procès-verbal de non-conciliation', short: 'PV Non-conciliation', needsInfractions: false },
    { id: 'mise-demeure', label: 'Mise en demeure', short: 'Mise en demeure', needsInfractions: false },
    { id: 'pv-installation-cshe', label: 'PV d’installation du Comité de Sécurité, d’Hygiène et d’Embellissement', short: 'PV Installation CSHE', needsInfractions: false }
  ];

  const RESERVE_PV_MODELS = [
  {
    "id": "MOD-001",
    "docType": "pv-infraction",
    "title": "Constat général de documents sociaux manquants",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Avons effectué une mission officielle de contrôle au sein de [ENTREPRISE]. Après vérification des pièces sollicitées, avons constaté l’absence ou l’irrégularité de documents sociaux obligatoires. Les infractions retenues sont portées au tableau ci-dessous, sans préjudice de l’obligation pour l’employeur de régulariser sa situation dans un bref délai. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-002",
    "docType": "pv-infraction",
    "title": "Constat d’absence de contrats de travail",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Au cours du contrôle, il a été relevé que plusieurs travailleurs prestent sans contrat écrit, signé et/ou visé conformément aux prescriptions légales. Cette situation expose l’entreprise aux amendes transactionnelles et à l’obligation de régularisation immédiate. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-003",
    "docType": "pv-infraction",
    "title": "Constat d’absence de déclarations ONEM/main-d’œuvre",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Après examen des documents produits, l’entreprise n’a pas justifié les déclarations relatives au mouvement du personnel, à la situation de la main-d’œuvre nationale et étrangère ainsi qu’au bilan social. Les faits sont constatés à sa charge. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-004",
    "docType": "pv-infraction",
    "title": "Constat relatif au SMIG et à la rémunération",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Les vérifications opérées sur les éléments de paie font apparaître une rémunération non conforme aux prescriptions applicables relatives au SMIG et/ou aux modalités de paiement. Les infractions correspondantes sont retenues au tableau. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-005",
    "docType": "pv-infraction",
    "title": "Constat d’absence d’horaire, règlement et classification",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. L’entreprise n’a pas présenté l’horaire de travail visé, le règlement d’entreprise conforme et/ou la classification générale des emplois. Ces manquements constituent des violations des textes cités dans le tableau des contraventions. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-006",
    "docType": "pv-infraction",
    "title": "Constat santé, sécurité et convention médicale",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Il a été constaté l’absence ou l’insuffisance des dispositifs relatifs à la santé, l’hygiène et la sécurité, notamment comité compétent, convention médicale ou preuve de service médical. L’entreprise demeure tenue de se conformer aux prescriptions légales. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-007",
    "docType": "pv-infraction",
    "title": "Constat d’absence de preuves CNSS-INPP-ONEM",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. L’employeur n’a pas présenté les preuves de paiement ou de conformité auprès des organismes compétents. Les manquements sont actés au présent procès-verbal et les amendes sont calculées suivant la base intégrée. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-008",
    "docType": "pv-infraction",
    "title": "Constat de travail de nuit/heures supplémentaires",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Les faits relevés démontrent un dépassement de la durée du travail, un recours au travail de nuit ou aux heures supplémentaires sans respect des majorations et repos prévus. Les violations sont reprises ci-dessous. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-009",
    "docType": "pv-infraction",
    "title": "Constat de manquements envers les représentants des travailleurs",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Le contrôle révèle des entraves ou omissions concernant les représentants des travailleurs, leurs moyens, leurs heures légales ou documents mis à leur disposition. Les dispositions violées sont reprises dans le tableau. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-010",
    "docType": "pv-infraction",
    "title": "Constat de pluralité d’infractions administratives",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. En présence du responsable de l’entreprise, plusieurs irrégularités administratives et sociales ont été relevées. Les contraventions ci-dessous sont mises à charge de l’entreprise conformément au Code du Travail et aux textes d’application. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-011",
    "docType": "pv-obstruction",
    "title": "Obstruction par refus d’accès aux locaux",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Nous nous sommes présenté pour exécuter la mission officielle de contrôle, mais l’accès aux locaux de [ENTREPRISE] nous a été refusé. Cette impossibilité d’accomplir la mission légale est actée comme obstruction conformément à l’article 322 du Code du Travail. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-012",
    "docType": "pv-obstruction",
    "title": "Obstruction par refus de produire les documents",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Malgré la demande régulière de production des documents sociaux et administratifs, le responsable présent n’a pas fourni les pièces nécessaires au contrôle. Ce comportement empêche l’exercice normal des fonctions de l’Inspection du Travail. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-013",
    "docType": "pv-obstruction",
    "title": "Obstruction par absence organisée du responsable",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Après convocation et fixation de la visite, le responsable habilité s’est abstenu de recevoir la mission et n’a désigné aucun préposé capable de présenter les documents. Le présent PV constate l’obstruction. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-014",
    "docType": "pv-obstruction",
    "title": "Obstruction par fermeture ou évacuation des lieux",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Lors de la mission, il a été constaté une fermeture, évacuation ou interruption volontaire ayant empêché l’accès aux travailleurs et aux documents. Les faits sont repris comme obstacle à l’exercice des fonctions de contrôle. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-015",
    "docType": "pv-obstruction",
    "title": "Obstruction après mise en demeure restée sans suite",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. La mise en demeure précédemment adressée à l’entreprise étant restée sans suite, et la mission n’ayant toujours pas été reçue, le présent procès-verbal constate l’obstruction persistante. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-016",
    "docType": "pv-obstruction",
    "title": "Obstruction par intimidation ou propos menaçants",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. La mission de contrôle a été empêchée par des propos, actes d’intimidation ou comportements incompatibles avec l’exercice paisible des fonctions d’inspection. Les faits sont actés sans préjudice des suites judiciaires. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-017",
    "docType": "pv-obstruction",
    "title": "Obstruction par refus de communiquer avec les travailleurs",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Le responsable présent a empêché ou limité l’entretien avec les travailleurs, rendant impossible la vérification contradictoire des conditions de travail. Ce refus constitue un obstacle à la mission. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-018",
    "docType": "pv-obstruction",
    "title": "Obstruction par remise de documents manifestement incomplets",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Les documents remis étaient manifestement incomplets ou volontairement insuffisants pour permettre le contrôle. Malgré demande de complément, l’entreprise n’a pas permis l’accomplissement normal de la mission. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-019",
    "docType": "pv-obstruction",
    "title": "Obstruction à une inspection spéciale",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Dans le cadre d’une inspection spéciale ordonnée par l’autorité compétente, l’entreprise n’a pas permis l’exécution des vérifications demandées. Les faits sont constatés au présent PV d’obstruction. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-020",
    "docType": "pv-obstruction",
    "title": "Obstruction par refus réitéré de recevoir la mission",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Après plusieurs tentatives de contact et passages, l’entreprise a réitéré son refus de recevoir l’Inspecteur ou le Contrôleur du Travail. En foi de quoi, le présent PV est dressé en ampliations légales. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-021",
    "docType": "pv-non-conciliation",
    "title": "Non-conciliation pour licenciement contesté",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Après audition du demandeur et de la défenderesse, il ressort que les parties demeurent opposées sur la régularité du licenciement. Malgré la proposition de conciliation, aucun accord n’a été trouvé. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-022",
    "docType": "pv-non-conciliation",
    "title": "Non-conciliation pour arriérés de salaire",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Le litige porte sur le paiement des arriérés de salaire et avantages dus. Les parties ont été entendues contradictoirement, mais elles ne sont pas parvenues à concilier leurs positions. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-023",
    "docType": "pv-non-conciliation",
    "title": "Non-conciliation pour décompte final",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Le demandeur sollicite le paiement du décompte final et des droits liés à la cessation du contrat. L’employeur conteste tout ou partie de la réclamation. La tentative de conciliation n’a pas abouti. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-024",
    "docType": "pv-non-conciliation",
    "title": "Non-conciliation pour rupture de contrat pendant l’essai",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Les parties divergent sur la qualification et les effets de la rupture intervenue pendant ou après la période d’essai. Les pièces versées n’ont pas permis d’obtenir un accord amiable. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-025",
    "docType": "pv-non-conciliation",
    "title": "Non-conciliation pour mutation ou affectation contestée",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Le demandeur conteste les conditions de mutation, d’affectation ou de changement de poste. Après échange contradictoire, les parties maintiennent leurs positions respectives. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-026",
    "docType": "pv-non-conciliation",
    "title": "Non-conciliation pour sanction disciplinaire",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Le litige porte sur une sanction disciplinaire contestée par le travailleur. La conciliation a été tentée conformément aux dispositions applicables, sans accord final. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-027",
    "docType": "pv-non-conciliation",
    "title": "Non-conciliation pour accident du travail",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Le différend concerne les conséquences d’un accident du travail ou d’une maladie professionnelle. Les parties n’ont pas concilié sur les responsabilités, droits ou réparations réclamées. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-028",
    "docType": "pv-non-conciliation",
    "title": "Non-conciliation pour discrimination alléguée",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Le demandeur invoque des faits de discrimination ou traitement inéquitable. La défenderesse conteste les griefs. À défaut d’accord, le présent PV de non-conciliation est dressé. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-029",
    "docType": "pv-non-conciliation",
    "title": "Non-conciliation pour heures supplémentaires",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Le litige concerne la rémunération des heures supplémentaires, du travail de nuit ou des jours fériés. Après examen des prétentions, les parties n’ont pu s’accorder. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-030",
    "docType": "pv-non-conciliation",
    "title": "Non-conciliation pour réintégration demandée",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Le demandeur sollicite sa réintégration ou, à défaut, des dommages et intérêts. La défenderesse n’adhère pas à cette proposition. Le désaccord des parties est constaté. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-031",
    "docType": "mise-demeure",
    "title": "Mise en demeure pour refus de contrôle",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Par la présente, il est demandé à [ENTREPRISE] de donner accès libre à la mission de contrôle et de mettre à disposition tous les documents sollicités dans le délai indiqué, faute de quoi les sanctions prévues seront appliquées. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-032",
    "docType": "mise-demeure",
    "title": "Mise en demeure pour documents sociaux manquants",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. L’entreprise est mise en demeure de produire les documents sociaux obligatoires et de régulariser les insuffisances constatées dans le délai imparti. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-033",
    "docType": "mise-demeure",
    "title": "Mise en demeure pour santé et sécurité",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Au regard des risques relevés en matière de santé, d’hygiène et de sécurité, l’employeur est mis en demeure de prendre les mesures correctives immédiates et de présenter les preuves de conformité. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-034",
    "docType": "mise-demeure",
    "title": "Mise en demeure pour déclaration main-d’œuvre",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. L’entreprise est mise en demeure de déposer ou présenter les déclarations relatives au mouvement du personnel, à la main-d’œuvre et au bilan social auprès des services compétents. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-035",
    "docType": "mise-demeure",
    "title": "Mise en demeure pour convention médicale",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Il est enjoint à l’employeur de produire une convention médicale viable ou tout document attestant l’organisation effective du service médical des travailleurs. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-036",
    "docType": "mise-demeure",
    "title": "Mise en demeure pour régularisation des contrats",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. L’entreprise est mise en demeure de régulariser les contrats de travail des agents concernés et de les soumettre, le cas échéant, aux formalités requises. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-037",
    "docType": "mise-demeure",
    "title": "Mise en demeure pour règlement d’entreprise",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. L’employeur est mis en demeure d’établir, faire viser ou mettre en conformité son règlement d’entreprise dans le délai prescrit. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-038",
    "docType": "mise-demeure",
    "title": "Mise en demeure pour preuves CNSS-INPP-ONEM",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. L’entreprise est mise en demeure de produire les preuves d’affiliation, de déclaration et/ou de paiement relatives à la CNSS, l’INPP et l’ONEM. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-039",
    "docType": "mise-demeure",
    "title": "Mise en demeure pour installation du comité SHE",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. L’employeur est mis en demeure de procéder à l’organisation ou à la régularisation du Comité de Sécurité, d’Hygiène et d’Embellissement des lieux de travail. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-040",
    "docType": "mise-demeure",
    "title": "Mise en demeure finale avant PV",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Malgré les rappels antérieurs, les irrégularités persistent. La présente vaut dernière mise en demeure avant établissement du procès-verbal ou transmission à l’autorité compétente. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-041",
    "docType": "pv-installation-cshe",
    "title": "Installation initiale du Comité SHE",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Conformément aux articles 167 à 169 du Code du Travail, il a été procédé à l’installation initiale du Comité de Sécurité, d’Hygiène et d’Embellissement des lieux de travail au sein de [ENTREPRISE]. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-042",
    "docType": "pv-installation-cshe",
    "title": "Renouvellement du Comité SHE",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Les mandats ou fonctions devant être renouvelés, il a été procédé à la réinstallation du Comité de Sécurité, d’Hygiène et d’Embellissement, en présence des représentants de l’employeur et des travailleurs. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-043",
    "docType": "pv-installation-cshe",
    "title": "Installation après mise en demeure",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. À la suite de la mise en demeure adressée à l’employeur, l’entreprise a organisé la réunion paritaire permettant l’installation du Comité SHE conformément aux textes applicables. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-044",
    "docType": "pv-installation-cshe",
    "title": "Installation comité pour entreprise à haut risque",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Compte tenu de la nature des activités et des risques professionnels identifiés, l’installation du Comité SHE est actée afin d’assurer le suivi périodique des mesures de prévention. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-045",
    "docType": "pv-installation-cshe",
    "title": "Installation comité avec représentants des travailleurs",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Les représentants des travailleurs et de l’employeur ont pris part à la réunion paritaire au cours de laquelle les membres du Comité SHE ont été désignés et installés. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-046",
    "docType": "pv-installation-cshe",
    "title": "Installation comité avec programme trimestriel",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Les parties conviennent de se réunir trimestriellement pour évaluer les mesures d’hygiène, sécurité et embellissement, et pour formuler les recommandations utiles. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-047",
    "docType": "pv-installation-cshe",
    "title": "Installation comité après accident signalé",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. À la suite d’un accident ou incident signalé, il a été rappelé la nécessité de rendre fonctionnel le Comité SHE et de procéder à son installation officielle. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-048",
    "docType": "pv-installation-cshe",
    "title": "Installation comité dans établissement de service",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Il a été procédé à l’installation du Comité SHE dans un établissement de service, afin de garantir le respect des normes minimales de prévention et de sécurité. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-049",
    "docType": "pv-installation-cshe",
    "title": "Installation comité dans établissement industriel",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Pour les besoins de prévention en milieu industriel, les parties ont procédé à la désignation des responsables et membres du Comité SHE. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  },
  {
    "id": "MOD-050",
    "docType": "pv-installation-cshe",
    "title": "Installation comité avec visa de l’Inspection",
    "text": "L’an [ANNEE], le [JOUR] jour du mois de [MOIS], Nous [QUALITE DE L’AGENT], dûment habilité et agissant en vertu des dispositions légales en matière du travail, avons procédé aux constatations ci-après. Le présent procès-verbal est délivré pour servir et valoir ce que de droit, sous le visa de l’Inspection du Travail compétente. En foi de quoi, le présent modèle de texte est proposé comme réserve rédactionnelle, à adapter aux faits, pièces et déclarations du dossier. Nous jurons le présent acte sincère. Fait à [LIEU], le [DATE]."
  }
];

  const SIGNATURE_ROLES = [
    { key: 'inspecteur', title: 'Inspecteur du Travail', roleValue: 'Inspecteur du Travail' },
    { key: 'controleur', title: 'Contrôleur du Travail', roleValue: 'Contrôleur du Travail' },
    { key: 'representant', title: "Représentant de l’entreprise", roleValue: "Représentant de l’entreprise" },
    { key: 'temoin', title: 'Témoin(s)', roleValue: 'Témoin' }
  ];

  const DEFAULT_AGENTS = [];
  const LEGACY_AGENT_IDS = ['agt-hmw', 'agt-sbm', 'agt-jll', 'agt-koj', 'agt-mbo'];

  const LEGAL_BASE = [
  {
    "id": "JUR-001",
    "category": "Textes fondamentaux",
    "title": "Constitution de la République Démocratique du Congo",
    "reference": "Constitution de la RDC, telle que modifiée par la Loi n°11/002 du 20 janvier 2011, notamment les articles 91 et 93 cités dans l'arrêté interministériel transmis.",
    "scope": "Cadre constitutionnel de l'organisation gouvernementale, des attributions ministérielles et de l'action administrative.",
    "use": "À citer dans les visas ou considérants lorsque le modèle d'acte administratif le prévoit.",
    "keywords": [
      "constitution",
      "rdc",
      "articles 91",
      "article 93",
      "gouvernement"
    ]
  },
  {
    "id": "JUR-002",
    "category": "Code du Travail",
    "title": "Loi n°015-2002 du 16 octobre 2002 portant Code du Travail",
    "reference": "Loi n°015-2002 du 16 octobre 2002 portant Code du Travail, telle que modifiée et complétée à ce jour.",
    "scope": "Texte principal encadrant les relations individuelles et collectives du travail, l'inspection du travail, les infractions et les sanctions.",
    "use": "Référence générale pour tous les PV du module : constat d'infraction, obstruction, non-conciliation et mise en demeure.",
    "keywords": [
      "code du travail",
      "loi 015-2002",
      "travail",
      "infractions",
      "sanctions"
    ]
  },
  {
    "id": "JUR-003",
    "category": "Code du Travail",
    "title": "Ordonnance-loi n°16/010 du 15 juillet 2016",
    "reference": "Ordonnance-loi n°16/010 du 15 juillet 2016 modifiant et complétant la Loi n°015-2002 du 16 octobre 2002 portant Code du Travail.",
    "scope": "Texte modificatif utilisé dans les modèles transmis, notamment pour les références aux pouvoirs de l'Inspection du Travail et à l'obstruction.",
    "use": "À mentionner dans les PV d'obstruction et dans les actes se référant au Code du Travail modifié.",
    "keywords": [
      "ordonnance-loi 16/010",
      "modifiant",
      "complétant",
      "code du travail",
      "obstruction"
    ]
  },
  {
    "id": "JUR-004",
    "category": "Inspection du Travail",
    "title": "Compétence et action de l'Inspection du Travail",
    "reference": "Articles 187, 196 et 197 du Code du Travail, cités dans les modèles officiels transmis.",
    "scope": "Fondement de l'action des Inspecteurs et Contrôleurs du Travail lors des missions de contrôle, constats et actes de procédure.",
    "use": "Formule type : « Agissant en vertu des dispositions légales en la matière, notamment en ses articles 187, 196 et 197... ».",
    "keywords": [
      "article 187",
      "article 196",
      "article 197",
      "inspection",
      "contrôle",
      "mission"
    ]
  },
  {
    "id": "JUR-005",
    "category": "Inspection du Travail",
    "title": "Ordre de mission et mission officielle de contrôle",
    "reference": "Ordre de mission collectif ou individuel délivré par l'autorité compétente, combiné aux articles 187, 196 et 197 du Code du Travail.",
    "scope": "Justification administrative de la visite d'inspection, du contrôle spécial ou de la mission au sein d'une entreprise.",
    "use": "À renseigner obligatoirement dans le champ « Ordre de mission » et dans l'introduction du PV.",
    "keywords": [
      "ordre de mission",
      "mission officielle",
      "contrôle",
      "visite"
    ]
  },
  {
    "id": "JUR-006",
    "category": "Procédure",
    "title": "Procès-verbal de non-conciliation",
    "reference": "Article 302 du Code du Travail, cité dans le modèle de PV de non-conciliation transmis.",
    "scope": "Fondement de l'établissement du PV lorsque la tentative de conciliation d'un litige individuel du travail n'aboutit pas.",
    "use": "À utiliser dans les litiges individuels : audition des parties, constat, conclusion, proposition et désaccord.",
    "keywords": [
      "article 302",
      "non-conciliation",
      "litige individuel",
      "conciliation",
      "désaccord"
    ]
  },
  {
    "id": "JUR-007",
    "category": "Infractions et sanctions",
    "title": "Violation de la convention collective",
    "reference": "Article 320 du Code du Travail.",
    "scope": "Base de sanction pour les violations relatives aux conventions collectives.",
    "use": "Sélectionner l'infraction correspondante lorsque les faits révèlent une violation d'une convention collective applicable.",
    "keywords": [
      "article 320",
      "convention collective",
      "violation"
    ]
  },
  {
    "id": "JUR-008",
    "category": "Infractions et sanctions",
    "title": "Sanctions générales prévues par le Code du Travail",
    "reference": "Article 321 du Code du Travail.",
    "scope": "Référence utilisée pour de nombreuses infractions du Code du Travail dans la base intégrée.",
    "use": "À associer aux infractions dont la colonne sanction mentionne l'article 321.",
    "keywords": [
      "article 321",
      "amende",
      "sanction",
      "infractions"
    ]
  },
  {
    "id": "JUR-009",
    "category": "Infractions et sanctions",
    "title": "Obstruction à l'exercice des fonctions de l'Inspection du Travail",
    "reference": "Article 322 du Code du Travail.",
    "scope": "Faire ou tenter de faire obstacle à l'exercice des fonctions reconnues aux inspecteurs, contrôleurs du travail et à la commission de médiation.",
    "use": "Base juridique principale du PV d'obstruction et des mises en demeure pour refus de contrôle.",
    "keywords": [
      "article 322",
      "obstruction",
      "obstacle",
      "refus de contrôle",
      "inspecteur",
      "contrôleur"
    ]
  },
  {
    "id": "JUR-010",
    "category": "Infractions et sanctions",
    "title": "Violence, menace, contrainte et manœuvres frauduleuses",
    "reference": "Article 323 du Code du Travail.",
    "scope": "Réprime notamment les violences, menaces, contraintes, promesses mensongères, manœuvres frauduleuses et certaines altérations de documents.",
    "use": "À utiliser lorsque les faits dépassent la simple irrégularité administrative et comportent une contrainte ou fraude.",
    "keywords": [
      "article 323",
      "violence",
      "menace",
      "contrainte",
      "fraude",
      "document"
    ]
  },
  {
    "id": "JUR-011",
    "category": "Infractions et sanctions",
    "title": "Atteinte aux représentants des travailleurs et cautionnement",
    "reference": "Article 324 du Code du Travail.",
    "scope": "Atteinte à la libre désignation ou à l'exercice régulier des fonctions des représentants des travailleurs ; retenue ou usage abusif des cautionnements.",
    "use": "À sélectionner en présence de faits liés aux représentants des travailleurs ou au cautionnement.",
    "keywords": [
      "article 324",
      "représentants",
      "travailleurs",
      "cautionnement"
    ]
  },
  {
    "id": "JUR-012",
    "category": "Infractions et sanctions",
    "title": "Secrets de fabrication ou d'affaires et concurrence déloyale",
    "reference": "Article 325 du Code du Travail.",
    "scope": "Divulgation frauduleuse de secrets de fabrication ou d'affaires et actes de concurrence déloyale.",
    "use": "À associer aux faits de divulgation ou coopération frauduleuse avec un concurrent ou un tiers.",
    "keywords": [
      "article 325",
      "secret",
      "fabrication",
      "affaires",
      "concurrence déloyale"
    ]
  },
  {
    "id": "JUR-013",
    "category": "Amendes transactionnelles",
    "title": "Arrêté interministériel de fixation des taux — Emploi, Travail et Prévoyance Sociale",
    "reference": "Arrêté interministériel n°CAB/MIN/ETPS/CNM/HMK/JBI/006/09/2023 et n°CAB/MIN/FINANCES/127/09/2023 du 03/10/2023.",
    "scope": "Fixe les taux des droits, taxes et redevances à percevoir à l'initiative du Ministère de l'Emploi, Travail et Prévoyance Sociale ; inclut les amendes transactionnelles.",
    "use": "À citer dans les PV d'infraction, les mises en demeure et le calcul des amendes transactionnelles.",
    "keywords": [
      "arrêté interministériel",
      "006/09/2023",
      "127/09/2023",
      "03/10/2023",
      "amendes",
      "taux"
    ]
  },
  {
    "id": "JUR-014",
    "category": "Amendes transactionnelles",
    "title": "Autres violations en matière de l'Emploi et du Travail",
    "reference": "Arrêté interministériel du 03/10/2023, rubrique Inspection Générale du Travail, amendes transactionnelles en matière de l'Emploi et du Travail.",
    "scope": "Prévoit des montants transactionnels, notamment pour les autres violations des dispositions légales et réglementaires en matière de l'Emploi et du Travail.",
    "use": "Base de calcul complémentaire lorsque l'infraction n'a pas un montant spécifique dans le tableau interne.",
    "keywords": [
      "autres violations",
      "600 à 5600",
      "amende transactionnelle",
      "emploi",
      "travail"
    ]
  },
  {
    "id": "JUR-015",
    "category": "Documents sociaux obligatoires",
    "title": "Horaire de travail visé et affiché",
    "reference": "Articles 119 et 222 du Code du Travail ; Arrêté Min. n°40/CAB/MIN/ETPS/MBL/MMG/pkg/2013 du 09/04/2013, articles 3 et 4.",
    "scope": "Obligation de faire viser et/ou afficher l'horaire du travail conformément aux prescriptions applicables.",
    "use": "À utiliser pour l'infraction « non affichage de l'horaire du travail visé » ou absence d'horaire.",
    "keywords": [
      "horaire",
      "affichage",
      "article 119",
      "article 222",
      "arrêté 040"
    ]
  },
  {
    "id": "JUR-016",
    "category": "Documents sociaux obligatoires",
    "title": "Contrat de travail écrit et visa ONEM",
    "reference": "Articles 44, 46, 47 et 212 du Code du Travail.",
    "scope": "Règles relatives à la constatation écrite, signature et visa du contrat de travail selon les cas applicables.",
    "use": "À sélectionner en cas d'absence de contrat écrit, contrat non signé ou non visé.",
    "keywords": [
      "contrat",
      "écrit",
      "onem",
      "article 44",
      "article 46",
      "article 47",
      "article 212"
    ]
  },
  {
    "id": "JUR-017",
    "category": "Documents sociaux obligatoires",
    "title": "Règlement d'entreprise ou règlement intérieur",
    "reference": "Articles 157 et 158 du Code du Travail.",
    "scope": "Obligation d'établir et de respecter le règlement d'entreprise/règlement intérieur dans les conditions prévues.",
    "use": "À citer pour règlement inexistant, non conforme ou non visé.",
    "keywords": [
      "règlement",
      "entreprise",
      "intérieur",
      "article 157",
      "article 158"
    ]
  },
  {
    "id": "JUR-018",
    "category": "Documents sociaux obligatoires",
    "title": "Livre de paie et déclaration d'établissement",
    "reference": "Articles 213 à 216 du Code du Travail.",
    "scope": "Tenue du livre de paie et obligations de déclaration/établissement selon les prescriptions du Code du Travail.",
    "use": "À utiliser pour défaut de livre de paie, déclaration d'établissement non existante ou registre non tenu.",
    "keywords": [
      "livre de paie",
      "déclaration établissement",
      "article 213",
      "article 216",
      "registre"
    ]
  },
  {
    "id": "JUR-019",
    "category": "Déclarations obligatoires",
    "title": "Déclaration du mouvement du personnel",
    "reference": "Article 217 du Code du Travail.",
    "scope": "Obligation de déclarer le mouvement du personnel à l'ONEM et aux services habilités du Ministère.",
    "use": "À citer pour absence de déclaration du mouvement des travailleurs.",
    "keywords": [
      "article 217",
      "mouvement du personnel",
      "onem",
      "déclaration"
    ]
  },
  {
    "id": "JUR-020",
    "category": "Déclarations obligatoires",
    "title": "Déclaration de la main-d'œuvre et bilan social",
    "reference": "Article 218 du Code du Travail.",
    "scope": "Obligation de déclarer la situation de la main-d'œuvre nationale et étrangère ainsi que le bilan social.",
    "use": "À citer pour absence de déclaration annuelle de main-d'œuvre ou de bilan social.",
    "keywords": [
      "article 218",
      "main-d'œuvre",
      "bilan social",
      "déclaration annuelle"
    ]
  },
  {
    "id": "JUR-021",
    "category": "Santé, hygiène et sécurité",
    "title": "Comité de Sécurité, d'Hygiène et d'Embellissement des lieux de travail",
    "reference": "Articles 167, 168 et 169 du Code du Travail ; Arrêté ministériel n°12/CAB.MIN/ETPS/043/2008 du 08 août 2008.",
    "scope": "Organisation, installation et fonctionnement du comité chargé de la sécurité, de l'hygiène et de l'embellissement des lieux de travail.",
    "use": "Base du PV d'installation du comité SHE/CSHE et des infractions relatives à son absence.",
    "keywords": [
      "cshe",
      "she",
      "comité",
      "hygiène",
      "sécurité",
      "embellissement",
      "article 167",
      "article 169"
    ]
  },
  {
    "id": "JUR-022",
    "category": "Santé, hygiène et sécurité",
    "title": "Mauvaises conditions d'hygiène et sécurité — mise en demeure",
    "reference": "Article 171 du Code du Travail.",
    "scope": "Base de mise en demeure par l'Inspecteur du Travail lorsque les conditions d'hygiène et sécurité sont mauvaises ou dangereuses.",
    "use": "À utiliser dans les mises en demeure et observations relatives aux risques professionnels.",
    "keywords": [
      "article 171",
      "hygiène",
      "sécurité",
      "mise en demeure",
      "risques"
    ]
  },
  {
    "id": "JUR-023",
    "category": "Santé, hygiène et sécurité",
    "title": "Accidents du travail et maladies professionnelles",
    "reference": "Article 176 du Code du Travail.",
    "scope": "Obligation de signaler les accidents du travail ou maladies professionnelles à la CNSS et à l'Inspecteur du Travail du ressort.",
    "use": "À citer en cas de défaut de déclaration ou de signalement.",
    "keywords": [
      "article 176",
      "accident du travail",
      "maladie professionnelle",
      "cnss"
    ]
  },
  {
    "id": "JUR-024",
    "category": "Santé, hygiène et sécurité",
    "title": "Service médical et convention médicale viable",
    "reference": "Articles 177 et 178 du Code du Travail.",
    "scope": "Obligation relative au service médical des travailleurs et à la convention médicale viable.",
    "use": "À sélectionner pour absence de service médical ou de convention médicale.",
    "keywords": [
      "article 177",
      "article 178",
      "service médical",
      "convention médicale",
      "santé"
    ]
  },
  {
    "id": "JUR-025",
    "category": "Rémunération et SMIG",
    "title": "SMIG et rémunération minimale",
    "reference": "Articles 87, 91 et 94 à 96 du Code du Travail ; Décret n°25/22 du mai 2025 cité dans le modèle transmis.",
    "scope": "Cadre du salaire minimum interprofessionnel garanti et des obligations relatives à la rémunération minimale.",
    "use": "À citer pour non-application du SMIG ou rémunération non conforme.",
    "keywords": [
      "smig",
      "salaire minimum",
      "article 87",
      "article 91",
      "article 94",
      "décret 25/22"
    ]
  },
  {
    "id": "JUR-026",
    "category": "Rémunération et SMIG",
    "title": "Paiement de la rémunération et décompte écrit",
    "reference": "Articles 98, 99, 100, 101, 103 et 104 du Code du Travail.",
    "scope": "Règles relatives au paiement de la rémunération, au lieu/date de paiement, au décompte écrit et au décompte final.",
    "use": "À utiliser pour paiement irrégulier, absence de décompte, privation de décompte final ou rémunération restante.",
    "keywords": [
      "rémunération",
      "décompte",
      "article 100",
      "article 103",
      "article 104",
      "salaire"
    ]
  },
  {
    "id": "JUR-027",
    "category": "Temps de travail et congés",
    "title": "Durée du travail, heures supplémentaires et repos",
    "reference": "Articles 119, 120, 121, 123, 124, 125 et 126 du Code du Travail.",
    "scope": "Encadrement de la durée hebdomadaire, des heures supplémentaires, du repos, des jours fériés et du travail de nuit.",
    "use": "À associer aux infractions relatives aux horaires, au repos, aux jours fériés ou au travail de nuit.",
    "keywords": [
      "durée du travail",
      "heures supplémentaires",
      "repos",
      "jours fériés",
      "travail de nuit"
    ]
  },
  {
    "id": "JUR-028",
    "category": "Temps de travail et congés",
    "title": "Congés annuels et planning de congés",
    "reference": "Articles 140 à 146 du Code du Travail.",
    "scope": "Obligations relatives au congé annuel et au planning des congés.",
    "use": "À citer pour défaut de planning de congé annuel ou violation des règles de congé.",
    "keywords": [
      "congés",
      "planning",
      "article 140",
      "article 146"
    ]
  },
  {
    "id": "JUR-029",
    "category": "Fin du contrat et litiges",
    "title": "Préavis, résiliation et licenciement",
    "reference": "Articles 60, 63, 64, 65, 66, 78, 79 et 93 du Code du Travail.",
    "scope": "Règles relatives à la rupture du contrat, au motif, au préavis, au licenciement massif, à l'attestation de services et à certaines réparations.",
    "use": "À utiliser dans les PV de non-conciliation ou constats liés à la résiliation irrégulière du contrat.",
    "keywords": [
      "préavis",
      "licenciement",
      "résiliation",
      "article 63",
      "article 93",
      "attestation"
    ]
  },
  {
    "id": "JUR-030",
    "category": "Main-d'œuvre nationale et étrangers",
    "title": "Protection de la main-d'œuvre nationale",
    "reference": "Ordonnance n°74/098 du 06 juin 1974 portant protection de la main-d'œuvre nationale contre la concurrence étrangère, révisée par l'Ordonnance n°77-383 du 29 décembre 1977 ; références rappelées dans l'arrêté transmis.",
    "scope": "Base de la protection de la main-d'œuvre nationale et du contrôle relatif aux travailleurs étrangers.",
    "use": "À citer pour défaut de carte de travail pour étranger ou non-respect de la protection de la main-d'œuvre nationale.",
    "keywords": [
      "main-d'œuvre nationale",
      "travailleur étranger",
      "carte de travail",
      "ordonnance 74/098"
    ]
  },
  {
    "id": "JUR-031",
    "category": "Main-d'œuvre nationale et étrangers",
    "title": "Non-respect de la Congolité",
    "reference": "AM n°33/CAB/MIN/ET/EAN/JDO/8/2025 cité dans le modèle de PV transmis.",
    "scope": "Référence utilisée dans l'exemple de PV pour le non-respect de la Congolité.",
    "use": "À sélectionner lorsque les faits constatés portent sur l'emploi ou la protection de la main-d'œuvre congolaise selon les textes applicables.",
    "keywords": [
      "congolité",
      "AM 33",
      "main-d'œuvre congolaise",
      "nationalité"
    ]
  },
  {
    "id": "JUR-032",
    "category": "Sécurité sociale et organismes",
    "title": "Régime général de la sécurité sociale",
    "reference": "Loi n°16/009 du 15 juillet 2016 fixant les règles relatives au Régime Général de la Sécurité Sociale.",
    "scope": "Cadre général de sécurité sociale, utile pour les vérifications CNSS et obligations sociales.",
    "use": "À mentionner dans les observations relatives à la CNSS et à la preuve de paiement ou d'affiliation.",
    "keywords": [
      "sécurité sociale",
      "cnss",
      "loi 16/009",
      "affiliation"
    ]
  },
  {
    "id": "JUR-033",
    "category": "Sécurité sociale et organismes",
    "title": "INPP, ONEM, CNSS — preuves de paiement et obligations sociales",
    "reference": "Références citées dans le modèle transmis : Arrêté min. n°028 du 27/09/2025 ; arrêté inter. n°002/CAB/MET/2025 et n°158/2025 ; Code du Travail selon les obligations concernées.",
    "scope": "Contrôle des preuves de paiement ou de conformité auprès de l'ONEM, de la CNSS et de l'INPP.",
    "use": "À utiliser lorsque les preuves de paiement ONEM, CNSS ou INPP ne sont pas produites.",
    "keywords": [
      "onem",
      "cnss",
      "inpp",
      "preuve de paiement",
      "arrêté 028"
    ]
  },
  {
    "id": "JUR-034",
    "category": "Sous-traitance et marchés",
    "title": "Sous-traitance dans le secteur privé",
    "reference": "Loi n°17/001 du 08 février 2017 fixant les règles applicables à la sous-traitance dans le secteur privé, citée dans l'arrêté transmis.",
    "scope": "Cadre juridique des obligations relatives à la sous-traitance dans le secteur privé.",
    "use": "À citer lorsque le contrôle porte sur la sous-traitance, la liste des sous-entreprises ou la protection de la main-d'œuvre nationale.",
    "keywords": [
      "sous-traitance",
      "loi 17/001",
      "secteur privé",
      "sous-entreprises"
    ]
  },
  {
    "id": "JUR-035",
    "category": "Sous-traitance et marchés",
    "title": "Appel d'offre et procédures applicables",
    "reference": "Article 8 du Décret n°12/003 du 19 janvier 2012 cité dans le modèle transmis.",
    "scope": "Référence reprise dans l'exemple de PV pour non-respect de l'appel d'offre.",
    "use": "À sélectionner si les faits constatés concernent un manquement aux règles d'appel d'offre selon le texte applicable.",
    "keywords": [
      "appel d'offre",
      "décret 12/003",
      "article 8",
      "marché"
    ]
  }
];

  const INFRACTIONS = [
    inf(1, 'Non affichage de l’horaire du travail visé', 'Art. 119 et 222 du Code du Travail ; Arrêté Min. n°40/CAB/MIN/ETPS/MBL/MMG/pkg/2013 du 09/04/2013, art. 3 et 4', 'Art. 321 CT', 3000, 'Moyenne', ['horaire', 'affichage', 'travail']),
    inf(2, 'Défaut de classification générale des emplois', 'Art. 90 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['classification', 'emploi', 'catégorie']),
    inf(3, 'Contrat de travail non constaté par écrit, signé et/ou visé par l’ONEM', 'Art. 44, 46, 47 et 212 du Code du Travail', 'Art. 44 et 321 CT', 5000, 'Élevée', ['contrat', 'écrit', 'onem', 'visa'], 'par contrat'),
    inf(4, 'Défaut du règlement intérieur / règlement d’entreprise', 'Art. 157 et 158 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['règlement', 'interieur', 'intérieur', 'entreprise']),
    inf(5, 'Défaut d’application du SMIG', 'Art. 87 et 94 à 96 du Code du Travail', 'Art. 318 et 321 CT', 5000, 'Élevée', ['smig', 'salaire minimum', 'minimum']),
    inf(6, 'Faire travailler les employés au-delà de 45 heures par semaine sans rémunération des heures supplémentaires', 'Art. 119 et 120 du Code du Travail', 'Art. 321 CT', 3000, 'Élevée', ['45 heures', 'heures supplémentaires', 'durée', 'temps']),
    inf(7, 'Privation du jour de repos dans la semaine', 'Art. 121 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['repos', 'hebdomadaire', 'semaine']),
    inf(8, 'Travail de nuit des enfants ou personnes handicapées et non-respect de la durée de repos', 'Art. 125 et 126 du Code du Travail', 'Art. 321 CT', 3000, 'Élevée', ['nuit', 'enfant', 'handicap', 'repos']),
    inf(9, 'Violation des droits des femmes, enfants et personnes handicapées ; discrimination liée à la maternité ou test de grossesse abusif', 'Art. 128 et 129 du Code du Travail', 'Art. 321 CT', 3000, 'Élevée', ['femme', 'maternité', 'grossesse', 'discrimination', 'enfant', 'handicap']),
    inf(10, 'Emploi des enfants de 15 à 17 ans sans autorisation de l’Inspecteur du Travail et de l’autorité parentale', 'Art. 133 du Code du Travail', 'Art. 321 CT', 3000, 'Élevée', ['enfant', 'mineur', '15', '17', 'autorisation']),
    inf(11, 'Mauvaises conditions d’hygiène et de sécurité', 'Art. 171 du Code du Travail', 'Art. 171 CT — Mise en demeure par l’IT', 3000, 'Élevée', ['hygiène', 'sécurité', 'risque', 'danger', 'salubrité']),
    inf(12, 'Non assurance d’un service médical aux employés', 'Art. 177 du Code du Travail', 'Art. 321 CT', 3000, 'Élevée', ['service médical', 'médecin', 'soins', 'santé']),
    inf(13, 'Violation de la convention collective', 'Art. 320 du Code du Travail', 'Art. 320 CT', 7500, 'Élevée', ['convention collective', 'collective']),
    inf(14, 'Défaut d’assurer la formation, le perfectionnement ou l’adaptation professionnelle par les moyens de l’INPP', 'Art. 8', 'Art. 321 CT', 3000, 'Moyenne', ['formation', 'inpp', 'perfectionnement']),
    inf(15, 'Recevoir les apprentis sans en avoir la qualité requise', 'Art. 18 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['apprenti', 'apprentissage', 'qualité']),
    inf(16, 'Absence de contrat d’apprentissage écrit ou non conforme aux prescriptions', 'Art. 19 et 20 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['apprentissage', 'contrat', 'apprenti']),
    inf(17, 'Contrat d’apprentissage absent et/ou non visé par l’ONEM', 'Art. 21 du Code du Travail', 'Art. 21 et 312 CT', 3000, 'Moyenne', ['apprentissage', 'onem', 'visa']),
    inf(18, 'Non rémunération de l’apprenti', 'Art. 25 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['apprenti', 'rémunération', 'salaire']),
    inf(19, 'Apprenti n’exécutant pas ses obligations', 'Art. 26 du Code du Travail', 'Art. 321 CT', 3000, 'Faible', ['apprenti', 'obligation']),
    inf(20, 'Cessation du contrat d’apprentissage sans information de l’Inspecteur du Travail et de l’ONEM', 'Art. 33 al. 2 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['cessation', 'apprentissage', 'onem']),
    inf(21, 'Conclusion d’un CDD avec un travailleur ayant déjà presté plus de 22 jours sur une période de 2 mois', 'Art. 40 du Code du Travail', 'Art. 321 CT', 3000, 'Élevée', ['cdd', '22 jours', 'cdi', 'contrat']),
    inf(22, 'Divulgation frauduleuse de secrets de fabrication ou d’affaires ; concurrence déloyale', 'Art. 325 du Code du Travail', 'Art. 325 CT', 30000, 'Critique', ['secret', 'fabrication', 'affaires', 'concurrence']),
    inf(23, 'Non-respect par le travailleur des bonnes pratiques, de la protection personnelle et du traitement équitable des subalternes', 'Art. 51 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['bonnes pratiques', 'protection', 'subalterne']),
    inf(24, 'Absence d’exemplaire à jour du Code du Travail à la disposition des représentants des travailleurs', 'Art. 55 du Code du Travail', 'Art. 321 CT', 3000, 'Faible', ['code du travail', 'représentants', 'exemplaire']),
    inf(25, 'Défaut de prise en charge des frais de transport résidence-lieu de travail', 'Art. 56 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['transport', 'frais', 'résidence']),
    inf(26, 'Rupture d’un contrat de travail en cours de validité en violation des prescriptions légales', 'Art. 60 du Code du Travail', 'Art. 321 CT', 3000, 'Élevée', ['rupture', 'licenciement', 'résiliation', 'contrat']),
    inf(27, 'Violation des prescriptions sur la durée du préavis', 'Art. 64, 65 et 66 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['préavis', 'durée', 'licenciement']),
    inf(28, 'Licenciements massifs en violation des prescriptions légales', 'Art. 78 du Code du Travail', 'Art. 321 CT', 5000, 'Élevée', ['licenciement massif', 'massif', 'compression']),
    inf(29, 'Non remise de l’attestation de services rendus deux jours après la fin du contrat', 'Art. 79 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['attestation', 'services rendus', 'fin du contrat']),
    inf(30, 'Entrepreneur n’affichant pas ou ne mettant pas à jour la liste de ses sous-entreprises', 'Art. 84 du Code du Travail', 'Art. 321 CT', 3000, 'Faible', ['sous-entreprise', 'affichage', 'liste']),
    inf(31, 'Rémunération non payée en monnaie ayant cours légal ou non conforme à la classification', 'Art. 89 et 90 du Code du Travail', 'Art. 321 CT', 3000, 'Élevée', ['rémunération', 'monnaie', 'classification', 'salaire']),
    inf(32, 'Paiement de rémunération en dehors des heures, dates et lieux prescrits', 'Art. 98, 99, 100 et 101 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['paiement', 'rémunération', 'date', 'lieu']),
    inf(33, 'Paiement de rémunération sans décompte écrit', 'Art. 103 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['décompte', 'salaire', 'fiche de paie']),
    inf(34, 'Amandes ou réductions imposées par l’employeur sur les rémunérations des travailleurs', 'Art. 111 et 112 du Code du Travail', 'Art. 321 CT', 3000, 'Élevée', ['amende', 'réduction', 'retenue', 'salaire']),
    inf(35, 'Violation des conditions relatives aux économats', 'Art. 116 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['économat', 'denrées', 'vente']),
    inf(36, 'Discrimination des femmes et personnes handicapées ; travail au-delà de la capacité et aptitude', 'Art. 136 et 137 du Code du Travail', 'Art. 321 CT', 3000, 'Élevée', ['discrimination', 'femme', 'handicap', 'capacité']),
    inf(37, 'Défaut de logement décent ou d’indemnité de logement pour engagement hors lieu d’emploi', 'Art. 138 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['logement', 'indemnité', 'engagement']),
    inf(38, 'Défaut de planning de congés annuels ou violation des prescriptions de congé', 'Art. 140 à 146 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['congé', 'planning', 'annuel']),
    inf(39, 'Défaut de prise en charge du transport A/R de l’employé et sa famille au début et à la fin du contrat', 'Art. 147 à 156 du Code du Travail', 'Art. 321 CT ; l’IT peut saisir le Tribunal du Travail, art. 152', 3000, 'Moyenne', ['transport', 'famille', 'début', 'fin contrat']),
    inf(40, 'Absence d’un comité d’hygiène et de sécurité', 'Art. 167 du Code du Travail', 'Art. 321 CT', 3000, 'Élevée', ['comité', 'hygiène', 'sécurité']),
    inf(41, 'Défaut de signalement des accidents du travail ou maladies professionnelles à la CNSS et à l’Inspecteur du Travail', 'Art. 176 du Code du Travail', 'Art. 321 CT', 3000, 'Élevée', ['accident', 'maladie professionnelle', 'cnss', 'signalement']),
    inf(42, 'Défaut d’une convention médicale viable', 'Art. 177 et 178 du Code du Travail', 'Art. 321 CT', 3000, 'Élevée', ['convention médicale', 'médicale', 'santé']),
    inf(43, 'Défaut de tenir un livre de paie mis à jour', 'Art. 213 à 216 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['livre de paie', 'paie', 'registre']),
    inf(44, 'Défaut de déclaration du mouvement du personnel à l’ONEM et aux services habilités', 'Art. 217 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['mouvement', 'personnel', 'onem', 'déclaration']),
    inf(45, 'Défaut de déclaration de la main-d’œuvre nationale et étrangère ainsi que du bilan social', 'Art. 218 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['main d’œuvre', 'main-d’œuvre', 'bilan social', 'déclaration']),
    inf(46, 'Ouverture d’un secrétariat social sans caution et/ou sans autorisation du Ministre compétent', 'Art. 221 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['secrétariat social', 'caution', 'autorisation']),
    inf(47, 'Privation du temps nécessaire à l’employé membre du Conseil National du Travail pour participer aux réunions', 'Art. 229 du Code du Travail', 'Art. 321 CT', 3000, 'Faible', ['conseil national du travail', 'réunion']),
    inf(48, 'Subordonner l’emploi ou licencier un travailleur en raison de son affiliation syndicale', 'Art. 234 du Code du Travail', 'Art. 321 CT', 3000, 'Élevée', ['syndicat', 'affiliation', 'licencier']),
    inf(49, 'Licenciement d’un délégué syndical sans approbation de l’Inspecteur du Travail', 'Art. 258 du Code du Travail', 'Art. 321 CT', 3000, 'Élevée', ['délégué syndical', 'licenciement', 'approbation']),
    inf(50, 'Non octroi d’un minimum de 15 heures par mois aux représentants des travailleurs', 'Art. 265 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['15 heures', 'représentants', 'travailleurs']),
    inf(51, 'Refus du congé pour stage aux membres du comité de représentants', 'Art. 268 du Code du Travail', 'Art. 321 CT', 3000, 'Faible', ['congé', 'stage', 'comité']),
    inf(52, 'Privation d’un congé d’éducation ouvrière', 'Art. 269 du Code du Travail', 'Art. 321 CT', 3000, 'Faible', ['éducation ouvrière', 'congé']),
    inf(53, 'Non-respect des jours fériés légaux', 'Art. 123 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['jour férié', 'fériés']),
    inf(54, 'Contrat exécuté sans certificat médical attestant l’aptitude du travailleur', 'Art. 38 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['certificat médical', 'aptitude', 'travail']),
    inf(55, 'Usage de violence, menace, contrainte, promesses mensongères ou manœuvres frauduleuses liées à l’engagement ou à la cessation collective du travail', 'Art. 323 du Code du Travail', 'Art. 323 CT', 25000, 'Critique', ['violence', 'menace', 'contrainte', 'fraude', 'grève']),
    inf(56, 'Violation des prescriptions légales sur la suspension du contrat de travail', 'Art. 57 et 58 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['suspension', 'contrat']),
    inf(57, 'Dépassement des heures de travail de nuit sans paiement de la majoration', 'Art. 124 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['nuit', 'majoration', 'heures']),
    inf(58, 'Violation des prescriptions sur le logement et la restauration des travailleurs', 'Art. 139 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['logement', 'restauration', 'travailleurs']),
    inf(59, 'Défaut du règlement d’entreprise', 'Art. 158 du Code du Travail', 'Art. 321 CT', 3000, 'Moyenne', ['règlement entreprise', 'règlement d’entreprise']),
    inf(60, 'Défaut d’organisation du comité d’hygiène et de sécurité', 'Art. 169 du Code du Travail', 'Art. 321 CT', 3000, 'Élevée', ['organisation', 'comité', 'hygiène', 'sécurité']),
    inf(61, 'Défaut de répondre jusqu’à la troisième invitation de l’Inspecteur du Travail dans un litige ou conflit de travail', 'Art. 321 du Code du Travail', 'Art. 321 CT', 3000, 'Élevée', ['invitation', 'troisième', 'litige', 'refus']),
    inf(62, 'Faire ou tenter de faire obstacle à l’exercice des fonctions reconnues aux inspecteurs, contrôleurs du travail et à la commission de médiation', 'Art. 322 du Code du Travail', 'Art. 322 CT', 30000, 'Critique', ['obstruction', 'obstacle', 'refus contrôle', 'contrôle', 'inspecteur', 'contrôleur']),
    inf(63, 'Incitation au refus d’obligations ; destruction, altération ou usage frauduleux de contrat/décompte ; violation de la protection de la main-d’œuvre nationale', 'Art. 323 du Code du Travail', 'Art. 323 CT', 25000, 'Critique', ['contrat détruit', 'décompte', 'main-d’œuvre nationale', 'frauduleux']),
    inf(64, 'Atteinte à la libre désignation des représentants des travailleurs ou retenue/utilisation abusive de cautionnement', 'Art. 324 du Code du Travail', 'Art. 324 CT', 25000, 'Critique', ['représentants', 'cautionnement', 'désignation']),
    inf(65, 'Privation du décompte final ou de la rémunération restante deux jours après la fin du contrat', 'Art. 100 à 104 du Code du Travail', 'Art. 321 CT', 3000, 'Élevée', ['décompte final', 'rémunération restante', 'fin contrat']),
    inf(66, 'Déclaration d’établissement non existante', 'Art. 216 du Code du Travail', 'Arrêté interministériel n°CAB/MIN/ETPS/CNM/HMK/JBI/006/09/2023 et n°CAB/MIN/FINANCES/127/09/2023', 3000, 'Moyenne', ['déclaration établissement', 'établissement']),
    inf(67, 'Registre de journalier non existant', 'Art. 0 alinéa 2 du Code du Travail (référence modèle transmis)', 'Arrêté interministériel du 03/10/2023', 3000, 'Moyenne', ['registre journalier', 'journalier']),
    inf(68, 'Absence de preuve de paiement ONEM, CNSS et INPP', 'Art. 1 arrêté min. n°028 du 27/09/2025 et art. 1 arrêté inter. n°002/CAB/MET/2025, n°158/2025', 'Arrêtés applicables', 3000, 'Moyenne', ['onem', 'cnss', 'inpp', 'paiement', 'preuve']),
    inf(69, 'Attestation de fonctionnement du service d’hygiène et de sécurité non existante', 'Art. 163 et 164 du Code du Travail', 'Arrêté interministériel du 03/10/2023', 3000, 'Moyenne', ['attestation', 'fonctionnement', 'she', 'sécurité']),
    inf(70, 'Non-respect de l’appel d’offre', 'Art. 8 du Décret n°12/003 du 19 janvier 2012', 'Arrêté interministériel du 03/10/2023', 3000, 'Moyenne', ['appel d’offre', 'appel offre', 'soumission']),
    inf(71, 'Non-respect de la Congolité', 'Art. 1 AM n°33/CAB/MIN/ET/EAN/JDO/8/2025', 'Arrêté applicable', 3000, 'Élevée', ['congolité', 'main d’œuvre nationale', 'nationalité'])
  ];

  const FORM_FIELDS = [
    'docType','status','uuid','officialNumber','verificationCode','placeDate','republique','ministere','inspection','direction','adminProvince','localInspection','agentRole','agentSelect','agentName','agentQuality','habilitation','opjNumber','missionOrder','logoIgtData','companyName','companyLegalForm','rccm','idnat','taxNumber','cnss','inpp','companyPhone','companyEmail','companyProvince','commune','workersCount','companyAddress','presentManager','managerFunction','facts','observations','regularizationDeadline','riskLevel','paymentDeadline','nextAction','documentsRequested','correctiveMeasures','demandeur','defender','demandeurId','claimAmount','claimantStatement','laborOfficerFindings','conclusion','proposal','disagreement'
  ];

  const state = {
    store: { version: APP_VERSION, records: [], agents: DEFAULT_AGENTS.slice(), customTemplates: [] },
    currentId: null,
    selectedInfractions: [],
    signatures: {},
    canvases: new Map(),
    recognition: null,
    listening: false,
    focusedField: null,
    previewZoomed: false,
    previewTimer: null
  };

  function inf(num, infraction, texteViole, referenceSanction, amountUSD, gravity, keywords, unit = 'par violation') {
    return {
      id: `INF-${String(num).padStart(3, '0')}`,
      num,
      infraction,
      texteViole,
      referenceSanction,
      gravity,
      amountUSD,
      minUSD: amountUSD >= 25000 ? amountUSD : 600,
      maxUSD: amountUSD >= 25000 ? amountUSD : 5600,
      unit,
      keywords: keywords || []
    };
  }

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    applySavedTheme();
    loadStore();
    ensureDefaults();
    populateStaticControls();
    renderSectors();
    renderSignaturePads();
    newRecord(false);
    attachEvents();
    renderInfractionsList();
    renderSelectedInfractionsTable();
    renderDashboard();
    renderHistory();
    renderLegalBase();
    renderSettings();
    updateDocPanels();
    updatePreview();
    toast('Module PV chargé : modèles officiels et IA locale prêts.');
  }

  function applySavedTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(saved === 'dark' ? 'dark' : 'light');
  }

  function toggleTheme() {
    const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
    const btn = byId('btnThemeToggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️ Mode clair' : '🌙 Mode sombre';
  }

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state.store = {
          version: parsed.version || APP_VERSION,
          records: Array.isArray(parsed.records) ? parsed.records : [],
          agents: Array.isArray(parsed.agents) && parsed.agents.length ? parsed.agents : DEFAULT_AGENTS.slice(),
          customTemplates: Array.isArray(parsed.customTemplates) ? parsed.customTemplates : []
        };
      }
    } catch (err) {
      console.error(err);
      toast('Impossible de lire les données locales. Une base neuve est ouverte.');
    }
  }

  function saveStore() {
    state.store.version = APP_VERSION;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.store));
  }

  function ensureDefaults() {
    state.store.agents = Array.isArray(state.store.agents) ? state.store.agents : [];
    state.store.agents = state.store.agents.filter((agent) => !isLegacySuggestedAgent(agent));
  }

  function isLegacySuggestedAgent(agent) {
    if (!agent) return false;
    return LEGACY_AGENT_IDS.includes(agent.id);
  }

  function attachEvents() {
    document.querySelectorAll('.nav-item').forEach((btn) => btn.addEventListener('click', () => switchView(btn.dataset.view)));
    byId('btnThemeToggle').addEventListener('click', toggleTheme);
    document.querySelectorAll('.panel-toggle').forEach((btn) => btn.addEventListener('click', () => {
      const panel = btn.closest('.collapsible');
      panel.classList.toggle('open');
    }));

    document.getElementById('pvForm').addEventListener('input', handleFormInput);
    document.getElementById('pvForm').addEventListener('change', handleFormInput);
    document.addEventListener('focusin', (event) => {
      if (event.target.matches('input, textarea')) state.focusedField = event.target;
    });

    byId('agentRole').addEventListener('change', () => {
      populateAgentsSelect();
      syncAuthorSignature();
      updatePreview();
    });
    byId('agentSelect').addEventListener('change', applySelectedAgent);
    byId('docType').addEventListener('change', () => {
      updateDocPanels();
      updatePreview();
    });
    byId('direction').addEventListener('change', () => {
      const d = DIRECTIONS.find((item) => item.name === byId('direction').value);
      if (d) byId('adminProvince').value = d.province;
      updatePreview();
    });
    byId('sectorSearch').addEventListener('input', renderSectors);
    byId('btnClearSectors').addEventListener('click', () => {
      document.querySelectorAll('#sectorsList input[type="checkbox"]').forEach((cb) => { cb.checked = false; });
      updatePreview();
    });
    byId('infractionSearch').addEventListener('input', renderInfractionsList);
    byId('gravityFilter').addEventListener('change', renderInfractionsList);
    byId('selectedInfractionsTable').addEventListener('input', handleSelectedInfractionEdit);
    byId('selectedInfractionsTable').addEventListener('click', handleSelectedInfractionClick);

    byId('btnAnalyzeFacts').addEventListener('click', analyzeFacts);
    byId('btnSuggestArticles').addEventListener('click', suggestArticles);
    byId('btnGenerateObservations').addEventListener('click', generateObservations);
    byId('btnAutoDraft').addEventListener('click', autoDraft);
    byId('btnRefreshPreview').addEventListener('click', updatePreview);
    byId('btnToggleScale').addEventListener('click', () => {
      state.previewZoomed = !state.previewZoomed;
      byId('printArea').classList.toggle('zoomed', state.previewZoomed);
    });

    byId('btnResetForm').addEventListener('click', () => newRecord(true));
    byId('btnNewFromDashboard').addEventListener('click', () => { switchView('create'); newRecord(true); });
    byId('btnSaveDraft').addEventListener('click', () => saveCurrent('draft'));
    byId('btnValidate').addEventListener('click', validateCurrent);
    byId('btnDuplicateCurrent').addEventListener('click', duplicateCurrent);
    byId('btnPrint').addEventListener('click', printDocument);
    byId('btnPrintTop').addEventListener('click', printDocument);
    byId('btnReadPreview').addEventListener('click', readPreview);
    byId('btnReadSelection').addEventListener('click', readPreview);
    byId('btnGlobalListen').addEventListener('click', toggleDictation);
    byId('logoIgtFile').addEventListener('change', handleLogoIgtUpload);
    byId('btnClearLogoIgt').addEventListener('click', clearLogoIgt);
    byId('btnGenerateCorrectivePlan').addEventListener('click', generateCorrectivePlan);

    byId('historySearch').addEventListener('input', renderHistory);
    byId('historyStatus').addEventListener('change', renderHistory);
    byId('historyRole').addEventListener('change', renderHistory);
    byId('historyType').addEventListener('change', renderHistory);
    byId('historyList').addEventListener('click', handleHistoryAction);
    byId('btnExportBackupHistory').addEventListener('click', exportBackup);

    byId('legalSearch').addEventListener('input', renderLegalBase);
    byId('legalCategory').addEventListener('change', renderLegalBase);
    byId('legalList').addEventListener('click', handleLegalAction);
    byId('btnCopyLegalSummary').addEventListener('click', copyLegalSummary);

    byId('btnAddAgent').addEventListener('click', addOrUpdateAgent);
    byId('agentsList').addEventListener('click', handleAgentAction);
    byId('btnExportBackup').addEventListener('click', exportBackup);
    byId('restoreFile').addEventListener('change', restoreBackup);
    byId('btnClearData').addEventListener('click', clearLocalData);
    byId('reserveTemplateSearch').addEventListener('input', renderReserveModels);
    byId('reserveTemplateType').addEventListener('change', renderReserveModels);
    byId('reserveTemplatesList').addEventListener('click', handleReserveModelAction);
  }

  function handleFormInput(event) {
    if (event.target && event.target.id === 'agentName') syncAuthorSignature(false);
    if (event.target && event.target.id === 'agentQuality') syncAuthorSignature(false);
    debouncePreview();
  }

  function debouncePreview() {
    clearTimeout(state.previewTimer);
    state.previewTimer = setTimeout(updatePreview, 220);
  }

  function byId(id) { return document.getElementById(id); }
  function val(id) { const el = byId(id); return el ? el.value.trim() : ''; }
  function setVal(id, value) { const el = byId(id); if (el) el.value = value == null ? '' : value; }
  function escapeHtml(value) { return String(value ?? '').replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m])); }
  function nl2br(value) { return escapeHtml(value).replace(/\n/g, '<br>'); }
  function normalize(value) { return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
  function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

  function populateStaticControls() {
    fillSelect('docType', DOCUMENT_TYPES.map((d) => [d.id, d.label]));
    fillSelect('historyType', [['', 'Tous modèles'], ...DOCUMENT_TYPES.map((d) => [d.id, d.label])]);
    fillSelect('legalCategory', [['', 'Toutes catégories'], ...Array.from(new Set(LEGAL_BASE.map((j) => j.category))).map((c) => [c, c])]);
    fillSelect('reserveTemplateType', [['', 'Tous modèles de réserve'], ...DOCUMENT_TYPES.map((d) => [d.id, d.label])]);
    fillSelect('direction', DIRECTIONS.map((d) => [d.name, `${d.name} (${d.code})`]));
    fillSelect('settingsAgentDirection', DIRECTIONS.map((d) => [d.name, `${d.name} (${d.code})`]));
    fillSelect('adminProvince', PROVINCES.map((p) => [p, p]));
    fillSelect('companyProvince', PROVINCES.filter((p) => p !== 'Administration centrale').map((p) => [p, p]));
    populateAgentsSelect();
  }

  function fillSelect(id, options) {
    const select = byId(id);
    if (!select) return;
    select.innerHTML = options.map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join('');
  }

  function populateAgentsSelect(shouldApply = true) {
    const role = val('agentRole') || 'Inspecteur du Travail';
    const previous = val('agentSelect');
    const agents = state.store.agents.filter((a) => a.role === role && !isLegacySuggestedAgent(a));
    const options = [['', 'Saisir manuellement — aucune suggestion de nom par défaut'], ...agents.map((a) => [a.id, a.name])];
    fillSelect('agentSelect', options);
    if (previous && agents.some((a) => a.id === previous)) setVal('agentSelect', previous);
    else setVal('agentSelect', '');
    if (shouldApply && val('agentSelect')) applySelectedAgent();
  }

  function applySelectedAgent() {
    const id = val('agentSelect');
    const agent = state.store.agents.find((a) => a.id === id);
    if (!agent) return;
    setVal('agentName', agent.name);
    setVal('agentQuality', agent.quality);
    setVal('habilitation', agent.habilitation);
    setVal('opjNumber', agent.opj);
    if (agent.direction) setVal('direction', agent.direction);
    syncAuthorSignature(true);
    updatePreview();
  }

  function syncAuthorSignature(force = false) {
    const role = val('agentRole');
    const key = role === 'Contrôleur du Travail' ? 'controleur' : 'inspecteur';
    const sig = state.signatures[key] || defaultSignature(key);
    if (force || !sig.name) sig.name = val('agentName');
    if (force || !sig.quality) sig.quality = val('agentQuality') || role;
    if (!sig.datetime) sig.datetime = nowLocalInput();
    state.signatures[key] = sig;
    renderSignaturePads(false);
  }

  function renderSectors() {
    const q = normalize(val('sectorSearch'));
    const selected = getSelectedSectors();
    const list = byId('sectorsList');
    const filtered = SECTEURS.filter((s) => !q || normalize(s).includes(q));
    list.innerHTML = filtered.map((sector) => {
      const id = `sector-${slug(sector)}`;
      return `<label class="chip-check" for="${id}"><input id="${id}" type="checkbox" value="${escapeHtml(sector)}" ${selected.includes(sector) ? 'checked' : ''}> <span>${escapeHtml(sector)}</span></label>`;
    }).join('') || '<div class="empty-state">Aucun secteur trouvé.</div>';
    list.querySelectorAll('input[type="checkbox"]').forEach((cb) => cb.addEventListener('change', updatePreview));
  }

  function getSelectedSectors() {
    return Array.from(document.querySelectorAll('#sectorsList input[type="checkbox"]:checked')).map((cb) => cb.value);
  }

  function setSelectedSectors(sectors) {
    renderSectors();
    document.querySelectorAll('#sectorsList input[type="checkbox"]').forEach((cb) => { cb.checked = (sectors || []).includes(cb.value); });
  }

  function renderSignaturePads(keepCanvas = true) {
    const container = byId('signaturePads');
    const activeKey = val('agentRole') === 'Contrôleur du Travail' ? 'controleur' : 'inspecteur';
    const oldData = collectCanvasData();
    SIGNATURE_ROLES.forEach((r) => { if (!state.signatures[r.key]) state.signatures[r.key] = defaultSignature(r.key); });
    container.innerHTML = SIGNATURE_ROLES.map((role) => {
      const sig = state.signatures[role.key] || defaultSignature(role.key);
      return `
        <section class="signature-card ${role.key === activeKey ? 'author' : ''}" data-signature-card="${role.key}">
          <h4>${escapeHtml(role.title)} ${role.key === activeKey ? '<span class="badge moyenne">Auteur du PV</span>' : ''}</h4>
          <div class="signature-meta">
            <label>Nom complet<input data-sign-key="${role.key}" data-sign-field="name" type="text" value="${escapeHtml(sig.name || '')}"></label>
            <label>Qualité / fonction<input data-sign-key="${role.key}" data-sign-field="quality" type="text" value="${escapeHtml(sig.quality || role.title)}"></label>
            <label class="span-2">Date et heure<input data-sign-key="${role.key}" data-sign-field="datetime" type="datetime-local" value="${escapeHtml(sig.datetime || nowLocalInput())}"></label>
          </div>
          <canvas data-sign-canvas="${role.key}" width="720" height="220" aria-label="Signature ${escapeHtml(role.title)}"></canvas>
          <div class="signature-actions"><small>Stylo bleu numérique interne</small><button class="btn tiny ghost" data-clear-signature="${role.key}" type="button">Effacer</button></div>
        </section>`;
    }).join('');

    container.querySelectorAll('[data-sign-key]').forEach((input) => {
      input.addEventListener('input', (event) => {
        const key = event.target.dataset.signKey;
        const field = event.target.dataset.signField;
        state.signatures[key][field] = event.target.value;
        updatePreview();
      });
    });
    container.querySelectorAll('[data-clear-signature]').forEach((btn) => btn.addEventListener('click', () => clearSignature(btn.dataset.clearSignature)));
    container.querySelectorAll('canvas[data-sign-canvas]').forEach((canvas) => setupCanvas(canvas));

    if (keepCanvas) {
      Object.entries(oldData).forEach(([key, data]) => loadSignatureImage(key, data));
    } else {
      SIGNATURE_ROLES.forEach((r) => {
        if (state.signatures[r.key] && state.signatures[r.key].dataUrl) loadSignatureImage(r.key, state.signatures[r.key].dataUrl);
      });
    }
  }

  function defaultSignature(key) {
    const role = SIGNATURE_ROLES.find((r) => r.key === key);
    return { name: '', quality: role ? role.title : '', datetime: nowLocalInput(), dataUrl: '' };
  }

  function setupCanvas(canvas) {
    const key = canvas.dataset.signCanvas;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0759c9';
    ctx.lineWidth = 3.2;
    let drawing = false;
    let last = null;

    const point = (event) => {
      const rect = canvas.getBoundingClientRect();
      const pointer = event.touches ? event.touches[0] : event;
      return { x: (pointer.clientX - rect.left) * (canvas.width / rect.width), y: (pointer.clientY - rect.top) * (canvas.height / rect.height) };
    };
    const start = (event) => { event.preventDefault(); drawing = true; last = point(event); };
    const move = (event) => {
      if (!drawing) return;
      event.preventDefault();
      const p = point(event);
      ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      last = p;
    };
    const end = () => {
      if (!drawing) return;
      drawing = false;
      if (!state.signatures[key]) state.signatures[key] = defaultSignature(key);
      state.signatures[key].dataUrl = canvas.toDataURL('image/png');
      updatePreview();
    };
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', end);
    state.canvases.set(key, canvas);
  }

  function clearSignature(key) {
    const canvas = state.canvases.get(key);
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    if (!state.signatures[key]) state.signatures[key] = defaultSignature(key);
    state.signatures[key].dataUrl = '';
    updatePreview();
  }

  function collectCanvasData() {
    const data = {};
    state.canvases.forEach((canvas, key) => {
      try { data[key] = canvas.toDataURL('image/png'); } catch (_) { data[key] = ''; }
    });
    return data;
  }

  function loadSignatureImage(key, dataUrl) {
    if (!dataUrl) return;
    const canvas = state.canvases.get(key);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.onload = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(image, 0, 0, canvas.width, canvas.height); };
    image.src = dataUrl;
  }

  function handleLogoIgtUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast('Veuillez choisir une image pour le logo IGT.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      setVal('logoIgtData', dataUrl);
      try { localStorage.setItem(LOGO_KEY, dataUrl); } catch (_) { /* stockage logo optionnel */ }
      refreshLogoIgtPreview();
      updatePreview();
      toast('Logo IGT ajouté à l’en-tête du PV.');
    };
    reader.readAsDataURL(file);
  }

  function clearLogoIgt() {
    setVal('logoIgtData', '');
    byId('logoIgtFile').value = '';
    localStorage.removeItem(LOGO_KEY);
    refreshLogoIgtPreview();
    updatePreview();
    toast('Logo IGT supprimé.');
  }

  function refreshLogoIgtPreview() {
    const box = byId('logoIgtPreview');
    if (!box) return;
    const data = val('logoIgtData');
    if (data) {
      box.classList.remove('empty-logo');
      box.innerHTML = `<img src="${escapeHtml(data)}" alt="Logo IGT">`;
    } else {
      box.classList.add('empty-logo');
      box.textContent = 'Aucun logo IGT';
    }
  }

  function generateCorrectivePlan() {
    const f = collectRecord().fields;
    const selected = state.selectedInfractions || [];
    const lines = [];
    if (selected.length) {
      selected.forEach((item, index) => {
        lines.push(`${index + 1}. Régulariser : ${item.infraction}. Référence : ${item.texteViole}.`);
      });
    } else {
      lines.push('1. Produire les documents sociaux demandés et permettre leur vérification par l’Inspection du Travail.');
      lines.push('2. Mettre à jour les registres, déclarations et preuves de conformité applicables.');
      lines.push('3. Présenter les preuves de régularisation dans le délai imparti.');
    }
    if (f.regularizationDeadline) lines.push(`Délai final de régularisation : ${formatDate(f.regularizationDeadline)}.`);
    if (f.paymentDeadline) lines.push(`Délai de paiement ou transaction : ${f.paymentDeadline}.`);
    if (f.nextAction) lines.push(`Suite réservée : ${f.nextAction}.`);
    setVal('correctiveMeasures', lines.join('\n'));
    updatePreview();
    toast('Mesures correctives générées.');
  }

  function newRecord(confirmReset) {
    if (confirmReset && !confirm('Créer un nouveau PV ? Les modifications non sauvegardées seront perdues.')) return;
    state.currentId = crypto.randomUUID ? crypto.randomUUID() : `pv-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    state.selectedInfractions = [];
    state.signatures = {};
    FORM_FIELDS.forEach((id) => setVal(id, ''));
    const today = new Date();
    setVal('docType', 'pv-infraction');
    setVal('status', 'draft');
    setVal('uuid', state.currentId);
    setVal('verificationCode', shortHash(state.currentId));
    setVal('republique', 'REPUBLIQUE DEMOCRATIQUE DU CONGO');
    setVal('ministere', 'Ministère de l’Emploi, Travail et Prévoyance Sociale');
    setVal('inspection', 'Inspection Générale du Travail');
    setVal('direction', 'Administration Centrale');
    setVal('adminProvince', 'Administration centrale');
    setVal('companyProvince', 'Kinshasa');
    setVal('agentRole', 'Inspecteur du Travail');
    setVal('placeDate', `Fait à Kinshasa, le ${formatDate(today)}`);
    setVal('logoIgtData', localStorage.getItem(LOGO_KEY) || '');
    refreshLogoIgtPreview();
    populateAgentsSelect();
    setSelectedSectors([]);
    renderSignaturePads(false);
    syncAuthorSignature(true);
    renderSelectedInfractionsTable();
    updateDocPanels();
    updatePreview();
  }

  function collectRecord() {
    const fields = {};
    FORM_FIELDS.forEach((id) => { fields[id] = val(id); });
    fields.uuid = fields.uuid || state.currentId || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
    const canvasData = collectCanvasData();
    SIGNATURE_ROLES.forEach((role) => {
      if (!state.signatures[role.key]) state.signatures[role.key] = defaultSignature(role.key);
      state.signatures[role.key].dataUrl = canvasData[role.key] || state.signatures[role.key].dataUrl || '';
    });
    const existing = state.store.records.find((r) => r.id === fields.uuid) || {};
    return {
      id: fields.uuid,
      version: APP_VERSION,
      createdAt: existing.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      validatedAt: existing.validatedAt || '',
      fields,
      sectors: getSelectedSectors(),
      selectedInfractions: deepClone(state.selectedInfractions),
      signatures: deepClone(state.signatures),
      logs: Array.isArray(existing.logs) ? existing.logs.slice() : []
    };
  }

  function fillForm(record) {
    if (!record) return;
    state.currentId = record.id;
    FORM_FIELDS.forEach((id) => setVal(id, record.fields && record.fields[id] != null ? record.fields[id] : ''));
    setVal('uuid', record.id);
    state.selectedInfractions = deepClone(record.selectedInfractions || []);
    state.signatures = deepClone(record.signatures || {});
    setSelectedSectors(record.sectors || []);
    populateAgentsSelect(false);
    if (record.fields && record.fields.agentSelect) setVal('agentSelect', record.fields.agentSelect);
    refreshLogoIgtPreview();
    renderSignaturePads(false);
    renderSelectedInfractionsTable();
    updateDocPanels();
    updatePreview();
  }

  async function saveCurrent(status = 'draft') {
    const record = collectRecord();
    record.fields.status = status || record.fields.status || 'draft';
    setVal('status', record.fields.status);
    if (!record.fields.officialNumber) {
      record.fields.officialNumber = generateOfficialNumber(record);
      setVal('officialNumber', record.fields.officialNumber);
    }
    record.fields.verificationCode = await computeVerificationCode(record);
    setVal('verificationCode', record.fields.verificationCode);
    record.logs.push(logEntry(status === 'draft' ? 'Brouillon sauvegardé' : `PV enregistré (${status})`, record));
    upsertRecord(record);
    renderDashboard();
    renderHistory();
    updatePreview();
    toast(status === 'draft' ? 'Brouillon sauvegardé.' : 'PV sauvegardé.');
  }

  async function validateCurrent() {
    const record = collectRecord();
    if (!record.fields.companyName && record.fields.docType !== 'pv-non-conciliation') {
      toast('Veuillez renseigner la raison sociale de l’entreprise.');
      switchView('create');
      return;
    }
    if (!record.fields.agentName) {
      toast('Veuillez renseigner l’Inspecteur ou Contrôleur auteur du PV.');
      return;
    }
    record.fields.status = 'validated';
    record.fields.officialNumber = record.fields.officialNumber || generateOfficialNumber(record);
    record.fields.verificationCode = await computeVerificationCode(record);
    record.validatedAt = new Date().toISOString();
    record.logs.push(logEntry('PV validé avec QR Code et code de vérification', record));
    upsertRecord(record);
    fillForm(record);
    renderDashboard();
    renderHistory();
    toast('PV validé : numéro officiel, UUID, code de vérification et QR Code générés.');
  }

  function upsertRecord(record) {
    const idx = state.store.records.findIndex((r) => r.id === record.id);
    if (idx >= 0) state.store.records[idx] = record;
    else state.store.records.unshift(record);
    saveStore();
  }

  function duplicateCurrent() {
    const source = collectRecord();
    const copy = deepClone(source);
    copy.id = crypto.randomUUID ? crypto.randomUUID() : `pv-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    copy.fields.uuid = copy.id;
    copy.fields.status = 'draft';
    copy.fields.officialNumber = '';
    copy.fields.verificationCode = shortHash(copy.id);
    copy.createdAt = new Date().toISOString();
    copy.updatedAt = new Date().toISOString();
    copy.validatedAt = '';
    copy.logs = [logEntry('PV dupliqué en brouillon', copy)];
    fillForm(copy);
    toast('PV dupliqué en nouveau brouillon.');
  }

  function printDocument() {
    updatePreview();
    setTimeout(() => window.print(), 180);
  }

  function updateDocPanels() {
    const type = val('docType');
    byId('litigePanel').classList.toggle('hide', type !== 'pv-non-conciliation');
    byId('infractionsPanel').classList.toggle('hide', type === 'pv-non-conciliation' || type === 'pv-installation-cshe');
    const doc = DOCUMENT_TYPES.find((d) => d.id === type);
    byId('previewRoleBadge').textContent = `${val('agentRole') || 'Inspecteur / Contrôleur'} · ${doc ? doc.short : ''}`;
  }

  function renderInfractionsList() {
    const q = normalize(val('infractionSearch'));
    const gravity = val('gravityFilter');
    const selectedIds = new Set(state.selectedInfractions.map((i) => i.id));
    const filtered = INFRACTIONS.filter((item) => {
      const hay = normalize([item.num, item.infraction, item.texteViole, item.referenceSanction, item.keywords.join(' ')].join(' '));
      return (!q || hay.includes(q)) && (!gravity || item.gravity === gravity);
    }).slice(0, 120);
    const html = filtered.map((item) => `
      <label class="infraction-card">
        <input type="checkbox" data-infraction-id="${item.id}" ${selectedIds.has(item.id) ? 'checked' : ''}>
        <span>
          <strong>${String(item.num).padStart(2, '0')}. ${escapeHtml(item.infraction)}</strong>
          <p><b>Texte violé :</b> ${escapeHtml(item.texteViole)}</p>
          <p><b>Réf. sanction :</b> ${escapeHtml(item.referenceSanction)} · <b>Amende :</b> ${formatUSD(item.amountUSD)} ${escapeHtml(item.unit)}</p>
          <span class="badges"><em class="badge ${gravityClass(item.gravity)}">${escapeHtml(item.gravity)}</em><em class="badge">${escapeHtml(item.id)}</em></span>
        </span>
      </label>`).join('');
    byId('infractionsList').innerHTML = html || '<div class="empty-state">Aucune infraction trouvée.</div>';
    byId('infractionsList').querySelectorAll('input[data-infraction-id]').forEach((cb) => cb.addEventListener('change', (event) => {
      const id = event.target.dataset.infractionId;
      if (event.target.checked) addInfraction(id); else removeInfraction(id);
    }));
  }

  function addInfraction(id) {
    if (state.selectedInfractions.some((i) => i.id === id)) return;
    const base = INFRACTIONS.find((i) => i.id === id);
    if (!base) return;
    state.selectedInfractions.push({ ...deepClone(base), quantity: 1, amountUSD: base.amountUSD });
    renderSelectedInfractionsTable();
    renderInfractionsList();
    updatePreview();
  }

  function removeInfraction(id) {
    state.selectedInfractions = state.selectedInfractions.filter((i) => i.id !== id);
    renderSelectedInfractionsTable();
    renderInfractionsList();
    updatePreview();
  }

  function renderSelectedInfractionsTable() {
    const tbody = byId('selectedInfractionsTable').querySelector('tbody');
    tbody.innerHTML = state.selectedInfractions.map((item, index) => `
      <tr data-selected-id="${item.id}">
        <td>${String(index + 1).padStart(2, '0')}</td>
        <td><strong>${escapeHtml(item.infraction)}</strong><br><small>${escapeHtml(item.referenceSanction || '')}</small></td>
        <td>${escapeHtml(item.texteViole)}</td>
        <td><span class="badge ${gravityClass(item.gravity)}">${escapeHtml(item.gravity)}</span></td>
        <td><input data-edit-field="quantity" type="number" min="1" value="${Number(item.quantity || 1)}"></td>
        <td><input data-edit-field="amountUSD" type="number" min="0" step="1" value="${Number(item.amountUSD || 0)}"></td>
        <td><strong>${formatUSD((Number(item.quantity || 1) * Number(item.amountUSD || 0)))}</strong></td>
        <td><button class="btn tiny danger" data-remove-selected="${item.id}" type="button">×</button></td>
      </tr>`).join('');
    byId('totalAmountCell').textContent = formatUSD(totalAmount());
  }

  function handleSelectedInfractionEdit(event) {
    const row = event.target.closest('tr[data-selected-id]');
    if (!row) return;
    const item = state.selectedInfractions.find((i) => i.id === row.dataset.selectedId);
    if (!item) return;
    const field = event.target.dataset.editField;
    if (field) item[field] = Number(event.target.value || 0);
    renderSelectedInfractionsTable();
    updatePreview();
  }

  function handleSelectedInfractionClick(event) {
    const btn = event.target.closest('[data-remove-selected]');
    if (btn) removeInfraction(btn.dataset.removeSelected);
  }

  function totalAmount() {
    return state.selectedInfractions.reduce((sum, item) => sum + (Number(item.quantity || 1) * Number(item.amountUSD || 0)), 0);
  }

  function analyzeFacts() {
    const facts = normalize(val('facts'));
    if (!facts) { toast('Décrivez d’abord les faits à analyser.'); return; }
    const scored = INFRACTIONS.map((item) => {
      const hay = [item.infraction, item.texteViole, item.referenceSanction, item.keywords.join(' ')].map(normalize).join(' ');
      let score = 0;
      item.keywords.forEach((k) => { if (facts.includes(normalize(k))) score += 3; });
      normalize(item.infraction).split(/\s+/).filter((w) => w.length > 4).forEach((w) => { if (facts.includes(w)) score += 1; });
      if (facts.includes('refus') && normalize(item.infraction).includes('obstacle')) score += 8;
      if (facts.includes('contrat') && hay.includes('contrat')) score += 4;
      return { item, score };
    }).filter((r) => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 8);

    if (!scored.length) {
      byId('aiOutput').textContent = 'Aucune infraction fortement liée aux faits. Complétez les détails ou recherchez manuellement dans la base.';
      return;
    }
    const lines = scored.map((r, idx) => `${idx + 1}. ${r.item.infraction}\n   Texte violé : ${r.item.texteViole}\n   Gravité : ${r.item.gravity} · Amende suggérée : ${formatUSD(r.item.amountUSD)} · Score IA : ${r.score}`).join('\n\n');
    byId('aiOutput').textContent = `Infractions proposées par l’IA locale :\n\n${lines}\n\nCliquez sur « Ajouter les propositions » pour les sélectionner.`;
    const btn = document.createElement('button');
    btn.className = 'btn secondary';
    btn.type = 'button';
    btn.textContent = 'Ajouter les propositions';
    btn.addEventListener('click', () => {
      scored.slice(0, 5).forEach((r) => addInfraction(r.item.id));
      toast('Propositions IA ajoutées aux infractions sélectionnées.');
    });
    byId('aiOutput').appendChild(document.createElement('br'));
    byId('aiOutput').appendChild(btn);
  }

  function suggestArticles() {
    const selected = state.selectedInfractions.length ? state.selectedInfractions : INFRACTIONS.slice(0, 8);
    const text = selected.map((i) => `• ${i.infraction}\n  Articles violés : ${i.texteViole}\n  Référence sanction : ${i.referenceSanction}\n  Gravité : ${i.gravity}`).join('\n\n');
    byId('aiOutput').textContent = `Articles et références suggérés :\n\n${text}`;
  }

  function generateObservations() {
    const record = collectRecord();
    const f = record.fields;
    let obs = '';
    const role = f.agentRole || 'Inspecteur du Travail';
    if (f.docType === 'pv-obstruction') {
      obs = `Il ressort des faits que le responsable présent n’a pas permis à ${role.toLowerCase()} d’accomplir la mission officielle de contrôle, malgré la présentation ou la référence à l’ordre de mission ${f.missionOrder || 'susmentionné'}. Ce comportement est susceptible de constituer une obstruction au sens de l’article 322 du Code du Travail.`;
    } else if (f.docType === 'pv-non-conciliation') {
      obs = `Après audition des parties et examen des pièces communiquées, la tentative de conciliation n’a pas abouti. Les positions demeurent divergentes. Le présent procès-verbal de non-conciliation est établi conformément aux dispositions applicables afin de permettre aux parties de se pourvoir devant la juridiction compétente.`;
    } else if (f.docType === 'mise-demeure') {
      obs = `L’entreprise est mise en demeure de se conformer aux prescriptions de la législation du travail dans le délai imparti. À défaut, les mesures et sanctions prévues par les textes en vigueur pourront être appliquées.`;
    } else {
      const count = state.selectedInfractions.length;
      obs = `Les constatations effectuées au sein de l’entreprise ${f.companyName || 'contrôlée'} font apparaître ${count || 'plusieurs'} irrégularité(s) au regard du Code du Travail et de ses mesures d’application. Nonobstant le paiement des amendes transactionnelles, l’entreprise reste tenue de se conformer aux prescriptions légales dans un bref délai.`;
    }
    setVal('observations', obs);
    byId('aiOutput').textContent = `Observations générées :\n\n${obs}`;
    updatePreview();
  }

  function autoDraft() {
    const record = collectRecord();
    const text = generatePlainDraft(record);
    setVal('observations', text);
    byId('aiOutput').textContent = `Rédaction IA locale du modèle « ${documentLabel(record.fields.docType)} » :\n\n${text}`;
    updatePreview();
  }

  function generatePlainDraft(record) {
    const f = record.fields;
    const role = f.agentRole || 'Inspecteur du Travail';
    const company = f.companyName || 'l’entreprise contrôlée';
    const facts = f.facts || 'les faits constatés lors de la mission officielle de contrôle';
    if (f.docType === 'pv-obstruction') {
      return `En effet, nous étions dans l’impossibilité d’accomplir la mission qui nous est dévolue par la loi, ayant été l’objet d’une obstruction par le responsable de ${company}. Les faits relevés sont les suivants : ${facts}. Ces agissements sont rappelés au regard de l’article 322 du Code du Travail.`;
    }
    if (f.docType === 'pv-non-conciliation') {
      return `Il découle des déclarations des parties et de l’examen des pièces versées au dossier que le litige oppose ${f.demandeur || 'le demandeur'} à ${f.defender || company}. Malgré la tentative de conciliation, les parties ne sont pas parvenues à concilier leurs désaccords. En foi de quoi, le présent procès-verbal de non-conciliation est dressé.`;
    }
    if (f.docType === 'mise-demeure') {
      return `Par la présente, je vous mets en demeure de donner accès libre à la mission de contrôle et/ou de fournir les documents demandés dans le délai imparti à compter de la réception du présent courrier. À défaut, les sanctions prévues par les textes en vigueur seront appliquées.`;
    }
    if (f.docType === 'pv-installation-cshe') {
      return `Conformément aux dispositions des articles 167 à 169 du Code du Travail et de l’arrêté ministériel n°12/CAB.MIN/ETPS/043/2008 du 08 août 2008, il a été procédé à l’installation du Comité de Sécurité, d’Hygiène et d’Embellissement des lieux de travail au sein de ${company}.`;
    }
    const infra = state.selectedInfractions.map((i) => i.infraction).join('; ') || 'infractions sélectionnées dans la base officielle';
    return `Avons effectué une mission officielle de contrôle au sein de ${company}. Au cours de ladite mission, les faits suivants ont été relevés : ${facts}. Après analyse des pièces et déclarations, les infractions suivantes sont retenues : ${infra}. Ces amendes sont mises à la charge de l’entreprise sans préjudice de son obligation de se conformer aux prescriptions légales.`;
  }

  function updatePreview() {
    const record = collectRecord();
    byId('printArea').innerHTML = buildDocumentHTML(record);
    byId('printArea').classList.toggle('zoomed', state.previewZoomed);
    const doc = DOCUMENT_TYPES.find((d) => d.id === record.fields.docType);
    byId('previewRoleBadge').textContent = `${record.fields.agentRole || 'Inspecteur / Contrôleur'} · ${doc ? doc.short : ''}`;
  }

  function buildDocumentHTML(record) {
    switch (record.fields.docType) {
      case 'pv-obstruction': return buildObstruction(record);
      case 'pv-non-conciliation': return buildNonConciliation(record);
      case 'mise-demeure': return buildMiseEnDemeure(record);
      case 'pv-installation-cshe': return buildInstallationCSHE(record);
      case 'pv-infraction':
      default: return buildInfraction(record);
    }
  }

  function logoMarkup(f) {
    return f.logoIgtData ? `<img class="igt-logo" src="${escapeHtml(f.logoIgtData)}" alt="Logo IGT">` : '<div class="arms">★</div>';
  }

  function officialHeader(record, options = {}) {
    const f = record.fields;
    const right = options.right || (f.placeDate || `Kinshasa, le ${formatDate(new Date())}`);
    return `
      <header class="official-head">
        <div class="official-left">
          <div>${escapeHtml(f.republique || 'REPUBLIQUE DEMOCRATIQUE DU CONGO')}</div>
          <div>${escapeHtml(f.ministere || 'Ministère de l’Emploi et Travail')}</div>
          ${logoMarkup(f)}
          <div>${escapeHtml(f.direction || 'Administration Centrale')}</div>
          <div>${escapeHtml(f.inspection || 'Inspection Générale du Travail')}</div>
          <div>I.G.T</div>
        </div>
        <div></div>
        <div class="official-right">${escapeHtml(right)}</div>
      </header>`;
  }

  function buildInfraction(record) {
    const f = record.fields;
    const total = selectedTotal(record);
    const legalDate = legalDatePhrase(new Date());
    const table = record.selectedInfractions.length ? record.selectedInfractions.map((item, idx) => `
      <tr>
        <td style="text-align:center">${String(idx + 1).padStart(2, '0')}.</td>
        <td>${escapeHtml(item.infraction)}</td>
        <td>${escapeHtml(item.texteViole)}</td>
        <td>${formatAmendeLine(item)}</td>
      </tr>`).join('') : `<tr><td colspan="4" style="text-align:center">Aucune infraction sélectionnée</td></tr>`;
    return `
      <article class="a4-page">
        ${officialHeader(record)}
        <h2 class="doc-title">PROCES-VERBAL DE CONSTAT D’INFRACTION</h2>
        <div class="pv-number">N° ${escapeHtml(f.officialNumber || generateOfficialNumber(record))}</div>
        <section class="pv-body">
          <p>L’an ${legalDate.yearLetters}, le ${legalDate.dayLetters} jour du mois de ${legalDate.monthName} ;</p>
          <p>Nous ${escapeHtml(f.agentName || '................................')}, ${escapeHtml(f.agentQuality || `${f.agentRole || 'Inspecteur du Travail'} en compétence territoriale générale et officier de police judiciaire à compétence matérielle restreinte en matière du travail`)}, dûment assermenté sous le numéro d’habilitation ${escapeHtml(f.habilitation || '........................')} ;</p>
          <p>Agissant en vertu des dispositions légales en la matière, notamment en ses articles 187, 196 et 197 de la loi n°015-2002 du 16 octobre 2002 portant Code du Travail, telle que modifiée et complétée à ce jour ainsi que ses mesures d’applications ; en exécution de l’ordre de mission ${escapeHtml(f.missionOrder || '........................')} ;</p>
          <p>Avons effectué une mission officielle de contrôle au sein de l’entreprise <strong>${escapeHtml(companyFullName(f))}</strong> sise ${escapeHtml(f.companyAddress || '........................................................')} ${f.commune ? `, Commune/Territoire de ${escapeHtml(f.commune)}` : ''} ${f.companyProvince ? `dans la ville/province de ${escapeHtml(f.companyProvince)}` : ''} ;</p>
          <p>Avons constaté les infractions suivantes à la charge de l’entreprise précitée, en violation des dispositions du Code du Travail et de l’arrêté interministériel n°CAB/MIN/ETPS/CNM/HMK/JBI/006/09/2023 et n°CAB/MIN/FINANCES/127/09/2023 du 03/10/2023 portant fixation des taux des droits, taxes et redevances à percevoir à l’initiative du Ministère de l’Emploi, Travail et Prévoyance Sociale, en présence de ${escapeHtml(f.presentManager || '................................')} en qualité de ${escapeHtml(f.managerFunction || '................................')}.</p>
          ${f.facts ? `<p><strong>Faits constatés :</strong> ${nl2br(f.facts)}</p>` : ''}
          <h3 style="text-align:center;text-transform:uppercase;margin:.9rem 0 .35rem">LES CONTRAVENTIONS CI-DESSOUS</h3>
          <table class="pv-table">
            <thead><tr><th style="width:9%">N°</th><th>INFRACTIONS</th><th style="width:28%">TEXTE VIOLE</th><th style="width:21%">AMENDE TRANSACTIONNELLE</th></tr></thead>
            <tbody>${table}</tbody>
          </table>
          <p class="amount-line">Total général : ${formatUSD(total)}</p>
          <p class="letter-amount">En lettre : ${escapeHtml(amountInLetters(total))} dollars américains.</p>
          <p>Ces amendes sont mises à sa charge suite aux infractions constatées au regard des dispositions du Ministère de l’Emploi et du Travail. L’entreprise est obligée de se soumettre aux prescriptions de la loi dans un bref délai. En outre, nonobstant le paiement desdites amendes, elle reste tenue à toutes les obligations légales définies en la matière.</p>
          ${f.observations ? `<p><strong>Observations :</strong> ${nl2br(f.observations)}</p>` : ''}
          ${followUpBlock(record)}
          <p>En foi de quoi, nous avons établi le présent procès-verbal d’infraction en quatre ampliations dont chacune sera transmise à qui de droit conformément aux dispositions légales susmentionnées.</p>
          <p>Fait au jour, mois et an que dessus. Nous jurons le présent Procès-Verbal sincère.</p>
          <p><strong>${escapeHtml(f.placeDate || `Fait à Kinshasa, le ${formatDate(new Date())}`)}</strong></p>
        </section>
        ${signaturesPreview(record, ['representant', activeAuthorKey(record), 'temoin'])}
        ${securityBlock(record)}
      </article>`;
  }

  function buildObstruction(record) {
    const f = record.fields;
    const legalDate = legalDatePhrase(new Date());
    return `
      <article class="a4-page">
        ${officialHeader(record)}
        <h2 class="doc-title">PROCES-VERBAL CONSTAT D’INFRACTION<br>POUR OBSTRUCTION</h2>
        <div class="pv-number">N° ${escapeHtml(f.officialNumber || generateOfficialNumber(record))}</div>
        <section class="pv-body">
          <p>L’an ${legalDate.yearLetters}, le ${legalDate.dayLetters} jour du mois de ${legalDate.monthName} ;</p>
          <p>Par devant nous, ${escapeHtml(f.agentName || '................................')}, ${escapeHtml(f.agentQuality || `${f.agentRole || 'Inspecteur du Travail'} et Officier de Police Judiciaire à compétence restreinte en matière du travail près l’Inspection Générale du Travail`)}, dûment assermenté, avons été en visite d’Inspection Spéciale du Travail sous l’ordre de mission ${escapeHtml(f.missionOrder || '........................')} au sein de ${escapeHtml(companyFullName(f))} sise ${escapeHtml(f.companyAddress || '................................')}.</p>
          <p>En effet, nous étions dans l’impossibilité d’accomplir la mission qui nous est dévolue par la loi et nous avons été l’objet d’une obstruction totale par le responsable de la société susmentionnée, ${escapeHtml(f.presentManager || '................................')} ${f.managerFunction ? `en qualité de ${escapeHtml(f.managerFunction)}` : ''}; nous référant aux dispositions de l’Ordonnance-loi n°16/010 du 15 juillet 2016 modifiant et complétant la loi n°015-2002 portant Code du Travail à son article 322 et aux instructions rappelant à tous les employeurs le respect strict du Code du Travail et de ses mesures d’application.</p>
          ${f.facts ? `<p><strong>Faits d’obstruction :</strong> ${nl2br(f.facts)}</p>` : ''}
          ${f.observations ? `<p><strong>Observations :</strong> ${nl2br(f.observations)}</p>` : ''}
          ${followUpBlock(record)}
          <p>En foi de quoi, nous avons établi ce procès-verbal de constat d’obstruction en trois ampliations dont chacune sera remise au Ministère ayant la charge de l’Emploi et Travail, au Procureur près le Parquet compétent pour disposition et au contrevenant.</p>
          <p>Nous jurons que ce procès-verbal est sincère.</p>
          <p><strong>${escapeHtml(f.placeDate || `Fait à Kinshasa, le ${formatDate(new Date())}`)}</strong></p>
        </section>
        ${signaturesPreview(record, ['representant', activeAuthorKey(record), 'temoin'])}
        ${securityBlock(record)}
      </article>`;
  }

  function buildNonConciliation(record) {
    const f = record.fields;
    const legalDate = legalDatePhrase(new Date());
    return `
      <article class="a4-page">
        ${officialHeader(record)}
        <h2 class="doc-title">PROCES-VERBAL DE NON CONCILIATION DE LITIGE INDIVIDUEL DU TRAVAIL</h2>
        <div class="pv-number">N° ${escapeHtml(f.officialNumber || generateOfficialNumber(record))}</div>
        <section class="pv-body">
          <p>L’an ${legalDate.yearLetters}, le ${legalDate.dayLetters} jour du mois de ${legalDate.monthName}, Nous, ${escapeHtml(f.agentName || '................................')}, ${escapeHtml(f.agentQuality || `${f.agentRole || 'Inspecteur du Travail'} et Officier de Police Judiciaire à compétence restreinte en matière du Travail`)}, dûment assermenté et identifié sous les numéros ${escapeHtml([f.habilitation, f.opjNumber].filter(Boolean).join(' et ') || '........................')}, affecté à ${escapeHtml(f.inspection || 'l’Inspection Générale du Travail')}, nous trouvant à ${escapeHtml(f.adminProvince || 'Kinshasa')}.</p>
          <p>${escapeHtml(f.demandeur || 'Monsieur/Madame ................................')} ${f.demandeurId ? `identifié(e) sous ${escapeHtml(f.demandeurId)}` : ''}, demandeur d’une part ;</p>
          <p>La société ${escapeHtml(f.defender || companyFullName(f) || '................................')}, défenderesse d’autre part ;</p>
          <p><strong>Entendons le demandeur qui déclare :</strong> ${nl2br(f.claimantStatement || f.facts || '................................................................................................................................')}</p>
          <h3>I. CONSTAT DE ${escapeHtml((f.agentRole || 'L’INSPECTEUR DU TRAVAIL').toUpperCase())}</h3>
          <p>Il découle des déclarations des parties et de l’épluchage des pièces versées au dossier, toutes considérations faites, ce qui suit :</p>
          <p>${nl2br(f.laborOfficerFindings || 'Que les parties ont été entendues contradictoirement et que les pièces communiquées ont été examinées ;')}</p>
          <h3>II. CONCLUSION</h3>
          <p>${nl2br(f.conclusion || 'Eu égard à ce qui précède, les prétentions et moyens des parties sont actés au présent procès-verbal.')}</p>
          <h3>III. PROPOSITION</h3>
          <p>${nl2br(f.proposal || 'Une solution amiable a été proposée aux parties conformément aux dispositions applicables du Code du Travail.')}</p>
          <h3>IV. DESACCORD DES PARTIES</h3>
          <p>${nl2br(f.disagreement || 'Après une tentative de conciliation, les deux parties ne sont pas parvenues à concilier leurs désaccords.')}</p>
          ${followUpBlock(record)}
          <p>En foi de quoi, le présent procès-verbal est dressé et signé en quatre exemplaires par les parties et nous-mêmes dont chacune a reçu un original.</p>
          <p>Jurons que le présent Procès-Verbal est sincère.</p>
        </section>
        ${signaturesPreview(record, ['representant', activeAuthorKey(record), 'temoin'])}
        ${securityBlock(record)}
      </article>`;
  }

  function buildMiseEnDemeure(record) {
    const f = record.fields;
    return `
      <article class="a4-page">
        <header class="official-head">
          <div class="official-left">
            <div>${escapeHtml(f.republique || 'République Démocratique du Congo')}</div>
            <div>${escapeHtml(f.ministere || 'Ministère de l’Emploi, Travail')}</div>
            <div>${escapeHtml(f.inspection || 'INSPECTION GENERALE DU TRAVAIL')}</div>
            ${logoMarkup(f)}
            <br>
            <div style="text-align:left;text-transform:none;font-weight:700">
              OPJ : ${escapeHtml(f.agentName || '................................')}<br>
              ${escapeHtml(f.agentRole || 'Inspecteur du Travail')}<br>
              ${escapeHtml(f.direction || 'Administration Centrale')}<br>
              ${escapeHtml(f.localInspection || '')}
            </div>
          </div>
          <div></div>
          <div class="official-right">${escapeHtml(f.placeDate || `Kinshasa, le ${formatDate(new Date())}`)}</div>
        </header>
        <section class="pv-body" style="margin-top:1rem">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;align-items:start">
            <div>
              <p><strong>Transmis copie pour Information</strong></p>
              <p>- À l’Inspection Générale du Travail<br>- Au Président du Tribunal du Travail compétent<br>- Au Procureur Général près la Cour d’Appel compétente</p>
            </div>
            <div>
              <p><strong>Concerne : MISE EN DEMEURE</strong><br>pour ${escapeHtml(f.facts ? 'faits relevés lors de la mission de contrôle' : 'refus de contrôle suite à la mission de contrôle de l’Inspection du Travail')}<br>${escapeHtml(f.missionOrder || '')}</p>
              <p>Au Responsable de <strong>${escapeHtml(companyFullName(f) || '................................')}</strong></p>
            </div>
          </div>
          <p> Monsieur,</p>
          <p>Je vous écris suite à la mission de contrôle référencée ci-dessus et aux échanges intervenus avec vos services concernant l’accès à l’entreprise et/ou la production des documents sollicités.</p>
          <p>${f.facts ? nl2br(f.facts) : 'Or, jusqu’à ce jour, nous avons tenté de vous recontacter pour nous recevoir, mais nous avons remarqué que vous ne manifestez plus cette volonté. Ce refus de nous recevoir constitue une violation au regard des dispositions des articles 186, 187 et 197 du Code du Travail congolais.'}</p>
          <p>Par la présente, je vous mets en demeure de donner accès libre à notre mission et de fournir les documents demandés dans un délai de 24 heures à compter de la réception de ce courrier.</p>
          <p>Je vous rappelle qu’en l’absence de réponse ou en cas de maintien de votre refus de contrôle, je me verrai contraint de saisir la juridiction compétente ou d’appliquer les sanctions prévues dans l’arrêté n°CAB/MIN/ETPS/CNM/HMK/JBI/006/09/2023 et n°CAB/MIN/FINANCES/127/09/2023 du 03/10/2023 portant fixation des taux des droits, taxes et redevances à percevoir à l’initiative du Ministère de l’Emploi, Travail et Prévoyance Sociale.</p>
          ${f.observations ? `<p>${nl2br(f.observations)}</p>` : ''}
          ${followUpBlock(record)}
          <p>Veuillez considérer cette lettre comme une mise en demeure formelle.</p>
          <p>Cordialement.</p>
          <p><strong>${escapeHtml(f.placeDate || `Fait à Kinshasa, le ${formatDate(new Date())}`)}</strong></p>
        </section>
        ${signaturesPreview(record, [activeAuthorKey(record)])}
        ${securityBlock(record)}
      </article>`;
  }

  function buildInstallationCSHE(record) {
    const f = record.fields;
    const legalDate = legalDatePhrase(new Date());
    const sectors = (record.sectors || []).join(', ');
    return `
      <article class="a4-page">
        ${officialHeader(record, { right: f.placeDate || `Kinshasa, le ${formatDate(new Date())}` })}
        <h2 class="doc-title">PROCES-VERBAL D’INSTALLATION DU COMITE DE SECURITE, D’HYGIENE ET D’EMBELLISSEMENT DES LIEUX DE TRAVAIL</h2>
        <section class="pv-body">
          <p>L’an ${legalDate.yearLetters}, le ${legalDate.dayLetters} jour du mois de ${legalDate.monthName}, il s’est tenu au sein de ${escapeHtml(companyFullName(f) || '................................')}, une réunion paritaire entre l’Employeur et les Travailleurs.</p>
          <p>Conformément aux dispositions des articles 167-169 du Code du Travail et de l’arrêté ministériel n°12/CAB.MIN/ETPS/043/2008 du 08 août 2008 fixant les conditions d’organisation et de fonctionnement du Comité de Sécurité, d’Hygiène et d’Embellissement des lieux de travail.</p>
          <p>Nous soussigné, ${escapeHtml(f.agentName || '................................')}, ${escapeHtml(f.agentQuality || `${f.agentRole || 'Contrôleur du Travail'} et Officier de Police Judiciaire`)}, avons procédé ce jour à la cérémonie d’installation dudit Comité. Il s’agit de :</p>
          <ol>
            <li>....................................................... : <strong>Président</strong></li>
            <li>....................................................... : <strong>Vice-Président, chargé de l’Hygiène et Sécurité au travail</strong></li>
            <li>....................................................... : <strong>Secrétaire</strong></li>
          </ol>
          <p><strong>Membres :</strong></p>
          <ol>
            <li>.................................................................</li>
            <li>.................................................................</li>
            <li>.................................................................</li>
            <li>.................................................................</li>
            <li>.................................................................</li>
          </ol>
          ${sectors ? `<p><strong>Secteur(s) d’activité :</strong> ${escapeHtml(sectors)}</p>` : ''}
          ${f.observations ? `<p><strong>Observations :</strong> ${nl2br(f.observations)}</p>` : ''}
          ${followUpBlock(record)}
          <p>Les parties acceptent de se réunir après chaque trois mois pour évaluation.</p>
          <p>En foi de quoi le présent procès-verbal d’installation est délivré pour servir et valoir ce que de droit.</p>
          <p style="text-align:center;font-weight:900;margin-top:2rem">Visa de l’Inspection du Travail</p>
        </section>
        ${signaturesPreview(record, ['representant', activeAuthorKey(record), 'temoin'])}
        ${securityBlock(record)}
      </article>`;
  }

  function followUpBlock(record) {
    const f = record.fields || {};
    const items = [];
    if (f.documentsRequested) items.push(`<p><strong>Pièces consultées ou demandées :</strong> ${nl2br(f.documentsRequested)}</p>`);
    if (f.correctiveMeasures) items.push(`<p><strong>Mesures correctives demandées :</strong> ${nl2br(f.correctiveMeasures)}</p>`);
    if (f.regularizationDeadline) items.push(`<p><strong>Date limite de régularisation :</strong> ${escapeHtml(formatDate(f.regularizationDeadline))}</p>`);
    if (f.paymentDeadline) items.push(`<p><strong>Délai de paiement / transaction :</strong> ${escapeHtml(f.paymentDeadline)}</p>`);
    if (f.riskLevel) items.push(`<p><strong>Niveau d’urgence / risque :</strong> ${escapeHtml(f.riskLevel)}</p>`);
    if (f.nextAction) items.push(`<p><strong>Suite réservée :</strong> ${escapeHtml(f.nextAction)}</p>`);
    if (!items.length) return '';
    return `<section class="followup-preview"><h3>Suivi de régularisation</h3>${items.join('')}</section>`;
  }

  function signaturesPreview(record, keys) {
    const unique = Array.from(new Set(keys.filter(Boolean)));
    const blocks = unique.map((key) => {
      const role = SIGNATURE_ROLES.find((r) => r.key === key) || { title: key };
      const sig = record.signatures && record.signatures[key] ? record.signatures[key] : defaultSignature(key);
      const date = sig.datetime ? formatDateTime(sig.datetime) : '';
      return `<div class="sign-preview">
        <strong>${escapeHtml(role.title)}</strong><br>
        ${sig.dataUrl ? `<img src="${sig.dataUrl}" alt="Signature ${escapeHtml(role.title)}">` : '<div style="height:54px"></div>'}
        <span class="blue-sign">${escapeHtml(sig.name || 'Nom : ................................')}</span><br>
        <small>${escapeHtml(sig.quality || 'Fonction : ................................')}</small><br>
        <small>${escapeHtml(date)}</small>
      </div>`;
    }).join('');
    return `<section class="signatures-preview">${blocks}</section>`;
  }

  function securityBlock(record) {
    const f = record.fields;
    const payload = `PV|N=${(f.officialNumber || '').slice(0, 42)}|ID=${record.id.slice(0, 12)}|C=${(f.verificationCode || shortHash(record.id)).slice(0, 16)}|R=${(f.agentRole || '').slice(0, 2)}`;
    const logs = (record.logs || []).slice(-2).map((l) => `${formatDateTime(l.at)} — ${l.action}`).join('<br>');
    return `
      <section class="security-row">
        <div>
          <div class="qr-box">
            ${makeQrSvg(payload, 92)}
            <div>
              <strong>QR Code sécurisé</strong><br>
              UUID : ${escapeHtml(record.id)}<br>
              Code : ${escapeHtml(f.verificationCode || shortHash(record.id))}<br>
              Auteur : ${escapeHtml(f.agentRole || '')}<br>
              ${logs ? `<span>Journal :<br>${logs}</span>` : ''}
            </div>
          </div>
        </div>
      </section>
      <footer class="secure-foot"><span>InspecteurBot IA RDC · signature numérique interne au stylo bleu · ${escapeHtml(APP_VERSION)}</span><span>${escapeHtml(f.officialNumber || '')}</span></footer>`;
  }

  function activeAuthorKey(record) {
    return (record.fields.agentRole || val('agentRole')) === 'Contrôleur du Travail' ? 'controleur' : 'inspecteur';
  }

  function formatAmendeLine(item) {
    const q = Number(item.quantity || 1);
    const amount = Number(item.amountUSD || 0);
    if (q > 1) return `${formatUSD(amount)} ${escapeHtml(item.unit || 'par violation')}<br>${q} × ${formatUSD(amount)} = <strong>${formatUSD(q * amount)}</strong>`;
    return `<strong>${formatUSD(amount)}</strong>`;
  }

  function selectedTotal(record) {
    return (record.selectedInfractions || []).reduce((sum, item) => sum + Number(item.quantity || 1) * Number(item.amountUSD || 0), 0);
  }

  function companyFullName(f) {
    return [f.companyName, f.companyLegalForm].filter(Boolean).join(' ');
  }

  function generateOfficialNumber(record) {
    const f = record.fields || record;
    const seq = String(nextSequence()).padStart(2, '0');
    const roleCode = (f.agentRole || 'Inspecteur du Travail').startsWith('Contrôleur') ? 'CT' : 'IT';
    const dir = DIRECTIONS.find((d) => d.name === f.direction);
    const dirCode = dir ? dir.code : 'ADMC';
    const initials = initialsOf(f.agentName || 'PV');
    const date = new Date();
    const year = date.getFullYear();
    const month = monthName(date).toUpperCase();
    return `${seq}/MET/IGT/${dirCode}/${roleCode}/OPJ/${initials}/${month}/${year}`;
  }

  function nextSequence() {
    const year = new Date().getFullYear();
    return state.store.records.filter((r) => String(r.createdAt || '').startsWith(String(year))).length + 1;
  }

  function initialsOf(name) {
    return String(name || '').split(/\s+/).filter(Boolean).map((p) => p[0]).join('').toUpperCase().slice(0, 5) || 'PV';
  }

  async function computeVerificationCode(record) {
    const data = JSON.stringify({ id: record.id, number: record.fields.officialNumber, type: record.fields.docType, role: record.fields.agentRole, company: record.fields.companyName, infractions: record.selectedInfractions.map((i) => [i.id, i.quantity, i.amountUSD]), createdAt: record.createdAt });
    if (crypto.subtle) {
      const bytes = new TextEncoder().encode(data);
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      const hex = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      return `${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
    }
    return shortHash(data);
  }

  function shortHash(text) {
    let h = 2166136261;
    for (let i = 0; i < String(text).length; i++) {
      h ^= String(text).charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const hex = (h >>> 0).toString(16).toUpperCase().padStart(8, '0');
    return `${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
  }

  function logEntry(action, record) {
    return { at: new Date().toISOString(), action, author: record.fields.agentName || '', role: record.fields.agentRole || '', number: record.fields.officialNumber || '' };
  }

  function renderDashboard() {
    const records = state.store.records;
    byId('statTotal').textContent = records.length;
    byId('statDrafts').textContent = records.filter((r) => r.fields && r.fields.status === 'draft').length;
    byId('statValidated').textContent = records.filter((r) => r.fields && r.fields.status === 'validated').length;
    byId('statCompanies').textContent = new Set(records.map((r) => normalize(r.fields && r.fields.companyName)).filter(Boolean)).size;
    byId('statInfractions').textContent = records.reduce((sum, r) => sum + ((r.selectedInfractions || []).length), 0);
    byId('statAmount').textContent = formatUSD(records.reduce((sum, r) => sum + selectedTotal(r), 0));

    const logs = records.flatMap((r) => (r.logs || []).map((l) => ({ ...l, id: r.id, company: r.fields.companyName, type: r.fields.docType }))).sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 8);
    byId('recentActivity').classList.toggle('empty-state', logs.length === 0);
    byId('recentActivity').innerHTML = logs.length ? logs.map((l) => `
      <div class="activity-item"><span class="activity-dot"></span><div><strong>${escapeHtml(l.action)}</strong><small>${escapeHtml(l.number || documentLabel(l.type))} · ${escapeHtml(l.company || 'Sans entreprise')} · ${escapeHtml(l.role || '')}</small></div><small>${escapeHtml(formatDateTime(l.at))}</small></div>`).join('') : 'Aucune activité enregistrée.';
    renderMonthlyStats(records);
  }

  function renderMonthlyStats(records) {
    const now = new Date();
    const buckets = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      buckets.push({ key, label: d.toLocaleDateString('fr-FR', { month: 'short' }), count: 0 });
    }
    records.forEach((r) => {
      const d = new Date(r.createdAt || r.updatedAt || Date.now());
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const b = buckets.find((x) => x.key === key);
      if (b) b.count += 1;
    });
    const max = Math.max(1, ...buckets.map((b) => b.count));
    byId('monthlyStats').innerHTML = buckets.map((b) => `<div class="bar" title="${b.count} PV"><div class="bar-fill" style="height:${Math.max(4, (b.count / max) * 100)}%"></div><small>${escapeHtml(b.label)}</small><small>${b.count}</small></div>`).join('');
  }

  function renderHistory() {
    const q = normalize(val('historySearch'));
    const status = val('historyStatus');
    const role = val('historyRole');
    const type = val('historyType');
    let records = state.store.records.slice().sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    records = records.filter((r) => {
      const f = r.fields || {};
      const hay = normalize([f.officialNumber, f.verificationCode, f.companyName, f.agentName, f.agentRole, f.direction, documentLabel(f.docType)].join(' '));
      return (!q || hay.includes(q)) && (!status || f.status === status) && (!role || f.agentRole === role) && (!type || f.docType === type);
    });
    const container = byId('historyList');
    container.classList.toggle('empty-state', records.length === 0);
    container.innerHTML = records.length ? records.map((r) => {
      const f = r.fields || {};
      return `<article class="history-card">
        <div>
          <h4>${escapeHtml(f.officialNumber || 'Sans numéro officiel')}</h4>
          <div class="history-meta"><span class="badge">${escapeHtml(documentLabel(f.docType))}</span><span class="badge ${statusBadgeClass(f.status)}">${escapeHtml(statusLabel(f.status))}</span><span>${escapeHtml(f.agentRole || '')}</span><span>${escapeHtml(f.companyName || f.defender || 'Sans entreprise')}</span></div>
          <small>UUID : ${escapeHtml(r.id)} · Code : ${escapeHtml(f.verificationCode || '')} · MAJ : ${escapeHtml(formatDateTime(r.updatedAt))}</small>
        </div>
        <div class="history-actions">
          <button class="btn tiny secondary" data-history-action="open" data-id="${r.id}" type="button">Modifier</button>
          <button class="btn tiny warning" data-history-action="duplicate" data-id="${r.id}" type="button">Dupliquer</button>
          <button class="btn tiny ghost" data-history-action="print" data-id="${r.id}" type="button">Imprimer</button>
          <button class="btn tiny dark" data-history-action="archive" data-id="${r.id}" type="button">${f.status === 'archived' ? 'Restaurer' : 'Archiver'}</button>
          <button class="btn tiny danger" data-history-action="delete" data-id="${r.id}" type="button">Supprimer</button>
        </div>
      </article>`;
    }).join('') : 'Aucun document enregistré.';
  }

  function handleHistoryAction(event) {
    const btn = event.target.closest('[data-history-action]');
    if (!btn) return;
    const record = state.store.records.find((r) => r.id === btn.dataset.id);
    if (!record) return;
    const action = btn.dataset.historyAction;
    if (action === 'open') { fillForm(deepClone(record)); switchView('create'); }
    if (action === 'duplicate') { fillForm(deepClone(record)); duplicateCurrent(); switchView('create'); }
    if (action === 'print') { fillForm(deepClone(record)); switchView('create'); setTimeout(printDocument, 250); }
    if (action === 'archive') {
      record.fields.status = record.fields.status === 'archived' ? 'draft' : 'archived';
      record.updatedAt = new Date().toISOString();
      record.logs = record.logs || [];
      record.logs.push(logEntry(record.fields.status === 'archived' ? 'PV archivé' : 'PV restauré en brouillon', record));
      saveStore(); renderHistory(); renderDashboard(); toast('Statut mis à jour.');
    }
    if (action === 'delete') {
      if (!confirm('Supprimer définitivement ce PV ?')) return;
      state.store.records = state.store.records.filter((r) => r.id !== record.id);
      saveStore(); renderHistory(); renderDashboard(); toast('PV supprimé.');
    }
  }

  function renderLegalBase() {
    const q = normalize(val('legalSearch'));
    const category = val('legalCategory');
    const filtered = LEGAL_BASE.filter((item) => {
      const hay = normalize([item.id, item.category, item.title, item.reference, item.scope, item.use, (item.keywords || []).join(' ')].join(' '));
      return (!q || hay.includes(q)) && (!category || item.category === category);
    });
    const categories = Array.from(new Set(LEGAL_BASE.map((item) => item.category)));
    const summary = byId('legalSummary');
    if (summary) {
      summary.innerHTML = `
        <article><strong>${LEGAL_BASE.length}</strong><span>références juridiques</span></article>
        <article><strong>${categories.length}</strong><span>catégories</span></article>
        <article><strong>${filtered.length}</strong><span>résultat(s) affiché(s)</span></article>
        <article><strong>${INFRACTIONS.length}</strong><span>infractions liées</span></article>`;
    }
    const list = byId('legalList');
    if (!list) return;
    list.innerHTML = filtered.length ? filtered.map((item) => `
      <article class="legal-card" data-legal-id="${escapeHtml(item.id)}">
        <div class="legal-card-head">
          <span class="badge">${escapeHtml(item.id)}</span>
          <span class="badge moyenne">${escapeHtml(item.category)}</span>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p><strong>Référence :</strong> ${escapeHtml(item.reference)}</p>
        <p><strong>Portée :</strong> ${escapeHtml(item.scope)}</p>
        <p><strong>Utilisation dans le PV :</strong> ${escapeHtml(item.use)}</p>
        <div class="badges">${(item.keywords || []).slice(0, 8).map((k) => `<em class="badge faible">${escapeHtml(k)}</em>`).join('')}</div>
        <div class="legal-actions">
          <button class="btn tiny ghost" data-legal-action="copy" data-id="${escapeHtml(item.id)}" type="button">Copier</button>
          <button class="btn tiny secondary" data-legal-action="insert" data-id="${escapeHtml(item.id)}" type="button">Insérer dans observations</button>
          <button class="btn tiny" data-legal-action="infractions" data-id="${escapeHtml(item.id)}" type="button">Voir infractions liées</button>
        </div>
      </article>`).join('') : '<div class="empty-state">Aucune référence juridique trouvée.</div>';
  }

  function legalText(item) {
    if (!item) return '';
    return `${item.title}\nRéférence : ${item.reference}\nPortée : ${item.scope}\nUtilisation : ${item.use}`;
  }

  function handleLegalAction(event) {
    const btn = event.target.closest('[data-legal-action]');
    if (!btn) return;
    const item = LEGAL_BASE.find((j) => j.id === btn.dataset.id);
    if (!item) return;
    const action = btn.dataset.legalAction;
    if (action === 'copy') {
      copyText(legalText(item));
      toast('Référence juridique copiée.');
    }
    if (action === 'insert') {
      const current = val('observations');
      const insertion = `Base juridique — ${item.title} : ${item.reference}. ${item.use}`;
      setVal('observations', current ? `${current}\n\n${insertion}` : insertion);
      updatePreview();
      switchView('create');
      toast('Base juridique insérée dans les observations du PV.');
    }
    if (action === 'infractions') {
      const terms = (item.keywords || []).slice(0, 4).join(' ');
      setVal('infractionSearch', terms || item.title);
      renderInfractionsList();
      switchView('create');
      toast('Recherche d’infractions liées à cette base juridique.');
    }
  }

  function copyLegalSummary() {
    const text = LEGAL_BASE.map((item) => `${item.id}. ${legalText(item)}`).join('\n\n');
    copyText(text);
    toast('Synthèse complète de la base juridique copiée.');
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopyText(text));
    } else {
      fallbackCopyText(text);
    }
  }

  function fallbackCopyText(text) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.left = '-9999px';
    document.body.appendChild(area);
    area.select();
    try { document.execCommand('copy'); } catch (_) { /* ignore */ }
    area.remove();
  }

  function renderReserveModels() {
    const q = normalize(val('reserveTemplateSearch'));
    const type = val('reserveTemplateType');
    const filtered = RESERVE_PV_MODELS.filter((model) => {
      const hay = normalize([model.id, model.title, documentLabel(model.docType), model.text].join(' '));
      return (!q || hay.includes(q)) && (!type || model.docType === type);
    });
    const list = byId('reserveTemplatesList');
    if (!list) return;
    list.innerHTML = filtered.length ? filtered.map((model) => `
      <article class="reserve-card" data-reserve-id="${escapeHtml(model.id)}">
        <div class="reserve-card-head"><span class="badge">${escapeHtml(model.id)}</span><span class="badge moyenne">${escapeHtml(documentLabel(model.docType))}</span></div>
        <h4>${escapeHtml(model.title)}</h4>
        <p>${escapeHtml(model.text)}</p>
        <div class="reserve-actions">
          <button class="btn tiny ghost" data-reserve-action="copy" data-id="${escapeHtml(model.id)}" type="button">Copier</button>
          <button class="btn tiny secondary" data-reserve-action="use" data-id="${escapeHtml(model.id)}" type="button">Utiliser dans le PV</button>
          <button class="btn tiny" data-reserve-action="select-type" data-id="${escapeHtml(model.id)}" type="button">Choisir ce type</button>
        </div>
      </article>`).join('') : '<div class="empty-state">Aucun modèle de réserve trouvé.</div>';
  }

  function handleReserveModelAction(event) {
    const btn = event.target.closest('[data-reserve-action]');
    if (!btn) return;
    const model = RESERVE_PV_MODELS.find((item) => item.id === btn.dataset.id);
    if (!model) return;
    const action = btn.dataset.reserveAction;
    if (action === 'copy') {
      copyText(`${model.title}\n\n${model.text}`);
      toast('Modèle de texte copié.');
    }
    if (action === 'use') {
      setVal('docType', model.docType);
      const current = val('observations');
      setVal('observations', current ? `${current}\n\n${model.text}` : model.text);
      updateDocPanels();
      updatePreview();
      switchView('create');
      toast('Modèle ajouté dans les observations du PV.');
    }
    if (action === 'select-type') {
      setVal('docType', model.docType);
      updateDocPanels();
      updatePreview();
      switchView('create');
      toast('Type de PV sélectionné selon le modèle de réserve.');
    }
  }

  function renderSettings() {
    renderAgentsList();
    byId('directionsList').innerHTML = DIRECTIONS.map((d) => `<div class="mini-item"><strong>${escapeHtml(d.name)}</strong><small>Province : ${escapeHtml(d.province)} · Code : ${escapeHtml(d.code)}</small></div>`).join('');
    byId('templatesList').innerHTML = DOCUMENT_TYPES.map((d) => `<div class="mini-item"><strong>${escapeHtml(d.label)}</strong><small>Modèle local · ${d.needsInfractions ? 'tableau infractions et amendes' : 'rédaction libre assistée'} · QR/signatures inclus</small></div>`).join('') + `<div class="mini-item"><strong>Base infractions intégrée</strong><small>${INFRACTIONS.length} infractions/références avec recherche, gravité et calcul automatique.</small></div><div class="mini-item"><strong>Base juridique intégrée</strong><small>${LEGAL_BASE.length} références légales/réglementaires avec recherche, insertion dans observations et liens vers infractions.</small></div><div class="mini-item"><strong>Réserve rédactionnelle</strong><small>${RESERVE_PV_MODELS.length} modèles de textes de PV sans noms suggérés, disponibles ci-dessous.</small></div>`;
    renderReserveModels();
  }

  function renderAgentsList() {
    const agents = state.store.agents.filter((a) => !isLegacySuggestedAgent(a));
    byId('agentsList').innerHTML = agents.length ? agents.map((a) => `<div class="mini-item"><strong>${escapeHtml(a.name)}</strong><small>${escapeHtml(a.role)} · ${escapeHtml(a.quality || '')}<br>Habilitation : ${escapeHtml(a.habilitation || '-')} · OPJ : ${escapeHtml(a.opj || '-')}<br>${escapeHtml(a.direction || '')}</small><br><button class="btn tiny ghost" data-agent-edit="${a.id}" type="button">Éditer</button> <button class="btn tiny danger" data-agent-delete="${a.id}" type="button">Supprimer</button></div>`).join('') : '<div class="empty-state">Aucun nom suggéré par défaut. Les utilisateurs saisissent le nom manuellement ou ajoutent leurs propres agents ici.</div>';
  }

  function addOrUpdateAgent() {
    const name = val('settingsAgentName');
    if (!name) { toast('Nom complet obligatoire.'); return; }
    const role = val('settingsAgentRole');
    const existing = state.store.agents.find((a) => normalize(a.name) === normalize(name) && a.role === role);
    const agent = existing || { id: `agt-${Date.now()}`, role, name };
    agent.role = role;
    agent.name = name;
    agent.quality = val('settingsAgentQuality');
    agent.habilitation = val('settingsAgentHabilitation');
    agent.opj = val('settingsAgentOpj');
    agent.direction = val('settingsAgentDirection');
    if (!existing) state.store.agents.push(agent);
    saveStore(); populateAgentsSelect(); renderAgentsList(); toast(existing ? 'Agent mis à jour.' : 'Agent ajouté.');
  }

  function handleAgentAction(event) {
    const edit = event.target.closest('[data-agent-edit]');
    const del = event.target.closest('[data-agent-delete]');
    if (edit) {
      const a = state.store.agents.find((x) => x.id === edit.dataset.agentEdit);
      if (!a) return;
      setVal('settingsAgentRole', a.role); setVal('settingsAgentName', a.name); setVal('settingsAgentQuality', a.quality); setVal('settingsAgentHabilitation', a.habilitation); setVal('settingsAgentOpj', a.opj); setVal('settingsAgentDirection', a.direction);
    }
    if (del) {
      if (!confirm('Supprimer cet agent ?')) return;
      state.store.agents = state.store.agents.filter((a) => a.id !== del.dataset.agentDelete);
      saveStore(); populateAgentsSelect(); renderAgentsList(); toast('Agent supprimé.');
    }
  }

  function exportBackup() {
    const data = JSON.stringify({ exportedAt: new Date().toISOString(), app: 'InspecteurBot IA RDC PV', ...state.store }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sauvegarde-pv-igt-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    byId('backupStatus').textContent = `Sauvegarde exportée le ${formatDateTime(new Date().toISOString())}.`;
  }

  function restoreBackup(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed.records)) throw new Error('Fichier invalide : records manquant.');
        state.store.records = parsed.records;
        state.store.agents = Array.isArray(parsed.agents) && parsed.agents.length ? parsed.agents : DEFAULT_AGENTS.slice();
        state.store.customTemplates = Array.isArray(parsed.customTemplates) ? parsed.customTemplates : [];
        saveStore(); populateStaticControls(); renderDashboard(); renderHistory(); renderSettings(); byId('backupStatus').textContent = `Restauration réussie : ${state.store.records.length} PV.`; toast('Restauration terminée.');
      } catch (err) {
        byId('backupStatus').textContent = `Erreur restauration : ${err.message}`;
      }
    };
    reader.readAsText(file);
  }

  function clearLocalData() {
    if (!confirm('Vider toutes les données locales (PV, agents ajoutés) ?')) return;
    localStorage.removeItem(STORAGE_KEY);
    state.store = { version: APP_VERSION, records: [], agents: DEFAULT_AGENTS.slice(), customTemplates: [] };
    saveStore(); populateStaticControls(); renderDashboard(); renderHistory(); renderSettings(); newRecord(false); toast('Données locales réinitialisées.');
  }

  function switchView(view) {
    document.querySelectorAll('.nav-item').forEach((btn) => btn.classList.toggle('active', btn.dataset.view === view));
    document.querySelectorAll('.view').forEach((section) => section.classList.toggle('active', section.id === `view-${view}`));
    if (view === 'dashboard') renderDashboard();
    if (view === 'history') renderHistory();
    if (view === 'legal') renderLegalBase();
    if (view === 'settings') renderSettings();
  }

  function toggleDictation() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { toast('Dictée vocale non supportée par ce navigateur. Essayez Chrome/Edge.'); return; }
    if (state.listening && state.recognition) { state.recognition.stop(); return; }
    const target = state.focusedField && /^(INPUT|TEXTAREA)$/.test(state.focusedField.tagName) && !state.focusedField.readOnly ? state.focusedField : byId('facts');
    target.focus();
    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.interimResults = true;
    recognition.continuous = true;
    state.recognition = recognition;
    state.listening = true;
    byId('btnGlobalListen').textContent = '⏹️ Stop dictée';
    let finalText = '';
    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript + ' '; else interim += transcript;
      }
      const base = target.dataset.dictationBase || target.value;
      if (!target.dataset.dictationBase) target.dataset.dictationBase = base;
      target.value = `${base}${base && !base.endsWith(' ') ? ' ' : ''}${finalText}${interim}`.trimStart();
      target.dispatchEvent(new Event('input', { bubbles: true }));
    };
    recognition.onerror = (event) => toast(`Erreur dictée : ${event.error}`);
    recognition.onend = () => {
      state.listening = false;
      byId('btnGlobalListen').textContent = '🎙️ Dictée';
      delete target.dataset.dictationBase;
      updatePreview();
    };
    recognition.start();
    toast('Dictée démarrée. Parlez en français dans le champ actif.');
  }

  function readPreview() {
    if (!('speechSynthesis' in window)) { toast('Lecture vocale non supportée par ce navigateur.'); return; }
    window.speechSynthesis.cancel();
    const text = byId('printArea').innerText.replace(/\s+/g, ' ').trim();
    if (!text) { toast('Aucun texte à lire.'); return; }
    const utterance = new SpeechSynthesisUtterance(text.slice(0, 7000));
    utterance.lang = 'fr-FR';
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
    toast('Lecture vocale de l’aperçu en cours.');
  }

  function toast(message) {
    const el = byId('toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => el.classList.remove('show'), 3600);
  }

  function formatUSD(value) {
    const n = Number(value || 0);
    return `${n.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} $`;
  }

  function formatDate(date) {
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  function formatDateTime(value) {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value).replace('T', ' ');
    return d.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function nowLocalInput() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }

  function monthName(date) {
    return (date instanceof Date ? date : new Date(date)).toLocaleDateString('fr-FR', { month: 'long' });
  }

  function legalDatePhrase(date) {
    const d = date instanceof Date ? date : new Date(date);
    return { yearLetters: numberToFrench(d.getFullYear()), dayLetters: ordinalDay(d.getDate()), monthName: monthName(d) };
  }

  function ordinalDay(day) {
    if (day === 1) return 'premier';
    const ord = { 2: 'deuxième', 3: 'troisième', 4: 'quatrième', 5: 'cinquième', 6: 'sixième', 7: 'septième', 8: 'huitième', 9: 'neuvième', 10: 'dixième', 11: 'onzième', 12: 'douzième', 13: 'treizième', 14: 'quatorzième', 15: 'quinzième', 16: 'seizième', 17: 'dix-septième', 18: 'dix-huitième', 19: 'dix-neuvième', 20: 'vingtième', 21: 'vingt-et-unième', 22: 'vingt-deuxième', 23: 'vingt-troisième', 24: 'vingt-quatrième', 25: 'vingt-cinquième', 26: 'vingt-sixième', 27: 'vingt-septième', 28: 'vingt-huitième', 29: 'vingt-neuvième', 30: 'trentième', 31: 'trente-et-unième' };
    return ord[day] || String(day);
  }

  function amountInLetters(value) {
    const n = Number(value || 0);
    if (!n) return 'zéro';
    return numberToFrench(n);
  }

  function numberToFrench(n) {
    n = Math.floor(Number(n));
    if (n === 0) return 'zéro';
    const units = ['zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize'];
    const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'septante', 'quatre-vingt', 'nonante'];
    const underHundred = (x) => {
      if (x < 17) return units[x];
      if (x < 20) return `dix-${units[x - 10]}`;
      const t = Math.floor(x / 10), u = x % 10;
      if (u === 0) return tens[t] + (t === 8 ? 's' : '');
      if (u === 1 && ![8].includes(t)) return `${tens[t]}-et-un`;
      return `${tens[t]}-${units[u]}`;
    };
    const underThousand = (x) => {
      if (x < 100) return underHundred(x);
      const h = Math.floor(x / 100), r = x % 100;
      const hText = h === 1 ? 'cent' : `${units[h]} cent${r ? '' : 's'}`;
      return r ? `${hText} ${underHundred(r)}` : hText;
    };
    if (n < 1000) return underThousand(n);
    if (n < 1000000) {
      const th = Math.floor(n / 1000), r = n % 1000;
      const thText = th === 1 ? 'mille' : `${underThousand(th)} mille`;
      return r ? `${thText} ${underThousand(r)}` : thText;
    }
    const m = Math.floor(n / 1000000), r = n % 1000000;
    const mText = m === 1 ? 'un million' : `${numberToFrench(m)} millions`;
    return r ? `${mText} ${numberToFrench(r)}` : mText;
  }

  function gravityClass(gravity) {
    return normalize(gravity).replace('é', 'e').replace('è', 'e') || 'faible';
  }

  function statusLabel(status) {
    return ({ draft: 'Brouillon', validated: 'Validé', archived: 'Archivé' }[status] || status || 'Brouillon');
  }

  function statusBadgeClass(status) {
    if (status === 'validated') return 'moyenne';
    if (status === 'archived') return 'faible';
    return 'elevee';
  }

  function documentLabel(id) {
    const doc = DOCUMENT_TYPES.find((d) => d.id === id);
    return doc ? doc.label : id || 'Document';
  }

  function slug(text) {
    return normalize(text).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  /* QR Code local, sans dépendance externe : QR version 4-L, Byte mode, masque 2. */
  function makeQrSvg(text, size = 96) {
    try {
      const matrix = qrMatrix(String(text).slice(0, 78));
      const n = matrix.length;
      const cell = size / n;
      let rects = '';
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          if (matrix[y][x]) rects += `<rect x="${(x * cell).toFixed(2)}" y="${(y * cell).toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}"/>`;
        }
      }
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="QR Code"><rect width="100%" height="100%" fill="#fff"/><g fill="#111">${rects}</g></svg>`;
    } catch (err) {
      console.error(err);
      return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="100%" height="100%" fill="#fff" stroke="#111"/><text x="50%" y="50%" text-anchor="middle" font-size="9">QR</text></svg>`;
    }
  }

  function qrMatrix(text) {
    const version = 4;
    const size = 21 + 4 * (version - 1);
    const dataCodewords = 80;
    const ecCodewords = 20;
    const bytes = Array.from(new TextEncoder().encode(text));
    if (bytes.length > 78) bytes.length = 78;
    const bits = [];
    appendBits(bits, 0b0100, 4);
    appendBits(bits, bytes.length, 8);
    bytes.forEach((b) => appendBits(bits, b, 8));
    appendBits(bits, 0, Math.min(4, dataCodewords * 8 - bits.length));
    while (bits.length % 8) bits.push(0);
    const data = [];
    for (let i = 0; i < bits.length; i += 8) data.push(bitsToByte(bits.slice(i, i + 8)));
    let pad = true;
    while (data.length < dataCodewords) { data.push(pad ? 0xec : 0x11); pad = !pad; }
    const ec = reedSolomon(data, ecCodewords);
    const all = data.concat(ec);
    const dataBits = [];
    all.forEach((b) => appendBits(dataBits, b, 8));

    const m = Array.from({ length: size }, () => Array(size).fill(null));
    const reserved = Array.from({ length: size }, () => Array(size).fill(false));
    const set = (x, y, dark, res = true) => { if (x >= 0 && y >= 0 && x < size && y < size) { m[y][x] = !!dark; if (res) reserved[y][x] = true; } };
    const reserve = (x, y) => { if (x >= 0 && y >= 0 && x < size && y < size) reserved[y][x] = true; };
    drawFinder(set, 0, 0); drawFinder(set, size - 7, 0); drawFinder(set, 0, size - 7);
    for (let i = 0; i < size; i++) {
      if (!reserved[6][i]) set(i, 6, i % 2 === 0);
      if (!reserved[i][6]) set(6, i, i % 2 === 0);
    }
    drawAlignment(set, 26, 26);
    set(8, 4 * version + 9, true);
    for (let i = 0; i < 9; i++) { reserve(8, i); reserve(i, 8); reserve(size - 1 - i, 8); reserve(8, size - 1 - i); }

    let bitIndex = 0;
    let upward = true;
    for (let x = size - 1; x > 0; x -= 2) {
      if (x === 6) x--;
      for (let yi = 0; yi < size; yi++) {
        const y = upward ? size - 1 - yi : yi;
        for (let dx = 0; dx < 2; dx++) {
          const xx = x - dx;
          if (reserved[y][xx]) continue;
          let dark = bitIndex < dataBits.length ? dataBits[bitIndex++] === 1 : false;
          if (xx % 3 === 0) dark = !dark; // mask 2
          set(xx, y, dark, false);
        }
      }
      upward = !upward;
    }
    drawFormat(set, size, 1, 2);
    return m.map((row) => row.map(Boolean));
  }

  function appendBits(arr, value, length) {
    for (let i = length - 1; i >= 0; i--) arr.push((value >>> i) & 1);
  }
  function bitsToByte(bits) { return bits.reduce((v, b) => (v << 1) | b, 0); }

  function drawFinder(set, x, y) {
    for (let dy = -1; dy <= 7; dy++) for (let dx = -1; dx <= 7; dx++) {
      const xx = x + dx, yy = y + dy;
      const dark = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6 && (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
      set(xx, yy, dark);
    }
  }
  function drawAlignment(set, cx, cy) {
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      const adx = Math.abs(dx), ady = Math.abs(dy);
      set(cx + dx, cy + dy, Math.max(adx, ady) !== 1);
    }
  }
  function drawFormat(set, size, eclBits, mask) {
    const bits = bchFormat((eclBits << 3) | mask);
    for (let i = 0; i < 15; i++) {
      const dark = ((bits >> i) & 1) === 1;
      if (i < 6) set(8, i, dark);
      else if (i < 8) set(8, i + 1, dark);
      else set(8, size - 15 + i, dark);

      if (i < 8) set(size - i - 1, 8, dark);
      else if (i < 9) set(15 - i, 8, dark);
      else set(14 - i, 8, dark);
    }
    set(8, size - 8, true);
  }
  function bchFormat(data) {
    const g = 0x537;
    let d = data << 10;
    while (bitLength(d) - bitLength(g) >= 0) d ^= g << (bitLength(d) - bitLength(g));
    return ((data << 10) | d) ^ 0x5412;
  }
  function bitLength(n) { let len = 0; while (n) { len++; n >>>= 1; } return len; }

  function reedSolomon(data, ecLen) {
    const gf = gfTables();
    let gen = [1];
    for (let i = 0; i < ecLen; i++) gen = polyMul(gen, [1, gf.exp[i]], gf);
    const res = data.concat(Array(ecLen).fill(0));
    for (let i = 0; i < data.length; i++) {
      const factor = res[i];
      if (factor !== 0) {
        for (let j = 0; j < gen.length; j++) res[i + j] ^= gfMul(gen[j], factor, gf);
      }
    }
    return res.slice(data.length);
  }
  function gfTables() {
    if (gfTables.cache) return gfTables.cache;
    const exp = Array(512).fill(0), log = Array(256).fill(0);
    let x = 1;
    for (let i = 0; i < 255; i++) {
      exp[i] = x; log[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 512; i++) exp[i] = exp[i - 255];
    gfTables.cache = { exp, log };
    return gfTables.cache;
  }
  function gfMul(a, b, gf) { if (a === 0 || b === 0) return 0; return gf.exp[gf.log[a] + gf.log[b]]; }
  function polyMul(a, b, gf) {
    const out = Array(a.length + b.length - 1).fill(0);
    for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) out[i + j] ^= gfMul(a[i], b[j], gf);
    return out;
  }
})();
