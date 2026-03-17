# YasmineK.github.io
# Yasmine — Personal Portfolio

> *Turning ideas into code — one project at a time.*

A clean, responsive developer portfolio built with vanilla HTML, CSS, and JavaScript. No frameworks, no dependencies — just fast, lightweight code.

**Live site:** `https://yasmine-kh.github.io/Portfolio/` 

---

## ✨ Features

- **Dark theme** with a warm wine-red & beige palette
- **Cursor glow** — soft accent orb that follows the mouse
- **Scroll reveal animations** — elements fade and slide in as you scroll
- **Staggered skill tags** — skills appear one by one on section entry
- **Project cards** — image preview with hover overlay + GitHub repo link
- **Education & certifications** — with optional image and verification link
- **Responsive** — fully mobile-friendly with a hamburger menu
- **All animation values in CSS variables** — change one number, update the whole site
- **Zero dependencies** — no npm, no build step, open `index.html` and it works

---

## 📁 Project Structure

```
portfolio/
├── index.html          # All sections and markup
├── style.css           # All styles + animation/design tokens at the top
├── script.js           # All JS behaviour + CONFIG object at the top
└── images/             # Your project screenshots and logos go here
    ├── project-sports-platform.png
    ├── project-weather-app.png
    ├── ehei-logo.png
    └── ...
```

---

## 🚀 Getting Started

### Run locally

No server needed — just open the file:

```bash
# Clone the repo
git clone https://github.com/yasmine-kh/yasmine-kh.github.io.git

# Open in browser
open index.html
```

Or use VS Code's **Live Server** extension for hot reload.

## 🎨 Customisation Guide

Everything is designed to be changed in one place.

### Change colors, fonts, or spacing

Open `style.css` and edit the **Design Tokens** block at the very top:

```css
:root {
  --color-bg:      #781C2C;   /* page background */
  --color-accent:  #C8BDB2;   /* accent color — used everywhere */
  --color-bg-card: #F5F5DC;   /* card surface color */
  --font-body:     'DM Sans', sans-serif;
  --font-display:  'Playfair Display', serif;
}
```

### Change animation speed or style

Edit the **Animation Tokens** block, also at the top of `style.css`:

```css
:root {
  --anim-speed:     500ms;   /* duration of most animations */
  --stagger-delay:  80ms;    /* delay between staggered items */
  --reveal-distance: 28px;   /* how far elements travel on reveal */
  --glow-size:      320px;   /* cursor glow orb diameter */
}
```

### Disable specific JS features

Open `script.js` and edit the **CONFIG** object at the top:

```js
const CONFIG = {
  cursorGlow:  { enabled: true  },   // ← set false to remove glow
  scrollReveal: { enabled: true },   // ← set false for no scroll animations
};
```

---

## ➕ Adding Content

### Add a project

Copy any `<article class="project-card">` block in `index.html` and paste it inside `.projects-grid`. Update:

- `src="images/YOUR-SCREENSHOT.png"` — add image to the `images/` folder
- `href="https://github.com/..."` — both the overlay button and repo button
- Project name, period, description, and stack tags

### Add a certification

Find the **CERTIFICATION CARD TEMPLATE** comment block in `index.html` (inside the education section), uncomment it, and fill in your details:

```html
<div class="edu-card reveal-fadeUp" style="--delay: 160ms">
  <div class="edu-image-wrap edu-type-certification">
    <img src="images/cert-YOUR-CERT.png" ... />
  </div>
  <div class="edu-body">
    <span class="edu-type-badge edu-type-badge--certification">Certification</span>
    <h3 class="edu-degree">Your Certificate Title</h3>
    <p class="edu-school">Issuing Organization</p>
    <a href="https://verify-link" class="edu-link-btn">Verify Certificate ↗</a>
  </div>
</div>
```

### Add a new section

Follow the checklist at the bottom of `script.js`:

1. Add the section HTML in `index.html` with a unique `id`
2. Add the link in both `.nav-links` and `.mobile-nav-links`
3. Add the section ID to the `sections` array in `initNavbar()`
4. Style it in `style.css`
5. Add `.reveal-fadeUp` or `.reveal-slideIn` to elements you want animated

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Markup | HTML5 |
| Styles | CSS3 (custom properties, grid, flexbox) |
| Behaviour | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts — DM Sans + Playfair Display |
| Animations | CSS transitions + IntersectionObserver API |
| Hosting | GitHub Pages |

---

## 📬 Contact

**Khelil Yasmine** — Computer Engineering Student @ EHEI, Oujda

- Email: [yvsminj@gmail.com](mailto:yvsminj@gmail.com)
- LinkedIn: [linkedin.com/in/yasmine-khelil](https://www.linkedin.com/in/yasmine-k-8529b23b6)
- GitHub: [github.com/yasmine-kh](https://github.com/yasmine-kh)

---

*Made with alot of ♥ *
