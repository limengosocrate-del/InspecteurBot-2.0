/**
 * Export PDF A4 fidèle (via html2pdf / jsPDF+html2canvas).
 * @module modules/pdfExport
 */
export async function exporterPDF(elementId, nomFichier) {
  const el = document.getElementById(elementId);
  if (!el) throw new Error('Élément à exporter introuvable.');

  const options = {
    margin: 0,
    filename: (nomFichier || 'PV') + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 3, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css'] }
  };

  if (window.html2pdf) {
    return window.html2pdf().set(options).from(el).save();
  }
  // Fallback impression navigateur -> PDF
  console.warn('html2pdf absent : bascule sur impression navigateur.');
  return imprimer(elementId);
}

/** Aperçu avant impression (nouvelle fenêtre). */
export function apercuAvantImpression(elementId) {
  const el = document.getElementById(elementId);
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>Aperçu PV</title>
    <link rel="stylesheet" href="assets/css/print-a4.css"></head>
    <body>${el.outerHTML}</body></html>`);
  w.document.close();
  return w;
}

/** Impression directe. */
export function imprimer(elementId) {
  const original = document.body.innerHTML;
  const el = document.getElementById(elementId);
  document.body.innerHTML = el.outerHTML;
  window.print();
  document.body.innerHTML = original;
  window.location.reload(); // ré-initialise l'app après impression
}
