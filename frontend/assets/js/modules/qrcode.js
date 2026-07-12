/**
 * Génération QR Code sécurisé + identifiant unique par PV.
 * (Utilise la lib qrcode.js chargée globalement, ou fallback API.)
 * @module modules/qrcode
 */
export function genererIdentifiantUnique(pv) {
  const base = `${pv.type}|${pv.numero || pv.id}|${pv.dateCreation}`;
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = ((hash << 5) - hash + base.charCodeAt(i)) | 0;
  }
  const sig = Math.abs(hash).toString(36).toUpperCase();
  return `IBOT-${sig}-${Date.now().toString(36).toUpperCase()}`;
}

/**
 * Génère le contenu encodé dans le QR (vérifiable).
 */
export function contenuQR(pv, identifiant) {
  return JSON.stringify({
    id: identifiant,
    numero: pv.numero,
    type: pv.type,
    entreprise: pv.entreprise,
    date: pv.dateFait || pv.date,
    heure: pv.heure || new Date().toLocaleTimeString('fr-FR'),
    inspecteur: pv.inspecteur,
    total: pv.totalAffiche || null
  });
}

/**
 * Retourne une dataURL du QR code.
 * @returns {Promise<string>}
 */
export async function genererQRCode(contenu, taille = 180) {
  // Priorité : lib locale QRCode si disponible
  if (window.QRCode) {
    const tmp = document.createElement('div');
    new window.QRCode(tmp, { text: contenu, width: taille, height: taille, correctLevel: window.QRCode.CorrectLevel.H });
    await new Promise(r => setTimeout(r, 50));
    const img = tmp.querySelector('img') || tmp.querySelector('canvas');
    return img.src || img.toDataURL();
  }
  // Fallback (nécessite connexion) — sinon prévoir bundle local
  return `https://api.qrserver.com/v1/create-qr-code/?size=${taille}x${taille}&ecc=H&data=${encodeURIComponent(contenu)}`;
}

/** Attache identifiant + QR à un PV. */
export async function scellerPV(pv) {
  const identifiant = genererIdentifiantUnique(pv);
  const qr = await genererQRCode(contenuQR(pv, identifiant));
  return { ...pv, identifiantUnique: identifiant, qrCode: qr, dateScellement: new Date().toISOString() };
}
