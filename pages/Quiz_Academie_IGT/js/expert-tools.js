/* ==========================================================================
   INSPECTEURBOT RDC - ACADÉMIE IGT
   Module Expert Tools: Glossaire Juridique, Moteur 65 Infractions,
   Générateur de PV / Mises en Demeure & Calculateur de Décompte Final
   ========================================================================== */

const RDC_LEGAL_GLOSSARY = [
  { term: "Allocation Congé", def: "Rémunération due au travailleur pendant la période de congé payé, égale au salaire habituel majoré des avantages en nature. (Art 142 CT)" },
  { term: "Attestation de Services Rendus", def: "Document obligatoire délivré par l'employeur au travailleur à l'expiration du contrat, dans un délai maximum de 2 jours ouvrables. (Art 79 CT)" },
  { term: "Bilan Social", def: "Document annuel récapitulatif de la situation de l'emploi, des conditions de travail et des rémunérations adressé à l'ONEM. (Art 218 CT)" },
  { term: "Cadre de Collaboration", def: "Catégorie professionnelle supérieure regroupant les cadres administratifs et techniques (Tension 651 au SMIG 2025)." },
  { term: "Comité d'Hygiène et Sécurité (CHSE)", def: "Organe paritaire obligatoire dans tout établissement occupant au moins 50 travailleurs pour la prévention des risques. (Art 167 CT & Arrêté 0013)" },
  { term: "DASMO", def: "Déclaration Annuelle de la Situation de la Main d'Œuvre transmise à la Direction Provinciale de l'ONEM avant le 31 janvier. (Arrêté 087/2023)" },
  { term: "Décompte Final", def: "Ensemble des sommes dues au travailleur à la fin de son contrat (salaire, congés, préavis, indemnités). Doit être payé sous 2 jours ouvrables. (Art 100 CT)" },
  { term: "Délégué Syndical", def: "Représentant élu des travailleurs bénéficiant d'une protection légale spéciale contre le licenciement. (Art 255 CT)" },
  { term: "Emplois Interdits aux Étrangers", def: "Ensemble des postes exclusivement réservés aux nationaux congolais selon l'Arrêté Départemental 86/001." },
  { term: "Heures Supplémentaires", def: "Heures effectuées au-delà de 45 heures par semaine ou 9h par jour, donnant lieu à majorations légales (30%, 60%, 100%). (Art 119 CT)" },
  { term: "Mise en Demeure (MD)", def: "Acte administratif rédigé par l'Inspecteur du Travail accordant un délai ferme à l'employeur pour régulariser une infraction constatée." },
  { term: "Procès-Verbal de Constat d'Infraction (PV CI)", def: "Acte authentique dressé par l'Inspecteur du Travail faisant foi jusqu'à preuve du contraire et transmis au Parquet. (Art 192 CT)" },
  { term: "Quotité Saisissable", def: "Fraction maximale du salaire (maximum 1/3) pouvant être saisie ou retenue pour dettes. (Art 110 CT)" },
  { term: "SMIG 2025", def: "Salaire Minimum Interprofessionnel Garanti fixé par le Décret 25/22 du 30 mai 2025 révisant le barème salarial national." }
];

class ExpertToolsEngine {
  constructor() {
    this.glossary = RDC_LEGAL_GLOSSARY;
  }

  getGlossary() {
    return this.glossary;
  }

  searchGlossary(termQuery) {
    if (!termQuery) return this.glossary;
    const q = termQuery.toLowerCase();
    return this.glossary.filter(g => g.term.toLowerCase().includes(q) || g.def.toLowerCase().includes(q));
  }

