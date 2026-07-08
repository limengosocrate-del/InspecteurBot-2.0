/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 weather.js
 GPS + MÉTÉO AUTOMATIQUE
===================================================*/

"use strict";

/*==================================================
 INITIALISATION MÉTÉO
===================================================*/

function initWeather(){

    const weatherBox =
        document.getElementById("weather");

    if(!weatherBox) return;

    if(!navigator.geolocation){

        weatherBox.textContent =
            "📍 GPS indisponible";

        return;

    }

    weatherBox.textContent =
        "📍 Localisation...";

    navigator.geolocation.getCurrentPosition(

        position=>{

            getWeather(

                position.coords.latitude,
                position.coords.longitude

            );

        },

        ()=>{

            weatherBox.textContent =
                "📍 Localisation refusée";

        },

        {

            enableHighAccuracy:true,
            timeout:10000,
            maximumAge:600000

        }

    );

}

/*==================================================
 RÉCUPÉRATION MÉTÉO
===================================================*/

async function getWeather(lat,lon){

    const weatherBox =
        document.getElementById("weather");

    if(!weatherBox) return;

    try{

        const url=
`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;

        const response=
            await fetch(url);

        if(!response.ok){

            throw new Error("Erreur réseau");

        }

        const data=
            await response.json();

        const temp=
            data.current.temperature_2m;

        const code=
            data.current.weather_code;

        const icon=
            weatherIcon(code);

        weatherBox.textContent=
            `${icon} ${temp}°C`;

        if(typeof Storage!=="undefined"){

            Storage.save("weather",{

                temperature:temp,
                code:code,
                latitude:lat,
                longitude:lon,
                date:new Date().toISOString()

            });

        }

        if(typeof logAction==="function"){

            logAction(
                "Météo mise à jour"
            );

        }

    }

    catch(error){

        console.error(error);

        weatherBox.textContent=
            "🌦️ Météo indisponible";

    }

}

/*==================================================
 ICÔNES MÉTÉO
===================================================*/

function weatherIcon(code){

    if(code===0) return "☀️";

    if(code>=1 && code<=3) return "⛅";

    if(code>=45 && code<=48) return "🌫️";

    if(code>=51 && code<=67) return "🌧️";

    if(code>=71 && code<=77) return "❄️";

    if(code>=80 && code<=82) return "🌦️";

    if(code>=95) return "⛈️";

    return "🌍";

}

/*==================================================
 DÉMARRAGE
===================================================*/

document.addEventListener(
    "DOMContentLoaded",
    initWeather
);
