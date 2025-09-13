  // Elements
const themeSelect = document.getElementById("theme");
const toggleHero = document.getElementById("toggleHero");
const toggleServices = document.getElementById("toggleServices");
const toggleContact = document.getElementById("toggleContact");

const businessNameInput = document.getElementById("businessName");
const descriptionInput = document.getElementById("description");
const servicesInput = document.getElementById("services");

const logoUpload = document.getElementById("logoUpload");
const logoPreview = document.getElementById("logoPreview");

const colorBg = document.getElementById("colorBg");
const colorText = document.getElementById("colorText");
const colorPrimary = document.getElementById("colorPrimary");

const mobilePreviewToggle = document.getElementById("mobilePreview");

const preview = document.getElementById("preview");
const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");
const downloadBtn = document.getElementById("downloadBtn");

// Default theme colors
const baseThemes = {
  light: {
    bg: "#f8f9fa",
    text: "#333",
    primary: "#007bff",
  },
  dark: {
    bg: "#121212",
    text: "#eeeeee",
    primary: "#007bff",
  },
  blue: {
    bg: "#e0f2ff",
    text: "#003b73",
    primary: "#007bff",
  },
};

// Escape HTML function to prevent XSS
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Generate CSS string for theme
function generateThemeCSS(bg, text, primary) {
  return `
    body { background-color: ${bg}; color: ${text}; }
    .landing-page { background: ${bg === "#f8f9fa" ? "white" : bg}; color: ${text}; padding: 30px; border-radius: 8px; box-shadow: 0 0 15px rgba(0,0,0,0.05); }
    .landing-page h1, .landing-page h2 { color: ${primary}; }
    .landing-page .contact form input,
    .landing-page .contact form textarea {
      border: 1px solid ${primary};
      background: ${bg === "#121212" ? "#222" : "white"};
      color: ${text};
      border-radius: 5px;
      padding: 10px;
      margin-bottom: 12px;
      width: 100%;
      font-size: 1rem;
    }
    .landing-page .contact form button {
      background-color: ${primary};
      color: white;
      border: none;
      padding: 12px;
      border-radius: 5px;
      font-size: 1.1rem;
      cursor: pointer;
    }
    .landing-page .contact form button:hover {
      filter: brightness(85%);
    }
    ul {
      padding-left: 1.2em;
    }
  `;
}

// Logo image data url
let logoDataURL = "";

// Update the preview area based on inputs
function updatePreview() {
  const selectedTheme = themeSelect.value;
  let bgColor = colorBg.value;
  let textColor = colorText.value;
  let primaryColor = colorPrimary.value;

  // Use theme defaults if colors not set
  if (!bgColor) bgColor = baseThemes[selectedTheme].bg;
  if (!textColor) textColor = baseThemes[selectedTheme].text;
  if (!primaryColor) primaryColor = baseThemes[selectedTheme].primary;

  // Build sections conditionally
  let heroHTML = "";
  if (toggleHero.checked) {
    heroHTML = `
      <section class="welcome">
        ${
          logoDataURL
            ? `<img src="${logoDataURL}" alt="Logo" style="max-height:80px; margin-bottom:15px; display:block; margin-left:auto; margin-right:auto;" />`
            : ""
        }
        <h1 class="biz-title">${escapeHTML(
          businessNameInput.value.trim() || "Your Business Name"
        )}</h1>
        <p class="biz-desc">${escapeHTML(
          descriptionInput.value.trim() || "Short description here..."
        )}</p>
      </section>
    `;
  }

  let servicesHTML = "";
  if (toggleServices.checked) {
    const servicesList = servicesInput.value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((service) => `<li>${escapeHTML(service)}</li>`)
      .join("");
    servicesHTML = `
      <section class="services">
        <h2>Our Services</h2>
        <ul>${servicesList || "<li>Service 1</li><li>Service 2</li>"}</ul>
      </section>
    `;
  }

  let contactHTML = "";
  if (toggleContact.checked) {
    contactHTML = `
      <section class="contact">
        <h2>Contact Us</h2>
        
        <form action="https://formsubmit.co/ecb2c89ce8cf9b95017b98f97eb2e15e" method="POST" target="_blank" novalidate>
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <textarea name="message" placeholder="Your Message" required></textarea>
          <button type="submit"><i class="fa fa-envelope"></i> Send</button>
        </form>
      </section>
    `;
  }

  const themeCSS = generateThemeCSS(bgColor, textColor, primaryColor);

  preview.innerHTML = `
    <style>${themeCSS}</style>
    <div class="landing-page">
      ${heroHTML}
      ${servicesHTML}
      ${contactHTML}
    </div>
  `;

  // Mobile preview toggle
  if (mobilePreviewToggle.checked) {
    preview.classList.add("mobile");
  } else {
    preview.classList.remove("mobile");
  }

  downloadBtn.disabled = false;
}

// Handle logo upload & preview
logoUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.match("image.*")) {
    alert("Please upload a valid image file.");
    logoUpload.value = "";
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("Image must be less than 2MB.");
    logoUpload.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    logoDataURL = event.target.result;
    logoPreview.src = logoDataURL;
    logoPreview.style.display = "block";
    updatePreview();
  };
  reader.readAsDataURL(file);
});