  calculateDecompteFinal(salaireMensuel, ancienneteAnnees, joursCongeNonPris, isAbusif = false) {
    const joursPreavis = 14 + (7 * ancienneteAnnees);
    const tauxJournalier = salaireMensuel / 26;
    const montantPreavis = Math.round(joursPreavis * tauxJournalier);

    const montantConge = Math.round(joursCongeNonPris * tauxJournalier);

    let montantAbusif = 0;
    if (isAbusif) {
      const moisDommages = Math.min(36, Math.max(3, ancienneteAnnees * 2));
      montantAbusif = Math.round(moisDommages * salaireMensuel);
    }

    const totalDecompte = montantPreavis + montantConge + montantAbusif;

    return {
      joursPreavis,
      montantPreavis,
      montantConge,
      montantAbusif,
      totalDecompte
    };
  }

  generateOfficialPVHTML(data) {
    const todayStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const pvRef = `PV-CI-IGT-${Math.floor(1000 + Math.random() * 9000)}/2026`;

    return `
      <div class="certificate-frame" style="background:#fff; color:#0f172a; text-align:left; font-family:serif; border:3px double #1e293b;">
        <div style="text-align:center; border-bottom:2px solid #0f172a; padding-bottom:1rem; margin-bottom:1.5rem;">
          <h2 style="font-size:1.1rem; text-transform:uppercase; font-weight:900;">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</h2>
          <h3 style="font-size:0.95rem; color:#475569; font-weight:800; text-transform:uppercase;">MINISTÈRE DE L'EMPLOI, TRAVAIL .</h3>
          <h3 style="font-size:1.2rem; font-weight:900; color:#0f172a; margin-top:0.25rem;">INSPECTION GÉNÉRALE DU TRAVAIL</h3>
          <div style="font-size:0.8rem; font-weight:800; color:#d97706; margin-top:0.25rem;">RÉFÉRENCE : ${pvRef}</div>
        </div>

        <h3 style="text-align:center; font-size:1.3rem; font-weight:900; margin-bottom:1.5rem; text-transform:uppercase; text-decoration:underline;">
          PROCÈS-VERBAL DE CONSTAT D'INFRACTION
        </h3>

        <p style="margin-bottom:1rem; line-height:1.6;">
          L'an deux mille vingt-six, le <strong>${todayStr}</strong>, devant nous, <strong>${data.inspectorName || "Inspecteur du Travail"}</strong>, assermenté près l'Inspection Générale du Travail de la République Démocratique du Congo ;
        </p>

        <p style="margin-bottom:1rem; line-height:1.6;">
          Agissant en vertu des pouvoirs conférés par les articles 187 à 200 du Code du Travail de la RDC ;<br>
          Avons procédé au contrôle légal au sein de l'établissement : <strong>${data.companyName || "Société Nationale SARL"}</strong>, situé à l'adresse : <em>${data.address || "Kinshasa Gombe"}</em>.
        </p>

        <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:1rem; border-radius:6px; margin:1.5rem 0;">
          <h4 style="font-weight:800; color:#991b1b; margin-bottom:0.5rem;">INFRACTION LÉGALE CONSTATÉE :</h4>
          <p style="font-size:0.95rem; font-weight:700;">${data.infractionTitle || "Non-respect de la réglementation sur le SMIG et absence d'affichage des horaires"}</p>
          <p style="font-size:0.85rem; color:#475569; margin-top:0.25rem;"><strong>Référence Légale :</strong> ${data.legalRef || "Articles 119, 218 et 321 du Code du Travail RDC"}</p>
        </div>

        <p style="margin-bottom:1.5rem; line-height:1.6;">
          <strong>DECISION ADMINISTRATIVE :</strong> L'employeur est enjoint de se conformer immédiatement aux dispositions légales édictées ci-dessus sous peine des poursuites pénales prévues aux articles 321 à 324 du Code du Travail.
        </p>

        <div style="display:flex; justify-content:space-between; margin-top:3.5rem; padding-top:1rem; border-top:1px dashed #94a3b8;">
          <div>
            <strong>L'Employeur ou son Préposé :</strong><br><br><br>
            ______________________
          </div>
          <div style="text-align:right;">
            <strong>L'Inspecteur du Travail Instrumentant :</strong><br><br><br>
            ______________________
          </div>
        </div>
      </div>
    `;
  }
}

window.expertToolsEngine = new ExpertToolsEngine();
