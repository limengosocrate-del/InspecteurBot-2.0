"use strict";

/*==================================================
INSPECTEURBOT RDC
TRADUCTION V2.0
Compatible 2026
==================================================*/

window.CodeTravail = window.CodeTravail || {};

CodeTravail.Traduction = {};

CodeTravail.Traduction.langue = "fr";

/*==================================================
DICTIONNAIRE
==================================================*/

CodeTravail.Traduction.dictionnaire = {

fr:{

analyser:"Analyser",

effacer:"Effacer",

copier:"Copier",

lecture:"Écouter",

favori:"Favori",

partager:"Partager",

imprimer:"Imprimer",

precedent:"Précédent",

suivant:"Suivant",

assistant:"Assistant Juridique IA"

},

en:{

analyser:"Analyze",

effacer:"Clear",

copier:"Copy",

lecture:"Listen",

favori:"Favorite",

partager:"Share",

imprimer:"Print",

precedent:"Previous",

suivant:"Next",

assistant:"AI Assistant"

},

ln:{

analyser:"Talela",

effacer:"Longola",

copier:"Kopi",

lecture:"Yoka",

favori:"Favori",

partager:"Kabola",

imprimer:"Imprimer",

precedent:"Liboso",

suivant:"Nsima",

assistant:"Mosungi IA"

},

sw:{

analyser:"Chambua",

effacer:"Futa",

copier:"Nakili",

lecture:"Soma",

favori:"Pendwa",

partager:"Shiriki",

imprimer:"Chapisha",

precedent:"Nyuma",

suivant:"Mbele",

assistant:"Msaidizi IA"

},

lu:{

analyser:"Sangana",

effacer:"Futa",

copier:"Kopiya",

lecture:"Tanga",

favori:"Favori",

partager:"Kabula",

imprimer:"Imprima",

precedent:"Kunyima",

suivant:"Kumpala",

assistant:"Musadidi IA"

},

kg:{

analyser:"Tala",

effacer:"Katula",

copier:"Kopa",

lecture:"Wa",

favori:"Favori",

partager:"Kabula",

imprimer:"Imprimer",

precedent:"Nima",

suivant:"Mvula",

assistant:"Nsadisi IA"

}

};

/*==================================================
APPLIQUER
==================================================*/

CodeTravail.Traduction.appliquer=function(langue){

if(!this.dictionnaire[langue])

langue="fr";

this.langue=langue;

localStorage.setItem(

"inspecteurbot_langue",

langue

);

const d=this.dictionnaire[langue];

/*==========================
Boutons IA
==========================*/

const changer=(id,texte)=>{

const b=document.getElementById(id);

if(b) b.innerHTML=texte;

};

changer("btnQuestionIA",d.analyser);

changer("btnEffacerIA",d.effacer);

changer("btnCopierIA",d.copier);

changer("btnLectureIA",d.lecture);

changer("btnFavoriArticle",d.favori);

changer("btnPartagerArticle",d.partager);

changer("btnImprimerArticle",d.imprimer);

changer("btnArticlePrecedent",

'<i class="fa-solid fa-arrow-left"></i> '+

d.precedent

);

changer("btnArticleSuivant",

d.suivant+

' <i class="fa-solid fa-arrow-right"></i>'

);

/*==========================
Placeholder IA
==========================*/

const zone=document.getElementById("questionIA");

if(zone){

switch(langue){

case"en":

zone.placeholder="Ask your legal question...";

break;

case"ln":

zone.placeholder="Tuna motuna na yo...";

break;

case"sw":

zone.placeholder="Uliza swali lako...";

break;

default:

zone.placeholder="Posez votre question juridique...";

}

}

/*==========================
Voix
==========================*/

if(window.CodeTravail.Speech){

CodeTravail.Speech.changerLangue(

this.codeVocal()

);

}

/*==========================
Notification
==========================*/

if(window.Utils){

Utils.notification(

"Langue : "+langue.toUpperCase()

);

}

};

/*==================================================
CODE VOCAL
==================================================*/

CodeTravail.Traduction.codeVocal=function(){

switch(this.langue){

case"en":

return"en-US";

case"sw":

return"sw";

default:

return"fr-FR";

}

};

/*==================================================
LANGUE
==================================================*/

CodeTravail.Traduction.obtenir=function(){

return this.langue;

};

/*==================================================
INITIALISATION
==================================================*/

CodeTravail.Traduction.initialiser=function(){

const select=

document.getElementById("langue");

if(select){

select.addEventListener(

"change",

e=>{

this.appliquer(

e.target.value

);

}

);

}

const sauvegarde=

localStorage.getItem(

"inspecteurbot_langue"

)||"fr";

if(select)

select.value=sauvegarde;

this.appliquer(

sauvegarde

);

console.log(

"Traduction V2 chargée."

);

};

/*==================================================
DÉMARRAGE
==================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

CodeTravail.Traduction.initialiser();

}

);
