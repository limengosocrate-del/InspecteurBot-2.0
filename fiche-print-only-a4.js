/* Impression PDF A4 : réservé aux fiches F01–F07 et S01–S03.
   Aucun style d'écran ni aucune donnée du formulaire ne sont modifiés. */
(() => {
  if (window.__ibPrintOnlyA4) return;
  window.__ibPrintOnlyA4 = true;

  const css = document.createElement("style");
  css.textContent = `
    /* Uniquement le titre principal de chaque fiche : même rendu à l'écran et à l'impression. */
    .official.header .header-title {
      color: #E3000F !important;
      -webkit-text-fill-color: #E3000F !important;
      font-family: "Arial Narrow", "Roboto Condensed", "Liberation Sans Narrow", Impact, Arial, sans-serif !important;
      font-stretch: condensed !important;
      font-size: 20pt !important;
      font-weight: 900 !important;
      line-height: 1.12 !important;
      letter-spacing: -0.35px !important;
      text-align: center !important;
      text-transform: uppercase !important;
      vertical-align: middle !important;
      padding: 3mm 2mm !important;
    }
  css.textContent = `
    @page { size: A4 portrait; margin: 8mm; }
    @media print {
      html, body {
        width: 194mm !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
      }
      .screen-toolbar, .ai-drawer, .no-print { display: none !important; }

      .meta-panel.no-print {
        display: grid !important;
        grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
        gap: 5px !important;
        padding: 6px 8px !important;
        margin: 0 0 5px !important;
        color: #fff !important;
        background: #071b34 !important;
        border: 1px solid rgba(243,196,65,.55) !important;
        border-radius: 7px !important;
        box-sizing: border-box !important;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      .meta-panel.no-print label {
        display: grid !important;
        min-width: 0 !important;
        color: #fff !important;
        font-size: 9px !important;
        line-height: 1.15 !important;
        gap: 2px !important;
      }
      .meta-panel.no-print input,
      .meta-panel.no-print select {
        display: block !important;
        width: 100% !important;
        min-width: 0 !important;
        height: 23px !important;
        padding: 1px 4px !important;
        border: 1px solid #8b9bad !important;
        border-radius: 3px !important;
        background: #fff !important;
        color: #111 !important;
        font-size: 9px !important;
        box-sizing: border-box !important;
        -webkit-appearance: none !important;
        appearance: none !important;
      }

      .sheet-wrap {
        display: block !important;
        width: 194mm !important;
        height: 281mm !important;
        min-height: 281mm !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow: visible !important;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
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
        transform: scale(var(--ib-a4-scale-x, 1), var(--ib-a4-scale-y, 1)) !important;
        transform-origin: top left !important;
        page-break-before: avoid !important;
        page-break-after: avoid !important;
        break-before: avoid !important;
        break-after: avoid !important;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
        overflow: visible !important;
        box-sizing: border-box !important;
      }
      #inspectionForm {
        display: block !important;
        width: 100% !important;
        min-height: 0 !important;
        height: auto !important;
        margin: 0 !important;
        box-sizing: border-box !important;
      }
      .official {
        width: 100% !important;
        max-width: 100% !important;
        table-layout: fixed !important;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      .meta-panel, .qr-box {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      input, select, textarea {
        color: #111 !important;
        -webkit-text-fill-color: #111 !important;
      }
      /* Titres officiels et codes : rouge, agrandis et centrés dans leurs cases. */
      .official.header .form-code {
        color: #c00000 !important;
        -webkit-text-fill-color: #c00000 !important;
        font-size: 22pt !important;
        font-weight: 900 !important;
        line-height: 1 !important;
        text-align: center !important;
      }
      .official.header .header-code {
        text-align: center !important;
        vertical-align: middle !important;
      }
      .official th, .official td, .section-title, .rate-box, .qr-box {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  `;
  document.head.appendChild(css);

  let saved = null;
  function prepare() {
    const sheet = document.getElementById("officialSheet");
    const wrap = sheet && sheet.closest(".sheet-wrap");
    if (!sheet || !wrap) return;

    saved = {
      sheet: sheet.getAttribute("style"),
      wrap: wrap.getAttribute("style")
    };

    sheet.style.setProperty("width", "194mm", "important");
    sheet.style.setProperty("min-width", "194mm", "important");
    sheet.style.setProperty("min-height", "0", "important");
    sheet.style.setProperty("height", "auto", "important");
    sheet.style.setProperty("transform", "none", "important");
    wrap.style.setProperty("width", "194mm", "important");
    wrap.style.setProperty("height", "281mm", "important");
    wrap.style.setProperty("min-height", "281mm", "important");
    wrap.style.setProperty("padding", "0", "important");
    wrap.style.setProperty("overflow", "visible", "important");

    /* La largeur est ajustée indépendamment de la hauteur : un contenu long
       ne réduit donc plus toute la fiche et ne laisse pas de larges marges.
       La hauteur est adaptée pour tenir sur une seule page A4. */
    const pxPerMm = 96 / 25.4;
    const maxW = 194 * pxPerMm;
    const maxH = 281 * pxPerMm;
    const width = Math.max(sheet.scrollWidth, sheet.getBoundingClientRect().width);
    const height = Math.max(sheet.scrollHeight, sheet.getBoundingClientRect().height, 1);
    const scaleX = Math.min(1, maxW / width);
    const scaleY = maxH / height;

    sheet.style.setProperty("--ib-a4-scale-x", String(scaleX));
    sheet.style.setProperty("--ib-a4-scale-y", String(scaleY));
    sheet.style.setProperty("transform", "scale(" + scaleX + ", " + scaleY + ")", "important");
    wrap.style.setProperty("height", maxH + "px", "important");
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
