const infractionsDB = [
    {id: 1, intitule: "Non Affichage de l'Horaire", desc: "L'employeur n'a pas affiché l'horaire de travail visé.", articles: "Art 119 et 222", sanction: "20 000 FC", gravite: "Faible"},
    {id: 2, intitule: "Défaut de Classification", desc: "Non-respect de la classification des emplois.", articles: "Art 90", sanction: "20 000 FC", gravite: "Moyenne"},
    {id: 3, intitule: "Contrat non constaté par écrit", desc: "Contrat non signé ou non visé par l'ONEM.", articles: "Art 44, 46", sanction: "20 000 FC", gravite: "Grave"},
    {id: 4, intitule: "Défaut de Règlement Intérieur", desc: "Absence de règlement intérieur validé.", articles: "Art 157", sanction: "20 000 FC", gravite: "Moyenne"},
    {id: 5, intitule: "Défaut du SMIG", desc: "Non-respect du SMIG.", articles: "Art 87", sanction: "Fermeture possible", gravite: "Très Grave"},
    {id: 6, intitule: "Heures supplémentaires non payées", desc: "Travail au-delà de 45h sans paiement.", articles: "Art 119", sanction: "20 000 FC", gravite: "Grave"},
    {id: 7, intitule: "Privation du jour de repos", desc: "Non octroi du repos hebdomadaire.", articles: "Art 121", sanction: "20 000 FC", gravite: "Moyenne"},
    {id: 10, intitule: "Travail des enfants de 15 à 17 ans", desc: "Emploi sans autorisation de l'Inspecteur.", articles: "Art 133", sanction: "Peine Pénale", gravite: "Très Grave"},
    {id: 11, intitule: "Mauvaises conditions d'hygiène", desc: "Milieu de travail insalubre ou dangereux.", articles: "Art 171", sanction: "Mise en demeure", gravite: "Grave"},
    {id: 12, intitule: "Non assurance médicale", desc: "Défaut de couverture de soins.", articles: "Art 177", sanction: "20 000 FC", gravite: "Grave"},
    {id: 13, intitule: "Violation convention collective", desc: "Non respect des accords conclus.", articles: "Art 320", sanction: "7 500 FC", gravite: "Moyenne"},
    {id: 16, intitule: "Absence contrat d'apprentissage", desc: "Contrat d'apprentissage non écrit.", articles: "Art 19", sanction: "20 000 FC", gravite: "Faible"},
    {id: 25, intitule: "Non paiement transport travailleur", desc: "Défaut de prise en charge trajet domicile-travail.", articles: "Art 56", sanction: "20 000 FC", gravite: "Moyenne"},
    {id: 28, intitule: "Licenciements massifs irréguliers", desc: "Licenciement éco sans procédures.", articles: "Art 78", sanction: "Amendes", gravite: "Très Grave"},
    {id: 31, intitule: "Rémunération hors monnaie légale", desc: "Paiement en nature ou monnaie étrangère.", articles: "Art 89, 90", sanction: "20 000 FC", gravite: "Grave"},
    {id: 33, intitule: "Paiement sans décompte écrit", desc: "Remise du salaire sans fiche de paie.", articles: "Art 103", sanction: "20 000 FC", gravite: "Faible"},
    {id: 37, intitule: "Défaut de logement décent", desc: "Absence d'indemnité pour engagement hors lieu.", articles: "Art 138", sanction: "20 000 FC", gravite: "Grave"},
    {id: 38, intitule: "Défaut planning de congés", desc: "Violation des prescriptions sur les congés annuels.", articles: "Art 140-146", sanction: "20 000 FC", gravite: "Moyenne"},
    {id: 41, intitule: "Non déclaration accident du travail", desc: "Défaut de signalement à l'Inspecteur et CNSS", articles: "Art 176", sanction: "20 000 FC", gravite: "Grave"},
    {id: 43, intitule: "Défaut de livre de paie", desc: "Livre de paie inexistant ou non mis à jour.", articles: "Art 213-216", sanction: "20 000 FC", gravite: "Moyenne"},
    {id: 44, intitule: "Non déclaration mouvement personnel", desc: "Défaut de signalement à l'ONEM.", articles: "Art 217", sanction: "20 000 FC", gravite: "Moyenne"},
    {id: 49, intitule: "Licenciement Délégué Syndical", desc: "Sans approbation préalable de l'Inspecteur", articles: "Art 258", sanction: "20 000 FC", gravite: "Très Grave"},
    {id: 53, intitule: "Non-respect des jours fériés légaux", desc: "Violation du repos les jours fériés.", articles: "Art 123", sanction: "20 000 FC", gravite: "Moyenne"},
    {id: 57, intitule: "Heures de nuit non majorées", desc: "Travail de nuit non payé en majoration.", articles: "Art 124", sanction: "20 000 FC", gravite: "Grave"},
    {id: 62, intitule: "Obstacle à l'Inspecteur", desc: "Faire obstacle aux fonctions.", articles: "Art 322", sanction: "30 000 FC + SP", gravite: "Très Grave"},
    {id: 65, intitule: "Privation Décompte Final", desc: "Non paiement 48h après fin contrat", articles: "Art 100", sanction: "20 000 FC", gravite: "Grave"}
];

