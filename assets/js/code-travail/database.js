/**
 * Base locale du Code du travail RDC — InspecteurBot
 * 334 articles numérotés, base Loi n° 015/2002 du 16 octobre 2002.
 * Consolidation ciblée issue de la Loi n° 16/010 du 15 juillet 2016 : articles 62, 119, 121 et 190 ; article 321 mis à jour selon la nouvelle rédaction de l’article 1er de cette loi.
 * Les autres modifications de 2016 ne sont pas toutes intégrées : vérifier la mention de chaque article avant usage juridique.
 * Vérification juridique officielle requise avant tout usage contentieux.
 * Données structurées et disponibles hors ligne.
 */
(function () {
  "use strict";
  const TITRES = [
  {
    "min": 1,
    "max": 7,
    "titre": "Titre I — Des dispositions générales",
    "categorie": "Dispositions générales",
    "icon": "fa-scale-balanced"
  },
  {
    "min": 8,
    "max": 17,
    "titre": "Titre II — De la formation professionnelle",
    "categorie": "Formation professionnelle",
    "icon": "fa-graduation-cap"
  },
  {
    "min": 18,
    "max": 35,
    "titre": "Titre III — Du contrat d'apprentissage",
    "categorie": "Contrat d'apprentissage",
    "icon": "fa-user-graduate"
  },
  {
    "min": 36,
    "max": 43,
    "titre": "Titre IV — Du placement et de l'emploi",
    "categorie": "Placement et emploi",
    "icon": "fa-briefcase"
  },
  {
    "min": 44,
    "max": 109,
    "titre": "Titre V — Du contrat de travail",
    "categorie": "Contrat de travail",
    "icon": "fa-file-signature"
  },
  {
    "min": 110,
    "max": 118,
    "titre": "Titre VI — Du contrat des personnels domestiques et navigants",
    "categorie": "Contrats particuliers",
    "icon": "fa-users-gear"
  },
  {
    "min": 119,
    "max": 137,
    "titre": "Titre VII — Des conditions de travail (durée & repos)",
    "categorie": "Durée du travail",
    "icon": "fa-clock"
  },
  {
    "min": 138,
    "max": 160,
    "titre": "Titre VIII — De la rémunération",
    "categorie": "Salaire et Avantages",
    "icon": "fa-money-bill-trend-up"
  },
  {
    "min": 161,
    "max": 176,
    "titre": "Titre IX — De l'hygiène et de la sécurité au travail",
    "categorie": "Sécurité et santé au travail",
    "icon": "fa-user-shield"
  },
  {
    "min": 177,
    "max": 186,
    "titre": "Titre X — Des services médicaux d'entreprise",
    "categorie": "Santé et services médicaux",
    "icon": "fa-briefcase-medical"
  },
  {
    "min": 187,
    "max": 209,
    "titre": "Titre XI — Des organismes du travail (Inspection & Conseil)",
    "categorie": "Inspection du Travail",
    "icon": "fa-user-tie"
  },
  {
    "min": 210,
    "max": 246,
    "titre": "Titre XII — Des organisations professionnelles (Syndicats)",
    "categorie": "Syndicats et Représentation",
    "icon": "fa-users-between-lines"
  },
  {
    "min": 247,
    "max": 271,
    "titre": "Titre XIII — De la représentation des travailleurs",
    "categorie": "Représentation des travailleurs",
    "icon": "fa-people-group"
  },
  {
    "min": 272,
    "max": 302,
    "titre": "Titre XIV — Des conflits du travail (individuels & collectifs)",
    "categorie": "Différends et Conflits",
    "icon": "fa-gavel"
  },
  {
    "min": 303,
    "max": 317,
    "titre": "Titre XV — De la sécurité sociale",
    "categorie": "Sécurité sociale",
    "icon": "fa-shield-heart"
  },
  {
    "min": 318,
    "max": 334,
    "titre": "Titre XVI — Des pénalités et dispositions finales",
    "categorie": "Sanctions et Pénalités",
    "icon": "fa-triangle-exclamation"
  }
];
  const SOURCE_ARTICLES = [
  {
    "numero": 1,
    "texte": "Le présent Code est applicable à tous les travailleurs et à tous les employeurs, y compris ceux des entreprises publiques exerçant leur activité professionnelle sur l'étendue de la République Démocratique du Congo, quels que soient la race, le sexe, l'état civil, la religion, l'opinion politique, l'ascendance nationale, l'origine sociale et la nationalité des parties, la nature des prestations, le montant de la rémunération ou le lieu de conclusion du contrat, dès lors que ce dernier s'exécute en République Démocratique du Congo. Il s'applique également aux travailleurs des services publics de l'Etat engagés par contrat de travail.\n\nIl ne s'applique aux marins et bateliers de navigation intérieure que dans le silence des règlements particuliers qui les concernent ou lorsque ces règlements s'y réfèrent expressément.\n\nSont exclus du champ d'application du présent Code\n1) les magistrats ;\n2) les agents de carrière des services publics de l'État régis par le statut général ;\n3) les agents et fonctionnaires de carrière des services publics de l'Etat régis par des statuts particuliers ;\n4) les éléments des Forces Armées Congolaises, de la Police Nationale Congolaise et du Service National."
  },
  {
    "numero": 2,
    "texte": "Le travail est pour chacun un droit et un devoir. Il constitue une obligation morale pour tous ceux qui n'en sont pas empêchés par l'âge ou l'inaptitude au travail constatée par un médecin.\n\nLe travail forcé ou obligatoire est interdit.\n\nTombe également sous le coup de l'interdiction, tout travail ou service exigé d'un individu sous menace d'une peine quelconque et pour lequel ledit individu ne s'est pas offert de plein gré."
  },
  {
    "numero": 3,
    "texte": "Toutes les pires formes de travail des enfants sont abolies.\n\nL'expression « les pires formes de travail des enfants » comprend notamment:\na) toutes les formes d'esclavage ou pratiques analogues, telles que la vente et la traite des enfants, la servitude pour dettes et le servage ainsi que le travail forcé ou obligatoire, y compris le recrutement forcé ou obligatoire des enfants en vue de leur utilisation dans des conflits armés ;\nb) l'utilisation, le recrutement ou l'offre d'un enfant à des fins de prostitution, de production de matériel pornographique de spectacles pornographiques ou des danses obscènes ;\nc) l'utilisation, le recrutement ou l'offre d'un enfant aux fins d'activités illicites, notamment pour la production et le trafic de stupéfiants ;\nd) les travaux qui, par leur nature ou les conditions dans lesquelles ils s'exercent, sont susceptibles de nuire à la santé, à la sécurité, à la dignité ou à la moralité de l'enfant."
  },
  {
    "numero": 4,
    "texte": "Il est institué un Comité National de lutte contre les pires formes de travail des enfants.\n\nCe Comité a pour mission :\n- d'élaborer la stratégie nationale en vue de l'éradication des pires formes de travail des enfants ;\n- d'assurer le suivi de la mise en oeuvre de la stratégie et d'évaluer le niveau d'application des mesures préconisées."
  },
  {
    "numero": 5,
    "texte": "Un arrêté interministériel, pris par les Ministres ayant dans leurs attributions respectivement le Travail et la Prévoyance Sociale et les Affaires Sociales et Famille, détermine l'organisation et le fonctionnement du Comité National de lutte contre les pires formes de travail des enfants."
  },
  {
    "numero": 6,
    "texte": "La capacité d'une personne d'engager ses services est régie par la loi du pays auquel elle appartient, ou à défaut de nationalité connue, par la loi congolaise.\n\nAu sens du présent Code, la capacité de contracter est fixée à seize ans sous réserve des dispositions suivantes :\na) une personne âgée de 15 ans ne peut être engagée ou maintenue en service que moyennant dérogation expresse de l'Inspecteur du Travail et de l'autorité parentale ou tutélaire ;\nb) toutefois l'opposition de l'Inspecteur du Travail et de l'autorité parentale ou tutélaire à la dérogation prévue au litera a) ci-dessus peut être levée par le Tribunal lorsque les circonstances ou l'équité le justifient ;\nc) une personne âgée de 15 ans ne peut être engagée ou maintenue en service que pour l'exécution des travaux légers et salubres prévus par un arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris en application de l'article 38 du présent Code ;\nd) toute forme de recrutement est interdite sur tout le territoire national ;\ne) à défaut d’acte de naissance, le contrôle de l'âge du travailleur visé aux literas a) et b) ci-dessus est exercé selon les modalités fixées par un arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions."
  },
  {
    "numero": 7,
    "texte": "Au sens du présent Code, on entend par :\n\na) Travailleur :\nToute personne physique en âge de contracter, quels que soient son sexe, son état civil et sa nationalité, qui s'est engagée à mettre son activité professionnelle, moyennant rémunération, sous la direction et l'autorité d'une personne physique ou morale, publique ou privée, dans les liens d'un contrat de travail.\nPour la détermination de la qualité de travailleur, il ne sera tenu compte ni du statut juridique de l'employeur ni de celui de l'employé.\n\nb) Employeur :\nToute personne physique ou morale, de droit public ou privé, qui utilise les services d'un ou de plusieurs travailleurs en vertu d'un contrat de travail.\n\nc) Contrat de travail :\nToute convention, écrite ou verbale, par laquelle une personne, le travailleur, s'engage à fournir à une autre personne, l'employeur, un travail manuel ou autre sous la direction et l'autorité directe ou indirecte de celui-ci et moyennant rémunération.\n\nd) Entreprise :\nToute organisation économique, sociale, culturelle, communautaire, philanthropique, de forme juridique déterminée, propriété individuelle ou collective, poursuivant ou non un but lucratif pouvant comprendre un ou plusieurs établissements.\n\ne) Etablissement :\nUn centre d'activité individualisé dans l'espace ayant au point de vue technique son objet propre et utilisant les services d'un ou de plusieurs travailleurs qui exécutent une tâche sous une direction unique.\nUn établissement donné relève toujours d'une entreprise.\nUn établissement unique et indépendant constitue à la fois une entreprise et un établissement.\n\nf) Recrutement :\nToute opération effectuée dans le but de s'assurer ou de procurer à autrui la main-d'oeuvre de personnes n'offrant pas spontanément leurs services.\n\ng) Contrat d'apprentissage :\nLe contrat par lequel une personne physique ou morale, le maître d'apprentissage, s'oblige à donner ou à faire donner une formation professionnelle méthodique et complète à une autre personne, l'apprenti, et par lequel ce dernier s'oblige en retour à se conformer aux instructions qu'il recevra et à exécuter les ouvrages qui lui seront confiés en vue de son apprentissage.\n\nh) Rémunération :\nLa somme représentative de l'ensemble des gains susceptibles d'être évalués en espèces et fixés par accord ou par les dispositions légales et réglementaires qui sont dus en vertu d'un contrat de travail, par un employeur à un travailleur.\nElle comprend notamment :\n- le salaire ou traitement ;\n- les commissions ;\n- l'indemnité de vie chère ;\n- les primes ;\n- la participation aux bénéfices ;\n- les sommes versées à titre de gratification ou de mois complémentaires ;\n- les sommes versées pour prestations supplémentaires ;\n- la valeur des avantages en nature ;\n- l'allocation de congé ou l'indemnité compensatoire de congé ;\n- les sommes payées par l'employeur pendant l'incapacité de travail et pendant la période précédant et suivant l'accouchement.\nNe sont pas éléments de la rémunération :\n- les soins de santé ;\n- l'indemnité de logement ou le logement en nature ;\n- les allocations familiales légales ;\n- l'indemnité de transport ;\n- les frais de voyage ainsi que les avantages accordés exclusivement en vue de faciliter au travailleur l'accomplissement de ses fonctions.\n\ni) Jour ouvrable :\nChaque jour de la semaine à l'exception des jours de repos hebdomadaires et des jours fériés légaux.\n\nj) Temps de services :\nLe total des durées :\n- des prestations de travail fournies chez le dernier employeur et chez les employeurs substitués pendant le dernier contrat et les contrats de travail précédents ;\n- des congés y compris le congé de maternité ;\n- de l'incapacité de travail, en cas d'accident ou de maladie jusqu'à concurrence de six mois ininterrompus et sans limitation en cas d'accident du travail ou de maladie professionnelle ;\n- des voyages se situant entre deux périodes de services.\n\nk) Famille de travailleur :\n- le conjoint ;\n- les enfants tels que définis par le Code de la famille ;\n- les enfants que le travailleur a adoptés ;\n- les enfants dont le travailleur a la tutelle ou la paternité juridique ;\n- les enfants pour lesquels il est débiteur d'aliments conformément aux dispositions du Code de la Famille.\nUn enfant entre en ligne de compte s'il est célibataire et :\n- jusqu'à sa majorité en règle générale ;\n- jusqu'à l'âge de 25 ans révolus, s'il étudie dans un établissement de plein exercice ;\n- sans limite d'âge, lorsqu'il est incapable d'exercer une activité lucrative en raison de son état physique ou mental et que le travailleur l'entretient.\nN'entre pas en ligne de compte, l'enfant mineur engagé dans les liens d'un contrat de travail ou d'apprentissage qui lui donne droit à une rémunération normale.\nDans tous les textes légaux et réglementaires relatifs à la sécurité sociale s'appliquant tant au secteur public qu'au secteur privé, le terme « enfant » doit être interprété conformément à l'article 7, litera (k), du présent code sans préjudice des dispositions plus favorables au bénéficiaire des avantages sociaux."
  },
  {
    "numero": 8,
    "texte": "Tout employeur public ou privé a l'obligation d'assurer la formation, le perfectionnement ou l'adaptation professionnelle des travailleurs qu'il emploie.\n\nA cette fin, il pourra utiliser les moyens mis à sa disposition sur toute l'étendue du territoire de la République Démocratique du Congo par l'Institut National de Préparation Professionnelle."
  },
  {
    "numero": 9,
    "texte": "Un décret du Président de la République, pris sur proposition du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions après avis du Conseil National du Travail, détermine la politique de la formation et du perfectionnement professionnels pour l'emploi et fixe les modalités de fonctionnement des centres de formation professionnelle."
  },
  {
    "numero": 10,
    "texte": "Le Ministre du Travail et de la Prévoyance Sociale assure l'exécution de la politique de la formation et du perfectionnement professionnels. Il élabore, avec le concours de l'Institut National de Préparation Professionnelle, des organisations professionnelles, et, le cas échéant, des centres de formation\n\nagréés, le programme de préparation professionnelle visant à promouvoir et à faciliter :\n-\nla création d'emplois ;\n-\nl'amélioration de la productivité et le développement économique ;\n-\nla mobilité professionnelle ;\n-\nl'insertion professionnelle des jeunes ;\n-\nla réinsertion des accidentés du travail."
  },
  {
    "numero": 11,
    "texte": "Il est institué un Institut National de Préparation Professionnelle, I.N.P.P. en sigle, doté de la personnalité juridique.\n\nSon siège est établi à Kinshasa.\n\nIl possède notamment la capacité d'acquérir des biens meubles et immeubles et d'en disposer.\n\nSes engagements sont garantis par l'Etat."
  },
  {
    "numero": 12,
    "texte": "L'Institut, par association des intérêts et des responsabilités de l'Etat, des employeurs et des travailleurs, est chargé de collaborer à la promotion, à la création et à la mise en application des moyens existants ou nouveaux, nécessaires pour la qualification professionnelle de la population active nationale et à la coordination de leur fonctionnement.\n\nSon action est notamment destinée au perfectionnement et à la promotion professionnelle des\n\ntravailleurs dans l'emploi, à la formation rapide de nouveaux travailleurs dans l'emploi, à la formation rapide de nouveaux travailleurs adultes, à l'apprentissage dans l'emploi, à la préparation professionnelle des bénéficiaires d'une culture générale de base, et à l'adaptation professionnelle de ceux ayant reçu une formation technique ou professionnelle de type scolaire.\n\nSon action tendra également à faciliter la conversion de la qualification professionnelle des travailleurs devant changer de profession ou de métier et la réadaptation professionnelle des travailleurs frappés d'incapacité professionnelle."
  },
  {
    "numero": 13,
    "texte": "L'Institut National de Préparation Professionnelle est chargé en outre :\na) de créer et de maintenir la coopération entre tous les organismes s'occupant de formation technique et professionnelle, notamment en établissant et en distribuant toutes informations utiles sur les possibilités de formation pour chaque profession ;\nb) de collaborer à la désignation des professions pour lesquelles des normes de qualification sont considérées comme nécessaires ou souhaitables, à l'établissement de ces normes, à la détermination de la nature et du degré des qualifications professionnelles et à l'organisation des examens destinés à les sanctionner ;\nc) de coopérer avec les services publics et les organisations professionnelles intéressées à l'établissement d'une classification professionnelle et à la détermination des qualifications professionnelles pour chaque niveau d'emploi, pour chaque métier ou chaque profession ;\nd) d'apporter le fruit de son expérience à la Direction de l'Emploi et à l'Office National de l'Emploi sur les problèmes d'étude des tendances du marché de l'emploi, de l'évaluation des besoins actuels et futurs des travailleurs des différents niveaux de la classification professionnelle et du placement des travailleurs ;\ne) de promouvoir le système adéquat d'orientation et de sélection professionnelle et de participer à son fonctionnement ;\nf) de collaborer avec le Ministère de l'Education Nationale et avec toutes les organisations professionnelles ou culturelles intéressées aux activités de préparation professionnelle."
  },
  {
    "numero": 14,
    "texte": "La tutelle technique de l'Etat sur l'Institut National de Préparation Professionnelle est exercée par le Ministère ayant le Travail et la Prévoyance Sociale dans ses attributions.\n\nL'organisation générale, l'administration et la gestion de l'Institut sont assumées par un Conseil d'Administration de forme tripartite associant les représentants de l'Etat, des employeurs et des travailleurs."
  },
  {
    "numero": 15,
    "texte": "Les ressources de l'Institut National de Préparation Professionnelle sont constituées par :\na) la subvention annuelle de l'Etat ;\nb) la cotisation mensuelle des employeurs proportionnelle à la somme des rémunérations versées par eux à leur personnel au cours du trimestre précédent.\n\nLe taux de cette cotisation est fixé pour chaque période de 3 ans par arrêté conjoint des Ministres ayant respectivement le Travail et la Prévoyance Sociale, les Finances et le Budget dans leurs attributions après avis du Conseil National du Travail.\n\nA défaut d'avis conforme, le taux de la cotisation est fixé par décret du Président de la République pris sur proposition des Ministres ayant respectivement le Travail et la Prévoyance sociale, les Finances et le Budget dans leurs attributions.\nc) des apports, dons et legs qui pourront lui être consentis ;\nd) des rétributions exceptionnelles pour services spéciaux et notamment pour la fourniture du matériel didactique, fixées conventionnellement par l'Institut et les employeurs."
  },
  {
    "numero": 16,
    "texte": "Le relevé des sommes dues à l'Institut National de Préparation Professionnelle au titre des cotisations prévues à l'article précédent, certifié par le Ministre du Travail et de la Prévoyance Sociale ou son délégué, vaut titre permettant les saisies prévues par les articles 106 et suivants du Code de procédure civile."
  },
  {
    "numero": 17,
    "texte": "Toutes les dispositions de l'ordonnance-loi n°206 du 29 juin 1964, portant création de l'Institut National de Préparation Professionnelle et des textes pris pour son application qui ne sont pas contraires aux dispositions du présent titre demeurent en vigueur."
  },
  {
    "numero": 18,
    "texte": "Nul ne peut recevoir des apprentis mineurs s'il n'est :\n- âgé de 18 ans au moins ;\n- reconnu de bonne vie et moeurs ;\n- suffisamment qualifié pour donner aux apprentis une formation appropriée ou faire donner cette formation par une autre personne à son service ayant les qualités requises.\n\nAucun maître, s'il ne vit en famille ou en communauté, ne peut loger comme apprenties des jeunes filles mineures."
  },
  {
    "numero": 19,
    "texte": "Tout contrat d'apprentissage doit être constaté par écrit et contenir les mentions énumérées à l'article 20 du présent Code.\n\nIl est rédigé en langue officielle ou nationale connue de l'apprenti.\n\nIl est signé par le maître, l'apprenti et les parents, à défaut de ceux-ci par le tuteur ou la personne autorisée par les parents ou encore le juge compétent.\n\nIl est exempt de tout droit de timbre et d'enregistrement."
  },
  {
    "numero": 20,
    "texte": "Le contrat d'apprentissage est établi en tenant compte des usages et coutumes de la profession.\n\nIl doit faire obligatoirement mention :\n1) des prénoms, noms, post-noms, âge, profession, nationalité et domicile du maître, de l'adresse et de la raison sociale de l'entreprise ou du service public qui engage l'apprenti ;\n2) des prénoms, noms, post-noms, âge, profession, nationalité et domicile de l'apprenti ;\n3) des prénoms, noms, post-noms, âge, profession, nationalité et domicile du père et de la mère de l'apprenti, de son tuteur ou à leur défaut, de la personne autorisée par les parents ou du juge compétent ;\n4) de la date du début et de la durée du contrat ; cette dernière est fixée conformément aux usages de la profession, mais ne peut excéder quatre ans ;\n5) des indemnités en espèces éventuellement consenties ;\n6) de l'indication de la profession ou du métier enseigné ainsi que de l'indication des cours professionnels que le maître s'engage à faire suivre à l'apprenti, soit dans l'établissement, soit au dehors."
  },
  {
    "numero": 21,
    "texte": "Le contrat d'apprentissage est rédigé en quatre exemplaires au moins et soumis au visa de l'Office National de l'Emploi, tel qu'institué au Titre IX du présent Code.\n\nLa demande de visa incombe au maître.\n\nTant que le contrat n'a pas été soumis au visa, ou lorsque le visa a été retiré, les services de l'apprenti sont présumés être prestés en exécution d'un contrat de travail respectivement à la date de la conclusion du contrat et du retrait du visa."
  },
  {
    "numero": 22,
    "texte": "L'autorité qui vise le contrat doit :\na) exiger la production par le maître d'un certificat médical, datant de moins de trois mois, déclarant le futur apprenti apte aux travaux de la profession ou du métier choisi et établi dans les conditions fixées par l'arrêté prévu à l'article 38 du présent Code ;\nb) constater l'identité de l'apprenti et la conformité du contrat aux dispositions du présent Code et des textes pris pour son application ;\nc) s'assurer que l'apprenti est libre de tout engagement antérieur, n'a pas fait des études ou subi une préparation spécialisée constituant présomption de capacité professionnelle exclusive d'apprentissage ;\nd) remettre après avis, un exemplaire du contrat à chacune des parties et pour l'apprenti mineur, à son représentant, en conserver le troisième et adresser le quatrième à l'Inspecteur du Travail du ressort."
  },
  {
    "numero": 23,
    "texte": "A défaut du visa ou en cas de refus de celui-ci, le contrat d'apprentissage est annulable. En cas d'annulation ou de doute sur l'objet du contrat non écrit, les services de l'apprenti sont présumés avoir été prestés en exécution d'un contrat de travail.\n\nLorsqu'il apparaît à l'Inspecteur du Travail que les conditions édictées sur la réglementation de l'apprentissage ne sont plus réunies, le visa peut être retiré par l'Office National de l'Emploi, sur rapport motivé de l'Inspecteur du Travail.\n\nDans ce cas, le contrat cesse de plein droit.\n\nSection I : Des obligations du maître d'apprentissage"
  },
  {
    "numero": 24,
    "texte": "L’apprentissage comporte essentiellement pour le maître les obligations suivantes envers l’apprenti :\n1) lui enseigner ou lui faire enseigner méthodiquement, progressivement et complètement le métier ou la profession qui fait l'objet du contrat, et mettre à sa disposition les outils et le matériel nécessaires à cet enseignement ;\n2) le traiter avec tous les égards voulus, faire respecter les convenances et bonnes mœurs pendant l'exécution du contrat, et veiller à sa sécurité et à sa santé, compte tenu des circonstances et de la nature du travail ;\n3) avertir sans retard ses parents ou son tuteur en cas de maladie, d'absence ou de faute grave ou de tout fait de nature à motiver leur intervention ;\n4) lui accorder, à l'expiration de chaque période d'un an de services effectifs un congé d'une durée conforme à celle fixée par l'article 141 du présent Code et de lui verser, le cas échéant, l'indemnité prévue au contrat ;\n5) lui fournir pendant la durée du contrat, en cas de maladie ou d'accident, les prestations dues aux travailleurs en vertu du présent Code, à l'exception de celles qui sont dues à la famille du travailleur et des prestations relatives au salaire ;\n6) lui délivrer, à la fin de l'apprentissage, un certificat de fin d'apprentissage, conforme au modèle fixé par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions."
  },
  {
    "numero": 25,
    "texte": "Le maître a l'obligation de rémunérer l'apprenti dans les conditions fixées par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail.\n\nCette rémunération prend la forme d'une indemnité qui devra être majorée au fur et à mesure des années d'apprentissage.\n\nToutes les obligations et garanties prévues par le présent Code en matière de salaire s'attachent à cette rémunération.\n\nSection II : Des obligations de l'apprenti"
  },
  {
    "numero": 26,
    "texte": "L’apprentissage comporte essentiellement pour l’apprenti les obligations suivantes :\n1) se conformer aux ordres du maître d'apprentissage ou de son préposé ;\n2) exécuter les travaux qui lui sont confiés aux conditions convenues et, d'une manière générale, aider le maître d'apprentissage ou son préposé dans la mesure de ses aptitudes et de ses forces ;\n3) observer le respect des convenances et des bonnes moeurs pendant l'exécution du contrat ;\n4) restituer en bon état les outils, marchandises, produits ou tout objet qui lui sont confiés par le maître d'apprentissage, sauf détériorations et usures dues à l'usage normal de la chose ou perte par cas fortuit ;\n5) s'abstenir de tout ce qui pourrait nuire aux intérêts du maître d'apprentissage, à sa propre sécurité ou à celle de ses compagnons et garder les secrets de fabrication ou d'affaires dont il a connaissance à l'occasion de son apprentissage ;\n6) se soumettre aux examens médicaux imposés par le maître d'apprentissage, ainsi qu'aux épreuves d'évaluation en vue de contrôle de sa formation professionnelle."
  },
  {
    "numero": 27,
    "texte": "Il pourra être prévu au contrat d'apprentissage que l'apprenti s'engage, après achèvement de l'apprentissage, à exercer son activité professionnelle pour le compte de son ancien maître pendant une période qui ne peut excéder deux ans.\n\nL'inobservation de cet engagement par l'une des parties entraîne, sous réserve des dommages-intérêts, la prestation d'un préavis ou à défaut le versement d'une indemnité compensatoire de préavis calculée conformément aux dispositions de l'article 63 du présent Code."
  },
  {
    "numero": 28,
    "texte": "Le contrat d'apprentissage est suspendu pendant la durée de l'incapacité de travail de l'apprenti résultant de maladie ou d'accident.\n\nLe maître d'apprentissage a toutefois la faculté de résilier le contrat lorsque l'incapacité de travail a duré six mois ou lorsque la maladie ou l'accident fait présumer que l'apprenti ne pourra remplir ses obligations pendant une période continue de six mois ininterrompus hormis le cas d'accident du travail et de maladie professionnelle."
  },
  {
    "numero": 29,
    "texte": "Le contrat d'apprentissage prend fin de plein droit avant son terme :\na) par la mort du maître ou de l'apprenti ;\nb) par l'appel ou le rappel sous le drapeau de l'apprenti ou du maître ;\nc) par la condamnation du maître à une peine de servitude pénale supérieure à trois mois sans sursis ;\nd) pour les filles mineures apprenties habitant chez le maître, en cas de divorce de ce dernier, du décès de l'épouse du maître ou de toute femme de la famille qui dirigeait la maison à l'époque de la conclusion du contrat."
  },
  {
    "numero": 30,
    "texte": "Tout contrat d'apprentissage peut être résilié à la demande des parties pour les causes ci-après :\na) si l'une des parties manquait aux stipulations du contrat ;\nb) pour cause d'infraction grave ou habituelle aux prescriptions des articles 24 et 26 du présent Code ou des autres dispositions légales ou réglementaires concernant les conditions de travail des apprentis ;\nc) lorsque le maître transporte sa résidence hors de l'entité administrative dans laquelle il habitait et exerçait son activité lors de la conclusion du contrat ;\nd) lorsque le maître ou l'apprenti encourt une condamnation à une peine de servitude pénale principale de plus de deux mois ;\ne) le mariage de l'apprenti ou éventuellement l'acquisition de la qualité de chef de famille à la suite du décès de son père. Dans ce cas, la résiliation du contrat ne peut intervenir qu'à la demande de l'apprenti lui-même."
  },
  {
    "numero": 31,
    "texte": "Lorsque l'apprenti est mineur, et sans préjudice à l'exercice de l'autorité parentale ou tutélaire, toute résiliation du contrat d'apprentissage à l'initiative du maître est soumise à la condition suspensive de son approbation par l'Inspecteur du Travail du ressort. La demande d'approbation est adressée à l'Inspecteur du Travail par lettre recommandée ou par cahier de transmission.\n\nL'Inspecteur du Travail doit notifier sa décision dans le mois à partir du jour où le maître lui a fait connaître la mesure envisagée ; à défaut, il est censé l'approuver.\n\nLa décision de l'Inspecteur du Travail est susceptible d'un recours hiérarchique ou judiciaire dans les conditions fixées par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail."
  },
  {
    "numero": 32,
    "texte": "La demande de résiliation du contrat fondée sur les literas (a), (b) et (d) de l'article 30 ci-dessus ne sont recevables par l'Inspecteur du Travail que dans les formes et délais fixés à l'article 72 du présent Code.\n\nLa demande formulée sur les literas (c) et (e) du même article ne sont recevables que pendant trois mois."
  },
  {
    "numero": 33,
    "texte": "L'Inspecteur du Travail du ressort est chargé du contrôle de l'exécution du contrat d'apprentissage ; il peut se faire assister d'un technicien pour le contrôle de l'enseignement donné à l'apprenti dans l'établissement.\n\nToute cessation de contrat d'apprentissage doit être portée à la connaissance de l'Inspecteur du Travail et de l'Office National de l'Emploi."
  },
  {
    "numero": 34,
    "texte": "Les apprentis sont assimilés aux travailleurs et bénéficient de toutes les autres dispositions du présent Code qui ne sont pas contraires aux dispositions particulières du présent Titre."
  },
  {
    "numero": 35,
    "texte": "Des arrêtés du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail, peuvent déterminer les catégories d'entreprises dans lesquelles est imposé un pourcentage maximum d'apprentis par rapport au nombre des travailleurs.\n\nDes arrêtés du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions peuvent limiter l'effectif des apprentis ou le droit de former des apprentis dans les établissements dans lesquels il a été constaté une formation professionnelle insuffisante."
  },
  {
    "numero": 36,
    "texte": "Les contrats de travail sont passés librement, sous réserve des dispositions du présent Code.\n\nLa date d'entrée en vigueur et la durée du contrat, la nature et l'objet des prestations du travailleur, le ou les lieux où elles doivent s'accomplir, la rémunération, les avantages complémentaires, les frais remboursables et toutes autres conditions sont déterminées par le contrat, dans le cadre des dispositions légales et sous réserve de l'observation des conventions collectives, des règlements d'entreprises et des usages locaux.\n\nLe contrat peut mentionner des conditions plus favorables au travailleur."
  },
  {
    "numero": 37,
    "texte": "Les contrats de travail ne peuvent déroger aux dispositions d'ordre public définies par la législation et la réglementation en vigueur.\n\nToute clause contractuelle accordant au travailleur des avantages inférieurs à ceux prescrits par le présent Code est nulle de plein droit."
  },
  {
    "numero": 38,
    "texte": "L'exécution du contrat de travail est subordonnée à la constatation de l'aptitude au travail du travailleur.\n\nL'aptitude au travail est constatée par un certificat médical délivré par un médecin du travail ou, à défaut, par tout autre médecin. En l'absence de celui-ci, un certificat provisoire est délivré par un infirmier, sous réserve de soumettre le travailleur à un examen médical dans les trois mois qui suivent le début des prestations de travail.\n\nUne personne médicalement inapte au travail auquel elle est destinée ou affectée ne peut être engagée ni maintenue en service.\n\nUn arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions fixe les modalités d'application du présent article, ainsi que les dérogations qui peuvent être admises en ce qui concerne les travaux légers et salubres autorisés pour les personnes âgées de 15 à moins de 16 ans."
  },
  {
    "numero": 39,
    "texte": "Tout contrat de travail est à durée déterminée ou à durée indéterminée."
  },
  {
    "numero": 40,
    "texte": "Est à durée déterminée le contrat qui est conclu soit pour un temps déterminé, soit pour un ouvrage déterminé, soit pour le remplacement d'un travailleur temporairement indisponible.\n\nNéanmoins, dans le cas d'engagement au jour le jour, si le travailleur a déjà accompli vingt-deux journées de travail sur une période de deux mois, le nouvel engagement conclu, avant l'expiration des deux mois est, sous peine de pénalité, réputé conclu pour une durée indéterminée."
  },
  {
    "numero": 41,
    "texte": "Le contrat à durée déterminée ne peut excéder deux ans. Cette durée ne peut excéder un an, si le travailleur est marié et séparé de sa famille ou s'il est veuf, séparé de corps ou divorcé et séparé de ses enfants dont il doit assumer la garde.\n\nAucun travailleur ne peut conclure avec le même employeur ou avec la même entreprise plus de deux contrats à durée déterminée ni renouveler plus d'une fois un contrat à durée déterminée, sauf dans le cas d'exécution des travaux saisonniers, d'ouvrages bien définis et autres travaux déterminés par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail.\n\nL'exécution de tout contrat conclu en violation des dispositions du présent article ou la continuation de service en dehors des cas prévus à l'alinéa précédent constituent de plein droit l'exécution d'un contrat de travail à durée indéterminée."
  },
  {
    "numero": 42,
    "texte": "Lorsque le travailleur est engagé pour occuper un emploi permanent dans l'entreprise ou l'établissement, le contrat doit être conclu pour une durée indéterminée.\n\nTout contrat conclu pour une durée déterminée en violation du présent article est réputé conclu pour une durée indéterminée."
  },
  {
    "numero": 43,
    "texte": "Tout contrat de travail, peut être assorti d'une clause d'essai. Cette clause d'essai doit être constatée par écrit.\n\nLa durée de l'essai ne peut être supérieure au délai nécessaire pour mettre à l'épreuve le personnel engagé, compte tenu de la technique et des usages de la profession.\n\nDans tous les cas, la durée de l'essai ne peut dépasser un mois pour le travailleur manœuvre sans spécialité ni six mois pour les autres travailleurs. Si la clause d'essai prévoit une durée plus longue, celle-ci est réduite de plein droit à un mois ou à six mois, selon le cas.\n\nLa prolongation des services au-delà de cette durée maximale entraîne automatiquement la confirmation du contrat de travail.\n\nLes délais d'engagement et de route ne sont pas compris dans la durée maximale de l'essai.\n\nLes droits au voyage aller et retour du travailleur engagé à l'essai sont réglés par les articles 147 à 156 du présent Code."
  },
  {
    "numero": 44,
    "texte": "Le contrat de travail doit être constaté par écrit et rédigé dans la forme qu'il convient aux parties d'adopter pour autant qu'il comporte les énonciations visées à l'article 212 du présent Code.\n\nA défaut d'écrit, le contrat est présumé, jusqu'à preuve du contraire, avoir été conclu pour une durée indéterminée.\n\nLe présent article ne s'applique pas dans le cas d'engagement au jour le jour.\n\nUn arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions fixe les modalités d'application du présent article."
  },
  {
    "numero": 45,
    "texte": "Le contrat constaté par écrit qui ne mentionne pas expressément qu'il a été conclu soit pour une durée déterminée, soit pour un ouvrage déterminé, soit pour le remplacement d'un travailleur temporairement indisponible, ou qui n'indique pas, dans ce dernier cas, les motifs et conditions particulières du remplacement, est réputé avoir été conclu pour une durée indéterminée."
  },
  {
    "numero": 46,
    "texte": "L'employeur est tenu de remettre au travailleur, deux jours ouvrables au moins avant la signature du contrat, un exemplaire du projet de contrat et de mettre à sa disposition tous les documents essentiels auxquels il se réfère. Faute pour l'employeur d'avoir rempli cette obligation, le travailleur peut résilier le contrat dans les trente jours suivant sa conclusion sans préavis ni indemnité."
  },
  {
    "numero": 47,
    "texte": "L'employeur est tenu de soumettre tout contrat écrit au visa de l'Office National de l'Emploi, suivant les modalités fixées par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions.\n\nLe défaut pour l'employeur d'accomplir cette formalité donne droit au travailleur de résilier le contrat de travail à tout moment, sans préavis et il peut réclamer, s'il y a lieu, des dommages intérêts.\n\nLe contrat de travail que l'Office National de l'Emploi a refusé de viser prend fin de plein droit."
  },
  {
    "numero": 48,
    "texte": "Les tribunaux peuvent ordonner la communication de l'exemplaire du contrat conservé par l'autorité qui l'a visé."
  },
  {
    "numero": 49,
    "texte": "En l'absence d'écrit, le travailleur peut, même si la forme écrite est requise, établir par toutes voies de droit, l'existence et la teneur du contrat, ainsi que toutes modifications ultérieures.\n\nSection I : Des obligations du travailleur"
  },
  {
    "numero": 50,
    "texte": "Le travailleur a l'obligation d'exécuter personnellement son travail, dans les conditions, au temps et au lieu convenus.\n\nIl doit agir conformément aux ordres qui lui sont donnés par l'employeur ou son préposé, en vue de l'exécution du contrat. Il doit respecter les règlements établis pour l'établissement, l'atelier ou le lieu dans lequel il doit exécuter son travail."
  },
  {
    "numero": 51,
    "texte": "Le travailleur doit s'abstenir de tout ce qui pourrait nuire soit à sa propre sécurité soit à celle de ses compagnons ou des tiers.\n\nIl doit respecter les convenances et les bonnes mœurs pendant l'exécution du contrat et traiter avec équité les travailleurs placés sous ses ordres."
  },
  {
    "numero": 52,
    "texte": "Le travailleur a l'obligation de restituer en bon état à l'employeur les marchandises, produits, espèces, et d'une façon générale, tout ce qui lui a été confié.\n\nIl n'est tenu pour responsable ni des détériorations, ni de l'usure dues à l'usage normal de la chose, ni de la perte fortuite. Il doit garder les secrets de fabrication ou d'affaires de l'entreprise et s'abstenir de se livrer ou de collaborer à tout acte de concurrence déloyale, même après expiration du contrat."
  },
  {
    "numero": 53,
    "texte": "Est nulle de plein droit la clause interdisant au travailleur après la fin du contrat, d'exploiter une entreprise personnelle, de s'associer en vue de l'exploitation d'une entreprise ou de s'engager chez d'autres employeurs.\n\nNéanmoins, lorsque le contrat a été résilié à la suite d'une faute lourde du travailleur ou lorsque celui-ci y a mis fin sans qu'il y ait faute lourde de l'employeur, la clause sort ses effets pour autant que le travailleur ait de la clientèle ou des secrets d'affaires de son employeur une connaissance telle qu'il puisse lui nuire gravement, que l'interdiction se rapporte aux activités que le travailleur exerçait chez l'employeur, que sa durée ne dépasse pas un an à compter de la fin du contrat.\n\nLa clause de non concurrence peut prévoir une peine conventionnelle à la charge du travailleur qui viole l'interdiction. A la demande de celui-ci, le tribunal compétent ramènera à un montant équitable l'amende conventionnelle excessive."
  },
  {
    "numero": 54,
    "texte": "Dans le cadre de l'exécution du contrat de travail, compte tenu de la gravité de la faute commise, le travailleur est passible de l'une des sanctions disciplinaires ci-après :\n- le blâme ;\n- la réprimande ;\n- la mise à pied dans les limites et conditions fixées au point 5 de l'article 57 du présent Code ;\n- le licenciement avec préavis ;\n- le licenciement sans préavis dans les cas et conditions fixés aux articles 72 et 74 du présent Code.\n\nLa sanction disciplinaire sera prise en tenant compte notamment de la gravité, de la répétition de la faute commise ou de l’intention de nuire qui l'a inspirée.\n\nSection II : Des obligations de l'employeur"
  },
  {
    "numero": 55,
    "texte": "L'employeur doit fournir au travailleur l'emploi convenu et ce, dans les conditions, au temps et au lieu convenus ; il est responsable de l'exécution du contrat de travail passé par toute personne agissant en son nom.\n\nIl doit diriger le travailleur et veiller à ce que le travail s'accomplisse dans des conditions convenables, tant au point de la sécurité que de la santé et la dignité du travailleur.\n\nIl doit accorder au travailleur, désigné juge assesseur du tribunal du travail, la dignité et le temps nécessaire pour l’accomplissement de sa mission.\n\nCe temps est considéré et rémunéré comme temps de travail.\n\nIl doit tenir, à la disposition des représentants des travailleurs au sens de l’article 255, un exemplaire du présent code pour consultation."
  },
  {
    "numero": 56,
    "texte": "L'employeur supporte la charge résultant du transport des travailleurs de leur résidence à leurs lieux de travail et vice versa.\n\nUn arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions fixe la distance à partir de laquelle cette obligation naît et les modalités d'application du présent article."
  },
  {
    "numero": 57,
    "texte": "Sont suspensifs du contrat de travail :\n1) l'incapacité de travail résultant d'une maladie ou d'un accident, de la grossesse ou de l'accouchement et de ses suites ;\n2) l'appel ou le rappel sous le drapeau et l'engagement volontaire en temps de guerre dans les forces armées congolaises ou d'un Etat allié ;\n3) les services prestés en exécution des mesures de réquisitions militaires ou d'intérêt public prises par le Gouvernement ;\n4) l'exercice des mandats publics ou d'obligations civiques ;\n5) jusqu'à concurrence de deux fois quinze jours par an, la mesure disciplinaire de mise à pied lorsque cette mesure est prévue soit par le contrat de travail soit par la convention collective ou par le règlement d'entreprise ;\n6) la grève ou le lock-out, si ceux-ci sont déclenchés dans le respect de la procédure de règlement des conflits collectifs du travail telle que définie aux articles 303 à 315 du présent Code ou de la procédure définie par la convention collective applicable ;\n7) l'incarcération du travailleur ;\n8) la force majeure, lorsqu'elle a pour effet d'empêcher de façon temporaire, l'une des parties à remplir ses obligations.\n\nIl y a force majeure lorsque l'événement survenu est imprévisible, inévitable, non imputable à l'une ou l'autre partie et constitue une impossibilité absolue d'exécution d'obligations contractuelles.\n\nLe cas de force majeure est constaté par l'Inspecteur du Travail."
  },
  {
    "numero": 58,
    "texte": "Un arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail, fixe les droits et obligations des parties dans chacun des cas de suspension prévus à l'article précédent, points 2 à 7."
  },
  {
    "numero": 59,
    "texte": "En dehors des obligations prévues aux articles 105, 106, 130, 146 à 156 et 178 du présent Code, et de celles découlant des dispositions de l'arrêté prévu à l'article précédent, les parties sont déliées de toute obligation l'une envers l'autre pendant toute la durée de la suspension du contrat."
  },
  {
    "numero": 60,
    "texte": "Il ne peut être mis fin à un contrat pendant qu'il est suspendu, sous les réserves suivantes :\na) en cas de maladie ou d'accident, hormis le cas d'accident du travail ou de maladie professionnelle, l'employeur peut notifier au travailleur la résiliation du contrat après six mois ininterrompus d'incapacité d'exécuter celui-ci.\n\nLe contrat prend fin le lendemain de la notification de la résiliation.\n\nDans ce cas, l'employeur est tenu au paiement d'une indemnité de résiliation correspondant au préavis dû en cas de contrat à durée indéterminée ;\nb) en cas d'exercice de mandats publics ou d'obligations civiques, l'employeur peut mettre fin au contrat moyennant paiement des indemnités prévues par le contrat ou la convention collective, après douze mois de suspension ;\nc) en cas de force majeure, la partie intéressée peut résilier le contrat sans indemnité, après deux mois de suspension ;\nd) en cas d'incarcération du travailleur, l'employeur peut mettre fin au contrat sans indemnité après trois mois de suspension ou si le travailleur est condamné par la suite à une peine de servitude pénale principale supérieure à deux mois.\n\nSection I : De la résiliation du contrat"
  },
  {
    "numero": 61,
    "texte": "Tout contrat de travail peut être résilié à l'initiative soit de l'employeur soit du travailleur."
  },
  {
    "numero": 62,
    "texte": "Le contrat à durée indéterminée ne peut être résilié à l’initiative de l’employeur que pour un motif valable lié à l’aptitude ou à la conduite du travailleur.\n\nLa résiliation se fonde sur :\n- Les actes perpétrés sur les lieux de travail par le travailleur dans l’exercice de ses fonctions ;\n- Les actes perpétrés en dehors mais ayant leur fondement ou leur origine sur les lieux de travail dans l’exercice de ses fonctions ;\n- Les nécessités du fonctionnement de l’entreprise, de l’établissement ou du service.\n\nNe constituent pas des motifs valables de licenciement notamment :\n- L’affiliation syndicale, la non affiliation syndicale ou la participation à des activités syndicales en dehors des heures de travail ou, avec le consentement de l’employeur, durant les heures de travail ;\n- Le fait de solliciter, d’exercer ou d’avoir exercé un mandat de représentation des travailleurs ;\n- Le fait d’avoir déposé une plainte ou participé à des procédures engagées contre un employeur en raison de violations alléguées de la législation, ou présenté un recours devant les autorités administratives compétentes ;\n- La race, la couleur, le sexe, l’état matrimonial, les responsabilités familiales, la grossesse, l’accouchement et ses suites, la religion, l’opinion politique, l’ascendance nationale ou l’origine sociale, le groupe ethnique, le statut sérologique au VIH avéré ou présumé ;\n- L’absence au travail pendant le congé de maternité.\n\nToute résiliation à l’initiative de l’employeur d’un contrat à durée indéterminée, fondée sur les nécessités du fonctionnement de l’entreprise, de l’établissement ou du service, est soumise aux conditions définies par un arrêté du Ministre ayant le travail et la prévoyance sociale dans ses attributions.\n\nLorsque l’employeur envisage un licenciement pour des motifs liés à l’aptitude ou à la conduite du travailleur, il est tenu, avant toute décision, de permettre à l’intéressé de se défendre contre les reproches formulés ou de s’expliquer sur les motifs avancés."
  },
  {
    "numero": 63,
    "texte": "La résiliation sans motif valable du contrat à durée indéterminée donne droit, pour le travailleur, à une réintégration. A défaut de celle-ci, le travailleur a droit à des dommages-intérêts fixés par le Tribunal du travail calculés en tenant compte notamment de la nature des services engagés, de l'ancienneté du travailleur dans l'entreprise, de son âge et des droits acquis à quelque titre que ce soit.\n\nToutefois le montant de ces dommages-intérêts ne peut être supérieur à 36 mois de sa dernière rémunération.\n\nLa rupture de contrat à durée indéterminée sans préavis ou sans que le préavis ait été intégralement observé comporte l'obligation, pour la partie responsable, de verser à l'autre partie une indemnité dont le montant correspond à la rémunération et aux avantages de toute nature dont aurait bénéficié le travailleur durant le délai de préavis qui n'a pas été effectivement respecté."
  },
  {
    "numero": 64,
    "texte": "Sauf durée plus longue fixée par les parties ou par la convention collective, la durée du préavis de résiliation ne peut être inférieure à quatorze jours ouvrables à dater du lendemain de la notification, lorsque le préavis est donné par l'employeur. Ce délai est augmenté de sept jours ouvrables par année entière de services continus, comptée de date à date.\n\nLa durée du préavis de résiliation à donner par le travailleur est égale à la moitié de celui qu'aurait dû remettre l'employeur s'il avait pris l'initiative de la résiliation. Elle ne peut en aucun cas excéder cette limite.\n\nA défaut de convention collective, la durée et les conditions du préavis sont fixées par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail."
  },
  {
    "numero": 65,
    "texte": "Pendant la durée du préavis, l'employeur et le travailleur sont tenus au respect de toutes les obligations réciproques qui leur incombent.\n\nEn vue de la recherche d'un autre emploi, le travailleur bénéficiera, pendant la durée du préavis, d'un jour de liberté par semaine, pris à son choix, globalement ou par demi-journées, et payé à plein salaire.\n\nLa partie à l'égard de laquelle ces obligations ne seraient pas respectées ne pourra se voir imposer aucun délai de préavis, sans préjudice des dommages-intérêts qu'elle jugerait bon de demander au tribunal compétent."
  },
  {
    "numero": 66,
    "texte": "Le travailleur qui reçoit le préavis peut cesser le travail à l'expiration de la moitié du délai de préavis que l'employeur est tenu de lui donner.\n\nL'employeur doit la rémunération et les allocations familiales pendant le temps restant à courir.\n\nLes montants des commissions, primes, gratifications et participations aux bénéfices entrent en ligne de compte dans la détermination de la rémunération et sont calculés sur la moyenne de ces éléments payés pour les douze mois précédents."
  },
  {
    "numero": 67,
    "texte": "Le travailleur qui a reçu le préavis et justifie avoir trouvé un nouvel emploi peut quitter son employeur dans un délai moindre, fixé de commun accord, sans qu'il puisse être supérieur à sept jours à dater du jour où il trouve un nouvel engagement. Dans ce cas, il perd le droit à la rémunération et aux allocations familiales de la période de préavis restant à courir."
  },
  {
    "numero": 68,
    "texte": "Sauf les cas prévus à l'article 60, le préavis ne peut être notifié pendant la période de congé ni pendant la suspension du contrat."
  },
  {
    "numero": 69,
    "texte": "Le contrat à durée déterminée prend fin à l'expiration du terme fixé par les parties. La clause insérée dans un tel contrat prévoyant le droit d'y mettre fin par préavis est nulle de plein droit."
  },
  {
    "numero": 70,
    "texte": "Toute rupture du contrat à durée déterminée prononcée en violation de l'article 69 donne lieu à des dommages-intérêts.\n\nLorsque la rupture irrégulière est le fait de l'employeur, ces dommages-intérêts correspondent aux salaires et avantages de toute nature dont le salarié aurait bénéficié pendant la période restant à courir jusqu'au terme de son contrat."
  },
  {
    "numero": 71,
    "texte": "Dans le cas où le contrat est assorti d'une clause d'essai, chacune des parties peut, pour un motif valable lié à l'aptitude ou à la conduite de l'autre, mettre fin au contrat moyennant un préavis de trois jours ouvrables prenant cours le lendemain de la notification.\n\nToutefois, pendant les trois premiers jours d'essai, le contrat peut être résilié sans préavis, la totalité de la rémunération étant due pour toute journée commencée."
  },
  {
    "numero": 72,
    "texte": "Tout contrat de travail peut être résilié immédiatement sans préavis, pour faute lourde.\n\nUne partie est réputée avoir commis une faute lourde lorsque les règles de la bonne foi ne permettent pas d'exiger de l'autre qu'elle continue à exécuter le contrat.\n\nLa partie qui se propose de résilier le contrat pour faute lourde est tenue de notifier par écrit à l'autre partie sa décision dans les quinze jours ouvrables au plus tard après avoir eu connaissance des faits qu'elle invoque.\n\nPour besoin d'enquête, l'employeur a la faculté de notifier au travailleur, dans les deux jours ouvrables après avoir eu connaissance des faits, la suspension de ses fonctions.\n\nLa suspension des fonctions pour besoin d'enquête est une mesure conservatoire qui ne peut être confondue avec la suspension du contrat de travail prévue à l'article 57.\n\nLa durée de la suspension ne peut excéder quinze jours, et un délai supplémentaire de quinze jours est accordé à l'employeur dont le siège social ne se trouve pas sur le lieu d'exécution du contrat.\n\nL'écrit peut être soit adressé par lettre recommandée à la poste, soit être remis à l'intéressé contre accusé de réception ou, en cas de refus, en présence de deux témoins lettrés.\n\nLa période de suspension du travailleur de ses fonctions pour besoin d'enquête est considérée comme temps de service."
  },
  {
    "numero": 73,
    "texte": "L'employeur commet une faute lourde qui permet au travailleur de rompre le contrat lorsqu'il manque gravement aux obligations du contrat, notamment dans les cas suivants :\na) l'employeur ou son préposé se rend coupable envers lui d'un acte d'improbité, de harcèlement sexuel ou moral, d'intimidation, de voies de fait, d'injures graves ou tolère de la part des autres travailleurs de semblables actes ;\nb) l'employeur ou son préposé lui cause intentionnellement un préjudice matériel pendant ou à l'occasion de l'exécution du contrat ;\nc) en cours d'exécution du contrat, la sécurité ou la santé du travailleur se trouve exposée à des dangers graves qu'il n'a pas pu prévoir au moment de la conclusion du contrat ou lorsque sa moralité est en péril ;\nd) l'employeur ou son préposé opère indûment des réductions ou retenues sur la rémunération du travailleur ;\ne) l'employeur persiste à ne pas appliquer les dispositions légales ou réglementaires en vigueur en matière du travail."
  },
  {
    "numero": 74,
    "texte": "Le travailleur commet une faute lourde qui permet à l'employeur de rompre le contrat lorsqu'il manque gravement aux obligations du contrat et notamment s'il :\na) se rend coupable d'un acte d'improbité, de harcèlement sexuel ou moral, d'intimidation, de voies de fait ou d'injures graves à l'égard de l'employeur ou de son personnel ;\nb) cause à l'employeur, intentionnellement, un préjudice matériel pendant ou à l'occasion de l'exécution du contrat ;\nc) se rend coupable de faits immoraux pendant l'exécution du contrat ;\nd) compromet par son imprudence la sécurité de l'entreprise ou de l'établissement, du travail ou du personnel."
  },
  {
    "numero": 75,
    "texte": "Si le contrat est rompu en vertu de l'une des dispositions de l'article 73 ci-dessus, l'employeur est condamné à verser au travailleur des dommages-intérêts qui devraient être fixés selon le mode d'appréciation prévu à l'article 63.\n\nSi le contrat est rompu en vertu de l'une des dispositions de l'article 74 ci-dessus, l'employeur pourra réclamer au travailleur la réparation du préjudice directement causé par la faute lourde du travailleur."
  },
  {
    "numero": 76,
    "texte": "Toute résiliation du contrat doit être notifiée par écrit par la partie qui en prend l'initiative à l'autre partie. Lorsque la résiliation intervient à l'initiative de l'employeur, la lettre de notification doit en indiquer expressément le motif."
  },
  {
    "numero": 77,
    "texte": "La quittance pour solde de tout compte, délivrée au travailleur au moment où le contrat prend fin, n'implique aucune renonciation à ses droits."
  },
  {
    "numero": 78,
    "texte": "Sauf dérogations éventuelles qui seront déterminées par un arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, les licenciements massifs sont interdits.\n\nL'employeur qui envisage de licencier un ou plusieurs membres de son personnel pour des raisons économiques, notamment la diminution de l'activité de l'établissement et la réorganisation intérieure, doit respecter l'ordre des licenciements établi en tenant compte de la qualification professionnelle, de l'ancienneté dans l'établissement et des charges de famille du travailleur.\n\nEn vue de recueillir leurs suggestions, l'employeur doit informer par écrit, au moins quinze jours à l'avance, les représentants des travailleurs dans l'entreprise, des mesures qu'il a l'intention de prendre.\n\nSeront licenciés en premier lieu, les travailleurs présentant les moindres aptitudes professionnelles pour les emplois maintenus et, en cas d'égalité d'aptitudes professionnelles, les travailleurs les moins anciens, l'ancienneté étant majorée d'un an pour le travailleur marié et d'un an pour chaque enfant à charge aux termes de l'article 7 du présent Code.\n\nLe travailleur ainsi licencié conserve pendant un an la priorité d'embauche dans la même catégorie d'emploi. Passé ce délai, il continue à bénéficier de la même priorité pendant une seconde année, mais son embauche peut être subordonnée à un essai professionnel ou à un stage probatoire dont la durée ne peut excéder celle de la période d'essai prévue par la convention collective ou à défaut de celle-ci, par les dispositions de l'article 43 du présent Code.\n\nLe travailleur bénéficiant d'une priorité d'embauche est tenu de communiquer à l'employeur tout changement d'adresse survenant après son départ de l'entreprise. En cas de vacance, l'employeur avise l'intéressé par lettre recommandée avec avis de réception ou par lettre au porteur avec accusé de réception, à la dernière adresse connue du travailleur. Le travailleur doit se présenter à l'entreprise ou à l'établissement dans un délai maximum de quinze jours suivant la date de réception de la lettre.\n\nL'Inspecteur du Travail s'assure avant la mise en oeuvre des licenciements du respect de la procédure prescrite et des critères retenus par l'employeur. En cas de non-respect de la procédure ou des critères fixés, l'Inspecteur du Travail le notifie par écrit à l'employeur. Celui-ci est tenu de répondre avant de procéder aux licenciements.\n\nTout licenciement économique intervenu en violation des dispositions du présent Code est considéré comme abusif. La défaillance de l'Inspecteur du Travail ou des représentants des travailleurs ne fait pas obstacle à la poursuite de la procédure."
  },
  {
    "numero": 79,
    "texte": "Lorsque le contrat prend fin pour quelque cause que ce soit, l'employeur est tenu de délivrer au travailleur un certificat attestant la nature et la durée des services prestés, la date du début et de la fin des prestations ainsi que son numéro d'immatriculation à l'Institut National de Sécurité Sociale. Aucune autre indication ne peut y être ajoutée. Ce certificat doit être remis au plus tard deux jours ouvrables après la fin du contrat. Il est exempt de droit de timbre ou d'enregistrement."
  },
  {
    "numero": 80,
    "texte": "Lorsqu'il y a substitution d'employeur, notamment par cession, succession, fusion, transformation de fonds, mise en société, tous les contrats de travail en cours au jour de la substitution subsistent entre le nouvel employeur et le personnel.\n\nSauf cas de force majeure, la cessation de l'activité de l'entreprise ou de l'établissement ne dispense pas l'employeur de respecter les règles prévues en matière de résiliation des contrats. La faillite et la liquidation judiciaire ne sont pas considérées comme des cas de force majeure."
  },
  {
    "numero": 81,
    "texte": "Est nulle la clause stipulant que le travailleur s'oblige à passer en cours de contrat au service d'un autre employeur.\n\nCette clause est néanmoins valable si elle désigne l'employeur ou les employeurs au service desquels le travailleur pourra être transféré ou si le transfert est prévu en faveur de personnes auxquelles le premier employeur céderait, en tout ou en partie, l'entreprise dans laquelle le travailleur prestait ses services.\n\nDans le cas de transfert, le nouvel employeur est subrogé au précédent employeur."
  },
  {
    "numero": 82,
    "texte": "Le sous-entrepreneur est la personne physique ou morale qui passe avec un entrepreneur un contrat écrit ou verbal pour l'exécution d'un certain travail ou la fourniture de certains services moyennant un prix forfaitaire. Il engage lui-même la main-d'œuvre nécessaire."
  },
  {
    "numero": 83,
    "texte": "Quand les travaux sont exécutés dans un lieu autre que les ateliers, magasins ou chantiers de l'entrepreneur, ce dernier est, en cas d'insolvabilité du sous-entrepreneur, responsable du paiement des salaires dus aux travailleurs.\n\nLe travailleur lésé aura, dans ces cas, une action directe contre l'entrepreneur."
  },
  {
    "numero": 84,
    "texte": "Le sous-entrepreneur est tenu d'indiquer sa qualité, le nom et l'adresse de l'entrepreneur, par voie d'affiche apposée de façon permanente dans chacun des ateliers, magasins ou chantiers utilisés.\n\nL'entrepreneur doit tenir à jour la liste des sous-entrepreneurs avec lesquels il a passé contrat."
  },
  {
    "numero": 85,
    "texte": "Un arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail, fixe en tant que de besoin, les modalités d'application du présent Titre."
  },
  {
    "numero": 86,
    "texte": "À conditions égales de travail, de qualification professionnelle et de rendement, le salaire est égal pour tous les travailleurs, quels que soient leur origine, leur sexe et leur âge.\n\nLa rémunération d'un travail à la tâche ou aux pièces doit être calculée de telle sorte qu'elle procure au travailleur, de capacité moyenne et travaillant normalement, un salaire au moins égal à celui du travailleur rémunéré au temps et effectuant un travail analogue.\n\nAucun salaire n'est dû en cas d'absence, en dehors des cas prévus par la législation ou la réglementation et sauf accord entre parties intéressées."
  },
  {
    "numero": 87,
    "texte": "Un décret du Président de la République, pris sur proposition du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, après avis du Conseil National du Travail, fixe les salaires minima interprofessionnels garantis ainsi que les taux des allocations familiales minima, et à défaut de conventions collectives ou dans leur silence, les salaires minima par catégorie professionnelle."
  },
  {
    "numero": 88,
    "texte": "La rémunération est fixée par des contrats individuels conclus librement entre travailleurs et employeurs ou par voie de conventions collectives. Est nulle de plein droit toute clause de contrat individuel ou de convention collective fixant des rémunérations inférieures aux salaires minima interprofessionnels garantis déterminés conformément à l'article 87 du présent Code."
  },
  {
    "numero": 89,
    "texte": "La rémunération doit être stipulée en monnaie ayant cours légal en République Démocratique du Congo. Son montant est déterminé soit à l'heure, soit à la journée, soit à la semaine ou au mois, soit à la pièce, soit à la tâche."
  },
  {
    "numero": 90,
    "texte": "L'employeur est tenu d'appliquer une classification contenant tous les emplois d'exécution, de maîtrise jusqu'au cadre de collaboration. Par emploi de cadre de collaboration, il faut entendre celui exercé par le travailleur n'ayant pas le pouvoir de prendre à titre autonome des décisions de nature à influencer considérablement la marche de l'entreprise."
  },
  {
    "numero": 91,
    "texte": "Il est institué en République Démocratique du Congo une zone unique du salaire minimum interprofessionnel garanti. Sans préjudice des dispositions de l'alinéa précédent, un décret du Président de la République pris sur proposition du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, après avis du Conseil National du Travail, fixe, s'il y a lieu, des dispositions spécifiques pouvant alléger les difficultés des secteurs agroindustriel et pastoral."
  },
  {
    "numero": 92,
    "texte": "À défaut de preuve d'une rémunération convenue, l'employeur doit la rémunération déterminée par les conventions collectives ou, à défaut, ou dans leur silence, par le décret prévu à l'article 87 du présent Code, ou par les usages du lieu où le contrat doit être exécuté, compte tenu notamment de la nature du travail, de la qualification professionnelle et de l'ancienneté du travailleur dans l'entreprise."
  },
  {
    "numero": 93,
    "texte": "La rémunération est due pour le temps où le travailleur a effectivement fourni ses services ; elle est également due lorsque le travailleur a été mis dans l'impossibilité de travailler du fait de l'employeur ainsi que pour les jours fériés légaux, hormis le cas de lock-out déclenché conformément aux dispositions légales. Le droit aux commissions sur ventes est acquis dès l'instant où les commandes sont exécutées par l'employeur."
  },
  {
    "numero": 94,
    "texte": "Les salaires minima interprofessionnels seront fixés compte tenu d'une tension salariale selon une échelle barémique unique dont les conditions et les modalités de fixation et d'application seront déterminées par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail."
  },
  {
    "numero": 95,
    "texte": "Le salaire minimum interprofessionnel de la première catégorie professionnelle est fixé en fonction des besoins essentiels d'une famille du travailleur comprenant le père, la mère et les enfants à charge dont le nombre est déterminé par le décret prévu à l'article 96 ci-dessous.\n\nLes besoins familiaux essentiels et les articles pris en considération pour calculer ce salaire minimum interprofessionnel de la première catégorie sont déterminés après enquêtes menées périodiquement dans chaque province et dans la ville de Kinshasa selon les modalités fixées par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions."
  },
  {
    "numero": 96,
    "texte": "Un décret du Président de la République, pris sur proposition du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, après avis du Conseil National du Travail, détermine les modalités de fixation du salaire minimum interprofessionnel garanti, des allocations familiales et de la contre-valeur du logement."
  },
  {
    "numero": 97,
    "texte": "Les salaires minima interprofessionnels sont ajustés en fonction de l'évolution de l'indice des prix à la consommation.\n\nLe décret prévu à l'article 96 ci-dessus en déterminera les modalités."
  },
  {
    "numero": 98,
    "texte": "La rémunération doit être payée en espèces, sous déduction éventuelle de la contre-valeur des avantages dus et remis en nature.\n\nLe paiement doit avoir lieu pendant les heures de travail, au temps et au lieu convenus.\n\nLe paiement de la rémunération ne peut avoir lieu dans un débit de boissons ni dans un magasin de vente, sauf pour les travailleurs employés dans ces établissements.\n\nIl est interdit à l'employeur de restreindre de quelque manière que ce soit la liberté du travailleur de disposer de sa rémunération à son gré."
  },
  {
    "numero": 99,
    "texte": "Le paiement de la rémunération doit être effectué à des intervalles réguliers n'excédant pas un mois.\n\nLe paiement doit avoir lieu au plus tard dans les six jours suivant la période à laquelle il se rapporte.\n\nLes commissions acquises au cours d'un trimestre peuvent être payées dans les trois mois suivant la fin du trimestre.\n\nLes participations aux bénéfices réalisés durant un exercice doivent être payées dans les neuf mois qui suivent cet exercice."
  },
  {
    "numero": 100,
    "texte": "Toute somme restant due en exécution d'un contrat de travail, lors de la cessation définitive des services effectifs, doit être payée au travailleur, et, le cas échéant, aux ayants-droit de ce dernier, au plus tard dans les deux jours ouvrables qui suivent la date de la cessation des services."
  },
  {
    "numero": 101,
    "texte": "Sous réserve des dispositions des articles 138 et 139 du présent Code, le paiement de tout ou partie de la rémunération en nature est interdit."
  },
  {
    "numero": 102,
    "texte": "L'employeur remet valablement au mineur la rémunération de son travail. Toutefois, la personne qui exerce sur le mineur l'autorité parentale ou tutélaire peut s'opposer à la remise au mineur de la rémunération de son travail.\n\nLe tribunal compétent peut lever cette opposition si les circonstances ou l'équité le justifient."
  },
  {
    "numero": 103,
    "texte": "L'employeur est tenu de remettre au travailleur au moment du paiement et selon les modalités fixées par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, un décompte écrit de la rémunération payée.\n\nFaute par l'employeur d'avoir rempli cette obligation, ses allégations concernant le décompte des paiements effectués sont rejetées à moins qu'il ne prouve qu'il ne lui a pas été possible de remettre le décompte par la faute du travailleur ou qu'il n'y ait preuve écrite, commencement de preuve par écrit ou aveu du travailleur."
  },
  {
    "numero": 104,
    "texte": "L'acceptation sans protestation ni réserve, par le travailleur, d'un décompte de la rémunération payée, l'apposition de sa signature ainsi que la mention pour solde de tout compte sur le décompte de la rémunération, ou de toute mention équivalente souscrite par lui, ne peut valoir renonciation de sa part à tout ou partie des droits qu'il tient des dispositions légales, réglementaires ou contractuelles.\n\nElle ne peut valoir non plus compte arrêté et réglé au sens de l'article 317 du présent Code."
  },
  {
    "numero": 105,
    "texte": "Lorsque le travailleur est dans l'incapacité de fournir ses services par suite de maladie ou d'accident, il conserve le droit, pendant toute la durée de la suspension du contrat, aux deux tiers de la rémunération en espèces et à la totalité des allocations familiales.\n\nLe droit aux avantages contractuels en nature subsiste pendant l'incapacité de travail, à moins que le travailleur n'en demande la contre-valeur en espèces. Le logement ne peut, toutefois, être remplacé par sa contre-valeur.\n\nLe calcul de la rémunération pendant ce temps est effectué dans les conditions fixées à l'article 66."
  },
  {
    "numero": 106,
    "texte": "Si la maladie ou l'accident sont réputés maladie professionnelle ou accident du travail aux termes de la réglementation de la sécurité sociale, le travailleur conserve le droit pendant les six premiers mois de la suspension du contrat aux deux tiers de la rémunération en espèce et à la totalité des allocations familiales. L'employeur est autorisé à déduire mensuellement les sommes versées au travailleur par l'Institut National de Sécurité Sociale, en introduisant les pièces justificatives qui doivent être acceptées après vérification par cet Institut. Pendant la même période, le droit aux avantages en nature subsiste à moins que le travailleur n'en demande la contre-valeur en espèce. Le logement ne peut, toutefois, être remplacé par sa contre-valeur."
  },
  {
    "numero": 107,
    "texte": "Aucune somme ni avantage n'est dû s'il est établi que la maladie ou l'accident ou l'aggravation d'une maladie ou d'un accident antérieur résulte d'un risque spécial auquel le travailleur s'est volontairement exposé en ayant conscience du danger encouru, ou si le travailleur, sans motif valable, néglige d'utiliser les services médicaux ou de réadaptation qui sont à sa disposition, ou n'observe pas les règles prescrites pour la vérification de l'existence du dommage ou pour la conduite des bénéficiaires de prestations."
  },
  {
    "numero": 108,
    "texte": "Il y a risque spécial, au sens de l'article 107, lorsque la maladie ou l'accident, ou l'aggravation d'une maladie ou d'un accident antérieur résulte :\n1) d'une maladie ou d'un accident provoqué par une infraction commise par le travailleur et ayant entraîné sa condamnation définitive ;\n2) d'un accident survenu à l'occasion de la pratique d'un sport dangereux, d'un exercice violent pratiqué au cours ou en vue d'une compétition ou d'une exhibition, sauf lorsque ceux-ci sont organisés par l'employeur ;\n3) d'une maladie ou d'un accident survenu à la suite d'excès de boisson ou de drogue ;\n4) d'une maladie ou d'un accident provoqué par la faute intentionnelle de l'intéressé ;\n5) d'une maladie ou d'un accident survenu à la suite de travaux effectués pour compte d'un tiers ;\n6) des faits de guerre, de troubles ou d'émeutes, sauf si la maladie ou l'accident, conformément à la définition qui en est donnée par la réglementation sur la sécurité sociale, survient par le fait ou à l'occasion du travail."
  },
  {
    "numero": 109,
    "texte": "Les sommes dues aux employeurs ne peuvent être frappées de saisie-arrêt ni d'opposition au préjudice des travailleurs auxquels les salaires sont dus."
  },
  {
    "numero": 110,
    "texte": "En cas de faillite ou de liquidation judiciaire d'une entreprise ou d'un établissement, les travailleurs ont rang de créanciers privilégiés sur tous les autres créanciers y compris le Trésor Public, nonobstant toute disposition contraire à la législation antérieure, pour les salaires qui leur sont dus au titre des services fournis antérieurement à la faillite ou à la liquidation.\n\nCe privilège s'exerce sur les biens meubles et immeubles de l'employeur.\n\nLes salaires doivent être payés intégralement, avant que les autres créanciers ne revendiquent leur quote-part, aussitôt que les fonds nécessaires se trouvent réunis."
  },
  {
    "numero": 111,
    "texte": "Est nulle toute stipulation attribuant à l'employeur le droit d'infliger des amendes."
  },
  {
    "numero": 112,
    "texte": "Est nulle de plein droit, toute stipulation attribuant à l'employeur le droit d'infliger des réductions de rémunérations à titre de dommages-intérêts. Toutefois, les retenues ci-après sont autorisées :\na) retenues fiscales : taxe professionnelle ;\nb) cotisation due à l'Institut National de Sécurité Sociale ;\nc) retenues à titre d'avances ;\nd) retenues à titre d'indemnités compensatoires en cas de violation par le travailleur de l'obligation qui lui est faite par l'article 52 ;\ne) retenues en vue de constituer un cautionnement pour garantir l'exécution par le travailleur de l'obligation prévue à l'article 52.\n\nLes retenues faites en vertu de ce litera e) sont, avec mention de leur affectation, placées en dépôt au nom du travailleur et portent intérêt à son profit. Le dépôt est fait dans le délai d'un mois à dater de la retenue, dans une banque ou un établissement agréé par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions.\n\nL'employeur est tenu de communiquer au travailleur le numéro du compte et le nom de l'établissement où il a été effectué.\n\nPar le seul fait du dépôt, l'employeur acquiert privilège sur le cautionnement pour toute créance résultant de l'inexécution totale ou partielle de l'obligation du travailleur prévue à l'article 52.\n\nDans le cas où il n'y a pas cautionnement, les retenues prévues au litera d) du présent article ne peuvent être effectuées que dans les limites prévues à l'article 114 ci-dessous ;\nf) retenues à titre de prêt ;\ng) saisie-arrêt."
  },
  {
    "numero": 113,
    "texte": "Le montant du cautionnement ne peut être restitué au travailleur ou versé à l'employeur que de leur commun accord ou sur la production d'un extrait de la décision judiciaire coulée en force de chose jugée ou rendue exécutoire nonobstant opposition ou appel.\n\nL'employeur doit donner son accord à la libération du cautionnement dans les trente jours qui suivent la fin du contrat, à moins d'avoir, avant l'expiration de ce délai, introduit une demande en justice pour exercer un privilège sur ledit cautionnement. Toutefois, le Président du tribunal compétent peut, sur requête motivée de l'employeur autoriser le maintien du cautionnement au-delà de ce délai, en déterminant la somme à concurrence de laquelle il est maintenu.\n\nCette autorisation ne sort ses effets qu'à la condition d'être suivie d'une demande en justice dans le délai fixé par l'ordonnance qui l'accorde."
  },
  {
    "numero": 114,
    "texte": "La rémunération du travailleur n'est cessible et saisissable qu'à concurrence d'un cinquième sur la partie n'excédant pas cinq fois le salaire mensuel minimum interprofessionnel de sa catégorie et d'un tiers sur le surplus.\n\nElle est cessible et saisissable à concurrence de deux cinquièmes lorsque la créance est fondée sur une obligation alimentaire légale.\n\nLa saisie et la cession autorisées pour toute créance et celles autorisées pour cause d'obligation alimentaire légale peuvent s'opérer cumulativement.\n\nLe calcul des quotités cessibles et saisissables se fait après déduction des retenues fiscales et sociales et de l'évaluation forfaitaire du logement, tel que défini à l'article 139 du présent Code."
  },
  {
    "numero": 115,
    "texte": "Est considéré comme économat, toute organisation où l'employeur pratique, directement ou indirectement, la vente ou la cession de denrées alimentaires et marchandises de première nécessité, aux travailleurs exclusivement, pour leurs besoins personnels et normaux."
  },
  {
    "numero": 116,
    "texte": "Les économats sont admis sous la triple condition que :\na) les travailleurs ne soient pas obligés de s'y fournir ;\nb) la vente des marchandises y soit faite à des prix raisonnables établis par l'employeur, après avis de la délégation syndicale, en fonction de l'intérêt des travailleurs et à l'exclusion de toute recherche de bénéfice ;\nc) la comptabilité de l'économat soit entièrement autonome."
  },
  {
    "numero": 117,
    "texte": "Les prix des denrées et marchandises mises en vente doivent être affichés lisiblement et communiqués à l'Inspecteur du Travail du ressort.\n\nLa vente et la consommation des alcools, des spiritueux, des tabacs et de toute forme de drogue sont interdites dans les économats ainsi que sur les lieux d'emploi des travailleurs."
  },
  {
    "numero": 118,
    "texte": "L'ouverture d'un économat est subordonnée à l'autorisation du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions ou de son représentant local, délivrée après avis de l'Inspecteur du Travail du ressort.\n\nCette ouverture peut être prescrite dans toute entreprise par le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions ou son représentant local, sur proposition de l'Inspecteur du Travail du ressort.\n\nEn cas d'abus constaté, le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions ou son représentant local peut, dans les mêmes conditions, ordonner la fermeture provisoire ou définitive de l'économat."
  },
  {
    "numero": 119,
    "texte": "Dans tous les établissements publics ou privés, même d’enseignement ou de bienfaisance, la durée légale du travail des employés ou ouvriers de l’un ou de l’autre sexe, quelle que soit la forme dans laquelle est exécuté le travail, ne peut excéder quarante-cinq heures par semaine et huit heures par jour.\n\nElle se calcule à partir du moment où le travailleur se tient sur les lieux du travail à la disposition de l’employeur jusqu’au moment où les prestations cessent, conformément aux horaires arrêtés par l’employeur et reproduits au règlement d’entreprise.\n\nElle ne comprend pas le temps nécessaire au travailleur pour se rendre au lieu du travail ou pour en revenir, sauf si ce temps est inhérent au travail.\n\nLes heures effectuées au-delà de la durée légale du travail sont considérées comme heures supplémentaires et donnent droit à une majoration de salaire."
  },
  {
    "numero": 120,
    "texte": "Des arrêtés du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail, déterminent par branche d'activité économique et par catégorie professionnelle, s'il y a lieu :\na) les modalités d’application de l’article précédent ;\nb) les nombres d'heures supplémentaires qui peuvent être autorisées au delà de la durée légale du travail ;\nc) les dérogations temporaires ou permanentes qui peuvent être admises pour certaines catégories de travailleurs, pour certaines catégories de travaux et les conditions d'utilisation de ces dérogations ;\nd) les réductions des limites maxima fixées à l'article 119 ci-dessus ;\ne) les modalités de rémunération des heures supplémentaires."
  },
  {
    "numero": 121,
    "texte": "Tout travailleur jouit, au cours de chaque période de sept jours, d’un repos comprenant au minimum vingt-quatre heures.\n\nCe repos est accordé autant que possible en même temps à tout le personnel. Il a lieu le dimanche. Toutefois, les conventions collectives peuvent prévoir les conditions particulières favorables.\n\nLe Ministre ayant le travail et la prévoyance sociale dans ses attributions détermine par arrêté, pris après avis du Conseil National du Travail, les modalités d’application des alinéas précédents, notamment en ce qui concerne les professions pour lesquelles et les conditions dans lesquelles le repos peut, exceptionnellement, et pour des motifs nettement établis, être donné par roulement ou collectivement un autre jour que le dimanche."
  },
  {
    "numero": 122,
    "texte": "Lorsque le repos hebdomadaire est donné collectivement à l'ensemble du personnel, l'employeur doit afficher à l'avance, aux endroits réservés aux communications au personnel, les jours et heures de repos collectif.\n\nLorsque le repos n'est pas donné collectivement à l'ensemble du personnel, l'employeur doit afficher, à l'avance, aux endroits réservés à cet effet, les noms des travailleurs soumis au régime particulier et l'indication de ce régime."
  },
  {
    "numero": 123,
    "texte": "Le Président de la République fixe, par décret, pris sur proposition du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, après avis du Conseil National du Travail, la liste des jours fériés légaux.\n\nLe Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions détermine par arrêté, pris après avis du Conseil National du Travail, le régime des jours fériés légaux."
  },
  {
    "numero": 124,
    "texte": "Le travail de nuit est celui exécuté entre 19 heures et 5 heures.\n\nIl doit être payé avec majoration, sans préjudice des dispositions relatives au paiement des heures supplémentaires.\n\nLes modalités d'application du présent article sont déterminées par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail."
  },
  {
    "numero": 125,
    "texte": "Les femmes, les enfants de moins de 18 ans et les personnes avec handicap ne peuvent pas travailler la nuit dans les établissements industriels publics ou privés.\n\nLe terme nuit visé à l'alinéa précédent signifie la période allant de 19 heures à 17 heures."
  },
  {
    "numero": 126,
    "texte": "Le repos journalier des enfants et des personnes avec handicap entre deux périodes de travail doit avoir une durée de douze heures consécutives au minimum."
  },
  {
    "numero": 127,
    "texte": "Les dérogations qui peuvent être accordées aux dispositions des articles 125 et 126 ci-dessus, compte tenu des circonstances exceptionnelles, du caractère particulier de la profession ou pour les besoins de l'apprentissage ou de la formation et du perfectionnement professionnel, sont déterminées par les arrêtés prévus aux articles 38 et 128 du présent Code, relatifs aux conditions de travail des enfants et des personnes avec handicap.\n\nLes dérogations prévues à l'alinéa précédent ne s'appliquent pas aux entreprises où sont seuls employés les membres d'une même famille."
  },
  {
    "numero": 128,
    "texte": "Des arrêtés du Ministre du Travail et de la Prévoyance Sociale, pris après avis du Conseil National du Travail, fixent les conditions de travail des femmes, des enfants et des personnes avec handicap et définissent notamment la nature des travaux qui leur sont interdits.\n\nLa maternité ne peut constituer une source de discrimination en matière d'emploi. Il est en particulier, interdit d'exiger d'une femme qui postule un emploi qu'elle se soumette à un test de grossesse ou qu'elle présente un certificat attestant ou non l'état de grossesse, sauf pour les travaux qui sont interdits totalement ou partiellement aux femmes enceintes ou qui allaitent ou comportent un risque reconnu ou significatif pour la santé de la femme et de l'enfant."
  },
  {
    "numero": 129,
    "texte": "Toute femme enceinte dont l'état a été constaté médicalement, peut résilier son contrat de travail sans préavis et sans avoir, de ce fait, à payer une indemnité de rupture de contrat.\n\nLa même faculté lui est accordée pendant une période de huit semaines qui suivent l'accouchement."
  },
  {
    "numero": 130,
    "texte": "A l'occasion de son accouchement, et sans que cette interruption de service puisse être considérée comme une cause de résiliation de contrat, toute femme a le droit de suspendre son travail pendant quatorze semaines consécutives, dont huit semaines maximum postérieures à la délivrance et six avant l'accouchement.\n\nPendant cette période, que l'enfant vive ou non, la femme salariée a droit aux deux tiers de sa rémunération ainsi qu'au maintien des avantages contractuels en nature.\n\nDurant la même période, l'employeur ne peut rompre le contrat de travail.\n\nLe bénéfice des dispositions de l'article 129 du présent Code est acquis à toute femme salariée, en tant que ces dispositions lui sont applicables, qu'elle soit mariée ou non, que l'enfant vive ou non."
  },
  {
    "numero": 131,
    "texte": "Toute convention contraire aux dispositions des articles 129 et 130 ci-dessus est nulle de plein droit."
  },
  {
    "numero": 132,
    "texte": "Lorsque la femme allaite son enfant, elle a droit, dans tous les cas à deux repos d'une demi-heure par jour pour lui permettre l'allaitement. Ces périodes de repos sont rémunérées comme temps de travail."
  },
  {
    "numero": 133,
    "texte": "Les enfants ne peuvent être employés dans une entreprise même comme apprentis, avant l'âge de 15 ans sauf dérogation expresse de l'Inspecteur du Travail du ressort et de l'autorité parentale ou tutélaire.\n\nEn aucun cas, l'autorisation expresse de l'Inspecteur du Travail du ressort et de l'autorité parentale ou tutélaire ne doit être accordée en dessous de 15 ans."
  },
  {
    "numero": 134,
    "texte": "Est considéré comme travailleur avec handicap toute personne dont les perspectives de trouver et de conserver un emploi convenable ainsi que de progresser professionnellement sont sensiblement réduites à la suite d'un handicap physique ou mental dûment reconnu."
  },
  {
    "numero": 135,
    "texte": "Le handicap ne saurait constituer un empêchement pour l'accès d'une personne à l'exercice d'un emploi répondant à ses aptitudes intellectuelles, sensorielles ou physiques dans le secteur public, semi-public ou privé pour autant que son handicap ne soit pas de nature à causer un préjudice ou à gêner le fonctionnement de l'entreprise."
  },
  {
    "numero": 136,
    "texte": "Les personnes avec handicap ont le droit de bénéficier, dans les mêmes conditions que les autres travailleurs, d'une formation professionnelle."
  },
  {
    "numero": 137,
    "texte": "L'Inspecteur du Travail peut requérir l'examen des enfants, des femmes et des personnes avec handicap par un médecin en vue de vérifier si le travail dont ils sont chargés n'excède pas leurs forces. Cette réquisition est de droit à la demande des intéressés.\n\nL'enfant, la femme ou la personne avec handicap ne peut être maintenu dans un emploi ainsi reconnu au dessus de ses forces et doit être affecté à un emploi convenable. Si cela est impossible, le contrat doit être résilié à l'initiative de l'employeur avec paiement de l'indemnité de préavis."
  },
  {
    "numero": 138,
    "texte": "En cas de mutation ou d'engagement en dehors du lieu d'emploi, l'employeur est tenu de fournir un logement décent au travailleur et à sa famille ou, à défaut, une indemnité conséquente.\n\nDans les autres cas, l'employeur est tenu de payer au travailleur une indemnité de logement fixée par les parties, soit dans le contrat de travail, soit dans les conventions collectives, soit dans le règlement d'entreprise.\n\nLa travailleuse a droit au logement ou à l'indemnité de logement.\n\nDans le cas où le travailleur ne peut par ses propres moyens obtenir pour lui et sa famille un ravitaillement régulier en denrées alimentaires de première nécessité, l'employeur est tenu de le lui assurer."
  },
  {
    "numero": 139,
    "texte": "Un arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail, fixe :\na) les cas dans lesquels le logement doit être fourni, sa valeur maximale de remboursement, et les conditions auxquelles il doit répondre, notamment au regard de l'hygiène et pour assurer la protection des femmes et jeunes filles qui ne vivent pas en famille ;\nb) les régions et les catégories de travailleurs pour lesquelles est obligatoire la fourniture d'une ration journalière de vivres, la valeur maximum de remboursement de celle-ci, le détail en nature et en poids des denrées alimentaires de première nécessité la composant et les conditions de sa fourniture."
  },
  {
    "numero": 140,
    "texte": "L'employeur est tenu d'accorder un congé annuel au travailleur.\n\nLe travailleur ne peut renoncer à ce congé.\n\nLe droit au congé naît à l'expiration d'une année de services comptée de date à date et accomplie chez le même employeur ou un employeur substitué.\n\nLa date du congé est fixée de . commun accord, sans toutefois que la prise effective du congé puisse dépasser de six mois la date prévue pour son ouverture.\n\nLe travailleur ne peut éventuellement cumuler que la moitié des congés pendant une période de deux ans.\n\nPendant la période de congé, le travailleur et sa famille ont droit aux soins de santé. En cas de congé hors de la République Démocratique du Congo ou du lieu d'emploi, l'employeur, après avis du médecin conseil, rembourse, tout ou partie des frais afférents aux soins qu'il a reçus."
  },
  {
    "numero": 141,
    "texte": "La durée du congé est d'au moins un jour ouvrable par mois entier de service pour le travailleur âgé de plus de dix-huit ans. Elle est d'au moins un jour ouvrable et demi par mois entier de service pour le travailleur âgé de moins de dix-huit ans. Elle augmente d'un jour ouvrable par tranche de cinq années d'ancienneté chez le même employeur ou l'employeur substitué.\n\nLes services pris en considération pour le calcul de la durée du congé comprennent les jours de prestation de travail, de repos hebdomadaire, de congé payé et les jours fériés légaux, ainsi que les périodes de suspension due à l'incapacité de travail à concurrence d'un maximum de six mois par année de service considérée séparément, sans que cette limitation soit applicable à l'incapacité résultant d'un accident de travail ou d'une maladie professionnelle.\n\nLa durée du voyage n'est pas comprise dans le congé.\n\nLes jours de maladie compris dans la période de congé ne comptent pas comme jours de congé."
  },
  {
    "numero": 142,
    "texte": "Pendant toute la durée du congé, le travailleur a droit à une allocation égale à la rémunération dont il jouit au moment du départ en congé, les avantages éventuellement remis en nature pendant les services effectifs en vertu des stipulations contractuelles étant, à la demande du travailleur, payés en espèces sur base légale, exception faite seulement pour le logement.\n\nLes montants éventuels des commissions, primes, sommes versées pour prestations supplémentaires et participation au bénéfice entrent en ligne de compte pour la détermination de l'allocation de congé, et sont calculées sur la moyenne des avantages payés pour les douze mois précédant le congé.\n\nLes allocations familiales sont dues pendant toute la durée du congé."
  },
  {
    "numero": 143,
    "texte": "Le travailleur doit s'abstenir d'exercer une profession lucrative pendant la durée du congé."
  },
  {
    "numero": 144,
    "texte": "En cas de résiliation du contrat, quel que soit le moment où celle-ci intervient, le congé est remplacé par une indemnité compensatoire calculée conformément à l'article 142 ci-dessus.\n\nEn dehors de ce cas, est nulle et de nul effet toute convention prévoyant l'octroi d'une indemnité compensatoire en lieu et place de congé."
  },
  {
    "numero": 145,
    "texte": "Le paiement de l'allocation de congé doit être effectué au moment du départ effectif en congé et au plus tard le dernier jour ouvrable avant le départ en congé.\n\nLe paiement de l'indemnité compensatoire doit être effectué dans les deux jours ouvrables qui suivent la fin du contrat."
  },
  {
    "numero": 146,
    "texte": "Le travailleur a droit aux congés de circonstance suivants\n1) mariage du travailleur : 2 jours ouvrables ;\n2) accouchement de l'épouse : 2 jours ouvrables ;\n3) décès du conjoint, ou d'un parent allié au 1er degré : 4 jours ouvrables\n4) mariage d'un enfant : jour ouvrable ;\n5) décès d'un parent ou allié au second degré : 2 jours ouvrables;\n\nCes jours ne sont pas déductibles du congé minimum légal.\n\nLes congés de circonstance ne peuvent être fractionnés.\n\nLes soins de santé sont dus pendant les congés de circonstance.\n\nL'employeur n'est tenu au paiement des congés de circonstance que jusqu'à concurrence de quinze jours ouvrables par an."
  },
  {
    "numero": 147,
    "texte": "Le voyage aller est le parcours, lors de l'engagement, du réengagement ou i l'occasion du commencement d'une période de services, de la distance qui sépare le lieu d'acceptation de l'engagement ou de la promesse d'engagement au lieu où le travail doit s'exécuter.\n\nLe voyage retour est le parcours, à l'expiration du contrat ou d'une période de services, de la distance du lieu d'exécution du travail au lieu de l'acceptation de l'engagement ou de la promesse d'engagement.\n\nLes voyages s'effectuent à la date, aux conditions et suivant les voies horaires et moyens fixés contractuellement sous réserve des dispositions du présent chapitre."
  },
  {
    "numero": 148,
    "texte": "L'employeur supporte les frais de voyage aller du travailleur et de sa famille. Toutefois, cette obligation ne naît, à l'égard de la famille, qu'après la période d'essai. Par ailleurs, lorsqu'une suspension de contrat intervient avant le voyage, elle entraîne la suspension de ladite obligation.\n\nL'employeur est dispensé de payer les frais de voyage des personnes au sujet desquelles le travailleur a fait de fausses déclarations. Lorsqu'il a payé des frais indus, il peut les compenser par des retenues, conformément aux dispositions de l'article 114 du présent Code."
  },
  {
    "numero": 149,
    "texte": "En règle générale, le droit au voyage retour du travailleur et de sa famille naît, sans restriction, après chaque période de deux ans de service, comptée de date à date.\n\nCe droit est également acquis :\na) au travailleur, au cours de la période d'essai, même lorsque le contrat est résilié pour faute lourde imputable au travailleur ;\nb) au travailleur et à sa famille, avant l'expiration de la deuxième année de service, lorsque le contrat prend fin du fait de l'employeur ;\nc) au travailleur et à sa famille, à l'expiration de tout contrat conclu pour une durée inférieure à deux années ;\nd) à la famille du travailleur, lorsque ce dernier décède avant la fin du contrat.\n\nL'employeur ne supporte les frais de voyage de retour que proportionnellement à la durée des prestations accomplies :\n1) lorsque le contrat a été résilié pour faute lourde imputable au travailleur ;\n2) lorsque le travailleur a mis fin au contrat à durée indéterminée après avoir effectué douze mois de services depuis son dernier voyage aller et sans qu'il y ait faute lourde de l'employeur ;\n3) lorsque les parties résilient le contrat de commun accord après douze mois de services.\n\nL'employeur ne doit les frais de voyage retour que si ce voyage est réellement effectué."
  },
  {
    "numero": 150,
    "texte": "Il n'est pas tenu compte de la limite d'âge des enfants, lorsqu'ils l'atteignent au cours du terme de services."
  },
  {
    "numero": 151,
    "texte": "Le droit au voyage retour expire :\na) si le travailleur y renonce explicitement et par écrit, après l'expiration du contrat ;\nb) si le travailleur n'en a pas exigé l'accomplissement dans les deux ans après l'ouverture du droit ou à partir du jour où le contrat prend fin.\n\nL'employeur doit, pour être dispensé de payer les frais de voyage retour, faire constater par l'Inspecteur du Travail du ressort :\n1) dans le cas prévu au litera a) du présent article, que la renonciation du travailleur est réelle et que ce dernier a été établi à demeurer sur le lieu de travail ou auprès de ce lieu, à sa demande ou avec son consentement ;\n2) dans le cas prévu au litera b), que le travailleur s'est abstenu de son plein gré d'utiliser le droit au voyage retour"
  },
  {
    "numero": 152,
    "texte": "L'employeur assurera le voyage retour dans les délais les plus brefs à dater de la fin des services.\n\nEn outre, il est tenu de payer au travailleur une indemnité égale à la rémunération mensuelle jusqu'au moment du départ effectif sauf si le départ est retardé :\n1) par la négligence du travailleur ;\n2) par le refus du travailleur de se conformer aux instructions de l'employeur ;\n3) par la force majeure ;\n\nLorsque l'employeur ne remplit pas ses obligations relatives au voyage retour, l'Inspecteur du Travail du ressort le somme de s'exécuter dans un délai de six jours. Passé ce délai, l'autorité susmentionnée, agissant en lieu et place du travailleur, saisit obligatoirement le tribunal du travail sans préjudice des pénalités prévues au Titre XV du présent Code."
  },
  {
    "numero": 153,
    "texte": "Dans tout contrat conclu pour un an au plus avec un travailleur séjournant à l'étranger, l'employeur peut au moment de l'engagement stipuler qu'il ne supporte pas les frais de voyage aller et retour de la famille."
  },
  {
    "numero": 154,
    "texte": "Pendant la durée du voyage, mais seulement dans la limite nécessaire pour effectuer ledit voyage dans les conditions prévues à l'article 155 alinéa 1 ci-après, le travailleur a droit, à la charge de l'employeur, à une indemnité égale à la rémunération qu'il aurait perçue s'il avait continué à travailler."
  },
  {
    "numero": 155,
    "texte": "Les voyages et transports sont effectués par les moyens normaux laissés au choix de l'employeur.\n\nLe travailleur qui use d'une voie ou de moyens de transport plus coûteux que ceux choisis par l'employeur n'est défrayé qu'à concurrence des frais occasionnés par la voie ou les moyens régulièrement choisis par l'employeur, sauf prescription médicale contraire.\n\nS'il use d'une voie ou de moyens de transport plus économiques, il ne peut prétendre qu'au remboursement des frais effectivement engagés.\n\nLe travailleur qui utilise une voie ou des moyens de transport moins rapides que ceux régulièrement choisis par l'employeur ne peut prétendre, de ce fait, à des délais de route plus longs que ceux prévus par la voie et les moyens normaux."
  },
  {
    "numero": 156,
    "texte": "La classe de passage et le poids de bagages sont déterminés en considérant la situation du travailleur dans l'entreprise suivant les stipulations de la convention collective ou, à défaut, selon les règles fixées par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail.\n\nIl est tenu compte, dans tous les cas, des charges de famille pour le calcul du poids des bagages."
  },
  {
    "numero": 157,
    "texte": "Un règlement d'entreprise est établi par l'employeur dans tout établissement public ou privé, même d'enseignement ou de bienfaisance.\n\nSon contenu concerne essentiellement les règles relatives à l'organisation technique du travail, à la discipline, aux prescriptions concernant l'hygiène et la sécurité nécessaires à la bonne marche de l'entreprise, de l'établissement ou du service et aux modalités de paiement des rémunérations.\n\nToutes les autres clauses qui viendraient à y figurer, notamment celles prévoyant des amendes à l'encontre des travailleurs, seront considérées comme nulles de plein droit.\n\nAvant de le mettre en vigueur, le chef d'entreprise ou d'établissement doit communiquer le règlement d'entreprise ou d'établissement pour avis aux représentants des travailleurs, tels que définis au Titre XII du présent Code, et à l'Inspecteur du Travail qui peut exiger le retrait ou la modification des dispositions contraires à la législation et à la réglementation en vigueur."
  },
  {
    "numero": 158,
    "texte": "Le contenu, les modalités de communication, de dépôt et d'affichage du règlement d'entreprise sont fixés par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail."
  },
  {
    "numero": 159,
    "texte": "Les conditions de santé et de sécurité au travail sont assurées en vue :\n1) de prévenir les accidents du travail ;\n2) 2) de lutter contre les maladies professionnelles ;\n3) de créer les conditions de travail salubres ;\n4) de remédier à la fatigue professionnelle excessive ;\n5) d'adapter le travail à l'homme ;\n6) de gérer et de lutter contre les grandes endémies de santé communautaire en milieu de travail."
  },
  {
    "numero": 160,
    "texte": "Les entreprises ou établissements de toute nature ont l’obligation de s’assurer le concours des services de santé au travail."
  },
  {
    "numero": 161,
    "texte": "Les services de santé au travail sont assurés par un médecin du travail. Ils ont un rôle essentiellement préventif et ont pour mission d'assurer :\n- la surveillance médicale des travailleurs et la surveillance sanitaire des lieux de travail ;\n- les secours immédiat et soins d’urgence aux victimes d’accident ou d’indisposition."
  },
  {
    "numero": 162,
    "texte": "Un arrêté du Ministère ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil national du travail, détermine et fixe les modalités d'exécution du présent chapitre."
  },
  {
    "numero": 163,
    "texte": "Toute entreprise ou tout établissement a l'obligation d'organiser un service spécial de sécurité, d'hygiène et l'embellissement des lieux de travail."
  },
  {
    "numero": 164,
    "texte": "Le service spécial de sécurité, l'hygiène et d'embellissement des lieux le travail a pour mission d'assurer :\n\n- la surveillance technique des travailleurs et la surveillance sanitaire des lieux de travail ;\n- l'animation et la formation générale des travailleurs."
  },
  {
    "numero": 165,
    "texte": "Le Service spécial de sécurité, d'hygiène et d'embellissement des lieux de travail est assuré par un cadre dénommé chef de service de sécurité, d'hygiène et d'embellissement des lieux de travail."
  },
  {
    "numero": 166,
    "texte": "Un arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail, détermine et fixe les modalités d'exécution du présent chapitre."
  },
  {
    "numero": 167,
    "texte": "Toute entreprise ou tout établissement de quelque nature que ce soit occupant des travailleurs a l'obligation de constituer un comité de sécurité, d'hygiène et d'embellissement des lieux de travail."
  },
  {
    "numero": 168,
    "texte": "Le comité de sécurité, d'hygiène et d'embellissement des lieux de travail a pour mission :\n- de concevoir, de corriger et d'exécuter la politique de prévention des accidents du travail et des maladies professionnelles ;\n- de stimuler et de contrôler le bon fonctionnement des services de sécurité et de santé au travail."
  },
  {
    "numero": 169,
    "texte": "Un arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions pris après avis du Conseil National du Travail détermine la composition, la compétence et les règles de fonctionnement des comités de sécurité, d'hygiène et d'embellissement des lieux de travail."
  },
  {
    "numero": 170,
    "texte": "Toute entreprise ou tout établissement doit être tenu dans un constant état de propreté et présenter les conditions d'hygiène et de sécurité nécessaires à la santé du personnel."
  },
  {
    "numero": 171,
    "texte": "Les conditions d'hygiène et de sécurité sur les lieux de travail sont réglées par arrêtés du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions.\n\nCes arrêtés précisent dans quels cas et dans quelles conditions l'Inspecteur du Travail du ressort devra recourir à la procédure de mise en demeure et les modalités de recours."
  },
  {
    "numero": 172,
    "texte": "La mise en demeure doit être faite par l'Inspecteur du Travail du ressort soit par écrit rédigé sur place et remis à l'employeur, soit par lettre recommandée avec avis de réception.\n\nElle est datée et signée. Elle précise les infractions ou dangers constatés et fixe les délais dans lesquels ils devront avoir disparu. Ces délais ne pourront être inférieurs à quatre jours francs sauf en cas d'extrême urgence."
  },
  {
    "numero": 173,
    "texte": "Il est interdit de procéder à la vente, à la location, à l'exposition ou à la cession à tout autre titre de machines dont les éléments dangereux sont dépourvus de dispositifs de protection appropriés.\n\nUn arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail fixera les modalités d'application du présent article."
  },
  {
    "numero": 174,
    "texte": "Les visites, les réceptions, les épreuves, les ré-épreuves, les contrôles et examens effectués par les organismes prévus en exécution des dispositions législatives et réglementaires relatives à l’hygiène et à la sécurité du travail ainsi que les vérifications des installations électriques dans les entreprises et établissements qui mettent en oeuvre du courant électrique doivent être obligatoirement exécutés par des personnes ou organismes agréés par le Ministre ayant le Travail et la Prévoyance sociale dans ses attributions.\n\nLorsque ces personnes ou organismes appartiennent à un service public ou placé sous le contrôle de l'Etat, l’arrêté de désignation est pris sur position du Ministre dont relève le technicien ou l'organisme désigné.\n\nToute infraction aux dispositions des arrêtés visés à l'article 171 peut être constatée immédiatement par procès-verbal.\n\nLorsque les faits relevés constituent un danger grave et imminent pour la sécurité ou la santé des travailleurs, l'Inspecteur du Travail du ressort peut à titre exceptionnel, ordonner ou faire ordonner l'arrêt de la machine ou du travail incriminé."
  },
  {
    "numero": 175,
    "texte": "Lorsqu'il existe des conditions de travail dangereuses pour la sécurité ou la santé des travailleurs et non visées par les arrêtés prévus à l'article 171 ci-dessus, l'employeur est mis en demeure par l'Inspecteur du Travail d'y remédier dans les formes et conditions prévues à l'article précédent.\n\nToutefois, dans ce cas, l'employeur peut, avant l'expiration du délai de mise en demeure, adresser une réclamation sous pli recommandé ou par porteur avec accusé de réception au Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions. Cette réclamation est suspensive.\n\nNotification de la décision du Ministre est faite à l'employeur dans la forme administrative par l'intermédiaire de l'Inspecteur du Travail du ressort endéans un mois à dater de la réception de la réclamation.\n\nLe silence du Ministre vaut acquiescement de la réclamation."
  },
  {
    "numero": 176,
    "texte": "L'employeur est tenu d'aviser l'Institut National de Sécurité Sociale ainsi que l'Inspection du Travail du ressort dans les conditions, formes et délais prévus par la législation et la réglementation de la sécurité sociale, des accidents du travail ou des maladies professionnelles dûment constatées."
  },
  {
    "numero": 177,
    "texte": "Toute entreprise ou établissement doit assurer un service médical à ses travailleurs.\n\nDes arrêtés du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail, déterminent les modalités d'application de cette obligation. Ces arrêtés fixent notamment :\na) l'effectif, la qualification et les fonctions du personnel médical à employer, compte tenu des conditions locales et du nombre des travailleurs occupés dans l'entreprise ou l'établissement ;\nb) les conditions dans lesquelles les employeurs peuvent faire assurer leur service médical, soit dans une formation médicale étrangère à l'entreprise ou à l'établissement, soit par une formation propre à l'entreprise ou l'établissement, soit par un service commun à plusieurs entreprises ;\nc) les conditions dans lesquelles les employeurs sont tenus d'installer et d'approvisionner des locaux à usage d'infirmerie ou d'hôpital ou des boîtes de secours."
  },
  {
    "numero": 178,
    "texte": "En cas de maladie, d'accident, de grossesse ou d'accouchement, et même en cas de suspension du contrat pour une cause de force majeure, l'employeur est tenu de fournir au travailleur et à sa famille, jusqu'à la fin du contrat :\n1) les soins médicaux, dentaires, chirurgicaux, les frais pharmaceutiques et d'hospitalisation ;\n2) les frais de déplacement nécessaires, lorsque le travailleur ou sa famille est dans l'incapacité physique de se déplacer ;\n3) les lunettes, appareils d'orthopédie et de prothèse, prothèse dentaire exceptée, suivant prescription médicale et tarifs établis par le Ministre ayant la Santé Publique dans ses attributions.\n\nLorsque, par le fait du contrat ou de la loi, le travailleur doit être rapatrié aux frais de l'employeur, l'obligation des soins ne s'éteint pas avant le jour où l'état de santé du travailleur permet son retour. Celui-ci est décidé par l'employeur sur avis du médecin. En cas de contestation, le travailleur peut introduire un recours devant une commission médicale dont la composition est fixée par le Gouverneur de province, suivant formes et modalités déterminées par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail.\n\nL'employeur qui, hormis le cas de faute lourde commise par le travailleur, a mis fin à un contrat à durée indéterminée en le dispensant de la prestation du préavis, est tenu de lui fournir les soins de santé jusqu'à la date à laquelle le contrat aurait normalement pris fin si les délais de préavis avaient été respectés.\n\nL'employeur est toutefois dégagé de toute obligation dès le moment où le travailleur est engagé chez un autre employeur, ou exerce une activité lucrative substantielle."
  },
  {
    "numero": 179,
    "texte": "Si la maladie ou l'accident sont réputés maladie professionnelle ou accident du travail aux termes de la réglementation de la Sécurité Sociale, les obligations de l'employeur prévues à l'article 178 sont limitées à la période non couverte par les prestations de l'Institut National de la Sécurité Sociale."
  },
  {
    "numero": 180,
    "texte": "Les soins ne sont pas à la charge de l'employeur :\n1) si la maladie ou l'accident ou l'aggravation d'une maladie ou d'un accident antérieur résulte d'un risque spécial, selon l'article 107 du présent Code ;\n2) si le bénéficiaire se soustrait sans motif valable, soit à un traitement médical, même préventif, soit à des règles d'hygiène préventives, soit à un contrôle médical proposé par l'employeur ;\n3) en cas de fausse déclaration ou de dissimulation de la part des intéressés."
  },
  {
    "numero": 181,
    "texte": "L'employeur doit prendre toutes les dispositions nécessaires pour assurer les soins prévus au présent Titre, dans les conditions fixées par les arrêtés prévus à l'article 177 du présent Code."
  },
  {
    "numero": 182,
    "texte": "En cas d'accident ou de maladie pouvant engager la responsabilité d'un Tiers, l’exercice d’une action contre le tiers ne dispense pas l’employeur d’exécuter ses obligations."
  },
  {
    "numero": 183,
    "texte": "Le tarif de remboursement des frais supportés par le travailleur et sa famille pour soins de santé à l'étranger est fixé par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, après avis du Ministre ayant la Santé Publique dans ses attributions."
  },
  {
    "numero": 184,
    "texte": "Les membres de la famille du travailleur ne bénéficient des dispositions du présent chapitre que s'ils sont à charge du travailleur, habitent effectivement avec lui et n'exercent pas de profession lucrative.\n\nSont considérés comme habitant effectivement avec le travailleur :\n- les enfants fréquentant un établissement scolaire situé en République Démocratique du Congo ;\n- les membres de la famille lorsque la séparation résulte de la nature du travail, de la force majeure, du fait de l'employeur ou de la coutume."
  },
  {
    "numero": 185,
    "texte": "L'Administration du travail est chargée sous l'autorité du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, d'assurer dans le domaine du travail, de l'emploi, de la formation et de la prévoyance sociale, un rôle de conception et de conseil, de coordination et de contrôle.\n\nElle a notamment pour mission de :\n1) élaborer tous projets de textes législatifs ou réglementaires intéressant la condition des travailleurs, les rapports professionnels, l'emploi et le placement des travailleurs, la formation et le perfectionnement professionnels et la prévoyance sociale ;\n2) conseiller, coordonner et contrôler les services ou organismes concourant à l'application de la législation et la réglementation du travail et de la prévoyance sociale ;\n3) réunir et tenir à jour les données statistiques relatives aux conditions d'emploi et de travail et aux opérations de prévoyance sociale ;\n4) suivre les relations avec les autres Etats et les Organisations Internationales en ce qui concerne les questions de travail, de l'emploi, de la promotion et de la prévoyance sociales ;\n5) veiller à l'application de la législation et de la réglementation concernant les matières énoncées à l'alinéa 1 du présent article ;\n6) éclairer de ses conseils et de ses recommandations les employeurs et les travailleurs ;\n7) réaliser, en collaboration avec les autorités et organismes intéressés, la meilleure organisation possible du marché de l'emploi comme partie intégrante du programme national tendant à assurer et à maintenir le plein emploi ainsi qu'à développer et à utiliser pleinement les ressources productives ;\n8) faire respecter par tout employeur, personne physique ou morale, de droit public ou privé, de nationalité congolaise ou étrangère, l'interdiction formelle d'avoir dans les effectifs de son personnel plus de 15% des personnes de nationalité étrangère."
  },
  {
    "numero": 186,
    "texte": "L'Administration du travail comporte :\n- des services centraux auprès du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions ;\n- des services provinciaux et locaux.\n\nL'organisation et le fonctionnement des services centraux et des services provinciaux et locaux sont fixés par un décret du Président de la République pris sur proposition du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions."
  },
  {
    "numero": 187,
    "texte": "L'Inspection du Travail a pour mission de :\n1) assurer l'application des dispositions légales relatives aux conditions de travail et à la protection des travailleurs dans l'exercice de leur profession, telles que les dispositions relatives à la durée du travail, aux salaires, à la sécurité, à l'hygiène et au bien-être, à l'emploi des femmes, des enfants et des personnes avec handicap, aux conflits collectifs, aux litiges individuels du travail, à l'application des conventions collectives, à la représentation du personnel et d'autres matières connexes ;\n2) fournir des informations et des conseils techniques aux employeurs et aux travailleurs sur les moyens les plus efficaces d'observer les dispositions légales ;\n3) donner des avis sur les questions relatives à l'établissement ou à la modification des installations d'entreprises et d'organismes soumis à une autorisation administrative ;\n4) porter à l'attention de l'autorité compétente les déficiences ou les abus que révélerait l'application des dispositions légales et qui ne sont pas couverts par celles-ci."
  },
  {
    "numero": 188,
    "texte": "L'exercice des missions de l'Inspection du Travail est de la compétence exclusive de l'Inspection Générale du Travail sur toute l'étendue du territoire national.\n\nL'Inspection Générale du Travail comporte :\na) la Direction de l'Inspection Générale du Travail au service central ;\nb) des inspections provinciales et locales."
  },
  {
    "numero": 189,
    "texte": "La Direction de l'Inspection générale du Travail dirige, coordonne et contrôle l'ensemble des activités qu'implique l'exercice des missions de l'Inspection du Travail.\n\nElle soumet au Ministre toutes propositions relatives au personnel de l'Inspection Générale du Travail."
  },
  {
    "numero": 190,
    "texte": "Un Décret du Premier ministre délibéré en Conseil des ministres fixe l’organisation et le fonctionnement de l’Inspection Générale du Travail."
  },
  {
    "numero": 191,
    "texte": "Le ressort de l'Inspecteur du Travail attaché à l'Inspection Générale du Travail s'étend sur toute l'étendue du territoire national.\n\nLe ressort de l'Inspecteur du Travail attaché en province ou dans la ville de Kinshasa se limite à la juridiction administrative d'attache."
  },
  {
    "numero": 192,
    "texte": "Sans préjudice des compétences reconnues à l'Inspecteur du Travail du ressort, l'Inspecteur du Travail attaché à l'Inspection Générale du Travail est compétent pour :\na) connaître de tout litige du travail se rapportant à l'exercice de sa mission telle que définie à l'article notamment :\n- les litiges individuels du travail pour lesquels l'une des parties aura été mise dans l'impossibilité matérielle d'initier ou de poursuivre jusqu'à terme la procédure de conciliation devant l'Inspecteur du Travail du ressort ;\n- les conflits collectifs du travail affectant plusieurs établissements d'une même entreprise ou affectant plusieurs entreprises d'un ou des plusieurs secteurs d’activité relevant de plus d’un ressort de l’Inspection du Travail.\n\nb) effectuer les visites spéciales d'inspection en matière de sécurité technique, santé au travail, main d'œuvre, institution de prévoyance sociale, c'est-à-dire mutuelles et assurances, négociation des conventions collectives à caractère national et contre-enquêtes.\n\nCette disposition s'applique, mutatis mutandis, aux Inspecteurs attachés aux Inspections du Travail des provinces, des districts ou des territoires dans les limites de leurs juridictions respectives."
  },
  {
    "numero": 193,
    "texte": "Le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions détermine par arrêté pris, après avis du Conseil National du Travail, la dénomination, le siège, la compétence et le ressort territorial des services de l'Inspection du Travail."
  },
  {
    "numero": 194,
    "texte": "Avant leur entrée en fonction, les Inspecteurs et les Contrôleurs du Travail prêtent le serment suivant : « je jure, devant Dieu et la Nation, fidélité et obéissance à la Constitution et aux lois de la République Démocratique du Congo, de remplir fidèlement ma charge et de ne pas révéler, même après avoir quitté le service, les secrets de fabrication ou de commerce ou les procédés d'exploitation dont j'aurai pu prendre connaissance dans l'exercice de mes fonctions ».\n\nCe serment est prêté par écrit devant la Cour d'Appel, et copie en est versée au dossier administratif de l'agent."
  },
  {
    "numero": 195,
    "texte": "Pour assurer l'exercice des missions d'Inspection nécessitant des compétences techniques spécifiques, l'Inspecteur du Travail peut faire appel à la collaboration des experts et techniciens ou des organismes publics ou privés, préalablement agréés par le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions.\n\nCe concours technique s'exerce sous le contrôle de l'Inspection du Travail.\n\nLes frais résultant de ce concours sont à charge du Ministère du Travail et de la Prévoyance Sociale."
  },
  {
    "numero": 196,
    "texte": "Les Inspecteurs et Contrôleurs du Travail, munis de pièces justificatives de leurs fonctions, sont autorisés à :\na) pénétrer librement, sans avertissement préalable à toute heure du jour et de la nuit, dans tout établissement assujetti au contrôle de l'Inspection ;\nb) pénétrer le jour dans tous les locaux qu'ils supposent être assujettis au contrôle de l'Inspection ;\nc) procéder à tous examens, contrôles ou enquêtes qu'ils jugent nécessaires pour s'assurer que les dispositions légales sont effectivement observées et notamment :\n1. interroger, soit seul, soit en présence de témoins, l'employeur ou le personnel de l'entreprise ou de l'établissement sur toutes les matières relatives à l'application des dispositions légales ;\n2. demander que leur soient communiqués, soit sur les lieux du travail, soit en leur bureau, tous livres, registres et documents dont la tenue est prescrite par la législation en vue d'en vérifier la conformité avec les dispositions légales et d'en prendre copie ou d'en établir des extraits ;\n3. exiger l'affichage des avis dont l'apposition est prévue par les dispositions légales ;\n4. prélever et à emporter, aux fins d'analyse des échantillons des matières premières et substances utilisées ou manipulées, pourvu que l'employeur ou son représentant soit averti que des matières ou substances ont été prélevées et emportées à cette fin.\n\nA l'occasion d'une visite d'inspection, l'Inspecteur ou le Contrôleur du Travail devra informer de sa présence l'employeur ou son représentant, à moins qu'il n'estime qu'un tel avis risque de porter préjudice à l'efficacité du contrôle."
  },
  {
    "numero": 197,
    "texte": "Dans l'accomplissement de leurs fonctions, les Inspecteurs et les contrôleurs du Travail ont le pouvoir de :\na) faire appel, en cas de besoin, à la coopération et à l'assistance de toute autorité publique en vue de l'accomplissement de leur mission ;\nb) demander à l'employeur de leur fournir les renseignements et statistiques au sujet des travailleurs ou de leurs conditions de travail ;\nc) constater la violation des dispositions légales par des procès-verbaux, faisant foi jusqu'à preuve du contraire, qu'ils transmettent à l'autorité hiérarchique compétente ;\nd) formuler des observations et prodiguer des conseils tant à l'employeur ou à son représentant qu'aux travailleurs ;\ne) mettre l'employeur ou son représentant en demeure de veiller à l'observance des dispositions légales ;\nf) ordonner ou faire ordonner que des mesures immédiatement exécutoires soient prises lorsqu'ils ont un motif raisonnable de considérer qu'il y a danger imminent et grave pour la santé ou la sécurité des travailleurs.\n\nDans l'application des dispositions du litera f), l'ampliation du procès-verbal est adressée à l'employeur ou à son représentant et à l'autorité hiérarchique compétente dans le délai maximum de huit jours à partir de la constatation de l'infraction.\n\nL'employeur ou son représentant peut faire appel de cette décision en adressant dans les quinze jours ouvrables à compter de la réception, par lettre recommandée ou par porteur avec accusé de réception, un recours auprès du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions contre les mesures exécutoires prises en vertu du litera f) du présent article.\n\nLe Ministre notifiera sa décision à l'employeur ou à son représentant dans le mois à dater de la réception du recours. En cas de silence, il est censé accepter le recours."
  },
  {
    "numero": 198,
    "texte": "Les Inspecteurs et les Contrôleurs du Travail n'ont pas le droit d'avoir un intérêt quelconque direct ou indirect dans les entreprises ou les établissements placés sous leur contrôle.\n\nIls doivent traiter comme absolument confidentielle la source de toute plainte leur signalant un défaut dans l'installation ou une infraction aux dispositions légales et doivent s'abstenir de révéler à l'employeur ou à son représentant qu'il a été procédé à une visite d'inspection comme suite à une plainte.\n\nLes moyens sont mis à leur disposition par le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions."
  },
  {
    "numero": 199,
    "texte": "Dans l'application des articles 187, 196 et 197 de la présente loi, les termes « dispositions légales et réglementaires » comprennent, outre la législation et la réglementation, les conventions collectives dont l'Inspection du Travail est chargée d'assurer le contrôle et l'application."
  },
  {
    "numero": 200,
    "texte": "L'Inspection du Travail dispose en permanence des moyens en personnel, en matériel, en transport, en bureaux et locaux aménagés de façon appropriée aux besoins du service et accessibles à tous les intéressés."
  },
  {
    "numero": 201,
    "texte": "L'emploi est toute activité non illicite pouvant procurer à un individu les revenus nécessaires pour satisfaire à ses besoins essentiels."
  },
  {
    "numero": 202,
    "texte": "Le Ministère ayant le Travail et de la Prévoyance Sociale dans ses attributions applique la politique\n\nnationale de l'emploi au travers de la Direction de l'Emploi et de l'Office National de l'Emploi.\n\nSection 1 : De la Direction de l'Emploi"
  },
  {
    "numero": 203,
    "texte": "La Direction de l'Emploi a pour mission essentielle de contribuer à la conception, à la définition et à la mise en oeuvre de la politique de l'emploi. Elle est chargée notamment de :\n-\nfaire la synthèse périodique sur la situation de l'emploi et sur son évolution ;\n-\npréparer des textes réglementant l'emploi, le placement et l'orientation professionnelle ;\n-\npréparer des accords techniques avec des pays étrangers ;\n-\nassurer le contrôle de l'emploi des nationaux et des étrangers ;\n-\nconnaître et réglementer l'emploi du secteur non structuré urbain et rural.\n\nSection 2 : De l'Office National de l'Emploi"
  },
  {
    "numero": 204,
    "texte": "Il est institué un établissement public à caractère technique et social doté de la personnalité juridique dénommé Office National de l'Emploi."
  },
  {
    "numero": 205,
    "texte": "L'Office National de l'Emploi a pour mission essentielle de promouvoir l'emploi et de réaliser, en collaboration avec les organismes publics ou privés intéressés, la meilleure organisation du marché de l'emploi."
  },
  {
    "numero": 206,
    "texte": "Un décret du Président de la République fixe les statuts,\n\nl'organisation et le fonctionnement de l'Office National de l'Emploi."
  },
  {
    "numero": 207,
    "texte": "Un arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail, fixe les modalités d'ouverture et de fonctionnement des services privés de placement."
  },
  {
    "numero": 208,
    "texte": "Il est institué auprès du Ministère du Travail et de la Prévoyance Sociale une « Commission Nationale de l'Emploi des Etrangers »."
  },
  {
    "numero": 209,
    "texte": "La Commission Nationale de l'Emploi des Etrangers a comme mission générale de statuer sur la délivrance des cartes de travail pour étrangers.\n\nA cet effet, elle statue sur la demande d'engagement et sur le renouvellement des cartes de travail pour étrangers et conseille le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions sur les mesures susceptibles d'améliorer la législation protégeant la main-d'oeuvre nationale contre la concurrence étrangère."
  },
  {
    "numero": 210,
    "texte": "Le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions fixe par arrêté, pris après avis du Conseil National du Travail, les modalités de fonctionnement de la\n\nCommission Nationale de l'Emploi des Etrangers."
  },
  {
    "numero": 211,
    "texte": "Il est perçu une taxe sur les opérations relatives à l'octroi de la carte de travail pour étrangers. Le taux ainsi que les modalités de perception de cette taxe sont fixés par un arrêté signé conjointement par les Ministres ayant respectivement dans leurs attributions le Travail et la Prévoyance Sociale ainsi que les Finances et le Budget."
  },
  {
    "numero": 212,
    "texte": "Le contrat de travail constaté par écrit doit comporter, au minimum, les énonciations ci-après :\n1) le nom de l'employeur ou la raison sociale de l'entreprise ;\n2) le numéro d'immatriculation de l'employeur à l'Institut National de Sécurité Sociale ;\n3) le nom, les prénoms et, le ou les post-noms et le sexe du travailleur ;\n4) le numéro d'affiliation du travailleur à l'Institut National de Sécurité Sociale et, éventuellement, le numéro d'ordre qui lui est attribué par l'employeur ;\n5) la date de naissance du travailleur ou à défaut, le millésime de l'année présumée de celle-ci ;\n6) le lieu de naissance du travailleur et sa nationalité ;\n7) la situation familiale du travailleur :\n-\nnom, prénoms, ou post-noms du conjoint;\n-\nnom, prénoms ou post-noms et date de naissance de chaque enfant à charge\n\n8) la nature et les modalités du travail à fournir ;\n9) le montant de la rémunération et des autres avantages convenus ;\n10) le ou les lieux d'exécution du contrat ;\n11) la durée de l'engagement ;\n12) la durée du préavis de licenciement ;\n13) la date d'entrée en vigueur du contrat ;\n14) le lieu et la date de la conclusion du contrat ;\n15) l’aptitude au travail dûment constatée par un médecin."
  },
  {
    "numero": 213,
    "texte": "Tout employeur, autre que celui qui occupe exclusivement du personnel domestique doit tenir un livre de paie dans chacun des sièges d'exploitation de l'entreprise, pour les travailleurs, quelle que soit la nature ou la durée de leur engagement.\n\nLe livre de paie doit consigner, à chaque paie, toute somme quelconque attribuée à titre de rémunération."
  },
  {
    "numero": 214,
    "texte": "Le livre de paie se compose de feuilles numérotées de manière continue, chacune d'elles comportant au moins deux doubles détachables dont la destination est fixée par l'arrêté ministériel conformément à l'article 103 du présent Code."
  },
  {
    "numero": 215,
    "texte": "Le livre de paie doit être conforme au modèle fixé par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions.\n\nDans les entreprises ou établissements dont la comptabilité est\n\ntenue par une méthode de décalque ou de gestion automatisée, l'Inspecteur du Travail peut autoriser le remplacement du livre de paie par tout autre document, pour autant que les mentions essentielles soient conformes à celles reprises dans l'arrêté prévu au premier alinéa du présent article.\n\nLes employeurs occupant habituellement moins de vingt-cinq travailleurs pourront utiliser un livre de paie inspiré du modèle fixé."
  },
  {
    "numero": 216,
    "texte": "Toute personne physique ou morale, publique ou privée, qui se propose d'exercer une activité quelconque, permanente ou saisonnière, nécessitant l'emploi de travailleurs, au sens défini à l'article 7 du présent Code, est tenue d'en faire la déclaration à l'Inspection du Travail et à l'Office National de l'Emploi dans la quinzaine qui précède l'ouverture de l'entreprise ou de l'établissement."
  },
  {
    "numero": 217,
    "texte": "A l'occasion de son engagement, tout travailleur doit faire l'objet dans les quarante-huit heures, d'une déclaration faite par l'employeur et adressée par ce dernier à l'Inspection du Travail et à l'Office National de l'Emploi.\n\nTout travailleur quittant l'employeur, pour quelque cause que ce soit, doit faire l'objet d'une déclaration, établie dans les mêmes conditions, et mentionnant notamment la date du départ de l'entreprise."
  },
  {
    "numero": 218,
    "texte": "Tout chef d'entreprise ou d'établissement doit faire parvenir, au moins une fois par an, à l'Inspection du\n\nTravail et à l'Office National de l'Emploi, une déclaration de la situation de la main d’œuvre nationale et étrangère qu'il emploie.\n\nEn outre, il est tenu de fournir chaque année le bilan social de l'entreprise ou de l'établissement."
  },
  {
    "numero": 219,
    "texte": "Le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions détermine, par arrêtés, les modalités des déclarations, prévues aux articles 217, 218 ci-dessus, ainsi que les dérogations qui peuvent être autorisées en ce qui concerne certaines catégories d'entreprises ou de travailleurs."
  },
  {
    "numero": 220,
    "texte": "Des secrétariats sociaux peuvent être constitués en vue de remplir, en qualité de mandataires de leurs affiliés, les formalités imposées aux employeurs par le chapitre I du présent Titre ainsi que par la législation de la sécurité sociale, la réglementation de la taxe professionnelle sur les rémunérations et plus généralement la législation du travail."
  },
  {
    "numero": 221,
    "texte": "L'ouverture d'un secrétariat social est subordonnée au versement d'une caution et à l'autorisation du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions délivrée sur avis de l'Inspecteur du Travail du ressort.\n\nEn cas de fermeture définitive, la caution sera remboursée."
  },
  {
    "numero": 222,
    "texte": "Un arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail, fixe les modalités d'application des dispositions du présent chapitre."
  },
  {
    "numero": 223,
    "texte": "Il est institué auprès du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions un organisme consultatif dénommé «Conseil National du Travail ». Il peut être intégré dans des organismes plus larges chargés d'étudier les problèmes d'ordre économique, financier et social.\n\nLe Conseil National du Travail est présidé par le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions ou par son représentant.\n\nIl comprend un nombre égal de représentants de l'Etat, des travailleurs et des employeurs.\n\nSon secrétariat est assuré par le Ministère du Travail et de la Prévoyance Sociale."
  },
  {
    "numero": 224,
    "texte": "Les sièges attribués aux représentants de chacun des groupes cités à l'article précédent sont déterminés par Arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions.\n\nLes représentants de l'Etat sont issus des Ministères suivants :\n\n-\nMinistère du Travail et de la Prévoyance Sociale\n-\nMinistère des Finances et Budget\n-\nMinistère de l'Economie Nationale\n-\nMinistère de la Fonction Publique\n-\nMinistère de l'Education Nationale\n-\nMinistère du Plan\n-\nMinistère de la Justice et Garde des Sceaux\n-\nMinistère des Affaires Sociales et Famille\n-\nMinistère de la Santé Publique\n-\nMinistère de la Jeunesse, Sports et Loisirs\n-\nMinistère des Droits Humains\n-\nMinistère de l'Agriculture, Pêche et Elevage.\n\nLes représentants des travailleurs et des employeurs sont désignés par les organisations professionnelles reconnues les plus représentatives sur le plan national par le Ministère du Travail et de la Prévoyance Sociale.\n\nLes représentants de l'Etat issus des Ministères ainsi que les représentants des travailleurs et des employeurs sont investis par un arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions.\n\nLe caractère représentatif d'une organisation professionnelle de travailleurs est déterminé par le nombre de suffrages recueillis aux élections des représentants des travailleurs dans l'entreprise tel que prévu aux articles 255 à 266 du présent Code.\n\nLe caractère représentatif d'une organisation professionnelle d'employeurs est déterminé par le nombre de travailleurs occupés dans les entreprises qui en sont membres.\n\nA défaut d'organisations professionnelles de travailleurs ou d'employeurs pouvant être considérées comme les plus représentatives, les sièges attribués aux travailleurs et aux employeurs sont désignés directement par le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions."
  },
  {
    "numero": 225,
    "texte": "Outre les cas prévus par le présent Code, l'avis du Conseil National du Travail est requis sur tous les projets de lois, décrets-lois, décrets et arrêtés ministériels lorsqu'ils ont pour objet de modifier ou de créer des obligations ou des droits pour les travailleurs et les employeurs en matière de travail ou de la sécurité sociale.\n\nLe Conseil National du Travail a également pour mission générale de :\na)\nétudier toutes les questions concernant le travail, la main-d'oeuvre et la prévoyance sociale ;\nb)\nétudier les éléments pouvant servir de base à la détermination du salaire minimum interprofessionnel garanti et ses incidences économiques ;\nc)\némettre des avis et formuler des propositions et résolutions sur la réglementation à intervenir en ces matières."
  },
  {
    "numero": 226,
    "texte": "A la demande de son président ou des organisations professionnelles des employeurs et des travailleurs, le Conseil National du Travail peut convoquer, à titre consultatif, des fonctionnaires qualifiés et inviter au même titre des personnalités\ncompétentes dans les matières inscrites à l'ordre du jour.\nCes fonctionnaires et personnalités expriment leurs avis mais ne prennent pas part aux votes.\n\nDans les mêmes conditions, le Conseil peut demander aux administrations compétentes, par l'intermédiaire de leur président, tous documents ou informations utiles à l'accomplissement de sa mission."
  },
  {
    "numero": 227,
    "texte": "Lorsque le Conseil National du Travail est saisi des questions intéressant la santé ou la sécurité des travailleurs, la convocation ou l'invitation de médecins, de techniciens ou d'experts est de droit."
  },
  {
    "numero": 228,
    "texte": "Les conditions de fonctionnement du Conseil National du Travail sont fixées par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions.\n\nLe Conseil se réunit au moins deux fois par an, sur la convocation de son président ou à la demande des organisations professionnelles des employeurs et des travailleurs."
  },
  {
    "numero": 229,
    "texte": "Le mandat de membre du Conseil National du Travail est gratuit.\n\nToutefois, il pourra être alloué par arrêté interministériel, pris conjointement par les Ministres ayant respectivement le Travail et la Prévoyance Sociale, les Finances et le Budget dans leurs attributions, des indemnités de séance aux membres du\n\nConseil, de l'Equipe Technique et du Secrétariat.\n\nLorsqu'un membre doit se déplacer du lieu de sa résidence habituelle au lieu de réunion, le voyage aller et retour est à la charge de l' Etat. La durée du mandat est de deux ans renouvelables.\n\nL'employeur d'un membre du Conseil National du Travail est tenu de lui accorder le temps nécessaire pour assister aux réunions. Ce temps est considéré comme temps de service pour le calcul de l'ancienneté et des droits aux congés."
  },
  {
    "numero": 230,
    "texte": "Les travailleurs et les employeurs tels que définis à l'article 7 du présent Code ont le droit de se constituer en organisations ayant exclusivement pour objet l'étude, la défense et le développement de leurs intérêts professionnels ainsi que le progrès social, économique et moral de leurs membres."
  },
  {
    "numero": 231,
    "texte": "A condition de remplir les formalités prévues par le présent chapitre, aucune autorisation préalable n'est requise pour constituer une organisation professionnelle."
  },
  {
    "numero": 232,
    "texte": "Les organisations de travailleurs et d'employeurs ont le droit d'élaborer\n\nleurs statuts et règlements administratifs, d'élire librement leurs représentants, d'organiser leur gestion et leur activité et de formuler leur programme d'action, sous réserve des dispositions du présent chapitre."
  },
  {
    "numero": 233,
    "texte": "Tout travailleur ou employeur, sans distinction aucune, a le droit de s'affilier à une organisation professionnelle de son choix ou de s'en désaffilier\n\nA tout moment, tout membre d'une organisation professionnelle peut s'en retirer, nonobstant toute clause contraire des statuts.\n\nToute personne qui, s'est retirée d'une organisation professionnelle conserve le droit d'être membre des sociétés de secours mutuel ou de retraite à l'actif desquelles elle a contribué par des cotisations ou versements de fonds."
  },
  {
    "numero": 234,
    "texte": "Les travailleurs bénéficient d'une protection appropriée contre tous les actes de discrimination tendant à porter préjudice à la liberté syndicale en matière d'emploi.\n\nIl est interdit à tout employeur de:\na) subordonner l'emploi d'un travailleur à son affiliation ou à sa non affiliation à une organisation professionnelle quelconque ou à une organisation professionnelle déterminée ,\nb) licencier un travailleur ou lui porter préjudice par tous les autres moyens, en raison de son affiliation à une organisation professionnelle et de sa participation à des activités syndicales."
  },
  {
    "numero": 235,
    "texte": "Les organisations de travailleurs ou d'employeurs doivent s'abstenir de tous actes d'ingérence des unes à l'égard des autres dans leur formation, leur fonctionnement et leur administration."
  },
  {
    "numero": 236,
    "texte": "Un Arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions pris après avis du Conseil National du Travail définit les actes d'ingérence dont question à l'article précédent."
  },
  {
    "numero": 237,
    "texte": "On entend par syndicat toute organisation professionnelle constituée en vue de l'objet défini à l'article 230 ci-dessus."
  },
  {
    "numero": 238,
    "texte": "Les syndicats ont l'obligation de se faire enregistrer au Ministère du Travail et de la Prévoyance Sociale où est tenu, en permanence, le registre des syndicats de travailleurs et d'employeurs."
  },
  {
    "numero": 239,
    "texte": "Toute demande d'enregistrement émanant d'un syndicat est adressée au Ministère du Travail et de la Prévoyance Sociale.\n\nLa demande mentionne l'identité complète des membres chargés de l'administration et de la direction du syndicat. Elle est signée par chacun d'eux. Il y est joint des exemplaires des statuts de l'organisation requérante, dont le nombre est fixé par le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions."
  },
  {
    "numero": 240,
    "texte": "Les statuts du syndicat requérant doivent mentionner :\n1) la dénomination et le siège du syndicat ;\n2) son objet ;\n3) les conditions d'affiliation, de démission et d'exclusion des membres ;\n4) le mode de nomination, les pouvoirs et la durée du mandat des membres chargés de l'administration et de la direction du syndicat ;\n5) les règles relatives à la gestion financière du syndicat et notamment au mode et à la périodicité de l'établissement des comptes, au placement des fonds et à l'affectation de ceux-ci en cas de dissolution du syndicat ;\n6) le mode de vérification des comptes et les pouvoirs accordés aux membres en vue de leur permettre de contrôler la gestion des biens du syndicat ;\n7) l'époque de la réunion de l'assemblée générale et le mode de statuer de celle-ci ;\n8) les sanctions en cas d'inobservation des statuts ;\n9) la procédure de modification des statuts et de dissolution du syndicat ;\n10)la procédure de règlement des conflits internes entre les membres dirigeants d'un même syndicat."
  },
  {
    "numero": 241,
    "texte": "Les personnes chargées de l'administration et de la direction d'un syndicat doivent posséder la nationalité congolaise et être âgées de 21 ans au moins. Ne peuvent être désignés comme membres de l'administration et de la direction d'un syndicat requérant :\na) les personnes qui, au cours des trois dernières années, ont fait l'objet\n\nd'une condamnation à une peine de servitude pénale de trois mois à l'exception des délits de presse à caractère politique, syndical, philosophique ou scientifique ;\nb) les personnes internées ou hospitalisées pour cause d'aliénation mentale ;\nc) les personnes qui sont condamnées du chef de banqueroute ;\nd) les détenus qui purgent une peine de servitude pénale à la suite d'une condamnation définitive ;\ne) les personnes qui ont été condamnées pour une infraction de droit commun, à l'exception des délits de presse à caractère politique, à une peine de servitude pénale principale égale ou supérieure à trois ans et qui n'ont pas été réhabilitées."
  },
  {
    "numero": 242,
    "texte": "Avant l'enregistrement, le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions vérifie la conformité des statuts :\n1) à l'objet en vue duquel le syndicat est formé ;\n2) à la législation et à la réglementation en vigueur ;\n3) aux conditions requises par le présent Code et ses textes d'application.\n\nLorsque les statuts d'un syndicat ne satisfont pas aux exigences de l'alinéa précédent et lorsque les personnes chargées de l'administration et de la direction d'un syndicat ne répondent pas aux conditions du premier alinéa de l'article 241 ci-dessus ou tombent sous le coup des dispositions du deuxième alinéa du même article, le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions refuse l'enregistrement\n\net demande les modifications nécessaires.\n\nAvant de refuser l'enregistrement d'un syndicat, le Ministre doit en notifier le ou les motifs à celui-ci."
  },
  {
    "numero": 243,
    "texte": "Le syndicat qui a reçu une telle notification dispose d'un délai d'un mois pour présenter ses observations. Passé ce délai, le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions peut refuser l'enregistrement de tout syndicat qui a omis de présenter ses observations ou est en défaut d'apporter la preuve qu'il n'y avait pas lieu de refuser son enregistrement. La décision motivée du Ministre est immédiatement signifiée à l'organisation intéressée. Elle est susceptible d'un recours en justice."
  },
  {
    "numero": 244,
    "texte": "Lorsque l'enregistrement est accordé, le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions adresse immédiatement au syndicat requérant la décision d'enregistrement.\n\nDans les trois jours de la réception de la décision, le syndicat adresse un exemplaire des statuts au Procureur de la République près le Tribunal de Grande Instance dans le ressort duquel est établi le siège du syndicat."
  },
  {
    "numero": 245,
    "texte": "Le registre des syndicats, tenu au Ministère du Travail et de la Prévoyance Sociale, doit contenir pour chaque syndicat, les renseignements suivants :\n1) la dénomination et le siège du syndicat ;\n\n2) son objet ;\n3) les noms, prénoms ou post-noms et adresses des personnes chargées de l'administration et de la direction du syndicat ;\n4) le numéro d'ordre et la date d'enregistrement.\n\nLe registre peut être consulté au Ministère ayant le Travail et la Prévoyance Sociale dans ses attributions."
  },
  {
    "numero": 246,
    "texte": "Toute modification apportée aux statuts et tout changement dans la composition de la direction et de l'administration d'un syndicat doivent immédiatement être portés à la connaissance du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions.\n\nToute modification des statuts est soumise aux-mêmes dispositions d'enregistrement que les statuts eux-mêmes.\n\nDans le délai de 45 jours à partir de la réception de cette modification, le Ministre notifie au syndicat la conformité de cette modification à la loi. A défaut de réponse dans le délai, la demande est censée acceptée."
  },
  {
    "numero": 247,
    "texte": "Un syndicat peut être radié du registre par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions en cas de dissolution volontaire décidée conformément aux règles prévues par ses statuts ou . de dissolution prononcée par la justice.\n\nLe syndicat est tenu d'en informer le Ministre dans les 30 jours."
  },
  {
    "numero": 248,
    "texte": "Le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions est chargé de porter à la connaissance des tiers, sous forme de publication au « Journal Officiel »\na) l'enregistrement d'un syndicat ;\nb) la radiation de l'enregistrement ;\nc) tout changement affectant un syndicat.\n\nCette publication s'opère sans frais pour le syndicat."
  },
  {
    "numero": 249,
    "texte": "Tout syndicat enregistré jouit de la personnalité civile. Il a le droit d'acquérir, conformément au droit commun, à titre gratuit ou onéreux, des biens meubles ou immeubles nécessaires à la promotion et à la défense des intérêts de ses membres.\n\nNe peuvent être saisis, les bâtiments et leurs accessoires, les meubles meublant, les livres et le matériel didactique nécessaires aux réunions, bibliothèques et cours de formation des membres d'un syndicat enregistré."
  },
  {
    "numero": 250,
    "texte": "Les syndicats enregistrés conformément aux dispositions du présent Code peuvent librement se concerter pour promouvoir et défendre les intérêts des travailleurs et des employeurs.\n\nIls peuvent se constituer en union, en confédération ou en fédération. Celles-ci dûment enregistrées jouissent de mêmes droits et sont tenues aux-\n\nmêmes obligations que les syndicats qui les composent.\n\nLes dispositions du présent chapitre sont applicables aux unions, aux confédérations et aux fédérations des syndicats. Leurs statuts doivent déterminer les règles selon lesquelles les syndicats membres de l'union, de la confédération ou de la fédération sont représentés dans les assemblées générales."
  },
  {
    "numero": 251,
    "texte": "Tout syndicat peut être dissout de plein droit :\n1) si l'objet en vue duquel il a été constitué est atteint ,\n2) si les deux tiers des membres réunis en assemblée générale votent la dissolution."
  },
  {
    "numero": 252,
    "texte": "Les organisations de travailleurs et d'employeurs ne sont pas sujettes à dissolution ou à suspension par voie administrative."
  },
  {
    "numero": 253,
    "texte": "En cas de dissolution, les biens du syndicat sont dévolus conformément aux statuts.\n\nEn tout état de cause, l'actif d'un syndicat ne peut être transféré, sous forme de don, qu'à un autre syndicat, légalement constitué ou à des oeuvres d'assistance ou de prévoyance sociale.\n\nEn aucun cas, les biens d'un syndicat ne peuvent être répartis entre les membres adhérents."
  },
  {
    "numero": 254,
    "texte": "Un arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans\n\nses attributions fixe, en cas de besoin, les modalités d'application du présent chapitre."
  },
  {
    "numero": 255,
    "texte": "La représentation des travailleurs dans les entreprises ou les établissements de toute nature est assurée par une délégation élue.\n\nLes membres de la délégation syndicale sont encadrés, formés et suivis dans leurs activités syndicales au sein de l'entreprise par leurs organisations professionnelles respectives, dans la limite du temps et dans les conditions leur imparties par le présent Code, la convention collective, le règlement d'entreprise et le règlement intérieur de la délégation syndicale. Un arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail, fixe :\n1) le nombre de travailleurs à partir duquel et les catégories d'entreprises ou d'établissements dans lesquels l'institution d'une délégation est obligatoire ,\n2) le nombre des délégués et leur répartition sur le plan professionnel ;\n3) les conditions d'électorat et d'éligibilité des travailleurs et les modalités de l'élection qui a lieu au scrutin direct et secret de liste, à deux tours ,\n4) les moyens mis à la disposition des délégués ;\n5) les conditions dans lesquelles la délégation est reçue par l'employeur ou son représentant ;\n\n6) la composition du bureau de la délégation syndicale."
  },
  {
    "numero": 256,
    "texte": "En cas de contestations relatives à l'électorat, à l'éligibilité et à la régularité des élections, la procédure de recours est organisée par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail."
  },
  {
    "numero": 257,
    "texte": "Le mandat des délégués est de trois ans renouvelables.\n\nLe délégué perd sa qualité :\na) s'il cesse de remplir les conditions d'éligibilité ;\nb) s'il démissionne ou perd son emploi ;\nc) s'il se fait désavouer par les travailleurs de l'entreprise membres de son syndicat pour une faute lourde commise dans l'exercice de son mandat syndical ou s'il fait l'objet d\"une mesure disciplinaire dûment prononcée par les organes statutaires de son syndicat.\n\nDans ces cas, le syndicat informe l'employeur qui prend acte de cette mesure et l'Inspecteur du Travail du ressort.\n\nToutefois, la perte du mandat du délégué syndical ne devient effective qu'après constat, par l'Inspecteur du Travail de la conformité de la mesure au règlement intérieur de la délégation syndicale dans le premier cas et aux statuts du syndicat concerné dans le second cas.\n\nL'Inspecteur du Travail notifie sa décision au syndicat concerné dans les\n\ntrente jours de la réception de la requête de ce dernier.\n\nPassé ce délai, il est censé approuver la mesure.\n\nLorsque la vacance partielle ou totale concerne particulièrement le syndicat représentatif, le syndicat concerné procède à la cooptation suivant la liste présentée aux élections. Il signe un procès-verbal avec l'employeur qui l'envoie à l'Inspecteur du Travail du ressort pour information.\n\nEn cas de vacance du mandat avant l'expiration du terne, par démission, décès ou pour toute autre cause, le suppléant achève le mandat de celui qu'il remplace.\n\nLe suppléant remplace le titulaire lorsque celui-ci est absent ou empêché.\n\nEn cas de vacance partielle ou totale avant l'expiration du mandat, le syndicat concerné procède à la cooptation suivant la liste présentée aux élections.\n\nLe mandat du délégué ne peut entraîner ni mesures vexatoires, ni préjudices, ni avantages spéciaux pour celui qui l'exerce. Les délégués jouissent des promotions et avancements normaux de la catégorie des travailleurs à laquelle ils appartiennent.\n\nUn arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail, fixera les modalités d'application du point c) du présent article."
  },
  {
    "numero": 258,
    "texte": "Tout licenciement d'un délégué titulaire ou suppléant envisagé par l'employeur ou son représentant ainsi que toute mutation faisant perdre la qualité de délégué sont soumis à la condition suspensive de leur approbation par l'Inspecteur du Travail du ressort.\n\nSi le motif invoqué par l'employeur est une faute lourde, il peut prononcer la suspension des fonctions de l'intéressé dans les conditions prévues à l'article 72 du présent Code. Dans tous les cas, le licenciement ne devient effectif qu'après décision de l'Inspecteur du Travail.\n\nLa mesure prise ou envisagée par l'employeur doit être communiquée à l'Inspecteur du Travail par lettre au porteur ou lettre recommandée avec accusé de réception. L'Inspecteur du Travail doit notifier sa décision dans le mois à partir de la réception de la lettre de l'employeur.\n\nPassé ce délai, il est censé l'approuver.\n\nLa décision de l'Inspecteur du Travail est susceptible d'un recours judiciaire dans les conditions fixées par l'arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail.\n\nSauf faute lourde, la durée du préavis à observer en cas de licenciement d'un délégué titulaire ou suppléant est le double de la période applicable en vertu des dispositions de l'article 64 du présent Code, sans pouvoir être inférieure à trois mois.\n\nSauf faute lourde, les candidats à la représentation des travailleurs ne peuvent être licenciés depuis la date de dépôt des listes électorales jusqu'à la proclamation des résultats du scrutin. Les candidats non élus ou non réélus bénéficient pendant une durée de 6 mois après les élections des règles de préavis prévues à l'alinéa précédent."
  },
  {
    "numero": 259,
    "texte": "La compétence de la délégation s'étend à l'ensemble des conditions de travail dans l'entreprise ou l'établissement.\n\nL'employeur est tenu de consulter la délégation sur :\n-\nles horaires de travail ;\n-\nles critères généraux en matière d'embauchage, de licenciement et de transfert des travailleurs ;\n-\nles systèmes de rémunération et de prime en vigueur dans l'entreprise ou établissement dans le cadre des dispositions légales et réglementaires ou des conventions collectives en vigueur ;\n-\nl'élaboration et les modifications du règlement d'entreprise et, le cas échéant, le règlement d'atelier."
  },
  {
    "numero": 260,
    "texte": "La délégation participe au règlement des problèmes que pose le maintien de la discipline du travail et peut proposer toute mesure qu'elle juge nécessaire lorsque les manquements à celle-ci risquent de troubler gravement le bon fonctionnement de l'entreprise ou de l'établissement."
  },
  {
    "numero": 261,
    "texte": "La délégation participe à la gestion des œuvres sociales créées par l'employeur\n\nen faveur de son personnel, et notamment des économats prévus aux articles 115 à 118.\n\nElle est associée à l'élaboration et à la mise en application des programmes collectifs de formation professionnelle."
  },
  {
    "numero": 262,
    "texte": "La délégation s'occupe des mesures propres à assurer la sécurité technique, l'hygiène et la salubrité sur les lieux de travail ainsi qu'à sauvegarder la santé de toute personne dans l'entreprise ou l'établissement.\n\nA ce titre, elle peut notamment :\n- proposer toutes mesures de nature à assurer l'application sur les lieux de travail des dispositions légales et réglementaires concernant la sécurité et la salubrité du travail ;\n- proposer toutes mesures qu'elle juge nécessaires pour remédier aux causes de danger ou d'insalubrité constatées ou signalées ;\n- prodiguer aux travailleurs des conseils nécessaires pour l'application des mesures d'hygiène et de sécurité ;\n- promouvoir le développement de l'esprit de prévention des travailleurs contre les accidents du travail et les maladies professionnelles."
  },
  {
    "numero": 263,
    "texte": "L'employeur est tenu d'informer au moins semestriellement la délégation sur les données concernant la marche et la situation économique et sociale de l'entreprise ou de l'établissement notamment sur le chiffre d'affaires ou une donnée équivalente, l'indice général de la productivité, le bénéfice global, l'évolution du niveau des prix à la vente,\n\nles grandes lignes du programme de développement, les perspectives d'avenir.\n\nA défaut de convention collective, un accord entre l'employeur et la délégation peut déterminer, compte tenu des contingences particulières de l'entreprise ou de l'établissement :\n-\nles modalités d'application de l'alinéa précédent ;\n-\nl'énumération des renseignements que l'employeur doit s'abstenir de communiquer ;\n-\nles renseignements qui peuvent être livrés au personnel.\n\nDans tous les cas, les délégués ne peuvent divulguer les informations confidentielles dont ils auraient eu connaissance dans l'exercice de leurs fonctions."
  },
  {
    "numero": 264,
    "texte": "Il est reconnu, en outre, à chaque délégué, en dehors des réunions, la compétence de :\n- présenter à l'employeur toutes les réclamations individuelles qui n'auraient pas été directement satisfaites concernant les conditions de travail et la protection des travailleurs, l'application des conventions collectives et de la classification professionnelle ;\n- veiller à l'application des prescriptions relatives à l'hygiène et à la sécurité des travailleurs et de proposer toutes mesures utiles à ce sujet ;\n- veiller à la discipline du travail ;\n- saisir l'inspection du travail de toute plainte ou réclamation concernant les prescriptions légales ou réglementaires dont elle est chargée\n\nd'assurer l'application et que la délégation n'a pu régler.\n\nLes délégués pourront être reçus par l'Inspecteur du Travail chaque fois qu'il effectuera une visite d'inspection dans l'entreprise ou l'établissement."
  },
  {
    "numero": 265,
    "texte": "Le nombre d'heures minimum dont doivent disposer les représentants des travailleurs pour l'accomplissement de leurs fonctions est fixé à quinze par mois. Ces heures sont considérées et rémunérées comme temps de travail.\n\nLes conditions auxquelles elles sont accordées sont déterminées par l'arrêté prévu à l'article 255 du présent Code."
  },
  {
    "numero": 266,
    "texte": "Nonobstant les dispositions ci-dessus, le travailleur a la faculté de présenter lui-même les réclamations ou suggestions à l'employeur ou à son représentant ou à l'Inspecteur du Travail.\n\nNéanmoins, dans les entreprises où il n'existe pas de délégation syndicale, le travailleur a la faculté de présenter lui même ses réclamations à l'employeur ou à son représentant ou à l'Inspecteur du Travail. Il peut, le cas échéant, se faire assister par le syndicat de son affiliation, et ce, en présence de l'Inspecteur du Travail."
  },
  {
    "numero": 267,
    "texte": "Toute organisation syndicale dûment enregistrée peut organiser sur le territoire de la République, en faveur de\n\nses membres et de ses délégués syndicaux du personnel, titulaires et suppléants, des stages ou sessions de formation exclusivement consacrées à l'éducation ouvrière.\n\nDans ce cas, l'organisation responsable du stage ou de la session doit en aviser le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions ou son représentant et lui communiquer les dates d'ouverture et de clôture du stage ou de la session, le programme arrêté, ainsi que les noms et qualités des personnes chargées de cours."
  },
  {
    "numero": 268,
    "texte": "Les membres et les délégués syndicaux, titulaires ou suppléants, appelés à participer aux stages ou aux sessions prévus à l'article 267 ont droit à un congé d'éducation ouvrière de douze jours par an, non compris les délais de route.\n\nCe congé n'est pas déductible du congé annuel visé au chapitre VI du Titre VI du présent Code."
  },
  {
    "numero": 269,
    "texte": "Le congé d'éducation ouvrière est pris en une ou deux fois.\n\nSans préjudice des dispositions de l'article 271, il est payé par l'employeur sur les mêmes bases que le congé annuel légal. Toutefois, les frais de transport et de séjour ne sont, pas à charge de l'employeur."
  },
  {
    "numero": 270,
    "texte": "La demande de congé doit être présentée par écrit à l'employeur pour avis, par l'organisation syndicale responsable du stage ou de la session, au\n\nmoins trente jours avant la date fixée pour son ouverture. Elle doit mentionner les noms des membres et des délégués syndicaux intéressés ainsi que la date et la durée de l'absence sollicitée."
  },
  {
    "numero": 271,
    "texte": "L'organisation syndicale responsable du stage ou de la session, délivre, au terme des cours, à chacun des membres et des délégués participants, une attestation constatant son assiduité et énumérant les matières dispensées.\n\nChaque membre et chaque délégué sont tenus de remettre ladite attestation à leur employeur dans les deux jours suivant la reprise de travail. A défaut de respecter cette obligation, le congé accordé ne sera pas rémunéré."
  },
  {
    "numero": 272,
    "texte": "La convention collective est un accord écrit relatif aux conditions et aux relations de travail conclu entre, d'une part un ou plusieurs employeurs, une ou plusieurs organisations professionnelles d'employeurs et, d'autre part, une ou plusieurs organisations professionnelles de travailleurs."
  },
  {
    "numero": 273,
    "texte": "Les syndicats doivent être constitués et enregistrés conformément aux dispositions du chapitre premier du présent Titre.\n\nLeurs représentants doivent justifier avant l'ouverture des négociations de leur pouvoir de contracter au nom du syndicat ou de\n\nl'organisation professionnelle qu'ils représentent."
  },
  {
    "numero": 274,
    "texte": "La convention peut mentionner des dispositions plus favorables aux travailleurs que celles de la législation et de la réglementation en vigueur mais ne peut déroger aux dispositions d'ordre public."
  },
  {
    "numero": 275,
    "texte": "La convention collective détermine son champ d'application professionnel et territorial."
  },
  {
    "numero": 276,
    "texte": "La convention collective est conclue pour une durée déterminée ou indéterminée. A défaut de fixation de la durée de la convention, celle-ci est réputée indéterminée."
  },
  {
    "numero": 277,
    "texte": "La convention à durée déterminée ne peut être dénoncée avant l'expiration de son terme. A défaut de dispositions contraires, la convention collective à durée déterminée qui arrive à l'expiration, est tacitement reconduite ; elle est, dès ce moment, sauf dénonciation, réputée à durée indéterminée."
  },
  {
    "numero": 278,
    "texte": "La convention collective à durée indéterminée ou réputée telle peut être dénoncée entièrement ou partiellement par la volonté d'un des contractants moyennant signification d'un préavis écrit. Les conditions et les formes de la dénonciation ainsi que celles du préavis doivent être déterminées dans la convention collective. A défaut de stipulation de la durée du préavis, celle-ci est fixée à trois mois."
  },
  {
    "numero": 279,
    "texte": "Toute convention collective doit être rédigée en langue officielle.\n\nElle comporte obligatoirement :\n- le lieu et la date de sa conclusion ;\n- les noms et la qualité des contractants et des signataires ;\n- son champ d'application professionnel et territorial ;\n- son objet ;\n- sa date d'entrée en vigueur ;\n- la procédure de conciliation et d'arbitrage à observer pour le règlement des conflits collectifs entre employeurs et travailleurs liés par la convention ;\n- les règles applicables en cas d'incapacité temporaire et involontaire de l'employeur d'assurer aux travailleurs les conditions normales à la suite notamment des difficultés d'approvisionnement ou d'évacuation des produits finis ;\n- les modalités de perception et de versement par les travailleurs des cotisations syndicales à l'organisation professionnelle intéressée.\n\nElle peut comporter, sans que cette énumération soit limitative, des dispositions concernant :\n- le libre exercice du droit syndical ;\n- les salaires applicables par catégories professionnelles ;\n- les conditions d'embauchage et de licenciement des travailleurs ;\n- la durée de la période d'essai et celle du préavis ;\n- les congés payés ;\n- les modalités d'exécution des heures supplémentaires et leurs taux ;\n- les indemnités de déplacement ;\n- les primes d'ancienneté et d'assiduité ;\n- les conditions générales de la rémunération au rendement, lorsqu'un tel mode de rémunération est reconnu possible ;\n- la majoration de salaires pour travaux pénibles, dangereux ou insalubres ;\n- l'organisation et le fonctionnement de l'apprentissage et de la formation professionnelle dans le cadre de la branche d'activité considérée ;\n- l'organisation, la gestion et le financement des services sociaux et médico-sociaux ;\n- les modalités de paiement éventuel d'une indemnité forfaitaire en cas de force majeure débouchant sur une résiliation du contrat de travail ;\n- et, en général, toutes dispositions ayant pour objet de régler les rapports entre employeurs et travailleurs d'une branche d'activité déterminée."
  },
  {
    "numero": 280,
    "texte": "La convention est établie en autant d'originaux qu'il y a des parties et signée par tous les contractants.\n\nSix originaux supplémentaires sont soumis au visa de l'Inspecteur du Travail du ressort qui peut demander la modification des clauses contraires à la législation ou à la réglementation.\n\nL'Inspecteur du Travail dépose, sans frais, si le texte est conforme, un exemplaire de la convention, revêtu de son visa, au greffe du Tribunal du Travail. Il adresse au Ministère du Travail et de la Prévoyance Sociale au moins un exemplaire aux fins de publication de la convention au « Journal Officiel ». Cette publication est faite sans frais."
  },
  {
    "numero": 281,
    "texte": "Dans toute entreprise à laquelle la convention s'applique, l'employeur doit, dès son entrée en vigueur, afficher la convention et le cas échéant, sa traduction en langue usuelle de la région en un endroit réservé à cet effet, très visible et facilement accessible aux travailleurs.\n\nL'employeur porte la convention collective et éventuellement sa traduction dans la langue usuelle de la région à la connaissance de tout travailleur préalablement à l’engagement dans son entreprise.\n\nToute organisation professionnelle ayant conclu une convention collective veillera à ce que ses membres visés par celle-ci puissent, dès que possible, avoir connaissance de son texte et de la note explicative jointe à la convention, si les parties en établissent une."
  },
  {
    "numero": 282,
    "texte": "Toute convention peut être révisée dans les formes et les conditions qu'elle prévoit.\n\nLes articles 279, 280 et 281 ci-dessus sont applicables en cas de révision d'une convention collective.\n\nLa publication de l'acte de révision au « Journal Officiel » est obligatoire. Elle se fait sans frais."
  },
  {
    "numero": 283,
    "texte": "En cas de divergence entre le texte de différents exemplaires de la convention collective, l'original déposé au greffe du Tribunal du Travail fait foi à l'exclusion de tout autre texte."
  },
  {
    "numero": 284,
    "texte": "A la demande d'un syndicat représentatif de travailleurs ou d'employeurs intéressés, ou de sa propre initiative, le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions peut instituer une commission paritaire destinée à régler par voie de convention collective, les rapports entre un ou plusieurs syndicats d'employeurs et un ou plusieurs syndicats de travailleurs d'une ou plusieurs branches d'activités déterminées.\n\nIl détermine la compétence professionnelle et territoriale de la commission. Celle-ci comporte, d'une part, des représentants des travailleurs et, d'autre part, un ou plusieurs employeurs ou leurs représentants.\n\nLes représentants des travailleurs et des employeurs sont désignés par les syndicats et organisations intéressés.\n\nLes représentants de l'autorité publique peuvent faire partie de la commission à titre consultatif.\n\nLe fonctionnement des commissions paritaires est déterminé par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail."
  },
  {
    "numero": 285,
    "texte": "La constitution de la commission paritaire prévue à l'article précédent est obligatoire en cas d'application de l'article 287 ci-dessous."
  },
  {
    "numero": 286,
    "texte": "Tout employeur ou toute organisation professionnelle d'employeurs et de travailleurs constituée conformément aux dispositions du présent Code et dûment enregistrée qui n'est pas partie à une convention collective peut y adhérer après un délai de six mois à compter de l'entrée en vigueur de la convention. L'adhésion ne peut être unilatérale. Elle doit faire l'objet d'un accord de la part des parties signataires. Faute d'une demande expresse d'adhésion, aucune organisation professionnelle d'employeurs ou des travailleurs ne peut être partie prenante à une convention collective préexistante. L'adhérent acquiert les droits et les devoirs des parties contractantes.\n\nToutefois, ils ne pourront pas faire usage du droit de dénonciation dans les deux années qui suivent leur adhésion."
  },
  {
    "numero": 287,
    "texte": "Lorsqu'une convention collective a été publiée au « Journal Officiel » le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions peut, à la demande d'une des parties et après avis de la commission paritaire prévue à l'article 284, décider l'extension de toutes ou de certaines dispositions à tous les employeurs et travailleurs compris dans le même secteur professionnel et territorial. Il peut décider, dans les mêmes conditions, l'abrogation d'une extension."
  },
  {
    "numero": 288,
    "texte": "Les modalités d'application des dispositions des articles 286 et 287 cidessus sont déterminées par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail."
  },
  {
    "numero": 289,
    "texte": "La convention collective a force obligatoire pour :\n1) tous les contractants ;\n2) les personnes physiques ou morales qu'ils représentent ;\n3) les personnes physiques ou morales qui sont ou deviennent membres des organisations professionnelles contractantes.\n\nLes dispositions d'une convention collective sont applicables à tous les travailleurs des catégories intéressées, employés dans la ou les entreprises visées par la convention, sauf disposition contraire de celle-ci."
  },
  {
    "numero": 290,
    "texte": "La convention collective étendue a force obligatoire pour les employeurs et les travailleurs auxquels elle est étendue."
  },
  {
    "numero": 291,
    "texte": "Les dispositions de la convention collective sont applicables nonobstant les dispositions contraires des contrats individuels de travail et des règlements d'entreprise ou toutes autres dispositions contraires convenues entre employeurs et travailleurs. Ces dispositions sont réputées remplacées par les dispositions de la convention collective.\n\nNe sont pas réputées contraires aux dispositions de la convention collective, celles qui sont considérées comme plus favorables pour les travailleurs qui en sont bénéficiaires."
  },
  {
    "numero": 292,
    "texte": "Les dispositions d'une convention collective ne peuvent restreindre les avantages résultant pour les travailleurs des conventions collectives dont le champ d'application est plus large.\n\nLa convention collective détermine dans quelle mesure les conventions collectives déjà existantes entre les parties ou certaines d'entre elles et d'application plus limitée restent en vigueur."
  },
  {
    "numero": 293,
    "texte": "Dans le cas de substitution d'employeur, le nouvel employeur est subrogé aux droits et obligations de l'employeur précédent.\n\nLa convention collective conserve force obligatoire pour les organisations professionnelles résultant de la scission d'une organisation qui est partie à la convention.\n\nEn cas de fusion, d'union, de confédération ou de fédération d'organisations professionnelles, dont l'une est partie à une convention collective, celle-ci étend sa force obligatoire à toute organisation professionnelle ainsi qu'à ses membres appartenant à l'organisation nouvelle, dans les limites du champ d'application de la convention."
  },
  {
    "numero": 294,
    "texte": "Les employeurs, les organisations professionnelles d'employeurs et de travailleurs, ainsi que ceux qui les représentent, parties à une convention collective sont tenus d'exécuter de bonne foi les engagements qui en résultent et de s'abstenir de tout ce qui est de nature à en compromettre la loyale exécution.\n\nLes organisations professionnelles d'employeurs et de travailleurs sont, en outre, tenues de veiller au respect par leurs membres des stipulations de la convention collective. Elles en sont garantes dans la mesure où la convention la détermine."
  },
  {
    "numero": 295,
    "texte": "La violation des obligations convenues donne droit aux parties à une action en dommages-intérêts dont les modalités et les limites peuvent être stipulées dans la convention."
  },
  {
    "numero": 296,
    "texte": "Les organisations professionnelles capables d'ester en justice et qui sont parties à la convention collective peuvent exercer toutes les actions qui naissent de cette convention en faveur de leurs membres sans avoir à justifier d'un mandat des intéressés, pourvu que ceux-ci n'aient pas déclaré s'y opposer. Les intéressés peuvent toujours intervenir dans la cause.\n\nLorsqu'une action, née de la convention collective, est intentée par une personne physique ou morale, toute autre personne contractante peut toujours intervenir dans la cause."
  },
  {
    "numero": 297,
    "texte": "Les litiges individuels et les conflits collectifs du travail sont soumis aux procédures instituées au présent Titre."
  },
  {
    "numero": 298,
    "texte": "Les litiges individuels ne sont pas recevables devant le Tribunal du Travail s'ils n'ont été préalablement soumis à la procédure de conciliation, à l'initiative de l'une des parties, devant l'Inspecteur du Travail du ressort."
  },
  {
    "numero": 299,
    "texte": "Cette procédure est interruptive des délais de prescription prévus à l'article 317 du présent Code, dès la réception de la demande de conciliation à l'Inspection du Travail, sous réserve toutefois que la demande devant le Tribunal du Travail, en cas de non-conciliation, soit formée dans le délai maximum de douze mois à compter de la réception du procès-verbal de non-conciliation par la partie la plus diligente."
  },
  {
    "numero": 300,
    "texte": "Lorsque l'Inspecteur du Travail est saisi d'un litige individuel du travail, il adresse, avec accusé de réception ou par pli recommandé, une invitation à comparaître en séance de conciliation dans la quinzaine.\n\nEn aucun cas, l'invitation ne peut obliger l'une des parties à se présenter dans moins de trois jours.\n\nL'Inspecteur du Travail procède à un échange de vues sur l'objet du litige et vérifie si les parties sont disposées à se concilier sur la base des normes fixées par la législation, la réglementation, les conventions collectives ou le contrat individuel de travail.\n\nLes parties peuvent se faire assister ou représenter.\n\nA la fin de ces échanges de vues, l'Inspecteur du Travail établit un procès-verbal constatant la conciliation ou la non-conciliation. Ce procès-verbal est signé par l'Inspecteur du Travail et les parties. Celles-ci en reçoivent ampliation.\n\nSi à la troisième invitation dûment reçue, une partie ne comparaît pas ou ne se fait pas représenter, l'Inspecteur du Travail établit un procès-verbal de carence valant constat de non-conciliation."
  },
  {
    "numero": 301,
    "texte": "En cas de conciliation, la partie la plus diligente fait apposer la formule exécutoire sur le procès-verbal auprès du Président du Tribunal de Travail compétent. Le Président du Tribunal de Travail compétent est celui dans le ressort duquel le procès-verbal de conciliation est signé. L'exécution est poursuivie comme un jugement du Tribunal de Travail."
  },
  {
    "numero": 302,
    "texte": "En cas d'échec total ou partiel de la tentative de conciliation prévue à l'article 300, le litige peut être soumis au Tribunal de Travail.\n\nSection 1 : La conciliation préalable des conflits collectifs de travail"
  },
  {
    "numero": 303,
    "texte": "Est réputé conflit collectif du travail, tout conflit survenu entre un ou\n\nplusieurs employeurs d'une part, et un certain nombre de membres de leur personnel d'autre part, portant sur les conditions de travail, lorsqu'il est de nature à compromettre la bonne marche de l'entreprise ou la paix sociale."
  },
  {
    "numero": 304,
    "texte": "Les conflits collectifs de travail ne sont recevables devant les Tribunaux de Travail que s'ils ont été préalablement soumis à la procédure de conciliation et de médiation, selon le cas, à l'initiative respectivement de l'une des parties devant l'inspecteur du Travail ou du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions ou du Gouverneur de province devant la commission de médiation."
  },
  {
    "numero": 305,
    "texte": "En cas de non conciliation, de conciliation partielle ou de recommandation frappées d'opposition, la demande est formée devant le Tribunal de Travail par l'une des parties dans le délai de 10 jours ouvrables à compter de l'expiration de préavis de grève ou de lock-out notifié à l'autre partie."
  },
  {
    "numero": 306,
    "texte": "A défaut de procédure conventionnelle de règlement, la procédure légale de conciliation et de médiation des conflits est fixée conformément aux articles 307 à 315 du présent Code."
  },
  {
    "numero": 307,
    "texte": "Le conflit collectif du travail est notifié par la partie la plus diligente à l'Inspecteur du Travail du ressort.\n\nToutefois, l'Inspecteur du Travail peut entamer la procédure de conciliation lorsqu'il a connaissance d'un conflit collectif qui ne lui a pas été notifié.\n\nDans les trois jours ouvrables de la notification, l'Inspecteur du Travail adresse, par porteur avec accusé de réception ou par pli recommandé, aux parties une invitation à comparaître en séance de conciliation dans la quinzaine, avec un préavis de 3 jours ouvrables minimum comptés à partir de la date de réception.\n\nDans les deux jours ouvrables de la réception de cette invitation les parties font, au préalable connaître à l'Inspecteur du Travail, par écrit, les noms des représentants qui ont qualité pour concilier. Ceux-ci peuvent s'adjoindre un délégué de leurs organisations professionnelles, dûment mandaté.\n\nSi une des parties ne comparaît pas, ne se fait pas représenter, ou si les représentants ne comparaissent pas, l'Inspecteur du Travail dresse le procès-verbal au vu duquel la juridiction compétente prononce la peine d'amende prévue à l'article 322 du présent Code.\n\nEn outre, l'Inspecteur du Travail établit un procès-verbal de carence valant constat de non-conciliation."
  },
  {
    "numero": 308,
    "texte": "L'Inspecteur du Travail procède avec les parties ou leurs représentants et sous sa présidence, à tout échange de vues sur l'objet du conflit.\n\nA l'issue de la tentative de conciliation, l'Inspecteur du Travail\n\nétablit un procès-verbal constatant soit l'accord, soit le désaccord total ou partiel des parties ; celles-ci contresignent le procès verbal et en reçoivent ampliation.\n\nL'accord de conciliation ou le désaccord doit être constaté dans le mois à dater de la première séance de conciliation.\n\nL'accord de conciliation est exécutoire dans les conditions fixées à l'article 314 du présent Code.\n\nSection 2 : De la médiation des conflits collectifs de travail"
  },
  {
    "numero": 309,
    "texte": "En cas de non-conciliation totale ou partielle, le conflit est obligatoirement soumis à la procédure légale de médiation, telle que définie aux articles 310 à 315 du présent Code.\n\nLorsque le conflit affecte un ou plusieurs établissements situés dans une seule province, l'Inspecteur du Travail du ressort transmet le dossier au Gouverneur de province dans les quarante huit heures de l'échec de la tentative de conciliation.\n\nLorsque le conflit affecte plusieurs établissements d'une même entreprise ou plusieurs entreprises situées dans plusieurs provinces, l'Inspecteur du Travail du ressort transmet le dossier dans le même délai, au Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions."
  },
  {
    "numero": 310,
    "texte": "Les conflits collectifs non réglés en conciliation par l'Inspecteur du Travail sont soumis à une Commission\n\nde médiation instituée spécialement à cet effet.\n\nLa Commission se compose du Président du Tribunal de Paix dans le ressort duquel est né le conflit ou d'un magistrat désigné par ses soins, d'un assesseur employeur et d'un assesseur travailleur. Elle est présidée par le Président du Tribunal de Paix ou le magistrat désigné par ses soins.\n\nLes assesseurs sont désignés sur propositions des organisations professionnelles les plus représentatives par :\n-\nle Gouverneur de province dans le cas visé au deuxième alinéa de l'article 309 ci-dessus ;\n-\nle Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions dans le cas visé au troisième alinéa du même article.\n\nLes assesseurs doivent être étrangers à l'établissement ou aux établissements affectés par le conflit.\n\nLa désignation des assesseurs et la transmission du dossier du conflit au Président de la Commission de médiation interviennent dans les quatre jours ouvrables de la réception par l'autorité compétente du procès-verbal de non conciliation."
  },
  {
    "numero": 311,
    "texte": "La Commission de médiation se réunit dans les trois jours ouvrables de la saisine. Elle ne peut se prononcer sur d'autres objets que ceux déterminés par le procès-verbal de non-conciliation ou ceux qui, résultant d'événements postérieurs à ce procès-verbal, sont la conséquence directe du conflit en cours.\n\nLa Commission se prononce en droit dans les conflits relatifs à l'interprétation et à l'exécution des actes législatifs ou réglementaires ou d'une convention collective. Elle se prononce en équité sur tous les autres conflits.\n\nElle jouit de plus larges pouvoirs pour s'informer de la situation économique des entreprises ou des établissements et de la situation des travailleurs intéressés par ce conflit.\n\nElle peut procéder à toute enquête auprès des entreprises ou établissements et des organisations professionnelles et requérir des parties, la production de tous les documents ou renseignements d'ordre économique, comptable, statistique, financier ou administratif susceptibles de lui être utiles pour l'accomplissement de sa mission. Elle peut également recourir aux offices d'experts.\n\nLes membres de la Commission sont tenus au secret professionnel en ce qui concerne les informations et les documents qui sont communiqués ainsi que les faits qui viendraient à leur connaissance dans l'accomplissement de leur mission.\n\nToutes les séances de la Commission se tiennent à huis-clos.\n\nLa Commission est tenue de terminer son instruction dans les 10 jours ouvrables à dater de la première séance.\n\nLorsque pendant le délibéré, il y a parité de voix, celle du Président est prépondérante. La décision rendue par écrit et signée par le Président et par les membres doit intervenir dans les 5 jours\n\nouvrables à partir de la prise de la cause en délibéré.\n\nA défaut de quoi, une Commission autrement composée sera désignée conformément aux dispositions de l'article 310 pour rendre impérativement sa décision endéans les 10 jours ouvrables à dater de son assignation."
  },
  {
    "numero": 312,
    "texte": "En cas d'accord, un procès-verbal est dressé par le Président de la Commission. Il est signé par les membres de la Commission et par les parties ou leurs représentants.\n\nCopie certifiée conforme du procès-verbal est délivrée gratuitement à l'Inspecteur du Travail, aux parties ou à leurs représentants."
  },
  {
    "numero": 313,
    "texte": "En cas de non-conciliation, la Commission formule des recommandations motivées qui sont immédiatement notifiées aux parties.\n\nCopie conforme des recommandations est délivrée gratuitement à l'Inspecteur du Travail et aux parties ou à leurs représentants.\n\nA l'expiration d'un délai de sept jours francs à compter de la notification aux parties et si aucune des parties n'a manifesté d'opposition, les recommandations acquièrent force exécutoire dans les conditions fixées à l'article 314 ci-après.\n\nL'opposition est formée, à peine de nullité, par lettre adressée au Président de la Commission et à l'autre partie. La partie qui forme opposition\n\nadresse, en même temps, un exemplaire de ladite lettre à l'Inspecteur du Travail du ressort."
  },
  {
    "numero": 314,
    "texte": "L'exécution d'un accord de conciliation intervenu soit devant l'Inspecteur du Travail, soit devant la Commission de médiation et celle des recommandations non frappées d'opposition sont obligatoires pour les parties intéressées.\n\nDans leur silence sur ce point, l'accord de conciliation et les recommandations portent effet à partir du jour de la notification du conflit du travail à l'Inspection du Travail.\n\nLes accords de conciliation et les recommandations non frappées d'opposition sont affichés dans les locaux des établissements affectés par le conflit et dans le bureau de l'Inspecteur du Travail du ressort.\n\nLes minutes des accords et recommandations sont déposées au greffe du Tribunal du Travail du lieu du conflit. La procédure de conciliation et de médiation est gratuite."
  },
  {
    "numero": 315,
    "texte": "La cessation collective du travail ou la participation à cette cessation collective du travail ne peut avoir lieu qu'à l'occasion d'un conflit collectif du travail et une fois que les moyens de règlement du conflit, conventionnels ou légaux ci-dessus, ont été régulièrement épuisés.\n\nSont interdits tous actes et toutes menaces tendant à contraindre un travailleur à participer à une cessation\n\ncollective du travail ou à empêcher le travail ou la reprise du travail.\n\nLorsqu'une cessation collective de travail est déclenchée à l'issue d'une procédure conventionnelle ou de la procédure légale de règlement, sont interdites toutes menaces, toutes représailles et mesures vexatoires à l'égard de travailleurs qui se proposent d'y participer ou qui y ont pris part.\n\nUn arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, pris après avis du Conseil National du Travail, fixe les modalités d'exécution du présent article."
  },
  {
    "numero": 316,
    "texte": "Une loi crée les Tribunaux du Travail et fixe leur organisation et leur fonctionnement."
  },
  {
    "numero": 317,
    "texte": "Les actions naissant du contrat de travail se prescrivent par trois ans après le fait qui a donné naissance à l'action, à l'exception :\n1) des actions en paiement du salaire qui se prescrivent par un an à compter de la date à laquelle le salaire est dû ,\n2) des actions en paiement des frais de voyage et de transport qui se prescrivent par deux ans après l'ouverture du droit au voyage, en cours d'exécution du contrat, ou après la rupture de ce dernier.\n\nLa prescription n'est interrompue que par a) la citation en justice ;\nb) l'arrêté de compte intervenu entre les parties mentionnant le solde dû au travailleur et demeuré impayé ;\nc) la réclamation formulée par le travailleur auprès de l'employeur, par lettre recommandée avec avis de réception ;\nd) la réclamation formulée par le travailleur devant l'Inspecteur du Travail, sous réserve des dispositions de l'article 299 du présent Code."
  },
  {
    "numero": 318,
    "texte": "Lorsqu'à l'expiration du délai de mise en demeure, l'employeur ou son préposé, persiste dans la violation des dispositions relatives aux articles 6 literas (a) et (e), 87, 119, 120, 121, 125, 126, 128, 133, 171, 177, 255, et leurs textes d'application ou d'exécution, s'il échet, le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions ou son délégué, sur proposition de l'Inspecteur du Travail, peut, sans préjudice des dispositions pénales prévues, ordonner la fermeture provisoire de tout ou partie de l'entreprise.\n\nPendant la fermeture, jusqu'au moment où il est mis fin aux irrégularités constatées, les salaires et autres avantages sociaux sont dus et il ne peut être mis fin au contrat en cours."
  },
  {
    "numero": 319,
    "texte": "Sans préjudice des dispositions de l'article 211 du présent code, le\n\nPrésident de la République peut, sur proposition du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions et après avis du Conseil National du Travail, fixer les taxes et redevances relevant des activités dévolues au Ministère du Travail et de la Prévoyance Sociale."
  },
  {
    "numero": 320,
    "texte": "Sans préjudice de l'action prévue à l'article 295, les auteurs des infractions aux dispositions d'une convention collective étendue en vertu de l'article 287 seront passibles d'une amende ne dépassant pas 7.500 F.C. constants."
  },
  {
    "numero": 321,
    "texte": "Sont punis d’une amende qui ne dépasse pas 20.000 Francs congolais constants, les auteurs des infractions aux dispositions :\n\n1) Des articles 6 points 1er à 4, 8, 18, 19, 20, 21, 25, 26, 33, alinéa 2, 40, 44, 47, 51, 55 alinéas 3, 56, 60, 64, 65, 66, 78, 79, 84, 89, 90, 98, 99, 100, 101, 103, 111, 112, 116, 119, 121, 122, 125, 128, 129, 133, 136, 137 alinéa 2, 138, 140, 141, 142, 143, 144, 145, 146, 148 alinéa 1, 152, 154, 157, 167, 176, 178, 181, 212, 213, 215, 216, 217, 218, 221, 229, 234, 258, 265, 268, 269 ;\n\n2) Des décrets prévus aux articles 87 et 123 ;\n\n3) Des arrêtés pris en application des articles 35, 38, 47, 56, 58, 94, 103, 112, 120, 121, 123, 124, 128, 139, 156, 158, 169, 171, 177, 207, 219, 222, 236 et 255.\n\nEst passible de la même peine, la partie à un litige individuel ou à un conflit de travail invitée devant l’inspecteur ou le contrôleur du travail, qui n’aura pas répondu à la troisième invitation qui lui aura été remise moyennant accusé de réception."
  },
  {
    "numero": 322,
    "texte": "Sans préjudice des dispositions des articles 133 à 135 du Code Pénal, est passible d'une peine de servitude pénale de 30 jours au maximum et d'une amende qui n'excède pas 30.000 F.C. constants ou de l'une de ces peines seulement, quiconque fait ou tente de faire obstacle à l'exercice des fonctions reconnues par le présent Code aux Inspecteurs et Contrôleurs du Travail et à la Commission de Médiation."
  },
  {
    "numero": 323,
    "texte": "Sans préjudice des dispositions du Code pénal, est puni d'une peine de servitude pénale d'un mois et d'une amende qui n'excède pas 25.000 F.C. constants ou de l'une de ces peines seulement quiconque :\na) use de violence, de menace ou de toute autre contrainte, de promesses mensongères ou de manœuvres frauduleuses soit pour engager ou se faire engager, pour s'opposer à un engagement, soit pour contraindre un travailleur à participer à une cessation collective du travail soit à empêcher le travail ou la reprise du travail ;\nb) incite un travailleur à refuser l'exécution des obligations qui lui sont imposées par la législation, la réglementation, la convention collective, le contrat individuel ou l'empêche de remplir ses obligations;\n\nc) détruit ou lacère volontairement le contrat écrit, rend illisibles les inscriptions qui y sont portées, les altère ou les modifie frauduleusement ;\nd) fait usage d'un contrat écrit ou d'un décompte dans lequel les inscriptions ont été détériorées ou modifiées frauduleusement ;\ne) enfreint la réglementation sur la protection de la main-d'oeuvre nationale."
  },
  {
    "numero": 324,
    "texte": "Est puni d'une peine de servitude pénale de deux mois au maximum et d'une amende de 25.000 FC constants ou de l'une de ces peines seulement :\na) quiconque aura porté ou tenté de porter atteinte soit à la libre désignation des représentants des travailleurs dans les établissements soit à l'exercice régulier de leurs fonctions ,\nb) tout employeur qui aura retenu ou utilisé dans son intérêt personnel ou pour les besoins de son entreprise les sommes ou titres remis en cautionnement."
  },
  {
    "numero": 325,
    "texte": "Sans préjudice des dispositions de la loi n° 82-001 du 7 janvier 1982 régissant la propriété industrielle, est puni d'une peine de servitude pénale de trois mois au maximum et d'une amende de 30.000 F.C. constants ou de l'une de ces peines seulement, celui qui aura frauduleusement divulgué ou communiqué à un concurrent ou à un tiers des secrets de fabrication ou d'affaires de son employeur, ou se livrera ou coopérera à tout acte de concurrence déloyale."
  },
  {
    "numero": 326,
    "texte": "Sans préjudice des lois pénales prévoyant des peines plus sévères, sera puni d'une peine de servitude pénale principale de six mois au maximum et d'une amende de 30.000 F.C. constants ou de l'une de ces peines seulement, quiconque aura contrevenu aux dispositions des articles 2 alinéa 2, 3, 173 et 315 du présent Code."
  },
  {
    "numero": 327,
    "texte": "Sans préjudice des peines disciplinaires prévues au statut du personnel de carrière des services publics de l'Etat, l'Inspecteur ou le Contrôleur du Travail qui révélera les secrets et procédés indiqués à l'article 194 ou violera les obligations de réserve prescrites à l'article 198 sera puni des peines prévues à l'article 73 du Code pénal.."
  },
  {
    "numero": 328,
    "texte": "En ce qui concerne :\na) les infractions aux dispositions de l'article 215, l'amende est appliquée autant de fois qu'il y a de travailleurs non inscrits ou de renseignements omis,\nb) les infractions aux dispositions des articles 55 alinéa 3, 56, 79, 86, 89, 98, 99, 112, 113, 120, 121, 125, 126, 128, 133, 137 alinéa 2, 140, 141, 234, l'amende est appliquée autant de fois qu'il y a des travailleurs concernés par l'infraction.\nc)\nToutefois, le montant total des amendes infligées en vertu du présent article ne peut excéder cinquante fois les taux maxima prévus aux articles ci-dessus."
  },
  {
    "numero": 329,
    "texte": "Les employeurs sont civilement responsables du paiement des amendes prononcées à charge de leurs préposés en vertu du présent Titre."
  },
  {
    "numero": 330,
    "texte": "Les dispositions du présent Code sont de plein droit applicables aux contrats individuels en cours sous réserve que les travailleurs continuent à bénéficier des avantages qui leur ont été consentis antérieurement lorsque ceux-ci sont supérieurs à ceux que leur reconnaît le présent Code.\n\nElles ne peuvent constituer une cause de rupture de ces contrats.\n\nToute clause d'un contrat en cours qui ne serait pas conforme aux dispositions du présent Code, d'un décret ou d'un arrêté pris pour son application, sera modifiée dans un délai de six mois à compter de leur publication.\n\nEn cas de refus de l'une des parties, la juridiction compétente pourra ordonner, sous peine d'astreinte, de procéder aux modifications qui seront jugées nécessaires."
  },
  {
    "numero": 331,
    "texte": "Les organisations professionnelles d'employeurs et de travailleurs, agréées par application du Code du Travail annexé à l'ordonnance-loi n° 67-310 du 9 août 1967 seront enregistrées d'office par le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions.\n\nToutefois, ces organisations auront à conformer leurs statuts aux dispositions révisées du présent Code dans un délai maximum de six mois à compter de son entrée en vigueur. Passé ce délai, les organisations défaillantes seront radiées du registre, par arrêté du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions."
  },
  {
    "numero": 332,
    "texte": "Le présent Code abroge et remplace toutes dispositions législatives antérieurement en vigueur en matière du travail.\n\nréglementation en matière du travail non-contraires aux dispositions du présent Code restent en vigueur."
  },
  {
    "numero": 333,
    "texte": "Les décrets du Président de la République et les arrêtés du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions, prévus par le présent Code, devront être pris dans le délai maximum d'un an à partir de sa publication au « Journal Officiel »."
  },
  {
    "numero": 334,
    "texte": "La présente loi entre en vigueur à la date de sa promulgation.\n\nFait à Kinshasa, le 16 octobre 2002.\n\nJoseph KABILA"
  }
];
  const articles = SOURCE_ARTICLES.map(function (article) {
    const section = TITRES.find(function (item) { return article.numero >= item.min && article.numero <= item.max; });
    return { numero: article.numero, titre: "Article " + article.numero, contenu: article.texte, texte: article.texte, categorie: section ? section.categorie : "Dispositions légales", titreSection: section ? section.titre : "Code du Travail", sanction: "" };
  });
  window.CODE_TRAVAIL_DB = articles;
  window.CodeTravailDatabase = {
    version: "2002-base-consolidation-ciblee-2016-v2",
    source: "Loi n° 015/2002 du 16 octobre 2002 et consolidations ciblées de la Loi n° 16/010 du 15 juillet 2016",
    note: "Les articles 62, 119, 121, 190 et 321 ont été actualisés à partir de la Loi n° 16/010 du 15 juillet 2016. Les autres modifications de 2016 ne sont pas toutes intégrées.",
    total: articles.length,
    titres: TITRES,
    articles: articles,
    getArticle: function (numero) { return articles.find(function (item) { return item.numero === Number(numero); }) || null; },
    getArticlesByCategory: function (categorie) { return articles.filter(function (item) { return item.categorie === categorie; }); }
  };
})();
