function initForm(formId) {
  // QR Code
  const qr = document.getElementById('qrcode');
  if (qr) new QRCode(qr, { text: `${formId}-IGT-RDC-${Date.now()}`, width: 65, height: 65 });

  // Horodatage
  const ts = document.getElementById('timestamp');
  if (ts) ts.innerHTML = new Date().toLocaleString('fr-FR');

  // Signatures tactiles
  window.signatures = {};
  document.querySelectorAll('canvas[id^="signature"]').forEach(c => {
    window.signatures[c.id] = new SignaturePad(c);
  });
}

function clearSignature(id) {
  if (window.signatures && window.signatures[id]) window.signatures[id].clear();
}

// === IA : Dictée vocale ===
function startVoiceDictation(inputId) {
  const input = document.getElementById(inputId);
  if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) return alert("Dictée non supportée");
  const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  rec.lang = 'fr-FR';
  rec.onresult = e => input.value = e.results[0][0].transcript;
  rec.start();
}

// === IA : Détection infractions Code du Travail RDC ===
function detectInfractions(data) {
  const list = [];
  if (!data.cnss) list.push({ art: "Art. 216 CT", inf: "Déclaration CNSS manquante", sanction: "Amende + Mise en demeure" });
  if (data.enfants > 0) list.push({ art: "Art. 133 CT", inf: "Emploi d'enfants", sanction: "Fermeture + Poursuites" });
  if (data.expat && !data.contratONEM) list.push({ art: "Art. 49 CT", inf: "Contrat expatrié non visé", sanction: "Amende 500.000 FC" });
  return list;
}

// === Export PDF A4 (impression + fichier) ===
function exportToPDF(formId) {
  window.print(); // Version impression A4 fidèle
  // Pour export fichier PDF (optionnel) :
  // html2canvas(document.querySelector('.form-container')).then(canvas => {
  //   const pdf = new jspdf.jsPDF('p','mm','a4');
  //   pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, 0);
  //   pdf.save(`${formId}.pdf`);
  // });
}

// === Mode hors-ligne (PWA) ===
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
