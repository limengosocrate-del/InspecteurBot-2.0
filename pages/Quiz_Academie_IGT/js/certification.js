/* ==========================================================================
   INSPECTEURBOT RDC - ACADÉMIE IGT
   Module Certification: Badges & Official Certificate Generator
   ========================================================================== */

const OFFICIAL_BADGES = [
  { id: "BADGE-1", title: "Inspecteur Débutant", minLevel: 1, icon: "🌱", desc: "A réussi le Niveau 1 - Initiation au Droit du Travail" },
  { id: "BADGE-2", title: "Contrôleur Certifié", minLevel: 3, icon: "🔍", desc: "A maîtrisé les visites de contrôle et fiches F01-F07" },
  { id: "BADGE-3", title: "Inspecteur Professionnel", minLevel: 4, icon: "⚖️", desc: "A validé le contrôle légal, enquêtes et procès-verbaux" },
  { id: "BADGE-4", title: "Directeur", minLevel: 5, icon: "👔", desc: "A accédé aux compétences de direction et supervision" },
  { id: "BADGE-5", title: "Inspecteur Général", minLevel: 7, icon: "👑", desc: "A atteint le grade suprême de l'Inspection Générale" }
];

class CertificationEngine {
  constructor() {
    this.badges = OFFICIAL_BADGES;
  }

  checkEarnedBadges(profile) {
    const earned = [];
    this.badges.forEach(b => {
      if (profile.niveauActuel >= b.minLevel) {
        earned.push(b);
      }
    });
    profile.badges = earned.map(b => b.id);
    window.persistenceEngine.saveProfile(profile);
    return earned;
  }

  generateCertificateHTML(candidateName, levelNum, gradeTitle, scorePct) {
    const certId = `IGT-CERT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const issueDate = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

    return `
      <div class="certificate-frame" id="printable-certificate">
        <div style="text-align:center; margin-bottom:1rem;">
          <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='%23d97706'><path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/></svg>" alt="IGT Logo" style="height:50px;">
        </div>
        <div class="cert-header">République Démocratique du Congo</div>
        <div style="font-size:0.95rem; font-weight:800; color:#1e293b; text-transform:uppercase; letter-spacing:0.1em; margin-top:0.25rem;">Ministère de l'Emploi, Travail .</div>
        <div style="font-size:1.15rem; font-weight:900; color:#0f172a; margin-top:0.35rem;">INSPECTION GÉNÉRALE DU TRAVAIL (IGT)</div>

        <div class="cert-subtitle" style="margin-top:1.5rem;">CERTIFICAT D'APTITUDE PROFESSIONNELLE</div>
        <p style="margin-top:1rem; color:#475569; font-size:0.95rem;">Le présent certificat officiel est décerné à :</p>
        
        <div class="cert-recipient">${candidateName || "Inspecteur / Agent IGT"}</div>

        <p style="color:#334155; font-size:1rem; line-height:1.6; max-width:600px; margin:0 auto;">
          Pour avoir démontré une maîtrise conforme aux exigences légales et réglementaires de la République Démocratique du Congo et validé l'examen de passage officiel du <strong>Niveau ${levelNum} — Grade : ${gradeTitle}</strong> avec un score de <strong>${scorePct}%</strong>.
        </p>

        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:3.5rem; padding-top:1.5rem; border-top:1px solid #cbd5e1;">
          <div style="text-align:left;">
            <div style="font-size:0.75rem; color:#64748b;">Code de vérification unique :</div>
            <div style="font-weight:800; font-family:monospace; color:#0f172a;">${certId}</div>
            <div style="font-size:0.75rem; color:#64748b; margin-top:0.2rem;">Délivré à Kinshasa le : ${issueDate}</div>
          </div>

          <div style="text-align:center; min-width:200px;">
            <div style="height:45px;"></div>
            <div style="font-size:0.8rem; font-weight:800; color:#0f172a; border-top:1px solid #94a3b8; padding-top:0.3rem;">
              Inspecteur Général du Travail
            </div>
          </div>
        </div>

        <div class="official-footer" style="margin-top:1.5rem; border-top:none; color:#94a3b8; font-size:0.75rem;">
          InspecteurBot RDC — Académie IGT © 2026 | Développé Par Inspecteur limengo (Pmiller) 2026©
        </div>
      </div>
    `;
  }
}

window.certificationEngine = new CertificationEngine();
