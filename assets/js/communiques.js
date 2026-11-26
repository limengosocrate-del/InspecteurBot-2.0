/*==================================================
 INSPECTEURBOT RDC — COMMUNIQUÉS OFFICIELS
 Chargement robuste depuis assets/data/communiques.json
==================================================*/
"use strict";

let listeCommuniques = [];
let player = null;

document.addEventListener("DOMContentLoaded", () => {
  player = document.getElementById("mainPlayer");
  initialiserRecherche();
  initialiserFiltres();
  initialiserAudio();
  chargerCommuniques();
});

function afficherEtatCommuniques(message, erreur = false) {
  const container = document.getElementById("listeCommuniques");
  if (!container) return;
  container.innerHTML = `
    <div class="card" role="status" style="text-align:center;padding:28px;border:1px solid rgba(255,255,255,.18)">
      <div style="font-size:32px;margin-bottom:12px">${erreur ? "⚠️" : "🎧"}</div>
      <h2 style="margin-bottom:8px">${erreur ? "Communiqués momentanément indisponibles" : "Chargement des communiqués officiels"}</h2>
      <p style="color:#e8f2ff;line-height:1.7">${message}</p>
    </div>`;
}

async function chargerCommuniques() {
  afficherEtatCommuniques("Récupération des audios et des informations officielles…");
  const jsonUrl = new URL("./assets/data/communiques.json", window.location.href);
  jsonUrl.searchParams.set("_", String(Date.now()));
  try {
    const response = await fetch(jsonUrl.href, { cache: "no-store", headers: { "Accept": "application/json" } });
    if (!response.ok) throw new Error("Fichier des communiqués inaccessible (HTTP " + response.status + ").");
    const data = await response.json();
    if (!data || !Array.isArray(data.communiques)) throw new Error("Le fichier JSON ne contient pas de liste de communiqués valide.");
    listeCommuniques = data.communiques.filter(c => c && c.titre && c.audio);
    if (!listeCommuniques.length) {
      afficherEtatCommuniques("Aucun communiqué audio n'est publié pour le moment.");
      mettreAJourStatistiques();
      return;
    }
    afficherCommuniques(listeCommuniques);
    mettreAJourStatistiques();
    mettreAJourDernierePublication();
    console.info("InspecteurBot : " + listeCommuniques.length + " communiqué(s) chargé(s).");
  } catch (error) {
    console.error("Erreur de chargement des communiqués :", error);
    afficherEtatCommuniques("Vérifiez votre connexion Internet puis actualisez la page. " + (error?.message || ""), true);
  }
}

function urlAudio(fichier) {
  const url = new URL(fichier, new URL("./", window.location.href));
  // Évite qu'un ancien fichier audio reste dans le cache après son remplacement sur GitHub.
  url.searchParams.set("v", "latest");
  return url.href;
}

function echapperHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

function afficherCommuniques(data) {
  const container = document.getElementById("listeCommuniques");
  if (!container) return;
  if (!data.length) {
    afficherEtatCommuniques("Aucun communiqué ne correspond à votre recherche.");
    return;
  }
  container.innerHTML = data.map(communique => {
    const audioUrl = urlAudio(communique.audio);
    const badgeClass = communique.priorite === "haute" ? "urgent" :
      communique.priorite === "importante" ? "important" : "information";
    const titre = echapperHTML(communique.titre);
    const numero = echapperHTML(communique.numero || "");
    const date = echapperHTML(communique.datePublication || "");
    const auteur = echapperHTML(communique.auteur || "Inspection Générale du Travail");
    const duree = echapperHTML(communique.duree || "");
    const description = echapperHTML(communique.description || "");
    const texte = echapperHTML(communique.texte || "");
    const categorie = echapperHTML(communique.categorie || "");
    return `
      <article class="card communique-card" data-category="${categorie}">
        <span class="badge ${badgeClass}">${echapperHTML(communique.priorite || "Information")}</span>
        <h2>📢 ${titre}</h2>
        <div class="infos">
          <span><i class="fa-solid fa-hashtag"></i> ${numero}</span>
          <span><i class="fa-solid fa-calendar"></i> ${date}</span>
          <span><i class="fa-solid fa-user"></i> ${auteur}</span>
          ${duree ? `<span><i class="fa-solid fa-clock"></i> ${duree}</span>` : ""}
        </div>
        ${description ? `<p style="line-height:1.7;margin:8px 0 12px;color:#e8f2ff">${description}</p>` : ""}
        <div style="margin-top:14px;padding:16px;background:rgba(0,12,45,.35);border:1px solid rgba(255,255,255,.14);border-radius:16px">
          <div style="display:flex;align-items:center;gap:9px;margin-bottom:10px;color:#ffdf4d;font-weight:700">
            <i class="fa-solid fa-headphones"></i> Écouter le communiqué audio
          </div>
          <audio controls preload="metadata" playsinline style="display:block;width:100%;min-height:48px">
            <source src="${audioUrl}" type="audio/mpeg">
            Votre navigateur ne prend pas en charge la lecture audio.
          </audio>
          <div class="actions" style="margin-top:14px">
            <button type="button" onclick="chargerCommunique('${echapperHTML(communique.audio)}')">▶ Écouter dans le lecteur</button>
            <button type="button" onclick="telechargerAudio('${echapperHTML(communique.audio)}','${numero || "communique"}')">⬇ Télécharger l'audio</button>
            <button type="button" onclick="lireCommunique(${Number(communique.id) || 0})">📄 Lire le texte</button>
            <button type="button" onclick="partagerCommunique('${titre}')">🔗 Partager</button>
          </div>
          <details style="margin-top:14px;color:#e8f2ff">
            <summary style="cursor:pointer;font-weight:600">Afficher le texte du communiqué</summary>
            <p style="line-height:1.8;margin-top:10px">${texte || description}</p>
          </details>
        </div>
      </article>`;
  }).join("");
}

