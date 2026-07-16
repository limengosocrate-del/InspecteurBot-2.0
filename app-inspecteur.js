/**
 * InspecteurBot — Module Inspecteur et Contrôleur du Travail
 * Fichier principal app.js
 * Contient : navigation, documentation, mission, IA, archives, tableau de bord
 */

// ==========================================
// CONFIG & STATE
// ==========================================
const STATE = {
  currentSection: 'accueil',
  currentArticle: 187,
  currentIAOutput: 'rapport',
  iaMode: 'mission',
  isListening: false,
  listeningTimer: null,
  transcriptLog: [],
  currentMission: null,
  archiveData: [],
  docsData: {},
  modelLibrary: [],
};

const ARTICLES = {
  187: {
    title: "Article 187 — Agents chargés de l'inspection du travail",
    meta: "Titre I — Les Inspecteurs du Travail — Code du travail RDC (2002)",
    body: `<p>Les inspecteurs du travail sont nommés par le Ministre du Travail et de la Prévoyance sociale. Ils sont chargés de veiller à l'application des dispositions du Code du travail et des autres dispositions légales relatives au régime du travail.</p>
<p>Ils doivent prêter serment devant le tribunal compétent avant leur entrée en fonction. Ce serment engage leur responsabilité personnelle et institutionnelle.</p>
<p>Ils disposent d'une indépendance fonctionnelle dans l'exercice de leurs missions, conformément aux conventions internationales relatives à l'inspection du travail.</p>`
  },
  188: {
    title: "Article 188 — Mission des agents chargés de l'inspection du travail",
    meta: "Titre I — Les Inspecteurs du Travail — Code du travail RDC (2002)",
    body: `<p>Les agents chargés de l'inspection du travail sont autorisés, munis des pièces justificatives de leurs fonctions :</p>
<ul>
<li>a) à pénétrer librement, sans avertissement préalable, à toute heure du jour et de la nuit, dans tout établissement assujetti au contrôle de l'inspection ;</li>
<li>b) à pénétrer le jour dans tous les locaux qu'ils supposent être assujettis au contrôle de l'inspection ;</li>
<li>c) à procéder à tous examens, contrôles ou enquêtes qu'ils jugent nécessaires pour s'assurer que les dispositions légales sont effectivement observées.</li>
</ul>`
  },
  189: {
    title: "Article 189 — Droit d'entrée et de visite",
    meta: "Titre I — Les Inspecteurs du Travail — Code du travail RDC (2002)",
    body: `<p>Le droit de visite s'exerce sans avertissement préalable. L'inspecteur ou le contrôleur du travail peut pénétrer dans tout établissement assujetti au contrôle, même en l'absence de l'employeur.</p>
<p>Il peut exiger l'ouverture d'un local fermé si celui-ci est susceptible d'être assujetti au contrôle de l'inspection.</p>
<p>Le droit d'entrée ne s'applique pas aux locaux d'habitation sans l'autorisation des occupants, conformément au respect du domicile.</p>`
  },
  190: {
    title: "Article 190 — Droit d'interrogation et d'audition",
    meta: "Titre I — Les Inspecteurs du Travail — Code du travail RDC (2002)",
    body: `<p>Les inspecteurs du travail peuvent interroger, soit seuls, soit en présence de témoins, l'employeur ou le personnel de l'entreprise ou de l'établissement sur toutes les matières relatives à l'application des dispositions légales.</p>
<p>Les employeurs et le personnel sont tenus de répondre aux questions posées dans le cadre de l'inspection. Tout refus ou toute obstruction peut donner lieu à un procès-verbal d'obstruction au contrôle.</p>`
  },
  191: {
    title: "Article 191 — Droit de consultation et de copie des documents",
    meta: "Titre I — Les Inspecteurs du Travail — Code du travail RDC (2002)",
    body: `<p>Les inspecteurs du travail peuvent demander que leur soient communiqués, soit sur les lieux du travail, soit en leur bureau, tous livres, registres et documents dont la tenue est prescrite par la législation en vue d'en vérifier la conformité avec les dispositions légales et d'en prendre copie ou d'en établir des extraits.</p>
<p>Ils peuvent également exiger l'affichage des avis dont l'apposition est prévue par les dispositions légales.</p>`
  },
  192: {
    title: "Article 192 — Prélèvement d'échantillons",
    meta: "Titre I — Les Inspecteurs du Travail — Code du travail RDC (2002)",
    body: `<p>Les inspecteurs du travail peuvent prélever et emporter, aux fins d'analyse, des échantillons des matières premières et substances utilisées ou manipulées, pourvu que l'employeur ou son représentant soit averti que des matières ou substances ont été prélevées et emportées à cette fin.</p>`
  },
  193: {
    title: "Article 193 — Assistance technique",
    meta: "Titre I — Les Inspecteurs du Travail — Code du travail RDC (2002)",
    body: `<p>L'inspecteur du travail peut faire appel à une assistance technique de certains techniciens de l'administration ou des organismes gouvernementaux ou de toute personne autorisée par l'ordonnance du ministre.</p>
<p>Cette assistance technique renforce la capacité d'investigation dans des domaines spécialisés tels que la sécurité, l'hygiène, la comptabilité du travail ou l'environnement.</p>`
  },
  194: {
    title: "Article 194 — Confidentialité et secret professionnel",
    meta: "Titre I — Les Inspecteurs du Travail — Code du travail RDC (2002)",
    body: `<p>Les inspecteurs et contrôleurs du travail doivent traiter comme absolument confidentielle la source de toute plainte leur signalant un défaut d'installation ou une infraction aux dispositions légales.</p>
<p>Ils doivent s'abstenir de révéler à l'employeur ou à son représentant qu'il a été procédé à une visite d'inspection en suite d'une plainte.</p>`
  },
  195: {
    title: "Article 195 — Indépendance et absence d'intérêt direct",
    meta: "Titre I — Les Inspecteurs du Travail — Code du travail RDC (2002)",
    body: `<p>Les inspecteurs du travail ne doivent pas avoir d'intérêt direct ou indirect dans les entreprises placées sous leur contrôle.</p>
<p>Tout conflit d'intérêts doit être signalé immédiatement au supérieur hiérarchique. Le non-respect de cette disposition peut entraîner des sanctions disciplinaires et pénales.</p>`
  },
  196: {
    title: "Article 196 — Procès-verbaux d'infraction",
    meta: "Titre I — Les Inspecteurs du Travail — Code du travail RDC (2002)",
    body: `<p>Les inspecteurs du travail sont chargés, concurremment avec les officiers et agents de police judiciaire, de constater les infractions aux dispositions légales relatives au travail et d'en dresser procès-verbal.</p>
<p>Le procès-verbal fait foi jusqu'à preuve du contraire et doit être transmis au procureur de la République et à l'employeur.</p>`
  },
  197: {
    title: "Article 197 — Mesures et recommandations",
    meta: "Titre I — Les Inspecteurs du Travail — Code du travail RDC (2002)",
    body: `<p>À la suite d'une inspection, l'inspecteur du travail peut formuler des observations, des recommandations ou des mises en demeure. Il peut proposer des actions correctives et fixer un délai pour leur mise en œuvre.</p>
<p>En cas de non-respect, un nouveau procès-verbal peut être établi et des sanctions administratives ou judiciaires peuvent être engagées.</p>`
  },
  198: {
    title: "Article 198 — Rapport et archivage",
    meta: "Titre I — Les Inspecteurs du Travail — Code du travail RDC (2002)",
    body: `<p>Chaque mission d'inspection doit faire l'objet d'un rapport détaillé transmis à l'autorité mandante. Le rapport doit comporter : la date, le numéro de l'ordre de service, le groupe, les participants, l'objectif, la matière contrôlée, les entreprises visitées, les constats, les irrégularités relevées, les recommandations, les décisions proposées et les actions de suivi.</p>
<p>Le rapport est archivé et peut servir de référence pour des inspections ultérieures ou des procédures judiciaires.</p>`
  }
};

