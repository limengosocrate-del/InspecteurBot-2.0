// Moteur IA HORS-LIGNE "NeuroJuris 200" pour React (TF-IDF + RAG local)
import { Article, CODE_TRAVAIL } from './codeTravail';

const STOP = new Set(["le","la","les","un","une","des","de","du","et","a","au","aux","en","dans","pour","par","sur","que","qui","quoi","est","sont","il","elle","je","tu","mon","ma","mes","ce","cette","ces","the","of","to","and","is","are","what","how"]);

function normalize(s: string) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
function tokenize(s: string) {
  return normalize(s).split(" ").filter((w) => w.length > 1 && !STOP.has(w));
}

const SYN: Record<string, string> = {
  renvoi: "licenciement", virer: "licenciement", chasser: "licenciement", renvoyer: "licenciement",
  paie: "salaire", argent: "salaire", paye: "salaire", remuneration: "salaire",
  vacances: "conge", repos: "conge", enceinte: "maternite", grossesse: "maternite",
  blessure: "securite", accident: "securite", danger: "securite", greve: "conflit",
  prison: "sanction", amende: "sanction", peine: "sanction",
};

interface Doc { article: Article; tf: Record<string, number>; len: number; }

export class NeuroJuris {
  private index: Doc[] = [];
  private idf: Record<string, number> = {};
  ready = false;

  build(articles: Article[]) {
    const df: Record<string, number> = {};
    this.index = articles.map((a) => {
      const tokens = tokenize(`${a.titre} ${a.categorie} ${a.motsCles.join(" ")} ${a.contenu} ${a.sanction || ""}`);
      const tf: Record<string, number> = {};
      tokens.forEach((t) => (tf[t] = (tf[t] || 0) + 1));
      Object.keys(tf).forEach((t) => (df[t] = (df[t] || 0) + 1));
      return { article: a, tf, len: tokens.length };
    });
    const N = this.index.length;
    Object.keys(df).forEach((t) => (this.idf[t] = Math.log(1 + N / df[t])));
    this.ready = true;
  }

