//==================================================
// INSPECTEURBOT IA RDC
// login.js
// Authentification avec Supabase
//==================================================

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

// Vérifier si l'utilisateur est déjà connecté
document.addEventListener("DOMContentLoaded", async () => {

    const {
        data: { session }
    } = await supabase.auth.getSession();

    if (session) {
        window.location.href = "dashboard.html";
    }

});

// Connexion
loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    message.style.color = "#005baa";
    message.innerHTML = "Connexion en cours...";

    const { data, error } = await supabase.auth.signInWithPassword({

        email: email,
        password: password

    });

    if (error) {

        message.style.color = "red";
        message.innerHTML = "❌ " + error.message;

        return;

    }

    // Sauvegarder quelques informations utiles
    localStorage.setItem("isLoggedIn", "true");

    localStorage.setItem(
        "currentUser",
        data.user.user_metadata.fullname || ""
    );

    message.style.color = "green";
    message.innerHTML = "✅ Connexion réussie";

    setTimeout(() => {

        window.location.href = "dashboard.html";

    }, 1000);

});
