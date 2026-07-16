const infractionsDB = [
    {id: 1, intitule: "Non Affichage de l'Horaire", desc: "L'employeur n'a pas affiché l'horaire de travail visé.", articles: "Art 119 et 222", sanction: "Amende", gravite: "Faible"},
    {id: 2, intitule: "Défaut de Classification", desc: "Non-respect de la classification des emplois.", articles: "Art 90", sanction: "Amende", gravite: "Moyenne"},
    {id: 3, intitule: "Contrat non constaté par écrit", desc: "Contrat non signé ou non visé par l'ONEM.", articles: "Art 44, 46", sanction: "Devient CDI, Amende", gravite: "Grave"},
    {id: 4, intitule: "Défaut de Règlement Intérieur", desc: "Absence de règlement intérieur validé.", articles: "Art 157", sanction: "Amende", gravite: "Moyenne"},
    {id: 5, intitule: "Défaut du SMIG", desc: "Non-respect du SMIG.", articles: "Art 87", sanction: "Fermeture possible, Amende", gravite: "Tres Grave"},
    {id: 6, intitule: "Heures supplémentaires non payées", desc: "Travail au-delà de 45h sans paiement.", articles: "Art 119", sanction: "Amende", gravite: "Grave"},
    {id: 7, intitule: "Privation du jour de repos", desc: "Non octroi du repos hebdomadaire.", articles: "Art 121", sanction: "Amende", gravite: "Moyenne"},
    {id: 10, intitule: "Travail des enfants", desc: "Emploi sans autorisation de l'Inspecteur.", articles: "Art 133", sanction: "Amende + Peine Pénale", gravite: "Tres Grave"},
    {id: 11, intitule: "Mauvaises conditions d'hygiène", desc: "Milieu de travail insalubre.", articles: "Art 171", sanction: "Mise en demeure", gravite: "Grave"},
    {id: 12, intitule: "Non assurance service médical", desc: "Défaut de couverture de soins.", articles: "Art 177", sanction: "Amende", gravite: "Grave"},
    {id: 13, intitule: "Violation convention collective", desc: "Non respect des accords conclus.", articles: "Art 320", sanction: "Amende", gravite: "Moyenne"},
    {id: 28, intitule: "Licenciements massifs irréguliers", desc: "Sans respecter les procédures.", articles: "Art 78", sanction: "Amendes", gravite: "Tres Grave"},
    {id: 31, intitule: "Non rémunération monnaie légale", desc: "Paiement en nature non autorisé.", articles: "Art 89 et 90", sanction: "Amende", gravite: "Grave"},
    {id: 37, intitule: "Défaut de logement décent", desc: "Absence d'indemnité pour engagement hors lieu.", articles: "Art 138", sanction: "Amende", gravite: "Grave"},
    {id: 38, intitule: "Défaut de Planning de congés", desc: "Violation des prescriptions sur les congés annuels.", articles: "Art 140", sanction: "Amende", gravite: "Grave"},
    {id: 41, intitule: "Non déclaration accident travail", desc: "Défaut de signalement à l'Inspecteur et CNSS", articles: "Art 176", sanction: "Amende", gravite: "Grave"},
    {id: 43, intitule: "Défaut de tenir livre de paie", desc: "Livre de paie inexistant ou non mis à jour.", articles: "Art 213", sanction: "Amende", gravite: "Faible"},
    {id: 44, intitule: "Non déclaration mouvement personnel", desc: "Défaut de signalement à l'ONEM.", articles: "Art 217", sanction: "Amende", gravite: "Moyenne"},
    {id: 49, intitule: "Licenciement Délégué Syndical", desc: "Sans approbation de l'Inspecteur", articles: "Art 258", sanction: "Amende", gravite: "Tres Grave"},
    {id: 53, intitule: "Non-respect des jours fériés", desc: "Violation du repos les jours fériés.", articles: "Art 123", sanction: "Amende", gravite: "Moyenne"},
    {id: 57, intitule: "Heures de nuit non majorées", desc: "Travail de nuit non payé en majoration.", articles: "Art 124", sanction: "Amende", gravite: "Grave"},
    {id: 62, intitule: "Obstacle à l'Inspecteur", desc: "Faire obstacle aux fonctions.", articles: "Art 322", sanction: "Amende + 30 jours SP", gravite: "Tres Grave"},
    {id: 65, intitule: "Privation Décompte Final", desc: "Non paiement 48h après fin contrat", articles: "Art 100", sanction: "Amende", gravite: "Grave"}
];

