/* ==================================================================
   SMIG-DATA.JS — Base officielle SMIG RDC
   Source : Décret n° 25/22 du 30 mai 2025 (Judith SUMINWA TULUKA)
   ================================================================== */

const SMIG_DATA = {

  decret: {
    numero: "25/22",
    date: "30 mai 2025",
    signataires: ["Judith SUMINWA TULUKA (Première Ministre)", 
                  "Éphraïm AKWAKWA NAMETU (Ministre Emploi & Travail)"],
    abroge: "Décret n° 18/017 du 22 mai 2018"
  },

  // Taux journalier du SMIG manœuvre ordinaire (Article 2 & 3)
  smigManoeuvre: {
    palier1: { debut: "2025-05-22", fin: "2025-12-31", montant: 14500 },
    palier2: { debut: "2026-01-01", fin: null, montant: 21500 }
  },

  // Multiplicateurs Article 7
  multiplicateurs: {
    hebdomadaire: 6,
    mensuel: 26,
    annuel: 312
  },

  // Allocations familiales (Article 5) : 1/27 du SMIG manœuvre ordinaire par enfant
  allocationFamilialeRatio: 1/27,

  // Contre-valeur logement (Article 6) : 1/5 des allocations familiales
  contreValeurLogementRatio: 1/5,

  // Barème complet des tensions salariales (Guide Buzitu — Palier 1 : mai-déc 2025)
  bareme: [
    { cat:"I",   ech:"M.O",  classe:1,  tension:100,  smigJour:14500,  smigMois:377000,   logement:113100, fonctions:"Balayeur, Nettoyeur, Classeur BAC" },
    { cat:"I",   ech:"M.L",  classe:2,  tension:116,  smigJour:16820,  smigMois:437320,   logement:131196, fonctions:"Gardien de jour, Portier, Porteur, Manutentionnaire, Presseur, Pousseur" },
    { cat:"II",  ech:"M.S",  classe:3,  tension:133,  smigJour:19285,  smigMois:501410,   logement:150423, fonctions:"Gardien de nuit, Emballeur, Huissier, Planton, Convoyeur, Jardinier, Cuisinier, Réceptionniste, Agent courrier, Lavandier, Pétrisseur, Fourrier, Diviseur pâte, Coupeur pâte" },
    { cat:"III", ech:"S.Q1", classe:4,  tension:154,  smigJour:22330,  smigMois:580580,   logement:174174, fonctions:"Compteur pains, Agents de sécurité, Livreur" },
    { cat:"III", ech:"S.Q2", classe:5,  tension:178,  smigJour:25810,  smigMois:671060,   logement:201318, fonctions:"Vendeur, Serveur, Facturier, Pointeur, Compteur monnaie" },
    { cat:"III", ech:"S.Q3", classe:6,  tension:206,  smigJour:29870,  smigMois:776620,   logement:232986, fonctions:"Aide-Comptable, Caissier, Recouvreur, Chauffeur" },
    { cat:"IV",  ech:"Q1",   classe:7,  tension:237,  smigJour:34365,  smigMois:893490,   logement:268047, fonctions:"Chef de rayon, Gestionnaire de dépôt, Chef de dépôt" },
    { cat:"IV",  ech:"Q2",   classe:8,  tension:274,  smigJour:39730,  smigMois:1032980,  logement:309894, fonctions:"Électricien, Agent Relations Publiques, Électronicien, Opérateur de saisie, Secrétaire, Boucher, Frigoriste, Comptable, Assistant en Pharmacie" },
    { cat:"V",   ech:"H.Q",  classe:9,  tension:317,  smigJour:45965,  smigMois:1195090,  logement:358527, fonctions:"Agent marketing" },
    { cat:"VI",  ech:"M1",   classe:10, tension:365,  smigJour:52925,  smigMois:1376050,  logement:412815, fonctions:"Maîtrise M1" },
    { cat:"VI",  ech:"M2",   classe:11, tension:422,  smigJour:61190,  smigMois:1590940,  logement:477282, fonctions:"Maîtrise M2" },
    { cat:"VI",  ech:"M3",   classe:12, tension:488,  smigJour:70760,  smigMois:1839760,  logement:551928, fonctions:"Maîtrise M3" },
    { cat:"VI",  ech:"M4",   classe:13, tension:564,  smigJour:81780,  smigMois:2126280,  logement:637884, fonctions:"Chef du personnel, Pharmacien, Maître de l'Hôtel" },
    { cat:"VII", ech:"CC1",  classe:14, tension:651,  smigJour:94395,  smigMois:2454270,  logement:736281, fonctions:"Gérant" },
    { cat:"VII", ech:"CC2",  classe:15, tension:752,  smigJour:109040, smigMois:2835040,  logement:850512, fonctions:"Cadre de collaboration CC2" },
    { cat:"VII", ech:"CC3",  classe:16, tension:868,  smigJour:125000, smigMois:3272360,  logement:981708, fonctions:"Cadre de collaboration CC3" },
    { cat:"VII", ech:"CC4",  classe:17, tension:1000, smigJour:145000, smigMois:3770000,  logement:1131000,fonctions:"Cadre de collaboration CC4 (sommet)" }
  ],

  // Préavis légal RDC (Code du travail + pratique inspection)
  preavis: {
    manoeuvre:   { base: 14, parAnnee: 7  },   // Cat I à III
    classifie:   { base: 14, parAnnee: 7  },   // agent classifié
    maitrise:    { base: 26, parAnnee: 9  },   // agent de maîtrise
    cadre:       { base: 78, parAnnee: 16 }    // cadres de collaboration
  },

  // Retenues légales (taux standards RDC)
  retenues: {
    inss:  0.05,   // 5% part travailleur (CNSS)
    onem:  0.002,  // 0.2% ONEM
    inpp:  0.01,   // 1% INPP (part travailleur — variable selon secteur)
    ipr:   "bareme_progressif"   // Impôt Professionnel sur Rémunération (barème)
  },

  // Barème IPR RDC (tranches annuelles en FC — simplifié)
  ipr_bareme: [
    { min: 0,       max: 1944000,  taux: 0.03 },
    { min: 1944001, max: 21600000, taux: 0.15 },
    { min: 21600001,max: 43200000, taux: 0.30 },
    { min: 43200001,max: Infinity, taux: 0.40 }
  ],

  // Congés annuels (Code du travail RDC — Art. 140)
  conges: {
    joursParAn: 18,             // travailleurs adultes
    joursParAnMineur: 26,       // < 18 ans
    jourSupplementaireApres: 3, // + 1 jour ouvrable par 3 années d'ancienneté
    joursOuvrablesAn: 365
  },

  // Ration et transport (indicatifs — varient par province)
  ration: {
    tauxJournalier: 1000,       // valeur type Kinshasa
    joursMoisStandard: 26
  }
};

// Récupérer le SMIG actuel selon la date
SMIG_DATA.getSmigActuel = function(dateRef = new Date()) {
  const d = new Date(dateRef);
  if (d >= new Date(this.smigManoeuvre.palier2.debut)) 
    return this.smigManoeuvre.palier2.montant;
  return this.smigManoeuvre.palier1.montant;
};

// Trouver la classe par fonction
SMIG_DATA.trouverClasse = function(fonction) {
  const f = fonction.toLowerCase().trim();
  return this.bareme.find(row => 
    row.fonctions.toLowerCase().includes(f)
  ) || null;
};

// Export global
if (typeof window !== 'undefined') window.SMIG_DATA = SMIG_DATA;
if (typeof module !== 'undefined') module.exports = SMIG_DATA;
