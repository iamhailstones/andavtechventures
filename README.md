# ANDAV TECH. VENTURES Website

**Built on trust. Driven by results.** | Registration: RC 3013387

A single-page company website for ANDAV TECH. VENTURES, a business offering printing, graphic design, technology solutions and digital learning. It has a light and a dark theme (toggle in the top-right corner) and a full-screen looping video hero.

## Features
- Full-screen hero with a muted, looping background video (still-image fallback if autoplay is blocked)
- Sticky navigation with a mobile menu
- About, Services, Portfolio, Why us and Contact sections
- Light / dark mode toggle in the header corner; remembers the visitor's choice and follows their system setting by default
- Featured "Andav identity" block at the top of the portfolio (logo, wordmark, RC number, brand colours)
- Portfolio with category filters (Printing, Graphic design, Technology, Digital learning); every picture is shown in full, uncropped and in full colour, with a title and short description
- Contact form with live validation (a valid email or phone number is confirmed instantly), file and image attachments (up to 5 files, 10 MB each) and in-browser voice notes (up to 2 minutes)
- Sends the message to WhatsApp or by email, plus icon links for email and WhatsApp
- Technology-styled footer with an interactive network animation, live Nigeria (WAT) clock and back-to-top button
- Floating "Chat on WhatsApp" button
- Responsive layout for phones, tablets and desktops; respects reduced-motion settings

## Project structure
```
index.html          page content
css/style.css       all styling (theme colours are CSS variables at the top)
js/script.js        theme toggle, mobile menu, portfolio filter, service shortcuts, contact form (validation, attachments, voice note), footer animation
assets/video/       hero.mp4 (hero background video)
assets/img/         logo, hero fallback frame, Andav brand image and portfolio pictures
README.md           this file
```

## Technologies
HTML5, CSS3 and vanilla JavaScript. No build step and no dependencies. Fonts (Poppins and Inter) load from Google Fonts.

## Setup
1. Unzip the project and keep the folders together.
2. Open `index.html` in a browser to view the site locally.
3. To publish, upload the contents of the folder to your web hosting (for example `public_html`).

## Usage and editing
- **Text:** edit the content in `index.html` (search for `id="about"`, `id="services"`, etc.).
- **Colours:** change the variables at the top of `css/style.css` (`--blue`, `--lb`, `--ink`). The dark theme has its own values in the `:root[data-theme="dark"]` rule right below.
- **Contact details:** email `andavventures@gmail.com` and WhatsApp `+234 803 638 5924` appear in `index.html` and `js/script.js`.
- **Portfolio pictures:** add an image to `assets/img/`, then copy an existing `<figure>` inside the matching category in the `#portfolio` section.
- **Hero video:** replace `assets/video/hero.mp4`. Use a short, muted, compressed file (under 2 MB works best on mobile).
- **Attachments and voice notes:** WhatsApp and email *links* cannot carry files. The form therefore (1) posts everything to `FORM_ENDPOINT` if you set one at the top of `js/script.js` (for example a Formspree URL, which delivers files to your inbox), otherwise (2) opens the phone's share sheet so the person can send the files through WhatsApp or their email app, otherwise (3) opens WhatsApp or email with the text and asks the person to attach the files (the voice note can be downloaded). Voice recording needs the site to be served over HTTPS.
- **Brand image:** `assets/img/andav-brand-mug.jpg` is the featured image; replace it and edit the text in the `.feature` block in `index.html` to change it.
