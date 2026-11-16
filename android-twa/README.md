# Préparation Android — InspecteurBot IGT (TWA)

Ce dossier prépare l'emballage Android de l'application web existante. Il ne modifie pas l'application publiée sur la branche `main`.

## Paramètres approuvés

- Nom affiché : InspecteurBot IGT
- Nom court : InspecteurBot
- Identifiant Android (package ID) : `cd.igt.inspecteurbot`
- Méthode : Trusted Web Activity (TWA) avec Bubblewrap
- Site actuel : https://limengosocrate-del.github.io/InspecteurBot-2.0/
- Manifest PWA : https://limengosocrate-del.github.io/InspecteurBot-2.0/manifest.json
- URL de lancement envisagée : https://limengosocrate-del.github.io/InspecteurBot-2.0/index.html
- Langue : français
- Couleurs de marque : bleu nuit `#041c5c`, bleu/cyan et or
- Orientation : portrait

## Pourquoi la construction AAB n'est pas encore faite

Bubblewrap doit lire le manifeste publié, créer le projet Android et générer une clé de signature. La clé privée et ses mots de passe doivent rester sous le contrôle du propriétaire et ne doivent jamais être ajoutés à GitHub ni envoyés dans une conversation.

## Étapes de construction

Sur un ordinateur Windows, macOS ou Linux avec Node.js 18+ :

```bash
npm install --global @bubblewrap/cli
bubblewrap validate --url=https://limengosocrate-del.github.io/InspecteurBot-2.0/
bubblewrap init --manifest=https://limengosocrate-del.github.io/InspecteurBot-2.0/manifest.json --directory=./android-twa-project
```

Pendant `bubblewrap init`, confirmer :
- Application ID : `cd.igt.inspecteurbot`
- Nom : `InspecteurBot IGT`
- Nom court : `InspecteurBot`
- URL de lancement : `/InspecteurBot-2.0/index.html` (à confirmer dans l'assistant selon le manifeste téléchargé)
- Orientation : `portrait`
- Couleur de thème : `#041c5c`
- Couleur d'arrière-plan : `#041c5c`

L'assistant demandera les informations de création de la clé de signature. Utiliser une clé de production conservée dans un endroit sûr, faire une sauvegarde hors ligne et ne jamais la committer dans le dépôt.

Après initialisation :

```bash
cd android-twa-project
bubblewrap build
```

Le build Bubblewrap produit notamment un App Bundle signé `app-release-bundle.aab` et un APK de test. Vérifier le nom exact des fichiers affichés par la version installée de Bubblewrap.

## Point bloquant à résoudre avant la TWA plein écran

Une TWA exige un fichier Digital Asset Links à l'adresse `/.well-known/assetlinks.json` sur l'origine web, contenant l'empreinte SHA-256 du certificat de signature et le package ID exact.

Le site actuel est un GitHub Pages de projet sous le chemin `/InspecteurBot-2.0/`. Le fichier Digital Asset Links doit être servi à la racine de l'origine, pas simplement dans le sous-dossier du projet. Il faut donc confirmer un domaine racine maîtrisé (par exemple un domaine personnalisé dédié ou le site GitHub Pages utilisateur) et la façon d'y publier `/.well-known/assetlinks.json`.

Ne pas créer un fichier assetlinks avec une empreinte fictive. Après création de l'AAB et activation de Play App Signing, récupérer les empreintes SHA-256 correctes dans Play Console (certificat de signature de l'application et, si nécessaire pour les tests locaux, certificat de téléversement), puis publier le JSON exact.

Pour GitHub Pages/Jekyll, inclure le dossier caché `.well-known` dans la configuration du site (`include: [".well-known"]`) et vérifier que l'URL publique retourne directement le JSON avec HTTP 200.

## Contrôles avant envoi à Google Play

- Le site s'ouvre en HTTPS et le manifeste PWA est accessible publiquement.
- Le test `bubblewrap validate` est réussi ou chaque avertissement est compris.
- Les icônes PNG carrées de 512×512 au minimum sont accessibles publiquement.
- Le package ID est définitivement confirmé et n'a jamais été publié.
- La clé de téléversement est sauvegardée et jamais commitée.
- Digital Asset Links est publié et validé.
- Connexion, passkeys, annuaire, messagerie, notifications, GPS (avec autorisation), liens externes, formulaires et retour Android sont testés sur un vrai téléphone.
- La fiche Google Play et la déclaration « Sécurité des données » reflètent exactement les données réellement traitées par la version Android.

## Références officielles

- Bubblewrap CLI : https://github.com/GoogleChromeLabs/bubblewrap
- Guide TWA Android : https://developer.android.com/develop/ui/views/layout/webapps/guide-trusted-web-activities-version2
- Digital Asset Links : https://developer.chrome.com/docs/android/trusted-web-activity/android-for-web-devs
