/*==========================================
 INSPECTEURBOT IA RDC
 LOGIN SUPABASE
==========================================*/

import { supabase } from "./supabase.js";

document
.getElementById("loginForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("message");

    message.innerHTML = "Connexion en cours...";
    message.style.color = "#005baa";

    const { data, error } =
        await supabase.auth.signInWithPassword({

            email,
            password

        });

    if(error){

        message.innerHTML =
        "❌ " + error.message;

        message.style.color = "red";

        return;
    }

    const user = data.user;

    localStorage.setItem(
        "currentUser",
        user.email
    );

    message.innerHTML =
    "✅ Connexion réussie";

    message.style.color =
    "green";

    setTimeout(()=>{

        window.location.href =
        "dashboard.html";

    },1000);

});
