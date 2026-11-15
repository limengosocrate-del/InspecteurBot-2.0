/* InspecteurBot — Impression professionnelle sur une seule page A4.
   Commun aux formulaires F01 à F07 et S01 à S03. */
(() => {
  if (window.__ibOnePageA4Ready) return;
  window.__ibOnePageA4Ready = true;

  const style = document.createElement("style");
  style.id = "ib-one-page-a4-print";
  style.textContent = `
    @page { size: A4 portrait; margin: 8mm; }
    @media print {
      html, body {
        width: 194mm !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
        overflow: visible !important;
      }
      .screen-toolbar, .ai-drawer, .no-print {
        display: none !important;
      }
      .sheet-wrap {
        display: block !important;
        width: 194mm !important;
        min-width: 194mm !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow: visible !important;
        box-sizing: border-box !important;
      }
      .sheet {
        display: block !important;
        width: 194mm !important;
        min-width: 194mm !important;
        min-height: 0 !important;
        height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        transform: scale(var(--ib-print-scale, 1)) !important;
        transform-origin: top left !important;
        page-break-before: auto !important;
        page-break-after: auto !important;
        break-before: auto !important;
        break-after: auto !important;
        overflow: visible !important;
      }
      .meta-panel {
        display: grid !important;
        color: #111 !important;
        background: #f1f5f9 !important;
        border-color: #9aa9b8 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .meta-panel label { color: #111 !important; }
      input, select, textarea {
        color: #111 !important;
        background: #fff !important;
        -webkit-text-fill-color: #111 !important;
      }
      .sheet, .sheet * {
        animation: none !important;
        transition: none !important;
      }
      .official th, .official td, .section-title, .rate-box, .qr-box {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  `;
  document.head.appendChild(style);

  let previous = null;

  function fitToOneA4Page() {
    const sheet = document.getElementById("officialSheet");
    const wrapper = sheet && sheet.closest(".sheet-wrap");
    if (!sheet || !wrapper) return;

    previous = {
      sheetStyle: sheet.getAttribute("style"),
      wrapperStyle: wrapper.getAttribute("style")
    };

    sheet.style.setProperty("width", "194mm", "important");
    sheet.style.setProperty("min-height", "0", "important");
    sheet.style.setProperty("height", "auto", "important");
    sheet.style.setProperty("margin", "0", "important");
    sheet.style.setProperty("transform", "none", "important");
    wrapper.style.setProperty("width", "194mm", "important");
    wrapper.style.setProperty("height", "auto", "important");
    wrapper.style.setProperty("padding", "0", "important");
    wrapper.style.setProperty("overflow", "visible", "important");

    const pageWidth = 194 * 96 / 25.4;
    const pageHeight = 281 * 96 / 25.4;
    const contentWidth = Math.max(sheet.scrollWidth, sheet.getBoundingClientRect().width);
    const contentHeight = Math.max(sheet.scrollHeight, sheet.getBoundingClientRect().height);
    const scale = Math.min(1, (pageWidth - 2) / contentWidth, (pageHeight - 2) / contentHeight);
    const safeScale = Math.max(0.1, scale);

    sheet.style.setProperty("--ib-print-scale", String(safeScale));
    sheet.style.setProperty("transform", "scale(" + safeScale + ")", "important");
    wrapper.style.setProperty("height", (contentHeight * safeScale) + "px", "important");
    wrapper.style.setProperty("min-height", "0", "important");
  }

  function restoreAfterPrint() {
    if (!previous) return;
    const sheet = document.getElementById("officialSheet");
    const wrapper = sheet && sheet.closest(".sheet-wrap");
    if (sheet) {
      if (previous.sheetStyle === null) sheet.removeAttribute("style");
      else sheet.setAttribute("style", previous.sheetStyle);
    }
    if (wrapper) {
      if (previous.wrapperStyle === null) wrapper.removeAttribute("style");
      else wrapper.setAttribute("style", previous.wrapperStyle);
    }
    previous = null;
  }

  window.addEventListener("beforeprint", fitToOneA4Page);
  window.addEventListener("afterprint", restoreAfterPrint);
})();
