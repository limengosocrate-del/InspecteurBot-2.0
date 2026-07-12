/**
 * Point d'entrée principal — orchestre routes et modules.
 * @module core/app
 */
import router from './router.js';
import store from './store.js';
import eventBus from './eventBus.js';
import { renderDashboard } from '../modules/dashboard.js';
import { getModelesForSelect, TYPES_PV } from '../data/templates.js';
import { creerPV } from '../modules/pvManager.js';
import { renderConstatInfraction } from '../templates/pvConstatInfraction.js';
import * as AI from '../ai/aiEngine.js';

console.log("✅ app.js chargé");
window.onerror = (msg, src, line) => {
  console.error("ERREUR :", msg, src, line);
};

const app = document.getElementById('app');

function layout(contenu) {
  return `
  <div class="ib-shell">
    <nav class="ib-sidebar">
      <div class="ib-logo">InspecteurBot • PV</div>
      <ul>
        <li><a href="#accueil">🏠 Accueil</a></li>
        <li><a href="#nouveau">➕ Nouveau PV</a></li>
        <li><a href="#tous">📄 Tous les PV</a></li>
        <li><a href="#brouillons">✏️ Brouillons</a></li>
        <li><a href="#modeles">📋 Modèles officiels</a></li>
        <li><a href="#assistant">🤖 Assistant IA</a></li>
        <li><a href="#infractions">⚖️ Infractions</a></li>
        <li><a href="#recherche">🔍 Recherche</a></li>
        <li><a href="#stats">📊 Statistiques</a></li>
        <li><a href="#parametres">⚙️ Paramètres</a></li>
      </ul>
    </nav>
    <main class="ib-main">${contenu}</main>
  </div>`;
}

// Routes
router
  .register('accueil', () => { app.innerHTML = layout(renderDashboard()); })
  .register('nouveau', () => {
    const modeles = getModelesForSelect();
    app.innerHTML = layout(`
      <h1>Nouveau Procès-Verbal</h1>
      <div class="modeles-grid">
        ${modeles.map(m => `<button class="modele-card" data-type="${m.id}">${m.titre}</button>`).join('')}
      </div>`);
    document.querySelectorAll('.modele-card').forEach(b =>
      b.addEventListener('click', () => {
        const pv = creerPV(b.dataset.type, {});
        router.navigate('editer/' + pv.id);
      }));
  })
  .register('assistant', () => {
    app.innerHTML = layout(`
      <h1>🤖 Assistant IA Juridique</h1>
      <div class="chat">
        <div id="chatLog" class="chat-log"></div>
        <div class="chat-input">
          <textarea id="chatInput" placeholder="Décrivez les faits ou posez une question juridique..."></textarea>
          <button id="chatSend">Envoyer</button>
        </div>
      </div>`);
    const log = document.getElementById('chatLog');
    document.getElementById('chatSend').addEventListener('click', () => {
      const inp = document.getElementById('chatInput');
      if (!inp.value.trim()) return;
      log.innerHTML += `<div class="msg user">${inp.value}</div>`;
      const r = AI.repondre(inp.value);
      log.innerHTML += `<div class="msg bot">${r.reponse.replace(/\n/g,'<br>')}</div>`;
      inp.value = ''; log.scrollTop = log.scrollHeight;
    });
  })
  .register('tous', () => {
    const pvs = store.get('pvs');
    app.innerHTML = layout(`<h1>Tous les PV</h1>
      <table class="table-liste"><thead><tr><th>Numéro</th><th>Type</th><th>Entreprise</th><th>Statut</th><th>Date</th></tr></thead>
      <tbody>${pvs.map(p => `<tr onclick="location.hash='editer/${p.id}'">
        <td>${p.numero||'—'}</td><td>${p.titre}</td><td>${p.entreprise||'—'}</td>
        <td><span class="badge ${p.statut}">${p.statut}</span></td>
        <td>${new Date(p.dateCreation).toLocaleDateString('fr-FR')}</td></tr>`).join('')}</tbody></table>`);
  });

// Démarrage
document.addEventListener('DOMContentLoaded', () => {
  store.state.utilisateurCourant = 'inspecteur';
  router.start();
});

eventBus.on('store:saved', () => console.debug('[App] Sauvegarde auto effectuée.'));
