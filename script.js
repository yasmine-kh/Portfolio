/* =========================================================
   YASMINE KHELIL — PORTFOLIO JAVASCRIPT
   =========================================================

   TABLE OF CONTENTS
   -----------------
   1.  CONFIG           ← tweak all JS behaviour here
   2.  CURSOR GLOW      ← smooth mouse-tracking orb
   3.  NAVBAR           ← scroll behaviour + active links
   4.  MOBILE MENU      ← hamburger toggle
   5.  SCROLL REVEAL    ← IntersectionObserver animations
   6.  HERO ANIMATIONS  ← page-load fadeUp sequence
   7.  STAGGER TAGS     ← skills section tag animation
   8.  SMOOTH SCROLL    ← offset for fixed nav
   9.  INIT             ← call everything on DOMContentLoaded
   ========================================================= */


/* =========================================================
   1. CONFIG
   ─────────────────────────────────────────────────────────
   Central place to tweak all behaviour.
   No need to hunt through the code to change these.
   ========================================================= */
const CONFIG = {

  /* ── Cursor glow ── */
  cursorGlow: {
    enabled:    true,        // set false to disable entirely
    lagFactor:  0.1,         // 0.0 = instant, 1.0 = very laggy
  },

  /* ── Navbar ── */
  navbar: {
    scrollThreshold: 20,     // px scrolled before nav bg appears
    activeOffset:    120,    // px from top to consider a section "active"
  },

  /* ── Scroll reveal ── */
  scrollReveal: {
    enabled:     true,       // set false to disable scroll animations
    threshold:   0.12,       // 0–1: how much of element must be visible
    rootMargin:  '0px 0px -60px 0px', // shrinks trigger zone slightly
  },

  /* ── Hero animation ── */
  hero: {
    style: 'fadeUp',         // options: 'fadeUp' (only supported currently)
    // To add a new animation style: add a case in animateHero()
  },

  /* ── Skills stagger ── */
  skillTags: {
    staggerDelay: 80,        // ms between each tag appearing
    // To change: update this number (or update --stagger-delay in CSS)
  },

};


/* =========================================================
   2. CURSOR GLOW
   ─────────────────────────────────────────────────────────
   Moves a radial-gradient orb to follow the mouse.
   Uses lerp (linear interpolation) for smooth lag.

   To disable: set CONFIG.cursorGlow.enabled = false
   To change size/color: update CSS variables in style.css
      --glow-size
      --glow-color
   ========================================================= */
function initCursorGlow() {
  if (!CONFIG.cursorGlow.enabled) return;

  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  // Current rendered position (lerped toward target)
  let currentX = 0, currentY = 0;

  // Target position (actual mouse position)
  let targetX = 0, targetY = 0;

  // Track the mouse
  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;

    // Fade in when mouse first moves
    if (glow.style.opacity === '0' || !glow.style.opacity) {
      glow.style.opacity = '1';
    }
  });

  // Hide glow when mouse leaves the window
  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  // Animation loop: lerp toward target for the "lag" effect
  function animate() {
    // Linear interpolation: move a fraction of the distance each frame
    // Increase lagFactor for more lag (0.0 = instant snap)
    const lag = CONFIG.cursorGlow.lagFactor;
    currentX += (targetX - currentX) * (1 - lag);
    currentY += (targetY - currentY) * (1 - lag);

    // Apply position via CSS transform (GPU-accelerated)
    glow.style.transform = `translate(${currentX - 0}px, ${currentY - 0}px) translate(-50%, -50%)`;

    requestAnimationFrame(animate);
  }

  animate();
}


