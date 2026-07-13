/* APP.JS - CENTRALIZED JAVASCRIPT FOR MODULE PROCÈS-VERBAUX (PV) - INSPECTEURBOT */

// 1. INFRACTIONS DATABASE (65 Official DRC Infractions)
const INFRACTIONS_DB = [
  {
    "num": 1,
    "title": "Non Affichage de l’Horaire du Travail",
    "article": "Art 119 et 222",
    "reference": "Code du Travail et Arrêté Min N° 40/CAB/MIN/ETPS/2013",
    "gravity": "Moyenne",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "L’horaire du travail doit être visé par l’Inspecteur du Travail et affiché en caractères lisibles dans chacun des lieux de travail.",
    "category": "Conditions de Travail",
    "status": "active"
  },
  {
    "num": 2,
    "title": "Défaut de Classification générale des emplois",
    "article": "Art 90",
    "reference": "Code du Travail RDC",
    "gravity": "Moyenne",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "L’employeur est tenu de classer les emplois de son entreprise conformément à la classification générale nationale des emplois.",
    "category": "Rémunération & Emplois",
    "status": "active"
  },
  {
    "num": 3,
    "title": "Contrat de Travail non constaté par écrit, signé et visé",
    "article": "Art 44, 46, 47 et 212",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Requalification en CDI + Amende",
    "amende": 5000,
    "observations": "Le contrat de travail doit être constaté par écrit, signé par le travailleur et visé par l’ONEM. En l’absence d’écrit, il devient un CDI.",
    "category": "Contrats & Apprentissage",
    "status": "active"
  },
  {
    "num": 4,
    "title": "Défaut du Règlement Intérieur (Règlement d’Entreprise)",
    "article": "Art 157",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "Toute entreprise employant au moins 10 travailleurs est tenue d’élaborer un règlement intérieur en concertation avec les délégués.",
    "category": "Gestion Administrative",
    "status": "active"
  },
  {
    "num": 5,
    "title": "Défaut d’application du SMIG",
    "article": "Art 87 et 94-96",
    "reference": "Code du Travail & Décret Présidentiel n° 18/017 du 22/05/2018",
    "gravity": "Très Grave",
    "sanction": "Fermeture d’entreprise + Amende",
    "amende": 5000,
    "observations": "Le salaire versé ne peut être inférieur au Salaire Minimum Interprofessionnel Garanti (SMIG) fixé par Décret. Sanction de fermeture possible.",
    "category": "Rémunération & Emplois",
    "status": "active"
  },
  {
    "num": 6,
    "title": "Dépassement des 45 heures hebdomadaires sans paiement d’Heures Supplémentaires",
    "article": "Art 119 et 120",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Amende administrative + Rappel de salaire",
    "amende": 3000,
    "observations": "La durée légale est de 45 heures par semaine. Les heures prestées au-delà doivent être rémunérées avec majoration légale.",
    "category": "Conditions de Travail",
    "status": "active"
  },
  {
    "num": 7,
    "title": "Privation du jour de repos hebdomadaire",
    "article": "Art 121",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "Le repos hebdomadaire est obligatoire. Il est de 24 heures consécutives au minimum, de préférence le dimanche.",
    "category": "Conditions de Travail",
    "status": "active"
  },
  {
    "num": 8,
    "title": "Faire travailler les enfants et personnes handicapées au-delà de leur capacité",
    "article": "Art 137",
    "reference": "Code du Travail RDC",
    "gravity": "Très Grave",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "Il est formellement interdit de faire travailler les enfants et les personnes handicapées au-delà de leurs aptitudes physiques.",
    "category": "Protection des Travailleurs",
    "status": "active"
  },
  {
    "num": 9,
    "title": "Non-respect de l’âge d’admission au travail (Emploi d’enfants de < 15 ans)",
    "article": "Art 133",
    "reference": "Code du Travail & Convention n° 138 de l’OIT",
    "gravity": "Très Grave",
    "sanction": "Amende administrative + Poursuites pénales",
    "amende": 5000,
    "observations": "L’âge minimum légal d’admission au travail en RDC est fixé à 15 ans. L’emploi d’enfants de moins de 15 ans est strictement interdit.",
    "category": "Protection des Travailleurs",
    "status": "active"
  },
  {
    "num": 10,
    "title": "Emploi d’enfants de 15 à 17 ans sans autorisation",
    "article": "Art 133",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "Un enfant âgé de 15 à 17 ans ne peut être engagé que sur autorisation expresse de l’inspecteur du travail et de son parent/tuteur.",
    "category": "Protection des Travailleurs",
    "status": "active"
  },
  {
    "num": 11,
    "title": "Mauvaises conditions d’hygiène, santé et sécurité au travail",
    "article": "Art 171",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Mise en demeure + Amende",
    "amende": 3000,
    "observations": "L’employeur est tenu de garantir des installations salubres, de l’eau potable et des équipements de protection individuelle (EPI).",
    "category": "Hygiène, Santé & Sécurité",
    "status": "active"
  },
  {
    "num": 12,
    "title": "Non-assurance d’un service médical aux employés",
    "article": "Art 177",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "Tout employeur doit assurer un service de santé au travail pour ses salariés, par convention médicale ou service interne.",
    "category": "Hygiène, Santé & Sécurité",
    "status": "active"
  },
  {
    "num": 13,
    "title": "Violation de la convention collective",
    "article": "Art 320",
    "reference": "Code du Travail RDC",
    "gravity": "Moyenne",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "L’employeur doit respecter les engagements prévus dans la convention collective applicable à son entreprise ou secteur d’activité.",
    "category": "Relations Collectives",
    "status": "active"
  },
  {
    "num": 14,
    "title": "Défaut de versement des cotisations INPP pour la formation",
    "article": "Art 8",
    "reference": "Code du Travail & Statuts de l’INPP",
    "gravity": "Grave",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "Les employeurs doivent assurer la formation ou le perfectionnement de leurs travailleurs via les contributions dues à l’INPP.",
    "category": "Gestion Administrative",
    "status": "active"
  },
  {
    "num": 15,
    "title": "Recevoir des apprentis sans en avoir la qualité légale",
    "article": "Art 18",
    "reference": "Code du Travail RDC",
    "gravity": "Moyenne",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "Nul ne peut recevoir des apprentis mineurs s’il n’est âgé d’au moins 18 ans, de bonne vie et mœurs et qualifié pour former.",
    "category": "Contrats & Apprentissage",
    "status": "active"
  },
  {
    "num": 16,
    "title": "Absence de contrat d’apprentissage écrit ou non conforme",
    "article": "Art 19",
    "reference": "Code du Travail RDC",
    "gravity": "Moyenne",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "Le contrat d’apprentissage doit être rédigé par écrit et comporter les mentions obligatoires. Sa durée ne peut excéder 4 ans.",
    "category": "Contrats & Apprentissage",
    "status": "active"
  },
  {
    "num": 17,
    "title": "Absence de visa de l’ONEM sur le contrat d’apprentissage",
    "article": "Art 21",
    "reference": "Code du Travail RDC",
    "gravity": "Moyenne",
    "sanction": "Requalification en contrat de travail + Amende",
    "amende": 3000,
    "observations": "Le contrat d’apprentissage doit être soumis au visa de l’ONEM. En l’absence de visa, il est requalifié en contrat de travail de droit commun.",
    "category": "Contrats & Apprentissage",
    "status": "active"
  },
  {
    "num": 18,
    "title": "Non-rémunération (allocation d’apprentissage) de l’apprenti",
    "article": "Art 25",
    "reference": "Code du Travail RDC",
    "gravity": "Moyenne",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "L’apprenti a droit à une allocation d’apprentissage mensuelle fixée d’un commun accord et au moins égale au SMIG après la première année.",
    "category": "Contrats & Apprentissage",
    "status": "active"
  },
  {
    "num": 19,
    "title": "Inexécution par l’apprenti de ses obligations envers le maître",
    "article": "Art 26",
    "reference": "Code du Travail RDC",
    "gravity": "Faible",
    "sanction": "Avertissement / Amende",
    "amende": 1000,
    "observations": "L’apprenti doit obéissance et respect au maître et l’aider dans son travail dans la mesure de ses forces et connaissances.",
    "category": "Contrats & Apprentissage",
    "status": "active"
  },
  {
    "num": 20,
    "title": "Rupture anticipée du contrat d’apprentissage sans notification à l’IT et à l’ONEM",
    "article": "Art 33 al2",
    "reference": "Code du Travail RDC",
    "gravity": "Moyenne",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "La résiliation amiable ou pour faute grave du contrat d’apprentissage doit faire l’objet d’une notification écrite à l’Inspecteur et à l’ONEM.",
    "category": "Contrats & Apprentissage",
    "status": "active"
  },
  {
    "num": 21,
    "title": "Conclusion abusive ou non écrite d’un Contrat à Durée Déterminée (CDD)",
    "article": "Art 40",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Requalification en CDI + Amende",
    "amende": 3000,
    "observations": "Le CDD doit être conclu par écrit. À défaut d’écrit ou s’il excède la durée maximale de 2 ans, il est réputé à durée indéterminée (CDI).",
    "category": "Contrats & Apprentissage",
    "status": "active"
  },
  {
    "num": 22,
    "title": "Divulgation de secrets professionnels ou concurrence déloyale par le travailleur",
    "article": "Art 325",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Poursuite pénale + Amende administrative",
    "amende": 3000,
    "observations": "La divulgation frauduleuse de secrets industriels ou commerciaux constitue une infraction pénale grave.",
    "category": "Protection des Travailleurs",
    "status": "active"
  },
  {
    "num": 23,
    "title": "Non-respect par le travailleur des mesures de sécurité de l’entreprise",
    "article": "Art 51",
    "reference": "Code du Travail RDC",
    "gravity": "Moyenne",
    "sanction": "Mesures disciplinaires + Amende",
    "amende": 1000,
    "observations": "Le travailleur est tenu d’observer scrupuleusement les consignes d’hygiène, de sécurité et de protection prescrites dans l’établissement.",
    "category": "Hygiène, Santé & Sécurité",
    "status": "active"
  },
  {
    "num": 24,
    "title": "Rupture abusive de contrat du travail pour faute lourde",
    "article": "Art 59",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Dommages-intérêts + Amende",
    "amende": 3000,
    "observations": "La résiliation immédiate pour faute lourde doit respecter la procédure légale et être notifiée par écrit dans les deux jours ouvrables.",
    "category": "Protection des Travailleurs",
    "status": "active"
  },
  {
    "num": 25,
    "title": "Défaut de prise en charge des frais de transport des travailleurs",
    "article": "Art 56",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Amende administrative + Indemnités de transport",
    "amende": 3000,
    "observations": "L’employeur est légalement tenu de supporter les frais de déplacement des travailleurs entre leur domicile et leur lieu de travail.",
    "category": "Conditions de Travail",
    "status": "active"
  },
  {
    "num": 26,
    "title": "Rupture unilatérale de contrat en cours de validité (sans juste motif)",
    "article": "Art 60",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Dommages-intérêts + Amende",
    "amende": 3000,
    "observations": "Toute rupture de contrat sans motif valable ou en dehors des cas prévus par la loi donne lieu à une indemnisation pour licenciement abusif.",
    "category": "Protection des Travailleurs",
    "status": "active"
  },
  {
    "num": 27,
    "title": "Violation des prescriptions sur la durée du préavis de licenciement",
    "article": "Art 64, 65, 66",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Indemnité compensatrice + Amende",
    "amende": 3000,
    "observations": "La partie qui prend l’initiative de rompre le contrat de travail doit respecter les délais de préavis prescrits sous peine d’indemnité.",
    "category": "Protection des Travailleurs",
    "status": "active"
  },
  {
    "num": 28,
    "title": "Licenciement massif sans respect de la procédure légale",
    "article": "Art 78",
    "reference": "Code du Travail RDC",
    "gravity": "Très Grave",
    "sanction": "Amende administrative + Annulation des licenciements",
    "amende": 5000,
    "observations": "Tout licenciement pour motif économique de plusieurs travailleurs est soumis à l’avis préalable de l’inspecteur du travail.",
    "category": "Relations Collectives",
    "status": "active"
  },
  {
    "num": 29,
    "title": "Non-remise de l’attestation de services rendus",
    "article": "Art 79",
    "reference": "Code du Travail RDC",
    "gravity": "Moyenne",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "L’employeur est tenu de délivrer au travailleur une attestation de services rendus dans les deux jours ouvrables suivant la fin du contrat.",
    "category": "Protection des Travailleurs",
    "status": "active"
  },
  {
    "num": 30,
    "title": "Défaut d’affichage ou de mise à jour de la liste des sous-entrepreneurs",
    "article": "Art 84",
    "reference": "Code du Travail RDC",
    "gravity": "Moyenne",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "L’entrepreneur principal est tenu d’afficher de manière permanente dans ses bureaux la liste de tous ses sous-traitants.",
    "category": "Gestion Administrative",
    "status": "active"
  },
  {
    "num": 31,
    "title": "Paiement de la rémunération en monnaie étrangère ou non légale",
    "article": "Art 89 et 90",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "Le salaire de base et les indemnités doivent être stipulés et payés en monnaie légale (Franc Congolais) sauf dérogations autorisées.",
    "category": "Rémunération & Emplois",
    "status": "active"
  },
  {
    "num": 32,
    "title": "Retard de paiement ou paiement de rémunération hors des délais légaux",
    "article": "Art 98, 99, 100 et 101",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Amende administrative + Intérêts de retard",
    "amende": 3000,
    "observations": "La rémunération doit être payée à intervalles réguliers ne dépassant pas un mois pour les employés mensuels, ou 15 jours pour les journaliers.",
    "category": "Rémunération & Emplois",
    "status": "active"
  },
  {
    "num": 33,
    "title": "Paiement de salaire sans remise d’un décompte écrit (Fiche de Paie)",
    "article": "Art 103",
    "reference": "Code du Travail RDC",
    "gravity": "Moyenne",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "La remise d’un bulletin de paie écrit et détaillé est obligatoire lors de chaque versement de salaire ou règlement final.",
    "category": "Rémunération & Emplois",
    "status": "active"
  },
  {
    "num": 34,
    "title": "Retenues de salaire illégales ou amendes infligées par l’employeur",
    "article": "Art 111 et 112",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Restitution des sommes + Amende",
    "amende": 3000,
    "observations": "L’employeur ne peut s’octroyer le droit d’infliger des amendes pécuniaires ou des retenues indues sur la rémunération des agents.",
    "category": "Rémunération & Emplois",
    "status": "active"
  },
  {
    "num": 35,
    "title": "Violation des règles régissant les économats d’entreprise",
    "article": "Art 116",
    "reference": "Code du Travail RDC",
    "gravity": "Moyenne",
    "sanction": "Fermeture de l’économat + Amende",
    "amende": 3000,
    "observations": "Il est interdit d’obliger les travailleurs à acheter leurs denrées ou articles dans l’économat de l’entreprise.",
    "category": "Conditions de Travail",
    "status": "active"
  },
  {
    "num": 36,
    "title": "Discrimination de genre, d’origine ou de handicap au travail",
    "article": "Art 136",
    "reference": "Code du Travail RDC",
    "gravity": "Très Grave",
    "sanction": "Poursuites judiciaires + Amende",
    "amende": 5000,
    "observations": "Toute discrimination directe ou indirecte fondée sur le sexe, le handicap, l’origine, l’ethnie ou la religion est interdite.",
    "category": "Protection des Travailleurs",
    "status": "active"
  },
  {
    "num": 37,
    "title": "Défaut de fourniture de logement ou d’indemnité de logement compensatoire",
    "article": "Art 138 et 139",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "L’employeur doit loger le travailleur muté ou lui verser une indemnité de logement décente représentative de sa situation familiale.",
    "category": "Protection des Travailleurs",
    "status": "active"
  },
  {
    "num": 38,
    "title": "Défaut de planning de congés annuels ou non-octroi des congés",
    "article": "Art 140-146",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "Le travailleur a droit à un congé annuel payé d’au moins un jour et demi ouvrable par mois entier de service. Un planning doit être établi.",
    "category": "Conditions de Travail",
    "status": "active"
  },
  {
    "num": 39,
    "title": "Défaut de prise en charge des frais de voyage/rapatriement du travailleur et sa famille",
    "article": "Art 147-156",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Poursuite pénale / Saisie du Tribunal + Amende",
    "amende": 3000,
    "observations": "L’employeur prend en charge les frais de voyage du travailleur et de sa famille de leur résidence habituelle au lieu d’emploi et vice-versa.",
    "category": "Conditions de Travail",
    "status": "active"
  },
  {
    "num": 40,
    "title": "Absence de Comité de Sécurité, d’Hygiène et d’Embellissement (CSHE)",
    "article": "Art 167",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "Un Comité d’Hygiène, Santé et Embellissement des lieux de travail doit être obligatoirement constitué dans les établissements de 50 salariés ou plus.",
    "category": "Hygiène, Santé & Sécurité",
    "status": "active"
  },
  {
    "num": 41,
    "title": "Défaut de déclaration d’un accident de travail ou maladie professionnelle",
    "article": "Art 176",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "L’employeur est tenu de signaler à l’Inspecteur du travail et à la CNSS tout accident de travail dans un délai légal maximum de 48 heures.",
    "category": "Hygiène, Santé & Sécurité",
    "status": "active"
  },
  {
    "num": 42,
    "title": "Défaut d’une convention médicale ou d’un service médical d’entreprise",
    "article": "Art 177 et 178",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "Tout établissement doit organiser un service médical et pharmaceutique au bénéfice exclusif de ses travailleurs et de leurs familles.",
    "category": "Hygiène, Santé & Sécurité",
    "status": "active"
  },
  {
    "num": 43,
    "title": "Défaut de tenue ou de mise à jour du Livre de Paie",
    "article": "Art 213-216",
    "reference": "Code du Travail RDC",
    "gravity": "Moyenne",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "L’employeur doit obligatoirement tenir au siège de l’établissement un livre de paie visé par l’Inspecteur du Travail.",
    "category": "Gestion Administrative",
    "status": "active"
  },
  {
    "num": 44,
    "title": "Défaut de Déclaration d’ouverture d’établissement ou mouvement du personnel",
    "article": "Art 217",
    "reference": "Code du Travail RDC",
    "gravity": "Moyenne",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "Toute personne physique ou morale qui se propose d’exploiter une entreprise de quelque nature que ce soit doit en faire la déclaration à l’ONEM.",
    "category": "Gestion Administrative",
    "status": "active"
  },
  {
    "num": 45,
    "title": "Défaut de Déclaration annuelle de la situation de la main d’œuvre et Bilan Social",
    "article": "Art 218",
    "reference": "Code du Travail RDC",
    "gravity": "Moyenne",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "L’employeur est tenu d’envoyer chaque année au Ministère du Travail et à l’ONEM un rapport d’activités, un bilan social et l’état de la main d’œuvre.",
    "category": "Gestion Administrative",
    "status": "active"
  },
  {
    "num": 46,
    "title": "Ouverture clandestine ou sans caution d’un secrétariat social",
    "article": "Art 221",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "Aucun organisme ne peut exercer des fonctions de secrétariat social sans agrément ministériel préalable et versement d’une caution.",
    "category": "Gestion Administrative",
    "status": "active"
  },
  {
    "num": 47,
    "title": "Priver un représentant au Conseil National du Travail du droit de participation",
    "article": "Art 229",
    "reference": "Code du Travail RDC",
    "gravity": "Moyenne",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "Les employeurs doivent accorder aux travailleurs membres du Conseil National du Travail le temps nécessaire pour participer aux sessions.",
    "category": "Relations Collectives",
    "status": "active"
  },
  {
    "num": 48,
    "title": "Discrimination ou licenciement abusif pour motif syndical",
    "article": "Art 234",
    "reference": "Code du Travail RDC",
    "gravity": "Très Grave",
    "sanction": "Poursuite pénale + Réintégration syndicale",
    "amende": 5000,
    "observations": "Il est formellement interdit à tout employeur de licencier un travailleur ou de discriminer en raison de son affiliation ou activité syndicale.",
    "category": "Relations Collectives",
    "status": "active"
  },
  {
    "num": 49,
    "title": "Licenciement d’un délégué syndical sans accord de l’Inspecteur du Travail",
    "article": "Art 258",
    "reference": "Code du Travail RDC",
    "gravity": "Très Grave",
    "sanction": "Réintégration forcée + Amende",
    "amende": 5000,
    "observations": "Le licenciement d’un représentant des travailleurs (délégué) exige obligatoirement l’autorisation préalable écrite de l’Inspecteur du Travail.",
    "category": "Relations Collectives",
    "status": "active"
  },
  {
    "num": 50,
    "title": "Défaut d’octroi du crédit d’heures mensuel aux délégués du personnel",
    "article": "Art 260",
    "reference": "Code du Travail RDC",
    "gravity": "Moyenne",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "L’employeur doit accorder aux représentants des travailleurs le crédit de temps rémunéré (minimum 15 heures par mois) pour l’exercice de leur mandat.",
    "category": "Relations Collectives",
    "status": "active"
  },
  {
    "num": 51,
    "title": "Obstruction à l’accès des locaux ou non-communication des informations aux délégués",
    "article": "Art 261",
    "reference": "Code du Travail RDC",
    "gravity": "Moyenne",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "Les représentants des travailleurs ont droit à des locaux décents, un panneau d’affichage et l’accès aux rapports économiques trimestriels.",
    "category": "Relations Collectives",
    "status": "active"
  },
  {
    "num": 52,
    "title": "Non-respect de l’obligation de convoquer les réunions trimestrielles des délégués",
    "article": "Art 262",
    "reference": "Code du Travail RDC",
    "gravity": "Moyenne",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "L’employeur est tenu de convoquer au moins une fois par trimestre les représentants des travailleurs en réunion conjointe.",
    "category": "Relations Collectives",
    "status": "active"
  },
  {
    "num": 53,
    "title": "Entrave à l’exercice régulier des fonctions des délégués syndicaux",
    "article": "Art 263",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "Toute mesure visant à empêcher ou entraver l’exercice légitime du mandat de délégué du personnel est constitutive d’un délit d’entrave.",
    "category": "Relations Collectives",
    "status": "active"
  },
  {
    "num": 54,
    "title": "Non-respect des accords collectifs ou décisions de médiation de conflit collectif",
    "article": "Art 304",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "Les accords issus des procédures de conciliation collective ou les décisions arbitrales ont force obligatoire et s’imposent aux parties.",
    "category": "Relations Collectives",
    "status": "active"
  },
  {
    "num": 55,
    "title": "Recours à la violence, menaces ou manœuvres frauduleuses lors d’embauche ou de grève",
    "article": "Art 323",
    "reference": "Code du Travail RDC",
    "gravity": "Très Grave",
    "sanction": "Poursuite pénale + Amende administrative",
    "amende": 5000,
    "observations": "Est coupable d’infraction quiconque use de violence, menaces ou ruse pour s’opposer à l’embauche ou contraindre à une grève/reprise du travail.",
    "category": "Relations Collectives",
    "status": "active"
  },
  {
    "num": 56,
    "title": "Suspension illégale du contrat de travail en dehors des motifs prévus",
    "article": "Art 57 et 58",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Amende administrative + Rappel des salaires",
    "amende": 3000,
    "observations": "Le contrat ne peut être suspendu que pour des causes limitativement énumérées par la loi (maladie, grève licite, détention, etc.).",
    "category": "Contrats & Apprentissage",
    "status": "active"
  },
  {
    "num": 57,
    "title": "Abus du travail de nuit ou défaut de majoration salariale de nuit",
    "article": "Art 124",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Amende administrative + Rappel de majoration",
    "amende": 3000,
    "observations": "Le travail de nuit (entre 22h et 5h) est soumis à une majoration légale obligatoire de salaire et à des conditions restrictives.",
    "category": "Conditions de Travail",
    "status": "active"
  },
  {
    "num": 58,
    "title": "Défaut de restauration des travailleurs (absence de réfectoire ou prime)",
    "article": "Art 139",
    "reference": "Code du Travail RDC",
    "gravity": "Moyenne",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "L’employeur est tenu de fournir un réfectoire salubre ou une ration alimentaire compensatoire aux salariés sur certains chantiers éloignés.",
    "category": "Conditions de Travail",
    "status": "active"
  },
  {
    "num": 59,
    "title": "Défaut de dépôt et validation du Règlement d’Entreprise à l’Inspection",
    "article": "Art 158",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "Le règlement intérieur élaboré doit être déposé pour visa et enregistrement à l’Inspection du Travail avant son entrée en vigueur.",
    "category": "Gestion Administrative",
    "status": "active"
  },
  {
    "num": 60,
    "title": "Défaut de convocation ou carence d’organisation du comité d’hygiène et sécurité",
    "article": "Art 169",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Amende administrative",
    "amende": 3000,
    "observations": "Le Comité de Sécurité et d’Hygiène doit se réunir de manière régulière et consigner ses procès-verbaux dans un registre officiel.",
    "category": "Hygiène, Santé & Sécurité",
    "status": "active"
  },
  {
    "num": 61,
    "title": "Défaut de réponse aux invitations ou convocations de l’Inspecteur du Travail",
    "article": "Art 321",
    "reference": "Code du Travail RDC",
    "gravity": "Très Grave",
    "sanction": "Amende administrative + Constat de carence",
    "amende": 3000,
    "observations": "Le fait de ne pas déférer à trois convocations successives de l’Inspecteur du Travail pour conciliation est constitutif d’une infraction grave.",
    "category": "Gestion Administrative",
    "status": "active"
  },
  {
    "num": 62,
    "title": "Obstruction totale ou entrave au contrôle de l’Inspecteur / Contrôleur du Travail",
    "article": "Art 322",
    "reference": "Code du Travail RDC",
    "gravity": "Très Grave",
    "sanction": "Amende de 30,000 USD + Servitude pénale de 30 jours",
    "amende": 30000,
    "observations": "Le fait de s’opposer à la visite d’un inspecteur, de lui refuser l’accès aux locaux ou la communication des registres légaux est puni d’amende de 30.000$ et de servitude pénale.",
    "category": "Gestion Administrative",
    "status": "active"
  },
  {
    "num": 63,
    "title": "Incitation au refus d’obligations légales, lacération ou faux en écritures de contrats",
    "article": "Art 323",
    "reference": "Code du Travail RDC",
    "gravity": "Très Grave",
    "sanction": "Poursuite pénale + Amende administrative",
    "amende": 5000,
    "observations": "Est puni d’amende et de prison quiconque détruit, lacère, ou altère frauduleusement les contrats écrits de son personnel.",
    "category": "Protection des Travailleurs",
    "status": "active"
  },
  {
    "num": 64,
    "title": "Atteinte à l’exercice du mandat syndical ou détournement des cautionnements",
    "article": "Art 324",
    "reference": "Code du Travail RDC",
    "gravity": "Très Grave",
    "sanction": "Poursuite pénale + Amende administrative",
    "amende": 5000,
    "observations": "Toute entrave volontaire à la désignation libre des délégués syndicaux ou le détournement de cautionnements d’agents est puni de servitude pénale.",
    "category": "Relations Collectives",
    "status": "active"
  },
  {
    "num": 65,
    "title": "Défaut de paiement du décompte final dans les 2 jours de la fin de contrat",
    "article": "Art 100-104",
    "reference": "Code du Travail RDC",
    "gravity": "Grave",
    "sanction": "Amende administrative + Rappel de solde de tout compte",
    "amende": 3000,
    "observations": "Tout paiement de solde de tout compte (décompte final) doit être versé au travailleur au plus tard deux jours ouvrables après la cessation des services.",
    "category": "Rémunération & Emplois",
    "status": "active"
  }
];