function showToast(message, type) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast ' + (type || 'info');
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3000);
}

// ==========================================
// DOCUMENTATION
// ==========================================
function navigateToArticle(art) {
  STATE.currentArticle = art;
  document.querySelectorAll('.article-tab').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-art="${art}"]`).classList.add('active');
  document.querySelectorAll('.doc-article').forEach(d => d.classList.remove('active'));
  document.getElementById('doc-article-' + art).classList.add('active');
  document.getElementById('docContent').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function filterArticles(query) {
  const q = query.toLowerCase().trim();
  document.querySelectorAll('.doc-article').forEach(d => {
    const text = d.innerText.toLowerCase();
    d.classList.toggle('hidden', q.length > 0 && !text.includes(q));
    if (!d.classList.contains('hidden')) d.classList.add('active');
  });
  if (q.length === 0) navigateToArticle(STATE.currentArticle);
}

function printDoc() {
  showToast('Impression de la documentation lancée.', 'info');
  window.print();
}

function exportDocPDF() {
  const el = document.getElementById('docContent');
  const opt = {
    margin: [10, 10, 10, 10],
    filename: 'base_juridique_art_187_198.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(el).save().then(() => showToast('PDF exporté : base_juridique_art_187_198.pdf', 'success'));
}

// ==========================================
// MISSION FORM & OFFICIAL REPORT GENERATION
// ==========================================
function initMissionForm() {
  document.getElementById('mDate').valueAsDate = new Date();
}

function createMission(e) {
  e.preventDefault();
  const data = {
    date: document.getElementById('mDate').value,
    order: document.getElementById('mOrder').value,
    group: document.getElementById('mGroup').value,
    role: document.getElementById('mRole').value,
    participants: document.getElementById('mParticipants').value,
    objective: document.getElementById('mObjective').value,
    matter: document.getElementById('mMatter').value,
    companies: document.getElementById('mCompanies').value,
    addresses: document.getElementById('mAddresses').value,
    phone: document.getElementById('mPhone').value,
    observations: document.getElementById('mObservations').value,
  };
  STATE.currentMission = data;
  renderReportPreview(data);
  document.getElementById('reportPreviewArea').classList.remove('hidden');
  document.getElementById('reportPreviewArea').scrollIntoView({ behavior: 'smooth' });
  showToast('Rapport généré avec succès — Aperçu A4 visible.', 'success');
  // Auto-archive
  STATE.archiveData.push({ ...data, id: Date.now(), status: 'active', timestamp: new Date().toISOString() });
  saveArchive();
  updateDashboard();
  updateArchiveTable();
}

function resetMissionForm() {
  document.getElementById('missionForm').reset();
  initMissionForm();
  document.getElementById('reportPreviewArea').classList.add('hidden');
  STATE.currentMission = null;
}

function renderReportPreview(data) {
  const meta = `
    <strong>Inspecteur et Contrôleur du Travail</strong><br/>
    Ordre de service : ${data.order || '—'} | Groupe : ${data.group || '—'} | Fonction : ${data.role || '—'}<br/>
    Participants : ${data.participants ? data.participants.replace(/\n/g, ', ') : '—'}
  `;
  document.getElementById('previewMeta').innerHTML = meta;

  const companiesText = data.companies ? data.companies.split('\n').map((line, i) => {
    const [name, sector] = line.split('—').map(s => s.trim());
    return `<tr><td>${i + 1}</td><td>${name || line}</td><td>${sector || '—'}</td><td>À vérifier</td><td>—</td></tr>`;
  }).join('') : '';

  const body = `
    <h2>I. Introduction</h2>
    <p>Sur ordre de service N° <strong>${data.order || '—'}</strong> en exécution de l'Ordre de mission collectif de son Excellence Monsieur le Ministre de l'Emploi et du Travail.</p>
    <p>Avec comme mission de : <strong>${data.objective || '—'}</strong></p>
    <p>Avec comme matière à contrôler : <strong>${data.matter || '—'}</strong></p>

    <h2>II. Déroulement de la Mission</h2>
    <p><strong>Période :</strong> ${data.date || '—'}</p>
    <p><strong>Lieu de la Mission :</strong> ${data.addresses ? data.addresses.split('\n')[0] : '—'}</p>
    <p><strong>Méthodologie utilisée :</strong></p>
    <ul>
      <li>Présentation et prise de contact ;</li>
      <li>Identification : présentation de l'identité et de la qualité ;</li>
      <li>Notification de l'objet du contrôle ;</li>
      <li>Visite des lieux de travail ;</li>
      <li>Entretiens avec l'employeur ou son représentant.</li>
    </ul>

    <h2>III. Entreprises visitées</h2>
    <table>
      <thead><tr><th>N°</th><th>RAISON SOCIALE</th><th>SECTEUR D'ACTIVITÉS</th><th>CONSTAT</th><th>OBS</th></tr></thead>
      <tbody>${companiesText}</tbody>
    </table>

    <h2>IV. Difficultés rencontrées</h2>
    <p>— ${data.observations || 'Aucune difficulté particulière signalée.'}</p>
  `;
  document.getElementById('previewBody').innerHTML = body;
  document.getElementById('previewDate').textContent = data.date ? new Date(data.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  document.getElementById('previewCity').textContent = (data.addresses || '').split(',')[0] || 'KINSHASA';
  document.getElementById('previewSignName').textContent = data.role ? (data.role === 'Inspecteur du Travail' ? 'Inspecteur' : data.role) : '';
  document.getElementById('previewSignRole').textContent = data.role || '';
  document.getElementById('previewSignPhone').textContent = data.phone || '';
}

function printReport() {
  showToast('Impression du rapport lancée.', 'info');
  window.print();
}

function exportReportPDF() {
  const el = document.getElementById('a4Paper');
  if (!el) { showToast('Aucun rapport à exporter.', 'info'); return; }
  const opt = {
    margin: [8, 8, 8, 8],
    filename: 'rapport_mission_igt.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 3, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(el).save().then(() => showToast('PDF exporté : rapport_mission_igt.pdf', 'success'));
}

function saveReportToArchive() {
  if (!STATE.currentMission) { showToast('Aucune mission active à enregistrer.', 'info'); return; }
  showToast('Rapport enregistré et archivé avec succès.', 'success');
}

function editCurrentReport() {
  showToast('Modification activée. Utilisez le formulaire pour mettre à jour le rapport.', 'info');
  document.getElementById('missionForm').scrollIntoView({ behavior: 'smooth' });
}

// ==========================================
// AI MODELS LIBRARY (100+)
// ==========================================
function buildModelLibrary() {
  const categories = ['introduction', 'constat', 'infraction', 'recommandation', 'conclusion'];
  const baseTemplates = [
    "Sur ordre de service N° {num} et conformément à la législation en vigueur, la mission d'inspection a pour objectif de {objectif}.",
    "Il a été constaté lors de la visite du {date} que l'entreprise {entreprise} ne respecte pas entièrement les dispositions relatives à {matiere}.",
    "Le présent procès-verbal est établi en application des articles 187 à 198 du Code du travail. Il constate l'infraction de {infraction}.",
    "Il est recommandé à l'employeur de procéder dans un délai de {delai} à la régularisation des points suivants : {points}.",
    "Au terme de la mission, il est proposé : {action} en raison de {motif}.",
    "L'inspection a relevé l'absence des documents suivants : {docs}. L'employeur est mis en demeure de les présenter dans un délai de {delai}.",
    "Le contrôle a permis de vérifier la conformité des conditions de travail relatives à {matiere}. Aucune irrégularité majeure n'a été relevée.",
    "Le manque de moyens de transport a constitué une difficulté importante au cours de la mission, limitant l'accès à certains sites.",
    "Il est demandé à l'entreprise de procéder immédiatement à l'affichage des avis obligatoires conformément à l'article 191 du Code du travail.",
    "Le chef de mission, {nom}, certifie avoir conduit le contrôle dans le respect des procédures et du secret professionnel.",
  ];
  const variants = [
    { objectif: "la protection de la main d'œuvre nationale", infraction: "la non-présentation des documents obligatoires", action: "une mise en demeure", motif: "l'absence répétée de conformité" },
    { objectif: "le respect des conditions de sécurité et d'hygiène", infraction: "l'obstruction au contrôle", action: "un procès-verbal d'obstruction", motif: "le refus d'accès aux locaux" },
    { objectif: "l'application de la législation sociale", infraction: "le non-respect de la convention collective", action: "une convocation", motif: "la persistance des écarts" },
    { objectif: "la vérification des registres du personnel", infraction: "la non-tenue des registres prescrits", action: "une lettre d'observations", motif: "le défaut de tenue documentaire" },
    { objectif: "le contrôle de la main d'œuvre étrangère", infraction: "l'emploi irrégulier de travailleurs étrangers", action: "une réinspection dans 3 mois", motif: "l'irrégularité persistante" },
    { objectif: "l'évaluation des conditions de travail", infraction: "la non-conformité des installations", action: "une visite complémentaire", motif: "le risque pour la santé des travailleurs" },
  ];
  STATE.modelLibrary = [];
  categories.forEach(cat => {
    for (let i = 0; i < 25; i++) {
      const v = variants[i % variants.length];
      const text = baseTemplates[i % baseTemplates.length]
        .replace('{num}', `OS-${Math.floor(Math.random() * 900) + 100}`)
        .replace('{date}', 'du 14 au 30 avril 2025')
        .replace('{entreprise}', 'SOCIÉTÉ EXEMPLE SARL')
        .replace('{objectif}', v.objectif)
        .replace('{matiere}', v.objectif)
        .replace('{infraction}', v.infraction)
        .replace('{action}', v.action)
        .replace('{motif}', v.motif)
        .replace('{delai}', i % 2 === 0 ? '15 jours' : '30 jours')
        .replace('{docs}', 'registre du personnel, contrats de travail, bulletins de paie')
        .replace('{points}', 'mise à jour des registres, affichage des avis, régularisation des contrats, formation du personnel')
        .replace('{nom}', );
      STATE.modelLibrary.push({ category: cat, title: `Modèle ${i + 1} — ${cat}`, text: text });
    }
  });
}

function filterModels(cat) {
  const grid = document.getElementById('modelsGrid');
  const list = cat === 'all' ? STATE.modelLibrary : STATE.modelLibrary.filter(m => m.category === cat);
  grid.innerHTML = list.map(m => `
    <article class="model-card">
      <h4>${m.title}</h4>
      <div class="model-text">${m.text}</div>
      <div class="model-actions">
        <button onclick="copyText(this)" class="btn-outline" aria-label="Copier le modèle"><i class="fa-solid fa-copy"></i> Copier</button>
        <button onclick="adaptText('${encodeURIComponent(m.text)}')" class="btn-outline" aria-label="Adapter ce modèle"><i class="fa-solid fa-pen-to-square"></i> Adapter</button>
      </div>
    </article>
  `).join('');
}

function copyText(btn) {
  const text = btn.closest('.model-card').querySelector('.model-text').innerText;
  navigator.clipboard.writeText(text).then(() => { btn.innerHTML = '<i class="fa-solid fa-check"></i> Copié'; showToast('Modèle copié dans le presse-papier.', 'success'); setTimeout(() => btn.innerHTML = '<i class="fa-solid fa-copy"></i> Copier', 1200); });
}

function adaptText(encoded) {
  const text = decodeURIComponent(encoded);
  const area = document.createElement('textarea');
  area.value = text;
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  document.body.removeChild(area);
  showToast('Modèle copié dans le presse-papier. Vous pouvez le coller dans votre rapport.', 'success');
}

// ==========================================
// IT/CT IA — LOCAL AI SIMULATION
// ==========================================
function setIAMode(mode) {
  STATE.iaMode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('mode' + mode.charAt(0).toUpperCase() + mode.slice(1)).classList.add('active');
  document.getElementById('iaTranscript').innerHTML = '<p class="transcript-placeholder">Mode : <strong>' + mode + '</strong>. Prêt à démarrer l\'écoute.</p>';
  document.getElementById('iaOutput').classList.add('hidden');
  STATE.transcriptLog = [];
}

function startListening() {
  STATE.isListening = true;
  document.getElementById('btnStart').classList.add('hidden');
  document.getElementById('btnStop').classList.remove('hidden');
  document.getElementById('iaStatusIndicator').classList.add('listening');
  document.getElementById('iaStatusText').textContent = 'Écoute active — Transcription en temps réel...';
  STATE.transcriptLog = [];
  document.getElementById('iaTranscript').innerHTML = '';

  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    showToast('Cette fonctionnalité nécessite un navigateur compatible (Chrome/Edge) et une connexion internet.', 'info');
    document.getElementById('btnStop').click();
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.lang = 'fr-FR';

  recognition.onstart = () => {
    showToast('Microphone ouvert — Parlez clairement.', 'success');
  };

  recognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        const lang = detectLanguageReal(transcript);
        const entry = { time: new Date().toLocaleTimeString('fr-FR'), text: transcript.trim(), lang: lang, mode: STATE.iaMode };
        STATE.transcriptLog.push(entry);
        renderTranscriptEntry(entry);
        if (STATE.transcriptLog.length >= 5) {
          generateIAOutput();
        }
      } else {
        renderTranscriptEntry({ time: new Date().toLocaleTimeString('fr-FR'), text: transcript.trim() + ' ... (en cours)', lang: 'détection en cours', mode: STATE.iaMode });
      }
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error', event);
    showToast('Erreur d\'écoute : ' + event.error + '. Vérifiez votre connexion et le microphone.', 'info');
  };

  recognition.onend = () => {
    if (STATE.isListening) {
      recognition.start();
    }
  };

  recognition.start();
  STATE.currentRecognition = recognition;

  const duration = parseFloat(document.getElementById('iaDuration').value) * 3600 * 1000;
  setTimeout(stopListening, Math.min(duration, 300000));
}

function stopListening() {
  STATE.isListening = false;
  if (STATE.currentRecognition) {
    STATE.currentRecognition.stop();
    STATE.currentRecognition = null;
  }
  clearInterval(STATE.listeningTimer);
  document.getElementById('btnStart').classList.remove('hidden');
  document.getElementById('btnStop').classList.add('hidden');
  document.getElementById('iaStatusIndicator').classList.remove('listening');
  document.getElementById('iaStatusText').textContent = 'Écoute terminée. Génération du document en cours...';
  showToast('Écoute arrêtée. Génération du rapport en cours.', 'info');
  setTimeout(() => {
    generateIAOutput();
  }, 1200);
}

function detectLanguageReal(text) {
  const lower = text.toLowerCase();
  if (lower.includes('bonjour') || lower.includes('contrôle') || lower.includes('procès-verbal') || lower.includes('mission') || lower.includes('inspection')) return 'français';
  if (lower.includes('good morning') || lower.includes('inspection') || lower.includes('report') || lower.includes('obstruction') || lower.includes('overtime')) return 'anglais';
  if (lower.includes('tobanda') || lower.includes('mosala') || lower.includes('biso') || lower.includes('kobanda')) return 'lingala';
  if (lower.includes('habari') || lower.includes('tafadhali') || lower.includes('tunaanza') || lower.includes('tunapendekeza')) return 'swahili';
  return 'indéterminé';
}

function renderTranscriptEntry(entry) {
  const container = document.getElementById('iaTranscript');
  if (container.querySelector('.transcript-placeholder')) container.innerHTML = '';
  // ChatGPT-style: continuous text without per-line separation or timestamp labels
  const span = document.createElement('span');
  span.style.display = 'inline';
  span.style.marginRight = '0.5rem';
  span.textContent = entry.text;
  container.appendChild(span);
  container.scrollTop = container.scrollHeight;
}

function generateIAOutput() {
  document.getElementById('iaOutput').classList.remove('hidden');
  document.getElementById('iaOutput').scrollIntoView({ behavior: 'smooth' });
  const mode = STATE.iaMode;
  const transcript = STATE.transcriptLog.map(e => e.text).join(' ');
  let output = '';

  if (mode === 'conversation') {
    const fullText = STATE.transcriptLog.map(e => e.text).join(' ');
    output = `
      <h4>Conversation — Transcription en temps réel</h4>
      <p style="font-size:0.85rem;color:var(--ink-muted);margin-bottom:1rem;">Aucune référence de rapport requise. Cliquez sur le texte ci-dessous pour exporter en PDF.</p>
      <div onclick="exportConversationPDF()" style="cursor:pointer;background:#fff;border:2px dashed var(--primary);border-radius:10px;padding:1rem;color:var(--ink);line-height:1.6;" title="Cliquer pour exporter ce texte en PDF">
        <p><strong>Contenu transcrit :</strong> ${fullText || '(En cours d\'écoute...)'}</p>
        <p style="font-size:0.75rem;color:var(--accent);margin-top:0.5rem;"><i class="fa-solid fa-file-pdf"></i> Cliquer ici pour générer le PDF automatiquement</p>
      </div>
    `;
  } else {
    const companies = ['REWA CONGO', 'RALPH SERVICES', 'STARTIMES MEDIA RDC', 'KABOD INVESTISMENT SARL', 'UBA', 'FONDATION ALLIANCE EUP', 'LIQUID TELECOM', 'AFRIQUE DIGITAL CONGO', 'POLYCLINIQUE DE KINSHASA', 'RESTAURANT CHEZ FRIDA', 'ABEAR PRESING', 'ERIGES LODGES', 'KIDS SPORS', 'BRAINS INTERNATIONAL', 'KIN CONGO NATURE', 'PRIMA SUPER MARKET', 'COOKS BISTRO', 'MAISON KAYSER'];
    const companyLine = companies[Math.floor(Math.random() * companies.length)];
    const pvList = [
      'Procès-verbal de constat d\'infraction',
      'Procès-verbal d\'obstruction au contrôle',
      'Procès-verbal de non-présentation des documents',
      'Procès-verbal de non-respect de la législation sociale'
    ];
    const actions = [
      'Mise en demeure',
      'Convocation',
      'Lettre d\'observations',
      'Visite de contrôle complémentaire',
      'Réinspection après 1 mois',
      'Réinspection après 3 mois',
      'Classement sans suite (entreprise conforme)'
    ];

    output = `
      <h4>Rapport généré automatiquement — ${mode.toUpperCase()}</h4>
      <table style="width:100%;font-size:0.85rem;border-collapse:collapse;margin-bottom:1rem;">
        <tr><td style="font-weight:600;padding:0.3rem;">Date</td><td>${new Date().toLocaleDateString('fr-FR')}</td></tr>
        <tr><td style="font-weight:600;padding:0.3rem;">Ordre de service</td><td>OS-${Math.floor(Math.random() * 900) + 100}</td></tr>
        <tr><td style="font-weight:600;padding:0.3rem;">Groupe</td><td>G-${Math.floor(Math.random() * 10) + 1}</td></tr>
        <tr><td style="font-weight:600;padding:0.3rem;">Fonction</td><td>Inspecteur du Travail / Chef de mission</td></tr>
        <tr><td style="font-weight:600;padding:0.3rem;">Participants</td><td></td></tr>
        <tr><td style="font-weight:600;padding:0.3rem;">Objectif</td><td>${mode === 'mission' ? 'Contrôle de conformité de la législation sociale' : mode === 'reunion' ? 'Réunion d\'information et coordination' : 'Formation et sensibilisation'}</td></tr>
        <tr><td style="font-weight:600;padding:0.3rem;">Matière</td><td>Inspection du travail — Application du Code du travail</td></tr>
        <tr><td style="font-weight:600;padding:0.3rem;">Entreprise visitée</td><td>${companyLine}</td></tr>
        <tr><td style="font-weight:600;padding:0.3rem;">Adresse</td><td>Axé ${new Date().getFullYear() % 5 + 1} Novembre, Gombe, Kinshasa</td></tr>
      </table>

      <h4>Résumé de la mission</h4>
      <p>La mission a été menée sur l'axe de Kinshasa — Gombe avec une méthodologie standard : présentation, identification, notification de l'objet, visite des lieux, entretiens et collecte des documents. L'IA a détecté ${STATE.transcriptLog.length} segments de conversation, dont plusieurs en ${detectLanguageReal(transcript.substring(0, 200))}.</p>

      <h4>Constats effectués</h4>
      <ul>
        <li>Inspection des registres et documents obligatoires.</li>
        <li>Vérification de l'affichage des avis prévus par la loi.</li>
        <li>Contrôle des conditions de sécurité et d'hygiène.</li>
        <li>Entretien avec le personnel et l'employeur.</li>
      </ul>

      <h4>Irrégularités relevées</h4>
      <ul>
        <li>Absence de certains documents liés à la main d'œuvre nationale et étrangère.</li>
        <li>Non-conformité des règlements internes.</li>
        <li>Obstruction au contrôle relevée dans plusieurs établissements.</li>
      </ul>

      <h4>Recommandations et décisions proposées</h4>
      <ul>
        <li><strong>${pvList[Math.floor(Math.random() * pvList.length)]}</strong> — à transmettre au procureur.</li>
        <li><strong>${actions[Math.floor(Math.random() * actions.length)]}</strong> — délai proposé : 15 à 30 jours.</li>
        <li>Réinspection complémentaire recommandée après régularisation.</li>
      </ul>

      <h4>Actions de suivi</h4>
      <p>Le suivi sera assuré par le même groupe d'inspection. Un nouveau contrôle est prévu après un délai de 1 mois. En cas de persistance des irrégularités, des mesures judiciaires pourront être engagées conformément aux articles 196 à 198 du Code du travail.</p>
    `;
  }

  document.getElementById('iaOutputBody').innerHTML = output;
  document.getElementById('tabRapport').click();
}

function showIAOutput(key) {
  STATE.currentIAOutput = key;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab' + key.charAt(0).toUpperCase() + key.slice(1)).classList.add('active');
  // For simplicity, same content is shown under all tabs; in a full app, each would be different.
  generateIAOutput();
}

function copyIAOutput() {
  const body = document.getElementById('iaOutputBody');
  const text = body.innerText;
  navigator.clipboard.writeText(text).then(() => alert('Contenu copié dans le presse-papier.'));
}

function printIAOutput() {
  window.print();
}

function exportConversationPDF() {
  const fullText = STATE.transcriptLog.map(e => e.text).join(' ');
  const content = `<h2>IT/CT IA — Transcription de conversation</h2><p>Date : ${new Date().toLocaleString('fr-FR')}</p><p>Mode : ${STATE.iaMode}</p><hr/><p>${fullText || 'Aucun texte transcrit.'}</p>`;
  const opt = {
    margin: [10, 10, 10, 10],
    filename: 'conversation_transcription.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  tempDiv.style.fontFamily = 'Inter, sans-serif';
  tempDiv.style.padding = '20px';
  document.body.appendChild(tempDiv);
  html2pdf().set(opt).from(tempDiv).save().then(() => {
    document.body.removeChild(tempDiv);
    showToast('PDF généré automatiquement : conversation_transcription.pdf', 'success');
  });
}

function exportIAOutputPDF() {
  const el = document.getElementById('iaOutputBody');
  const opt = {
    margin: [10, 10, 10, 10],
    filename: `itct_ia_${STATE.currentIAOutput}_${State.currentMission ? 'mission' : 'conversation'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(el).save();
}

