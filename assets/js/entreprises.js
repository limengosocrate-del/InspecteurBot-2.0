/*=========================================================
 INSPECTEURBOT RDC
 ENTREPRISES.JS
 PARTIE 1
 Initialisation Générale
 Version Professionnelle 2026
=========================================================*/

"use strict";

/*=========================================================
 HORLOGE - DATE - HEURE
=========================================================*/

function updateDateTime(){

    const maintenant = new Date();

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

    const heure =
    maintenant.toLocaleTimeString("fr-FR",{
        hour:"2-digit",
        minute:"2-digit"
    });

    document.getElementById("clock").textContent = heure;

    document.getElementById("day").textContent =
    jours[maintenant.getDay()];

    document.getElementById("date").textContent =
    maintenant.getDate()+" "+
    mois[maintenant.getMonth()]+" "+
    maintenant.getFullYear();

}

updateDateTime();

setInterval(updateDateTime,1000);

/*=========================================================
 METEO
=========================================================*/

document.getElementById("temperature").textContent="26°C";

document.getElementById("city").textContent="Kinshasa";

/*=========================================================
 BASE DE DONNÉES
=========================================================*/

let entreprises =
JSON.parse(localStorage.getItem("entreprises")) || [];

/*=========================================================
 NOTIFICATION
=========================================================*/

function notification(message,type="success"){

    const boite =
    document.createElement("div");

    boite.className="msg";

    boite.innerHTML=message;

    if(type==="error"){

        boite.style.background="#d63031";

    }

    if(type==="warning"){

        boite.style.background="#f39c12";

    }

    document.body.appendChild(boite);

    setTimeout(function(){

        boite.remove();

    },3000);

}

/*=========================================================
 SAUVEGARDE AUTOMATIQUE
=========================================================*/

function sauvegarder(){

    localStorage.setItem(
        "entreprises",
        JSON.stringify(entreprises)
    );

}

window.addEventListener("beforeunload",sauvegarder);

/*=========================================================
 OUTILS
=========================================================*/

function genererNumero(){

    return "IGT-"+Date.now();

}

function dateAujourdhui(){

    return new Date().toLocaleDateString("fr-FR");

}

/*=========================================================
 VÉRIFICATION DES ÉLÉMENTS HTML
=========================================================*/

const formulaire =
document.getElementById("entrepriseForm");

const tableau =
document.getElementById("tableEntreprise");

const recherche =
document.getElementById("search");

/*=========================================================
 FIN PARTIE 1
=========================================================*/

/*=========================================================
 INSPECTEURBOT RDC
 ENTREPRISES.JS
 PARTIE 2
 Gestion du Formulaire Entreprise
=========================================================*/

/*=========================================================
 ENREGISTREMENT D'UNE ENTREPRISE
=========================================================*/

if(formulaire){

formulaire.addEventListener("submit",enregistrerEntreprise);

}

function enregistrerEntreprise(e){

e.preventDefault();

/*==========================
 RÉCUPÉRATION DES CHAMPS
==========================*/

const entreprise={

id:Date.now(),

numero:genererNumero(),

dateCreation:dateAujourdhui(),

nom:document.getElementById("nom").value.trim(),

rccm:document.getElementById("rccm").value.trim(),

idnat:document.getElementById("idnat").value.trim(),

impot:document.getElementById("impot").value.trim(),

cnss:document.getElementById("cnss").value.trim(),

directeur:document.getElementById("directeur").value.trim(),

travailleurs:Number(document.getElementById("travailleurs").value)||0,

telephone:document.getElementById("telephone").value.trim(),

email:document.getElementById("email").value.trim(),

province:document.getElementById("province").value.trim(),

ville:document.getElementById("ville").value.trim(),

adresse:document.getElementById("adresse").value.trim(),

secteur:document.getElementById("secteur").value,

statut:document.getElementById("statut").value,

observation:document.getElementById("observation").value.trim()

};

/*==========================
 VALIDATION
==========================*/

if(entreprise.nom===""){

notification("Veuillez saisir le nom de l'entreprise.","warning");

return;

}

if(entreprise.province===""){

notification("Veuillez saisir la province.","warning");

return;

}

/*==========================
 RCCM UNIQUE
==========================*/

const existe=entreprises.find(function(item){

return item.rccm!=="" &&
item.rccm===entreprise.rccm;

});

if(existe){

notification("Cette entreprise existe déjà.","error");

return;

}

/*==========================
 ENREGISTREMENT
==========================*/

entreprises.push(entreprise);

sauvegarder();

afficherEntreprises();

actualiserStatistiques();

notification("Entreprise enregistrée avec succès.");

viderFormulaire();

}

