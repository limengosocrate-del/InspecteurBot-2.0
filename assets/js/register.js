/*====================================================
 INSPECTEURBOT IA RDC
 register.js
 Inscription avec Supabase
 Développé par Inspecteur Limengo (Pmiller)
====================================================*/

import { supabase } from "./supabase.js";

const form = document.getElementById("registerForm");
const message = document.getElementById("registerMessage");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const matricule = document.getElementById("matricule").value.trim();
    const email = document.getElementById("email").value.trim();
    const telephone = document.getElementById("telephone").value.trim();
    const role = document.getElementById("role").value;
    const province = document.getElementById("province").value.trim();
    const direction = document.getElementById("direction").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    message.style.color = "#005baa";
    message.innerHTML = "Création du compte...";

    if (password !== confirmPassword) {

        message.style.color = "red";
        message.innerHTML = "❌ Les mots de passe ne correspondent pas.";

        return;
    }

    if (password.length < 6) {

        message.style.color = "red";
        message.innerHTML = "❌ Le mot de passe doit contenir au moins 6 caractères.";

        return;
    }

    const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
        data: {
            fullname,
            matricule,
            telephone,
            role,
            province,
            direction
        }
    }
});

console.log("DATA :", data);
console.log("ERROR :", error);

if (error) {
    message.style.color = "red";
    message.innerHTML = "❌ " + error.message;
    return;
}

if (!data.user) {
    message.style.color = "red";
    message.innerHTML = "❌ Aucun utilisateur créé.";
    return;
}

    message.style.color = "green";

    message.innerHTML =
    "✅ Compte créé avec succès.<br>Vérifiez votre boîte e-mail pour confirmer votre compte.";

    form.reset();

});