/* =========================================================
   3. NAVBAR
   ─────────────────────────────────────────────────────────
   Two behaviours:
   a) Adds .navbar--scrolled class after user scrolls
      (triggers frosted-glass background via CSS)
   b) Highlights the active nav link as you scroll
      through sections
   ========================================================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sections to track for active state
  // Must match the IDs in the HTML
  const sections = ['about', 'skills', 'projects', 'education', 'contact'];

  /* ── a) Scroll background ── */
  function handleScrollBg() {
    if (window.scrollY > CONFIG.navbar.scrollThreshold) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }

  /* ── b) Active link highlight ── */
  function handleActiveLink() {
    const scrollPos = window.scrollY + CONFIG.navbar.activeOffset;

    // Find which section the user is currently in
    let currentSection = '';

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollPos) {
        currentSection = id;
      }
    });

    // Apply .active class to matching nav link
    navLinks.forEach((link) => {
      const href = link.getAttribute('href'); // e.g. "#about"
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Run on scroll
  window.addEventListener('scroll', () => {
    handleScrollBg();
    handleActiveLink();
  }, { passive: true }); // passive = won't block scroll

  // Run immediately on page load
  handleScrollBg();
  handleActiveLink();
}


/* =========================================================
   4. MOBILE MENU
   ─────────────────────────────────────────────────────────
   Toggles the full-screen mobile overlay.
   Also exposed globally so HTML onclick can call it.
   ========================================================= */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');

    if (isOpen) {
      mobileMenu.classList.add('mobile-menu--open');
      // Prevent body scroll while menu is open
      document.body.style.overflow = 'hidden';
    } else {
      closeMobileMenu();
    }
  });
}

// Exposed globally so <a onclick="closeMobileMenu()"> works in HTML
function closeMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger?.classList.remove('open');
  mobileMenu?.classList.remove('mobile-menu--open');
  document.body.style.overflow = '';
}


/* =========================================================
   5. SCROLL REVEAL
   ─────────────────────────────────────────────────────────
   Uses IntersectionObserver to watch elements with:
     .reveal-fadeUp   → fade in + rise from below
     .reveal-slideIn  → slide in from the left

   Adds .revealed class when element enters the viewport.
   The transition itself is defined in CSS.

   To change reveal distance → CSS: --reveal-distance
   To change speed           → CSS: --anim-speed
   To disable                → set CONFIG.scrollReveal.enabled = false
   ========================================================= */
function initScrollReveal() {
  if (!CONFIG.scrollReveal.enabled) return;

  // Select all elements that need reveal animations
  // (excluding hero elements which have their own animation)
  const revealEls = document.querySelectorAll(
    '.reveal-fadeUp:not(.hero-content .reveal-fadeUp), .reveal-slideIn'
  );

  if (revealEls.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');

          // Stop observing once revealed — no re-animation on scroll up
          // To re-animate on scroll: remove this line
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold:  CONFIG.scrollReveal.threshold,
      rootMargin: CONFIG.scrollReveal.rootMargin,
    }
  );

  revealEls.forEach((el) => observer.observe(el));
}


/* =========================================================
   6. HERO ANIMATIONS
   ─────────────────────────────────────────────────────────
   The hero items (.reveal-fadeUp inside .hero-content)
   animate on page load — not scroll-triggered.

   They use CSS animation `heroFadeUp` with staggered delays
   set via the inline --delay CSS variable.

   To change animation style: update animateHero() below
   To change speed:  update --anim-speed in CSS
   To change delays: update the inline style="--delay: Xms"
                     on each hero element in index.html
   ========================================================= */
function initHeroAnimations() {
  const heroItems = document.querySelectorAll(
    '.hero-content .reveal-fadeUp'
  );

  if (heroItems.length === 0) return;

  // Short delay before starting, so the page has painted
  setTimeout(() => {
    animateHero(heroItems);
  }, 80);
}

