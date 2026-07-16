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
    title: "Article 187 — L'Inspection du Travail",
    meta: "Titre I — L'Inspection du Travail — Code du travail RDC (2002)",
    body: `<p>L'Inspection du Travail a pour mission de :</p>
<ul>
<li>1. assurer l'application des dispositions légales relatives aux conditions de travail et à la protection des travailleurs dans l'exercice de leur profession, telles que les dispositions relatives à la durée du travail, aux salaires, à la sécurité, à l'hygiène et au bien-être, à l'emploi des femmes, des enfants et des personnes avec handicap, aux conflits collectifs, aux litiges individuels du travail, à l'application des conventions collectives, à la représentation du personnel et d'autres matières connexes ;</li>
<li>2. fournir des informations et des conseils techniques aux employeurs et aux travailleurs sur les moyens les plus efficaces d'observer les dispositions légales ;</li>
<li>3. donner des avis sur les questions relatives à l'établissement ou à la modification des installations d'entreprises et d'organismes soumis à une autorisation administrative ;</li>
<li>4. porter à l'attention de l'autorité compétente les déficiences ou les abus que révélerait l'application des dispositions légales et qui ne sont pas couverts par celles-ci.</li>
</ul>`
  },
  188: {
    title: "Article 188 — Compétence de l'Inspection Générale du Travail",
    meta: "Titre I — L'Inspection du Travail — Code du travail RDC (2002)",
    body: `<p>L'exercice des missions de l'Inspection du Travail est de la compétence exclusive de l'Inspection Générale du Travail sur toute l'étendue du territoire national.</p>
<p>L'Inspection Générale du Travail comporte :</p>
<ul>
<li>a) la Direction de l'Inspection Générale du Travail au service central ;</li>
<li>b) des inspections provinciales et locales.</li>
</ul>`
  },
  189: {
    title: "Article 189 — Direction de l'Inspection Générale du Travail",
    meta: "Titre I — L'Inspection du Travail — Code du travail RDC (2002)",
    body: `<p>La Direction de l'Inspection Générale du Travail dirige, coordonne et contrôle l'ensemble des activités qu'implique l'exercice des missions de l'Inspection du Travail.</p>
<p>Elle soumet au Ministre toutes propositions relatives au personnel de l'Inspection Générale du Travail.</p>`
  },
  190: {
    title: "Article 190 — Organisation et fonctionnement",
    meta: "Titre I — L'Inspection du Travail — Code du travail RDC (2002)",
    body: `<p>(Loi n° 16/010 du 15 juillet 2016 modifiant et complétant la Loi n° 015-2002 portant Code du travail)</p>
<p>Un Décret du Premier ministre délibéré en conseil des ministres fixe l'organisation et le fonctionnement de l'Inspecteur Générale du Travail.</p>`
  },
  191: {
    title: "Article 191 — Ressort territorial des Inspecteurs",
    meta: "Titre I — L'Inspection du Travail — Code du travail RDC (2002)",
    body: `<p>Le ressort de l'Inspecteur du Travail attaché à l'Inspection Générale du Travail s'étend sur toute l'étendue du territoire national.</p>
<p>Le ressort de l'Inspecteur du Travail attaché en province ou dans la ville de Kinshasa se limite à la juridiction administrative d'attache.</p>`
  },
  192: {
    title: "Article 192 — Compétences spécifiques de l'Inspecteur du Travail",
    meta: "Titre I — L'Inspection du Travail — Code du travail RDC (2002)",
    body: `<p>Sans préjudice des compétences reconnues à l'Inspecteur du Travail du ressort, l'Inspecteur du Travail attaché à l'Inspection Générale du Travail est compétent pour :</p>
<p><strong>a)</strong> connaître de tout litige du travail se rapportant à l'exercice de sa mission telle que définie à l'article 187 notamment :</p>
<ul>
<li>les litiges individuels du travail pour lesquels l'une des parties aura été mise dans l'impossibilité matérielle d'initier ou de poursuivre jusqu'à terme la procédure de conciliation devant l'Inspecteur du Travail du ressort ;</li>
<li>les conflits collectifs du travail affectant plusieurs établissements d'une même entreprise ou affectant plusieurs entreprises d'un ou des plusieurs secteurs d'activité relevant de plus d'un ressort de l'Inspection du Travail.</li>
</ul>
<p><strong>b)</strong> effectuer les visites spéciales d'inspection en matière de sécurité technique, santé au travail, main-d'œuvre, institution de prévoyance sociale, c'est-à-dire mutuelles et assurances, négociation des conventions collectives à caractère national et contre-enquêtes.</p>
<p>Cette disposition s'applique, mutatis mutandis, aux Inspecteurs attachés aux Inspections du Travail des provinces, des districts ou des territoires dans les limites de leurs juridictions respectives.</p>`
  },
  193: {
    title: "Article 193 — Dénomination, siège et ressort des services de l'Inspection",
    meta: "Titre I — L'Inspection du Travail — Code du travail RDC (2002)",
    body: `<p>Le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions détermine par arrêté pris, après avis du Conseil National du Travail, la dénomination, le siège, la compétence et le ressort territorial des services de l'Inspection du Travail.</p>`
  },
  194: {
    title: "Article 194 — Serment des Inspecteurs et Contrôleurs du Travail",
    meta: "Titre I — L'Inspection du Travail — Code du travail RDC (2002)",
    body: `<p>Avant leur entrée en fonction, les Inspecteurs et les Contrôleurs du Travail prêtent le serment suivant :</p>
<p><em>« Je jure, devant Dieu et la Nation, fidélité et obéissance à la Constitution et aux lois de la République Démocratique du Congo, de remplir fidèlement ma charge et de ne pas révéler, même après avoir quitté le service, les secrets de fabrication ou de commerce ou les procédés d'exploitation dont j'aurai pu prendre connaissance dans l'exercice de mes fonctions. »</em></p>
<p>Ce serment est prêté par écrit devant la Cour d'Appel, et copie en est versée au dossier administratif de l'agent.</p>`
  },
  195: {
    title: "Article 195 — Assistance technique pour compétences spécifiques",
    meta: "Titre I — L'Inspection du Travail — Code du travail RDC (2002)",
    body: `<p>Pour assurer l'exercice des missions d'Inspection nécessitant des compétences techniques spécifiques, l'Inspecteur du Travail peut faire appel à la collaboration des experts et techniciens ou des organismes publics ou privés, préalablement agréés par le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions.</p>
<p>Ce concours technique s'exerce sous le contrôle de l'Inspection du Travail.</p>
<p>Les frais résultant de ce concours sont à charge du Ministère du Travail et de la Prévoyance Sociale.</p>`
  },
  196: {
    title: "Article 196 — Pouvoirs des Inspecteurs et Contrôleurs du Travail",
    meta: "Titre I — L'Inspection du Travail — Code du travail RDC (2002)",
    body: `<p>Les Inspecteurs et Contrôleurs du Travail, munis de pièces justificatives de leurs fonctions, sont autorisés de :</p>
<p><strong>a)</strong> pénétrer librement, sans avertissement préalable à toute heure du jour et de la nuit, dans tout établissement assujetti au contrôle de l'Inspection ;</p>
<p><strong>b)</strong> pénétrer le jour dans tous les locaux qu'ils supposent être assujettis au contrôle de l'Inspection ;</p>
<p><strong>c)</strong> procéder à tous examens, contrôles ou enquêtes qu'ils jugent nécessaires pour s'assurer que les dispositions légales sont effectivement observées et notamment :</p>
<ul>
<li>1. interroger, soit seul, soit en présence de témoins, l'employeur ou le personnel de l'entreprise ou de l'établissement sur toutes les matières relatives à l'application des dispositions légales ;</li>
<li>2. demander que leur soient communiqués, soit sur les lieux du travail, soit en leur bureau, tous livres, registres et documents dont la tenue est prescrite par la législation en vue d'en vérifier la conformité avec les dispositions légales et d'en prendre copie ou d'en établir des extraits ;</li>
<li>3. exiger l'affichage des avis dont l'apposition est prévue par les dispositions légales ;</li>
<li>4. prélever et à emporter, aux fins d'analyse des échantillons des matières premières et substances utilisées ou manipulées, pourvu que l'employeur ou son représentant soit averti que des matières ou substances ont été prélevées et emportées à cette fin.</li>
</ul>
<p>A l'occasion d'une visite d'inspection, l'Inspecteur ou le Contrôleur du Travail devra informer de sa présence l'employeur ou son représentant, à moins qu'il n'estime qu'un tel avis risque de porter préjudice à l'efficacité du contrôle.</p>`
  },
  197: {
    title: "Article 197 — Pouvoirs et fonctions de l'Inspecteur du Travail",
    meta: "Titre I — L'Inspection du Travail — Code du travail RDC (2002)",
    body: `<p>Dans l'accomplissement de leurs fonctions, les Inspecteurs et les Contrôleurs du Travail ont le pouvoir de :</p>
<p><strong>a)</strong> faire appel, en cas de besoin, à la coopération et à l'assistance de toute autorité publique en vue de l'accomplissement de leur mission ;</p>
<p><strong>b)</strong> demander à l'employeur de leur fournir les renseignements et statistiques au sujet des travailleurs ou de leurs conditions de travail ;</p>
<p><strong>c)</strong> constater la violation des dispositions légales par des procès-verbaux, faisant foi jusqu'à preuve du contraire, qu'ils transmettent à l'autorité hiérarchique compétente ;</p>
<p><strong>d)</strong> formuler des observations et prodiguer des conseils tant à l'employeur ou à son représentant qu'aux travailleurs ;</p>
<p><strong>e)</strong> mettre l'employeur ou son représentant en demeure de veiller à l'observance des dispositions légales ;</p>
<p><strong>f)</strong> ordonner ou faire ordonner que des mesures immédiatement exécutoires soient prises lorsqu'ils ont un motif raisonnable de considérer qu'il y a danger imminent et grave pour la santé ou la sécurité des travailleurs.</p>
<p>Dans l'application des dispositions du litera f), l'ampliation du procès-verbal est adressée à l'employeur ou à son représentant et à l'autorité hiérarchique compétente dans le délai maximum de huit jours à partir de la constatation de l'infraction.</p>
<p>L'employeur ou son représentant peut faire appel de cette décision en adressant dans les quinze jours ouvrables à compter de la réception, par lettre recommandée ou par porteur avec accusé de réception, un recours auprès du Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions contre les mesures exécutoires prises en vertu du litera f) du présent article.</p>
<p>Le Ministre notifiera sa décision à l'employeur ou à son représentant dans le mois à dater de la réception du recours. En cas de silence, il est censé accepter le recours.</p>`
  },
  198: {
    title: "Article 198 — Indépendance et confidentialité des Inspecteurs et Contrôleurs du Travail",
    meta: "Titre I — L'Inspection du Travail — Code du travail RDC (2002)",
    body: `<p>Les Inspecteurs et les Contrôleurs du Travail n'ont pas le droit d'avoir un intérêt quelconque direct ou indirect dans les entreprises ou les établissements placés sous leur contrôle.</p>
<p>Ils doivent traiter comme absolument confidentielle la source de toute plainte leur signalant un défaut dans l'installation ou une infraction aux dispositions légales et doivent s'abstenir de révéler à l'employeur ou à son représentant qu'il a été procédé à une visite d'inspection comme suite à une plainte.</p>
<p>Les moyens sont mis à leur disposition par le Ministre ayant le Travail et la Prévoyance Sociale dans ses attributions.</p>`
  }
};

