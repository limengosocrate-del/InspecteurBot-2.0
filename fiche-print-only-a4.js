/* Impression PDF A4 : réservé aux fiches F01–F07 et S01–S03.
   Le style renforcé ne concerne que les titres principaux des fiches. */
(() => {
  if (window.__ibPrintOnlyA4) return;
  window.__ibPrintOnlyA4 = true;

  const css = document.createElement("style");
  css.textContent = `
    /* Titre principal uniquement : rouge carmin, condensé, gras et centré. */
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

    @page { size: A4 portrait; margin: 4mm; }
    @media print {
      html, body {
        width: 202mm !important;
        height: 289mm !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
        overflow: hidden !important;
      }
      .screen-toolbar, .ai-drawer, .no-print { display: none !important; }

      .sheet-wrap {
        display: block !important;
        width: 202mm !important;
        height: 289mm !important;
        min-height: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow: hidden !important;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
        break-after: avoid !important;
        page-break-after: avoid !important;
        box-sizing: border-box !important;
      }
      .sheet {
        display: block !important;
        width: 202mm !important;
        min-width: 202mm !important;
        min-height: 0 !important;
        height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        transform: scale(var(--ib-a4-fit, 1)) !important;
        transform-origin: top left !important;
        break-before: avoid !important;
        page-break-before: avoid !important;
        break-after: avoid !important;
        page-break-after: avoid !important;
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
      input, select, textarea {
        color: #111 !important;
        -webkit-text-fill-color: #111 !important;
      }
      /* Le code de formulaire conserve sa mise en évidence déjà demandée. */
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

    sheet.style.setProperty("width", "202mm", "important");
    sheet.style.setProperty("min-width", "202mm", "important");
    sheet.style.setProperty("min-height", "0", "important");
    sheet.style.setProperty("height", "auto", "important");
    sheet.style.setProperty("transform", "none", "important");
    wrap.style.setProperty("width", "202mm", "important");
    wrap.style.setProperty("height", "289mm", "important");
    wrap.style.setProperty("min-height", "0", "important");
    wrap.style.setProperty("padding", "0", "important");
    wrap.style.setProperty("overflow", "hidden", "important");

    /* Mise à l'échelle proportionnelle : toute la fiche tient dans une seule
       page A4, sans couper le contenu ni déformer les proportions. */
    const pxPerMm = 96 / 25.4;
    const maxW = 202 * pxPerMm;
    const maxH = 289 * pxPerMm;
    const rect = sheet.getBoundingClientRect();
    const width = Math.max(sheet.scrollWidth, rect.width, 1);
    const height = Math.max(sheet.scrollHeight, rect.height, 1);
    const fit = Math.min(maxW / width, maxH / height);
    sheet.style.setProperty("--ib-a4-fit", String(fit));
    sheet.style.setProperty("transform", "scale(" + fit + ")", "important");
  }

  function restore() {
    if (!saved) return;
    const sheet = document.getElementById("officialSheet");
    const wrap = sheet && sheet.closest(".sheet-wrap");
    if (sheet) saved.sheet === null ? sheet.removeAttribute("style") : sheet.setAttribute("style", saved.sheet);
    if (wrap) saved.wrap === null ? wrap.removeAttribute("style") : wrap.setAttribute("style", saved.wrap);
    saved = null;
  }

  window.addEventListener("beforeprint", () => {
    requestAnimationFrame(() => requestAnimationFrame(prepare));
  });
  window.addEventListener("afterprint", restore);
  if (window.matchMedia) {
    const media = window.matchMedia("print");
    if (media.addEventListener) media.addEventListener("change", e => { if (!e.matches) restore(); });
  }
})();