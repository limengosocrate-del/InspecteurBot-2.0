/**
 * Contrôleur des statistiques.
 * @module controllers/stats.controller
 */
const db = require('../config/database');

exports.tableauBord = async (req, res) => {
  try {
    const total = await db.get2('SELECT COUNT(*) n FROM pv');
    const parStatut = await db.all2('SELECT statut, COUNT(*) n FROM pv GROUP BY statut');
    const entreprises = await db.get2('SELECT COUNT(DISTINCT entreprise) n FROM pv WHERE entreprise IS NOT NULL');
    const amendes = await db.get2('SELECT SUM(total_general) s FROM pv');
    const journal = await db.all2('SELECT * FROM journal ORDER BY date DESC LIMIT 10');

    res.json({
      total: total.n,
      parStatut: Object.fromEntries(parStatut.map(r => [r.statut, r.n])),
      entreprisesControlees: entreprises.n,
      totalAmendes: amendes.s || 0,
      activiteRecente: journal
    });
  } catch (e) { res.status(500).json({ erreur: e.message }); }
};

exports.parProvince = async (req, res) => {
  try {
    const rows = await db.all2('SELECT province, COUNT(*) n FROM pv GROUP BY province ORDER BY n DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ erreur: e.message }); }
};
