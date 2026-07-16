// --- DATABASE ---
const infractionsDB = [
    {id: 1, intitule: "Non Affichage de l'Horaire", desc: "L'employeur n'a pas affiché l'horaire de travail visé.", articles: "Art 119 et 222", sanction: "Amende", gravite: "Faible"},
    {id: 2, intitule: "Défaut de Classification", desc: "Non-respect de la classification des emplois.", articles: "Art 90", sanction: "Amende", gravite: "Moyenne"},
    {id: 3, intitule: "Contrat non constaté par écrit", desc: "Contrat non signé ou non visé par l'ONEM.", articles: "Art 44, 46", sanction: "Devient CDI, Amende", gravite: "Grave"},
    {id: 4, intitule: "Défaut de Règlement Intérieur", desc: "Absence de règlement intérieur validé.", articles: "Art 157", sanction: "Amende", gravite: "Moyenne"},
    {id: 5, intitule: "Défaut du SMIG", desc: "Non-respect du SMIG.", articles: "Art 87", sanction: "Fermeture possible, Amende", gravite: "Tres Grave"},
    {id: 10, intitule: "Travail des enfants", desc: "Emploi sans autorisation de l'Inspecteur.", articles: "Art 133", sanction: "Amende + Peine Pénale", gravite: "Tres Grave"},
    {id: 11, intitule: "Mauvaises conditions d'hygiène", desc: "Milieu de travail insalubre.", articles: "Art 171", sanction: "Mise en demeure", gravite: "Grave"},
    {id: 28, intitule: "Licenciements massifs irréguliers", desc: "Sans respecter les procédures.", articles: "Art 78", sanction: "Amendes", gravite: "Tres Grave"},
    {id: 41, intitule: "Non déclaration accident travail", desc: "Défaut de signalement à l'Inspecteur et CNSS", articles: "Art 176", sanction: "Amende", gravite: "Grave"},
    {id: 49, intitule: "Licenciement Délégué Syndical", desc: "Sans approbation de l'Inspecteur", articles: "Art 258", sanction: "Amende", gravite: "Tres Grave"},
    {id: 62, intitule: "Obstacle à l'Inspecteur", desc: "Faire obstacle aux fonctions.", articles: "Art 322", sanction: "Amende + 30 jours SP", gravite: "Tres Grave"},
    {id: 65, intitule: "Privation Décompte Final", desc: "Non paiement 48h après fin contrat", articles: "Art 100", sanction: "Amende", gravite: "Grave"}
];

const quizDB = [
    { q: "Quel article sanctionne le travail d'un enfant de 15 ans sans autorisation ?", opts: ["Art 157", "Art 133", "Art 87"], ans: 1 },
    { q: "La fermeture d'établissement par l'Inspecteur est régie par l'article :", opts: ["Art 318", "Art 44", "Art 119"], ans: 0 },
    { q: "Le défaut de Règlement Intérieur (Art 157) est une infraction de gravité :", opts: ["Faible", "Moyenne", "Très Grave"], ans: 1 }
];

