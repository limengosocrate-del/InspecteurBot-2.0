/* ==================================================================
   GPS.JS V2.0 — Ma position actuelle + Gestion des missions IGT
   ================================================================== */

const GPS = {

  currentPosition: null,


  // ==========================================================
  // OBTENIR LA POSITION GPS ACTUELLE
  // ==========================================================

  async getPosition() {

    return new Promise((resolve, reject) => {

      if (!navigator.geolocation)
        return reject("GPS non supporté sur cet appareil");


      navigator.geolocation.getCurrentPosition(

        pos => {

          this.currentPosition = {

            lat: pos.coords.latitude,
            lng: pos.coords.longitude,

            accuracy: pos.coords.accuracy,

            timestamp: new Date().toISOString(),

            status: "GPS connecté"

          };


          resolve(this.currentPosition);

        },


        err => {

          reject(
            "Erreur GPS : " + err.message
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



  // ==========================================================
  // ADRESSE COMPLETE
  // ==========================================================

  async getAddress(lat,lng){

    try{


      const r = await fetch(

`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`

      );


      const d = await r.json();


      const a = d.address || {};


      return {

        complet:
        d.display_name || "Adresse inconnue",


        ville:
        a.city ||
        a.town ||
        a.village ||
        "Inconnue",


        commune:
        a.suburb ||
        a.city_district ||
        "Inconnue",


        pays:
        a.country ||
        "Inconnu"

      };


    }catch(e){


      return {

        complet:"Erreur géocodage",
        ville:"",
        commune:"",
        pays:""

      };

    }

  },



  // ==========================================================
  // COPIER POSITION
  // ==========================================================

  copyPosition(){


    if(!this.currentPosition)
      return false;


    const text =

`Position GPS IGT

Latitude :
${this.currentPosition.lat}

Longitude :
${this.currentPosition.lng}

Précision :
${Math.round(this.currentPosition.accuracy)} mètres`;


    navigator.clipboard.writeText(text);


    return true;

  },



  // ==========================================================
  // PARTAGER POSITION
  // ==========================================================

  sharePosition(){


    if(!this.currentPosition)
      return;


    const url =
`https://maps.google.com/?q=${this.currentPosition.lat},${this.currentPosition.lng}`;


    if(navigator.share){

      navigator.share({

        title:"Ma position GPS IGT",

        text:"Position de mission InspecteurBot",

        url:url

      });

    }else{

      navigator.clipboard.writeText(url);

    }

  },



  // ==========================================================
  // DISTANCE HAVERSINE
  // ==========================================================

  distance(lat1,lng1,lat2,lng2){

    const R=6371;


    const dLat =
    (lat2-lat1)*Math.PI/180;


    const dLng =
    (lng2-lng1)*Math.PI/180;


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



  // ==========================================================
  // ENREGISTRER MISSION
  // ==========================================================

  saveMission(nom,notes=""){


    if(!this.currentPosition)
      return null;


    const missions =
    JSON.parse(
      localStorage.getItem("igt_missions") || "[]"
    );


    const m={

      id:"M-"+Date.now(),

      nom,

      notes,

      ...this.currentPosition

    };


    missions.unshift(m);


    localStorage.setItem(

      "igt_missions",

      JSON.stringify(
        missions.slice(0,500)
      )

    );


    return m;

  },



  getMissions(){

    return JSON.parse(

      localStorage.getItem("igt_missions") || "[]"

    );

  }


};



if(typeof window!=="undefined")

window.GPS=GPS;