// 2. PROVINCES DATABASE (All 26 Provinces and Directions Provinciales)
const PROVINCES_DB = [
  { name: "Kinshasa", dirProv: "Direction Provinciale de Kinshasa", code: "KIN" },
  { name: "Kongo Central", dirProv: "Direction Provinciale du Kongo Central", code: "KGC" },
  { name: "Kwango", dirProv: "Direction Provinciale du Kwango", code: "KWA" },
  { name: "Kwilu", dirProv: "Direction Provinciale du Kwilu", code: "KWL" },
  { name: "Mai-Ndombe", dirProv: "Direction Provinciale du Mai-Ndombe", code: "MND" },
  { name: "Kasaï", dirProv: "Direction Provinciale du Kasaï", code: "KAS" },
  { name: "Kasaï Central", dirProv: "Direction Provinciale du Kasaï Central", code: "KAC" },
  { name: "Kasaï Oriental", dirProv: "Direction Provinciale du Kasaï Oriental", code: "KAO" },
  { name: "Lomami", dirProv: "Direction Provinciale de la Lomami", code: "LOM" },
  { name: "Sankuru", dirProv: "Direction Provinciale du Sankuru", code: "SAN" },
  { name: "Maniema", dirProv: "Direction Provinciale du Maniema", code: "MAN" },
  { name: "Sud-Kivu", dirProv: "Direction Provinciale du Sud-Kivu", code: "SKV" },
  { name: "Nord-Kivu", dirProv: "Direction Provinciale du Nord-Kivu", code: "NKV" },
  { name: "Ituri", dirProv: "Direction Provinciale de l'Ituri", code: "ITU" },
  { name: "Haut-Uélé", dirProv: "Direction Provinciale du Haut-Uélé", code: "HUL" },
  { name: "Bas-Uélé", dirProv: "Direction Provinciale du Bas-Uélé", code: "BUL" },
  { name: "Tshopo", dirProv: "Direction Provinciale du Tshopo", code: "TSH" },
  { name: "Mongala", dirProv: "Direction Provinciale de la Mongala", code: "MON" },
  { name: "Nord-Ubangi", dirProv: "Direction Provinciale du Nord-Ubangi", code: "NUB" },
  { name: "Sud-Ubangi", dirProv: "Direction Provinciale du Sud-Ubangi", code: "SUB" },
  { name: "Équateur", dirProv: "Direction Provinciale de l'Équateur", code: "EQU" },
  { name: "Tanganyika", dirProv: "Direction Provinciale du Tanganyika", code: "TAN" },
  { name: "Haut-Lomami", dirProv: "Direction Provinciale du Haut-Lomami", code: "HLM" },
  { name: "Lualaba", dirProv: "Direction Provinciale du Lualaba", code: "LUA" },
  { name: "Haut-Katanga", dirProv: "Direction Provinciale du Haut-Katanga", code: "HKT" },
  { name: "Tshuapa", dirProv: "Direction Provinciale de la Tshuapa", code: "TSU" }
];

