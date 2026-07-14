/* ==================================================================
   SMART GPS IGT V4.0
   InspecteurBot RDC
   Module : Géolocalisation intelligente des missions
   ================================================================== */


const GPS = {

    // ==============================================================
    // VARIABLES PRINCIPALES
    // ==============================================================

    currentPosition: null,

    watchID: null,

    tracking: false,

    paused: false,

    startTime: null,

    timer: null,

    trackPoints: [],

    distanceTotal: 0,

    lastPoint: null,


    // Stockage local

    missionsKey: "igt_gps_missions",

    tracksKey: "igt_gps_tracks",



    // ==============================================================
    // INITIALISATION
    // ==============================================================

    init(){

        console.log(
            "✅ SMART GPS IGT V4.0 actif"
        );

    },



    // ==============================================================
    // VERIFIER SUPPORT GPS
    // ==============================================================

    supported(){

        return navigator.geolocation !== undefined;

    },



    // ==============================================================
    // OBTENIR POSITION ACTUELLE
    // ==============================================================

    getPosition(){


        return new Promise((resolve,reject)=>{


            if(!this.supported()){

                reject(
                    "GPS non disponible"
                );

                return;

            }



            navigator.geolocation.getCurrentPosition(


                position=>{


                    this.currentPosition={


                        lat:
                        position.coords.latitude,


                        lng:
                        position.coords.longitude,


                        accuracy:
                        position.coords.accuracy,


                        altitude:
                        position.coords.altitude || 0,


                        speed:
                        position.coords.speed || 0,


                        heading:
                        position.coords.heading || 0,


                        timestamp:
                        new Date().toISOString(),


                        status:
                        "GPS connecté"


                    };


                    resolve(
                        this.currentPosition
                    );


                },


                error=>{


                    reject(
                        error.message
                    );


                },


                {

                    enableHighAccuracy:true,

                    timeout:15000,

                    maximumAge:0

                }


            );


        });


    },

       // ==============================================================
    // ADRESSE COMPLETE PAR GPS
    // ==============================================================

    async getAddress(lat, lng){

        try{

            const response = await fetch(

                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`

            );


            const data = await response.json();


            const a = data.address || {};


            return {


                complet:
                data.display_name ||
                "Adresse inconnue",


                rue:
                a.road || "",


                quartier:
                a.suburb ||
                a.neighbourhood ||
                "",


                commune:
                a.city_district ||
                a.suburb ||
                "",


                ville:
                a.city ||
                a.town ||
                a.village ||
                "",


                province:
                a.state ||
                "",


                pays:
                a.country ||
                ""


            };


        }catch(error){


            return {

                complet:"Adresse indisponible",

                rue:"",

                quartier:"",

                commune:"",

                ville:"",

                province:"",

                pays:""

            };


        }


    },



    // ==============================================================
    // COPIER LA POSITION GPS
    // ==============================================================

    async copyPosition(){


        if(!this.currentPosition)
            return false;



        const texte =

`SMART GPS IGT - InspecteurBot RDC

Latitude :
${this.currentPosition.lat}

Longitude :
${this.currentPosition.lng}

Précision :
${Math.round(this.currentPosition.accuracy)} mètres

Date :
${this.formatDate(this.currentPosition.timestamp)}
`;



        await navigator.clipboard.writeText(texte);


        return true;


    },



    // ==============================================================
    // PARTAGER LA POSITION
    // ==============================================================

    async sharePosition(){


        if(!this.currentPosition)
            return;



        const lien =

`https://www.google.com/maps?q=${this.currentPosition.lat},${this.currentPosition.lng}`;



        if(navigator.share){


            await navigator.share({

                title:
                "Position GPS IGT",

                text:
                "Ma position de mission InspecteurBot",

                url:lien

            });


        }

        else{


            await navigator.clipboard.writeText(lien);


            alert(
                "Lien GPS copié"
            );


        }


    },



    // ==============================================================
    // CALCUL DISTANCE HAVERSINE
    // ==============================================================

    distance(
        lat1,
        lng1,
        lat2,
        lng2
    ){


        const R = 6371;



        const dLat =
        (lat2-lat1)
        *
        Math.PI/180;



        const dLng =
        (lng2-lng1)
        *
        Math.PI/180;



        const a =

        Math.sin(dLat/2)**2 +

        Math.cos(lat1*Math.PI/180) *

        Math.cos(lat2*Math.PI/180) *

        Math.sin(dLng/2)**2;



        return R *

        2 *

        Math.atan2(

            Math.sqrt(a),

            Math.sqrt(1-a)

        );


    },



    // ==============================================================
    // FORMAT DATE
    // ==============================================================

    formatDate(date){


        return new Date(date)

        .toLocaleString(
            "fr-FR"
        );


    },

       // ==============================================================
    // ENREGISTRER UNE MISSION
    // ==============================================================

    saveMission(nom, notes = "", infos = {}) {


        if(!this.currentPosition)
            return null;



        const missions = this.getMissions();



        const mission = {


            id:
            "IGT-" + Date.now(),


            nom:


            nom,


            notes:


            notes,


            inspecteur:

            infos.inspecteur || "",


            objet:

            infos.objet || "",



            latitude:

            this.currentPosition.lat,


            longitude:

            this.currentPosition.lng,


            precision:

            this.currentPosition.accuracy,


            altitude:

            this.currentPosition.altitude,


            date:

            new Date().toISOString(),



            statut:

            "Terminée"



        };



        missions.unshift(mission);



        localStorage.setItem(

            this.missionsKey,

            JSON.stringify(missions)

        );



        return mission;


    },



    // ==============================================================
    // RECUPERER LES MISSIONS
    // ==============================================================

    getMissions(){


        return JSON.parse(

            localStorage.getItem(

                this.missionsKey

            ) || "[]"

        );


    },



    // ==============================================================
    // RECHERCHE DES MISSIONS
    // ==============================================================

    searchMissions(text){


        const recherche =

        text.toLowerCase();



        return this.getMissions()

        .filter(m =>



            m.nom

            .toLowerCase()

            .includes(recherche)



            ||



            (m.notes || "")

            .toLowerCase()

            .includes(recherche)



            ||



            (m.inspecteur || "")

            .toLowerCase()

            .includes(recherche)



            ||



            (m.objet || "")

            .toLowerCase()

            .includes(recherche)



        );


    },



    // ==============================================================
    // SUPPRIMER UNE MISSION
    // ==============================================================

    deleteMission(id){



        const missions =

        this.getMissions()

        .filter(

            m => m.id !== id

        );



        localStorage.setItem(

            this.missionsKey,

            JSON.stringify(missions)

        );


    },



    // ==============================================================
    // EFFACER TOUTES LES MISSIONS
    // ==============================================================

    clearMissions(){


        localStorage.removeItem(

            this.missionsKey

        );


    },



    // ==============================================================
    // STATISTIQUES GPS
    // ==============================================================

    getStats(){


        const missions =

        this.getMissions();



        return {


            total:

            missions.length,



            aujourdHui:

            missions.filter(m =>


                new Date(m.date)

                .toDateString()

                ===

                new Date()

                .toDateString()


            ).length



        };


    },

       // ==============================================================
    // DÉMARRER LE SUIVI GPS D'UNE MISSION
    // ==============================================================

    startTracking(){


        if(this.tracking){

            return false;

        }



        if(!navigator.geolocation){

            alert(
                "GPS non disponible"
            );

            return false;

        }



        this.tracking = true;

        this.paused = false;


        this.startTime = Date.now();


        this.trackPoints = [];

        this.distanceTotal = 0;

        this.lastPoint = null;



        this.watchID = navigator.geolocation.watchPosition(


            position => {


                if(this.paused)

                    return;



                const point = {


                    lat:

                    position.coords.latitude,


                    lng:

                    position.coords.longitude,


                    accuracy:

                    position.coords.accuracy,


                    speed:

                    position.coords.speed || 0,


                    time:

                    new Date().toISOString()


                };



                // Calcul distance entre deux points

                if(this.lastPoint){


                    this.distanceTotal +=

                    this.distance(

                        this.lastPoint.lat,

                        this.lastPoint.lng,

                        point.lat,

                        point.lng

                    );


                }



                this.lastPoint = point;



                this.trackPoints.push(point);



                // Mise à jour de la position actuelle

                this.currentPosition = point;



                // Notification interface

                if(typeof window.updateTrackingUI === "function"){


                    window.updateTrackingUI(

                        this.getTrackingInfo()

                    );


                }


            },



            error => {


                console.error(

                    "Erreur suivi GPS :",

                    error.message

                );


            },


            {


                enableHighAccuracy:true,


                timeout:10000,


                maximumAge:0


            }



        );



        return true;


    },



    // ==============================================================
    // PAUSE DU SUIVI
    // ==============================================================

    pauseTracking(){


        if(!this.tracking)

            return;



        this.paused = !this.paused;


    },



    // ==============================================================
    // ARRÊTER LE SUIVI
    // ==============================================================

    stopTracking(){


        if(this.watchID !== null){


            navigator.geolocation.clearWatch(

                this.watchID

            );


        }



        this.watchID = null;


        this.tracking = false;


        this.paused = false;



        // Sauvegarde du trajet

        const tracks = JSON.parse(

            localStorage.getItem(

                this.tracksKey

            ) || "[]"

        );



        tracks.unshift({


            id:

            "TR-" + Date.now(),



            date:

            new Date().toISOString(),



            distance:

            this.distanceTotal,



            points:

            this.trackPoints



        });



        localStorage.setItem(

            this.tracksKey,

            JSON.stringify(tracks)

        );



        return true;


    },



    // ==============================================================
    // INFORMATIONS DU SUIVI ACTUEL
    // ==============================================================

    getTrackingInfo(){


        let duree = 0;



        if(this.startTime){


            duree =

            Date.now()

            -

            this.startTime;


        }



        return {


            actif:

            this.tracking,



            distance:

            this.distanceTotal,



            points:

            this.trackPoints.length,



            duree:


            duree



        };


    },

   
        // ==============================================================
    // RECUPERER LES TRAJETS ENREGISTRÉS
    // ==============================================================

    getTracks(){


        return JSON.parse(

            localStorage.getItem(

                this.tracksKey

            ) || "[]"

        );


    },



    // ==============================================================
    // DERNIER TRAJET
    // ==============================================================

    getLastTrack(){


        const tracks = this.getTracks();


        return tracks.length ?

        tracks[0]

        :

        null;


    },



    // ==============================================================
    // DISTANCE FORMATÉE
    // ==============================================================

    formatDistance(km){


        if(km < 1){


            return Math.round(km * 1000)

            + " mètres";


        }


        return km.toFixed(2)

        + " km";


    },



    // ==============================================================
    // DURÉE FORMATÉE
    // ==============================================================

    formatDuration(ms){


        const secondes =

        Math.floor(ms / 1000);



        const h =

        Math.floor(secondes / 3600);



        const m =

        Math.floor(

            (secondes % 3600) / 60

        );



        const s =

        secondes % 60;



        return (

            String(h).padStart(2,"0")

            + ":" +

            String(m).padStart(2,"0")

            + ":" +

            String(s).padStart(2,"0")

        );


    }



};


// ==============================================================
// EXPORT GLOBAL DU MODULE GPS
// ==============================================================

if(typeof window !== "undefined"){

    window.GPS = GPS;

}


// Initialisation automatique

GPS.init();               
