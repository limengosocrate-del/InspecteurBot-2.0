/**
 * Contrôleur des Procès-Verbaux.
 * @module controllers/pv.controller
 */
const db = require('../config/database');
const crypto = require('crypto');

const genId = () => 'pv_' + crypto.randomBytes(8).toString('hex');

exports.creer = async (req, res) => {
  try {
    const { type, numero, province, direction_provinciale, entreprise, inspecteur, donnees } = req.body;

    // Anti-doublon numéro
    if (numero) {
      const exist = await db.get2('SELECT id FROM pv WHERE numero = ?', [numero]);
      if (exist) return res.status(409).json({ erreur: 'Numéro déjà utilisé (doublon interdit).' });
    }

    const id = genId();
    await db.run2(
      `INSERT INTO pv (id, type, numero, province, direction_provinciale, entreprise, inspecteur, donnees, statut)
       VALUES (?,?,?,?,?,?,?,?, 'brouillon')`,
      [id, type, numero, province, direction_provinciale, entreprise, inspecteur, JSON.stringify(donnees || {})]
    );
    await journaliser('creation', `PV ${numero || id} créé`, inspecteur);
    res.status(201).json({ id, message: 'PV créé.' });
  } catch (e) { res.status(500).json({ erreur: e.message }); }
};

exports.lister = async (req, res) => {
  try {
    const { statut, province, entreprise } = req.query;
    let sql = 'SELECT * FROM pv WHERE 1=1', params = [];
    if (statut)     { sql += ' AND statut = ?'; params.push(statut); }
    if (province)   { sql += ' AND province = ?'; params.push(province); }
    if (entreprise) { sql += ' AND entreprise LIKE ?'; params.push(`%${entreprise}%`); }
    sql += ' ORDER BY date_creation DESC';
    const rows = await db.all2(sql, params);
    res.json(rows.map(r => ({ ...r, donnees: JSON.parse(r.donnees || '{}') })));
  } catch (e) { res.status(500).json({ erreur: e.message }); }
};

exports.obtenir = async (req, res) => {
  try {
    const row = await db.get2('SELECT * FROM pv WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ erreur: 'PV introuvable.' });
    row.donnees = JSON.parse(row.donnees || '{}');
    res.json(row);
  } catch (e) { res.status(500).json({ erreur: e.message }); }
};

exports.mettreAJour = async (req, res) => {
  try {
    const { id } = req.params;
    const ancien = await db.get2('SELECT * FROM pv WHERE id = ?', [id]);
    if (!ancien) return res.status(404).json({ erreur: 'PV introuvable.' });

    // Sauvegarde de version (archivage automatique)
    await db.run2('INSERT INTO pv_versions (pv_id, snapshot) VALUES (?, ?)', [id, ancien.donnees]);

    const { donnees, statut, numero, entreprise, total_general, identifiant_unique, qr_code } = req.body;
    await db.run2(
      `UPDATE pv SET donnees=?, statut=COALESCE(?,statut), numero=COALESCE(?,numero),
       entreprise=COALESCE(?,entreprise), total_general=COALESCE(?,total_general),
       identifiant_unique=COALESCE(?,identifiant_unique), qr_code=COALESCE(?,qr_code),
       date_modification=CURRENT_TIMESTAMP WHERE id=?`,
      [JSON.stringify(donnees||{}), statut, numero, entreprise, total_general, identifiant_unique, qr_code, id]
    );
    await journaliser('modification', `PV ${numero || id} modifié`);
    res.json({ message: 'PV mis à jour.' });
  } catch (e) { res.status(500).json({ erreur: e.message }); }
};

exports.supprimer = async (req, res) => {
  try {
    const { id } = req.params;
    // Archivage sécurisé avant suppression
    await db.run2("UPDATE pv SET statut='archive' WHERE id=?", [id]);
    await journaliser('archivage', `PV ${id} archivé`);
    res.json({ message: 'PV archivé (suppression sécurisée).' });
  } catch (e) { res.status(500).json({ erreur: e.message }); }
};

exports.versions = async (req, res) => {
  try {
    const rows = await db.all2('SELECT * FROM pv_versions WHERE pv_id=? ORDER BY version_date DESC', [req.params.id]);
    res.json(rows);
  } catch (e) { res.status(500).json({ erreur: e.message }); }
};

async function journaliser(type, description, utilisateur = 'système') {
  await db.run2('INSERT INTO journal (type, description, utilisateur) VALUES (?,?,?)',
    [type, description, utilisateur]);
}