// Sample Initial Inspectors List
const DEFAULT_INSPECTORS = [
  { name: "MITWINSI WANET Hardy", habilitation: "3196/PRO15/021/2025", opj: "0073/PGI/GOMBE", initials: "HMW" },
  { name: "Steve BIEMBONGO MBULA", habilitation: "2044/PRO11/045/2024", opj: "0194/PGI/GOMBE", initials: "SBM" },
  { name: "Justin LOMWANGA LINDENGE", habilitation: "0268/PPCAKG/2001", opj: "0073/PRO21/GOMBE", initials: "JLL" },
  { name: "KANDJA OTANGANDO Joseph", habilitation: "4028/PRO15/012/2026", opj: "0412/PGI/MATETE", initials: "JKO" }
];

// 3. APPLICATION STATE
let pvs = [];
let currentPV = createEmptyPV();
let signatureTarget = ''; // "inspecteur", "contrevenant", "controleur", "temoin"
let currentSpeechField = '';
let isListening = false;
let recognition = null;
let videoStream = null;
let selectedInfractionIndex = -1;

// Initialize App
window.onload = function() {
  loadDatabase();
  initFormProvinces();
  initFormInspecteurs();
  loadTemplateFields();
  initSignaturePad();
  initDraggableStamp();
  updateA4Preview();
  renderDashboard();
  renderParams();
  
  // Setup auto-save backup (Every 10 seconds)
  setInterval(autoSaveBackup, 10000);
  
  // Custom scroll event tracking for stamp bounds check
  const documentPreview = document.getElementById("a4-document-preview");
  if (documentPreview) {
    documentPreview.addEventListener("scroll", updateA4Preview);
  }
};

// Create a blank/empty PV structure
function createEmptyPV() {
  const uniqId = 'PV-' + Math.random().toString(36).substr(2, 9);
  return {
    id: uniqId,
    type: 'infraction', // infraction, obstruction, non-conciliation, mise-en-demeure
    numMode: 'auto',
    num: '',
    province: 'Kinshasa',
    directionProv: 'Direction Provinciale de Kinshasa',
    administration: 'Administration Centrale',
    inspection: 'Inspection Urbaine de Limete',
    inspecteurName: 'MITWINSI WANET Hardy',
    habilitation: '3196/PRO15/021/2025',
    opj: '0073/PGI/GOMBE',
    ordreMission: '',
    date: new Date().toISOString().split('T')[0],
    heure: new Date().toTimeString().split(' ')[0].substring(0, 5),
    entreprise: '',
    rccm: '',
    idnat: '',
    impot: '',
    adresse: '',
    ville: 'Kinshasa',
    repNom: '',
    repFonction: '',
    repTel: '',
    narrativeText: '',
    infractions: [], // List of active infractions on this PV
    observationsFinales: "Ces amendes sont mises à sa charge suite aux infractions constatées au regard des dispositions légales en vigueur en RDC. L'entreprise est tenue de se conformer aux prescriptions de la loi dans un bref délai. Nonobstant le paiement desdites amendes, elle reste tenue de régulariser toutes les situations irrégulières constatées.",
    signatures: {
      inspecteur: { name: 'MITWINSI WANET Hardy', img: '' },
      contrevenant: { name: 'Comptable', img: '' },
      controleur: { name: '', img: '' },
      temoin: { name: '', img: '' }
    },
    stamp: {
      enabled: false,
      top: '75%',
      left: '65%'
    },
    status: 'draft', // draft, signed, archived
    history: [
      { action: "Brouillon initial créé", author: "Inspecteur", date: new Date().toLocaleString() }
    ],
    totalFines: 0
  };
}

