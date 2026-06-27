/* ==========================================
   INSPECTEURBOT RDC
   ENTREPRISES.JS
   PARTIE 1
========================================== */

/* ========= HORLOGE ========= */

function updateDateTime(){

const now = new Date();

const jours = [
"Dimanche",
"Lundi",
"Mardi",
"Mercredi",
"Jeudi",
"Vendredi",
"Samedi"
];

const mois = [
"Janvier",
"Février",
"Mars",
"Avril",
"Mai",
"Juin",
"Juillet",
"Août",
"Septembre",
"Octobre",
"Novembre",
"Décembre"
];

document.getElementById("clock").innerHTML =
now.toLocaleTimeString("fr-FR",{
hour:"2-digit",
minute:"2-digit"
});

document.getElementById("day").innerHTML =
jours[now.getDay()];

document.getElementById("date").innerHTML =
now.getDate()+" "+
mois[now.getMonth()]+" "+
now.getFullYear();

}

updateDateTime();
setInterval(updateDateTime,1000);

/* ========= METEO ========= */

document.getElementById("temperature").innerHTML = "26°C";
document.getElementById("city").innerHTML = "Kinshasa";

/* ========= INSPECTEUR / CONTRÔLEUR ========= */

localStorage.removeItem("currentUser");

const nomUtilisateur = "";

const champInspecteur =
document.getElementById("nomInspecteur");

if(champInspecteur){
    champInspecteur.value = "";
}

const footerInspecteur =
document.getElementById("nomInspecteurFooter");

if(footerInspecteur){
    footerInspecteur.innerHTML =
    "Nom de l'Inspecteur / Contrôleur";
}

/* ========= BASE DE DONNÉES ========= */

let entreprises =
JSON.parse(localStorage.getItem("entreprises")) || [];

/* ========= NOTIFICATION ========= */

function notification(message){

const notif = document.createElement("div");

notif.className = "msg";

notif.innerHTML = message;

document.body.appendChild(notif);

setTimeout(function(){

notif.remove();

},3000);

}

/* ========= FORMULAIRE ========= */

const form =
document.getElementById("entrepriseForm");

form.addEventListener("submit",function(e){

e.preventDefault();

/* ===== Vérification RCCM ===== */

const rccm =
document.getElementById("rccm").value.trim();

const existe =
entreprises.find(function(item){

return item.rccm === rccm;

});

if(existe){

notification("⚠ Cette entreprise existe déjà.");

return;

}

/* ===== Création de l'entreprise ===== */

const entreprise = {

id: Date.now(),

numero: "IGT-"+Date.now(),

dateCreation:
new Date().toLocaleDateString("fr-FR"),

nom:
document.getElementById("nom").value,

rccm:
document.getElementById("rccm").value,

idnat:
document.getElementById("idnat").value,

impot:
document.getElementById("impot").value,

cnss:
document.getElementById("cnss").value,

directeur:
document.getElementById("directeur").value,

travailleurs:
document.getElementById("travailleurs").value,

telephone:
document.getElementById("telephone").value,

email:
document.getElementById("email").value,

province:
document.getElementById("province").value,

ville:
document.getElementById("ville").value,

adresse:
document.getElementById("adresse").value,

secteur:
document.getElementById("secteur").value,

statut:
document.getElementById("statut").value,

observation:
document.getElementById("observation").value,

inspecteur: nomUtilisateur

};

entreprises.push(entreprise);

localStorage.setItem(
"entreprises",
JSON.stringify(entreprises)
);

notification("✅ Entreprise enregistrée avec succès.");

form.reset();

afficherEntreprises();

});

/* ========= SAUVEGARDE ========= */

window.onbeforeunload = function(){

localStorage.setItem(
"entreprises",
JSON.stringify(entreprises)

);

};

/* ==========================================
   AFFICHAGE DES ENTREPRISES
========================================== */

function afficherEntreprises(liste = entreprises){

const table =
document.getElementById("tableEntreprise");

table.innerHTML = "";

let totalTravailleurs = 0;
let actives = 0;
let suspendues = 0;

liste.forEach(function(e){

totalTravailleurs +=
Number(e.travailleurs || 0);

if(e.statut === "Active"){

actives++;

}

if(e.statut === "Suspendue"){

suspendues++;

}

table.innerHTML += `

<tr>

<td>${e.numero}</td>

<td>${e.nom}</td>

<td>${e.province}</td>

<td>${e.secteur}</td>

<td>${e.travailleurs}</td>

<td>${e.statut}</td>

<td>

<button onclick="modifierEntreprise(${e.id})">

<i class="fa fa-pen"></i>

</button>

<button onclick="supprimerEntreprise(${e.id})">

<i class="fa fa-trash"></i>

</button>

</td>

</tr>

`;

});

/* ========= STATISTIQUES ========= */

document.getElementById("totalEntreprise").innerHTML =
liste.length;

document.getElementById("totalTravailleurs").innerHTML =
totalTravailleurs;

document.getElementById("entrepriseActive").innerHTML =
actives;

document.getElementById("entrepriseSuspendue").innerHTML =
suspendues;

}

/* ==========================================
   RECHERCHE INSTANTANÉE
========================================== */

const recherche =
document.getElementById("search");

if(recherche){

recherche.addEventListener("keyup",function(){

const texte =
this.value.toLowerCase();

const resultat =
entreprises.filter(function(e){

return(

e.nom.toLowerCase().includes(texte) ||

e.province.toLowerCase().includes(texte) ||

e.ville.toLowerCase().includes(texte) ||

e.directeur.toLowerCase().includes(texte) ||

e.secteur.toLowerCase().includes(texte)

);

});

afficherEntreprises(resultat);

});

}

