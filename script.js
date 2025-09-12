document.getElementById('landingForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('bizName').value;
    const desc = document.getElementById('bizDesc').value;
    const services = document.getElementById('bizServices').value.split(',');
    const email = document.getElementById('bizEmail').value;

    const previewHTML = `
  <section class="landing-page">
    <div class="hero">
      <h1 class="biz-title">${name}</h1>
      <p class="biz-desc">${desc}</p>
    </div>

    <div class="services">
      <h2>Our Services</h2>
      <ul>
        ${services.map(service => `<li>${service.trim()}</li>`).join('')}
      </ul>
    </div>

    <div class="contact">
      <h2>Contact Us</h2>
      
      <p><i class="fa fa-envelope"></i> <a href="mailto:${email}">${email}</a></p>


      <form action="https://formsubmit.co/ecb2c89ce8cf9b95017b98f97eb2e15e" method="POST">
        <input type="hidden" name="_captcha" value="false">
        <input type="text" name="name" placeholder="Your Name" required>
        <input type="email" name="email" placeholder="Your Email" required>
        <textarea name="message" placeholder="Your Message" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  </section>
`;

    document.getElementById('preview').innerHTML = previewHTML;
});

document.getElementById('downloadBtn').style.display = 'block';


document.getElementById('downloadBtn').addEventListener('click', function () {
    const content = document.getElementById('preview').innerHTML;
  
    const fullHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>My Business Landing Page</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
      body { font-family: 'Inter', sans-serif; padding: 20px; background: #f8f9fa; color: #333; }
      .landing-page { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 15px rgba(0,0,0,0.05); }
      .hero { text-align: center; margin-bottom: 30px; }
      .biz-title { font-size: 2.5rem; color: #333; }
      .biz-desc { font-size: 1.2rem; color: #555; margin-top: 10px; }
      .services h2, .contact h2 { font-size: 1.5rem; margin-bottom: 10px; }
      .services ul { list-style: none; padding: 0; }
      .services li { background: #e9ecef; margin: 5px 0; padding: 10px; border-radius: 5px; }
      .contact form { display: flex; flex-direction: column; gap: 10px; margin-top: 15px; }
      .contact input, .contact textarea { padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 5px; }
      .contact button { background-color: #007bff; color: white; padding: 12px; border: none; border-radius: 5px; cursor: pointer; }
      .contact button:hover { background-color: #0056b3; }
    </style>
  </head>
  <body>
  ${content}
  </body>
  </html>
  `;
  
    // Create the downloadable HTML file
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'landing-page.html';
    a.click();
    URL.revokeObjectURL(url);
  });
  