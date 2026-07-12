/**
 * Analyseur NLP léger (normalisation + correspondance floue).
 * @module ai/nlpAnalyzer
 */
export function normaliser(texte) {
  return texte.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s']/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

/** Similarité simple (Dice sur bigrammes). */
export function similarite(a, b) {
  a = normaliser(a); b = normaliser(b);
  if (a === b) return 1;
  const big = s => { const r = []; for (let i=0;i<s.length-1;i++) r.push(s.slice(i,i+2)); return r; };
  const A = big(a), B = big(b);
  const inter = A.filter(x => B.includes(x)).length;
  return (2 * inter) / (A.length + B.length || 1);
}

export function contientMotCle(texte, motCle) {
  return normaliser(texte).includes(normaliser(motCle));
                                    }