// Save template to localStorage
saveBtn.addEventListener("click", () => {
  const templateData = {
    theme: themeSelect.value,
    toggles: {
      hero: toggleHero.checked,
      services: toggleServices.checked,
      contact: toggleContact.checked,
    },
    businessName: businessNameInput.value,
    description: descriptionInput.value,
    services: servicesInput.value,
    logo: logoDataURL,
    colors: {
      bg: colorBg.value,
      text: colorText.value,
      primary: colorPrimary.value,
    },
    mobilePreview: mobilePreviewToggle.checked,
  };
  localStorage.setItem("landingPageTemplate", JSON.stringify(templateData));
  alert("Template saved!");
});

// Load template from localStorage
loadBtn.addEventListener("click", () => {
  const template = localStorage.getItem("landingPageTemplate");
  if (!template) {
    alert("No saved template found.");
    return;
  }
  const data = JSON.parse(template);

  themeSelect.value = data.theme || "light";

  toggleHero.checked = data.toggles.hero ?? true;
  toggleServices.checked = data.toggles.services ?? true;
  toggleContact.checked = data.toggles.contact ?? true;

  businessNameInput.value = data.businessName || "";
  descriptionInput.value = data.description || "";
  servicesInput.value = data.services || "";

  if (data.logo) {
    logoDataURL = data.logo;
    logoPreview.src = logoDataURL;
    logoPreview.style.display = "block";
  } else {
    logoDataURL = "";
    logoPreview.style.display = "none";
  }

  colorBg.value = data.colors.bg || baseThemes[data.theme].bg;
  colorText.value = data.colors.text || baseThemes[data.theme].text;
  colorPrimary.value = data.colors.primary || baseThemes[data.theme].primary;

  mobilePreviewToggle.checked = data.mobilePreview || false;

  updatePreview();
  alert("Template loaded!");
});

// Download landing page as standalone HTML file
downloadBtn.addEventListener("click", () => {
  const content = preview.innerHTML;

  // Use colors or fallback to base theme
  let bgColor = colorBg.value || baseThemes[themeSelect.value].bg;
  let textColor = colorText.value || baseThemes[themeSelect.value].text;
  let primaryColor = colorPrimary.value || baseThemes[themeSelect.value].primary;

  // Embed logo inline if exists
  const embeddedLogo = logoDataURL
    ? `<img src="${logoDataURL}" alt="Logo" style="max-height:80px; margin-bottom:15px; display:block; margin-left:auto; margin-right:auto;" />`
    : "";

  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHTML(businessNameInput.value.trim() || "My Business Landing Page")}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
  <style>
    body { background-color: ${bgColor}; color: ${textColor}; font-family: Arial, sans-serif; padding: 20px; }
    .landing-page { background: ${bgColor === "#f8f9fa" ? "white" : bgColor}; color: ${textColor}; padding: 30px; border-radius: 8px; max-width: 800px; margin: auto; }
    .landing-page h1, .landing-page h2 { color: ${primaryColor}; }
    .landing-page p { font-size: 1.2rem; line-height: 1.5; }
    ul { padding-left: 1.2em; }
    ul li { margin-bottom: 0.6em; }
    .landing-page .contact form input,
    .landing-page .contact form textarea {
      border: 1px solid ${primaryColor};
      background: ${bgColor === "#121212" ? "#222" : "white"};
      color: ${textColor};
      border-radius: 5px;
      padding: 10px;
      margin-bottom: 12px;
      width: 100%;
      font-size: 1rem;
      box-sizing: border-box;
    }
    .landing-page .contact form button {
      background-color: ${primaryColor};
      color: white;
      border: none;
      padding: 12px;
      border-radius: 5px;
      font-size: 1.1rem;
      cursor: pointer;
    }
    .landing-page .contact form button:hover {
      filter: brightness(85%);
    }
    img {
      max-height: 80px;
      margin-bottom: 15px;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  </style>
</head>
<body>
  <div class="landing-page">
    ${toggleHero.checked ? embeddedLogo + `
    <section class="hero">
      <h1>${escapeHTML(businessNameInput.value.trim() || "Your Business Name")}</h1>
      <p>${escapeHTML(descriptionInput.value.trim() || "Short description here...")}</p>
    </section>` : ""}
    ${
      toggleServices.checked
        ? `<section class="services">
      <h2>Our Services</h2>
      <ul>
        ${servicesInput.value
          .split(",")
          .map((s) => `<li>${escapeHTML(s.trim())}</li>`)
          .join("")}
      </ul>
    </section>`
        : ""
    }
    ${
      toggleContact.checked
        ? `<section class="contact">
      <h2>Contact Us</h2>
      <form action="https://formsubmit.co/YOUR_TOKEN" method="POST" target="_blank" novalidate>
        <input type="text" name="name" placeholder="Your Name" required />
        <input type="email" name="email" placeholder="Your Email" required />
        <textarea name="message" placeholder="Your Message" required></textarea>
        <button type="submit"><i class="fa fa-envelope"></i> Send</button>
      </form>
    </section>`
        : ""
    }
  </div>
</body>
</html>`;

  const blob = new Blob([fullHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "landing-page.html";
  a.click();

  URL.revokeObjectURL(url);
});

// Update preview on inputs change
[
  themeSelect,
  toggleHero,
  toggleServices,
  toggleContact,
  businessNameInput,
  descriptionInput,
  servicesInput,
  colorBg,
  colorText,
  colorPrimary,
  mobilePreviewToggle,
].forEach((el) => {
  el.addEventListener("input", updatePreview);
});

// Initialize preview on page load
window.addEventListener("load", () => {
  // Set default colors from theme
  const theme = themeSelect.value;
  colorBg.value = baseThemes[theme].bg;
  colorText.value = baseThemes[theme].text;
  colorPrimary.value = baseThemes[theme].primary;

  updatePreview();
});