// ==========================================
// ARCHIVES
// ==========================================
function loadArchive() {
  try {
    const saved = localStorage.getItem('inspecteurbot_archive');
    if (saved) {
      STATE.archiveData = JSON.parse(saved);
    } else {
      STATE.archiveData = [
        { id: 1, date: '2025-04-14', order: '22/MET/IGT/AI-EPNT/070', group: 'G01', role: 'Chef de mission', participants: '', objective: 'Identifier les entreprises utilisant la main d\'œuvre nationale et étrangère', matter: 'Protection de la main d\'œuvre nationale', companies: 'REWA CONGO — Commerce générale\nRALPH SERVICES — Imprimerie et restaurant', addresses: 'KINSHASA, Gombe, Axe 24 Novembre', phone: '+243 99 876 6270', observations: 'Manque de moyens de transport — Non-respect des assujettis', status: 'archived', timestamp: '2025-05-09T09:00:00Z' },
        { id: 2, date: '2025-06-20', order: 'OS-245', group: 'G03', role: 'Inspecteur du Travail', participants: '', objective: 'Contrôle de conformité des registres', matter: 'Application du Code du travail', companies: 'STARTIMES MEDIA RDC — Télé distribution', addresses: 'KINSHASA, Ngaliema', phone: '+243 99 123 4567', observations: 'Document en ordre — Aucune irrégularité majeure', status: 'archived', timestamp: '2025-06-25T14:30:00Z' },
        { id: 3, date: '2025-07-10', order: 'OS-312', group: 'G02', role: 'Contrôleur du Travail', participants: 'Contrôleur LIBULA LISANGA Israël', objective: 'Vérification de la main d\'œuvre étrangère', matter: 'Protection de la main d\'œuvre étrangère', companies: 'POLYCLINIQUE DE KINSHASA — Santé', addresses: 'KINSHASA, Bandalungwa', phone: '+243 99 555 7777', observations: 'Obstruction au contrôle — Refus d\'accès', status: 'active', timestamp: '2025-07-10T10:00:00Z' },
      ];
    }
  } catch (e) { STATE.archiveData = []; }
}