/*=========================================================
 NOUVEAU FORMULAIRE
=========================================================*/

function viderFormulaire(){

formulaire.reset();

window.scrollTo({

top:0,

behavior:"smooth"

});

}

/*=========================================================
 MODIFIER UNE ENTREPRISE
=========================================================*/

function modifierEntreprise(id){

const entreprise=

entreprises.find(function(item){

return item.id===id;

});

if(!entreprise){

return;

}

document.getElementById("nom").value=entreprise.nom;
document.getElementById("rccm").value=entreprise.rccm;
document.getElementById("idnat").value=entreprise.idnat;
document.getElementById("impot").value=entreprise.impot;
document.getElementById("cnss").value=entreprise.cnss;
document.getElementById("directeur").value=entreprise.directeur;
document.getElementById("travailleurs").value=entreprise.travailleurs;
document.getElementById("telephone").value=entreprise.telephone;
document.getElementById("email").value=entreprise.email;
document.getElementById("province").value=entreprise.province;
document.getElementById("ville").value=entreprise.ville;
document.getElementById("adresse").value=entreprise.adresse;
document.getElementById("secteur").value=entreprise.secteur;
document.getElementById("statut").value=entreprise.statut;
document.getElementById("observation").value=entreprise.observation;

entreprises=

entreprises.filter(function(item){

return item.id!==id;

});

sauvegarder();

afficherEntreprises();

notification("Modification en cours...");

window.scrollTo({

top:0,

behavior:"smooth"

});

}

/*=========================================================
 SUPPRIMER UNE ENTREPRISE
=========================================================*/

function supprimerEntreprise(id){

if(!confirm("Voulez-vous supprimer cette entreprise ?")){

return;

}

entreprises=

entreprises.filter(function(item){

return item.id!==id;

});

sauvegarder();

afficherEntreprises();

actualiserStatistiques();

notification("Entreprise supprimée.");

}

/*=========================================================
 FIN PARTIE 2
=========================================================*/

/*=========================================================
 INSPECTEURBOT RDC
 ENTREPRISES.JS
 PARTIE 3
 Tableau - Statistiques - Recherche
 Version Professionnelle 2026
=========================================================*/

/*=========================================================
 AFFICHAGE DES ENTREPRISES
=========================================================*/

