# Préparation Android — InspecteurBot IGT (TWA)

Ce dossier prépare le paquet Android de l'application web existante. Toutes les modifications restent sur la branche `android-twa-preparation` jusqu'à validation. La branche `main` et l'application en production ne sont pas modifiées par cette préparation.

## Paramètres approuvés

- Nom affiché : InspecteurBot IGT
- Nom court : InspecteurBot
- Identifiant Android (package ID) : `cd.igt.inspecteurbot`
- Version affichée : `1.0.0`
- Code de version initial : `1` (à incrémenter pour chaque nouvelle version)
- Méthode : Trusted Web Activity (TWA) avec Bubblewrap
- Site : https://limengosocrate-del.github.io/InspecteurBot-2.0/
- Manifeste : https://limengosocrate-del.github.io/InspecteurBot-2.0/manifest.json
- URL de lancement : https://limengosocrate-del.github.io/InspecteurBot-2.0/index.html
- Langue : français
- Orientation : portrait
- Couleurs : bleu nuit `#041c5c`

Le manifeste Android de préparation doit conserver le véritable logo PNG 512×512 et les fonctions PWA déjà déclarées dans le manifeste de production. Ne pas remplacer l'icône par un fichier JPEG ni modifier le manifeste de production pour cette préparation.

## Génération de l'APK signé

La construction est à effectuer sur un ordinateur Windows, macOS ou Linux disposant de Node.js. Un téléphone Android seul ne suffit pas pour exécuter Bubblewrap et compiler le projet localement.

Installer Bubblewrap :

```bash
npm install --global @bubblewrap/cli
```

Valider le site :

```bash
bubblewrap validate --url=https://limengosocrate-del.github.io/InspecteurBot-2.0/
```

Initialiser le projet depuis le manifeste publié :

```bash
bubblewrap init --manifest=https://limengosocrate-del.github.io/InspecteurBot-2.0/manifest.json --directory=./android-twa-project
```

Confirmer pendant l'assistant :
- Application ID : `cd.igt.inspecteurbot`
- Nom : `InspecteurBot IGT`
- Nom court : `InspecteurBot`
- Version : `1.0.0`
- Code de version : `1`
- URL de lancement : `https://limengosocrate-del.github.io/InspecteurBot-2.0/index.html`
- Orientation : portrait
- Couleur de thème et d'arrière-plan : `#041c5c`

Bubblewrap crée ou demande une clé de signature. Le propriétaire doit créer/conserver cette clé et ses mots de passe. Ne jamais envoyer la clé privée, les mots de passe ou le fichier keystore dans une conversation, dans un dépôt Git ou dans un espace public.

Construire le paquet signé :

```bash
cd android-twa-project
bubblewrap build
```

Bubblewrap génère notamment :
- `app-release-signed.apk` : APK signé à installer directement sur les téléphones Android compatibles et à distribuer par lien privé/public.
- `app-release-bundle.aab` : paquet destiné à Google Play Console.

La documentation officielle Bubblewrap confirme ces deux sorties. Le fichier APK est celui à publier sur une page de téléchargement GitHub Releases. Ne jamais publier le keystore ni ses mots de passe avec l'APK.

## Compatibilité Android

Les paquets Android générés par PWABuilder demandent Android 7.0 (API 24) ou plus récent. Les appareils plus anciens ne sont donc pas garantis compatibles. Vérifier le comportement sur plusieurs téléphones réels avant diffusion générale.

## Vérification TWA / Digital Asset Links

Pour afficher l'application sans barre d'adresse du navigateur, Android doit valider le domaine avec un fichier `/.well-known/assetlinks.json` à la racine de l'origine HTTPS, contenant le package ID exact et l'empreinte SHA-256 du certificat qui signe l'APK.

Le site actuel est un GitHub Pages de projet sous le chemin `/InspecteurBot-2.0/`. Le dossier `.well-known` placé dans ce sous-dossier ne répondrait pas à l'URL racine requise `https://limengosocrate-del.github.io/.well-known/assetlinks.json`. Il faut donc un hébergement contrôlé à la racine de l'origine ou un domaine personnalisé avant d'activer la TWA plein écran.

Ne jamais inventer l'empreinte SHA-256. La générer depuis le certificat réel avec lequel l'APK est signé, puis tester l'URL publique. Si la validation échoue, l'application peut s'ouvrir dans un onglet personnalisé avec barre d'adresse au lieu du plein écran.

## Diffusion directe

Après construction et vérification :
1. Tester `app-release-signed.apk` sur plusieurs appareils.
2. Créer une GitHub Release `InspecteurBot-v1.0.0`.
3. Joindre uniquement l'APK signé à la release.
4. Partager le lien de téléchargement public avec les agents.
5. Conserver le keystore et ses mots de passe en sauvegarde hors ligne sécurisée.

Les utilisateurs devront autoriser temporairement l'installation depuis leur navigateur ou leur gestionnaire de fichiers si Android le demande. Ils pourront installer les versions suivantes par-dessus uniquement si le package ID et la clé de signature restent identiques et si le code de version augmente.

## Tests avant diffusion

- Installation et ouverture sur Android 7.0+.
- Connexion et création de compte Supabase.
- Passkeys selon les capacités de l'appareil et du navigateur.
- Annuaire IGT, recherche et photos.
- Messagerie et notifications.
- GPS uniquement après autorisation.
- Liens externes, formulaires, navigation et bouton Retour Android.
- Réseau lent et reprise après perte de connexion.

## Références officielles

- Bubblewrap CLI : https://github.com/GoogleChromeLabs/bubblewrap
- PWABuilder — Android : https://github.com/pwa-builder/PWABuilder/blob/main/docs/builder/android.md
- Guide TWA Android : https://developer.chrome.com/docs/android/trusted-web-activity/quick-start
- Digital Asset Links : https://developer.chrome.com/docs/android/trusted-web-activity/android-for-web-devs