// 4. TAB NAVIGATION
function switchTab(tabId) {
  // Hide all sections
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  // Show target
  const targetSec = document.getElementById('tab-' + tabId);
  if (targetSec) targetSec.classList.add('active');
  
  // Set active sidebar menu
  document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
  // Find match
  const menuItems = Array.from(document.querySelectorAll('.menu-item'));
  const clickedItem = menuItems.find(item => item.getAttribute('onclick').includes(tabId));
  if (clickedItem) clickedItem.classList.add('active');
  
  // Stop camera if leaving scanner
  if (tabId !== 'scanner') {
    stopCameraScanner();
  }
  
  // Stop TTS synthesis if leaving
  stopSpeechSynthesis();
  
  // Update view titles
  const viewTitles = {
    'accueil': { title: 'Tableau de bord', subtitle: 'Aperçu général de l\'activité d'inspection du travail' },
    'nouveau-pv': { title: 'Élaboration de Procès-Verbal', subtitle: 'Plateforme administrative professionnelle de rédaction' },
    'tous-pv': { title: 'Tous les Procès-Verbaux', subtitle: 'Historique, recherche avancée et contrôle de conformité' },
    'brouillons': { title: 'Mes Brouillons', subtitle: 'Gérer vos documents temporaires sauvegardés' },
    'modeles': { title: 'Bibliothèque de Modèles IGT', subtitle: 'Modèles officiels d\'inspection du travail préconfigurés' },
    'assistant-ia': { title: 'Assistant IA Juridique', subtitle: 'Intelligence Artificielle d\'aide à la décision et de conformité du travail en RDC' },
    'scanner': { title: 'Scanner de PV Sécurisés', subtitle: 'Vérifier l\'authenticité et la validité d\'un document d'inspection' },
    'parametres': { title: 'Paramètres du Module', subtitle: 'Configuration des inspecteurs, des provinces et des sauvegardes' }
  };
  
  if (viewTitles[tabId]) {
    document.getElementById('view-title').textContent = viewTitles[tabId].title;
    document.getElementById('view-subtitle').textContent = viewTitles[tabId].subtitle;
  }
  
  // Render specific views on switch
  if (tabId === 'accueil') {
    renderDashboard();
  } else if (tabId === 'tous-pv') {
    renderPVDatabase();
  } else if (tabId === 'brouillons') {
    renderDraftsList();
  } else if (tabId === 'parametres') {
    renderParams();
  }
  
  // Trigger preview update
  updateA4Preview();
}

// 5. LOCAL STORAGE & DATA SEEDING
function loadDatabase() {
  const stored = localStorage.getItem('inspecteurbot_pvs');
  if (stored) {
    pvs = JSON.parse(stored);
  } else {
    // Seed with 2 high quality professional sample PVs for gorgeous initial dashboard view!
    seedDemoData();
  }
  
  // Setup inspectors list if empty
  if (!localStorage.getItem('inspecteurbot_inspecteurs')) {
    localStorage.setItem('inspecteurbot_inspecteurs', JSON.stringify(DEFAULT_INSPECTORS));
  }
  
  updateDraftCountBadge();
}

function saveDatabaseToLocalStorage() {
  localStorage.setItem('inspecteurbot_pvs', JSON.stringify(pvs));
  updateDraftCountBadge();
}

function updateDraftCountBadge() {
  const drafts = pvs.filter(pv => pv.status === 'draft');
  const badge = document.getElementById('drafts-count-badge');
  if (badge) badge.textContent = drafts.length;
}

function seedDemoData() {
  const demoPV1 = createEmptyPV();
  demoPV1.id = "PV-5028c2e6";
  demoPV1.type = "infraction";
  demoPV1.num = "0024/MET/IGT/DPK/HMW/JUIN/2026";
  demoPV1.entreprise = "HOME PLUS Sarl";
  demoPV1.rccm = "CD/KIN/RCCM/22-B-04128";
  demoPV1.idnat = "01-490-N38410Y";
  demoPV1.impot = "A1583094W";
  demoPV1.adresse = "N°19, Avenue 9ème rue, Quartier Industriel, Limete";
  demoPV1.repNom = "KASONGO JOHN";
  demoPV1.repFonction = "Comptable";
  demoPV1.repTel = "0810097620";
  demoPV1.status = "signed";
  demoPV1.date = "2026-06-11";
  demoPV1.infractions = [
    { ...INFRACTIONS_DB[0], quantity: 1, total: 3000, observations: "Non-affichage constaté lors du contrôle." },
    { ...INFRACTIONS_DB[2], quantity: 5, total: 25000, observations: "Cinq contrats constatés non écrits." },
    { ...INFRACTIONS_DB[3], quantity: 1, total: 3000, observations: "Règlement intérieur non déposé." }
  ];
  demoPV1.totalFines = 31000;
  demoPV1.history = [
    { action: "Créé par l'inspecteur", author: "MITWINSI WANET Hardy", date: "11/06/2026, 10:15:30" },
    { action: "Signatures apposées", author: "Comptable / Inspecteur", date: "11/06/2026, 11:32:00" },
    { action: "PV Validé, scellé et sécurisé", author: "Inspection Générale", date: "11/06/2026, 11:45:00" }
  ];
  demoPV1.stamp.enabled = true;
  
  const demoPV2 = createEmptyPV();
  demoPV2.id = "PV-8839b2a1";
  demoPV2.type = "obstruction";
  demoPV2.num = "0025/MET/IGT/DPK/SBM/NOV/2025";
  demoPV2.entreprise = "FERME AGRO-SOL FASOL SARLU";
  demoPV2.rccm = "CD/GOMBE/RCCM/24-A-10294";
  demoPV2.idnat = "02-120-M10934C";
  demoPV2.adresse = "N°13 B, Avenue 10ème Rue, Quartier Industriel, Limete";
  demoPV2.repNom = "Sieur Charles ILUNGA";
  demoPV2.repFonction = "Conseiller Juridique";
  demoPV2.repTel = "0897590216";
  demoPV2.status = "signed";
  demoPV2.date = "2025-11-25";
  demoPV2.narrativeText = "En effet, nous étions dans l'impossibilité d'accomplir la mission officielle de contrôle de l'Inspection Générale du Travail qui nous est dévolue par la loi. Nous avons fait l'objet d'une obstruction totale et d'un refus de laisser l'Inspecteur accéder aux archives administratives de l'établissement par le responsable de la société susmentionnée, Sieur Charles ILUNGA, agissant en qualité de Conseiller Juridique. Ce fait contrevient expressément aux dispositions de l'Article 322 du Code du Travail Congolais.";
  demoPV2.totalFines = 30000; // Constat d'obstruction has fixed fine
  demoPV2.history = [
    { action: "Créé par Steve BIEMBONGO MBULA", author: "Steve BIEMBONGO MBULA", date: "25/11/2025, 14:02:10" },
    { action: "Signé et scellé", author: "Steve BIEMBONGO MBULA", date: "25/11/2025, 15:10:00" }
  ];
  demoPV2.stamp.enabled = true;
  
  pvs = [demoPV1, demoPV2];
  saveDatabaseToLocalStorage();
}

// 6. INITIALIZE FORM FIELDS
function initFormProvinces() {
  const select = document.getElementById('pv-province');
  if (!select) return;
  select.innerHTML = "";
  
  PROVINCES_DB.forEach((prov, idx) => {
    const opt = document.createElement('option');
    opt.value = prov.name;
    opt.textContent = prov.name;
    if (idx === 0) opt.selected = true; // Kinshasa by default
    select.appendChild(opt);
  });
  
  handleProvinceChange();
}

function handleProvinceChange() {
  const provName = document.getElementById('pv-province').value;
  const provObj = PROVINCES_DB.find(p => p.name === provName);
  if (provObj) {
    document.getElementById('pv-direction').value = provObj.dirProv;
  }
  
  // Re-generate PV number in auto mode
  generatePVNumberAutomatically();
  updateA4Preview();
}

function initFormInspecteurs() {
  const select = document.getElementById('pv-inspecteur');
  if (!select) return;
  select.innerHTML = "";
  
  const inspectors = JSON.parse(localStorage.getItem('inspecteurbot_inspecteurs')) || DEFAULT_INSPECTORS;
  inspectors.forEach((ins, idx) => {
    const opt = document.createElement('option');
    opt.value = ins.name;
    opt.textContent = ins.name;
    if (idx === 0) opt.selected = true;
    select.appendChild(opt);
  });
  
  handleInspecteurChange();
}

function handleInspecteurChange() {
  const insName = document.getElementById('pv-inspecteur').value;
  const inspectors = JSON.parse(localStorage.getItem('inspecteurbot_inspecteurs')) || DEFAULT_INSPECTORS;
  const insObj = inspectors.find(i => i.name === insName);
  if (insObj) {
    document.getElementById('pv-habilitation').value = insObj.habilitation;
    document.getElementById('pv-opj').value = insObj.opj;
    
    // Set current PV signatures name
    currentPV.inspecteurName = insObj.name;
    currentPV.habilitation = insObj.habilitation;
    currentPV.opj = insObj.opj;
  }
  
  generatePVNumberAutomatically();
  updateA4Preview();
}

function toggleNumMode() {
  const mode = document.getElementById('pv-num-mode').value;
  const input = document.getElementById('pv-num-input');
  
  if (mode === 'auto') {
    input.disabled = true;
    generatePVNumberAutomatically();
  } else {
    input.disabled = false;
    input.value = "";
    input.placeholder = "ex: 0024/MET/IGT/DPK/HMW/JUIN/2026";
  }
  updateA4Preview();
}

function generatePVNumberAutomatically() {
  const mode = document.getElementById('pv-num-mode').value;
  if (mode !== 'auto') return;
  
  const provName = document.getElementById('pv-province').value;
  const provObj = PROVINCES_DB.find(p => p.name === provName) || PROVINCES_DB[0];
  
  const insName = document.getElementById('pv-inspecteur').value;
  const inspectors = JSON.parse(localStorage.getItem('inspecteurbot_inspecteurs')) || DEFAULT_INSPECTORS;
  const insObj = inspectors.find(i => i.name === insName) || inspectors[0];
  
  // Calculate month and year
  const dateVal = document.getElementById('pv-date').value || new Date().toISOString().split('T')[0];
  const dateObj = new Date(dateVal);
  const months = ["JANV", "FEVR", "MARS", "AVRIL", "MAI", "JUIN", "JUIL", "AOUT", "SEPT", "OCTO", "NOVE", "DECE"];
  const monthName = months[dateObj.getMonth()];
  const yearName = dateObj.getFullYear();
  
  // Calculate a mock sequential
  const seq = String(pvs.length + 1).padStart(4, '0');
  
  const officialNum = `${seq}/MET/IGT/${provObj.code}/${insObj.initials}/${monthName}/${yearName}`;
  document.getElementById('pv-num-input').value = officialNum;
}

// 7. TEMPLATE SELECTION DYNAMICS
function loadTemplateFields() {
  const type = document.getElementById('pv-template-select').value;
  currentPV.type = type;
  
  const sectionInfractions = document.getElementById('form-section-infractions');
  const sectionNarrative = document.getElementById('form-section-narrative');
  const tableInfractions = document.getElementById('preview-table-infractions');
  
  if (type === 'infraction') {
    sectionInfractions.style.display = 'block';
    sectionNarrative.style.display = 'none';
    tableInfractions.style.display = 'table';
    document.getElementById('pv-observations-finales').value = "Ces amendes sont mises à sa charge suite aux infractions constatées au regard des dispositions légales en vigueur en RDC. L'entreprise est tenue de se conformer aux prescriptions de la loi dans un bref délai. Nonobstant le paiement desdites amendes, elle reste tenue de régulariser toutes les situations irrégulières constatées.";
  } else {
    sectionInfractions.style.display = 'none';
    sectionNarrative.style.display = 'block';
    tableInfractions.style.display = 'none';
    
    // Set standard narrative skeletons based on selection
    if (type === 'obstruction') {
      document.getElementById('pv-narrative-text').value = "En effet, nous étions dans l'impossibilité d'accomplir la mission officielle de contrôle de l'Inspection Générale du Travail qui nous est dévolue par la loi. Nous avons fait l'objet d'une obstruction totale et d'un refus de laisser l'Inspecteur accéder aux archives administratives de l'établissement par le responsable de la société susmentionnée, Sieur [Nom du Représentant], agissant en qualité de [Fonction]. Ce fait contrevient expressément aux dispositions de l'Article 322 du Code du Travail Congolais.";
      document.getElementById('pv-observations-finales').value = "Conformément à la loi, ce procès-verbal de constat d'obstruction est dressé en trois ampliations dont chacune d'elle sera remise au Ministère ayant la Charge de l'Emploi et Travail, au Procureur Près le Parquet de Grande Instance et au contrevenant.";
    } else if (type === 'non-conciliation') {
      document.getElementById('pv-narrative-text').value = "Que Monsieur [Nom du Travailleur] (demandeur) d'une part, se plaint d'avoir été licencié de manière abusive par la société [Nom de l'Entreprise] (défenderesse) d'autre part, représentée par [Nom du Représentant]. Après examen des pièces fournies par les parties, l'Inspecteur constate que la procédure de résiliation n'a pas été respectée, créant des préjudices financiers pour le travailleur. La défenderesse refuse de procéder au paiement des indemnités légales proposées de l'ordre de [Montant]$ USD.";
      document.getElementById('pv-observations-finales').value = "DESACCORD DES PARTIES : Après une tentative de conciliation menée par nos soins sous l'égide de l'Article 302 du Code du Travail, les deux parties ne sont pas parvenues à un accord. Le présent procès-verbal est dressé pour valoir ce que de droit.";
    } else if (type === 'mise-en-demeure') {
      document.getElementById('pv-narrative-text').value = "Monsieur le Responsable,\nJe vous écris suite à nos tentatives répétées d'inspecter vos locaux conformément à notre ordre de mission officiel. En dépit de nos démarches, vous refusez systématiquement l'accès à vos bureaux ou la communication de vos registres obligatoires (livre de paie, horaire de travail, contrats). Ce refus persistant constitue une entrave grave au libre exercice des pouvoirs dévolus aux inspecteurs du travail par le Code du Travail (Articles 187, 196 et 197).";
      document.getElementById('pv-observations-finales').value = "Par la présente, je vous mets en demeure de donner accès libre à notre mission et de nous fournir les documents demandés dans un délai de 24 heures à compter de la réception de cette lettre. À défaut, nous saisirons la juridiction pénale compétente.";
    }
  }
  
  // Re-run number generation
  generatePVNumberAutomatically();
  updateA4Preview();
}

// 8. INFRACTIONS AUTOMATIC MANAGEMENT
function filterInfractionsDropdown() {
  const query = document.getElementById('infraction-search-input').value.toLowerCase();
  const resultsDiv = document.getElementById('infractions-search-results');
  resultsDiv.innerHTML = "";
  
  if (!query) {
    resultsDiv.style.display = "none";
    return;
  }
  
  const filtered = INFRACTIONS_DB.filter(inf => 
    inf.title.toLowerCase().includes(query) || 
    inf.article.toLowerCase().includes(query) ||
    inf.num.toString().includes(query) ||
    inf.category.toLowerCase().includes(query)
  );
  
  if (filtered.length === 0) {
    resultsDiv.innerHTML = "<div style='padding:0.5rem; text-align:center; font-size:0.8rem; color:var(--text-muted);'>Aucune infraction correspondante.</div>";
    resultsDiv.style.display = "block";
    return;
  }
  
  filtered.slice(0, 5).forEach(inf => {
    const item = document.createElement('div');
    item.style.padding = "0.5rem 0.75rem";
    item.style.borderBottom = "1px solid var(--border-color)";
    item.style.cursor = "pointer";
    item.style.fontSize = "0.8rem";
    item.innerHTML = `<strong>N°${inf.num}. ${inf.title}</strong><br><span style="font-size:0.7rem; color:var(--text-muted);">${inf.article} | ${inf.amende}$ USD</span>`;
    
    item.onclick = function() {
      selectInfraction(inf.num);
      resultsDiv.style.display = "none";
    };
    resultsDiv.appendChild(item);
  });
  
  resultsDiv.style.display = "block";
}

function selectInfraction(num) {
  const inf = INFRACTIONS_DB.find(i => i.num === num);
  if (!inf) return;
  
  selectedInfractionIndex = num;
  document.getElementById('infraction-search-input').value = inf.title;
  
  const container = document.getElementById('selected-infraction-details');
  container.innerHTML = `
    <div style="font-size:0.8rem;">
      <p style="font-weight:700; color:var(--primary-color);">Infraction N°${inf.num} : ${inf.title}</p>
      <p style="margin-top:0.25rem;"><strong>Base légale :</strong> ${inf.article} (${inf.reference})</p>
      <p><strong>Gravité / Sanction :</strong> <span class="badge ${inf.gravity === 'Très Grave' ? 'bg-danger-soft' : 'bg-warning-soft'}">${inf.gravity}</span> | ${inf.sanction}</p>
      <p><strong>Amende transactionnelle :</strong> <span style="font-weight:bold; color:var(--accent-color);">${inf.amende}$ USD</span></p>
      <div style="margin-top:0.5rem;" class="form-grid">
        <div class="form-group" style="margin:0;">
          <label style="font-size:0.7rem;">Quantité d'infractions (ex: nb de contrats)</label>
          <input type="number" id="sel-inf-qty" value="1" min="1" style="padding:0.25rem 0.5rem; font-size:0.75rem;">
        </div>
        <div class="form-group" style="margin:0;">
          <label style="font-size:0.7rem;">Amende unitaire ajustable ($)</label>
          <input type="number" id="sel-inf-price" value="${inf.amende}" style="padding:0.25rem 0.5rem; font-size:0.75rem;">
        </div>
      </div>
      <div class="form-group" style="margin-top:0.5rem;">
        <label style="font-size:0.7rem;">Observations spécifiques du contrôleur</label>
        <textarea id="sel-inf-obs" rows="2" style="font-size:0.75rem; padding:0.25rem;">${inf.observations}</textarea>
      </div>
    </div>
  `;
}

function addSelectedInfractionToPV() {
  if (selectedInfractionIndex === -1) {
    showToast("⚠️ Veuillez d'abord rechercher et sélectionner une infraction !", "warning");
    return;
  }
  
  const inf = INFRACTIONS_DB.find(i => i.num === selectedInfractionIndex);
  const qty = parseInt(document.getElementById('sel-inf-qty').value) || 1;
  const price = parseFloat(document.getElementById('sel-inf-price').value) || inf.amende;
  const obs = document.getElementById('sel-inf-obs').value || inf.observations;
  
  // Add to current PV list
  currentPV.infractions.push({
    num: inf.num,
    title: inf.title,
    article: inf.article,
    reference: inf.reference,
    gravity: inf.gravity,
    sanction: inf.sanction,
    amende: price,
    quantity: qty,
    total: qty * price,
    observations: obs
  });
  
  showToast("✅ Infraction ajoutée au PV avec succès !", "success");
  
  // Clear selection
  selectedInfractionIndex = -1;
  document.getElementById('infraction-search-input').value = "";
  document.getElementById('selected-infraction-details').innerHTML = '<p class="text-muted text-xs">Sélectionnez une infraction ci-dessus pour afficher ses détails juridiques.</p>';
  
  updateA4Preview();
}

function removeInfractionFromPV(index) {
  currentPV.infractions.splice(index, 1);
  updateA4Preview();
  showToast("❌ Infraction supprimée du PV", "info");
}

// 9. DYNAMIC DRAGGABLE SEAL STAMP
function initDraggableStamp() {
  const stamp = document.getElementById('draggable-cachet');
  const a4Page = document.getElementById('a4-document-preview');
  if (!stamp || !a4Page) return;
  
  let isDragging = false;
  let startX, startY, initialLeft, initialTop;
  
  stamp.addEventListener('mousedown', startDrag);
  stamp.addEventListener('touchstart', startDrag, { passive: true });
  
  function startDrag(e) {
    isDragging = true;
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
    
    startX = clientX;
    startY = clientY;
    
    const rect = stamp.getBoundingClientRect();
    const parentRect = a4Page.getBoundingClientRect();
    
    initialLeft = rect.left - parentRect.left;
    initialTop = rect.top - parentRect.top;
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
  }
  
  function drag(e) {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault();
    
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
    
    const dx = clientX - startX;
    const dy = clientY - startY;
    
    const parentRect = a4Page.getBoundingClientRect();
    
    let newLeft = initialLeft + dx;
    let newTop = initialTop + dy;
    
    // Bounds constraints
    const maxLeft = parentRect.width - stamp.offsetWidth;
    const maxTop = parentRect.height - stamp.offsetHeight;
    
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));
    
    const pctLeft = (newLeft / parentRect.width) * 100;
    const pctTop = (newTop / parentRect.height) * 100;
    
    stamp.style.left = pctLeft + '%';
    stamp.style.top = pctTop + '%';
    
    currentPV.stamp.left = pctLeft + '%';
    currentPV.stamp.top = pctTop + '%';
  }
  
  function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
  }
}