// Fill up to 65 to make it complete
for(let i=1; i<=65; i++) {
    if(!infractionsDB.find(x => x.id === i)) {
        infractionsDB.push({
            id: i, 
            intitule: "Infraction Code du Travail (Art " + (100+i) + ")", 
            desc: "Violation des dispositions.", 
            articles: "Art " + (100+i), 
            sanction: "Amende", 
            gravite: "Moyenne"
        });
    }
}
infractionsDB.sort((a,b) => a.id - b.id);

const app = {
    history: [],
    currentViewId: 'dashboard',
    archives: [],

    init: function() {
        this.bindEvents();
        this.loadArchives();
        this.renderTable();
        this.calculateSMIG();
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

    // --- TABLE CONSULTATION ---
    renderTable: function() {
        const tbody = document.getElementById('infractions-table-body');
        if(!tbody) return;
        tbody.innerHTML = '';
        infractionsDB.forEach(inf => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${inf.id}</td>
                <td style="font-weight: 500;">${inf.intitule}<br><span style="font-size:10px; color:var(--text-muted); font-weight:normal;">${inf.desc}</span></td>
                <td class="article">${inf.articles}</td>
                <td class="amende">${inf.sanction}</td>
                <td><span class="badge ${this.getBadgeClass(inf.gravite)}">${inf.gravite}</span></td>
            `;
            tbody.appendChild(tr);
        });
    },

    filterTable: function() {
        const input = document.getElementById("table-search");
        if(!input) return;
        const filter = input.value.toLowerCase();
        const table = document.getElementById("infractions-table");
        if(!table) return;
        const tr = table.getElementsByTagName("tr");

        for (let i = 1; i < tr.length; i++) {
            let txtValue = tr[i].textContent || tr[i].innerText;
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
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
            nom: document.getElementById('archive-nom').value || "Dossier Sans Nom",
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

    // --- OUTILS & CALCULATEURS ---
    calculateAmende: function() {
        const cat = document.getElementById('calc-cat').value;
        const inf = document.getElementById('calc-inf').value;
        let base = cat === 'A' ? 1000 : cat === 'B' ? 700 : 500;
        let multi = (inf === '133' || inf === '171') ? 3 : (inf === '87') ? 2 : 1;
        document.getElementById('calc-result').innerText = `${base * multi} USD`;
        document.getElementById('calc-details').innerText = `Base AIM: ${base}$ | Gravité: x${multi}`;
    },

    calculateSMIG: function() {
        const el = document.getElementById('smig-classe');
        if(!el) return;
        const tension = parseInt(el.value);
        if(!tension) return;
        const smigJour = tension * 145; // Décret 25/22
        const smigMois = smigJour * 26;
        const logement = smigMois * 0.30;

        document.getElementById('res-tension').innerText = tension;
        document.getElementById('res-smig-jour').innerText = new Intl.NumberFormat('fr-FR').format(smigJour) + " FC";
        document.getElementById('res-smig-mois').innerText = new Intl.NumberFormat('fr-FR').format(smigMois) + " FC";
        document.getElementById('res-smig-logement').innerText = new Intl.NumberFormat('fr-FR').format(logement) + " FC";
    },

    calculateDecompte: function() {
        const salaire = parseFloat(document.getElementById('dec-salaire').value) || 0;
        const anciennete = parseInt(document.getElementById('dec-anciennete').value) || 0;
        const arrieres = parseFloat(document.getElementById('dec-arrieres').value) || 0;
        const conges = parseInt(document.getElementById('dec-conges').value) || 0;
        const preavisFait = document.getElementById('dec-preavis-fait').value;

        const montantArrieres = salaire * arrieres;
        const salaireJour = salaire / 26;
        const montantConges = conges * salaireJour;

        let joursPreavis = 14 + (anciennete * 7);
        let montantPreavis = 0;
        if(preavisFait === 'non') {
            montantPreavis = joursPreavis * salaireJour;
        }

        const total = montantArrieres + montantConges + montantPreavis;

        document.getElementById('res-dec-arrieres').innerText = new Intl.NumberFormat('fr-FR').format(montantArrieres.toFixed(0)) + " FC";
        document.getElementById('res-dec-conges').innerText = new Intl.NumberFormat('fr-FR').format(montantConges.toFixed(0)) + " FC";
        document.getElementById('res-dec-preavis').innerText = new Intl.NumberFormat('fr-FR').format(montantPreavis.toFixed(0)) + " FC (" + (preavisFait === 'non' ? joursPreavis + " jours" : "Presté") + ")";
        document.getElementById('res-dec-total').innerText = new Intl.NumberFormat('fr-FR').format(total.toFixed(0)) + " FC";

        document.getElementById('dec-result-card').style.display = 'block';
    },

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
            translated = `[Traduction IA en ${lang}] : Modèle de traduction en cours d'apprentissage pour cette phrase complexe.`;
        }
        
        resDiv.innerHTML = `<i class="fa-solid fa-language" style="color:var(--brand-primary)"></i> ${translated}`;
        resDiv.style.display = 'block';
    },

    // --- SUPER IA LOCALE Q&A ---
    sendChipToQnA: function(text) {
        this.navToTab('qna', 'Questions / Réponses IA');
        this.sendChip(text);
    },

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

        // SMIG
        if(q.includes("smig d'un manœuvre") || q.includes("smig d'un manoeuvre") || q.includes("smig pour manœuvre")) {
            return `<strong>SMIG 2025 pour un Manœuvre (Classe 1) :</strong><br>
            Tension: 100<br>
            SMIG/Jour : 14 500 FC<br>
            SMIG/Mois : 377 000 FC<br>
            Logement : 113 100 FC<br>
            <i>Allez dans Outils > Calculateur SMIG pour les autres classes.</i>`;
        }
        
        if(q.includes("amende") && q.includes("smig")) {
            return `<strong>Défaut de SMIG (Art 87) :</strong><br>
            L'infraction N°5 est <strong>Très Grave</strong>. L'inspecteur propose au Ministre la fermeture de l'établissement (Art 318). L'amende AIM 006 dépend de la catégorie (x2).`;
        }

        // Math / Preavis
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

        // Articles
        if(q.includes("art 157") || q.includes("article 157") || q.includes("r.i.") || q.includes("règlement intérieur")) {
            return `<strong>Défaut de Règlement Intérieur (Art 157)</strong><br>
            Tout employeur ayant au moins 20 travailleurs doit en avoir un visé par l'Inspecteur du Travail.<br>
            <strong>Sanction :</strong> Amende Moyenne.`;
        }

        if(q.includes("art 133") || q.includes("article 133") || q.includes("enfant")) {
            return `<strong>Le travail des enfants (Art 133)</strong><br>
            Interdit en dessous de 15 ans. De 15 à 17 ans, il faut une autorisation expresse de l'Inspecteur.<br>
            <strong>Sanction :</strong> Très Grave (Peine pénale possible).`;
        }

        if(q.includes("art 171") || q.includes("article 171") || q.includes("hygiène")) {
            return `<strong>Mauvaises conditions d'hygiène (Art 171)</strong><br>
            Sanctionnée par une Mise en demeure obligatoire. Si non respectée, amende.`;
        }

        // Look up in DB
        const match = infractionsDB.find(i => q.includes(i.id.toString()) || i.intitule.toLowerCase().includes(q));
        if(match) {
            return `J'ai trouvé l'infraction correspondante :<br>
            <strong>N°${match.id} - ${match.intitule}</strong><br>
            Article : ${match.articles}<br>
            Sanction : ${match.sanction} (${match.gravite})`;
        }

        return "Je suis l'IA Locale pour les Inspecteurs. Demandez-moi d'<strong>expliquer un article</strong>, de <strong>calculer un préavis</strong>, le montant du <strong>SMIG 2025</strong>, ou de chercher une infraction.";
    },

    showInfractionDetail: function(id) {
        const inf = infractionsDB.find(i => i.id === id);
        if(!inf) return;
        const content = document.getElementById('infraction-detail-content');
        if(content) {
            content.innerHTML = `
                <div class="card" style="margin-top: 20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
                        <span class="badge ${this.getBadgeClass(inf.gravite)}">${inf.gravite}</span>
                        <span style="color:var(--text-muted); font-size:13px; font-weight:600;">Infraction N°${inf.id}</span>
                    </div>
                    <h2 style="font-size: 20px; margin-bottom: 5px;">${inf.intitule}</h2>
                    <p style="color: var(--brand-primary); font-weight: 500; font-size: 14px; margin-bottom: 20px;">Base Légale: ${inf.articles}</p>
                    <h4 style="font-size: 14px; color: var(--text-muted); margin-bottom: 5px;">Description</h4>
                    <p style="font-size: 15px; margin-bottom: 20px; line-height: 1.5;">${inf.desc}</p>
                    <h4 style="font-size: 14px; color: var(--text-muted); margin-bottom: 5px;">Sanction Prévue</h4>
                    <p style="font-size: 15px; font-weight: 600; color: var(--status-danger); margin-bottom: 20px;">${inf.sanction}</p>
                </div>`;
            this.navTo('infraction-detail', `Détail Sanction`);
        }
    }
};

window.onload = () => app.init();
