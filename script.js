<<<<<<< HEAD
/* ====== Edit this token (developer only) ======
 Replace with your FormSubmit token (hybrid mode).
 If you don't want contact to submit, leave as empty string.
================================================= */
const FORMSUBMIT_TOKEN = "REPLACE_WITH_YOUR_TOKEN";

/* ===== DOM Elements ===== */
const themeSelect = document.getElementById("theme");
const toggleHero = document.getElementById("toggleHero");
const toggleServices = document.getElementById("toggleServices");
const toggleContact = document.getElementById("toggleContact");
=======
const form = document.getElementById('landingForm');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');
>>>>>>> 8465069954c462e22e277c9e7b7093cd37661297

// Inputs
const themeSelect = document.getElementById('theme');
const colorBg = document.getElementById('colorBg');
const colorText = document.getElementById('colorText');
const colorPrimary = document.getElementById('colorPrimary');

<<<<<<< HEAD
const logoUpload = document.getElementById("logoUpload");
const logoPreview = document.getElementById("logoPreview");

const colorBg = document.getElementById("colorBg");
const colorText = document.getElementById("colorText");
const colorPrimary = document.getElementById("colorPrimary");
s
const mobilePreviewToggle = document.getElementById("mobilePreview");

const preview = document.getElementById("preview");
const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");
const downloadBtn = document.getElementById("downloadBtn");

/* ===== Base theme presets (JS) ===== */
const baseThemes = {
  light: { bg: "#f8f9fa", text: "#333333", primary: "#007bff" },
  dark:  { bg: "#222222", text: "#f1f1f1", primary: "#ff5722" },
  blue:  { bg: "#e8f1fb", text: "#0d1b2a", primary: "#1e88e5" }
};

/* ===== Utilities ===== */
function escapeHTML(str = "") {
  const d = document.createElement("div");
  d.textContent = String(str);
  return d.innerHTML;
}

/* Apply theme and/or custom colors to :root variables */
function applyTheme(theme, custom = {}) {
  const chosen = baseThemes[theme] || baseThemes.light;
  const bg = custom.bg || chosen.bg;
  const text = custom.text || chosen.text;
  const primary = custom.primary || chosen.primary;

  document.documentElement.style.setProperty("--bg-color", bg);
  document.documentElement.style.setProperty("--text-color", text);
  document.documentElement.style.setProperty("--primary-color", primary);
}

/* Set color pickers from theme (used when switching theme) */
function setPickersToTheme(theme) {
  const t = baseThemes[theme] || baseThemes.light;
  colorBg.value = t.bg;
  colorText.value = t.text;
  colorPrimary.value = t.primary;
  applyTheme(theme, { bg: t.bg, text: t.text, primary: t.primary });
}

/* ===== Build HTML parts (reused for preview + download) ===== */
let logoDataURL = "";

function buildHeroHTML() {
  if (!toggleHero.checked) return "";
  return `
    <section class="hero">
      ${logoDataURL ? `<img src="${logoDataURL}" alt="Logo" style="max-width:140px;margin-bottom:12px;">` : ""}
      <h1>${escapeHTML(businessNameInput.value || "Your Business")}</h1>
      <p>${escapeHTML(descriptionInput.value || "Short description...")}</p>
    </section>
  `;
}

function buildServicesHTML() {
  if (!toggleServices.checked) return "";
  const list = (servicesInput.value || "Service 1, Service 2")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => `<li>${escapeHTML(s)}</li>`)
    .join("") || "<li>Service 1</li><li>Service 2</li>";
  return `
    <section class="services">
      <h2>Our Services</h2>
      <ul>${list}</ul>
    </section>
  `;
}

function buildContactHTML(useToken = true) {
  if (!toggleContact.checked) return "";
  const action = (useToken && FORMSUBMIT_TOKEN) ? `https://formsubmit.co/${FORMSUBMIT_TOKEN}` : "#";
  return `
    <section class="contact">
      <h2>Contact Us</h2>
      <form action="${action}" method="POST" target="_blank">
        <input type="text" name="name" placeholder="Your Name" required />
        <input type="email" name="email" placeholder="Your Email" required />
        <textarea name="message" placeholder="Your Message" required></textarea>
        <button type="submit"><i class="fa fa-paper-plane"></i> Send</button>
      </form>
    </section>
  `;
}

/* ===== Update live preview ===== */
function updatePreview() {
  // apply theme with custom pickers overriding
  applyTheme(themeSelect.value, {
    bg: colorBg.value,
    text: colorText.value,
    primary: colorPrimary.value
  });

  const html = `
    <div class="landing-page">
      ${buildHeroHTML()}
      ${buildServicesHTML()}
      ${buildContactHTML(true)}
    </div>
  `;

  preview.innerHTML = html;

  // mobile preview toggles class on preview element
  preview.classList.toggle("mobile", mobilePreviewToggle.checked);

  // enable download if content exists
  downloadBtn.disabled = preview.innerHTML.trim() === "";
}