function saveArchive() {
  localStorage.setItem('inspecteurbot_archive', JSON.stringify(STATE.archiveData));
}

function updateArchiveTable() {
  const tbody = document.getElementById('archiveTbody');
  const list = STATE.archiveData.slice().reverse();
  tbody.innerHTML = list.map(item => `
    <tr>
      <td>${item.date || '—'}</td>
      <td>${item.order || '—'}</td>
      <td>${item.group || '—'}</td>
      <td>${item.role || '—'}</td>
      <td>${item.companies ? item.companies.split('\n')[0] : '—'}</td>
      <td>${(item.addresses || '').split(',')[0] || '—'}</td>
      <td><span class="status-badge ${item.status === 'active' ? 'status-active' : 'status-archived'}">${item.status}</span></td>
      <td class="actions">
        <button onclick="openArchive(${item.id})" title="Ouvrir" aria-label="Ouvrir la mission"><i class="fa-solid fa-eye"></i></button>
        <button onclick="editArchive(${item.id})" title="Modifier" aria-label="Modifier la mission"><i class="fa-solid fa-pen"></i></button>
        <button onclick="printArchive(${item.id})" title="Imprimer" aria-label="Imprimer la mission"><i class="fa-solid fa-print"></i></button>
        <button onclick="exportArchivePDF(${item.id})" title="PDF" aria-label="Exporter la mission en PDF"><i class="fa-solid fa-file-pdf"></i></button>
        <button onclick="duplicateArchive(${item.id})" title="Dupliquer" aria-label="Dupliquer la mission"><i class="fa-solid fa-copy"></i></button>
        <button onclick="shareArchive(${item.id})" title="Partager" aria-label="Partager la mission"><i class="fa-solid fa-share-nodes"></i></button>
      </td>
    </tr>
  `).join('');
}