/* Handles the actual animation application */
function animateHero(items) {
  const style = CONFIG.hero.style;

  if (style === 'fadeUp') {
    // Add CSS animation class to each item
    // The --delay variable on each element staggers them
    items.forEach((item) => {
      item.classList.add('reveal-hero-item');
      // Also mark as revealed so scroll reveal doesn't re-trigger
      item.classList.add('revealed');
    });
  }

  /* ── TO ADD A NEW HERO ANIMATION STYLE: ──────────────────
     1. Add a new `else if (style === 'yourStyle')` block here
     2. Add corresponding @keyframes in style.css
     3. Set CONFIG.hero.style = 'yourStyle'

     Example:
     else if (style === 'glitch') {
       items.forEach(item => item.classList.add('reveal-hero-glitch'));
     }
     ─────────────────────────────────────────────────────── */
}


/* =========================================================
   7. STAGGER TAGS (SKILLS SECTION)
   ─────────────────────────────────────────────────────────
   Each .stagger-tag inside a .skill-category gets a
   dynamically calculated animation-delay based on its
   index within the group.

   Delay formula: index × CONFIG.skillTags.staggerDelay

   To change timing: update CONFIG.skillTags.staggerDelay
   To change easing: update transition in CSS .stagger-tag
   ========================================================= */
function initStaggerTags() {
  // Each skill category card is observed separately
  const categories = document.querySelectorAll('.skill-category');

  if (categories.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        // Get all tags within this category
        const tags = entry.target.querySelectorAll('.stagger-tag');

        tags.forEach((tag, index) => {
          // Set a per-tag delay before revealing
          const delay = index * CONFIG.skillTags.staggerDelay;

          setTimeout(() => {
            tag.classList.add('revealed');
          }, delay);
        });

        // Stop observing after first trigger
        observer.unobserve(entry.target);
      });
    },
    {
      threshold:  0.2,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  categories.forEach((cat) => observer.observe(cat));
}


/* =========================================================
   8. SMOOTH SCROLL — OFFSET FOR FIXED NAV
   ─────────────────────────────────────────────────────────
   Intercepts anchor link clicks and scrolls to the target
   with an offset to prevent the fixed navbar covering the
   section heading.

   The CSS `scroll-padding-top` handles most cases already,
   but this JS version also closes the mobile menu.
   ========================================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');

      // Skip empty or just "#" links
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      // Close mobile menu if open
      closeMobileMenu();

      // Calculate offset position
      const navHeight = document.getElementById('navbar')?.offsetHeight || 68;
      const elementTop = targetEl.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementTop - navHeight - 16;

      window.scrollTo({
        top:      offsetPosition,
        behavior: 'smooth',
      });
    });
  });
}


/* =========================================================
   9. INIT — RUN EVERYTHING
   ─────────────────────────────────────────────────────────
   Waits for DOM to be ready, then initialises all modules.

   ORDER MATTERS:
   - Hero animations should run before scroll reveal
     (so scroll reveal doesn't double-animate hero items)
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* 1. Cursor glow — needs to be ready immediately */
  initCursorGlow();

  /* 2. Hero animations — fire on page load */
  initHeroAnimations();

  /* 3. Scroll reveal — watch elements as user scrolls */
  initScrollReveal();

  /* 4. Skills stagger — separate observer for tag animation */
  initStaggerTags();

  /* 5. Navbar — scroll bg + active link tracking */
  initNavbar();

  /* 6. Mobile menu — hamburger toggle */
  initMobileMenu();

  /* 7. Smooth scroll — anchor link offset */
  initSmoothScroll();

  /* ── Dev helper ── */
  /* Uncomment to see which elements were found by scroll reveal:
  console.log('[Portfolio] Scroll reveal elements:', document.querySelectorAll('.reveal-fadeUp, .reveal-slideIn').length);
  */
});


/* =========================================================
   ADDING A NEW SECTION — CHECKLIST
   ─────────────────────────────────────────────────────────
   1. Add the section HTML in index.html with a unique ID
   2. Add the nav link in both <ul class="nav-links"> and
      <ul class="mobile-nav-links">
   3. Add the section ID to the `sections` array in initNavbar()
   4. Style the section in style.css
   5. Add .reveal-fadeUp or .reveal-slideIn to elements
      you want animated on scroll
   ========================================================= */