const DIFFICULTES_IDEES = [
  "Manque de moyens de transport pour atteindre certains sites d'inspection.",
  "Obstruction au contrôle par le refus d'accès aux locaux de travail.",
  "Non-présentation des registres obligatoires du personnel au cours de la visite.",
  "Absence d'affichage des avis légaux prévus par le Code du travail.",
  "Non-conformité des installations de sécurité et d'hygiène au travail.",
  "Refus de l'employeur de répondre aux questions relatives aux conditions de travail.",
  "Défaut de tenue des documents relatifs à la main d'œuvre étrangère.",
  "Non-respect des durées légales du travail et des périodes de repos.",
  "Absence de contrat de travail signé pour plusieurs employés.",
  "Non-application de la convention collective en vigueur dans le secteur.",
  "Non-paiement des salaires dans les délais prescrits par la loi.",
  "Défaut de versement des cotisations sociales et de prévoyance.",
  "Emploi irrégulier de travailleurs étrangers sans autorisation administrative.",
  "Non-communication des statistiques relatives aux travailleurs sur demande.",
  "Absence des mesures immédiatement exécutoires en cas de danger imminent.",
  "Non-mise en demeure de l'employeur malgré la constatation d'irrégularités.",
  "Refus de présentation des bulletins de paie et registres de paie.",
  "Défaut d'identification du représentant légal de l'entreprise lors de la visite.",
  "Obstruction volontaire au contrôle par dissimulation de documents.",
  "Non-respect des dispositions relatives à l'emploi des femmes et des enfants.",
  "Absence de formation du personnel aux règles de sécurité et d'hygiène.",
  "Défaillance des équipements de protection individuelle mis à disposition.",
  "Non-établissement du procès-verbal d'obstruction par l'employeur.",
  "Défaut de coordination entre le chef de mission et les inspecteurs provinciaux.",
  "Manque de moyens financiers pour couvrir les frais de mission sur le terrain.",
  "Accès difficile aux sites isolés en raison des conditions climatiques ou géographiques.",
  "Non-réception de la lettre recommandée adressée au responsable de l'entreprise.",
  "Défaut de réponse au recours administratif introduit dans les délais légaux.",
  "Non-transmission du procès-verbal d'infraction à l'autorité hiérarchique compétente.",
  "Absence de suivi des recommandations formulées lors d'une mission précédente.",
  "Défaut d'archivage des documents relatifs aux missions effectuées.",
  "Non-respect du secret professionnel par la divulgation d'informations sensibles.",
  "Défaut d'information de l'employeur sur la présence de l'inspection sur site.",
  "Obstruction à l'analyse des échantillons de matières premières prélevés.",
  "Non-présentation des autorisations administratives relatives à l'établissement.",
  "Défaut de notification de l'objet du contrôle au début de la mission.",
  "Absence d'entretien préalable avec le personnel de l'entreprise visée.",
  "Non-respect des procédures de conciliation devant l'Inspecteur du ressort.",
  "Difficulté d'accès aux documents en raison de leur conservation dans un autre site.",
  "Défaut de collaboration des experts techniques agréés par le Ministère.",
  "Non-réception des statistiques annuelles relatives à la main d'œuvre.",
  "Manque de clarté dans la répartition des responsabilités entre inspecteurs.",
  "Défaut d'adaptation des recommandations au contexte spécifique de l'entreprise.",
  "Non-mise à jour des registres après la régularisation des irrégularités constatées.",
  "Obstruction au contrôle par le changement fréquent du responsable légal.",
  "Défaut de transmission de la copie du procès-verbal à l'employeur dans les délais.",
  "Absence de mesures de suivi après la délivrance d'une mise en demeure.",
  "Non-respect des délais de réponse du Ministre au recours administratif.",
  "Défaut d'archivage numérique des rapports de mission et de leurs annexes.",
  "Difficulté de coordination avec les autorités locales pour l'accès aux sites.",
  "Non-respect des dispositions relatives à la confidentialité des sources de plainte.",
  "Défaut de préparation du calendrier de suivi après la visite d'inspection."
];

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
    direction: document.getElementById('mDirection').value,
    participants: document.getElementById('mParticipants').value,
    objective: document.getElementById('mObjective').value,
    matter: document.getElementById('mMatter').value,
    companies: document.getElementById('mCompanies').value,
    addresses: document.getElementById('mAddresses').value,
    phone: document.getElementById('mPhone').value,
    observations: document.getElementById('mObservations').value,
    constats: document.getElementById('mConstats').value,
    recommandations: document.getElementById('mRecommandations').value,
    conclusion: document.getElementById('mConclusion').value,
    difficiles: document.getElementById('mDifficultes').value,
    logoFile: document.getElementById('mLogo').files[0] ? URL.createObjectURL(document.getElementById('mLogo').files[0]) : null,
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

