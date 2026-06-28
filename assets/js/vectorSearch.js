/*=========================================================
 INSPECTEURBOT IA RDC
 VECTOR SEARCH
 Version 3.0
=========================================================*/

"use strict";

class VectorSearch {

    constructor(){

        this.documents=[];

    }

    charger(documents){

        if(Array.isArray(documents)){

            this.documents=documents;

        }

    }

    nettoyer(texte){

        return String(texte || "")

        .toLowerCase()

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g,"")

        .replace(/[^\w\s]/g," ")

        .replace(/\s+/g," ")

        .trim();

    }

    decouper(texte){

        return this.nettoyer(texte)

        .split(" ")

        .filter(mot=>mot.length>2);

    }

    calculerScore(article,mots){

        let score=0;

        const numero=this.nettoyer(article.numero);

        const titre=this.nettoyer(article.titre);

        const contenu=this.nettoyer(article.contenu);

        mots.forEach(mot=>{

            if(numero===mot)

                score+=100;

            if(numero.includes(mot))

                score+=80;

            if(titre.includes(mot))

                score+=40;

            if(contenu.includes(mot))

                score+=15;

        });

        return score;

    }

    rechercher(question){

        const mots=this.decouper(question);

        let resultat=[];

        this.documents.forEach(article=>{

            const score=this.calculerScore(article,mots);

            if(score>0){

                resultat.push({

                    ...article,

                    scoreIA:score

                });

            }

        });

        resultat.sort((a,b)=>b.scoreIA-a.scoreIA);

        return resultat;

    }

    rechercherNumero(numero){

        return this.documents.find(article=>

            String(article.numero)===String(numero)

        );

    }

    rechercherTitre(titre){

        titre=this.nettoyer(titre);

        return this.documents.filter(article=>

            this.nettoyer(article.titre)

            .includes(titre)

        );

    }

    rechercherMotCle(mot){

        mot=this.nettoyer(mot);

        return this.documents.filter(article=>{

            return this.nettoyer(

                article.contenu

            ).includes(mot);

        });

    }

    total(){

        return this.documents.length;

    }

}

window.vectorSearch=new VectorSearch();

console.log("✅ VectorSearch chargé.");
