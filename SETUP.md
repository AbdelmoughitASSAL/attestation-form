# Mise en place du formulaire d'attestation

Ce dossier contient un formulaire web autonome (HTML/CSS/JS) qui remplace le
Google Form, avec un meilleur design et une expérience en plusieurs étapes.
Les réponses sont enregistrées dans un Google Sheet, et les pièces d'identité
jointes sont sauvegardées dans un dossier Google Drive — sans obliger vos
visiteurs à se connecter avec un compte Google.

Fichiers :
- `index.html` — la page du formulaire
- `css/style.css` — le design
- `js/script.js` — la logique (étapes, validation, envoi)
- `apps-script/Code.gs` — le code backend à coller dans Google Sheets

## 1. Créer le Google Sheet qui recevra les réponses

1. Allez sur [sheets.google.com](https://sheets.google.com) et créez une nouvelle feuille de calcul.
   Nommez-la par exemple **"Demandes d'attestation"**.
2. Menu **Extensions → Apps Script**.
3. Supprimez le contenu par défaut du fichier `Code.gs`, puis collez-y
   tout le contenu du fichier [`apps-script/Code.gs`](apps-script/Code.gs) de ce dossier.
4. Cliquez sur l'icône de sauvegarde (💾) en haut.

## 2. Déployer le script en tant qu'application web

1. Toujours dans l'éditeur Apps Script, cliquez sur **Déployer → Nouveau déploiement**.
2. Cliquez sur l'icône ⚙️ à côté de "Sélectionner le type" et choisissez **Application Web**.
3. Configurez :
   - **Exécuter en tant que** : Moi (votre compte)
   - **Qui a accès** : Tout le monde
4. Cliquez sur **Déployer**.
5. Google vous demandera d'autoriser le script (c'est votre propre script, sur votre
   propre compte) — cliquez sur **Autoriser l'accès**, choisissez votre compte, puis
   (si un écran "Google n'a pas vérifié cette application" apparaît) cliquez sur
   **Paramètres avancés → Accéder à [nom du projet] (non sécurisé)**. C'est normal
   pour un script que vous avez écrit vous-même.
6. Copiez l'**URL de l'application Web** affichée (elle ressemble à
   `https://script.google.com/macros/s/XXXXXXXX/exec`).

> Vous pouvez tester cette URL directement dans votre navigateur : elle doit
> afficher `{"result":"ok","message":"Le formulaire est prêt..."}`.

## 3. Connecter le formulaire à votre script

1. Ouvrez [`js/script.js`](js/script.js).
2. Tout en haut, remplacez :
   ```js
   const CONFIG = {
     SCRIPT_URL: "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE",
     ...
   ```
   par l'URL copiée à l'étape précédente :
   ```js
   const CONFIG = {
     SCRIPT_URL: "https://script.google.com/macros/s/XXXXXXXX/exec",
     ...
   ```
3. Enregistrez le fichier.

## 4. Tester en local

Ouvrez simplement `index.html` dans votre navigateur (double-clic), remplissez
le formulaire avec des données de test et envoyez-le. Vérifiez que :
- Une nouvelle ligne apparaît dans votre Google Sheet (onglet "Réponses").
- Le fichier joint apparaît dans le dossier Drive **"Attestations - Pièces jointes"**.

## 5. Mettre le formulaire en ligne sur votre site

Ce formulaire est un site statique — il fonctionne sur n'importe quel hébergement.
Choisissez l'option qui correspond à votre site :

### Option A — Vous avez déjà un hébergement (cPanel/FTP)
Envoyez tout le contenu de ce dossier (`index.html`, `css/`, `js/`) via FTP ou le
gestionnaire de fichiers de votre hébergeur, dans le dossier public de votre site
(souvent `public_html/`), par exemple dans un sous-dossier
`public_html/attestation/`. Le formulaire sera accessible à
`https://votre-site.com/attestation/`.

### Option B — Intégrer le formulaire dans une page existante
Copiez le contenu de la balise `<main class="card">` de `index.html` dans votre
page actuelle, ajoutez le contenu de `css/style.css` dans une balise `<style>`
(ou en fichier lié), et le contenu de `js/script.js` en bas de page dans une
balise `<script>`.

### Option C — Vous n'avez pas encore d'hébergement
Le plus simple et gratuit :
1. Créez un compte sur [Netlify](https://app.netlify.com/drop).
2. Glissez-déposez ce dossier entier sur la page — le site est mis en ligne
   instantanément avec une URL `https://xxxx.netlify.app`.
3. Vous pourrez ensuite relier un nom de domaine personnalisé si besoin.

## Sécurité et confidentialité

- Le script Apps Script s'exécute avec **votre** compte Google, mais seule
  l'action précise codée dans `Code.gs` (ajouter une ligne, enregistrer un
  fichier) est exécutée — les visiteurs n'ont aucun accès à votre compte Drive
  ou Sheets.
- Les pièces d'identité sont stockées uniquement dans le dossier Drive dédié,
  visible seulement par vous (propriétaire du Sheet).
- Pensez à limiter l'accès au Google Sheet et au dossier Drive aux personnes
  autorisées de l'école, car il contient des données personnelles (CNI,
  passeport, téléphone).