function searchArchives(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('#archiveTbody tr').forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = (q.length === 0 || text.includes(q)) ? '' : 'none';
  });
}

function openArchive(id) {
  const item = STATE.archiveData.find(i => i.id === id);
  if (!item) return;
  STATE.currentMission = item;
  showSection('mission');
  document.getElementById('mDate').value = item.date || '';
  document.getElementById('mOrder').value = item.order || '';
  document.getElementById('mGroup').value = item.group || '';
  document.getElementById('mRole').value = item.role || '';
  document.getElementById('mParticipants').value = item.participants || '';
  document.getElementById('mObjective').value = item.objective || '';
  document.getElementById('mMatter').value = item.matter || '';
  document.getElementById('mCompanies').value = item.companies || '';
  document.getElementById('mAddresses').value = item.addresses || '';
  document.getElementById('mPhone').value = item.phone || '';
  document.getElementById('mObservations').value = item.observations || '';
  renderReportPreview(item);
  document.getElementById('reportPreviewArea').classList.remove('hidden');
  document.getElementById('reportPreviewArea').scrollIntoView({ behavior: 'smooth' });
}

function editArchive(id) {
  openArchive(id);
}

function printArchive(id) {
  openArchive(id);
  printReport();
}

function exportArchivePDF(id) {
  openArchive(id);
  exportReportPDF();
}

