/* ==================================================================
   AI-NLP.JS — Traitement du langage naturel local
   Recherche sémantique par TF-IDF + similarité cosinus + fuzzy
   Sans dépendance externe — 100% JavaScript vanilla
   ================================================================== */

const NLP = {

  // Mots vides français (stopwords)
  stopwords: new Set([
    "le","la","les","un","une","des","du","de","d","l","et","ou","à","a","au","aux",
    "en","dans","sur","sous","pour","par","avec","sans","est","sont","ce","cet","cette",
    "ces","que","qui","quoi","dont","où","comme","si","ne","pas","plus","moins","très",
    "il","elle","on","nous","vous","ils","elles","je","tu","me","te","se","son","sa",
    "ses","mon","ma","mes","ton","ta","tes","notre","votre","leur","leurs","y","en",
    "aussi","mais","donc","car","ni","or","alors","puis","aussi"
  ]),

  // Normalisation (minuscule, sans accent, sans ponctuation)
  normalize(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  },

  // Tokenisation
  tokenize(text) {
    return this.normalize(text)
      .split(/\s+/)
      .filter(t => t.length > 1 && !this.stopwords.has(t));
  },

  // Distance de Levenshtein (fuzzy matching)
  levenshtein(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    const dp = Array.from({length:m+1}, () => new Array(n+1).fill(0));
    for (let i=0;i<=m;i++) dp[i][0] = i;
    for (let j=0;j<=n;j++) dp[0][j] = j;
    for (let i=1;i<=m;i++) {
      for (let j=1;j<=n;j++) {
        const cost = a[i-1] === b[j-1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+cost);
      }
    }
    return dp[m][n];
  },

  // Similarité (0 à 1)
  similarity(a, b) {
    const na = this.normalize(a), nb = this.normalize(b);
    if (!na || !nb) return 0;
    const dist = this.levenshtein(na, nb);
    return 1 - dist / Math.max(na.length, nb.length);
  },

  // Similarité cosinus entre deux ensembles de tokens
  cosineSim(tokensA, tokensB) {
    const freqA = {}, freqB = {};
    tokensA.forEach(t => freqA[t] = (freqA[t]||0) + 1);
    tokensB.forEach(t => freqB[t] = (freqB[t]||0) + 1);
    const all = new Set([...Object.keys(freqA), ...Object.keys(freqB)]);
    let dot=0, magA=0, magB=0;
    all.forEach(t => {
      const a = freqA[t]||0, b = freqB[t]||0;
      dot += a*b; magA += a*a; magB += b*b;
    });
    if (!magA || !magB) return 0;
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
  },

  // Recherche dans un corpus (retourne tableau trié par score)
  search(query, corpus, textExtractor) {
    const qTokens = this.tokenize(query);
    if (!qTokens.length) return [];
    const results = corpus.map(item => {
      const text = textExtractor(item);
      const tTokens = this.tokenize(text);
      const cosine = this.cosineSim(qTokens, tTokens);
      const fuzzy = this.similarity(query, text.substring(0, 200));
      const score = cosine * 0.7 + fuzzy * 0.3;
      return { item, score };
    });
    return results
      .filter(r => r.score > 0.05)
      .sort((a,b) => b.score - a.score);
  },

  // Extraction d'entités (nombres, dates, montants, fonctions)
  extractEntities(text) {
    const entities = { montants:[], dates:[], nombres:[], fonctions:[] };
    // Montants (ex: 200000 FC, 200.000 FC)
    const mMontants = text.match(/\d[\d\s.,]*\s*(fc|francs?|usd|\$)/gi) || [];
    mMontants.forEach(m => entities.montants.push(m.trim()));
    // Dates (jj/mm/aaaa, jj-mm-aaaa)
    const mDates = text.match(/\b\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}\b/g) || [];
    mDates.forEach(d => entities.dates.push(d));
    // Nombres isolés
    const mNombres = text.match(/\b\d+\b/g) || [];
    mNombres.forEach(n => entities.nombres.push(parseInt(n,10)));
    // Détection de fonctions connues
    if (window.SMIG_DATA) {
      const low = text.toLowerCase();
      SMIG_DATA.bareme.forEach(row => {
        row.fonctions.split(",").forEach(f => {
          const fn = f.trim().toLowerCase();
          if (fn && low.includes(fn)) entities.fonctions.push({fonction:fn, classe:row});
        });
      });
    }
    return entities;
  }
};

if (typeof window !== 'undefined') window.NLP = NLP;
if (typeof module !== 'undefined') module.exports = NLP;
