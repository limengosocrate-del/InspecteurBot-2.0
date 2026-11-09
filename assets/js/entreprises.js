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

let entreprises = [];
let entretiensEnCours = [];
let entreprisesStorageKey = "inspecteurbot:entreprises:local";

function chargerCleEntreprises(){
    const client = window.inspecteurBotAuthClient;
    if (!client || !client.auth) {
        entreprises = JSON.parse(localStorage.getItem(entreprisesStorageKey) || "[]");
        return Promise.resolve();
    }
    return client.auth.getSession().then(({data}) => {
        const userId = data && data.session && data.session.user && data.session.user.id;
        entreprisesStorageKey = userId ? "inspecteurbot:entreprises:" + userId : "inspecteurbot:entreprises:local";
        entreprises = JSON.parse(localStorage.getItem(entreprisesStorageKey) || "[]");
    }).catch(() => {
        entreprisesStorageKey = "inspecteurbot:entreprises:local";
        entreprises = JSON.parse(localStorage.getItem(entreprisesStorageKey) || "[]");
    });
}

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
        entreprisesStorageKey,
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

observation:document.getElementById("observation").value.trim(),
entretiens: (() => {
    const date = document.getElementById("dateEntretien")?.value || "";
    const objet = document.getElementById("objetEntretien")?.value.trim() || "";
    const compteRendu = document.getElementById("compteRenduEntretien")?.value.trim() || "";
    const all = [...entretiensEnCours];
    if(date || objet || compteRendu) all.push({date,objet,compteRendu,creeLe:new Date().toISOString()});
    return all;
})()

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
entretiensEnCours=[];

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
entretiensEnCours=[...(entreprise.entretiens||[])];
const dernierEntretien=entretiensEnCours.slice(-1)[0]||{};
if(document.getElementById("dateEntretien"))document.getElementById("dateEntretien").value=dernierEntretien.date||"";
if(document.getElementById("objetEntretien"))document.getElementById("objetEntretien").value=dernierEntretien.objet||"";
if(document.getElementById("compteRenduEntretien"))document.getElementById("compteRenduEntretien").value=dernierEntretien.compteRendu||"";

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
 if(!tableau)return;tableau.innerHTML="";
 if(!liste.length){tableau.innerHTML='<tr><td colspan="18" style="text-align:center;padding:24px">Aucune entreprise enregistrée.</td></tr>';return;}
 const safe=v=>String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
 liste.forEach((e,index)=>{const last=(e.entretiens||[]).slice(-1)[0]||{};const tr=document.createElement("tr");const vals=[index+1,e.nom,e.rccm,e.idnat,e.impot,e.cnss,e.directeur,e.travailleurs,e.telephone,e.email,e.province,e.ville,e.adresse,e.secteur,e.statut,e.observation,e.nomInspecteur||"",[last.date,last.objet,last.compteRendu].filter(Boolean).join(" — ")];tr.innerHTML=vals.map(v=>'<td>'+safe(v)+'</td>').join('')+'<td><button type="button" onclick="modifierEntreprise('+Number(e.id)+')" title="Modifier">✏️</button> <button type="button" onclick="supprimerEntreprise('+Number(e.id)+')" title="Supprimer">🗑️</button></td>';tableau.appendChild(tr);});
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