/* ==========================================
   CHARGEMENT INITIAL
========================================== */

afficherEntreprises();

/* ==========================================
   MODIFIER UNE ENTREPRISE
========================================== */

function modifierEntreprise(id){

const entreprise =
entreprises.find(e => e.id === id);

if(!entreprise){

return;

}

document.getElementById("nom").value = entreprise.nom;
document.getElementById("rccm").value = entreprise.rccm;
document.getElementById("idnat").value = entreprise.idnat;
document.getElementById("impot").value = entreprise.impot;
document.getElementById("cnss").value = entreprise.cnss;
document.getElementById("directeur").value = entreprise.directeur;
document.getElementById("travailleurs").value = entreprise.travailleurs;
document.getElementById("telephone").value = entreprise.telephone;
document.getElementById("email").value = entreprise.email;
document.getElementById("province").value = entreprise.province;
document.getElementById("ville").value = entreprise.ville;
document.getElementById("adresse").value = entreprise.adresse;
document.getElementById("secteur").value = entreprise.secteur;
document.getElementById("statut").value = entreprise.statut;
document.getElementById("observation").value = entreprise.observation;

entreprises =
entreprises.filter(e => e.id !== id);

localStorage.setItem(
"entreprises",
JSON.stringify(entreprises)
);

afficherEntreprises();

window.scrollTo({

top:0,

behavior:"smooth"

});

notification("✏️ Modification en cours...");

}

/* ==========================================
   SUPPRIMER UNE ENTREPRISE
========================================== */

function supprimerEntreprise(id){

if(!confirm("Voulez-vous vraiment supprimer cette entreprise ?")){

return;

}

entreprises =
entreprises.filter(e => e.id !== id);

localStorage.setItem(
"entreprises",
JSON.stringify(entreprises)
);

afficherEntreprises();

notification("🗑️ Entreprise supprimée avec succès.");

}

/* ==========================================
   NOUVEAU FORMULAIRE
========================================== */

function viderFormulaire(){

    document.getElementById("entrepriseForm").reset();

    document.getElementById("nomInspecteur").value = "";

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

    notification("🆕 Nouveau formulaire prêt.");
}

/* ==========================================
   IMPRESSION
========================================== */

function imprimerEntreprise(){

window.print();

}

/* ==========================================
   EXPORT PDF
========================================== */

function exporterPDF(){

notification("📄 Export PDF disponible dans la prochaine version.");

}

/* ==========================================
   EXPORT EXCEL
========================================== */

function exporterExcel(){

notification("📊 Export Excel disponible dans la prochaine version.");

}

/* ==========================================
   QR CODE
========================================== */

function genererQRCode(){

notification("📱 QR Code disponible dans la prochaine version.");

}

/* ==========================================
   EXPORT JSON
========================================== */

function sauvegarderJSON(){

const data =
JSON.stringify(entreprises,null,2);

const blob =
new Blob([data],{
type:"application/json"
});

const lien =
document.createElement("a");

lien.href =
URL.createObjectURL(blob);

lien.download =
"Entreprises_IGT.json";

lien.click();

notification("✅ Sauvegarde terminée.");

}

/* ==========================================
   NOMBRE TOTAL
========================================== */

function totalEntreprises(){

return entreprises.length;

}

/* ==========================================
   TOTAL TRAVAILLEURS
========================================== */

function totalTravailleurs(){

let total = 0;

entreprises.forEach(function(e){

total += Number(e.travailleurs || 0);

});

return total;

}

/* ==========================================
   ENTREPRISES ACTIVES
========================================== */

function totalActives(){

return entreprises.filter(function(e){

return e.statut === "Active";

}).length;

}

/* ==========================================
   ENTREPRISES SUSPENDUES
========================================== */

function totalSuspendues(){

return entreprises.filter(function(e){

return e.statut === "Suspendue";

}).length;

}

/* ==========================================
   ACTUALISATION DES CARTES
========================================== */

function actualiserStatistiques(){

document.getElementById("totalEntreprise").innerHTML =
totalEntreprises();

document.getElementById("totalTravailleurs").innerHTML =
totalTravailleurs();

document.getElementById("entrepriseActive").innerHTML =
totalActives();

document.getElementById("entrepriseSuspendue").innerHTML =
totalSuspendues();

}

actualiserStatistiques();

/* ==========================================
   VERSION
========================================== */

console.log(
"InspecteurBot RDC - Entreprises v1.0 chargé avec succès."
);

/* ==========================================
   PARTIE 5
   EXPORTS PROFESSIONNELS
========================================== */

/* ========= EXPORT PDF ========= */

function exporterPDF(){

notification("📄 Fonction PDF en préparation.");

}

/* ========= EXPORT EXCEL ========= */

function exporterExcel(){

notification("📊 Fonction Excel en préparation.");

}

/* ========= QR CODE ========= */

function genererQRCode(){

notification("📱 Fonction QR Code en préparation.");

}

/* ========= IMPRESSION ========= */

function imprimerEntreprise(){

window.print();

}

/* ========= RAFRAÎCHIR ========= */

function actualiser(){

entreprises =
JSON.parse(localStorage.getItem("entreprises")) || [];

afficherEntreprises();

notification("🔄 Données actualisées.");

}
