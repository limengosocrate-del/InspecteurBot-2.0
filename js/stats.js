/* ==================================================================
   STATS.JS — Statistiques des contrôles et missions
   ================================================================== */

const STATS = {

  // Calculer les statistiques globales
  calculer() {
    const decomptes = JSON.parse(localStorage.getItem("igt_decomptes") || "[]");
    const missions = JSON.parse(localStorage.getItem("igt_missions") || "[]");
    const conversations = JSON.parse(localStorage.getItem("igt_ai_memory") || "[]");
    const historique = JSON.parse(localStorage.getItem("igt_historique") || "[]");

    // Décomptes par motif
    const motifs = {};
    let totalNet = 0, totalBrut = 0;
    decomptes.forEach(d => {
      const m = d.travailleur.motif || "inconnu";
      motifs[m] = (motifs[m] || 0) + 1;
      totalNet += d.netAPayer || 0;
      totalBrut += d.totalBrut || 0;
    });

    // Alertes SMIG
    const sousPaiement = decomptes.filter(d => d.alerteSmig).length;

    // Par mois
    const parMois = {};
    decomptes.forEach(d => {
      const mois = new Date(d.dateEmission).toLocaleDateString("fr-FR", {year:"numeric", month:"short"});
      parMois[mois] = (parMois[mois] || 0) + 1;
    });

    // Fiches utilisées
    const fiches = JSON.parse(localStorage.getItem("igt_fiches") || "[]");

    return {
      totaux: {
        decomptes: decomptes.length,
        missions: missions.length,
        conversations: conversations.length,
        fiches: fiches.length,
        totalNetVerse: totalNet,
        totalBrutCalcule: totalBrut,
        sousPaiementDetecte: sousPaiement
      },
      motifs,
      parMois,
      dernieresActivites: [
        ...decomptes.slice(0,5).map(d => ({ type:"Décompte", ref:d.numero, date:d.dateEmission, desc:d.travailleur.nomComplet })),
        ...missions.slice(0,5).map(m => ({ type:"Mission", ref:m.id, date:m.timestamp, desc:m.nom }))
      ].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,10)
    };
  },

  // Générer graphique en barres (SVG pur, sans librairie)
  barChart(data, width=500, height=200) {
    const entries = Object.entries(data);
    if (!entries.length) return "<p>Aucune donnée</p>";
    const max = Math.max(...entries.map(([,v]) => v));
    const barW = width / entries.length - 10;
    let svg = `<svg width="${width}" height="${height+40}" style="background:rgba(0,0,0,0.2); border-radius:8px;">`;
    entries.forEach(([label, val], i) => {
      const h = (val / max) * height;
      const x = i * (barW + 10) + 5;
      const y = height - h + 10;
      svg += `<rect x="${x}" y="${y}" width="${barW}" height="${h}" fill="#FFD700" rx="4">
              <title>${label}: ${val}</title></rect>`;
      svg += `<text x="${x + barW/2}" y="${y - 5}" fill="#FFD700" font-size="12" text-anchor="middle">${val}</text>`;
      svg += `<text x="${x + barW/2}" y="${height + 25}" fill="#fff" font-size="10" text-anchor="middle">${label.substring(0,10)}</text>`;
    });
    svg += `</svg>`;
    return svg;
  }
};

if (typeof window !== 'undefined') window.STATS = STATS;