const app = {
    history: [],
    currentViewId: 'dashboard',
    archives: [],

    init: function() {
        this.bindEvents();
        this.loadArchives();
        this.renderInfractionsList();
    },

    bindEvents: function() {
        document.getElementById('theme-btn')?.addEventListener('click', this.toggleTheme);
        document.getElementById('theme-toggle-list')?.addEventListener('click', this.toggleTheme);
        document.getElementById('chat-send-btn')?.addEventListener('click', () => this.handleChat());
        document.getElementById('chat-input-field')?.addEventListener('keypress', (e) => { if(e.key === 'Enter') this.handleChat(); });
        document.getElementById('infractions-search')?.addEventListener('input', (e) => { this.renderInfractionsList(e.target.value); });
    },

    toggleTheme: function() {
        const html = document.documentElement;
        html.setAttribute('data-theme', html.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    },

    navToTab: function(viewId, title) {
        this.history = [];
        document.getElementById('back-btn').classList.add('hidden');
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`.nav-tab[data-tab="${viewId}"]`)?.classList.add('active');
        this.switchView(viewId, title);
    },

    navTo: function(viewId, title) {
        this.history.push({ id: this.currentViewId, title: document.getElementById('app-title').innerText });
        document.getElementById('back-btn').classList.remove('hidden');
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        this.switchView(viewId, title);
    },

    goBack: function() {
        if (this.history.length === 0) return;
        const prev = this.history.pop();
        if (this.history.length === 0) {
            document.getElementById('back-btn').classList.add('hidden');
            const tab = document.querySelector(`.nav-tab[data-tab="${prev.id}"]`);
            if(tab) tab.classList.add('active');
        }
        this.switchView(prev.id, prev.title);
    },

    switchView: function(viewId, title) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(viewId)?.classList.add('active');
        document.getElementById('app-title').innerText = title;
        this.currentViewId = viewId;
    },

    getBadgeClass: function(g) {
        const lower = g.toLowerCase();
        if(lower.includes('faible')) return 'badge-success';
        if(lower.includes('moyenne')) return 'badge-warning';
        if(lower.includes('ouvert')) return 'badge-primary';
        if(lower.includes('urgent')) return 'badge-danger';
        if(lower.includes('clos')) return 'badge-success';
        return 'badge-danger';
    },

    // --- ARCHIVAGE INTELLIGENT (CRUD) ---
    loadArchives: function() {
        const data = localStorage.getItem('inspecteur_archives');
        this.archives = data ? JSON.parse(data) : [];
        this.renderArchives();
    },

    renderArchives: function() {
        const container = document.getElementById('archives-list');
        if(!container) return;
        container.innerHTML = '';
        if(this.archives.length === 0) {
            container.innerHTML = '<div style="padding: 20px; text-align:center; color:var(--text-muted);">Aucun dossier archivé.</div>';
            return;
        }
        
        this.archives.forEach(arch => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
                <div class="list-item-content" style="flex-grow:1;">
                    <h4 style="margin-bottom:2px;">${arch.nom}</h4>
                    <p style="font-size:11px;">${arch.date} | Infr: ${arch.infractions || 'Aucune'}</p>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span class="badge ${this.getBadgeClass(arch.statut)}">${arch.statut}</span>
                </div>`;
            div.onclick = () => this.openArchiveForm(arch.id);
            container.appendChild(div);
        });
    },

    openArchiveForm: function(id = null) {
        document.getElementById('btn-delete-archive').style.display = id ? 'block' : 'none';
        
        if(id) {
            const arch = this.archives.find(a => a.id === id);
            document.getElementById('archive-id').value = arch.id;
            document.getElementById('archive-nom').value = arch.nom;
            document.getElementById('archive-statut').value = arch.statut;
            document.getElementById('archive-infractions').value = arch.infractions;
            document.getElementById('archive-notes').value = arch.notes;
            this.navTo('archive-form', 'Éditer Dossier');
        } else {
            document.getElementById('archive-id').value = '';
            document.getElementById('archive-nom').value = '';
            document.getElementById('archive-statut').value = 'Ouvert';
            document.getElementById('archive-infractions').value = '';
            document.getElementById('archive-notes').value = '';
            this.navTo('archive-form', 'Nouveau Dossier');
        }
    },

    saveArchive: function() {
        const id = document.getElementById('archive-id').value;
        const nom = document.getElementById('archive-nom').value || "Entreprise Inconnue";
        
        const newArch = {
            id: id ? parseInt(id) : Date.now(),
            nom: nom,
            statut: document.getElementById('archive-statut').value,
            infractions: document.getElementById('archive-infractions').value,
            notes: document.getElementById('archive-notes').value,
            date: new Date().toLocaleDateString('fr-FR')
        };

        if(id) {
            const idx = this.archives.findIndex(a => a.id === parseInt(id));
            this.archives[idx] = newArch;
        } else {
            this.archives.unshift(newArch);
        }

        localStorage.setItem('inspecteur_archives', JSON.stringify(this.archives));
        this.renderArchives();
        this.goBack();
    },

    deleteArchive: function() {
        const id = document.getElementById('archive-id').value;
        if(id && confirm("Supprimer définitivement ce dossier ?")) {
            this.archives = this.archives.filter(a => a.id !== parseInt(id));
            localStorage.setItem('inspecteur_archives', JSON.stringify(this.archives));
            this.renderArchives();
            this.goBack();
        }
    },

    // --- CODE DU TRAVAIL ---
    renderInfractionsList: function(filter = '') {
        const container = document.getElementById('infractions-list');
        if(!container) return;
        container.innerHTML = '';
        
        const filtered = infractionsDB.filter(inf => 
            inf.intitule.toLowerCase().includes(filter.toLowerCase()) || 
            inf.articles.toLowerCase().includes(filter.toLowerCase())
        );

        filtered.forEach(inf => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
                <div class="list-item-content">
                    <h4>${inf.intitule}</h4><p>${inf.articles}</p>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span class="badge ${this.getBadgeClass(inf.gravite)}">${inf.gravite}</span>
                    <i class="fa-solid fa-chevron-right" style="color:var(--border-color)"></i>
                </div>`;
            div.onclick = () => this.showInfractionDetail(inf.id);
            container.appendChild(div);
        });
    },

    showInfractionDetail: function(id) {
        const inf = infractionsDB.find(i => i.id === id);
        if(!inf) return;
        document.getElementById('infraction-detail-content').innerHTML = `
            <div class="card" style="margin-top: 20px;">
                <span class="badge ${this.getBadgeClass(inf.gravite)}" style="margin-bottom: 10px;">${inf.gravite}</span>
                <h2 style="font-size: 20px; margin-bottom: 5px;">${inf.intitule}</h2>
                <p style="color: var(--brand-primary); font-weight: 500; font-size: 14px; margin-bottom: 20px;">Base Légale: ${inf.articles}</p>
                <h4 style="font-size: 14px; color: var(--text-muted); margin-bottom: 5px;">Description</h4>
                <p style="font-size: 15px; margin-bottom: 20px; line-height: 1.5;">${inf.desc}</p>
                <h4 style="font-size: 14px; color: var(--text-muted); margin-bottom: 5px;">Sanction Prévue</h4>
                <p style="font-size: 15px; font-weight: 600; color: var(--status-danger); margin-bottom: 20px;">${inf.sanction}</p>
            </div>`;
        this.navTo('infraction-detail', `Détail Sanction`);
    },

    // --- OUTILS & CALCULATEURS ---
    calculateAmende: function() {
        const cat = document.getElementById('calc-cat').value;
        const inf = document.getElementById('calc-inf').value;
        let base = cat === 'A' ? 1000 : cat === 'B' ? 700 : 500;
        let multi = (inf === '133' || inf === '171') ? 3 : (inf === '87') ? 2 : 1;
        document.getElementById('calc-result').innerText = `${base * multi} USD`;
        document.getElementById('calc-details').innerText = `Base AIM: ${base}$ | Gravité: x${multi}`;
    },

    // --- QUIZ ---
    currentQuizIndex: 0,
    launchQuiz: function() {
        this.currentQuizIndex = 0;
        this.navTo('quiz', 'Quiz Inspecteur');
        this.showQuizQuestion();
    },
    showQuizQuestion: function() {
        const q = quizDB[this.currentQuizIndex];
        document.getElementById('quiz-question').innerText = q.q;
        const optsDiv = document.getElementById('quiz-options');
        optsDiv.innerHTML = '';
        document.getElementById('quiz-feedback').style.display = 'none';
        document.getElementById('quiz-next').style.display = 'none';
        
        q.opts.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-outline';
            btn.innerText = opt;
            btn.onclick = () => this.answerQuiz(idx, q.ans, btn);
            optsDiv.appendChild(btn);
        });
    },
    answerQuiz: function(selected, correct, btn) {
        const feedback = document.getElementById('quiz-feedback');
        feedback.style.display = 'block';
        if(selected === correct) {
            btn.style.backgroundColor = 'var(--status-success)';
            btn.style.color = 'white';
            feedback.innerText = "Bonne réponse !";
            feedback.style.color = 'var(--status-success)';
        } else {
            btn.style.backgroundColor = 'var(--status-danger)';
            btn.style.color = 'white';
            feedback.innerText = "Mauvaise réponse.";
            feedback.style.color = 'var(--status-danger)';
        }
        document.getElementById('quiz-next').style.display = 'block';
    },
    nextQuiz: function() {
        this.currentQuizIndex++;
        if(this.currentQuizIndex >= quizDB.length) {
            alert("Quiz terminé !");
            this.goBack();
        } else {
            this.showQuizQuestion();
        }
    },

    // --- SUPER IA LOCALE ---
    sendChip: function(text) {
        const input = document.getElementById('chat-input-field');
        if(input) {
            input.value = text;
            this.navToTab('ia', 'Super IA Locale');
            this.handleChat();
        }
    },

    handleChat: function() {
        const input = document.getElementById('chat-input-field');
        const text = input.value.trim();
        if(!text) return;
        
        const container = document.getElementById('chat-messages');
        if(!container) return;

        container.innerHTML += `<div class="msg msg-user">${text}</div>`;
        input.value = '';
        container.scrollTop = container.scrollHeight;

        const typingId = 'typing-' + Date.now();
        container.innerHTML += `<div class="msg msg-ai" id="${typingId}"><i class="fa-solid fa-ellipsis fa-fade"></i></div>`;
        container.scrollTop = container.scrollHeight;

        setTimeout(() => {
            const el = document.getElementById(typingId);
            if(el) el.remove();
            
            const response = this.processAIQuery(text);
            container.innerHTML += `<div class="msg msg-ai" style="animation: slideIn 0.2s;">${response}</div>`;
            container.scrollTop = container.scrollHeight;
        }, 800);
    },

    processAIQuery: function(text) {
        const q = text.toLowerCase();

        // 1. Calculate Préavis
        const preavisMatch = q.match(/pr[eé]avis.*?(?:pour|avec)\s+(\d+)\s+an/);
        if(preavisMatch || q.includes("calcule le préavis")) {
            let ans = preavisMatch ? parseInt(preavisMatch[1]) : 5;
            let jours = 14 + (7 * ans);
            return `<strong><i class="fa-solid fa-calculator"></i> Calculateur de Préavis (Art 64) :</strong><br>
                    Pour ${ans} an(s) d'ancienneté :<br>
                    Base légale : 14 jours<br>
                    Majoration (${ans}x7) : ${ans*7} jours<br>
                    <strong>Total = ${jours} jours calendaires.</strong>`;
        }

        // 2. Translation Lingala / Swahili
        if(q.includes("traduis") || q.includes("traduction")) {
            if(q.includes("lingala")) {
                if(q.includes("horaire")) return `<strong><i class="fa-solid fa-language"></i> Traduction Lingala :</strong><br>"Bó tia ngonga ya mosala na mur." (Affichez l'horaire de travail sur le mur).`;
                if(q.includes("smig")) return `<strong><i class="fa-solid fa-language"></i> Traduction Lingala :</strong><br>"Esengeli kofuta mbongo ya minerval pona basali." (Vous devez payer le SMIG).`;
                return `<strong><i class="fa-solid fa-language"></i> Lingala :</strong><br>Je peux traduire des consignes d'inspection basiques.`;
            }
        }

        // 3. Draft Observation (Auto-Rédaction)
        if(q.includes("rédige") || q.includes("constat") || q.includes("observation")) {
            if(q.includes("paie") || q.includes("registre")) {
                return `<strong><i class="fa-solid fa-pen-nib"></i> Constat Auto-Généré :</strong><br><br>
                <i>"Il a été formellement constaté lors de notre visite l'absence de présentation du livre de paie mis à jour, en violation de l'Article 213 du Code du Travail. Cette carence empêche la vérification de la régularité des rémunérations."</i>`;
            }
            if(q.includes("smig")) {
                return `<strong><i class="fa-solid fa-pen-nib"></i> Constat Auto-Généré :</strong><br><br>
                <i>"L'examen des fiches de paie révèle que l'employeur verse une rémunération inférieure au Salaire Minimum Interprofessionnel Garanti (SMIG), violant ainsi l'Article 87 du Code du Travail."</i>`;
            }
        }

        // 4. Lexique / CNSS / INPP
        if(q.includes("cnss")) return `<strong><i class="fa-solid fa-building-user"></i> Obligations CNSS :</strong><br>1. Affiliation de l'employeur sous 8 jours.<br>2. Immatriculation des travailleurs.<br>3. Versement mensuel/trimestriel des cotisations (part patronale et ouvrière).`;
        if(q.includes("acronymes") || q.includes("lexique")) return `<strong><i class="fa-solid fa-book"></i> Lexique METPS :</strong><br>• <strong>METPS</strong> : Min. Emploi, Travail et Prévoyance Sociale<br>• <strong>IGT</strong> : Inspection Générale du Travail<br>• <strong>ONEM</strong> : Office Nat. de l'Emploi<br>• <strong>CNSS</strong> : Caisse Nat. Sécurité Sociale<br>• <strong>INPP</strong> : Inst. Nat. Préparation Professionnelle.`;

        // 5. Audit par Secteur
        if(q.includes("minier") || q.includes("mines")) return `<strong><i class="fa-solid fa-gem"></i> Audit Mines (Cat A) :</strong><br>Vérifiez le travail de nuit (Art 124), la santé (poussière/silicose - Art 171) et l'absence totale de mineurs. Amendes maximales applicables.`;
        if(q.includes("construction") || q.includes("btp")) return `<strong><i class="fa-solid fa-helmet-safety"></i> Audit Construction (Cat B) :</strong><br>Focus sur les EPI, contrats de journaliers, et déclarations d'accidents (Art 176).`;

        // 6. Heures Supplémentaires
        if(q.includes("heures sup") || q.includes("majoration")) return `<strong><i class="fa-solid fa-stopwatch"></i> Heures Supplémentaires :</strong><br>Majoration légale :<br>• +30% pour les 6 premières heures au-delà de 45h/sem.<br>• +60% pour les suivantes.<br>• +100% si effectué un jour de repos hebdomadaire.`;

        // Default Fallback matching DB
        const inf = infractionsDB.find(i => q.includes(i.id.toString()) || i.intitule.toLowerCase().includes(q));
        if(inf) return `<i class="fa-solid fa-gavel" style="color:var(--brand-primary)"></i> <strong>Infraction N°${inf.id} - ${inf.intitule}</strong><br>Base Légale: ${inf.articles}<br>Sanction prévue: ${inf.sanction}.`;

        return "Je suis l'IA Experte. Demandez-moi de <strong>calculer un préavis</strong>, <strong>traduire en Lingala</strong>, <strong>rédiger un constat</strong> ou <strong>guider un audit sectoriel</strong> !";
    }
};

window.onload = () => app.init();