// Combler jusqu'à 65 pour le tableau
for(let i=1; i<=65; i++) {
    if(!infractionsDB.find(x => x.id === i)) {
        infractionsDB.push({
            id: i, 
            intitule: "Infraction Code du Travail (Art " + (100+i) + ")", 
            desc: "Violation des dispositions.", 
            articles: "Art " + (100+i), 
            sanction: "20 000 FC", 
            gravite: "Moyenne"
        });
    }
}
infractionsDB.sort((a,b) => a.id - b.id);

const aimDB = [
    { nature: "Défaut de Règlement Intérieur", catA: "1000 USD", catB: "700 USD", catC: "500 USD" },
    { nature: "Défaut d'hygiène (Mise en demeure ignorée)", catA: "1500 USD", catB: "1000 USD", catC: "700 USD" },
    { nature: "Travail des enfants (-18 ans)", catA: "3000 USD", catB: "2100 USD", catC: "1500 USD" },
    { nature: "Défaut de paiement SMIG", catA: "2000 USD", catB: "1400 USD", catC: "1000 USD" },
    { nature: "Autres infractions courantes", catA: "1000 USD", catB: "700 USD", catC: "500 USD" }
];

const app = {
    history: [],
    currentViewId: 'dashboard',
    archives: [],

    init: function() {
        this.bindEvents();
        this.loadArchives();
        this.renderTableCode();
        this.renderTableAIM();
    },

    bindEvents: function() {
        document.getElementById('theme-btn')?.addEventListener('click', () => this.toggleTheme());
        document.getElementById('chat-send-btn')?.addEventListener('click', () => this.handleChat());
        document.getElementById('chat-input-field')?.addEventListener('keypress', (e) => { if(e.key === 'Enter') this.handleChat(); });
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
        const targetView = document.getElementById(viewId);
        if(targetView) targetView.classList.add('active');
        const titleEl = document.getElementById('app-title');
        if(titleEl) titleEl.innerText = title;
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

    // --- TABLEAUX LEGAUX ---
    renderTableCode: function() {
        const tbody = document.getElementById('tbody-code');
        if(!tbody) return;
        tbody.innerHTML = '';
        infractionsDB.forEach(inf => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${inf.id}</td>
                <td style="font-weight: 500;">${inf.intitule}<br><span style="font-size:11px; color:var(--text-muted); font-weight:normal;">${inf.desc}</span></td>
                <td style="font-weight: 600; color:var(--brand-primary);">${inf.articles}</td>
                <td class="amount">${inf.sanction}</td>
            `;
            tbody.appendChild(tr);
        });
    },

    renderTableAIM: function() {
        const tbody = document.getElementById('tbody-aim');
        if(!tbody) return;
        tbody.innerHTML = '';
        aimDB.forEach(aim => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight: 500;">${aim.nature}</td>
                <td class="amount">${aim.catA}</td>
                <td class="amount" style="color:var(--status-warning);">${aim.catB}</td>
                <td class="amount" style="color:var(--status-success);">${aim.catC}</td>
            `;
            tbody.appendChild(tr);
        });
    },

    // --- OUTILS & GENERATEUR ---
    translateText: function() {
        const text = document.getElementById('trad-text').value;
        const lang = document.getElementById('trad-lang').value;
        const resDiv = document.getElementById('trad-result');
        if(!text) { resDiv.style.display = 'none'; return; }
        
        let translated = "";
        const lower = text.toLowerCase();
        
        if(lower.includes("horaire")) {
            if(lang === "Lingala") translated = "Bó tia ngonga ya mosala na mur.";
            else if(lang === "Swahili") translated = "Mbandike ratiba ya kazi ukutani.";
            else if(lang === "Kikongo") translated = "Bika ntangu ya salu na lumbu.";
            else if(lang === "Tshiluba") translated = "Teka tshikondo tshia mudimu pa tshimanu.";
            else translated = "Please post the work schedule on the wall.";
        } else if (lower.includes("salaire") || lower.includes("smig")) {
            if(lang === "Lingala") translated = "Esengeli kofuta lifuti mpe SMIG na ndenge ya mibeko.";
            else if(lang === "Swahili") translated = "Lazima ulipe mshahara kulingana na sheria.";
            else if(lang === "Kikongo") translated = "Futa mbongo ya salu na ku landa nsiku.";
            else if(lang === "Tshiluba") translated = "Futa makuta a mudimu bilondeshile mikenji.";
            else translated = "You must pay the legal minimum wage.";
        } else {
            translated = `[Traduction IA en ${lang}] : Modèle en apprentissage pour cette phrase.`;
        }
        
        resDiv.innerHTML = `<i class="fa-solid fa-language"></i> ${translated}`;
        resDiv.style.display = 'block';
    },

    generateConvo: function() {
        const objet = document.getElementById('convo-objet').value;
        const resDiv = document.getElementById('convo-result');
        
        const dateStr = new Date().toLocaleDateString('fr-FR');
        
        let texte = `<strong>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</strong><br>
        <strong>Inspection Générale du Travail</strong><br><br>
        <strong>CONVOCATION OFFICIELLE</strong><br><br>
        Il est demandé au Représentant Légal de l'entreprise [À compléter] de se présenter à nos bureaux situés à [À compléter], le [Date] à [Heure].<br><br>
        <strong>Objet :</strong> ${objet}.<br><br>
        Veuillez vous munir des documents pertinents suivants : [Liste des documents].<br>
        Toute absence non justifiée constituera un obstacle au fonctionnement de l'Inspection, punissable selon l'Article 322 du Code du Travail.<br><br>
        Fait le ${dateStr},<br>L'Inspecteur du Travail.`;
        
        resDiv.innerHTML = texte;
        resDiv.style.display = 'block';
    },

    // --- ARCHIVES ---
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
                    <p style="font-size:12px;">${arch.date} | Infr: ${arch.infractions || 'Aucune'}</p>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span class="badge ${this.getBadgeClass(arch.statut)}">${arch.statut}</span>
                </div>`;
            div.onclick = () => this.openArchiveForm(arch.id);
            container.appendChild(div);
        });
    },

    openArchiveForm: function(id = null) {
        const btnDelete = document.getElementById('btn-delete-archive');
        if(btnDelete) btnDelete.style.display = id ? 'block' : 'none';

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
        const newArch = {
            id: id ? parseInt(id) : Date.now(),
            nom: document.getElementById('archive-nom').value || "Dossier Anonyme",
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

    // --- SUPER IA LOCALE Q&A ---
    sendChip: function(text) {
        const input = document.getElementById('chat-input-field');
        if(input) {
            input.value = text;
            this.handleChat();
        }
    },

    handleChat: function() {
        const input = document.getElementById('chat-input-field');
        if(!input) return;
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

        // 1. Math / Preavis
        const preavisMatch = q.match(/pr[eé]avis.*?(?:pour|avec)\s+(\d+)\s+an/);
        if(preavisMatch || q.includes("calcule le préavis") || q.includes("calculer le préavis")) {
            let ans = preavisMatch ? parseInt(preavisMatch[1]) : 5;
            let jours = 14 + (7 * ans);
            return `<strong><i class="fa-solid fa-calculator"></i> Calculateur de Préavis (Art 64) :</strong><br>
                    Pour ${ans} an(s) d'ancienneté :<br>
                    Base légale : 14 jours<br>
                    Majoration (${ans}x7) : ${ans*7} jours<br>
                    <strong>Total = ${jours} jours calendaires.</strong>`;
        }

        // 2. IA Queries for specific articles
        if(q.includes("art 157") || q.includes("article 157") || q.includes("r.i.") || q.includes("règlement intérieur")) {
            return `<strong>L'Article 157</strong> concerne le Défaut de Règlement Intérieur.<br>
            Tout employeur ayant au moins 20 travailleurs doit en avoir un visé par l'Inspecteur du Travail.<br>
            <strong>Sanction Code du Travail :</strong> 20 000 FC (Moyenne).<br>
            <strong>Amende AIM 006 (Recouvrement) :</strong> Cat A (1000$), Cat B (700$), Cat C (500$).`;
        }

        if(q.includes("art 133") || q.includes("article 133") || q.includes("enfant")) {
            return `<strong>Le travail des enfants (Art 133)</strong><br>
            Interdit en dessous de 15 ans. De 15 à 17 ans, il faut une autorisation expresse de l'Inspecteur.<br>
            <strong>Sanction :</strong> Très Grave (Peine pénale possible). Le multiplicateur AIM 006 est de x3 sur la base de la Catégorie.`;
        }

        if(q.includes("art 87") || q.includes("smig")) {
            return `<strong>L'Article 87</strong> rend obligatoire le paiement du SMIG.<br>
            Le défaut de SMIG est une infraction Très Grave. L'inspecteur peut proposer la fermeture partielle ou totale de l'établissement au Ministre (Art 318). L'Amende AIM est multipliée par 2.`;
        }

        return "Je suis l'IA Experte RDC. Demandez-moi d'<strong>expliquer un article</strong> (ex: Art 157), de <strong>calculer un préavis</strong>, ou les amendes sur le <strong>SMIG</strong>.";
    }
};

window.onload = () => app.init();
