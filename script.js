const form = document.getElementById('landingForm');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');

// Inputs
const themeSelect = document.getElementById('theme');
const colorBg = document.getElementById('colorBg');
const colorText = document.getElementById('colorText');
const colorPrimary = document.getElementById('colorPrimary');

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
  a.click();
  URL.revokeObjectURL(url);
});

// Initialize on load
window.addEventListener("load", () => {
  const theme = themeSelect.value;
  colorBg.value = baseThemes[theme].bg;
  colorText.value = baseThemes[theme].text;
  colorPrimary.value = baseThemes[theme].primary;
  updatePreview();
});
