//==================================================
// INSPECTEURBOT IA RDC
// register.js
// Inscription avec Supabase
//==================================================

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

    if (password !== confirmPassword) {
        message.style.color = "red";
        message.innerHTML = "❌ Les mots de passe ne correspondent pas.";
        return;
    }

    message.style.color = "#005baa";
    message.innerHTML = "Création du compte...";

    const { data, error } = await supabase.auth.signUp({

        email: email,
        password: password,

        options: {

            data: {
                fullname: fullname,
                matricule: matricule,
                telephone: telephone,
                role: role,
                province: province,
                direction: direction
            }

        }

    });

    if (error) {

        message.style.color = "red";
        message.innerHTML = "❌ " + error.message;
        return;

    }

    message.style.color = "green";
    message.innerHTML =
        "✅ Compte créé avec succès. Vérifiez votre e-mail pour activer votre compte.";

    form.reset();

});