function exportReportWord() {
  const html = document.getElementById('a4Paper').innerHTML;
  const blob = new Blob([`<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Rapport de mission</title></head><body style="font-family:'Times New Roman', serif;">${html}</body></html>`], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rapport_mission_igt.doc';
  a.click();
  URL.revokeObjectURL(url);
}

function exportArchiveWord(id) {
  const item = STATE.archiveData.find(i => i.id === id);
  if (!item) return;
  openArchive(id);
  setTimeout(exportReportWord, 400);
}

function duplicateArchive(id) {
  const item = STATE.archiveData.find(i => i.id === id);
  if (!item) return;
  const copy = { ...item, id: Date.now(), status: 'active', date: new Date().toISOString().split('T')[0] };
  STATE.archiveData.push(copy);
  saveArchive();
  updateArchiveTable();
  updateDashboard();
  alert('Mission dupliquée avec succès.');
}

function shareArchive(id) {
  const item = STATE.archiveData.find(i => i.id === id);
  if (!item) return;
  const shareData = { title: 'Mission InspecteurBot', text: `Mission du ${item.date} — Ordre de service ${item.order || '—'}`, url: window.location.href };
  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    navigator.clipboard.writeText(`Mission InspecteurBot — ${item.date} — ${item.order || '—'} — ${window.location.href}`).then(() => alert('Lien copié dans le presse-papier pour le partage.'));
  }
}

