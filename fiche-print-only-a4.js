/* Impression uniquement : ne modifie jamais l'affichage à l'écran. */
(() => {
  if (window.__ibPrintOnlyA4) return;
  window.__ibPrintOnlyA4 = true;
  const css = document.createElement("style");
  css.textContent = `
    @page { size: A4 portrait; margin: 8mm; }
    @media print {
      html, body { width: 194mm !important; margin: 0 !important; padding: 0 !important; background: #fff !important; }
      .screen-toolbar, .ai-drawer, .no-print { display: none !important; }
      .sheet-wrap { display: block !important; width: 194mm !important; padding: 0 !important; margin: 0 !important; overflow: visible !important; }
      .sheet {
        width: 194mm !important; min-width: 194mm !important; min-height: 0 !important; height: auto !important;
        margin: 0 !important; box-shadow: none !important; transform: scale(var(--ib-a4-scale, 1)) !important;
        transform-origin: top left !important; page-break-after: auto !important; break-after: auto !important;
        page-break-before: auto !important; break-before: auto !important; overflow: visible !important;
      }
      .meta-panel { display: grid !important; }
      input, select, textarea { color: #111 !important; -webkit-text-fill-color: #111 !important; }
      .official th, .official td, .section-title, .rate-box, .qr-box { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  `;
  document.head.appendChild(css);
  let saved = null;
  function prepare() {
    const sheet = document.getElementById("officialSheet");
    const wrap = sheet && sheet.closest(".sheet-wrap");
    if (!sheet || !wrap) return;
    saved = { sheet: sheet.getAttribute("style"), wrap: wrap.getAttribute("style") };
    sheet.style.setProperty("width", "194mm", "important");
    sheet.style.setProperty("min-height", "0", "important");
    sheet.style.setProperty("height", "auto", "important");
    sheet.style.setProperty("transform", "none", "important");
    wrap.style.setProperty("width", "194mm", "important");
    wrap.style.setProperty("padding", "0", "important");
    wrap.style.setProperty("overflow", "visible", "important");
    const pxPerMm = 96 / 25.4;
    const maxW = 194 * pxPerMm;
    const maxH = 281 * pxPerMm;
    const w = Math.max(sheet.scrollWidth, sheet.getBoundingClientRect().width);
    const h = Math.max(sheet.scrollHeight, sheet.getBoundingClientRect().height);
    const scale = Math.min(1, maxW / w, maxH / h);
    sheet.style.setProperty("--ib-a4-scale", String(scale));
    sheet.style.setProperty("transform", "scale(" + scale + ")", "important");
    wrap.style.setProperty("height", (h * scale) + "px", "important");
  }
  function restore() {
    if (!saved) return;
    const sheet = document.getElementById("officialSheet");
    const wrap = sheet && sheet.closest(".sheet-wrap");
    if (sheet) saved.sheet === null ? sheet.removeAttribute("style") : sheet.setAttribute("style", saved.sheet);
    if (wrap) saved.wrap === null ? wrap.removeAttribute("style") : wrap.setAttribute("style", saved.wrap);
    saved = null;
  }
  window.addEventListener("beforeprint", prepare);
  window.addEventListener("afterprint", restore);
})();