  retrieve(query: string, topK = 4): Article[] {
    if (!this.ready) return [];
    const q = tokenize(query);
    const boosted = [...q];
    q.forEach((t) => SYN[t] && boosted.push(SYN[t]));
    const numMatch = query.match(/\b(\d{1,3})\b/);
    const scored = this.index.map((doc) => {
      let s = 0;
      boosted.forEach((t) => { if (doc.tf[t]) s += (doc.tf[t] / doc.len) * (this.idf[t] || 1); });
      if (numMatch && doc.article.numero === parseInt(numMatch[1], 10)) s += 100;
      if (doc.article.authentique) s *= 1.15;
      return { a: doc.article, s };
    });
    return scored.filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, topK).map((x) => x.a);
  }

  private reason(q: string, art: Article, lang: string): string {
    const n = normalize(q);
    const T = (fr: string, en: string) => (lang === "en" ? en : lang === "fr" ? fr : "🌍 " + fr);
    if (/licenciement|renvoi|preavis|rupture/.test(n)) return T("Aucun licenciement ne peut être arbitraire. L'employeur doit respecter le préavis légal (14 jours ouvrables min, +7 jours/an d'ancienneté) ou prouver une faute lourde notifiée par écrit sous 15 jours. Sinon, le licenciement est abusif et donne droit à des dommages-intérêts.", "No dismissal may be arbitrary. The employer must respect the legal notice (min 14 working days, +7/year) or prove serious misconduct notified within 15 days, otherwise the dismissal is abusive.");
    if (/salaire|smig|paie|remuneration|argent/.test(n)) return T("Le salaire est protégé : à travail égal, salaire égal. Il ne peut être inférieur au SMIG, doit être payé en Francs Congolais à intervalles réguliers avec bulletin de paie.", "Wages are protected: equal pay for equal work, never below SMIG, paid in Congolese Francs with a payslip.");
    if (/conge|vacances|repos/.test(n)) return T("Le droit au congé est d'ordre public : au moins 1 jour ouvrable de congé payé par mois de service (12 jours/an), majoré selon l'ancienneté. Repos hebdomadaire de 24h obligatoire.", "Leave is public policy: at least 1 paid day per month (12/year), plus mandatory 24h weekly rest.");
    if (/maternite|enceinte|femme/.test(n)) return T("La femme enceinte a 14 semaines de congé de maternité avec 2/3 du salaire maintenu. Le licenciement pendant la grossesse et le congé est interdit et nul.", "Pregnant women get 14 weeks maternity leave at 2/3 pay; dismissal during this period is void.");
    if (/securite|accident|epi|hygiene/.test(n)) return T("L'employeur garantit un lieu sûr, fournit gratuitement les EPI et déclare tout accident à l'Inspection et la CNSS sous 48h. Responsabilité pénale et civile en cas de manquement.", "The employer ensures safety, provides free PPE and reports accidents within 48h.");
    if (/inspecteur|inspection|pv|controle/.test(n)) return T("L'Inspecteur du Travail visite sans préavis, exige les registres, dresse des PV faisant foi et arrête les travaux dangereux. Toute entrave est un délit pénal.", "Labour Inspectors enter without notice, require registers, issue binding reports and stop dangerous work.");
    return T(`Les dispositions de l'article ${art.numero} sont impératives. Toute clause moins favorable au travailleur est nulle. En cas de litige, la conciliation devant l'Inspecteur du Travail est obligatoire.`, `Article ${art.numero} is mandatory; less favourable clauses are void. Conciliation before the Labour Inspector is required.`);
  }

  answer(query: string, lang = "fr"): { text: string; articles: Article[]; confidence: number } {
    const arts = this.retrieve(query, 4);
    const L = lang === "en"
      ? { d: "⚖️ LEGAL DIAGNOSIS — InspecteurBot DRC (Offline)", r: "Reference", dom: "Field", tx: "Legal text", an: "Analysis", ob: "Employer duties", dr: "Worker rights", sa: "Penalties", co: "Related articles", obT: "• Comply with article {n}.\n• Avoid breaches triggering Labour Inspection.", drT: "• Demand immediate application.\n• Refer to the Labour Inspector for conciliation.", no: "No specific article found. Rephrase with a keyword (contract, wage, leave, dismissal)." }
      : { d: "⚖️ DIAGNOSTIC JURIDIQUE — InspecteurBot RDC (Hors-ligne)", r: "Article de référence", dom: "Domaine", tx: "Texte de loi", an: "Analyse & explication", ob: "Obligations de l'employeur", dr: "Droits du travailleur", sa: "Sanctions encourues", co: "Articles complémentaires", obT: "• Se conformer strictement à l'article {n}.\n• Éviter toute violation entraînant l'Inspection du Travail.", drT: "• Exiger l'application immédiate.\n• Saisir l'Inspecteur du Travail pour conciliation.", no: "Aucun article précis trouvé. Reformulez avec un mot-clé (contrat, salaire, congé, licenciement)." };

    if (!arts.length) return { text: L.no, articles: [], confidence: 0.2 };

    const main = arts[0];
    const others = arts.slice(1, 3);
    let out = `${L.d}\n\n📌 ${L.r} : Article ${main.numero} — ${main.titre}\n🏷️ ${L.dom} : ${main.categorie}\n\n`;
    out += `📖 ${L.tx} :\n"${main.contenu.substring(0, 300)}${main.contenu.length > 300 ? "..." : ""}"\n\n`;
    out += `💡 ${L.an} :\n${this.reason(query, main, lang)}\n\n`;
    out += `👔 ${L.ob} :\n${L.obT.replace("{n}", String(main.numero))}\n\n`;
    out += `👷 ${L.dr} :\n${L.drT}\n`;
    if (main.sanction) out += `\n🚨 ${L.sa} :\n${main.sanction}`;
    if (others.length) out += `\n\n📚 ${L.co} :\n` + others.map((a) => `• Article ${a.numero} — ${a.titre}`).join("\n");

    const confidence = Math.min(0.98, 0.55 + arts.length * 0.1 + (main.authentique ? 0.15 : 0));
    return { text: out, articles: arts, confidence };
  }
}

export const neuroJuris = new NeuroJuris();
neuroJuris.build(CODE_TRAVAIL);