async function actualiser(){

await chargerCleEntreprises();

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
 const section=document.querySelector(".table-section"),table=section?.querySelector("table");
 if(!Array.isArray(entreprises)||entreprises.length===0||!table){
  notification("Aucune entreprise enregistrée. Veuillez compléter les champs obligatoires restants, puis enregistrer l’entreprise avant de télécharger le PDF.","warning");
  const firstRequired=document.querySelector("form input[required],form select[required],form textarea[required]");
  firstRequired?.focus();return;
 }
 if(typeof html2pdf!=="function"){notification("Le générateur PDF est indisponible. Vérifiez votre connexion puis réessayez.","error");return;}
 const visibleRows=[...table.querySelectorAll("tbody tr")].filter(row=>getComputedStyle(row).display!=="none");
 if(!visibleRows.length){notification("Aucune entreprise visible dans la liste à exporter. Vérifiez les filtres.","warning");return;}
 const clone=table.cloneNode(true),body=clone.querySelector("tbody");
 if(body)body.replaceChildren(...visibleRows.map(row=>row.cloneNode(true)));
 clone.querySelectorAll("button,input,select,textarea").forEach(el=>el.remove());
 const date=new Intl.DateTimeFormat("fr-FR",{day:"2-digit",month:"long",year:"numeric"}).format(new Date());
 const wrapper=document.createElement("section");
 const exportTop=Math.max(document.documentElement.scrollHeight,window.scrollY+window.innerHeight)+24;
 wrapper.style.cssText="position:absolute;left:0;top:"+exportTop+"px;width:277mm;padding:8mm;background:#fff;color:#172334;font:8px/1.3 Arial,sans-serif;z-index:0;pointer-events:none;box-sizing:border-box";
 wrapper.innerHTML='<header style="text-align:center;border-bottom:2px solid #173b61;padding-bottom:7px;margin-bottom:10px"><div style="font-size:9px;font-weight:700">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO · MINISTÈRE DE L’EMPLOI ET DU TRAVAIL</div><h1 style="font-size:16px;color:#173b61;margin:5px 0">LISTE DES ENTREPRISES — INSPECTION GÉNÉRALE DU TRAVAIL</h1><p style="font-size:8px;margin:2px 0">Registre des entreprises enregistrées · '+date+' · '+visibleRows.length+' entreprise(s)</p></header>';
 const tableStyle=document.createElement("style");
 tableStyle.textContent="*{box-sizing:border-box}table{width:100%!important;min-width:0!important;border-collapse:collapse!important;table-layout:fixed!important;font-size:7px!important}th,td{border:1px solid #8795a5!important;padding:3px 4px!important;color:#172334!important;white-space:normal!important;overflow-wrap:anywhere!important;vertical-align:top!important}th{background:#e8eef5!important;color:#173b61!important;font-weight:700!important}thead{display:table-header-group}tr{break-inside:avoid;page-break-inside:avoid}footer{margin-top:10px;padding-top:6px;border-top:1px solid #cbd5e1;text-align:center;font-size:7px;color:#64748b}";
 wrapper.appendChild(tableStyle);wrapper.appendChild(clone);
 const footer=document.createElement("footer");footer.textContent="InspecteurBot RDC · Document administratif généré automatiquement";wrapper.appendChild(footer);
 document.body.appendChild(wrapper);
 const options={margin:0,filename:"liste_entreprises_igt.pdf",image:{type:"jpeg",quality:0.98},html2canvas:{scale:2,useCORS:true,backgroundColor:"#ffffff",scrollX:0,scrollY:0,windowWidth:1400,windowHeight:Math.max(window.innerHeight,exportTop+wrapper.scrollHeight+200)},jsPDF:{unit:"mm",format:"a4",orientation:"landscape",compress:true},pagebreak:{mode:["css","legacy"],avoid:["tr","thead"]}};
 html2pdf().set(options).from(wrapper).save().then(()=>notification("La liste des entreprises affichées a été téléchargée au format PDF A4 paysage.","success")).catch(error=>{console.error("Export PDF entreprises :",error);notification("Impossible de générer le PDF. Réessayez après avoir rechargé la page.","error")}).finally(()=>wrapper.remove());
}

/*=========================================================
 EXPORT EXCEL
=========================================================*/

function exporterExcel(){
 if(!entreprises.length){notification("Aucune entreprise à exporter.","warning");return;}
 const cols=[["Nom","nom"],["RCCM","rccm"],["ID NAT","idnat"],["Impôt","impot"],["CNSS","cnss"],["Directeur","directeur"],["Travailleurs","travailleurs"],["Téléphone","telephone"],["E-mail","email"],["Province","province"],["Ville","ville"],["Adresse","adresse"],["Secteur","secteur"],["Statut","statut"],["Observations","observation"],["Inspecteur","nomInspecteur"]];
 const q=v=>'"'+String(v??"").replace(/"/g,'""')+'"';const rows=[cols.map(x=>q(x[0])).join(";"),...entreprises.map(e=>cols.map(x=>q(e[x[1]])).join(";"))];const blob=new Blob(["\uFEFF"+rows.join("\r\n")],{type:"application/vnd.ms-excel;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="Entreprises_IGT_RDC.xls";a.click();URL.revokeObjectURL(a.href);notification("Export Excel prêt.");
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
localStorage.getItem(entreprisesStorageKey)
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

document.addEventListener("DOMContentLoaded",async function(){

/* Chargement des données */

await chargerCleEntreprises();

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

