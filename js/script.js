// ---------------------------------------------------------------------------
// CONFIGURATION
// Paste the URL of your deployed Google Apps Script Web App here.
// See SETUP.md for step-by-step instructions.
// ---------------------------------------------------------------------------
const CONFIG = {
  SCRIPT_URL: "https://script.google.com/macros/s/AKfycbwbX8vh6z_VkGzo5mov40kDHElg7_7exW9vrXus_bdcq24FyiLnF5bUBxGKFu8OaxIB/exec",
  MAX_FILE_SIZE_MB: 8,
};

(function () {
  "use strict";

  const form = document.getElementById("attestationForm");
  const panels = Array.from(document.querySelectorAll(".panel"));
  const steps = Array.from(document.querySelectorAll(".step"));
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");
  const submitLabel = document.getElementById("submitLabel");
  const submitSpinner = document.getElementById("submitSpinner");
  const submitError = document.getElementById("submitError");
  const successState = document.getElementById("successState");
  const newRequestBtn = document.getElementById("newRequestBtn");

  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const dropzoneEmpty = document.getElementById("dropzoneEmpty");
  const dropzoneFile = document.getElementById("dropzoneFile");
  const fileNameEl = document.getElementById("fileName");
  const fileSizeEl = document.getElementById("fileSize");
  const removeFileBtn = document.getElementById("removeFile");

  let currentStep = 1;
  const totalSteps = panels.length;
  let selectedFile = null;

  const FIELD_LABELS = {
    nom: "Nom et Prénom",
    dateNaissance: "Date de naissance",
    lieuNaissance: "Lieu de naissance",
    telephone: "Téléphone",
    typeAttestation: "Type d'attestation",
    langue: "Langue",
    horaire: "Horaire du cours",
    anneeFormation: "Année de formation",
    nomProf: "Nom du professeur",
    file: "Pièce d'identité",
  };

  // -------------------------------------------------------------------
  // Populate "Année de formation" dynamically (current + surrounding years)
  // -------------------------------------------------------------------
  function populateYears() {
    const select = document.getElementById("anneeFormation");
    const now = new Date();
    // school year starts in September; before Sept, we're still in the previous school year
    const startYear = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
    for (let offset = -1; offset <= 1; offset++) {
      const y = startYear + offset;
      const opt = document.createElement("option");
      opt.value = `${y}-${y + 1}`;
      opt.textContent = `${y}-${y + 1}`;
      if (offset === 0) opt.selected = true;
      select.appendChild(opt);
    }
  }
  populateYears();

  // -------------------------------------------------------------------
  // Step navigation
  // -------------------------------------------------------------------
  function showStep(step) {
    panels.forEach((p) => {
      p.hidden = Number(p.dataset.panel) !== step;
    });
    steps.forEach((s) => {
      const n = Number(s.dataset.step);
      s.classList.toggle("active", n === step);
      s.classList.toggle("done", n < step);
    });

    prevBtn.hidden = step === 1;
    nextBtn.hidden = step === totalSteps;
    submitBtn.hidden = step !== totalSteps;

    if (step === totalSteps) renderSummary();

    window.scrollTo({ top: form.offsetTop - 20, behavior: "smooth" });
  }

  function clearError(name) {
    const el = form.querySelector(`[data-error-for="${name}"]`);
    if (el) {
      el.textContent = "";
      el.classList.remove("show");
    }
    const input = form.querySelector(`[name="${name}"]`);
    if (input) input.classList.remove("invalid");
  }

  function setError(name, message) {
    const el = form.querySelector(`[data-error-for="${name}"]`);
    if (el) {
      el.textContent = message;
      el.classList.add("show");
    }
    const input = form.querySelector(`[name="${name}"]`);
    if (input) input.classList.add("invalid");
  }

  function validateStep(step) {
    let valid = true;

    if (step === 1) {
      ["nom", "dateNaissance", "lieuNaissance", "telephone"].forEach((name) => {
        const input = form.querySelector(`[name="${name}"]`);
        clearError(name);
        if (!input.value.trim()) {
          setError(name, `${FIELD_LABELS[name]} est requis.`);
          valid = false;
        }
      });

      const phoneInput = form.querySelector('[name="telephone"]');
      if (phoneInput.value.trim() && !/^[0-9+()\s.-]{6,}$/.test(phoneInput.value.trim())) {
        setError("telephone", "Veuillez saisir un numéro de téléphone valide.");
        valid = false;
      }

      const dobInput = form.querySelector('[name="dateNaissance"]');
      if (dobInput.value && new Date(dobInput.value) > new Date()) {
        setError("dateNaissance", "La date de naissance ne peut pas être dans le futur.");
        valid = false;
      }
    }

    if (step === 2) {
      clearError("typeAttestation");
      if (!form.querySelector('[name="typeAttestation"]:checked')) {
        setError("typeAttestation", "Veuillez choisir un type d'attestation.");
        valid = false;
      }

      clearError("langue");
      if (!form.querySelector('[name="langue"]:checked')) {
        setError("langue", "Veuillez choisir une langue.");
        valid = false;
      }

      ["horaire", "anneeFormation"].forEach((name) => {
        const input = form.querySelector(`[name="${name}"]`);
        clearError(name);
        if (!input.value) {
          setError(name, `${FIELD_LABELS[name]} est requis.`);
          valid = false;
        }
      });
    }

    if (step === 3) {
      clearError("file");
      if (!selectedFile) {
        setError("file", "Veuillez joindre un document d'identité.");
        valid = false;
      }
    }

    if (step === 4) {
      clearError("certify");
      if (!document.getElementById("certify").checked) {
        setError("certify", "Veuillez confirmer l'exactitude des informations.");
        valid = false;
      }
    }

    return valid;
  }

  nextBtn.addEventListener("click", () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  });

  // Clear field errors as user types/selects
  form.addEventListener("input", (e) => {
    if (e.target.name) clearError(e.target.name);
  });
  form.addEventListener("change", (e) => {
    if (e.target.name) clearError(e.target.name);
  });

  // -------------------------------------------------------------------
  // File handling
  // -------------------------------------------------------------------
  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  }

  function acceptFile(file) {
    clearError("file");

    const allowed = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      setError("file", "Format non pris en charge. Utilisez PDF, Word ou image.");
      return;
    }

    const maxBytes = CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError("file", `Le fichier dépasse la taille maximale de ${CONFIG.MAX_FILE_SIZE_MB} Mo.`);
      return;
    }

    selectedFile = file;
    fileNameEl.textContent = file.name;
    fileSizeEl.textContent = formatBytes(file.size);
    dropzoneEmpty.hidden = true;
    dropzoneFile.hidden = false;
  }

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInput.click();
    }
  });

  fileInput.addEventListener("change", () => {
    if (fileInput.files[0]) acceptFile(fileInput.files[0]);
  });

  ["dragenter", "dragover"].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    })
  );

  ["dragleave", "drop"].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
    })
  );

  dropzone.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files[0];
    if (file) acceptFile(file);
  });

  removeFileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedFile = null;
    fileInput.value = "";
    dropzoneEmpty.hidden = false;
    dropzoneFile.hidden = true;
  });

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // -------------------------------------------------------------------
  // Review summary
  // -------------------------------------------------------------------
  function renderSummary() {
    const summary = document.getElementById("summary");
    const data = collectFormData();

    const rows = [
      ["Nom et Prénom", data.nom],
      ["Date de naissance", data.dateNaissance],
      ["Lieu de naissance", data.lieuNaissance],
      ["Téléphone", data.telephone],
      ["Type d'attestation", data.typeAttestation],
      ["Langue", data.langue],
      ["Horaire du cours", data.horaire],
      ["Année de formation", data.anneeFormation],
      ["Nom du professeur", data.nomProf || "—"],
      ["Document joint", selectedFile ? selectedFile.name : "—"],
    ];

    summary.innerHTML = rows
      .map(
        ([label, value]) =>
          `<div class="summary-row"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(String(value || "—"))}</dd></div>`
      )
      .join("");
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function collectFormData() {
    const fd = new FormData(form);
    return {
      nom: fd.get("nom")?.trim() || "",
      dateNaissance: fd.get("dateNaissance") || "",
      lieuNaissance: fd.get("lieuNaissance")?.trim() || "",
      telephone: fd.get("telephone")?.trim() || "",
      typeAttestation: fd.get("typeAttestation") || "",
      langue: fd.get("langue") || "",
      horaire: fd.get("horaire") || "",
      anneeFormation: fd.get("anneeFormation") || "",
      nomProf: fd.get("nomProf")?.trim() || "",
    };
  }

  // -------------------------------------------------------------------
  // Submission
  // -------------------------------------------------------------------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    if (!CONFIG.SCRIPT_URL || CONFIG.SCRIPT_URL.includes("PASTE_YOUR")) {
      submitError.textContent =
        "Le formulaire n'est pas encore connecté à Google Sheets. Voir SETUP.md pour configurer CONFIG.SCRIPT_URL dans js/script.js.";
      submitError.hidden = false;
      return;
    }

    submitError.hidden = true;
    setSubmitting(true);

    try {
      const data = collectFormData();
      let fileData = null;
      if (selectedFile) {
        const base64 = await fileToBase64(selectedFile);
        fileData = {
          name: selectedFile.name,
          mimeType: selectedFile.type || "application/octet-stream",
          base64,
        };
      }

      const payload = { ...data, file: fileData };

      const res = await fetch(CONFIG.SCRIPT_URL, {
        method: "POST",
        // text/plain avoids a CORS preflight against Apps Script
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.result !== "success") {
        throw new Error(json.error || "Erreur inconnue");
      }

      form.hidden = true;
      document.getElementById("steps").hidden = true;
      document.querySelector(".card-intro").hidden = true;
      successState.hidden = false;
    } catch (err) {
      submitError.textContent =
        "Une erreur est survenue lors de l'envoi. Veuillez réessayer. (" + err.message + ")";
      submitError.hidden = false;
    } finally {
      setSubmitting(false);
    }
  });

  function setSubmitting(isSubmitting) {
    submitBtn.disabled = isSubmitting;
    prevBtn.disabled = isSubmitting;
    submitLabel.textContent = isSubmitting ? "Envoi en cours…" : "Envoyer la demande";
    submitSpinner.hidden = !isSubmitting;
  }

  newRequestBtn.addEventListener("click", () => {
    form.reset();
    selectedFile = null;
    fileInput.value = "";
    dropzoneEmpty.hidden = false;
    dropzoneFile.hidden = true;
    populateYears();
    currentStep = 1;
    showStep(currentStep);

    form.hidden = false;
    document.getElementById("steps").hidden = false;
    document.querySelector(".card-intro").hidden = false;
    successState.hidden = true;
  });

  showStep(currentStep);
})();
