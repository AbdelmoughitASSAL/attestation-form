// ---------------------------------------------------------------------------
// CONFIGURATION
// Each school has its own Google Sheet, so submissions route to a different
// Apps Script Web App URL depending on which "école" is selected in step 1.
// See SETUP.md for step-by-step instructions on deploying each one.
// ---------------------------------------------------------------------------
const CONFIG = {
  SCRIPT_URLS: {
    "EELI - Centre des Langues": "https://script.google.com/macros/s/AKfycby1LrLkX50pvy3PNvsmmmWwHph5Gl5p4d6Gu5TQ90nCA4aN1caognZkux_RY4nBGs10fw/exec",
    "EEMCI": "https://script.google.com/macros/s/AKfycbwXPI7VnE57MOdIhITao7m2OOOhvmMb7Xf4hgo9iVorE9UqTmD8VJzF7_ZihDkjKqom/exec",
    "EEMSI": "https://script.google.com/macros/s/AKfycbyVEms31_4G6xn0ZLRzyWwLqXpuITMkjri4DDVeftvoM5SSBswpamJU4SgiygZuAcvFqw/exec",
  },
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

  const FIELD_LABEL_KEYS = {
    ecole: "label_ecole",
    nom: "label_nom",
    dateNaissance: "label_dateNaissance",
    lieuNaissance: "label_lieuNaissance",
    telephone: "label_telephone",
    typeAttestation: "label_typeAttestation",
    langue: "label_langue",
    horaire: "label_horaire",
    anneeFormation: "label_anneeFormation",
    nomProf: "label_nomProf",
    file: "label_file",
    motif: "label_motif",
    filiere: "label_filiere",
    specialite: "label_specialite",
    niveau: "label_niveau",
    anneeInscription: "label_anneeInscription",
  };

  // Which "école" maps to which field-set variant in step 3. EEMCI and EEMSI
  // share the same "career school" variant (identical structure: Motif,
  // Filière, Spécialité, Niveau, Année d'inscription) — only the filière
  // list and niveau option count differ, populated dynamically below.
  const SCHOOL_VARIANT_BY_ECOLE = {
    "EELI - Centre des Langues": "EELI - Centre des Langues",
    EEMCI: "EEMCI",
    EEMSI: "EEMCI",
  };

  function getSelectedEcole() {
    const checked = form.querySelector('[name="ecole"]:checked');
    return checked ? checked.value : "";
  }

  function getActiveVariant() {
    return SCHOOL_VARIANT_BY_ECOLE[getSelectedEcole()] || "EELI - Centre des Langues";
  }

  // -------------------------------------------------------------------
  // Career-school (EEMCI/EEMSI) filière + niveau options, per school
  // -------------------------------------------------------------------
  const FILIERE_CONFIG_BY_ECOLE = {
    EEMCI: {
      niveauOptions: ["1ère Année", "2ème Année"],
      specialiteTriggers: ["LP FEDE", "LP WES'SUP", "MASTER FEDE", "MASTER WES'SUP"],
      groups: [
        {
          labelKey: "filiere_group_bac2",
          options: [
            ["Gestion Informatisée", "filiere_1"],
            ["Action Commerciale et Marketing", "filiere_2"],
            ["Réception d'Hôtel", "filiere_3"],
            ["Gestion des Entreprises", "filiere_4"],
            ["Commerce International", "filiere_5"],
            ["Financier Comptable", "filiere_6"],
            ["Développement Informatique", "filiere_7"],
            ["Systèmes et Réseaux Informatiques", "filiere_8"],
            ["Gestion Hôtelière", "filiere_9"],
            ["Cyber Sécurité", "filiere_10"],
            ["Intelligence Artificielle", "filiere_11"],
          ],
        },
        {
          labelKey: "filiere_group_lp",
          options: [
            ["LP FEDE", "filiere_12"],
            ["LP WES'SUP", "filiere_13"],
          ],
        },
        {
          labelKey: "filiere_group_master",
          options: [
            ["MASTER FEDE", "filiere_14"],
            ["MASTER WES'SUP", "filiere_15"],
          ],
        },
        {
          labelKey: "filiere_group_continue",
          options: [
            ["Formation Continue (Certificat Bureautique, Management, Comptabilité, etc...)", "filiere_16"],
          ],
        },
      ],
    },
    EEMSI: {
      niveauOptions: ["1ère Année", "2ème Année", "3ème Année"],
      specialiteTriggers: ["LP", "MASTER"],
      groups: [
        {
          labelKey: "filiere_group_sante",
          options: [
            ["Aide Soignant", "filiere_s1"],
            ["Infirmier Auxiliaire", "filiere_s2"],
            ["Infirmier Polyvalent", "filiere_s3"],
            ["Sage Femme", "filiere_s4"],
            ["Kinésithérapeute", "filiere_s5"],
            ["Anesthésie Réanimation", "filiere_s6"],
          ],
        },
        {
          labelKey: "filiere_group_autres",
          options: [
            ["LP", "filiere_lp_generic"],
            ["MASTER", "filiere_master_generic"],
            ["Formation Continue (Certificat Auxiliaire de santé, etc...)", "filiere_fc_sante"],
          ],
        },
      ],
    },
  };

  const filiereSelect = document.getElementById("filiere");
  const specialiteField = document.getElementById("specialiteField");
  const niveau3Pill = document.getElementById("niveau3Pill");
  let specialiteTriggers = [];

  function populateFiliereForEcole(ecole) {
    const config = FILIERE_CONFIG_BY_ECOLE[ecole] || FILIERE_CONFIG_BY_ECOLE.EEMCI;
    specialiteTriggers = config.specialiteTriggers;

    filiereSelect.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.dataset.i18n = "filiere_placeholder";
    filiereSelect.appendChild(placeholder);

    config.groups.forEach((group) => {
      const optgroup = document.createElement("optgroup");
      optgroup.dataset.i18nLabel = group.labelKey;
      group.options.forEach(([value, key]) => {
        const opt = document.createElement("option");
        opt.value = value;
        opt.dataset.i18n = key;
        optgroup.appendChild(opt);
      });
      filiereSelect.appendChild(optgroup);
    });

    niveau3Pill.hidden = !config.niveauOptions.includes("3ème Année");
    specialiteField.hidden = true;

    applyLanguage(currentLang);
  }

  function applySchoolVariant() {
    const active = getActiveVariant();
    document.querySelectorAll(".school-variant").forEach((el) => {
      el.hidden = el.dataset.schoolVariant !== active;
    });
    if (active === "EEMCI") {
      populateFiliereForEcole(getSelectedEcole());
    }
  }

  form.querySelectorAll('[name="ecole"]').forEach((input) => {
    input.addEventListener("change", applySchoolVariant);
  });
  applySchoolVariant();

  if (filiereSelect) {
    filiereSelect.addEventListener("change", () => {
      specialiteField.hidden = !specialiteTriggers.includes(filiereSelect.value);
    });
  }

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
      clearError("ecole");
      if (!form.querySelector('[name="ecole"]:checked')) {
        setError("ecole", t("err_ecole_required"));
        valid = false;
      }
    }

    if (step === 2) {
      ["nom", "dateNaissance", "lieuNaissance", "telephone"].forEach((name) => {
        const input = form.querySelector(`[name="${name}"]`);
        clearError(name);
        if (!input.value.trim()) {
          setError(name, t("err_required", { field: t(FIELD_LABEL_KEYS[name]) }));
          valid = false;
        }
      });

      const phoneInput = form.querySelector('[name="telephone"]');
      if (phoneInput.value.trim() && !/^[0-9+()\s.-]{6,}$/.test(phoneInput.value.trim())) {
        setError("telephone", t("err_phone_invalid"));
        valid = false;
      }

      const dobInput = form.querySelector('[name="dateNaissance"]');
      if (dobInput.value && new Date(dobInput.value) > new Date()) {
        setError("dateNaissance", t("err_dob_future"));
        valid = false;
      }
    }

    if (step === 3 && getActiveVariant() === "EEMCI") {
      clearError("typeAttestationEemci");
      if (!form.querySelector('[name="typeAttestation"]:checked')) {
        setError("typeAttestationEemci", t("err_typeAttestation_required"));
        valid = false;
      }

      ["motif", "filiere", "anneeInscription"].forEach((name) => {
        const input = form.querySelector(`[name="${name}"]`);
        clearError(name);
        if (!input.value.trim()) {
          setError(name, t("err_required", { field: t(FIELD_LABEL_KEYS[name]) }));
          valid = false;
        }
      });
    } else if (step === 3) {
      clearError("typeAttestation");
      if (!form.querySelector('[name="typeAttestation"]:checked')) {
        setError("typeAttestation", t("err_typeAttestation_required"));
        valid = false;
      }

      clearError("langue");
      if (!form.querySelector('[name="langue"]:checked')) {
        setError("langue", t("err_langue_required"));
        valid = false;
      }

      ["horaire", "anneeFormation"].forEach((name) => {
        const input = form.querySelector(`[name="${name}"]`);
        clearError(name);
        if (!input.value) {
          setError(name, t("err_required", { field: t(FIELD_LABEL_KEYS[name]) }));
          valid = false;
        }
      });
    }

    if (step === 4) {
      clearError("file");
      if (!selectedFile) {
        setError("file", t("err_file_required"));
        valid = false;
      }
    }

    if (step === 5) {
      clearError("certify");
      if (!document.getElementById("certify").checked) {
        setError("certify", t("err_certify_required"));
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
      setError("file", t("err_file_type"));
      return;
    }

    const maxBytes = CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError("file", t("err_file_size", { max: CONFIG.MAX_FILE_SIZE_MB }));
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
  // Radio/select values stay canonical French (see i18n.js), so map them
  // back to a translation key to display them in the visitor's language.
  // -------------------------------------------------------------------
  const ECOLE_KEY_BY_VALUE = {
    "EELI - Centre des Langues": "opt_eeli",
    EEMCI: "opt_eemci",
    EEMSI: "opt_eemsi",
  };

  const ATTESTATION_KEY_BY_VALUE = {
    "Attestation d'inscription": "opt_inscription",
    "Attestation de scolarité": "opt_scolarite",
    "Attestation de fin de formation": "opt_finFormation",
    "Attestation homologuée": "opt_homologuee",
    "Attestation de réussite": "opt_reussite",
  };

  const FILIERE_KEY_BY_VALUE = {
    "Gestion Informatisée": "filiere_1",
    "Action Commerciale et Marketing": "filiere_2",
    "Réception d'Hôtel": "filiere_3",
    "Gestion des Entreprises": "filiere_4",
    "Commerce International": "filiere_5",
    "Financier Comptable": "filiere_6",
    "Développement Informatique": "filiere_7",
    "Systèmes et Réseaux Informatiques": "filiere_8",
    "Gestion Hôtelière": "filiere_9",
    "Cyber Sécurité": "filiere_10",
    "Intelligence Artificielle": "filiere_11",
    "LP FEDE": "filiere_12",
    "LP WES'SUP": "filiere_13",
    "MASTER FEDE": "filiere_14",
    "MASTER WES'SUP": "filiere_15",
    "Formation Continue (Certificat Bureautique, Management, Comptabilité, etc...)": "filiere_16",
  };

  const NIVEAU_KEY_BY_VALUE = {
    "1ère Année": "niveau_1",
    "2ème Année": "niveau_2",
  };

  const LANGUE_KEY_BY_VALUE = {
    Allemande: "lang_allemande",
    Anglaise: "lang_anglaise",
    Espagnole: "lang_espagnole",
    Française: "lang_francaise",
    Italienne: "lang_italienne",
    Néerlandaise: "lang_neerlandaise",
    Arabe: "lang_arabe",
  };

  const HORAIRE_KEY_BY_VALUE = {
    "Matin 8h30-10h30": "horaire_1",
    "Cours Accélérés 9h30-12h30": "horaire_2",
    "Matin 10h30-12h30": "horaire_3",
    "Ap Midi 14h30-16h30": "horaire_4",
    "Cours Accélérés 15h-18h": "horaire_5",
    "Ap Midi 16h30-18h30": "horaire_6",
    "Cours du jour 16h30-18h": "horaire_7",
    "Cours Accélérés 18h-21h": "horaire_8",
    "Cours du soir 18h30-20h": "horaire_9",
    "Soir 19h-21h": "horaire_10",
    "Samedi Ap Midi 15h-18h": "horaire_11",
    "Dimanche Matin 10h-13h": "horaire_12",
  };

  function renderSummary() {
    const summary = document.getElementById("summary");
    const data = collectFormData();

    const rows = [
      [t("label_ecole"), data.ecole ? t(ECOLE_KEY_BY_VALUE[data.ecole]) : ""],
      [t("label_nom"), data.nom],
      [t("label_dateNaissance"), data.dateNaissance],
      [t("label_lieuNaissance"), data.lieuNaissance],
      [t("label_telephone"), data.telephone],
      [t("label_typeAttestation"), data.typeAttestation ? t(ATTESTATION_KEY_BY_VALUE[data.typeAttestation]) : ""],
    ];

    if (getActiveVariant() === "EEMCI") {
      rows.push(
        [t("label_motif"), data.motif],
        [t("label_filiere"), data.filiere ? t(FILIERE_KEY_BY_VALUE[data.filiere]) : ""],
        [t("label_specialite"), data.specialite || "—"],
        [t("label_niveau"), data.niveau ? t(NIVEAU_KEY_BY_VALUE[data.niveau]) : "—"],
        [t("label_anneeInscription"), data.anneeInscription]
      );
    } else {
      rows.push(
        [t("label_langue"), data.langue ? t(LANGUE_KEY_BY_VALUE[data.langue]) : ""],
        [t("label_horaire"), data.horaire ? t(HORAIRE_KEY_BY_VALUE[data.horaire]) : ""],
        [t("label_anneeFormation"), data.anneeFormation],
        [t("label_nomProf"), data.nomProf || "—"]
      );
    }

    rows.push([t("summary_document"), selectedFile ? selectedFile.name : "—"]);

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
      ecole: fd.get("ecole") || "",
      nom: fd.get("nom")?.trim() || "",
      dateNaissance: fd.get("dateNaissance") || "",
      lieuNaissance: fd.get("lieuNaissance")?.trim() || "",
      telephone: fd.get("telephone")?.trim() || "",
      typeAttestation: fd.get("typeAttestation") || "",
      langue: fd.get("langue") || "",
      horaire: fd.get("horaire") || "",
      anneeFormation: fd.get("anneeFormation") || "",
      nomProf: fd.get("nomProf")?.trim() || "",
      motif: fd.get("motif")?.trim() || "",
      filiere: fd.get("filiere") || "",
      specialite: fd.get("specialite")?.trim() || "",
      niveau: fd.get("niveau") || "",
      anneeInscription: fd.get("anneeInscription")?.trim() || "",
    };
  }

  // -------------------------------------------------------------------
  // Submission
  // -------------------------------------------------------------------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateStep(totalSteps)) return;

    const data = collectFormData();
    const scriptUrl = CONFIG.SCRIPT_URLS[data.ecole];

    if (!scriptUrl || scriptUrl.includes("PASTE_YOUR")) {
      submitError.textContent = t("submit_not_configured");
      submitError.hidden = false;
      return;
    }

    submitError.hidden = true;
    setSubmitting(true);

    try {
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

      const res = await fetch(scriptUrl, {
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
      submitError.textContent = t("submit_generic_error") + " (" + err.message + ")";
      submitError.hidden = false;
    } finally {
      setSubmitting(false);
    }
  });

  function setSubmitting(isSubmitting) {
    submitBtn.disabled = isSubmitting;
    prevBtn.disabled = isSubmitting;
    submitLabel.textContent = isSubmitting ? t("btn_submitting") : t("btn_submit");
    submitSpinner.hidden = !isSubmitting;
  }

  newRequestBtn.addEventListener("click", () => {
    form.reset();
    selectedFile = null;
    fileInput.value = "";
    dropzoneEmpty.hidden = false;
    dropzoneFile.hidden = true;
    populateYears();
    applySchoolVariant();
    if (specialiteField) specialiteField.hidden = true;
    currentStep = 1;
    showStep(currentStep);

    form.hidden = false;
    document.getElementById("steps").hidden = false;
    document.querySelector(".card-intro").hidden = false;
    successState.hidden = true;
  });

  document.addEventListener("formlanguagechange", () => {
    if (currentStep === totalSteps) renderSummary();
  });

  showStep(currentStep);
})();

// ---------------------------------------------------------------------------
// Iframe embedding support: report our height to the parent page (e.g. a
// WordPress site embedding this form) so it can resize the iframe and avoid
// an inner scrollbar. Harmless if the page isn't embedded in an iframe.
// ---------------------------------------------------------------------------
(function () {
  if (window.parent === window) return;

  let lastHeight = 0;
  function reportHeight() {
    const height = document.documentElement.scrollHeight;
    if (height === lastHeight) return;
    lastHeight = height;
    window.parent.postMessage({ type: "attestation-form-height", height }, "*");
  }

  // ResizeObserver gives near-instant updates; the interval is a defensive
  // fallback so the iframe still resizes correctly even if a browser drops
  // the observer (e.g. no persistent reference kept elsewhere).
  const resizeObserver = new ResizeObserver(reportHeight);
  resizeObserver.observe(document.body);
  window.__attestationResizeObserver = resizeObserver;

  window.addEventListener("load", reportHeight);
  document.addEventListener("formlanguagechange", reportHeight);
  setInterval(reportHeight, 400);
  reportHeight();
})();
