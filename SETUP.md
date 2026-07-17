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

## 5. Mettre le formulaire en ligne sur votre propre hébergement (Hostinger)

Votre site tourne sur **Hostinger** — voici comment héberger le formulaire
directement sur votre propre domaine, sans dépendre de GitHub :

1. Un fichier **`attestation-form-upload.zip`** a été préparé sur votre Bureau
   (`~/Desktop/attestation-form-upload.zip`), contenant tous les fichiers
   nécessaires (`index.html`, `css/`, `js/`).
2. Connectez-vous à **hPanel** (panneau Hostinger) → **Fichiers → Gestionnaire de fichiers**.
3. Ouvrez le dossier **`public_html`** (la racine de votre site).
4. Créez un nouveau dossier, par exemple **`attestation`**.
5. Entrez dans ce dossier, cliquez sur **Importer des fichiers** (ou glissez-déposez),
   et envoyez `attestation-form-upload.zip`.
6. Une fois envoyé, faites un clic droit sur le zip dans le gestionnaire de
   fichiers → **Extraire**, puis supprimez le fichier `.zip` (plus nécessaire).
7. Votre formulaire est maintenant en ligne à l'adresse :
   **`https://centreeuropeen.com/attestation/`**

### Mettre à jour la page WordPress existante

Le formulaire lui-même n'a plus de fond (transparent) — le dégradé bleu et le
motif zellij sont appliqués depuis la page WordPress, exactement comme sur
votre page Google Avis. Remplacez tout le contenu du widget HTML Elementor par
celui du fichier [`wordpress-embed-snippet.html`](wordpress-embed-snippet.html)
de ce dossier (aperçu ci-dessous) :

```html
<style>
body {
  background: linear-gradient(135deg,#0c3c7c,#2b73c5) !important;
  margin: 0 !important;
  padding: 0 !important;
  position: relative !important;
}
body::before {
  content: "" !important;
  position: fixed !important;
  inset: 0 !important;
  background-image: url('https://centreeuropeen.com/wp-content/uploads/2026/02/moroccan-zellij.png') !important;
  background-repeat: repeat !important;
  background-size: 220px !important;
  opacity: 0.15 !important;
  z-index: 0 !important;
  pointer-events: none !important;
}
.attestation-wrap {
  position: relative !important;
  z-index: 1 !important;
  max-width: 900px !important;
  margin: 40px auto !important;
  padding: 0 16px !important;
}
#attestationFormFrame {
  width: 100% !important;
  border: none !important;
  display: block !important;
  background: transparent !important;
}
</style>

<div class="attestation-wrap">
  <iframe id="attestationFormFrame"
    src="https://centreeuropeen.com/attestation/"
    title="Formulaire de demande d'attestation"></iframe>
</div>

<script>
window.addEventListener('message', function (e) {
  if (e.origin !== 'https://centreeuropeen.com') return;
  if (e.data && e.data.type === 'attestation-form-height') {
    var frame = document.getElementById('attestationFormFrame');
    if (frame) frame.style.height = e.data.height + 'px';
  }
});
</script>
```

> Si cette page WordPress contient d'autres éléments que le formulaire,
> n'utilisez pas ce snippet tel quel : le sélecteur `body` s'appliquerait à
> toute la page. Dans ce cas, gardez la version avec fond intégré (dégradé +
> motif directement dans le formulaire) au lieu de celle-ci.

### Mettre à jour le formulaire plus tard

Pour tout changement futur (design, textes, champs), il suffira de renvoyer les
fichiers modifiés (`index.html`, `css/style.css`, `js/script.js`) dans le même
dossier `public_html/attestation/` via le gestionnaire de fichiers, en écrasant
les anciens.

### Alternative — intégrer directement dans une page existante
Copiez le contenu de la balise `<main class="card">` de `index.html` dans votre
page actuelle, ajoutez le contenu de `css/style.css` dans une balise `<style>`
(ou en fichier lié), et le contenu de `js/script.js` en bas de page dans une
balise `<script>`.

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