function toggleStampInPreview() {
  const enabled = document.getElementById('toggle-stamp-chk').checked;
  const stamp = document.getElementById('draggable-cachet');
  if (stamp) {
    stamp.style.display = enabled ? 'flex' : 'none';
  }
  currentPV.stamp.enabled = enabled;
}

// 10. TACTILE SIGNATURE PAD MODAL
function initSignaturePad() {
  const canvas = document.getElementById('modal-sig-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let drawing = false;
  
  // Set canvas resolution to match parent bounding box
  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Touch Handlers
  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('touchstart', startDraw, { passive: true });
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('touchmove', draw, { passive: false });
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('touchend', endDraw);
  
  function startDraw(e) {
    drawing = true;
    ctx.beginPath();
    const pos = getPos(e);
    ctx.moveTo(pos.x, pos.y);
  }
  
  function draw(e) {
    if (!drawing) return;
    if (e.cancelable) e.preventDefault();
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }
  
  function endDraw() {
    drawing = false;
    ctx.closePath();
  }
  
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }
}

function openSignatureModal(target) {
  signatureTarget = target;
  document.getElementById('modal-signature').classList.add('active');
  
  // Set default name based on target
  const nameInput = document.getElementById('modal-sig-name-input');
  if (target === 'inspecteur') {
    nameInput.value = document.getElementById('pv-inspecteur').value;
    document.getElementById('modal-signature-title').textContent = "Signature de l'Inspecteur / Contrôleur";
  } else if (target === 'contrevenant') {
    nameInput.value = document.getElementById('pv-rep-nom').value || "Représentant de l'entreprise";
    document.getElementById('modal-signature-title').textContent = "Signature de l'Entreprise";
  } else {
    nameInput.value = "";
    document.getElementById('modal-signature-title').textContent = "Signature du témoin ou responsable";
  }
  
  clearSignatureCanvas();
}

function closeSignatureModal() {
  document.getElementById('modal-signature').classList.remove('active');
}