/* ===== Logo upload ===== */
logoUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) { alert("Please upload an image file."); logoUpload.value = ""; return; }
  if (file.size > 2 * 1024 * 1024) { alert("Image must be less than 2MB."); logoUpload.value = ""; return; }

  const reader = new FileReader();
  reader.onload = (ev) => {
    logoDataURL = ev.target.result;
    logoPreview.src = logoDataURL;
    logoPreview.style.display = "block";
    updatePreview();
  };
  reader.readAsDataURL(file);
});

/* ===== Save / Load to localStorage ===== */
saveBtn.addEventListener("click", () => {
  const data = {
    theme: themeSelect.value,
    toggles: {
      hero: toggleHero.checked,
      services: toggleServices.checked,
      contact: toggleContact.checked
    },
    businessName: businessNameInput.value,
    description: descriptionInput.value,
    services: servicesInput.value,
    logo: logoDataURL,
    colors: {
      bg: colorBg.value,
      text: colorText.value,
      primary: colorPrimary.value
    },
    mobilePreview: mobilePreviewToggle.checked
  };
  localStorage.setItem("landingPageTemplate", JSON.stringify(data));
  alert("Template saved.");
});

loadBtn.addEventListener("click", () => {
  const raw = localStorage.getItem("landingPageTemplate");
  if (!raw) { alert("No saved template."); return; }
  const data = JSON.parse(raw);

  themeSelect.value = data.theme || "light";
  toggleHero.checked = !!data.toggles?.hero;
  toggleServices.checked = !!data.toggles?.services;
  toggleContact.checked = !!data.toggles?.contact;

  businessNameInput.value = data.businessName || "";
  descriptionInput.value = data.description || "";
  servicesInput.value = data.services || "";

  logoDataURL = data.logo || "";
  if (logoDataURL) { logoPreview.src = logoDataURL; logoPreview.style.display = "block"; } else { logoPreview.style.display = "none"; }

  // set pickers (fall back to theme defaults)
  colorBg.value = data.colors?.bg || baseThemes[themeSelect.value].bg;
  colorText.value = data.colors?.text || baseThemes[themeSelect.value].text;
  colorPrimary.value = data.colors?.primary || baseThemes[themeSelect.value].primary;

  mobilePreviewToggle.checked = !!data.mobilePreview;

  applyTheme(themeSelect.value, { bg: colorBg.value, text: colorText.value, primary: colorPrimary.value });
  updatePreview();
});

