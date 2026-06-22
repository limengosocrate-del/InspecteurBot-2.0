/*==============================
      DATE ET HEURE
===============================*/

function afficherDate() {
    const date = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    document.getElementById("dateActuelle").innerHTML =
        date.toLocaleDateString("fr-FR", options);
}

afficherDate();

/*==============================
      ANIMATION DES CHIFFRES
===============================*/

const nombres = document.querySelectorAll(".card h1");

nombres.forEach(nombre => {

    let debut = 0;
    let fin = parseInt(nombre.innerText);

    const vitesse = fin / 100;

    const compteur = setInterval(() => {

        debut += vitesse;

        if (debut >= fin) {
            nombre.innerText = fin;
            clearInterval(compteur);
        }
        else {
            nombre.innerText = Math.floor(debut);
        }

    }, 15);

});

/*==============================
      ANIMATION DES CARTES
===============================*/

const cartes = document.querySelectorAll(
    ".card, .quick-card, .chart-box"
);

cartes.forEach((carte, index) => {

    carte.style.opacity = "0";
    carte.style.transform = "translateY(40px)";

    setTimeout(() => {

        carte.style.transition = ".7s";

        carte.style.opacity = "1";
        carte.style.transform = "translateY(0)";

    }, index * 150);

});
