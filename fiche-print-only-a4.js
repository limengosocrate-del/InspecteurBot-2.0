/* InspecteurBot — correctif impression PDF réservé aux fiches F01–F07 et S01–S03. */
(function () {
  "use strict";
  if (window.__ibPrintOnlyA4v14) return;
  window.__ibPrintOnlyA4v14 = true;
  var style = document.createElement("style");
  style.textContent = [
    "/* Titres principaux seulement : rouge carmin, condensé, gras, centrés. */",
    ".official.header { width:100% !important; table-layout:fixed !important; }",
    ".official.header .header-left { width:25% !important; }",
    ".official.header .header-title { width:58% !important; color:#E3000F !important; -webkit-text-fill-color:#E3000F !important; font-family:Impact, \"Arial Narrow\", \"Roboto Condensed\", Arial, sans-serif !important; font-stretch:condensed !important; font-size:20pt !important; font-weight:900 !important; line-height:1.08 !important; letter-spacing:-.5px !important; text-align:center !important; text-transform:uppercase !important; vertical-align:middle !important; padding:2mm 1mm !important; white-space:normal !important; overflow-wrap:normal !important; }",
    ".official.header .header-code { width:17% !important; text-align:center !important; }",
    "@page { size:A4 portrait; margin:4mm; }",
    "@media print {",
    "  html, body { width:202mm !important; min-width:0 !important; height:auto !important; min-height:0 !important; margin:0 !important; padding:0 !important; overflow:visible !important; background:#fff !important; }",
    "  .screen-toolbar,.meta-panel,.ai-drawer,.no-print { display:none !important; }",
    "  .sheet-wrap { display:block !important; width:202mm !important; height:289mm !important; min-height:0 !important; margin:0 !important; padding:0 !important; overflow:hidden !important; break-inside:avoid !important; page-break-inside:avoid !important; }",
    "  .sheet { display:block !important; position:relative !important; width:202mm !important; min-width:202mm !important; height:auto !important; min-height:0 !important; margin:0 !important; padding:0 !important; box-shadow:none !important; transform:scale(var(--ib-print-fit,1)) !important; transform-origin:top left !important; break-before:avoid !important; page-break-before:avoid !important; break-after:avoid !important; page-break-after:avoid !important; break-inside:avoid !important; page-break-inside:avoid !important; overflow:visible !important; }",
    "  #inspectionForm { width:100% !important; height:auto !important; min-height:0 !important; margin:0 !important; }",
    "  .official { width:100% !important; max-width:100% !important; table-layout:fixed !important; break-inside:avoid !important; page-break-inside:avoid !important; }",
    "  .official.header .header-title { color:#E3000F !important; -webkit-text-fill-color:#E3000F !important; font-weight:900 !important; text-align:center !important; }",
    "  input,select,textarea { color:#111 !important; -webkit-text-fill-color:#111 !important; }",
    "  .official th,.official td,.section-title,.rate-box,.qr-box { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }",
    "}",
  ].join("\n");
  document.head.appendChild(style);
  var saved = null;
  function preparePrint() {
    var sheet = document.getElementById("officialSheet");
    var wrap = sheet && sheet.closest(".sheet-wrap");
    if (!sheet || !wrap) return;
    if (!saved) saved = { sheet:sheet.getAttribute("style"), wrap:wrap.getAttribute("style") };
    sheet.style.setProperty("width","202mm","important");
    sheet.style.setProperty("min-width","202mm","important");
    sheet.style.setProperty("height","auto","important");
    sheet.style.setProperty("min-height","0","important");
    sheet.style.setProperty("transform","none","important");
    wrap.style.setProperty("width","202mm","important");
    wrap.style.setProperty("height","289mm","important");
    wrap.style.setProperty("padding","0","important");
    wrap.style.setProperty("overflow","hidden","important");
    var pxPerMm = 96/25.4;
    var maxW = 202*pxPerMm, maxH = 289*pxPerMm;
    var width = Math.max(sheet.scrollWidth, sheet.getBoundingClientRect().width, 1);
    var height = Math.max(sheet.scrollHeight, sheet.getBoundingClientRect().height, 1);
    var fit = Math.min(1, maxW/width, maxH/height);
    sheet.style.setProperty("--ib-print-fit", String(fit));
    sheet.style.setProperty("transform","scale("+fit+")","important");
  }
  function restorePrint() {
    if (!saved) return;
    var sheet = document.getElementById("officialSheet");
    var wrap = sheet && sheet.closest(".sheet-wrap");
    if (sheet) saved.sheet === null ? sheet.removeAttribute("style") : sheet.setAttribute("style",saved.sheet);
    if (wrap) saved.wrap === null ? wrap.removeAttribute("style") : wrap.setAttribute("style",saved.wrap);
    saved = null;
  }
  window.addEventListener("beforeprint", preparePrint);
  window.addEventListener("afterprint", restorePrint);
  if (window.matchMedia) {
    var media = window.matchMedia("print");
    var handler = function (event) { if (!event.matches) restorePrint(); };
    if (media.addEventListener) media.addEventListener("change",handler);
    else if (media.addListener) media.addListener(handler);
  }
}());