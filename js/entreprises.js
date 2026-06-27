/* ==========================================
   INSPECTEURBOT RDC
   ENTREPRISES.JS
========================================== */

/* ========= HORLOGE ========= */

function updateDateTime(){

const now=new Date();

const jours=[
"Dimanche",
"Lundi",
"Mardi",
"Mercredi",
"Jeudi",
"Vendredi",
"Samedi"
];

const mois=[
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

document.getElementById("clock").innerHTML=
now.toLocaleTimeString("fr-FR",{
hour:"2-digit",
minute:"2-digit"
});

document.getElementById("day").innerHTML=
jours[now.getDay()];

document.getElementById("date").innerHTML=
now.getDate()+" "+
mois[now.getMonth()]+" "+
now.getFullYear();

}

updateDateTime();

setInterval(updateDateTime,1000);

/* ========= METEO ========= */

document.getElementById("temperature").innerHTML="26°C";
document.getElementById("city").innerHTML="Kinshasa";

/* ========= NOM INSPECTEUR ========= */

document.getElementById("nomInspecteur").innerHTML=
localStorage.getItem("currentUser")
||"Inspecteur";

/* ========= BASE ========= */

let entreprises=
JSON.parse(
localStorage.getItem("entreprises")
)||[];

/* ========= ENREGISTREMENT ========= */

const form=
document.getElementById("entrepriseForm");

form.addEventListener("submit",function(e){

e.preventDefault();

const entreprise={

dateCreation:new Date().toLocaleDateString("fr-FR"),
id:Date.now(),

numero:"IGT-"+Date.now(),

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

inspecteur:
localStorage.getItem("currentUser")

const existe = entreprises.find(e=>e.rccm===entreprise.rccm);

if(existe){

notification("⚠ Cette entreprise existe déjà.");

return;

}

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

function notification(message){

const notif=document.createElement("div");

notif.className="msg";

notif.innerHTML=message;

document.body.appendChild(notif);

setTimeout(()=>{
notif.remove();
},3000);

}

window.onbeforeunload=function(){

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

liste.forEach((e)=>{

totalTravailleurs += Number(e.travailleurs || 0);

if(e.statut==="Active") actives++;
if(e.statut==="Suspendue") suspendues++;

table.innerHTML += `

<tr>

<td>${e.nom}</td>

<td>${e.province}</td>

<td>${e.secteur}</td>

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

document.getElementById("totalEntreprise").innerHTML =
liste.length;

document.getElementById("totalTravailleurs").innerHTML =
totalTravailleurs;

document.getElementById("entrepriseActive").innerHTML =
actives;

document.getElementById("entrepriseSuspendue").innerHTML =
suspendues;

/* ==========================================
   RECHERCHE INSTANTANÉE
========================================== */

document.getElementById("search")
.addEventListener("keyup",function(){

const texte =
this.value.toLowerCase();

const resultat =
entreprises.filter(function(e){

return (

e.nom.toLowerCase().includes(texte) ||

e.province.toLowerCase().includes(texte) ||

e.ville.toLowerCase().includes(texte) ||

e.directeur.toLowerCase().includes(texte) ||

e.secteur.toLowerCase().includes(texte)

);

});

afficherEntreprises(resultat);

});

/* ==========================================
   CHARGEMENT INITIAL
========================================== */

afficherEntreprises();

/* ==========================================
   MODIFIER UNE ENTREPRISE
========================================== */

function modifierEntreprise(id){

const entreprise = entreprises.find(e => e.id === id);

if(!entreprise) return;

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

entreprises = entreprises.filter(e => e.id !== id);

localStorage.setItem(
"entreprises",
JSON.stringify(entreprises)
);

afficherEntreprises();

window.scrollTo({
top:0,
behavior:"smooth"
});

}

/* ==========================================
   SUPPRIMER UNE ENTREPRISE
========================================== */

function supprimerEntreprise(id){

if(!confirm("Voulez-vous supprimer cette entreprise ?")){

return;

}

entreprises = entreprises.filter(e => e.id !== id);

localStorage.setItem(
"entreprises",
JSON.stringify(entreprises)
);

afficherEntreprises();

}

/* ==========================================
   VIDER LE FORMULAIRE
========================================== */

function viderFormulaire(){

document.getElementById("entrepriseForm").reset();

}

/* ==========================================
   IMPRESSION (préparation)
========================================== */

function imprimerEntreprise(){

window.print();

}

/* ==========================================
   EXPORT PDF (préparation)
========================================== */

function exporterPDF(){

alert("Le module PDF sera ajouté dans la prochaine version.");

}

/* ==========================================
   EXPORT EXCEL (préparation)
========================================== */

function exporterExcel(){

alert("Le module Excel sera ajouté dans la prochaine version.");

}

/* ==========================================
   QR CODE (préparation)
========================================== */

function genererQRCode(){

alert("Le QR Code sera ajouté dans la prochaine version.");

}