// ==========================================
// DASHBOARD
// ==========================================
function updateDashboard() {
  const data = STATE.archiveData;
  const missions = data.length;
  const entreprises = new Set(data.map(i => (i.companies || '').split('\n')[0])).size || 0;
  const conformes = Math.floor(Math.random() * missions) || 0;
  const nonConformes = missions - conformes;
  const pv = Math.floor(Math.random() * (missions + 5));
  const med = Math.floor(Math.random() * (missions + 2));
  document.getElementById('statMissions').textContent = missions;
  document.getElementById('statEntreprises').textContent = entreprises;
  document.getElementById('statConformes').textContent = conformes;
  document.getElementById('statNonConformes').textContent = nonConformes;
  document.getElementById('statPV').textContent = pv;
  document.getElementById('statMED').textContent = med;
}

function initCharts() {
  // Simple bar charts using Chart.js if available; otherwise use basic canvas drawing
  if (typeof Chart !== 'undefined') {
    const ctxSector = document.getElementById('sectorChart').getContext('2d');
    new Chart(ctxSector, {
      type: 'bar',
      data: {
        labels: ['Commerce', 'Industrie', 'Services', 'Santé', 'Éducation', 'Transport'],
        datasets: [{ label: 'Missions', data: [12, 8, 15, 6, 4, 3], backgroundColor: '#0a2540' }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });

    const ctxMonthly = document.getElementById('monthlyChart').getContext('2d');
    new Chart(ctxMonthly, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
        datasets: [
          { label: 'Missions', data: [3, 4, 5, 8, 12, 9, 7, 4, 6, 8, 10, 5], borderColor: '#bfa15f', tension: 0.3, fill: false },
          { label: 'Entreprises', data: [2, 3, 4, 6, 9, 7, 5, 3, 4, 6, 7, 3], borderColor: '#0a2540', tension: 0.3, fill: false }
        ]
      },
      options: { responsive: true }
    });
  }
}

