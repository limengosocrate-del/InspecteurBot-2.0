/**
 * Connexion base de données (SQLite par défaut).
 * @module config/database
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const db = new sqlite3.Database(path.join(__dirname, '../../database/inspecteurbot.db'));

// Initialisation du schéma
const schema = fs.readFileSync(path.join(__dirname, '../../database/schema.sql'), 'utf8');
db.exec(schema, err => { if (err) console.error('Erreur schéma:', err); });

// Helpers promisifiés
db.run2 = (sql, params = []) => new Promise((res, rej) =>
  db.run(sql, params, function (e) { e ? rej(e) : res(this); }));
db.get2 = (sql, params = []) => new Promise((res, rej) =>
  db.get(sql, params, (e, row) => e ? rej(e) : res(row)));
db.all2 = (sql, params = []) => new Promise((res, rej) =>
  db.all(sql, params, (e, rows) => e ? rej(e) : res(rows)));

module.exports = db;