function clearSignatureCanvas() {
  const canvas = document.getElementById('modal-sig-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function saveSignatureAndClose() {
  const canvas = document.getElementById('modal-sig-canvas');
  if (!canvas) return;
  
  // Check if anything drawn
  const blank = document.createElement('canvas');
  blank.width = canvas.width;
  blank.height = canvas.height;
  if (canvas.toDataURL() === blank.toDataURL()) {
    showToast("⚠️ Veuillez dessiner une signature avant de valider !", "warning");
    return;
  }
  
  const name = document.getElementById('modal-sig-name-input').value || "Signature";
  const dataURL = canvas.toDataURL();
  
  // Inject in state
  currentPV.signatures[signatureTarget] = { name: name, img: dataURL };
  
  // Show toast
  showToast(`✍️ Signature enregistrée pour : ${name}`, "success");
  closeSignatureModal();
  updateA4Preview();
}

// 11. CENTRALIZED LIVE PREVIEW BINDER (A4 UPDATES)
function updateA4Preview() {
  // Pull from form
  const template = document.getElementById('pv-template-select').value;
  const num = document.getElementById('pv-num-input').value;
  const repName = document.getElementById('pv-republique').value;
  const metName = document.getElementById('pv-ministere').value;
  const adminName = document.getElementById('pv-admin').value;
  const provinceName = document.getElementById('pv-province').value;
  const dirName = document.getElementById('pv-direction').value;
  const inspectionName = document.getElementById('pv-inspection').value || "Inspection Urbaine du Travail";
  
  const insName = document.getElementById('pv-inspecteur').value;
  const habNum = document.getElementById('pv-habilitation').value;
  const opjNum = document.getElementById('pv-opj').value;
  const missionNum = document.getElementById('pv-ordre-mission').value || "[N° ORDRE DE MISSION]";
  
  const dateVal = document.getElementById('pv-date').value;
  const heureVal = document.getElementById('pv-heure').value;
  
  const entName = document.getElementById('pv-entreprise').value || "[NOM DE L'ENTREPRISE]";
  const rccm = document.getElementById('pv-rccm').value || "..................";
  const idnat = document.getElementById('pv-idnat').value || "..................";
  const impot = document.getElementById('pv-impot').value || "..................";
  const adresse = document.getElementById('pv-adresse').value || "..................";
  const ville = document.getElementById('pv-ville').value || "Kinshasa";
  
  const presentRep = document.getElementById('pv-rep-nom').value || "..................";
  const qualityRep = document.getElementById('pv-rep-fonction').value || "Représentant";
  const telRep = document.getElementById('pv-rep-tel').value || "..................";
  
  const finalObs = document.getElementById('pv-observations-finales').value;
  
  // 1. Text format date
  const dateObj = new Date(dateVal);
  const frenchDays = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const frenchMonths = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  
  const dayName = frenchDays[dateObj.getDay()] || "lundi";
  const dayNum = dateObj.getDate() || "01";
  const monthName = frenchMonths[dateObj.getMonth()] || "janvier";
  const yearNum = dateObj.getFullYear() || "2026";
  
  // Formatted date string: "L'an deux mille vingt-six, le onzième jour du mois de juin"
  function numberToFrenchWord(num) {
    if (num === 2026) return "deux mille vingt-six";
    if (num === 2025) return "deux mille vingt-cinq";
    if (num === 2024) return "deux mille vingt-quatre";
    const words = ["zéro", "premier", "deuxième", "troisième", "quatrième", "cinquième", "sixième", "septième", "huitième", "neuvième", "dixième", "onzième", "douzième", "treizième", "quatorzième", "quinzième", "seizième", "dix-septième", "dix-huitième", "dix-neuvième", "vingtième", "vingt-et-unième", "vingt-deuxième", "vingt-troisième", "vingt-quatrième", "vingt-cinquième", "vingt-sixième", "vingt-septième", "vingt-huitième", "vingt-neuvième", "trentième", "trente-et-unième"];
    return words[num] || num;
  }
  
  const formattedFrenchDate = `L'an ${numberToFrenchWord(yearNum)}, le ${numberToFrenchWord(dayNum)} jour du mois de ${monthName}`;
  
  // Update Preview Elements
  document.getElementById('p-preview-ministere').textContent = metName;
  document.getElementById('p-preview-admin').textContent = adminName;
  document.getElementById('p-preview-direction').textContent = dirName;
  document.getElementById('p-preview-inspection').textContent = inspectionName;
  
  // Set Preview title
  const titleMap = {
    'infraction': 'PROCÈS-VERBAL DE CONSTAT D'INFRACTION',
    'obstruction': 'PROCÈS-VERBAL DE CONSTAT D'OBSTRUCTION',
    'non-conciliation': 'PROCÈS-VERBAL DE NON CONCILIATION DE LITIGE INDIVIDUEL DU TRAVAIL',
    'mise-en-demeure': 'MISE EN DEMEURE FORMELLE POUR ENTRAVE'
  };
  document.getElementById('p-preview-title').textContent = titleMap[template] || "PROCÈS-VERBAL";
  
  // PV number
  document.getElementById('p-preview-number').textContent = "N° " + num;
  
  // Build Dynamic Narrative Body Paragraph
  let bodyHTML = "";
  if (template === 'infraction') {
    bodyHTML = `
      ${formattedFrenchDate}, à <span class="dynamic-text">${heureVal}</span> ;<br>
      Nous <span class="dynamic-text">${insName}</span>, Inspecteur du travail en compétence territoriale générale et officier de police judiciaire à compétence matérielle restreinte en matière du travail, dûment assermenté sous le numéro d'habilitation <span class="dynamic-text">${habNum}</span> ;<br>
      Agissant en vertu des dispositions légales en la matière, notamment en ses articles 187, 196 et 197 de la loi n°015-2002 du 16 octobre 2002 portant code du travail, telle que modifiée et complété à ce jour ainsi que ses mesures d’applications ; En exécution de l'ordre de mission collectif n°<span class="dynamic-text">${missionNum}</span> ; Avons effectué une mission officielle de contrôle au sein de l'entreprise <span class="dynamic-text">${entName}</span> sise au <span class="dynamic-text">${adresse}</span> dans la ville Province de <span class="dynamic-text">${ville}</span> (RCCM : <span class="dynamic-text">${rccm}</span>, ID NAT : <span class="dynamic-text">${idnat}</span>, Impôt : <span class="dynamic-text">${impot}</span>) ;<br>
      Avons constaté les infractions suivantes à la charge de l'entreprise précitée, en violation des dispositions du Code du Travail et de l'arrêté interministériel n° CAB/MIN/ETPS/CNM/HMK/JBI/006/09/2023 et N° CAB/MIN/FINANCES/127/03/2023 du 03/10/2023 portant fixation des taux des droits, taxes et redevances à percevoir à l'initiative du ministère de l'emploi et travail, en présence de Monsieur/Madame <span class="dynamic-text">${presentRep}</span> en qualité de <span class="dynamic-text">${qualityRep}</span>, téléphone : <span class="dynamic-text">${telRep}</span>.
    `;
  } else {
    // For obstruction, non-conciliation, or mise-en-demeure
    const textNarrative = document.getElementById('pv-narrative-text').value;
    bodyHTML = textNarrative.replace(/\\n/g, '<br>').replace(/\\n\\n/g, '<br><br>');
  }
  
  document.getElementById('p-preview-body-content').innerHTML = bodyHTML;
  
  // Render Infractions Table in Preview
  const tbody = document.getElementById('preview-infractions-tbody');
  tbody.innerHTML = "";
  
  let totalSum = 0;
  
  if (template === 'infraction') {
    currentPV.infractions.forEach((inf, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="center">${String(index+1).padStart(2, '0')}</td>
        <td>
          <strong>${inf.title}</strong><br>
          <span style="font-size:7.5pt; color:#475569; display:block; margin-top:2px;">
            Obs: ${inf.observations}
          </span>
          <button class="btn btn-danger btn-xs no-print" onclick="removeInfractionFromPV(${index})" style="padding:1px 3px; font-size:7pt; margin-top:4px;">Supprimer</button>
        </td>
        <td class="center">${inf.article}</td>
        <td>${inf.reference}</td>
        <td class="center"><span class="badge ${inf.gravity === 'Très Grave' ? 'badge-danger' : 'badge-draft'}">${inf.gravity}</span></td>
        <td class="right">${inf.total.toLocaleString()} $</td>
      `;
      tbody.appendChild(row);
      totalSum += inf.total;
    });
  } else if (template === 'obstruction') {
    totalSum = 30000; // Fixed obstruction fine according to Article 322 (30.000$ USD)
  }
  
  // Set total sum cell
  document.getElementById('preview-total-fines-cell').textContent = totalSum.toLocaleString() + " $";
  currentPV.totalFines = totalSum;
  
  // Update footer clause and date
  document.getElementById('p-preview-footer-clause').textContent = finalObs;
  document.getElementById('p-preview-date-place').textContent = `Fait à ${ville}, le ${dayNum} ${monthName} ${yearNum}`;
  
  // Signatures Binding
  const sigInspecteur = currentPV.signatures.inspecteur;
  const sigContrevenant = currentPV.signatures.contrevenant;
  
  const imgIns = document.getElementById('img-sig-inspecteur');
  const nameIns = document.getElementById('name-sig-inspecteur');
  if (sigInspecteur.img) {
    imgIns.src = sigInspecteur.img;
    imgIns.style.display = 'block';
  } else {
    imgIns.style.display = 'none';
  }
  nameIns.textContent = sigInspecteur.name || insName;
  
  const imgCont = document.getElementById('img-sig-contrevenant');
  const nameCont = document.getElementById('name-sig-contrevenant');
  if (sigContrevenant.img) {
    imgCont.src = sigContrevenant.img;
    imgCont.style.display = 'block';
  } else {
    imgCont.style.display = 'none';
  }
  nameCont.textContent = sigContrevenant.name || presentRep;
  
  // Generate QR Code dynamically
  const qrData = JSON.stringify({
    id: currentPV.id,
    num: num,
    type: template,
    emp: entName,
    ins: insName,
    date: dateVal,
    total: totalSum
  });
  
  generateSecureQRCode(qrData);
}

// 12. SECURE OFFLINE QR CODE GENERATOR
function generateSecureQRCode(text) {
  const container = document.getElementById('doc-qr-canvas');
  if (!container) return;
  container.innerHTML = ""; // Clear existing
  
  try {
    // Uses the local qrcode.min.js QRCode constructor
    new QRCode(container, {
      text: text,
      width: 75,
      height: 75,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  } catch (err) {
    console.error("QR Code Error:", err);
    // Render a nice visual fallback in case library isn't fully ready
    container.innerHTML = `<div style="font-size:6pt; text-align:center; color:red; padding:5px;">QR ERROR</div>`;
  }
}

// 13. SAVING DRAFTS & ARCHIVING WITH AUDIT TRAIL
function savePV(isFinal) {
  // Validate basic elements
  const entName = document.getElementById('pv-entreprise').value;
  if (!entName) {
    showToast("⚠️ Le nom de l'entreprise est obligatoire !", "warning");
    return;
  }
  
  // Populate from inputs
  currentPV.num = document.getElementById('pv-num-input').value;
  currentPV.entreprise = entName;
  currentPV.rccm = document.getElementById('pv-rccm').value;
  currentPV.idnat = document.getElementById('pv-idnat').value;
  currentPV.impot = document.getElementById('pv-impot').value;
  currentPV.adresse = document.getElementById('pv-adresse').value;
  currentPV.ville = document.getElementById('pv-ville').value;
  currentPV.repNom = document.getElementById('pv-rep-nom').value;
  currentPV.repFonction = document.getElementById('pv-rep-fonction').value;
  currentPV.repTel = document.getElementById('pv-rep-tel').value;
  currentPV.observationsFinales = document.getElementById('pv-observations-finales').value;
  
  if (currentPV.type !== 'infraction') {
    currentPV.narrativeText = document.getElementById('pv-narrative-text').value;
  }
  
  // Check duplicate PV number
  const duplicate = pvs.find(pv => pv.id !== currentPV.id && pv.num === currentPV.num && pv.num !== '');
  if (duplicate) {
    showToast(`❌ Erreur: Le numéro de PV ${currentPV.num} existe déjà !`, "danger");
    return;
  }
  
  if (isFinal) {
    // Check if signatures exist
    if (!currentPV.signatures.inspecteur.img) {
      showToast("⚠️ La signature de l'inspecteur est requise pour valider !", "warning");
      return;
    }
    
    currentPV.status = 'signed';
    currentPV.history.push({
      action: "PV officiellement validé et signé électroniquement",
      author: currentPV.inspecteurName,
      date: new Date().toLocaleString()
    });
    
    showToast("🔒 Procès-Verbal validé, signé et scellé définitivement !", "success");
  } else {
    currentPV.status = 'draft';
    currentPV.history.push({
      action: "Brouillon sauvegardé manuellement",
      author: currentPV.inspecteurName,
      date: new Date().toLocaleString()
    });
    
    showToast("💾 Brouillon enregistré avec succès !", "success");
  }
  
  // Upsert in database
  const existingIdx = pvs.findIndex(pv => pv.id === currentPV.id);
  if (existingIdx !== -1) {
    pvs[existingIdx] = JSON.parse(JSON.stringify(currentPV));
  } else {
    pvs.push(JSON.parse(JSON.stringify(currentPV)));
  }
  
  saveDatabaseToLocalStorage();
  
  // Go to list of PVs
  setTimeout(() => {
    switchTab(isFinal ? 'tous-pv' : 'brouillons');
    // Clear form for next
    currentPV = createEmptyPV();
    resetFormInputs();
  }, 1000);
}

function resetFormInputs() {
  document.getElementById('pv-entreprise').value = "";
  document.getElementById('pv-rccm').value = "";
  document.getElementById('pv-idnat').value = "";
  document.getElementById('pv-impot').value = "";
  document.getElementById('pv-adresse').value = "";
  document.getElementById('pv-rep-nom').value = "";
  document.getElementById('pv-rep-fonction').value = "";
  document.getElementById('pv-rep-tel').value = "";
  document.getElementById('pv-narrative-text').value = "";
  
  // Reset signatures preview
  document.getElementById('img-sig-inspecteur').style.display = 'none';
  document.getElementById('img-sig-contrevenant').style.display = 'none';
  
  // Uncheck stamp
  document.getElementById('toggle-stamp-chk').checked = false;
  toggleStampInPreview();
  
  // Re-generate initial
  generatePVNumberAutomatically();
  updateA4Preview();
}

function autoSaveBackup() {
  const entName = document.getElementById('pv-entreprise').value;
  if (!entName || currentPV.status === 'signed') return; // Only autosave drafts with some data
  
  // Store temp fields in currentPV
  currentPV.entreprise = entName;
  currentPV.num = document.getElementById('pv-num-input').value;
  currentPV.rccm = document.getElementById('pv-rccm').value;
  currentPV.idnat = document.getElementById('pv-idnat').value;
  currentPV.impot = document.getElementById('pv-impot').value;
  currentPV.adresse = document.getElementById('pv-adresse').value;
  currentPV.ville = document.getElementById('pv-ville').value;
  currentPV.repNom = document.getElementById('pv-rep-nom').value;
  currentPV.repFonction = document.getElementById('pv-rep-fonction').value;
  currentPV.repTel = document.getElementById('pv-rep-tel').value;
  
  if (currentPV.type !== 'infraction') {
    currentPV.narrativeText = document.getElementById('pv-narrative-text').value;
  }
  
  // Save
  const tempIdx = pvs.findIndex(pv => pv.id === currentPV.id);
  if (tempIdx !== -1) {
    pvs[tempIdx] = JSON.parse(JSON.stringify(currentPV));
  } else {
    pvs.push(JSON.parse(JSON.stringify(currentPV)));
  }
  
  saveDatabaseToLocalStorage();
  showToast("🔄 Autosauvegarde en arrière-plan effectuée", "info");
}

// 14. ADVANCED DATABASE VIEWS & SEARCH FILTERS
function renderPVDatabase() {
  const tbody = document.getElementById('db-pvs-rows');
  tbody.innerHTML = "";
  
  const verifiedPVs = pvs.filter(pv => pv.status !== 'draft');
  
  if (verifiedPVs.length === 0) {
    tbody.innerHTML = "<tr><td colspan='9' style='text-align:center; padding:2rem;' class='text-muted'>Aucun PV officiel disponible. Veuillez en élaborer un.</td></tr>";
    return;
  }
  
  verifiedPVs.forEach(pv => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${pv.id}</strong></td>
      <td>${pv.num}</td>
      <td><span class="badge" style="background-color:rgba(0,85,165,0.15);">${pv.type.toUpperCase()}</span></td>
      <td>${pv.entreprise}</td>
      <td>${pv.date}</td>
      <td>${pv.inspecteurName}</td>
      <td style="font-weight:bold; color:var(--accent-color);">${pv.totalFines.toLocaleString()} $</td>
      <td><span class="badge ${pv.status === 'signed' ? 'badge-signed' : 'badge-archived'}">${pv.status === 'signed' ? 'Validé' : 'Archivé'}</span></td>
      <td>
        <div style="display:flex; gap:0.25rem;">
          <button class="btn btn-secondary btn-xs" onclick="viewPVA4('${pv.id}')">👁️ Aperçu</button>
          <button class="btn btn-secondary btn-xs" onclick="showHistoryAuditModal('${pv.id}')">📜 Audit</button>
          <button class="btn btn-danger btn-xs" onclick="confirmDeletePV('${pv.id}')">🗑️ Suppr.</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function renderDraftsList() {
  const tbody = document.getElementById('draft-pvs-rows');
  tbody.innerHTML = "";
  
  const drafts = pvs.filter(pv => pv.status === 'draft');
  
  if (drafts.length === 0) {
    tbody.innerHTML = "<tr><td colspan='6' style='text-align:center; padding:2rem;' class='text-muted'>Aucun brouillon en cours.</td></tr>";
    return;
  }
  
  drafts.forEach(pv => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${pv.id}</strong></td>
      <td>${pv.type.toUpperCase()}</td>
      <td>${pv.entreprise || "<em>Sans nom</em>"}</td>
      <td>${pv.date} ${pv.heure}</td>
      <td>${pv.inspecteurName}</td>
      <td>
        <div style="display:flex; gap:0.25rem;">
          <button class="btn btn-primary btn-xs" onclick="loadDraftToEditor('${pv.id}')">✏️ Reprendre</button>
          <button class="btn btn-danger btn-xs" onclick="confirmDeletePV('${pv.id}')">🗑️ Suppr.</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function loadDraftToEditor(id) {
  const d = pvs.find(pv => pv.id === id);
  if (!d) return;
  
  currentPV = JSON.parse(JSON.stringify(d));
  
  // Fill inputs
  document.getElementById('pv-template-select').value = currentPV.type;
  document.getElementById('pv-num-input').value = currentPV.num;
  document.getElementById('pv-province').value = currentPV.province;
  document.getElementById('pv-direction').value = currentPV.directionProv;
  document.getElementById('pv-admin').value = currentPV.administration;
  document.getElementById('pv-inspection').value = currentPV.inspection;
  document.getElementById('pv-inspecteur').value = currentPV.inspecteurName;
  document.getElementById('pv-habilitation').value = currentPV.habilitation;
  document.getElementById('pv-opj').value = currentPV.opj;
  document.getElementById('pv-ordre-mission').value = currentPV.ordreMission;
  document.getElementById('pv-date').value = currentPV.date;
  document.getElementById('pv-heure').value = currentPV.heure;
  document.getElementById('pv-entreprise').value = currentPV.entreprise;
  document.getElementById('pv-rccm').value = currentPV.rccm;
  document.getElementById('pv-idnat').value = currentPV.idnat;
  document.getElementById('pv-impot').value = currentPV.impot;
  document.getElementById('pv-adresse').value = currentPV.adresse;
  document.getElementById('pv-ville').value = currentPV.ville;
  document.getElementById('pv-rep-nom').value = currentPV.repNom;
  document.getElementById('pv-rep-fonction').value = currentPV.repFonction;
  document.getElementById('pv-rep-tel').value = currentPV.repTel;
  document.getElementById('pv-observations-finales').value = currentPV.observationsFinales;
  
  if (currentPV.type !== 'infraction') {
    document.getElementById('pv-narrative-text').value = currentPV.narrativeText;
  }
  
  // Handle stamp
  document.getElementById('toggle-stamp-chk').checked = currentPV.stamp.enabled;
  const stamp = document.getElementById('draggable-cachet');
  if (stamp) {
    stamp.style.display = currentPV.stamp.enabled ? 'flex' : 'none';
    stamp.style.top = currentPV.stamp.top;
    stamp.style.left = currentPV.stamp.left;
  }
  
  loadTemplateFields();
  switchTab('nouveau-pv');
  showToast("✏️ Brouillon restauré dans l'éditeur.", "success");
}

function viewPVA4(id) {
  // Load state and view
  loadDraftToEditor(id);
  // Just focus preview pane
  const container = document.querySelector('.preview-panel');
  if (container) {
    container.scrollIntoView({ behavior: 'smooth' });
  }
}

function confirmDeletePV(id) {
  const d = pvs.find(pv => pv.id === id);
  if (!d) return;
  
  if (confirm(`🛑 Êtes-vous sûr de vouloir supprimer définitivement le document ${d.num || d.id} ? Cette action est irréversible.`)) {
    pvs = pvs.filter(pv => pv.id !== id);
    saveDatabaseToLocalStorage();
    showToast("🗑️ Document supprimé de la base locale", "danger");
    
    // Refresh current tabs
    renderPVDatabase();
    renderDraftsList();
    renderDashboard();
  }
}

// 15. AUDIT TRAIL / JOURNAL D'ACTIONS HISTORIQUE
function showHistoryAuditModal(id) {
  const pv = pvs.find(p => p.id === id);
  if (!pv) return;
  
  let historyHTML = `<div style="display:flex; flex-direction:column; gap:0.5rem;">`;
  pv.history.forEach(h => {
    historyHTML += `
      <div style="padding:0.5rem; border-left:3px solid var(--primary-color); background-color:var(--bg-color); font-size:0.8rem;">
        <p><strong>${h.action}</strong></p>
        <p class="text-muted text-xs">Par: ${h.author} | Le: ${h.date}</p>
      </div>
    `;
  });
  historyHTML += `</div>`;
  
  // Create a temporary beautiful info popup
  const overlay = document.createElement('div');
  overlay.className = "modal-overlay active";
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>Journal d'Audit - ${pv.id}</h3>
        <button class="theme-toggle-btn" style="color:white;" onclick="this.closest('.modal-overlay').remove()">&times;</button>
      </div>
      <div class="modal-body">
        <p style="font-weight:700; font-size:0.9rem; margin-bottom:1rem;">Numéro officiel : ${pv.num || 'Non spécifié'}</p>
        ${historyHTML}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Fermer</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

// 16. OFFLINE QR CODE CAMERA SCANNER
function startCameraScanner() {
  const video = document.getElementById('scanner-video-element');
  const resultBox = document.getElementById('verification-result-box');
  
  resultBox.style.display = "none";
  
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then(stream => {
        videoStream = stream;
        video.srcObject = stream;
        video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        video.play();
        showToast("📷 Caméra démarrée. Scannez un QR Code de PV", "success");
        requestAnimationFrame(tickScanner);
      })
      .catch(err => {
        console.error("Camera access error:", err);
        showToast("❌ Impossible d'accéder à la caméra. Vérifiez les permissions.", "danger");
      });
  } else {
    showToast("❌ Caméra non prise en charge par votre navigateur.", "danger");
  }
}

function stopCameraScanner() {
  const video = document.getElementById('scanner-video-element');
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
    videoStream = null;
  }
  if (video) {
    video.srcObject = null;
  }
}

function tickScanner() {
  const video = document.getElementById('scanner-video-element');
  if (video && video.readyState === video.HAVE_ENOUGH_DATA && videoStream) {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Uses jsQR.js decoder locally!
    try {
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      
      if (code) {
        // Success scan!
        stopCameraScanner();
        verifyPVData(code.data);
        return;
      }
    } catch (err) {
      // Decode fail on this frame, continue
    }
  }
  if (videoStream) {
    requestAnimationFrame(tickScanner);
  }
}

function verifyPVData(scannedText) {
  const resultBox = document.getElementById('verification-result-box');
  resultBox.innerHTML = "";
  
  try {
    const data = JSON.parse(scannedText);
    if (!data.id) throw new Error("Format invalide");
    
    // Search in our local DB
    const match = pvs.find(p => p.id === data.id);
    
    if (match) {
      resultBox.style.backgroundColor = "rgba(16, 185, 129, 0.15)";
      resultBox.style.border = "2px solid var(--success-color)";
      resultBox.innerHTML = `
        <h4 style="color:var(--success-color); font-weight:700; display:flex; align-items:center; gap:0.5rem;">
          ✓ DOCUMENT AUTHENTIQUE CONFIRMÉ
        </h4>
        <div style="font-size:0.85rem; margin-top:0.75rem; display:flex; flex-direction:column; gap:0.25rem;">
          <p><strong>N° ID Unique :</strong> ${match.id}</p>
          <p><strong>N° Officiel du PV :</strong> ${match.num}</p>
          <p><strong>Entreprise Contrôlée :</strong> ${match.entreprise}</p>
          <p><strong>Inspecteur Responsable :</strong> ${match.inspecteurName}</p>
          <p><strong>Date de Création :</strong> ${match.date}</p>
          <p><strong>Amende Transactionnelle :</strong> <span style="font-weight:bold; color:var(--accent-color);">${match.totalFines.toLocaleString()}$ USD</span></p>
          <p><strong>Statut d'Authenticité :</strong> <span class="badge badge-signed">Scellé & Sécurisé</span></p>
        </div>
        <button class="btn btn-primary btn-sm w-full" style="margin-top:1rem;" onclick="viewPVA4('${match.id}')">Afficher ce PV</button>
      `;
    } else {
      resultBox.style.backgroundColor = "rgba(220, 20, 58, 0.15)";
      resultBox.style.border = "2px solid var(--accent-color)";
      resultBox.innerHTML = `
        <h4 style="color:var(--accent-color); font-weight:700;">
          ⚠ PV NON RÉFÉRENCÉ / FRAUDE POSSIBLE
        </h4>
        <p style="font-size:0.8rem; margin-top:0.5rem;">
          Ce QR Code contient des données structurées, mais l'identifiant unique n'existe pas dans la base de données sécurisée de l'Inspection Générale du Travail. Prenez garde aux falsifications administratives !
        </p>
      `;
    }
  } catch (err) {
    resultBox.style.backgroundColor = "rgba(245, 158, 11, 0.15)";
    resultBox.style.border = "2px solid var(--warning-color)";
    resultBox.innerHTML = `
      <h4 style="color:var(--warning-color); font-weight:700;">
        ⚠ SCAN IMPOSSIBLE / FORMAT INCONNU
      </h4>
      <p style="font-size:0.8rem; margin-top:0.5rem;">
        Le QR Code détecté ne correspond pas au format sécurisé du module Procès-Verbaux d'InspecteurBot. Données scannées : <br>
        <code style="word-break:break-all; background:#FFF; padding:2px; display:block; margin-top:5px;">${scannedText}</code>
      </p>
    `;
  }
  resultBox.style.display = "block";
}

function verifyPVAuthenticityManual() {
  const id = document.getElementById('manual-verify-id').value.trim();
  if (!id) {
    showToast("⚠️ Saisissez un identifiant unique !", "warning");
    return;
  }
  
  // Format simulated scan json
  const match = pvs.find(p => p.id === id);
  if (match) {
    const rawData = JSON.stringify({
      id: match.id,
      num: match.num,
      type: match.type,
      emp: match.entreprise,
      ins: match.inspecteurName,
      date: match.date,
      total: match.totalFines
    });
    verifyPVData(rawData);
  } else {
    verifyPVData(JSON.stringify({ id: id }));
  }
}

// 17. VOICE RECOGNITION (DICTATION)
function startDictation(fieldId, isSearch = false) {
  if (isListening) {
    stopDictation();
    return;
  }
  
  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!window.SpeechRecognition) {
    showToast("❌ La dictée vocale n'est pas prise en charge par ce navigateur.", "danger");
    return;
  }
  
  currentSpeechField = fieldId;
  recognition = new window.SpeechRecognition();
  recognition.lang = 'fr-FR';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  
  // Find mic button
  const triggerBtn = document.querySelector(`[onclick="startDictation('${fieldId}'${isSearch ? ', true' : ''})"]`);
  if (triggerBtn) triggerBtn.classList.add('listening');
  
  isListening = true;
  recognition.start();
  showToast("🎙️ Dictée vocale active : parlez...", "info");
  
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    const input = document.getElementById(fieldId);
    if (input) {
      if (input.tagName === 'TEXTAREA') {
        input.value += (input.value ? " " : "") + transcript;
      } else {
        input.value = transcript;
      }
      
      // Trigger update
      updateA4Preview();
      
      // If it's the infraction search, filter results immediately
      if (isSearch) {
        filterInfractionsDropdown();
      }
    }
    showToast(`📝 Enregistré : "${transcript.substring(0,25)}..."`, "success");
  };
  
  recognition.onerror = function(event) {
    console.error("Speech Recognition Error:", event.error);
    stopDictation();
  };
  
  recognition.onend = function() {
    stopDictation();
  };
}

function stopDictation() {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
  isListening = false;
  
  // Remove pulsing class from all mic buttons
  document.querySelectorAll('.mic-btn').forEach(btn => btn.classList.remove('listening'));
}

// 18. VOICE READER (TEXT-TO-SPEECH)
function readAloudPV() {
  stopSpeechSynthesis();
  
  const template = document.getElementById('pv-template-select').value;
  const num = document.getElementById('pv-num-input').value;
  const company = document.getElementById('pv-entreprise').value || "Inconnue";
  const numFines = currentPV.totalFines;
  
  let speechText = `Lecture du Procès-Verbal officiel numéro ${num}. `;
  if (template === 'infraction') {
    speechText += `Ce procès-verbal de constat d'infraction vise l'entreprise ${company}. `;
    speechText += `Il comporte ${currentPV.infractions.length} infractions pour un montant total de transactions financières s'élevant à ${numFines} dollars américains. `;
    currentPV.infractions.forEach((inf, idx) => {
      speechText += `Infraction numéro ${idx+1} : ${inf.title}, violation de l'article ${inf.article}. `;
    });
  } else {
    speechText += `Type de document : Procès-Verbal de ${template}. Concernant l'établissement ${company}. `;
    speechText += `Récit des faits constatés par l'inspecteur : ${document.getElementById('pv-narrative-text').value}. `;
  }
  
  speechText += `Observations finales : ${document.getElementById('pv-observations-finales').value}.`;
  
  const utterance = new SpeechSynthesisUtterance(speechText);
  utterance.lang = 'fr-FR';
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
  
  showToast("🔊 Lecture à haute voix du document en cours...", "info");
}

function stopSpeechSynthesis() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// 19. LOCAL LEGAL AI & CHATBOT
function handleChatKeypress(e) {
  if (e.key === 'Enter') {
    sendChatMessage();
  }
}

function sendChatMessage() {
  const input = document.getElementById('ai-chat-input');
  const query = input.value.trim();
  if (!query) return;
  
  appendChatBubble(query, 'user');
  input.value = "";
  
  // Simulate AI Response locally using advanced rule-based matcher
  setTimeout(() => {
    const aiResponse = computeLocalAIResponse(query);
    appendChatBubble(aiResponse, 'ai');
  }, 750);
}

function appendChatBubble(text, sender) {
  const chatMessages = document.getElementById('ai-chat-messages');
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble bubble-${sender}`;
  bubble.innerHTML = text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function computeLocalAIResponse(query) {
  const q = query.toLowerCase();
  
  if (q.includes('smig') || q.includes('salaire minimum')) {
    return `<strong>Droit du Travail RDC (SMIG) :</strong><br>
            Le Salaire Minimum Interprofessionnel Garanti est régi par le <strong>Décret n° 18/017 du 22 mai 2018</strong>.<br><br>
            Le non-respect du SMIG (Art. 87 et 94-96 du Code du Travail) is considered as a Très Grave infraction (N°5) with fine <strong>5.000$ USD</strong>.<br><br>
            Sur proposition de l'Inspecteur du Travail, le Ministre de l'Emploi peut également prononcer la fermeture administrative de l'entreprise contrevenante.`;
  }
  
  if (q.includes('congé') || q.includes('conges') || q.includes('vacances')) {
    return `<strong>Droit du Travail RDC (Congés Annuels) :</strong><br>
            Le congé annuel est obligatoire pour tout salarié (Articles 140 à 146 du Code du Travail).<br><br>
            L'employeur doit accorder un congé payé de <strong>1,5 jour ouvrable par mois entier de service effectif</strong> (soit 18 jours ouvrables par an), ce droit augmentant avec l'ancienneté.<br><br>
            L'absence de planification ou de versement de l'indemnité de congé annuel constitue l'infraction <strong>N°38</strong> et est sanctionnée par une amende de <strong>3.000$ USD</strong>.`;
  }
  
  if (q.includes('obstruction') || q.includes('refus de controle') || q.includes('entrave')) {
    return `<strong>Rôle de l'Inspecteur (Obstruction) :</strong><br>
            Conformément à l'<strong>Article 322</strong> du Code du Travail, faire ou tenter de faire obstacle à l'exercice des fonctions d'un Inspecteur ou Contrôleur du Travail est une infraction <strong>Très Grave (N°62)</strong>.<br><br>
            Elle donne lieu à l'établissement immédiat d'un <strong>Procès-verbal de constat d'obstruction</strong> et expose le contrevenant à une amende forfaitaire sévère de <strong>30.000$ USD</strong> et une peine de servitude pénale de 30 jours.`;
  }
  
  if (q.includes('contrat') || q.includes('ecrit') || q.includes('cdd')) {
    return `<strong>Contrats de Travail en RDC :</strong><br>
            - <strong>Écrit obligatoire :</strong> Tout contrat de travail doit être écrit, signé et visé par l'ONEM (Art. 44). À défaut, il est réputé à durée indéterminée (CDI) dès le premier jour de prestation !<br>
            - <strong>Durée :</strong> Un contrat à durée déterminée (CDD) ne peut excéder 2 ans (Art. 40). Au-delà, ou si plus de 2 CDD sont signés successivement, il est requalifié en CDI.<br><br>
            L'absence d'écrit ou de visa constitue l'infraction <strong>N°3</strong> et expose à une amende de <strong>5.000$ USD par travailleur concerné</strong> !`;
  }
  
  if (q.includes('faute lourde') || q.includes('licenciement')) {
    return `<strong>Licenciement pour Faute Lourde :</strong><br>
            La faute lourde (Article 59) autorise la rupture immédiate du contrat sans préavis ni indemnités.<br><br>
            <strong>Procédure stricte sous peine de nullité :</strong><br>
            1. L'employeur doit notifier la rupture par écrit motivé au travailleur dans un délai de <strong>2 jours ouvrables</strong> maximum après la connaissance des faits.<br>
            2. Une copie doit être transmise à l'Inspecteur du Travail du ressort.<br><br>
            Le non-respect de cette procédure constitue une rupture abusive (Infraction <strong>N°24</strong>, amende de <strong>3.000$ USD</strong>).`;
  }
  
  if (q.includes('horaire') || q.includes('45 heures')) {
    return `<strong>Durée du Travail (RDC) :</strong><br>
            La durée légale du travail est fixée à <strong>45 heures par semaine</strong> au maximum (Article 119).<br><br>
            Le non-affichage de l'horaire de travail visé par l'Inspecteur du travail constitue l'infraction <strong>N°1 (Amende de 3.000$ USD)</strong>.<br>
            Le dépassement de la durée légale sans paiement d'heures supplémentaires majorées est l'infraction <strong>N°6 (Amende de 3.000$ USD)</strong>.`;
  }
  
  // Generic / Default AI Guide
  return `<strong>Analyse de la législation RDC :</strong><br>
          Je comprends votre demande concernant votre mission d'inspection. D'après le Code du Travail (Loi n°015-2002) :<br><br>
          Pour toute violation constatée, référez-vous au tableau des <strong>65 infractions de l'IGT</strong>. Les transactions financières d'amende sont désormais ajustées sous l'égide de l'Arrêté Interministériel du 03/10/2023 à des montants standards de <strong>3.000$ USD</strong> pour les contraventions communes, et <strong>5.000$ à 30.000$ USD</strong> pour les fraudes ou obstructions majeures.<br><br>
          N'hésitez pas à me poser une question précise sur un article de loi ou d'utiliser <strong>l'analyseur de faits</strong> à droite pour identifier des infractions automatiques !`;
}

function analyzeFactsWithAI() {
  const text = document.getElementById('ai-analyzer-facts').value.toLowerCase();
  const resultsDiv = document.getElementById('ai-analysis-results');
  const infractionsList = document.getElementById('ai-analysis-infractions-list');
  
  if (!text) {
    showToast("⚠️ Saisissez une description de faits à analyser !", "warning");
    return;
  }
  
  infractionsList.innerHTML = "";
  let matches = [];
  
  // Rule-based keyword mapping to INFRACTIONS_DB indices
  if (text.includes('horaire') || text.includes('heure') || text.includes('temps')) {
    matches.push(INFRACTIONS_DB[0]); // N°1 Horaire
  }
  if (text.includes('contrat') || text.includes('ecrit') || text.includes('onem') || text.includes('visé')) {
    matches.push(INFRACTIONS_DB[2]); // N°3 Contrat non écrit
  }
  if (text.includes('règlement') || text.includes('interne') || text.includes('entreprise')) {
    matches.push(INFRACTIONS_DB[3]); // N°4 Règlement
  }
  if (text.includes('smig') || text.includes('salaire minimum') || text.includes('payé moins')) {
    matches.push(INFRACTIONS_DB[4]); // N°5 SMIG
  }
  if (text.includes('enfant') || text.includes('mineur') || text.includes('15 ans') || text.includes('14 ans')) {
    matches.push(INFRACTIONS_DB[8]); // N°9 Age admission
    matches.push(INFRACTIONS_DB[9]); // N°10 Autorisation
  }
  if (text.includes('hygiène') || text.includes('sécurité') || text.includes('salubrité') || text.includes('epi')) {
    matches.push(INFRACTIONS_DB[10]); // N°11 Hygiène
    matches.push(INFRACTIONS_DB[39]); // N°40 CSHE
  }
  if (text.includes('médical') || text.includes('docteur') || text.includes('médecin') || text.includes('pharmaceutique')) {
    matches.push(INFRACTIONS_DB[11]); // N°12 Service médical
    matches.push(INFRACTIONS_DB[41]); // N°42 Convention médicale
  }
  if (text.includes('transport') || text.includes('bus') || text.includes('frais de route')) {
    matches.push(INFRACTIONS_DB[24]); // N°25 Transport
  }
  if (text.includes('obstruction') || text.includes('refus de laisser') || text.includes('insulte') || text.includes('entrave')) {
    matches.push(INFRACTIONS_DB[61]); // N°62 Obstruction
  }
  
  // De-duplicate matches
  matches = Array.from(new Set(matches));
  
  if (matches.length === 0) {
    infractionsList.innerHTML = "<p class='text-muted text-xs'>Aucune infraction majeure évidente détectée par les mots-clés. Saisissez plus de détails.</p>";
  } else {
    matches.forEach(inf => {
      const item = document.createElement('div');
      item.style.padding = "0.5rem";
      item.style.backgroundColor = "var(--bg-color)";
      item.style.border = "1px solid var(--border-color)";
      item.style.borderRadius = "6px";
      item.style.fontSize = "0.8rem";
      item.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong>N°${inf.num}. ${inf.title}</strong>
          <span class="badge bg-danger-soft">${inf.gravity}</span>
        </div>
        <p class="text-xs text-muted" style="margin-top:0.25rem;">Article: ${inf.article} | Amende suggérée : ${inf.amende}$ USD</p>
      `;
      infractionsList.appendChild(item);
    });
  }
  
  resultsDiv.style.display = "block";
  showToast("🧠 Analyse des faits effectuée localement !", "success");
}

function injectAIPossibleInfractions() {
  // Take current matches and push to currentPV
  const resultsDiv = document.getElementById('ai-analysis-results');
  const items = resultsDiv.querySelectorAll('strong');
  
  if (items.length === 0) return;
  
  items.forEach(el => {
    const numText = el.textContent.split('.')[0].replace('N°', '').trim();
    const num = parseInt(numText);
    const inf = INFRACTIONS_DB.find(i => i.num === num);
    if (inf) {
      // Check duplicate
      if (!currentPV.infractions.some(p => p.num === inf.num)) {
        currentPV.infractions.push({
          num: inf.num,
          title: inf.title,
          article: inf.article,
          reference: inf.reference,
          gravity: inf.gravity,
          sanction: inf.sanction,
          amende: inf.amende,
          quantity: 1,
          total: inf.amende,
          observations: inf.observations
        });
      }
    }
  });
  
  showToast("🚀 Infractions recommandées injectées dans le PV en cours !", "success");
  updateA4Preview();
  switchTab('nouveau-pv');
}

// 20. PARAMÈTRES VIEWS (CRUD INSPECTORS & PROVINCES)
function renderParams() {
  // Provinces List params
  const tbodyProv = document.getElementById('params-provinces-tbody');
  tbodyProv.innerHTML = "";
  PROVINCES_DB.forEach(prov => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${prov.name}</strong></td>
      <td>${prov.dirProv}</td>
      <td><span class="badge badge-draft">${prov.code}</span></td>
    `;
    tbodyProv.appendChild(row);
  });
  
  // Inspectors list params
  const tbodyIns = document.getElementById('params-inspectors-tbody');
  tbodyIns.innerHTML = "";
  const inspectors = JSON.parse(localStorage.getItem('inspecteurbot_inspecteurs')) || DEFAULT_INSPECTORS;
  inspectors.forEach((ins, idx) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${ins.name}</strong></td>
      <td>${ins.habilitation}</td>
      <td><span class="badge badge-signed">${ins.initials}</span></td>
      <td>
        <button class="btn btn-danger btn-xs" onclick="deleteInspector(${idx})">Suppr.</button>
      </td>
    `;
    tbodyIns.appendChild(row);
  });
}

function addNewInspectorPrompt() {
  const name = prompt("Saisissez le nom complet de l'Inspecteur / Contrôleur :");
  if (!name) return;
  const hab = prompt("Saisissez son numéro de carte d'habilitation :");
  if (!hab) return;
  const opj = prompt("Saisissez son numéro d'OPJ / Tribunal :");
  if (!opj) return;
  const initials = prompt("Saisissez ses initiales (3 lettres majuscules) :", name.split(' ').map(n=>n[0]).join('').toUpperCase().substring(0,3));
  if (!initials) return;
  
  const inspectors = JSON.parse(localStorage.getItem('inspecteurbot_inspecteurs')) || DEFAULT_INSPECTORS;
  inspectors.push({ name: name, habilitation: hab, opj: opj, initials: initials.toUpperCase() });
  localStorage.setItem('inspecteurbot_inspecteurs', JSON.stringify(inspectors));
  
  initFormInspecteurs();
  renderParams();
  showToast("✅ Nouvel inspecteur configuré !", "success");
}

function deleteInspector(idx) {
  const inspectors = JSON.parse(localStorage.getItem('inspecteurbot_inspecteurs')) || DEFAULT_INSPECTORS;
  if (inspectors.length <= 1) {
    showToast("⚠️ Il doit rester au moins un inspecteur configuré !", "warning");
    return;
  }
  
  if (confirm(`🛑 Supprimer l'inspecteur ${inspectors[idx].name} ?`)) {
    inspectors.splice(idx, 1);
    localStorage.setItem('inspecteurbot_inspecteurs', JSON.stringify(inspectors));
    
    initFormInspecteurs();
    renderParams();
    showToast("❌ Inspecteur supprimé", "info");
  }
}

// 21. BACKUP & SYSTEM INTEGRATION (IMPORT / EXPORT JSON)
function exportDatabase() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
    pvs: pvs,
    inspectors: JSON.parse(localStorage.getItem('inspecteurbot_inspecteurs')) || DEFAULT_INSPECTORS
  }));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `inspecteurbot_database_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("💾 Base de données exportée en fichier JSON", "success");
}

function importDatabase(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.pvs) {
        pvs = data.pvs;
        saveDatabaseToLocalStorage();
      }
      if (data.inspectors) {
        localStorage.setItem('inspecteurbot_inspecteurs', JSON.stringify(data.inspectors));
      }
      
      // Reload
      loadDatabase();
      initFormInspecteurs();
      renderDashboard();
      renderParams();
      showToast("✅ Restauration de la sauvegarde effectuée avec succès !", "success");
    } catch (err) {
      showToast("❌ Erreur de décodage du fichier JSON", "danger");
    }
  };
  reader.readAsText(file);
}

// 22. FRONT-END AUXILIARY HELPER ELEMENTS
function renderDashboard() {
  // Counts
  const total = pvs.length;
  const drafts = pvs.filter(pv => pv.status === 'draft').length;
  const signed = pvs.filter(pv => pv.status === 'signed').length;
  
  // Calculate total fines and unique companies
  let uniqueCompanies = new Set();
  let totalInfractionsCount = 0;
  let totalAmendsSum = 0;
  
  pvs.forEach(pv => {
    if (pv.entreprise) uniqueCompanies.add(pv.entreprise);
    if (pv.status !== 'draft') {
      totalAmendsSum += pv.totalFines;
      if (pv.type === 'infraction') {
        totalInfractionsCount += pv.infractions.length;
      } else if (pv.type === 'obstruction') {
        totalInfractionsCount += 1;
      }
    }
  });
  
  document.getElementById('stat-total-pvs').textContent = total;
  document.getElementById('stat-brouillons').textContent = drafts;
  document.getElementById('stat-signes').textContent = signed;
  document.getElementById('stat-entreprises').textContent = uniqueCompanies.size;
  document.getElementById('stat-infractions').textContent = totalInfractionsCount;
  document.getElementById('stat-amendes').textContent = totalAmendsSum.toLocaleString();
  
  // Populate recent PV rows on dashboard
  const tbody = document.getElementById('recent-pvs-rows');
  tbody.innerHTML = "";
  
  const sorted = [...pvs].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  if (sorted.length === 0) {
    tbody.innerHTML = "<tr><td colspan='8' style='text-align:center;'>Aucun PV disponible.</td></tr>";
  } else {
    sorted.forEach(pv => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${pv.id}</strong></td>
        <td><span class="badge badge-archived">${pv.type.toUpperCase()}</span></td>
        <td>${pv.entreprise || '<em>Sans nom</em>'}</td>
        <td>${pv.date}</td>
        <td>${pv.inspecteurName}</td>
        <td><span class="badge ${pv.status === 'signed' ? 'badge-signed' : 'badge-draft'}">${pv.status.toUpperCase()}</span></td>
        <td style="font-weight:bold; color:var(--accent-color);">${pv.totalFines.toLocaleString()} $</td>
        <td><button class="btn btn-secondary btn-xs" onclick="viewPVA4('${pv.id}')">👁️ Ouvrir</button></td>
      `;
      tbody.appendChild(row);
    });
  }
  
  // Populate recent activities feed
  const activityList = document.getElementById('recent-activity-list');
  activityList.innerHTML = "";
  
  const allHistory = [];
  pvs.forEach(pv => {
    pv.history.forEach(h => {
      allHistory.push({ ...h, pvId: pv.id, pvNum: pv.num });
    });
  });
  
  // Sort history by date desc
  allHistory.sort((a,b) => new Date(b.date) - new Date(a.date));
  const recentHist = allHistory.slice(0, 4);
  
  if (recentHist.length === 0) {
    activityList.innerHTML = "<p class='text-muted text-xs text-center' style='padding:1rem;'>Aucune activité.</p>";
  } else {
    recentHist.forEach(h => {
      const card = document.createElement('div');
      card.style.display = "flex";
      card.style.alignItems = "flex-start";
      card.style.gap = "0.5rem";
      card.style.padding = "0.5rem 0.75rem";
      card.style.backgroundColor = "var(--bg-color)";
      card.style.borderRadius = "6px";
      card.style.fontSize = "0.8rem";
      card.innerHTML = `
        <div style="width:8px; height:8px; border-radius:50%; background-color:var(--primary-color); margin-top:0.3rem;"></div>
        <div>
          <p><strong>${h.action}</strong> pour ${h.pvNum || h.pvId}</p>
          <span style="font-size:0.65rem; color:var(--text-muted);">${h.date} | Par: ${h.author}</span>
        </div>
      `;
      activityList.appendChild(card);
    });
  }
}

