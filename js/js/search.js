"use strict";

/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 search.js
 Moteur de recherche intelligent
===================================================*/

let searchHistory = [];

/*==================================================
 INITIALISATION
===================================================*/

function initSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );

    if (!input) return;

    searchHistory =
        Storage.get("searchHistory") || [];

    input.addEventListener(
        "input",
        function () {

            searchCards(this.value);

        }
    );

    input.addEventListener(
        "keydown",
        function (e) {

            if (e.key === "Enter") {

                saveSearch(this.value);

            }

        }
    );

}

/*==================================================
 RECHERCHE
===================================================*/

function searchCards(text) {

    const value =
        text
        .toLowerCase()
        .trim();

    const cards =
        document.querySelectorAll(
            ".card"
        );

    let count = 0;

    cards.forEach(card => {

        const content =
            card.innerText.toLowerCase();

        if (
            value === "" ||
            content.includes(value)
        ) {

            card.style.display = "";

            count++;

        }

        else {

            card.style.display = "none";

        }

    });

    updateSearchCount(count);

}

/*==================================================
 HISTORIQUE
===================================================*/

function saveSearch(text) {

    text = text.trim();

    if (!text) return;

    searchHistory.unshift(text);

    searchHistory =
        [...new Set(searchHistory)]
        .slice(0, 20);

    Storage.save(
        "searchHistory",
        searchHistory
    );

}

/*==================================================
 COMPTEUR
===================================================*/

function updateSearchCount(number) {

    let counter =
        document.getElementById(
            "searchCounter"
        );

    if (!counter) {

        counter =
            document.createElement(
                "span"
            );

        counter.id =
            "searchCounter";

        const toolbar =
            document.querySelector(
                ".top-toolbar"
            );

        if (toolbar) {

            toolbar.appendChild(
                counter
            );

        }

    }

    counter.textContent =
        "Résultats : " + number;

}

/*==================================================
 RACCOURCI CTRL+F
===================================================*/

document.addEventListener(
    "keydown",
    function (e) {

        if (
            e.ctrlKey &&
            e.key.toLowerCase() === "f"
        ) {

            e.preventDefault();

            const input =
                document.getElementById(
                    "searchInput"
                );

            if (input) {

                input.focus();

            }

        }

    }
);

/*==================================================
 EXPORT GLOBAL
===================================================*/

window.globalSearch = searchCards;

/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
    "DOMContentLoaded",
    initSearch
);
