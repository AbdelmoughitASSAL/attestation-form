// ---------------------------------------------------------------------------
// i18n — translations are DISPLAY ONLY.
// Radio/select VALUES stay in French (canonical) so every submission lands
// in the Google Sheet in a consistent language, regardless of what language
// the visitor used to fill the form.
// ---------------------------------------------------------------------------
const LANG_META = {
  fr: { dir: "ltr", label: "FR" },
  en: { dir: "ltr", label: "EN" },
  ar: { dir: "rtl", label: "عربي" },
};

const TRANSLATIONS = {
  fr: {
    brand_subtitle: "Demande d'attestation",
    eyebrow: "Formulaire officiel",
    h1_title: "Formulaire de demande d'attestation",
    intro_text: "Remplissez ce formulaire pour demander votre attestation. Les champs marqués <span class=\"req\">*</span> sont obligatoires.",
    step1: "Informations",
    step2: "Attestation",
    step3: "Document",
    step4: "Envoi",
    step1_heading: "Vos informations personnelles",
    label_nom: "Nom et Prénom",
    placeholder_nom: "ex. Fatima Zahra El Amrani",
    label_dateNaissance: "Date de naissance",
    label_lieuNaissance: "Lieu de naissance",
    placeholder_lieuNaissance: "ex. Meknès",
    label_telephone: "Numéro de téléphone",
    placeholder_telephone: "ex. 06 12 34 56 78",
    step2_heading: "Détails de l'attestation",
    label_typeAttestation: "Type d'attestation",
    opt_inscription: "Attestation d'inscription",
    opt_scolarite: "Attestation de scolarité",
    opt_finFormation: "Attestation de fin de formation",
    label_langue: "Langue",
    lang_allemande: "Allemande",
    lang_anglaise: "Anglaise",
    lang_espagnole: "Espagnole",
    lang_francaise: "Française",
    lang_italienne: "Italienne",
    lang_neerlandaise: "Néerlandaise",
    lang_arabe: "Arabe",
    label_horaire: "Horaire du cours",
    horaire_placeholder: "Choisir un horaire…",
    horaire_group_matin: "Matin",
    horaire_group_apresmidi: "Après-midi",
    horaire_group_soir: "Soir",
    horaire_group_weekend: "Week-end",
    horaire_1: "Matin 8h30-10h30",
    horaire_2: "Cours Accélérés 9h30-12h30",
    horaire_3: "Matin 10h30-12h30",
    horaire_4: "Ap Midi 14h30-16h30",
    horaire_5: "Cours Accélérés 15h-18h",
    horaire_6: "Ap Midi 16h30-18h30",
    horaire_7: "Cours du jour 16h30-18h",
    horaire_8: "Cours Accélérés 18h-21h",
    horaire_9: "Cours du soir 18h30-20h",
    horaire_10: "Soir 19h-21h",
    horaire_11: "Samedi Ap Midi 15h-18h",
    horaire_12: "Dimanche Matin 10h-13h",
    label_anneeFormation: "Année de formation",
    annee_placeholder: "Choisir une année…",
    label_nomProf: "Nom du professeur",
    optional_text: "(facultatif)",
    placeholder_nomProf: "ex. M. Bennani",
    label_file: "Pièce d'identité",
    step3_heading: "Pièce d'identité",
    step3_sub: "Joignez une copie de votre CNI, passeport ou tout autre document d'identité valide.",
    dropzone_line: "<strong>Cliquez pour importer</strong> ou glissez-déposez un fichier",
    dropzone_hint: "PDF, Word ou image — 8 Mo max.",
    remove_file_aria: "Supprimer le fichier",
    step4_heading: "Vérifiez et envoyez",
    step4_sub: "Merci de vérifier vos informations avant l'envoi.",
    checkbox_certify: "J'atteste que les informations fournies ci-dessus sont exactes. <span class=\"req\">*</span>",
    btn_prev: "Précédent",
    btn_next: "Suivant",
    btn_submit: "Envoyer la demande",
    btn_submitting: "Envoi en cours…",
    btn_newRequest: "Faire une nouvelle demande",
    success_heading: "Demande envoyée avec succès",
    success_text: "Votre demande d'attestation a bien été enregistrée. Vous serez contacté(e) au numéro fourni dès qu'elle sera prête.",
    footer_text: "École Européenne des Langues Internationales — Formulaire sécurisé",
    summary_document: "Document joint",
    err_required: "{field} est requis.",
    err_phone_invalid: "Veuillez saisir un numéro de téléphone valide.",
    err_dob_future: "La date de naissance ne peut pas être dans le futur.",
    err_typeAttestation_required: "Veuillez choisir un type d'attestation.",
    err_langue_required: "Veuillez choisir une langue.",
    err_file_required: "Veuillez joindre un document d'identité.",
    err_file_type: "Format non pris en charge. Utilisez PDF, Word ou image.",
    err_file_size: "Le fichier dépasse la taille maximale de {max} Mo.",
    err_certify_required: "Veuillez confirmer l'exactitude des informations.",
    submit_not_configured: "Le formulaire n'est pas encore connecté à Google Sheets. Voir SETUP.md pour configurer CONFIG.SCRIPT_URL dans js/script.js.",
    submit_generic_error: "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
  },

  en: {
    brand_subtitle: "Certificate Request",
    eyebrow: "Official form",
    h1_title: "Certificate Request Form",
    intro_text: "Fill out this form to request your certificate. Fields marked <span class=\"req\">*</span> are required.",
    step1: "Information",
    step2: "Certificate",
    step3: "Document",
    step4: "Submit",
    step1_heading: "Your personal information",
    label_nom: "Full name",
    placeholder_nom: "e.g. Fatima Zahra El Amrani",
    label_dateNaissance: "Date of birth",
    label_lieuNaissance: "Place of birth",
    placeholder_lieuNaissance: "e.g. Meknès",
    label_telephone: "Phone number",
    placeholder_telephone: "e.g. 06 12 34 56 78",
    step2_heading: "Certificate details",
    label_typeAttestation: "Certificate type",
    opt_inscription: "Enrollment certificate",
    opt_scolarite: "Attendance certificate",
    opt_finFormation: "Completion certificate",
    label_langue: "Language",
    lang_allemande: "German",
    lang_anglaise: "English",
    lang_espagnole: "Spanish",
    lang_francaise: "French",
    lang_italienne: "Italian",
    lang_neerlandaise: "Dutch",
    lang_arabe: "Arabic",
    label_horaire: "Course schedule",
    horaire_placeholder: "Choose a schedule…",
    horaire_group_matin: "Morning",
    horaire_group_apresmidi: "Afternoon",
    horaire_group_soir: "Evening",
    horaire_group_weekend: "Weekend",
    horaire_1: "Morning 8:30–10:30",
    horaire_2: "Intensive course 9:30–12:30",
    horaire_3: "Morning 10:30–12:30",
    horaire_4: "Afternoon 2:30–4:30 PM",
    horaire_5: "Intensive course 3–6 PM",
    horaire_6: "Afternoon 4:30–6:30 PM",
    horaire_7: "Day course 4:30–6 PM",
    horaire_8: "Intensive course 6–9 PM",
    horaire_9: "Evening course 6:30–8 PM",
    horaire_10: "Evening 7–9 PM",
    horaire_11: "Saturday afternoon 3–6 PM",
    horaire_12: "Sunday morning 10 AM–1 PM",
    label_anneeFormation: "Academic year",
    annee_placeholder: "Choose a year…",
    label_nomProf: "Teacher's name",
    optional_text: "(optional)",
    placeholder_nomProf: "e.g. Mr. Bennani",
    label_file: "Identity document",
    step3_heading: "Identity document",
    step3_sub: "Attach a copy of your ID card, passport, or other valid proof of identity.",
    dropzone_line: "<strong>Click to upload</strong> or drag and drop a file",
    dropzone_hint: "PDF, Word, or image — 8 MB max.",
    remove_file_aria: "Remove file",
    step4_heading: "Review and submit",
    step4_sub: "Please review your information before sending.",
    checkbox_certify: "I certify that the information provided above is accurate. <span class=\"req\">*</span>",
    btn_prev: "Back",
    btn_next: "Next",
    btn_submit: "Submit request",
    btn_submitting: "Sending…",
    btn_newRequest: "Make a new request",
    success_heading: "Request sent successfully",
    success_text: "Your certificate request has been recorded. You'll be contacted at the number provided once it's ready.",
    footer_text: "École Européenne des Langues Internationales — Secure form",
    summary_document: "Attached document",
    err_required: "{field} is required.",
    err_phone_invalid: "Please enter a valid phone number.",
    err_dob_future: "Date of birth cannot be in the future.",
    err_typeAttestation_required: "Please choose a certificate type.",
    err_langue_required: "Please choose a language.",
    err_file_required: "Please attach an identity document.",
    err_file_type: "Unsupported format. Use PDF, Word, or an image.",
    err_file_size: "The file exceeds the maximum size of {max} MB.",
    err_certify_required: "Please confirm the information is accurate.",
    submit_not_configured: "The form isn't connected to Google Sheets yet. See SETUP.md to configure CONFIG.SCRIPT_URL in js/script.js.",
    submit_generic_error: "An error occurred while sending. Please try again.",
  },

  ar: {
    brand_subtitle: "طلب شهادة",
    eyebrow: "استمارة رسمية",
    h1_title: "استمارة طلب شهادة",
    intro_text: "يرجى تعبئة هذه الاستمارة لطلب شهادتكم. الحقول المشار إليها بـ <span class=\"req\">*</span> إلزامية.",
    step1: "المعلومات",
    step2: "الشهادة",
    step3: "الوثيقة",
    step4: "الإرسال",
    step1_heading: "معلوماتكم الشخصية",
    label_nom: "الاسم الكامل",
    placeholder_nom: "مثال: فاطمة الزهراء العمراني",
    label_dateNaissance: "تاريخ الازدياد",
    label_lieuNaissance: "مكان الازدياد",
    placeholder_lieuNaissance: "مثال: مكناس",
    label_telephone: "رقم الهاتف",
    placeholder_telephone: "مثال: 06 12 34 56 78",
    step2_heading: "تفاصيل الشهادة",
    label_typeAttestation: "نوع الشهادة",
    opt_inscription: "شهادة التسجيل",
    opt_scolarite: "شهادة الدراسة",
    opt_finFormation: "شهادة نهاية التكوين",
    label_langue: "اللغة",
    lang_allemande: "الألمانية",
    lang_anglaise: "الإنجليزية",
    lang_espagnole: "الإسبانية",
    lang_francaise: "الفرنسية",
    lang_italienne: "الإيطالية",
    lang_neerlandaise: "الهولندية",
    lang_arabe: "العربية",
    label_horaire: "توقيت الحصص",
    horaire_placeholder: "اختر توقيتاً…",
    horaire_group_matin: "صباحاً",
    horaire_group_apresmidi: "بعد الظهر",
    horaire_group_soir: "مساءً",
    horaire_group_weekend: "عطلة نهاية الأسبوع",
    horaire_1: "صباحاً 8:30-10:30",
    horaire_2: "دورة مكثفة 9:30-12:30",
    horaire_3: "صباحاً 10:30-12:30",
    horaire_4: "بعد الظهر 14:30-16:30",
    horaire_5: "دورة مكثفة 15:00-18:00",
    horaire_6: "بعد الظهر 16:30-18:30",
    horaire_7: "حصة نهارية 16:30-18:00",
    horaire_8: "دورة مكثفة 18:00-21:00",
    horaire_9: "حصة مسائية 18:30-20:00",
    horaire_10: "مساءً 19:00-21:00",
    horaire_11: "السبت بعد الظهر 15:00-18:00",
    horaire_12: "الأحد صباحاً 10:00-13:00",
    label_anneeFormation: "سنة التكوين",
    annee_placeholder: "اختر سنة…",
    label_nomProf: "اسم الأستاذ(ة)",
    optional_text: "(اختياري)",
    placeholder_nomProf: "مثال: السيد بناني",
    label_file: "وثيقة الهوية",
    step3_heading: "وثيقة الهوية",
    step3_sub: "يرجى إرفاق نسخة من البطاقة الوطنية أو جواز السفر أو أي وثيقة هوية سارية المفعول.",
    dropzone_line: "<strong>انقر للاستيراد</strong> أو اسحب وأفلت ملفاً",
    dropzone_hint: "PDF أو Word أو صورة — 8 ميغابايت كحد أقصى.",
    remove_file_aria: "حذف الملف",
    step4_heading: "التحقق والإرسال",
    step4_sub: "يرجى التحقق من معلوماتكم قبل الإرسال.",
    checkbox_certify: "أُقرّ بأن المعلومات المذكورة أعلاه صحيحة. <span class=\"req\">*</span>",
    btn_prev: "السابق",
    btn_next: "التالي",
    btn_submit: "إرسال الطلب",
    btn_submitting: "جارٍ الإرسال…",
    btn_newRequest: "تقديم طلب جديد",
    success_heading: "تم إرسال الطلب بنجاح",
    success_text: "تم تسجيل طلب شهادتكم بنجاح. سيتم الاتصال بكم على الرقم المُقدَّم بمجرد أن تصبح جاهزة.",
    footer_text: "المدرسة الأوروبية للغات الدولية — استمارة آمنة",
    summary_document: "الوثيقة المرفقة",
    err_required: "{field} مطلوب.",
    err_phone_invalid: "يرجى إدخال رقم هاتف صحيح.",
    err_dob_future: "لا يمكن أن يكون تاريخ الازدياد في المستقبل.",
    err_typeAttestation_required: "يرجى اختيار نوع الشهادة.",
    err_langue_required: "يرجى اختيار اللغة.",
    err_file_required: "يرجى إرفاق وثيقة الهوية.",
    err_file_type: "صيغة غير مدعومة. استخدم PDF أو Word أو صورة.",
    err_file_size: "حجم الملف يتجاوز الحد الأقصى البالغ {max} ميغابايت.",
    err_certify_required: "يرجى تأكيد صحة المعلومات.",
    submit_not_configured: "لم يتم بعد ربط الاستمارة بـ Google Sheets. راجع ملف SETUP.md لضبط CONFIG.SCRIPT_URL في js/script.js.",
    submit_generic_error: "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",
  },
};

let currentLang = localStorage.getItem("formLang") || "fr";

function t(key, vars) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.fr;
  let str = dict[key] ?? TRANSLATIONS.fr[key] ?? key;
  if (vars) {
    for (const k in vars) str = str.replace(`{${k}}`, vars[k]);
  }
  return str;
}

function applyLanguage(lang) {
  if (!TRANSLATIONS[lang]) lang = "fr";
  currentLang = lang;
  localStorage.setItem("formLang", lang);

  document.documentElement.lang = lang;
  document.documentElement.dir = LANG_META[lang].dir;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAriaLabel));
  });
  document.querySelectorAll("optgroup[data-i18n-label]").forEach((el) => {
    el.label = t(el.dataset.i18nLabel);
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
    btn.setAttribute("aria-pressed", btn.dataset.lang === lang ? "true" : "false");
  });

  document.dispatchEvent(new CustomEvent("formlanguagechange", { detail: { lang } }));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
  });
  applyLanguage(currentLang);
});
