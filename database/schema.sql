-- Schéma base de données InspecteurBot PV
CREATE TABLE IF NOT EXISTS pv (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  numero TEXT UNIQUE,
  sequence INTEGER,
  statut TEXT DEFAULT 'brouillon',
  province TEXT,
  direction_provinciale TEXT,
  entreprise TEXT,
  inspecteur TEXT,
  donnees JSON,
  identifiant_unique TEXT UNIQUE,
  qr_code TEXT,
  total_general REAL,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pv_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pv_id TEXT REFERENCES pv(id),
  snapshot JSON,
  version_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS infractions_pv (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pv_id TEXT REFERENCES pv(id),
  infraction_id INTEGER,
  libelle TEXT,
  articles TEXT,
  montant REAL,
  quantite INTEGER DEFAULT 1,
  observation TEXT
);

CREATE TABLE IF NOT EXISTS journal (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT,
  description TEXT,
  utilisateur TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pv_entreprise ON pv(entreprise);
CREATE INDEX idx_pv_province ON pv(province);
CREATE INDEX idx_pv_statut ON pv(statut);
