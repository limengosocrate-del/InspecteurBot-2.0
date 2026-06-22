// F01 Version 1.0 - InspecteurBot IA

function $(id){
    return document.getElementById(id);
}

function calculEffectifs(){

    const natH = parseInt($("nat_h").value) || 0;
    const natF = parseInt($("nat_f").value) || 0;
    const expH = parseInt($("exp_h").value) || 0;
    const expF = parseInt($("exp_f").value) || 0;

    $("nat_total").value = natH + natF;
    $("exp_total").value = expH + expF;

    $("hommes_total").value = natH + expH;
    $("femmes_total").value = natF + expF;

    $("grand_total").value =
        natH + natF + expH + expF;
}

function calculHeures(){

    const debut = $("heure_debut").value;
    const fin = $("heure_fin").value;

    if(!debut || !fin){
        return;
    }

    const d = new Date("2000-01-01T" + debut);
    const f = new Date("2000-01-01T" + fin);

    let heures = (f - d) / 3600000;

    if(heures < 0){
        heures += 24;
    }

    $("heures_semaine").value =
        Math.round(heures * 6);
}

function genererNumeroInspection(){

    let compteur =
        parseInt(
            localStorage.getItem(
                "compteurF01"
            ) || "0"
        );

    compteur++;

    localStorage.setItem(
        "compteurF01",
        compteur
    );

    $("numeroInspection").value =
        "F01-" +
        new Date().getFullYear() +
        "-" +
        String(compteur).padStart(6,"0");
}

function remplirDateHeure(){

    $("dateHeure").value =
        new Date().toLocaleString("fr-FR");
}

function analyser(){

    let anomalies = [];

    const total =
        parseInt($("grand_total").value) || 0;

    const heures =
        parseInt($("heures_semaine").value) || 0;

    const observations =
        $("observations").value.toLowerCase();

    if(total === 0){

        anomalies.push(
            "Aucun travailleur déclaré"
        );

    }

    if(heures > 48){

        anomalies.push(
            "Dépassement de la durée légale du travail"
        );

    }

    if(
        observations.includes("absence")
    ){

        anomalies.push(
            "Absence de document obligatoire"
        );

    }

    return anomalies;
}

function genererConclusionIA(){

    const anomalies = analyser();

    let risque = "Faible";
    let decision = "Conforme";

    if(anomalies.length >= 1){

        risque = "Moyen";
        decision = "Mise en demeure";

    }

    if(anomalies.length >= 3){

        risque = "Élevé";
        decision = "Procès-verbal";

    }

    $("niveauRisque").value =
        risque;

    $("decisionInspection").value =
        decision;

    $("conclusionIA").value =
        anomalies.length === 0
        ? "Inspection globalement conforme."
        : "Des irrégularités ont été constatées. Une régularisation est recommandée.";
}

function afficherInfractions(){

    const anomalies = analyser();

    $("infractions").value =
        anomalies.length === 0
        ? "Aucune infraction détectée."
        : anomalies.map(
            (x,i)=>
            (i+1)+". "+x
        ).join("\n");
}

function genererRapport(){

    genererConclusionIA();

    afficherInfractions();

    $("rapport").value =
`RAPPORT D'INSPECTION F01

Entreprise : ${$("entreprise").value}

Province : ${$("province").value}

Ville : ${$("ville").value}

Employeur : ${$("employeur").value}

Effectif total : ${$("grand_total").value}

Niveau de risque : ${$("niveauRisque").value}

Décision : ${$("decisionInspection").value}

CONCLUSION :

${$("conclusionIA").value}`;
}

function enregistrer(){

    let data = {};

    document
        .querySelectorAll(
            "input, textarea, select"
        )
        .forEach(el=>{

            if(el.id){

                data[el.id] =
                    el.value;

            }

        });

    localStorage.setItem(
        "F01_DATA",
        JSON.stringify(data)
    );

    alert(
        "Formulaire F01 enregistré."
    );
}

function charger(){

    const data =
        JSON.parse(
            localStorage.getItem(
                "F01_DATA"
            ) || "{}"
        );

    Object.keys(data)
    .forEach(id=>{

        const el =
            document.getElementById(id);

        if(el){

            el.value = data[id];

        }

    });
}

function exporterPDF(){

    window.print();
}

document.addEventListener(
"DOMContentLoaded",
()=>{

    genererNumeroInspection();

    remplirDateHeure();

    charger();

    [
        "nat_h",
        "nat_f",
        "exp_h",
        "exp_f"
    ].forEach(id=>{

        $(id)
        .addEventListener(
            "input",
            calculEffectifs
        );

    });

    $("heure_debut")
    .addEventListener(
        "change",
        calculHeures
    );

    $("heure_fin")
    .addEventListener(
        "change",
        calculHeures
    );

    $("btnEnregistrer")
    .addEventListener(
        "click",
        enregistrer
    );

    $("btnRapport")
    .addEventListener(
        "click",
        genererRapport
    );

    $("btnPDF")
    .addEventListener(
        "click",
        exporterPDF
    );

    $("btnImprimer")
    .addEventListener(
        "click",
        ()=>window.print()
    );

    calculEffectifs();

});