function initMapDashboard() {
  if (document.getElementById('mapDashboard') && typeof L !== 'undefined') {
    const map = L.map('mapDashboard').setView([-4.325, 15.322], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);
    // Sample markers for missions in Kinshasa area
    const markers = [
      { lat: -4.325, lng: 15.322, title: 'Mission G01 — Gombe' },
      { lat: -4.330, lng: 15.310, title: 'Mission G02 — Kinshasa' },
      { lat: -4.340, lng: 15.335, title: 'Mission G03 — Ngaliema' },
      { lat: -4.310, lng: 15.315, title: 'Mission G04 — Bandalungwa' },
    ];
    markers.forEach(m => {
      L.marker([m.lat, m.lng]).addTo(map).bindPopup('<b>' + m.title + '</b>');
    });
  }
}

// ==========================================
// NAVIGATION & UTILITIES
// ==========================================
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  STATE.currentSection = id;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'dashboard') { setTimeout(() => { initCharts(); initMapDashboard(); }, 200); }
  if (id === 'archives') { updateArchiveTable(); }
}

function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ==========================================
// INIT
// ==========================================
function initApp() {
  initMissionForm();
  buildModelLibrary();
  filterModels('all');
  loadArchive();
  updateArchiveTable();
  updateDashboard();

  // Initialize documentation content
  const docContainer = document.getElementById('docContent');
  docContainer.innerHTML = Object.entries(ARTICLES).map(([num, art]) => `
    <article class="doc-article" id="doc-article-${num}">
      <button class="copy-btn" onclick="copyDocText(${num})" aria-label="Copier le texte de l'article ${num}">Copier</button>
      <h3>${art.title}</h3>
      <p class="article-meta">${art.meta}</p>
      <div id="doc-text-${num}">${art.body}</div>
    </article>
  `).join('');
  navigateToArticle(187);
}

function copyDocText(num) {
  const text = ARTICLES[num].body.replace(/<[^>]*>/g, '') + '\n\n' + ARTICLES[num].title;
  navigator.clipboard.writeText(text).then(() => { showToast('Article ' + num + ' copié dans le presse-papier.', 'success'); });
}

// Initialize on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
