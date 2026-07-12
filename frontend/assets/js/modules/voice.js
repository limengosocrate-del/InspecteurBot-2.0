/**
 * Commandes vocales (dictée) + lecture vocale (synthèse).
 * @module modules/voice
 */

/** ---- DICTÉE (Speech Recognition) ---- */
export class DicteeVocale {
  constructor(langue = 'fr-FR') {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.supporte = !!SR;
    if (this.supporte) {
      this.rec = new SR();
      this.rec.lang = langue;
      this.rec.continuous = true;
      this.rec.interimResults = true;
    }
    this.onTexte = null;
  }

  demarrer(champCible) {
    if (!this.supporte) { alert("Dictée vocale non supportée par ce navigateur."); return; }
    this.rec.onresult = e => {
      let texte = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) texte += e.results[i][0].transcript;
      }
      if (texte && champCible) {
        champCible.value += (champCible.value ? ' ' : '') + texte.trim();
        champCible.dispatchEvent(new Event('input'));
      }
      if (this.onTexte) this.onTexte(texte);
    };
    this.rec.start();
  }

  arreter() { if (this.supporte) this.rec.stop(); }
}

/** ---- LECTURE (Speech Synthesis) ---- */
export function lireTexte(texte, langue = 'fr-FR') {
  if (!window.speechSynthesis) { alert("Lecture vocale non supportée."); return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texte);
  u.lang = langue; u.rate = 0.95;
  window.speechSynthesis.speak(u);
}

export function arreterLecture() { window.speechSynthesis?.cancel(); }

/** Lit le contenu structuré d'un PV. */
export function lirePV(pv) {
  const parts = [
    pv.titre,
    `Numéro ${pv.numero || 'non attribué'}.`,
    `Entreprise ${pv.entreprise || 'non renseignée'}.`,
    `Inspecteur ${pv.inspecteur || ''}.`
  ];
  if (pv.infractions?.length) {
    parts.push(`${pv.infractions.length} infractions constatées.`);
    pv.infractions.forEach((i, n) =>
      parts.push(`Infraction ${n+1} : ${i.libelle}, ${i.articles}, montant ${i.montantAffiche}.`));
    parts.push(`Total général : ${pv.totalAffiche || ''}.`);
  }
  lireTexte(parts.join(' '));
}