function loadBlankTemplate(type) {
  currentPV = createEmptyPV();
  currentPV.type = type;
  resetFormInputs();
  document.getElementById('pv-template-select').value = type;
  loadTemplateFields();
  switchTab('nouveau-pv');
  showToast(`📋 Modèle ${type.toUpperCase()} chargé avec succès !`, "success");
}

function filterPVList() {
  const query = document.getElementById('search-keyword').value.toLowerCase();
  const type = document.getElementById('search-type').value;
  const province = document.getElementById('search-province').value;
  const status = document.getElementById('search-status').value;
  
  const tbody = document.getElementById('db-pvs-rows');
  tbody.innerHTML = "";
  
  const filtered = pvs.filter(pv => {
    // Exclude drafts from official database view
    if (pv.status === 'draft') return false;
    
    const matchesKeyword = 
      pv.id.toLowerCase().includes(query) ||
      pv.num.toLowerCase().includes(query) ||
      pv.entreprise.toLowerCase().includes(query) ||
      pv.inspecteurName.toLowerCase().includes(query) ||
      pv.adresse.toLowerCase().includes(query);
      
    const matchesType = (type === 'all') || (pv.type === type);
    const matchesProvince = (province === 'all') || (pv.province === province);
    const matchesStatus = (status === 'all') || (pv.status === status);
    
    return matchesKeyword && matchesType && matchesProvince && matchesStatus;
  });
  
  if (filtered.length === 0) {
    tbody.innerHTML = "<tr><td colspan='9' style='text-align:center; padding:2rem;' class='text-muted'>Aucun document ne correspond à vos filtres de recherche.</td></tr>";
    return;
  }
  
  filtered.forEach(pv => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${pv.id}</strong></td>
      <td>${pv.num}</td>
      <td><span class="badge" style="background-color:rgba(0,85,165,0.15);">${pv.type.toUpperCase()}</span></td>
      <td>${pv.entreprise}</td>
      <td>${pv.date}</td>
      <td>${pv.inspecteurName}</td>
      <td style="font-weight:bold; color:var(--accent-color);">${pv.totalFines.toLocaleString()} $</td>
      <td><span class="badge ${pv.status === 'signed' ? 'badge-signed' : 'badge-archived'}">${pv.status === 'signed' ? 'Validé' : 'Archivé'}</span></td>
      <td>
        <div style="display:flex; gap:0.25rem;">
          <button class="btn btn-secondary btn-xs" onclick="viewPVA4('${pv.id}')">👁️ Aperçu</button>
          <button class="btn btn-secondary btn-xs" onclick="showHistoryAuditModal('${pv.id}')">📜 Audit</button>
          <button class="btn btn-danger btn-xs" onclick="confirmDeletePV('${pv.id}')">🗑️ Suppr.</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('inspecteurbot_dark_mode', isDark ? 'enabled' : 'disabled');
}

// Restore theme settings
if (localStorage.getItem('inspecteurbot_dark_mode') === 'enabled') {
  document.body.classList.add('dark');
}

// Toast notification generator
function showToast(message, type = "info") {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.style.padding = "0.75rem 1rem";
  toast.style.borderRadius = "8px";
  toast.style.color = "#FFFFFF";
  toast.style.fontSize = "0.85rem";
  toast.style.fontWeight = "600";
  toast.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.3)";
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.gap = "0.5rem";
  toast.style.opacity = "0";
  toast.style.transform = "translateY(20px)";
  toast.style.transition = "opacity 0.3s, transform 0.3s";
  
  const bgColors = {
    success: "#10B981", // green
    warning: "#F59E0B", // amber
    danger: "#EF4444",  // red
    info: "#0055A5"     // blue
  };
  toast.style.backgroundColor = bgColors[type] || bgColors.info;
  
  toast.textContent = message;
  container.appendChild(toast);
  
  // Animate Entrance
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  }, 50);
  
  // Remove
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// 23. PERFECT A4 WEB PRINT TRIGGER
function printPreview() {
  // To print, we dynamically add a special print class to our preview element, trigger print, and clean up!
  const preview = document.getElementById('a4-document-preview');
  if (preview) {
    preview.classList.add('preview-panel-active-print');
    window.print();
    preview.classList.remove('preview-panel-active-print');
  }
}
