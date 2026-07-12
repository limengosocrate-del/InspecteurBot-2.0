/**
 * Signature électronique tactile (téléphone/tablette/PC).
 * @module modules/signature
 */
export class SignaturePad {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dessine = false;
    this._init();
  }

  _init() {
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#0a1a4a';

    const pos = e => {
      const r = this.canvas.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      return { x: p.clientX - r.left, y: p.clientY - r.top };
    };

    const start = e => { e.preventDefault(); this.dessine = true; const {x,y}=pos(e); this.ctx.beginPath(); this.ctx.moveTo(x,y); };
    const move  = e => { if(!this.dessine) return; e.preventDefault(); const {x,y}=pos(e); this.ctx.lineTo(x,y); this.ctx.stroke(); };
    const end   = () => { this.dessine = false; };

    ['mousedown','touchstart'].forEach(ev => this.canvas.addEventListener(ev, start, {passive:false}));
    ['mousemove','touchmove'].forEach(ev => this.canvas.addEventListener(ev, move, {passive:false}));
    ['mouseup','touchend','mouseleave'].forEach(ev => this.canvas.addEventListener(ev, end));
  }

  clear() { this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height); }
  isEmpty() {
    const blank = document.createElement('canvas');
    blank.width = this.canvas.width; blank.height = this.canvas.height;
    return this.canvas.toDataURL() === blank.toDataURL();
  }
  toDataURL() { return this.canvas.toDataURL('image/png'); }
}

/** Crée le pad pour un rôle donné. */
export function creerSignature(canvasId) {
  const el = document.getElementById(canvasId);
  return el ? new SignaturePad(el) : null;
  }
