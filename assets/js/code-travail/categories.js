/**
 * categories.js
 * Rendu et filtrage par domaines juridiques / catégories du Code du Travail
 */

window.CodeTravailCategories = {
    // Liste des catégories officielles avec icônes et descriptions
    metadata: {
        "Dispositions générales": {
            icon: "fa-scale-balanced",
            desc: "Champ d'application, définitions fondamentales et droit fondamental au travail en RDC."
        },
        "Protection des enfants": {
            icon: "fa-child-reaching",
            desc: "Interdiction absolue des pires formes de travail des enfants et protection des mineurs."
        },
        "Contrat de travail": {
            icon: "fa-file-signature",
            desc: "Conclusion, forme, preuve, période d'essai, exécution et suspension du contrat de travail."
        },
        "Résiliation et Licenciement": {
            icon: "fa-user-xmark",
            desc: "Règles de préavis, motifs valables, indemnités de rupture et licenciement pour faute lourde."
        },
        "Salaire et Avantages": {
            icon: "fa-money-bill-trend-up",
            desc: "Détermination du salaire, SMIG, égalité de rémunération, périodicité et bulletin de paie."
        },
        "Durée du travail": {
            icon: "fa-clock",
            desc: "Semaine légale de 45 heures, heures supplémentaires, travail de nuit et majorations."
        },
        "Congés et Repos": {
            icon: "fa-umbrella-beach",
            desc: "Congé annuel payé, jours fériés légaux, repos hebdomadaire et pécule de vacances."
        },
        "Protection de la femme et de la maternité": {
            icon: "fa-person-breastfeeding",
            desc: "Congé de maternité de 14 semaines, protection de l'emploi et heures d'allaitement."
        },
        "Sécurité et santé au travail": {
            icon: "fa-user-shield",
            desc: "Obligations d'hygiène, équipements de protection (EPI), médecine du travail et accidents."
        },
        "Syndicats et Représentation": {
            icon: "fa-users-between-lines",
            desc: "Liberté syndicale, élections des délégués syndicaux et protection spéciale contre le licenciement."
        },
        "Inspection du Travail": {
            icon: "fa-user-tie",
            desc: "Missions, pouvoirs de visite, contrôles et procès-verbaux des Inspecteurs du Travail."
        },
        "Différends et Conflits": {
            icon: "fa-gavel",
            desc: "Conciliation préalable obligatoire devant l'Inspecteur, Tribunal du Travail et grève licite."
        },
        "Sanctions et Pénalités": {
            icon: "fa-triangle-exclamation",
            desc: "Amendes pénales et administratives, servitude pénale, récidive et dispositions transitoires."
        }
    },

    render: function() {
        const grid = document.getElementById("categoriesGrid");
        if (!grid) return;

        grid.innerHTML = "";
        const articles = window.CodeTravailState.articles;
        
        // Regrouper par catégorie
        const counts = {};
        articles.forEach(art => {
            const cat = art.categorie || "Autres dispositions";
            counts[cat] = (counts[cat] || 0) + 1;
        });

        Object.keys(counts).forEach(cat => {
            const meta = this.metadata[cat] || {
                icon: "fa-folder-open",
                desc: "Articles et dispositions légales de cette catégorie juridique."
            };

            const card = document.createElement("div");
            card.className = "category-card fade-in";
            card.innerHTML = `
                <i class="fa-solid ${meta.icon}"></i>
                <h3>${window.InspecteurUtils.escapeHtml(cat)}</h3>
                <p>${window.InspecteurUtils.escapeHtml(meta.desc)}</p>
                <span class="category-badge">${counts[cat]} article(s)</span>
            `;

            card.addEventListener("click", () => {
                this.selectCategory(cat);
            });

            grid.appendChild(card);
        });
    },

    selectCategory: function(cat) {
        // Mettre en évidence la catégorie dans la grille
        const cards = document.querySelectorAll(".category-card");
        cards.forEach(c => {
            if (c.querySelector("h3") && c.querySelector("h3").textContent === cat) {
                c.classList.add("active");
            } else {
                c.classList.remove("active");
            }
        });

        window.CodeTravailState.currentCategory = cat;

        // Filtrer et afficher les résultats dans le moteur de recherche
        const results = window.CodeTravailState.articles.filter(art => art.categorie === cat);
        if (window.CodeTravailRecherche && window.CodeTravailRecherche.renderResults) {
            window.CodeTravailRecherche.renderResults(results, "");
        }

        // Mettre à jour l'info dans la section consultation
        const infoCat = document.getElementById("infoCategorie");
        const infoResultats = document.getElementById("infoResultats");
        if (infoCat) infoCat.textContent = cat;
        if (infoResultats) infoResultats.textContent = `${results.length} article(s)`;

        // Afficher directement le premier article de cette catégorie
        if (results.length > 0 && window.CodeTravailConsultation) {
            const idx = window.CodeTravailState.articles.indexOf(results[0]);
            window.CodeTravailConsultation.showArticle(idx);
            const cardEl = document.getElementById("articleCard");
            if (cardEl) cardEl.scrollIntoView({ behavior: "smooth" });
        }

        if (window.InspecteurUtils) {
            window.InspecteurUtils.showNotification(`Catégorie sélectionnée : ${cat}`, "fa-folder-open");
        }
    }
};