function chargerCommunique(audio) {
  if (!player) player = document.getElementById("mainPlayer");
  if (!player) return;
  player.src = urlAudio(audio);
  player.load();
  player.play().catch(error => console.info("Lecture en attente d'une action de l'utilisateur :", error));
}
window.chargerCommunique = chargerCommunique;

function initialiserRecherche() {
  const input = document.getElementById("searchCommunique");
  if (!input) return;
  input.addEventListener("input", () => {
    const recherche = input.value.trim().toLocaleLowerCase("fr");
    afficherCommuniques(listeCommuniques.filter(c =>
      [c.titre, c.description, c.numero, c.texte].some(v => String(v || "").toLocaleLowerCase("fr").includes(recherche))
    ));
  });
}

function initialiserFiltres() {
  document.querySelectorAll(".category").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      const filtre = btn.dataset.filter;
      afficherCommuniques(filtre === "all" ? listeCommuniques : listeCommuniques.filter(c => c.categorie === filtre));
    });
  });
}

function mettreAJourStatistiques() {
  const total = document.getElementById("totalCommuniques");
  if (total) total.textContent = String(listeCommuniques.length);
  const lectures = document.getElementById("totalLectures");
  if (lectures) lectures.textContent = String(listeCommuniques.reduce((n,c) => n + Number(c.statistiques?.lectures || 0), 0));
  const downloads = document.getElementById("totalTelechargements");
  if (downloads) downloads.textContent = String(listeCommuniques.reduce((n,c) => n + Number(c.statistiques?.telechargements || 0), 0));
}

function mettreAJourDernierePublication() {
  const el = document.getElementById("lastDate");
  if (!el || !listeCommuniques.length) return;
  el.textContent = listeCommuniques[0].datePublication || "—";
}

function initialiserAudio() {
  const volume = document.getElementById("volumeControl");
  const speed = document.getElementById("speedControl");
  if (volume && player) volume.addEventListener("input", () => player.volume = Number(volume.value));
  if (speed && player) speed.addEventListener("change", () => player.playbackRate = Number(speed.value));
  if (player) {
    player.addEventListener("timeupdate", () => {
      const current = document.getElementById("currentTime");
      const duration = document.getElementById("duration");
      const fmt = n => Number.isFinite(n) ? new Date(n * 1000).toISOString().slice(14,19) : "00:00";
      if (current) current.textContent = fmt(player.currentTime);
      if (duration) duration.textContent = fmt(player.duration);
    });
  }
}
window.playAudio = () => player?.play();
window.pauseAudio = () => player?.pause();
window.stopAudio = () => { if (player) { player.pause(); player.currentTime = 0; } };
window.backAudio = () => { if (player) player.currentTime = Math.max(0, player.currentTime - 10); };
window.forwardAudio = () => { if (player) player.currentTime = Math.min(player.duration || Infinity, player.currentTime + 10); };
window.muteAudio = () => { if (player) player.muted = !player.muted; };

async function telechargerAudio(fichier, numero = "communique") {
  const url = urlAudio(fichier);
  const link = document.createElement("a");
  link.href = url;
  link.download = String(numero).replace(/[^a-z0-9_-]/gi, "_") + ".mp3";
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
window.telechargerAudio = telechargerAudio;

function partagerCommunique(titre) {
  const url = window.location.href;
  if (navigator.share) navigator.share({ title: titre, text: "Communiqué officiel InspecteurBot RDC", url }).catch(() => {});
  else if (navigator.clipboard) navigator.clipboard.writeText(url);
}
window.partagerCommunique = partagerCommunique;

function lireCommunique(id) {
  const communique = listeCommuniques.find(c => Number(c.id) === Number(id));
  if (!communique) return;
  const modal = document.getElementById("lectureModal");
  if (modal) modal.style.display = "flex";
  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value || ""; };
  set("lectureTitre", communique.titre);
  set("lectureNumero", "Communiqué N° " + (communique.numero || ""));
  set("lectureDate", "📅 " + (communique.datePublication || ""));
  set("lectureAuteur", "👤 " + (communique.auteur || ""));
  set("lectureCategorie", "📂 " + (communique.categorie || ""));
  set("lectureTexte", communique.texte || communique.description || "");
  const listen = document.getElementById("btnEcouterLecture");
  if (listen) listen.onclick = () => chargerCommunique(communique.audio);
}
window.lireCommunique = lireCommunique;

document.addEventListener("DOMContentLoaded", () => {
  const close = document.getElementById("btnFermerLecture");
  if (close) close.onclick = () => {
    const modal = document.getElementById("lectureModal");
    if (modal) modal.style.display = "none";
  };
});
window.addEventListener("click", event => {
  const modal = document.getElementById("lectureModal");
  if (modal && event.target === modal) modal.style.display = "none";
});
