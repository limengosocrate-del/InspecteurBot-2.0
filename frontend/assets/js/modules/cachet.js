/**
 * Cachet numérique : prévisualisation + repositionnement drag.
 * @module modules/cachet
 */
export function activerRepositionnement(cachetEl, conteneur) {
  let drag = false, offX = 0, offY = 0;

  const start = e => {
    drag = true;
    const p = e.touches ? e.touches[0] : e;
    offX = p.clientX - cachetEl.offsetLeft;
    offY = p.clientY - cachetEl.offsetTop;
  };
  const move = e => {
    if (!drag) return;
    const p = e.touches ? e.touches[0] : e;
    const x = p.clientX - offX, y = p.clientY - offY;
    cachetEl.style.left = x + 'px';
    cachetEl.style.top = y + 'px';
    cachetEl.dataset.x = x; cachetEl.dataset.y = y;
  };
  const end = () => { drag = false; };

  ['mousedown','touchstart'].forEach(ev => cachetEl.addEventListener(ev, start));
  ['mousemove','touchmove'].forEach(ev => conteneur.addEventListener(ev, move));
  ['mouseup','touchend'].forEach(ev => document.addEventListener(ev, end));

  return () => ({ x: cachetEl.dataset.x, y: cachetEl.dataset.y });
}