function afficherEntreprises(liste = entreprises){

if(!tableau){
return;
}

tableau.innerHTML="";

if(liste.length===0){

tableau.innerHTML=`

<tr>

<td colspan="6" style="text-align:center;padding:30px;">

Aucune entreprise enregistrée.

</td>

</tr>

`;

return;

}

liste.forEach(function(entreprise,index){

tableau.innerHTML+=`

<tr>

<td>${index+1}</td>

<td>${entreprise.nom}</td>

<td>${entreprise.province}</td>

<td>${entreprise.secteur}</td>

<td>

<span class="badge">

${entreprise.statut}

</span>

</td>

<td>

<button
onclick="modifierEntreprise(${entreprise.id})"
title="Modifier">

<i class="fa-solid fa-pen"></i>

</button>

<button
onclick="supprimerEntreprise(${entreprise.id})"
title="Supprimer">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

});

}

/*=========================================================
 STATISTIQUES
=========================================================*/

function actualiserStatistiques(){

let totalEntreprise=entreprises.length;

let totalTravailleurs=0;

let actives=0;

let suspendues=0;

entreprises.forEach(function(item){

totalTravailleurs+=Number(item.travailleurs)||0;

if(item.statut==="Active"){

actives++;

}

if(item.statut==="Suspendue"){

suspendues++;

}

});

document.getElementById("totalEntreprise").textContent=
totalEntreprise;

document.getElementById("totalTravailleurs").textContent=
totalTravailleurs;

document.getElementById("entrepriseActive").textContent=
actives;

document.getElementById("entrepriseSuspendue").textContent=
suspendues;

}

/*=========================================================
 RECHERCHE INSTANTANÉE
=========================================================*/

if(recherche){

recherche.addEventListener("keyup",function(){

const texte=this.value
.toLowerCase()
.trim();

const resultat=

entreprises.filter(function(item){

return(

item.nom.toLowerCase().includes(texte)||

item.province.toLowerCase().includes(texte)||

item.ville.toLowerCase().includes(texte)||

item.directeur.toLowerCase().includes(texte)||

item.secteur.toLowerCase().includes(texte)||

item.statut.toLowerCase().includes(texte)

);

});

afficherEntreprises(resultat);

});

}

/*=========================================================
 TRI ALPHABÉTIQUE
=========================================================*/

function trierEntreprises(){

entreprises.sort(function(a,b){

return a.nom.localeCompare(b.nom);

});

sauvegarder();

afficherEntreprises();

}

/*=========================================================
 ACTUALISATION
=========================================================*/

function actualiser(){

entreprises=

JSON.parse(

localStorage.getItem("entreprises")

)||[];

afficherEntreprises();

actualiserStatistiques();

}

/*=========================================================
 CHARGEMENT INITIAL
=========================================================*/

actualiser();

/*=========================================================
 FIN PARTIE 3
=========================================================*/


/*=========================================================
 INSPECTEURBOT RDC
 ENTREPRISES.JS
 PARTIE 4
 Impression - Export - Sauvegarde
 Version Professionnelle 2026
=========================================================*/

/*=========================================================
 IMPRESSION
=========================================================*/

function imprimerEntreprise(){

window.print();

}

/*=========================================================
 EXPORT PDF
=========================================================*/

function exporterPDF(){

notification(
"📄 Export PDF disponible dans la prochaine mise à jour."
);

}

/*=========================================================
 EXPORT EXCEL
=========================================================*/

function exporterExcel(){

notification(
"📊 Export Excel disponible dans la prochaine mise à jour."
);

}

/*=========================================================
 GÉNÉRATION QR CODE
=========================================================*/

function genererQRCode(){

notification(
"📱 Génération du QR Code disponible prochainement."
);

}

/*=========================================================
 EXPORT JSON
=========================================================*/

function exporterJSON(){

const donnees=
JSON.stringify(
entreprises,
null,
2
);

const blob=
new Blob(
[donnees],
{
type:"application/json"
}
);

const lien=
document.createElement("a");

lien.href=
URL.createObjectURL(blob);

lien.download=
"Entreprises_IGT_RDC.json";

lien.click();

notification(
"✅ Sauvegarde JSON terminée."
);

}

/*=========================================================
 IMPORT JSON
=========================================================*/

function importerJSON(fichier){

const lecteur=
new FileReader();

lecteur.onload=function(e){

try{

entreprises=
JSON.parse(e.target.result);

sauvegarder();

afficherEntreprises();

actualiserStatistiques();

notification(
"✅ Données importées avec succès."
);

}catch{

notification(
"❌ Fichier JSON invalide.",
"error"
);

}

};

lecteur.readAsText(fichier);

}

/*=========================================================
 ACTUALISER LES DONNÉES
=========================================================*/

function actualiserDonnees(){

entreprises=
JSON.parse(
localStorage.getItem("entreprises")
)||[];

afficherEntreprises();

actualiserStatistiques();

notification(
"🔄 Données actualisées."
);

}

/*=========================================================
 SUPPRIMER TOUTES LES ENTREPRISES
=========================================================*/

function supprimerToutesLesEntreprises(){

if(!confirm(
"Voulez-vous supprimer toutes les entreprises ?"
)){

return;

}

entreprises=[];

sauvegarder();

afficherEntreprises();

actualiserStatistiques();

notification(
"🗑️ Toutes les entreprises ont été supprimées."
);

}

/*=========================================================
 ACTUALISATION AUTOMATIQUE
=========================================================*/

window.addEventListener(

"storage",

function(){

actualiserDonnees();

}

);

/*=========================================================
 FIN PARTIE 4
=========================================================*/

/*=========================================================
 INSPECTEURBOT RDC
 ENTREPRISES.JS
 PARTIE 5
 Fonctions Utilitaires
 Version Professionnelle 2026
=========================================================*/

/*=========================================================
 SAUVEGARDE DES DONNÉES
=========================================================*/

function sauvegarder(){

localStorage.setItem(

"entreprises",

JSON.stringify(entreprises)

);

}

/*=========================================================
 GÉNÉRATION DU NUMÉRO IGT
=========================================================*/

function genererNumero(){

const numero=

entreprises.length+1;

return "IGT-"+

String(numero)

.padStart(5,"0");

}

/*=========================================================
 DATE DU JOUR
=========================================================*/

function dateAujourdhui(){

const maintenant=

new Date();

return maintenant

.toLocaleDateString(

"fr-FR"

);

}

/*=========================================================
 NOTIFICATION
=========================================================*/

function notification(

message,

type="success"

){

const ancienne=

document.querySelector(".msg");

if(ancienne){

ancienne.remove();

}

const boite=

document.createElement("div");

boite.className="msg";

if(type==="error"){

boite.style.background="#d32f2f";

}

if(type==="warning"){

boite.style.background="#ff9800";

}

if(type==="success"){

boite.style.background="#198754";

}

boite.innerHTML=message;

document.body.appendChild(boite);

setTimeout(function(){

boite.remove();

},3000);

}

/*=========================================================
 FORMAT NOMBRE
=========================================================*/

function formatNombre(nombre){

return Number(nombre)

.toLocaleString("fr-FR");

}

/*=========================================================
 TOTAL DES ENTREPRISES
=========================================================*/

function totalEntreprises(){

return entreprises.length;

}

/*=========================================================
 TOTAL DES TRAVAILLEURS
=========================================================*/

function totalTravailleurs(){

let total=0;

entreprises.forEach(function(item){

total+=

Number(item.travailleurs)||0;

});

return total;

}

/*=========================================================
 TOTAL ACTIVES
=========================================================*/

function totalActives(){

return entreprises.filter(

function(item){

return item.statut==="Active";

}

).length;

}

/*=========================================================
 TOTAL SUSPENDUES
=========================================================*/

function totalSuspendues(){

return entreprises.filter(

function(item){

return item.statut==="Suspendue";

}

).length;

}

/*=========================================================
 RAFRAÎCHISSEMENT COMPLET
=========================================================*/

function rafraichir(){

afficherEntreprises();

actualiserStatistiques();

}

/*=========================================================
 VERSION
=========================================================*/

console.log(

"InspecteurBot RDC",

"Version Professionnelle 2026",

"Module Entreprises chargé avec succès."

);

/*=========================================================
 FIN PARTIE 5
=========================================================*/

/*=========================================================
 INSPECTEURBOT RDC
 ENTREPRISES.JS
 PARTIE 6
 Initialisation Finale
 Version Professionnelle 2026
=========================================================*/

/*=========================================================
 CHARGEMENT INITIAL
=========================================================*/

document.addEventListener("DOMContentLoaded",function(){

/* Chargement des données */

entreprises=

JSON.parse(

localStorage.getItem("entreprises")

)||[];

/* Affichage */

afficherEntreprises();

actualiserStatistiques();

/* Heure */

updateDateTime();

setInterval(updateDateTime,1000);

/*=========================================================
 BOUTON NOUVEAU
=========================================================*/

const boutonNouveau=

document.querySelector(

'button[onclick="viderFormulaire()"]'

);

if(boutonNouveau){

boutonNouveau.addEventListener(

"click",

function(){

viderFormulaire();

}

);

}

/*=========================================================
 RECHERCHE
=========================================================*/

if(recherche){

recherche.addEventListener(

"input",

function(){

const texte=

this.value

.toLowerCase()

.trim();

const resultat=

entreprises.filter(function(item){

return(

item.nom.toLowerCase().includes(texte)||

item.province.toLowerCase().includes(texte)||

item.ville.toLowerCase().includes(texte)||

item.directeur.toLowerCase().includes(texte)||

item.secteur.toLowerCase().includes(texte)||

item.statut.toLowerCase().includes(texte)

);

});

afficherEntreprises(resultat);

}

);

}

/*=========================================================
 MESSAGE DE BIENVENUE
=========================================================*/

notification(

"Bienvenue dans le module Gestion des Entreprises."

);

});

/*=========================================================
 SAUVEGARDE AVANT FERMETURE
=========================================================*/

window.addEventListener(

"beforeunload",

function(){

sauvegarder();

}

);

/*=========================================================
 GESTION DES ERREURS
=========================================================*/

window.onerror=function(){

notification(

"Une erreur est survenue.",

"error"

);

};

/*=========================================================
 RAFRAÎCHISSEMENT AUTOMATIQUE
=========================================================*/

setInterval(function(){

actualiserStatistiques();

},5000);

/*=========================================================
 FIN DU FICHIER
=========================================================*/

console.log(

"========================================"

);

console.log(

" InspecteurBot RDC"

);

console.log(

" Module : Gestion des Entreprises"

);

console.log(

" Version : Professionnelle 2026"

);

console.log(

" Statut : Chargé avec succès"

);

console.log(

"========================================"

);

