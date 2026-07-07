/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 weather.js
 GPS + METEO AUTOMATIQUE
===================================================*/

"use strict";


/*==================================================
 INITIALISATION METEO
===================================================*/

function initWeather(){


    const weatherBox =
        document.getElementById(
            "weather"
        );


    if(!weatherBox) return;



    if(!navigator.geolocation){


        weatherBox.textContent =
            "GPS non disponible";


        return;

    }



    weatherBox.textContent =
        "📍 Recherche localisation...";



    navigator.geolocation.getCurrentPosition(

        position => {


            const latitude =
                position.coords.latitude;


            const longitude =
                position.coords.longitude;



            getWeather(
                latitude,
                longitude
            );


        },


        ()=>{


            weatherBox.textContent =
                "📍 Localisation refusée";


        }


    );


}



/*==================================================
 APPEL METEO
===================================================*/

async function getWeather(
    lat,
    lon
){


    const weatherBox =
        document.getElementById(
            "weather"
        );



    try{


        const url =

        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;



        const response =
            await fetch(url);



        const data =
            await response.json();



        const temp =
            data.current.temperature_2m;



        const code =
            data.current.weather_code;



        const icon =
            weatherIcon(code);



        weatherBox.textContent =

        `${icon} ${temp}°C`;



        Storage.save(
            "weather",
            {
                temperature:temp,
                code:code,
                date:new Date()
            }
        );



    }

    catch(error){


        weatherBox.textContent =
            "Météo indisponible";


        console.error(
            error
        );


    }


}



/*==================================================
 ICONES METEO
===================================================*/

function weatherIcon(code){


    if(code===0)

        return "☀️";


    if(
        code>=1 &&
        code<=3
    )

        return "⛅";


    if(
        code>=45 &&
        code<=48
    )

        return "🌫️";


    if(
        code>=51 &&
        code<=67
    )

        return "🌧️";


    if(
        code>=71 &&
        code<=77
    )

        return "❄️";


    if(
        code>=80 &&
        code<=82
    )

        return "🌦️";


    if(
        code>=95
    )

        return "⛈️";


    return "🌍";

}



/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
"DOMContentLoaded",
()=>{


    initWeather();


});
