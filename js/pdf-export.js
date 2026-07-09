/* ============================================================
   js/pdf-export.js
   Export PDF via fenêtre d'impression (fiable, offline)
   + export HTML téléchargeable
   ============================================================ */

const PDFExport = (() => {
  "use strict";

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function buildDocument(title, subtitle, bodyText, meta = {}) {
    const num = meta.numero || "";
    const date = meta.date || new Date().toLocaleDateString("fr-CD");
    return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(title)} ${escapeHtml(num)}</title>
<style>
  @page { margin: 18mm; }
  body { font-family: Georgia, "Times New Roman", serif; color: #111; font-size: 12pt; line-height: 1.45; }
  .head { border-bottom: 3px solid #041B3D; padding-bottom: 12px; margin-bottom: 18px; }
  .head h1 { font-size: 16pt; color: #041B3D; margin: 0 0 4px; }
  .head h2 { font-size: 12pt; color: #333; font-weight: normal; margin: 0; }
  .meta { font-size: 10pt; color: #444; margin-top: 8px; }
  .badge { display: inline-block; background: #f5c518; color: #041B3D; font-weight: bold;
           padding: 2px 8px; border-radius: 4px; font-size: 10pt; }
  pre { white-space: pre-wrap; font-family: "Courier New", monospace; font-size: 10pt;
        background: #f7f7f7; padding: 12px; border: 1px solid #ddd; border-radius: 6px; }
  .foot { margin-top: 28px; font-size: 9pt; color: #666; border-top: 1px solid #ccc; padding-top: 8px; }
  .net { font-size: 14pt; font-weight: bold; border: 2px solid #041B3D; display: inline-block; padding: 8px 14px; margin-top: 10px; }
  @media print { .noprint { display: none !important; } }
</style>
</head>
<body>
  <div class="head">
    <div class="badge">INSPECTEURBOT IA RDC 4.0</div>
    <h1>${escapeHtml(title)}</h1>
    <h2>${escapeHtml(subtitle || "Inspection Générale du Travail — République Démocratique du Congo")}</h2>
    <div class="meta">N° ${escapeHtml(num)} | Date : ${escapeHtml(date)} | ${escapeHtml(meta.extra || "")}</div>
  </div>
  <pre>${escapeHtml(bodyText)}</pre>
  <div class="foot">
    Document généré électroniquement — InspecteurBot IA RDC Premium<br>
    Code du Travail • Décret 25/22 SMIG • Usage professionnel IGT<br>
    <button class="noprint" onclick="window.print()" style="margin-top:10px;padding:8px 16px;font-weight:bold;cursor:pointer">
      Imprimer / Enregistrer en PDF
    </button>
  </div>
</body>
</html>`;
  }

  function fromText(numero, title, text, subtitle) {
    const html = buildDocument(title, subtitle, text, { numero, date: new Date().toLocaleDateString("fr-CD") });
    const w = window.open("", "_blank");
    if (!w) {
      // fallback download
      if (window.IBTUtils) IBTUtils.downloadHTML(numero + ".html", html);
      else alert("Autorisez les popups pour le PDF");
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  function fromDecompte(result) {
    if (!result || !window.DecompteEngine) return;
    const text = DecompteEngine.exporterTexte(result);
    fromText(result.meta.numero, "DÉCOMPTE FINAL", text, result.meta.decret || "Décret 25/22");
  }

  function fromElement(el, title, numero) {
    const text = el.innerText || el.textContent;
    fromText(numero || IBTUtils?.uid("PDF") || "DOC", title || "Document", text);
  }

  return { fromText, fromDecompte, fromElement, buildDocument };
})();

if (typeof window !== "undefined") window.PDFExport = PDFExport;