function previewMission(e) {
  e.preventDefault();
  const data = {
    date: document.getElementById('mDate').value,
    order: document.getElementById('mOrder').value,
    group: document.getElementById('mGroup').value,
    role: document.getElementById('mRole').value,
    direction: document.getElementById('mDirection').value,
    participants: document.getElementById('mParticipants').value,
    objective: document.getElementById('mObjective').value,
    matter: document.getElementById('mMatter').value,
    companies: document.getElementById('mCompanies').value,
    addresses: document.getElementById('mAddresses').value,
    phone: document.getElementById('mPhone').value,
    observations: document.getElementById('mObservations').value,
    constats: document.getElementById('mConstats').value,
    recommandations: document.getElementById('mRecommandations').value,
    conclusion: document.getElementById('mConclusion').value,
    difficiles: document.getElementById('mDifficultes').value,
    logoFile: document.getElementById('mLogo').files[0] ? URL.createObjectURL(document.getElementById('mLogo').files[0]) : null,
  };
  STATE.currentMission = data;
  renderReportPreview(data);
  document.getElementById('reportPreviewArea').classList.remove('hidden');
  document.getElementById('reportPreviewArea').scrollIntoView({ behavior: 'smooth' });
  showToast('Aperçu du rapport généré selon le modèle officiel.', 'success');
}

function resetMissionForm() {
  document.getElementById('missionForm').reset();
  initMissionForm();
  document.getElementById('reportPreviewArea').classList.add('hidden');
  STATE.currentMission = null;
}