/* ===== Download (bakes chosen variables into exported HTML) ===== */
downloadBtn.addEventListener("click", () => {
  const computed = getComputedStyle(document.documentElement);
  const bg = computed.getPropertyValue("--bg-color").trim() || baseThemes[themeSelect.value].bg;
  const text = computed.getPropertyValue("--text-color").trim() || baseThemes[themeSelect.value].text;
  const primary = computed.getPropertyValue("--primary-color").trim() || baseThemes[themeSelect.value].primary;

  const hero = toggleHero.checked ? `
    ${logoDataURL ? `<img src="${logoDataURL}" alt="Logo" style="max-width:140px;margin-bottom:12px;">` : ""}
    <h1>${escapeHTML(businessNameInput.value || "Your Business")}</h1>
    <p>${escapeHTML(descriptionInput.value || "Short description...")}</p>` : "";

  const servicesList = (servicesInput.value || "Service 1, Service 2")
    .split(",").map(s => s.trim()).filter(Boolean)
    .map(s => `<li>${escapeHTML(s)}</li>`).join("") || "<li>Service 1</li><li>Service 2</li>";

  const servicesHTML = toggleServices.checked ? `<h2>Our Services</h2><ul>${servicesList}</ul>` : "";

  const contactAction = FORMSUBMIT_TOKEN ? `https://formsubmit.co/${FORMSUBMIT_TOKEN}` : "#";
  const contactHTML = toggleContact.checked ? `
    <h2>Contact Us</h2>
    <form action="${contactAction}" method="POST" target="_blank">
      <input type="text" name="name" placeholder="Your Name" required />
      <input type="email" name="email" placeholder="Your Email" required />
      <textarea name="message" placeholder="Your Message" required></textarea>
      <button type="submit">Send</button>
    </form>` : "";

  const fullHTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHTML(businessNameInput.value || "Landing Page")}</title>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
<style>
:root{--bg-color:${bg};--text-color:${text};--primary-color:${primary}}
body{margin:0;font-family:Arial,sans-serif;background:var(--bg-color);color:var(--text-color)}
.landing-page{max-width:900px;margin:40px auto;padding:24px;background:var(--bg-color);color:var(--text-color);border-radius:10px;text-align:center}
.landing-page h1,.landing-page h2{color:var(--primary-color)}
.landing-page ul{list-style:disc inside;text-align:left;display:inline-block;padding-left:18px;margin:0}
.landing-page .contact form input,.landing-page .contact form textarea{width:100%;padding:10px;margin-bottom:10px;border:1px solid var(--primary-color);border-radius:6px}
.landing-page .contact form button{background:var(--primary-color);color:#fff;padding:10px 16px;border:none;border-radius:6px;cursor:pointer}
</style></head><body>
<div class="landing-page">${hero}${servicesHTML}${contactHTML}</div>
</body></html>`;

  const blob = new Blob([fullHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "landing-page.html";
=======
// Theme style base values
const baseThemes = {
  light: { bg: "#f8f9fa", text: "#333", primary: "#007bff" },
  dark: { bg: "#121212", text: "#eee", primary: "#444" },
  blue: { bg: "#e0f2ff", text: "#003b73", primary: "#007bff" },
};

// Escape HTML to avoid injection
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag]));
}

// Update preview
function updatePreview() {
  const theme = themeSelect.value;

  const businessName = document.getElementById('businessName').value;
  const description = document.getElementById('description').value;
  const services = document.getElementById('services').value;

  // Use custom colors or theme default
  const bgColor = colorBg.value || baseThemes[theme].bg;
  const textColor = colorText.value || baseThemes[theme].text;
  const primaryColor = colorPrimary.value || baseThemes[theme].primary;

  const previewHTML = `
    <style>
      body {
        background-color: ${bgColor};
        color: ${textColor};
        font-family: Arial, sans-serif;
        padding: 20px;
      }
      .landing-page {
        background: ${bgColor === "#f8f9fa" ? "#fff" : bgColor};
        color: ${textColor};
        padding: 30px;
        border-radius: 8px;
        max-width: 800px;
        margin: auto;
      }
      h1, h2 {
        color: ${primaryColor};
      }
      .landing-page ul {
        padding-left: 20px;
      }
      .landing-page li {
        margin-bottom: 8px;
      }
      .landing-page .contact form input,
      .landing-page .contact form textarea {
        background: ${bgColor === "#121212" ? "#222" : "#fff"};
        color: ${textColor};
        border: 1px solid ${primaryColor};
        padding: 10px;
        margin-bottom: 12px;
        border-radius: 5px;
        width: 100%;
        box-sizing: border-box;
      }
      .landing-page .contact form button {
        background: ${primaryColor};
        color: #fff;
        border: none;
        padding: 12px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
      }
      .landing-page .contact form button:hover {
        filter: brightness(90%);
      }
    </style>
    <div class="landing-page">
      <section class="welcome">
        <h1>${escapeHTML(businessName)}</h1>
        <p>${escapeHTML(description)}</p>
      </section>
      <section class="services">
        <h2>Our Services</h2>
        <ul>
          ${services.split(',').map(service => `<li>${escapeHTML(service.trim())}</li>`).join('')}
        </ul>
      </section>
      <section class="contact">
        <h2>Contact Us</h2>
        <form action="https://formsubmit.co/ecb2c89ce8cf9b95017b98f97eb2e15e" method="POST" target="_blank" novalidate>
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <textarea name="message" placeholder="Your Message" required></textarea>
          <button type="submit"><i class="fa fa-envelope"></i> Send</button>
        </form>
      </section>
    </div>
  `;

  preview.innerHTML = previewHTML;
  downloadBtn.style.display = "block";
}

// Set color pickers to match theme on selection
themeSelect.addEventListener("change", () => {
  const theme = themeSelect.value;
  colorBg.value = baseThemes[theme].bg;
  colorText.value = baseThemes[theme].text;
  colorPrimary.value = baseThemes[theme].primary;
  updatePreview();
});

// Update preview on input
[form, colorBg, colorText, colorPrimary].forEach(el => {
  el.addEventListener("input", updatePreview);
});

// Generate landing page on form submit
form.addEventListener("submit", function (e) {
  e.preventDefault();
  updatePreview();
});

// Download HTML
downloadBtn.addEventListener("click", () => {
  const content = preview.innerHTML;
  const theme = themeSelect.value;

  const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Landing Page</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body>
  ${content}
</body>
</html>
`;

  const blob = new Blob([fullHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'landing-page.html';
>>>>>>> 8465069954c462e22e277c9e7b7093cd37661297
  a.click();
  URL.revokeObjectURL(url);
});

<<<<<<< HEAD
/* ===== Event wiring ===== */
// When theme changes, update pickers & preview
themeSelect.addEventListener("change", () => {
  setPickersToTheme(themeSelect.value);
  updatePreview();
});

// Color pickers override theme live
[colorBg, colorText, colorPrimary].forEach(inp => inp.addEventListener("input", () => {
  applyTheme(themeSelect.value, { bg: colorBg.value, text: colorText.value, primary: colorPrimary.value });
  updatePreview();
}));

// Other inputs update preview
[
  toggleHero, toggleServices, toggleContact,
  businessNameInput, descriptionInput, servicesInput,
  mobilePreviewToggle
].forEach(el => el.addEventListener("input", updatePreview));

/* ===== Init on load ===== */
window.addEventListener("load", () => {
  // initialize color pickers from current theme (prevents black default)
  setPickersToTheme(themeSelect.value);
=======
// Initialize on load
window.addEventListener("load", () => {
  const theme = themeSelect.value;
  colorBg.value = baseThemes[theme].bg;
  colorText.value = baseThemes[theme].text;
  colorPrimary.value = baseThemes[theme].primary;
>>>>>>> 8465069954c462e22e277c9e7b7093cd37661297
  updatePreview();
});
