/**
 * Backend for the "Demande d'attestation" form — EEMSI variant.
 * Deploy this as a Web App (see SETUP.md) bound to EEMSI's own Google Sheet.
 * Same field structure as EEMCI (Code-EEMCI.gs): Motif, Filière, Spécialité,
 * Niveau, Année d'inscription.
 */

const SHEET_NAME = "Réponses";
const DRIVE_FOLDER_NAME = "Attestations - Pièces jointes";

const HEADERS = [
  "Horodatage",
  "École",
  "Nom et Prénom",
  "Date de naissance",
  "Lieu de naissance",
  "Téléphone",
  "Type d'attestation",
  "Motif de la demande",
  "Filière",
  "Spécialité",
  "Niveau de formation",
  "Année d'inscription",
  "Pièce jointe",
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    let fileUrl = "";
    if (data.file && data.file.base64) {
      fileUrl = saveFile(data.file, data.nom);
    }

    sheet.appendRow([
      new Date(),
      data.ecole || "",
      data.nom || "",
      data.dateNaissance || "",
      data.lieuNaissance || "",
      data.telephone || "",
      data.typeAttestation || "",
      data.motif || "",
      data.filiere || "",
      data.specialite || "",
      data.niveau || "",
      data.anneeInscription || "",
      fileUrl,
    ]);

    return jsonResponse({ result: "success" });
  } catch (err) {
    return jsonResponse({ result: "error", error: err.toString() });
  }
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function saveFile(fileData, applicantName) {
  const folder = getOrCreateFolder(DRIVE_FOLDER_NAME);
  // fileData.base64 is a data URL like "data:application/pdf;base64,XXXX"
  const base64Body = fileData.base64.split(",").pop();
  const decoded = Utilities.base64Decode(base64Body);
  const blob = Utilities.newBlob(decoded, fileData.mimeType, fileData.name);
  const file = folder.createFile(blob);
  const safeName = (applicantName || "Sans nom").trim();
  file.setName(`${safeName} - ${file.getName()}`);
  return file.getUrl();
}

function getOrCreateFolder(name) {
  const folders = DriveApp.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(name);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/** Simple health check — visit the deployed URL in a browser to test. */
function doGet() {
  return jsonResponse({ result: "ok", message: "Le formulaire est prêt à recevoir des demandes." });
}