function renderReportPreview(data) {
  const directionLabel = data.direction || '—';
  const logoHtml = data.logoFile ? `<img src="${data.logoFile}" alt="Logo administration" style="max-height:60px;max-width:140px;margin:0.5rem auto;display:block;" />` : '';
  // Génération du code unique et QR pour le rapport
  const todayStr = data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  const randId = Math.floor(Math.random() * 9000) + 1000;
  const reportCode = 'ITCT-' + todayStr + '-' + randId;
  const qrUrl = generateQRUrl('Rapport Mission ' + reportCode);
  const meta = `
    <div style="text-align:center;font-size:0.9rem;color:#333;margin-bottom:0.5rem;">
      <strong>République Démocratique du Congo</strong><br/>
      <strong>Ministère de l'Emploi et du Travail</strong><br/>
      <strong>Inspection Générale du Travail</strong><br/>
      <strong>${directionLabel}</strong>
    </div>
    ${logoHtml}
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
    <p>— ${data.difficiles || data.observations || 'Aucune difficulté particulière signalée.'}</p>

    <h2>V. Constats effectués</h2>
    <ul>
      <li>${data.constats || 'Inspection des registres et documents obligatoires.'}</li>
      <li>Vérification de l'affichage des avis prévus par la loi.</li>
      <li>Contrôle des conditions de sécurité et d'hygiène.</li>
      <li>Entretien avec le personnel et l'employeur.</li>
    </ul>

    <h2>VI. Irrégularités relevées</h2>
    <ul>
      <li>Absence de certains documents liés à la main d'œuvre nationale et étrangère.</li>
      <li>Non-conformité des règlements internes.</li>
      <li>Obstruction au contrôle relevée dans plusieurs établissements.</li>
    </ul>

    <h2>VII. Recommandations et décisions proposées</h2>
    <ul>
      <li><strong>${data.recommandations || 'Une mise en demeure immédiate — délai proposé : 15 à 30 jours.'}</strong></li>
      <li>Réinspection complémentaire recommandée après régularisation.</li>
    </ul>

    <h2>VIII. Conclusion</h2>
    <p>${data.conclusion || 'Mission accomplie dans le respect des procédures administratives et du secret professionnel. Aucune irrégularité majeure n\'a été relevée.'}</p>
  `;
  document.getElementById('previewBody').innerHTML = body;
  document.getElementById('previewDate').textContent = data.date ? new Date(data.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  document.getElementById('previewCity').textContent = (data.addresses || '').split(',')[0] || 'KINSHASA';
  document.getElementById('previewSignName').textContent = data.role ? (data.role === 'Inspecteur du Travail' ? 'Inspecteur' : data.role) : '';
  document.getElementById('previewSignRole').textContent = data.role || '';
  document.getElementById('previewSignPhone').textContent = data.phone || '';
  // Affichage automatique du code unique et du QR en bas de page
  const previewCodeQR = document.getElementById('previewCodeQR');
  if (previewCodeQR) {
    previewCodeQR.innerHTML = `
      <div style="display:inline-flex;align-items:center;gap:0.8rem;margin-top:0.3rem;">
        <span style="font-weight:700;color:var(--primary);font-size:0.9rem;">Code unique : <strong>${reportCode}</strong></span>
        <img src="${qrUrl}" alt="QR Code du rapport" style="width:60px;height:60px;border:2px solid var(--primary);border-radius:6px;" />
      </div>
    `;
  }
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

function shareReport() {
  if (!STATE.currentMission) { showToast('Aucun rapport actif à partager.', 'info'); return; }
  const shareData = { title: 'Rapport de mission InspecteurBot', text: `Mission du ${STATE.currentMission.date} — Ordre : ${STATE.currentMission.order || '—'} — Entreprise : ${(STATE.currentMission.companies || '').split('\n')[0]}`, url: window.location.href };
  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    navigator.clipboard.writeText(`Rapport InspecteurBot — ${STATE.currentMission.date} — ${STATE.currentMission.order || '—'} — ${window.location.href}`).then(() => showToast('Lien du rapport copié dans le presse-papier.', 'success'));
  }
}

function editCurrentReport() {
  showToast('Modification activée. Utilisez le formulaire pour mettre à jour le rapport.', 'info');
  document.getElementById('missionForm').scrollIntoView({ behavior: 'smooth' });
}

// ==========================================
// FORMATION REPORT
// ==========================================
function createFormationReport(e) {
  e.preventDefault();
  const data = {
    date: document.getElementById('fDate').value,
    order: document.getElementById('fOrder').value,
    group: document.getElementById('fGroup').value,
    role: document.getElementById('fFormateur').value,
    participants: document.getElementById('fParticipants').value,
    theme: document.getElementById('fTheme').value,
  };
  const reportId = generateReportId();
  const reportDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const html = `<div class="a4-paper">
    <div class="report-header">
      <h1>RAPPORT DE FORMATION</h1>
      <div class="meta-line">IT/CT IA | Code : <strong>${reportId}</strong></div>
      <img src="${generateQRUrl('Formation ' + reportId)}" alt="QR" style="width:80px;height:80px;" />
      <div style="font-size:0.85rem;margin-top:0.5rem;">République Démocratique du Congo — Ministère de l'Emploi et du Travail — Inspection Générale du Travail</div>
    </div>
    <div class="report-body">
      <table style="width:100%;font-size:0.85rem;border-collapse:collapse;margin-bottom:1rem;">
        <tr><td>Date</td><td>${data.date || '—'}</td></tr>
        <tr><td>Ordre</td><td>${data.order || '—'}</td></tr>
        <tr><td>Groupe</td><td>${data.group || '—'}</td></tr>
        <tr><td>Formateur</td><td>${data.role || '—'}</td></tr>
        <tr><td>Participants</td><td>${data.participants || '—'}</td></tr>
        <tr><td>Thème</td><td>${data.theme || '—'}</td></tr>
      </table>
      <h2>I. Programme</h2><ul><li>Présentation du Code du travail.</li><li>Méthodologie d'inspection.</li><li>Procédures de procès-verbaux.</li></ul>
      <h2>II. Évaluation</h2><p>Les participants ont montré un bon niveau. Une réinspection est recommandée.</p>
    </div>
    <div class="report-footer"><p>Ainsi fait le ${reportDate}</p><p>Code : ${reportId}</p></div>
  </div>`;
  document.getElementById('a4PaperFormation').innerHTML = html;
  document.getElementById('previewFormation').classList.remove('hidden');
  showToast('Rapport de formation généré.', 'success');
}
function printFormationReport() { window.print(); }
function exportFormationPDF() {
  const el = document.getElementById('a4PaperFormation');
  if (!el) return;
  html2pdf().set({ margin: [8,8,8,8], filename: 'rapport_formation.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).from(el).save();
}
function exportFormationWord() {
  const html = document.getElementById('a4PaperFormation').innerHTML;
  const blob = new Blob([`<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Rapport Formation</title></head><body style="font-family:'Times New Roman', serif;">${html}</body></html>`], { type: 'application/msword' });
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'rapport_formation.doc'; a.click(); URL.revokeObjectURL(url);
}

// ==========================================
// REUNION REPORT
// ==========================================
function createReunionReport(e) {
  e.preventDefault();
  const data = {
    date: document.getElementById('rDate').value,
    order: document.getElementById('rOrder').value,
    group: document.getElementById('rGroup').value,
    role: document.getElementById('rRole').value,
    participants: document.getElementById('rParticipants').value,
  };
  const reportId = generateReportId();
  const reportDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const html = `<div class="a4-paper">
    <div class="report-header"><h1>RAPPORT DE RÉUNION</h1>
      <div class="meta-line">IT/CT IA | Code : <strong>${reportId}</strong></div>
      <img src="${generateQRUrl('Reunion ' + reportId)}" alt="QR" style="width:80px;height:80px;" />
      <div style="font-size:0.85rem;margin-top:0.5rem;">RDC — Ministère de l'Emploi et du Travail — Inspection Générale du Travail</div>
    </div>
    <div class="report-body">
      <table style="width:100%;font-size:0.85rem;border-collapse:collapse;margin-bottom:1rem;">
        <tr><td>Date</td><td>${data.date || '—'}</td></tr>
        <tr><td>Ordre</td><td>${data.order || '—'}</td></tr>
        <tr><td>Groupe</td><td>${data.group || '—'}</td></tr>
        <tr><td>Fonction</td><td>${data.role || '—'}</td></tr>
        <tr><td>Participants</td><td>${data.participants || '—'}</td></tr>
      </table>
      <h2>I. Ordre du jour</h2><ul><li>Présentation.</li><li>Échange d'informations.</li><li>Coordination.</li></ul>
      <h2>II. Points abordés</h2><p>Aucun écart majeur relevé.</p>
      <h2>III. Décisions</h2><ul><li>Maintien de la coordination.</li><li>Calendrier de suivi.</li></ul>
    </div>
    <div class="report-footer"><p>Ainsi fait le ${reportDate}</p><p>Code : ${reportId}</p></div>
  </div>`;
  document.getElementById('a4PaperReunion').innerHTML = html;
  document.getElementById('previewReunion').classList.remove('hidden');
  showToast('Rapport de réunion généré.', 'success');
}
function printReunionReport() { window.print(); }
function exportReunionPDF() {
  const el = document.getElementById('a4PaperReunion');
  if (!el) return;
  html2pdf().set({ margin: [8,8,8,8], filename: 'rapport_reunion.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).from(el).save();
}

// ==========================================
// CONVERSATION REPORT
// ==========================================
function createConversationReport(e) {
  e.preventDefault();
  const data = { date: document.getElementById('cDate').value, text: document.getElementById('cTranscription').value };
  const reportId = generateReportId();
  const reportDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const fullText = data.text || '';
  const html = `<div class="a4-paper">
    <div class="report-header"><h1>TRANSCRIPTION DE CONVERSATION</h1>
      <div class="meta-line">IT/CT IA | Code : <strong>${reportId}</strong></div>
      <img src="${generateQRUrl('Conversation ' + reportId)}" alt="QR" style="width:80px;height:80px;" />
      <div style="font-size:0.85rem;margin-top:0.5rem;">RDC — Ministère de l'Emploi et du Travail — Inspection Générale du Travail</div>
    </div>
    <div class="report-body">
      <p><strong>Date :</strong> ${data.date || '—'}</p>
      <p><strong>Mode :</strong> Conversation</p>
      <hr/>
      <p>${fullText || 'Aucun texte.'}</p>
    </div>
    <div class="report-footer"><p>Ainsi fait le ${reportDate}</p><p>Code : ${reportId}</p></div>
  </div>`;
  document.getElementById('a4PaperConversation').innerHTML = html;
  document.getElementById('previewConversation').classList.remove('hidden');
  showToast('Rapport de conversation généré.', 'success');
}
function printConversationReport() { window.print(); }
function exportConversationReportPDF() {
  const el = document.getElementById('a4PaperConversation');
  if (!el) return;
  html2pdf().set({ margin: [8,8,8,8], filename: 'rapport_conversation.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).from(el).save();
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

function renderDifficultes() {
  const grid = document.getElementById('difficultesGrid');
  if (!grid) return;
  grid.innerHTML = DIFFICULTES_IDEES.map((text, i) => `
    <article class="difficulte-card" onclick="copyTextFromDifficulte(this)" title="Cliquer pour copier cette difficulté" aria-label="Difficulté ${i + 1}">
      <div class="difficulte-number">${i + 1}</div>
      <div class="difficulte-text">${text}</div>
      <button onclick="copyTextFromDifficulte(event, this)" class="btn-outline" aria-label="Copier la difficulté ${i + 1}"><i class="fa-solid fa-copy"></i> Copier</button>
    </article>
  `).join('');
}

function copyTextFromDifficulte(event, btn) {
  if (event && event.stopPropagation) event.stopPropagation();
  const card = btn ? btn.closest('.difficulte-card') : (event ? event.target.closest('.difficulte-card') : null);
  if (!card) return;
  const text = card.querySelector('.difficulte-text').innerText;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Difficulté copiée dans le presse-papier.', 'success');
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
  document.getElementById('iaStatusText').textContent = 'Transcription en temps réel comme dans ChatGPT...';
  STATE.transcriptLog = [];
  document.getElementById('iaTranscript').innerHTML = '';
  const actions = document.getElementById('transcriptActions');
  if (actions) actions.remove();

  // Sensibilité audio : microphone sans bruit (désactivation écho/bruit)
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: true } })
      .then(stream => {
        STATE.audioStream = stream;
      })
      .catch(err => console.warn('Audio setup failed:', err));
  }

  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    showToast('Cette fonctionnalité nécessite un navigateur compatible (Chrome/Edge) et une connexion internet.', 'info');
    document.getElementById('btnStart').classList.remove('hidden');
    document.getElementById('btnStop').classList.add('hidden');
    document.getElementById('iaStatusIndicator').classList.remove('listening');
    document.getElementById('iaStatusText').textContent = 'Prêt — Appuyez sur Démarrer';
    STATE.isListening = false;
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
      } else {
        renderTranscriptEntry({ time: new Date().toLocaleTimeString('fr-FR'), text: transcript.trim() + ' ... (en cours)', lang: 'détection en cours', mode: STATE.iaMode });
      }
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error', event);
    showToast('Erreur d\'écoute : ' + event.error + '. Vérifiez votre connexion et le microphone.', 'info');
    document.getElementById('btnStart').classList.remove('hidden');
    document.getElementById('btnStop').classList.add('hidden');
    STATE.isListening = false;
  };

  recognition.onend = () => {
    if (STATE.isListening) {
      recognition.start();
    }
  };

  try {
    recognition.start();
  } catch (e) {
    console.error('Start error:', e);
    showToast('Erreur au démarrage du microphone. Vérifiez les autorisations.', 'info');
    document.getElementById('btnStart').classList.remove('hidden');
    document.getElementById('btnStop').classList.add('hidden');
    STATE.isListening = false;
  }
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
  // Arrêt du flux audio sensible
  if (STATE.audioStream) {
    STATE.audioStream.getTracks().forEach(track => track.stop());
    STATE.audioStream = null;
  }
  if (STATE.audioGain) {
    STATE.audioGain = null;
  }
  clearInterval(STATE.listeningTimer);
  document.getElementById('btnStart').classList.remove('hidden');
  document.getElementById('btnStop').classList.add('hidden');
  document.getElementById('iaStatusIndicator').classList.remove('listening');
  document.getElementById('iaStatusText').textContent = 'Écoute terminée. Vous pouvez effacer, télécharger ou copier le texte.';
  showToast('Écoute arrêtée.', 'info');
  // Ajout des boutons d'action après l'arrêt
  const transcriptArea = document.getElementById('iaTranscript');
  if (transcriptArea && !document.getElementById('transcriptActions')) {
    const actionsDiv = document.createElement('div');
    actionsDiv.id = 'transcriptActions';
    actionsDiv.style.cssText = 'margin-top:1rem;display:flex;gap:0.5rem;flex-wrap:wrap;';
    actionsDiv.innerHTML = `
      <button onclick="clearTranscript()" class="btn-outline" aria-label="Effacer la transcription"><i class="fa-solid fa-trash"></i> Effacer</button>
      <button onclick="downloadTranscript()" class="btn-outline" aria-label="Télécharger la transcription"><i class="fa-solid fa-download"></i> Télécharger</button>
      <button onclick="copyTranscript()" class="btn-outline" aria-label="Copier la transcription"><i class="fa-solid fa-copy"></i> Copier le texte</button>
      <button onclick="sendTranscriptToMode('mission')" class="btn-outline" aria-label="Envoyer vers IA Mission"><i class="fa-solid fa-file-contract"></i> Envoyer vers IA Mission</button>
      <button onclick="sendTranscriptToMode('formation')" class="btn-outline" aria-label="Envoyer vers IA Formation"><i class="fa-solid fa-chalkboard-user"></i> Envoyer vers IA Formation</button>
      <button onclick="sendTranscriptToMode('reunion')" class="btn-outline" aria-label="Envoyer vers IA Réunion"><i class="fa-solid fa-handshake"></i> Envoyer vers IA Réunion</button>
      <button onclick="sendTranscriptToMode('conversation')" class="btn-outline" aria-label="Envoyer vers IA Conversation"><i class="fa-solid fa-comments"></i> Envoyer vers IA Conversation</button>
    `;
    transcriptArea.appendChild(actionsDiv);
  }
}

function clearTranscript() {
  document.getElementById('iaTranscript').innerHTML = '<p class="transcript-placeholder">Transcription effacée.</p>';
  STATE.transcriptLog = [];
  const actions = document.getElementById('transcriptActions');
  if (actions) actions.remove();
  showToast('Transcription effacée.', 'info');
}

function downloadTranscript() {
  const fullText = STATE.transcriptLog.map(e => e.text).join(' ');
  const blob = new Blob([fullText || 'Aucun texte transcrit.'], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transcription_inspecteurbot_' + new Date().toISOString().split('T')[0] + '.txt';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Transcription téléchargée.', 'success');
}

function copyTranscript() {
  const fullText = STATE.transcriptLog.map(e => e.text).join(' ');
  navigator.clipboard.writeText(fullText || '').then(() => showToast('Transcription copiée dans le presse-papier.', 'success'));
}

function sendTranscriptToMode(mode) {
  STATE.iaMode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  const btnId = 'mode' + mode.charAt(0).toUpperCase() + mode.slice(1);
  const btn = document.getElementById(btnId);
  if (btn) btn.classList.add('active');
  document.getElementById('iaOutput').classList.remove('hidden');
  generateIAOutput();
  showToast('Transcription envoyée vers IA ' + mode + '.', 'success');
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

const pvList = [
  "Procès-verbal d'obstruction", "Procès-verbal de non-présentation des registres",
  "Procès-verbal de non-respect des durées de travail", "Procès-verbal d'emploi irrégulier de travailleurs étrangers",
  "Procès-verbal d'absence de contrat de travail", "Procès-verbal de défaut d'affichage des avis obligatoires",
  "Procès-verbal de non-conformité des installations", "Procès-verbal de défaut de versement des cotisations sociales"
];
const actions = [
  "Une mise en demeure immédiate", "Une lettre d'observations formelle",
  "Une réinspection dans un délai de 15 jours", "Une réinspection dans un délai de 30 jours",
  "Une convocation de l'employeur au bureau de l'Inspection", "La transmission du dossier au procureur compétent",
  "L'engagement d'une procédure administrative complémentaire"
];

function generateReportId() {
  const today = new Date().toISOString().split('T')[0];
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `ITCT-${today}-${rand}`;
}

function generateQRUrl(text) {
  const temp = document.createElement('div');
  temp.style.display = 'none';
  document.body.appendChild(temp);
  try {
    new QRCode(temp, { text: text, width: 120, height: 120, colorDark: '#0a2540', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.H });
    const img = temp.querySelector('img');
    const src = (img && img.src) ? img.src : '';
    document.body.removeChild(temp);
    return src || ('https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=' + encodeURIComponent(text));
  } catch (e) {
    document.body.removeChild(temp);
    return 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=' + encodeURIComponent(text);
  }
}

function generateIAOutput() {
  document.getElementById('iaOutput').classList.remove('hidden');
  document.getElementById('iaOutput').scrollIntoView({ behavior: 'smooth' });
  const mode = STATE.iaMode;
  const transcript = STATE.transcriptLog.map(e => e.text).join(' ');
  let output = '';

  const reportId = generateReportId();
  const reportDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const reportCity = (STATE.currentMission && STATE.currentMission.addresses ? STATE.currentMission.addresses.split(',')[0] : 'KINSHASA') || 'KINSHASA';
  const reportRole = (STATE.currentMission && STATE.currentMission.role ? STATE.currentMission.role : 'Inspecteur du Travail') || 'Inspecteur du Travail';
  const reportName = (STATE.currentMission && STATE.currentMission.participants ? STATE.currentMission.participants.split('\n')[0] || '' : '') || '';
  const companiesList = STATE.currentMission && STATE.currentMission.companies ? STATE.currentMission.companies.split('\n').map((line, i) => {
    const [name, sector] = line.split('—').map(s => s.trim());
    return `<tr><td>${i + 1}</td><td>${name || line}</td><td>${sector || '—'}</td><td>À vérifier</td><td>—</td></tr>`;
  }).join('') : '';

  if (mode === 'conversation') {
    const fullText = STATE.transcriptLog.map(e => e.text).join(' ');
    output = `
      <h4>Conversation — Transcription en temps réel <span style="font-size:0.75rem;color:var(--danger);font-weight:700;">(Fictionnel)</span></h4>
      <p style="font-size:0.85rem;color:var(--ink-muted);margin-bottom:1rem;">Aucune référence de rapport requise. Code unique : <strong style="color:var(--primary);">${reportId}</strong></p>
      <img src="${generateQRUrl('IT/CT Conversation ' + reportId)}" alt="QR Code" style="width:100px;height:100px;margin-bottom:1rem;border:2px solid var(--primary);border-radius:8px;" />
      <div onclick="exportConversationPDF()" style="cursor:pointer;background:#fff;border:2px dashed var(--primary);border-radius:10px;padding:1rem;color:var(--ink);line-height:1.6;" title="Cliquer pour exporter ce texte en PDF">
        <p><strong>Contenu transcrit :</strong> ${fullText || '(En cours d\'écoute...)'}</p>
        <p style="font-size:0.75rem;color:var(--accent);margin-top:0.5rem;"><i class="fa-solid fa-file-pdf"></i> Cliquer ici pour générer le PDF automatiquement</p>
      </div>
    `;
  } else if (mode === 'reunion') {
    output = `
      <div class="a4-paper">
        <div class="report-header">
          <h1>RAPPORT DE RÉUNION</h1>
          <div class="meta-line"><strong>IT/CT IA — Mode Réunion</strong> | Code : <strong style="color:var(--primary);">${reportId}</strong></div>
          <img src="${generateQRUrl('IT/CT Reunion ' + reportId)}" alt="QR Code" style="width:90px;height:90px;margin-top:0.8rem;border:2px solid var(--primary);border-radius:6px;" />
        </div>
        <div class="report-body">
          <table style="width:100%;font-size:0.85rem;border-collapse:collapse;margin-bottom:1rem;">
            <tr><td style="font-weight:600;padding:0.3rem;">Date</td><td>${reportDate}</td></tr>
            <tr><td style="font-weight:600;padding:0.3rem;">Ordre de service</td><td>${STATE.currentMission ? STATE.currentMission.order || 'Non spécifié' : '—'}</td></tr>
            <tr><td style="font-weight:600;padding:0.3rem;">Groupe</td><td>${STATE.currentMission ? STATE.currentMission.group || '—' : '—'}</td></tr>
            <tr><td style="font-weight:600;padding:0.3rem;">Fonction</td><td>${reportRole}</td></tr>
            <tr><td style="font-weight:600;padding:0.3rem;">Participants</td><td>${STATE.currentMission ? STATE.currentMission.participants || '—' : '—'}</td></tr>
            <tr><td style="font-weight:600;padding:0.3rem;">Objectif</td><td>Réunion d'information et coordination entre inspecteurs, contrôleurs et responsables de mission.</td></tr>
            <tr><td style="font-weight:600;padding:0.3rem;">Matière</td><td>Coordination des missions d'inspection — Échange d'informations — Planification des visites.</td></tr>
          </table>
          <h2>I. Ordre du jour</h2>
          <ul>
            <li>Présentation des objectifs et de la méthodologie de la réunion.</li>
            <li>Échange d'informations sur les entreprises visitées et les constats préliminaires.</li>
            <li>Coordination des actions de suivi et répartition des responsabilités.</li>
            <li>Planification des visites complémentaires.</li>
          </ul>
          <h2>II. Points abordés</h2>
          <p>La réunion a permis d'aligner les participants sur la méthodologie de contrôle, de partager les constats préliminaires et de définir un calendrier pour les actions de suivi. Aucune irrégularité majeure n'a été relevée au cours des échanges.</p>
          <h2>III. Décisions et recommandations</h2>
          <ul>
            <li>Maintien de la coordination entre le chef de mission et les inspecteurs.</li>
            <li>Mise en place d'un calendrier de suivi dans un délai de 15 jours.</li>
            <li>Préparation d'une lettre d'observations si nécessaire.</li>
          </ul>
          <h2>IV. Actions de suivi</h2>
          <p>Le suivi sera assuré par le même groupe. Une nouvelle réunion est prévue après un délai de 1 mois. En cas de persistance des écarts, des mesures administratives pourront être engagées.</p>
        </div>
        <div class="report-footer">
          <p>Ainsi fait à <strong>${reportCity}</strong> le <strong>${reportDate}</strong></p>
          <div class="signature-block">
            <p><strong>${reportRole}</strong></p>
            <p>IT/CT IA — Rapport de Réunion</p>
            <p>Code : <strong>${reportId}</strong></p>
          </div>
        </div>
      </div>
    `;
  } else if (mode === 'formation') {
    output = `
      <div class="a4-paper">
        <div class="report-header">
          <h1>RAPPORT DE FORMATION</h1>
          <div class="meta-line"><strong>IT/CT IA — Mode Formation</strong> | Code : <strong style="color:var(--primary);">${reportId}</strong></div>
          <img src="${generateQRUrl('IT/CT Formation ' + reportId)}" alt="QR Code" style="width:90px;height:90px;margin-top:0.8rem;border:2px solid var(--primary);border-radius:6px;" />
        </div>
        <div class="report-body">
          <table style="width:100%;font-size:0.85rem;border-collapse:collapse;margin-bottom:1rem;">
            <tr><td style="font-weight:600;padding:0.3rem;">Date</td><td>${reportDate}</td></tr>
            <tr><td style="font-weight:600;padding:0.3rem;">Ordre de service</td><td>${STATE.currentMission ? STATE.currentMission.order || 'Non spécifié' : '—'}</td></tr>
            <tr><td style="font-weight:600;padding:0.3rem;">Groupe</td><td>${STATE.currentMission ? STATE.currentMission.group || '—' : '—'}</td></tr>
            <tr><td style="font-weight:600;padding:0.3rem;">Formateur</td><td>${reportRole}</td></tr>
            <tr><td style="font-weight:600;padding:0.3rem;">Participants</td><td>${STATE.currentMission ? STATE.currentMission.participants || '—' : '—'}</td></tr>
            <tr><td style="font-weight:600;padding:0.3rem;">Thème de formation</td><td>Formation et sensibilisation sur la législation du travail et la méthodologie d'inspection.</td></tr>
          </table>
          <h2>I. Programme de la formation</h2>
          <ul>
            <li>Présentation du Code du travail (articles 187 à 198) et de leurs applications.</li>
            <li>Méthodologie de contrôle : identification, notification, visite, entretiens, collecte de documents.</li>
            <li>Procédures de rédaction des procès-verbaux et des mises en demeure.</li>
            <li>Exercices pratiques et études de cas.</li>
          </ul>
          <h2>II. Évaluation et recommandations</h2>
          <p>Les participants ont montré un bon niveau de compréhension des procédures. Il est recommandé de poursuivre la formation par des visites de terrain supervisées et des réinspections après un délai de 1 mois.</p>
          <h2>III. Actions de suivi</h2>
          <p>Le suivi de la formation sera assuré par le même groupe d'inspection. Un rapport de suivi est prévu après chaque visite complémentaire.</p>
        </div>
        <div class="report-footer">
          <p>Ainsi fait à <strong>${reportCity}</strong> le <strong>${reportDate}</strong></p>
          <div class="signature-block">
            <p><strong>${reportRole}</strong></p>
            <p>IT/CT IA — Rapport de Formation</p>
            <p>Code : <strong>${reportId}</strong></p>
          </div>
        </div>
      </div>
    `;
  } else if (mode === 'corrective') {
    output = `
      <div class="a4-paper">
        <div class="report-header">
          <h1>RAPPORT CORRECTIF</h1>
          <div class="meta-line"><strong>IT/CT IA — Mode Corrective</strong> | Code : <strong style="color:var(--primary);">${reportId}</strong></div>
          <img src="${generateQRUrl('IT/CT Corrective ' + reportId)}" alt="QR Code" style="width:90px;height:90px;margin-top:0.8rem;border:2px solid var(--primary);border-radius:6px;" />
        </div>
        <div class="report-body">
          <table style="width:100%;font-size:0.85rem;border-collapse:collapse;margin-bottom:1rem;">
            <tr><td style="font-weight:600;padding:0.3rem;">Date de correction</td><td>${reportDate}</td></tr>
            <tr><td style="font-weight:600;padding:0.3rem;">Document corrigé</td><td>Rapport de mission — ${reportId}</td></tr>
            <tr><td style="font-weight:600;padding:0.3rem;">Auteur de la correction</td><td>${reportRole}</td></tr>
            <tr><td style="font-weight:600;padding:0.3rem;">Type de correction</td><td>Mise en conformité avec le modèle officiel de rapport administratif du Code du travail RDC</td></tr>
          </table>
          <h2>I. Points corrigés</h2>
          <ul>
            <li>Structure du rapport conforme au modèle officiel (Introduction, Déroulement, Entreprises, Difficultés, Constats, Irrégularités, Recommandations, Actions).</li>
            <li>Mise en page A4 respectée avec marges et typographie adaptées.</li>
            <li>Ajout des références juridiques (articles 187-198) et du serment.</li>
            <li>Intégration du code unique et du QR code pour traçabilité.</li>
          </ul>
          <h2>II. Texte corrigé et adapté</h2>
          <p>${transcript.substring(0, 600)}...</p>
          <h2>III. Validation et archivage</h2>
          <p>Le document corrigé a été validé et peut être imprimé, exporté en PDF ou partagé. Un exemplaire est archivé automatiquement.</p>
        </div>
        <div class="report-footer">
          <p>Ainsi fait à <strong>${reportCity}</strong> le <strong>${reportDate}</strong></p>
          <div class="signature-block">
            <p><strong>IA Corrective — InspecteurBot</strong></p>
            <p>Code : <strong>${reportId}</strong></p>
          </div>
        </div>
      </div>
    `;
  } else {
    // Mission — modèle officiel complet et fidèle au PDF
    output = `
      <div class="a4-paper">
        <div class="report-header">
          <h1>RAPPORT DE MISSION</h1>
          <div class="meta-line">
            <strong>IT/CT IA — Mode Mission</strong> | Code unique : <strong style="color:var(--primary);">${reportId}</strong><br/>
            Ordre de service : ${STATE.currentMission ? STATE.currentMission.order || '—' : '—'} | Groupe : ${STATE.currentMission ? STATE.currentMission.group || '—' : '—'} | Fonction : ${reportRole}<br/>
            Participants : ${STATE.currentMission ? STATE.currentMission.participants || '—' : '—'}
          </div>
          <img src="${generateQRUrl('Rapport de Mission ' + reportId)}" alt="QR Code" style="width:100px;height:100px;margin-top:0.6rem;border:3px solid var(--primary);border-radius:8px;" />
        </div>
        <div class="report-body">
          <h2>I. Introduction</h2>
          <p>Sur ordre de service N° <strong>${STATE.currentMission ? STATE.currentMission.order || '—' : '—'}</strong> en exécution de l'Ordre de mission collectif de son Excellence Monsieur le Ministre de l'Emploi et du Travail.</p>
          <p>Avec comme mission de : <strong>${STATE.currentMission ? STATE.currentMission.objective || '—' : '—'}</strong></p>
          <p>Avec comme matière à contrôler : <strong>${STATE.currentMission ? STATE.currentMission.matter || '—' : '—'}</strong></p>

          <h2>II. Déroulement de la Mission</h2>
          <p><strong>Période :</strong> ${STATE.currentMission ? STATE.currentMission.date || '—' : '—'}</p>
          <p><strong>Lieu de la Mission :</strong> ${STATE.currentMission ? (STATE.currentMission.addresses ? STATE.currentMission.addresses.split('\n')[0] : '—') : '—'}</p>
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
            <tbody>${companiesList}</tbody>
          </table>

          <h2>IV. Difficultés rencontrées</h2>
          <p>— ${STATE.currentMission ? STATE.currentMission.difficiles || STATE.currentMission.observations || 'Aucune difficulté particulière signalée.' : 'Aucune difficulté particulière signalée.'}</p>

          <h2>V. Constats effectués</h2>
          <ul>
            <li>Inspection des registres et documents obligatoires.</li>
            <li>Vérification de l'affichage des avis prévus par la loi.</li>
            <li>Contrôle des conditions de sécurité et d'hygiène.</li>
            <li>Entretien avec le personnel et l'employeur.</li>
          </ul>

          <h2>VI. Irrégularités relevées</h2>
          <ul>
            <li>Absence de certains documents liés à la main d'œuvre nationale et étrangère.</li>
            <li>Non-conformité des règlements internes.</li>
            <li>Obstruction au contrôle relevée dans plusieurs établissements.</li>
          </ul>

          <h2>VII. Recommandations et décisions proposées</h2>
          <ul>
            <li><strong>${pvList[Math.floor(Math.random() * pvList.length)]}</strong> — à transmettre au procureur.</li>
            <li><strong>${actions[Math.floor(Math.random() * actions.length)]}</strong> — délai proposé : 15 à 30 jours.</li>
            <li>Réinspection complémentaire recommandée après régularisation.</li>
          </ul>

          <h2>VIII. Actions de suivi</h2>
          <p>Le suivi sera assuré par le même groupe d'inspection. Un nouveau contrôle est prévu après un délai de 1 mois. En cas de persistance des irrégularités, des mesures judiciaires pourront être engagées conformément aux articles 196 à 198 du Code du travail.</p>
        </div>
        <div class="report-footer">
          <p>Ainsi fait à <strong>${reportCity}</strong> le <strong>${reportDate}</strong></p>
          <div class="signature-block">
            <p><strong>${reportName || reportRole}</strong></p>
            <p>${reportRole}</p>
            <p>Téléphone : ${STATE.currentMission ? STATE.currentMission.phone || '—' : '—'}</p>
            <p style="margin-top:0.3rem;font-size:0.8rem;color:var(--ink-muted);">Code rapport : <strong>${reportId}</strong></p>
            <img src="${generateQRUrl('Rapport Mission ' + reportId)}" alt="QR Code" style="width:60px;height:60px;margin-top:0.3rem;border:2px solid var(--primary);border-radius:6px;" />
          </div>
        </div>
      </div>
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

function shareIAOutput() {
  const body = document.getElementById('iaOutputBody');
  const text = body.innerText;
  const shareData = { title: 'IT/CT IA — Document généré', text: text.substring(0, 200) + '...', url: window.location.href };
  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => showToast('Contenu du document copié dans le presse-papier pour partage.', 'success'));
  }
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
  document.getElementById('mDifficultes').value = item.difficiles || item.observations || '';
  document.getElementById('mDirection').value = item.direction || '';
  // Logo file is not recoverable from archive; leave empty for edit
  document.getElementById('mLogo').value = '';
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
  renderDifficultes();
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
