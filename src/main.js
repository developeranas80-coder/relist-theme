import './style.css';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { initCustomizer } from './customizer.js';
import { initStorefront } from './storefront.js';

// 0. Initialize Lenis Smooth Scroll globally
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: false,
});

window.lenis = lenis;

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

document.addEventListener('DOMContentLoaded', () => {
  const storefrontApp = document.getElementById('storefront-app');

  // 0. Initialize 3D Preloader Screen (1% - 100%)
  initPreloader();

  // 1. Initialize Storefront
  const storefront = initStorefront(storefrontApp);

  // 2. Initialize Customizer (pass card update function)
  if (storefrontApp && storefront) {
    initCustomizer(storefrontApp, storefront.updateProductCardStyle);
  }

  // 3. Download Theme Code popup
  const exportBtn = document.getElementById('export-theme-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:500;display:flex;align-items:center;justify-content:center;';

      const content = document.createElement('div');
      content.style.cssText = 'background:#fff;width:700px;max-width:90%;max-height:90%;overflow-y:auto;padding:40px;position:relative;font-family:inherit;';
      content.innerHTML = `
        <button id="close-export-modal" style="position:absolute;top:20px;right:20px;background:none;border:none;font-size:24px;cursor:pointer;">&times;</button>
        <h2 style="font-size:24px;font-weight:700;margin-bottom:12px;">Shopify OS 2.0 Theme</h2>
        <p style="font-size:13px;color:#666;margin-bottom:24px;">The complete Shopify theme is in the <code>/theme</code> directory. Compress it to ZIP and upload to your Shopify Admin → Online Store → Themes → Add Theme → Upload ZIP.</p>
        <div style="background:#f5f5f5;padding:20px;font-family:monospace;font-size:12px;margin-bottom:20px;">
          <div style="font-weight:bold;color:#008060;">theme/</div>
          <div style="margin-left:12px;">├── layout/theme.liquid</div>
          <div style="margin-left:12px;">├── config/settings_schema.json</div>
          <div style="margin-left:12px;">├── sections/header.liquid, hero.liquid...</div>
          <div style="margin-left:12px;">├── snippets/product-card.liquid</div>
          <div style="margin-left:12px;">├── assets/theme.css, theme.js</div>
          <div style="margin-left:12px;">└── templates/index.json, product.json</div>
        </div>
      `;

      modal.appendChild(content);
      document.body.appendChild(modal);

      modal.querySelector('#close-export-modal').addEventListener('click', () => document.body.removeChild(modal));
      modal.addEventListener('click', (e) => { if (e.target === modal) document.body.removeChild(modal); });
    });
  }

  // 4. Initialize Brand Discount Promo Popup
  initPromoPopup();
});

/* ============================================================
   BRAND DISCOUNT PROMO POPUP — Logic
   ============================================================ */
function initPromoPopup() {
  const overlay = document.getElementById('promo-popup-overlay');
  const closeBtn = document.getElementById('promo-popup-close');
  const form = document.getElementById('promo-popup-form');
  const successBox = document.getElementById('promo-popup-success');
  if (!overlay || !closeBtn) return;

  const STORAGE_KEY = 'relist_promo_dismissed';
  const DISMISS_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  // Check if popup was recently dismissed
  function wasRecentlyDismissed() {
    const ts = localStorage.getItem(STORAGE_KEY);
    if (!ts) return false;
    return (Date.now() - parseInt(ts, 10)) < DISMISS_DURATION;
  }

  function openPopup() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Pause lenis if available
    if (window.lenis) window.lenis.stop();
  }

  function closePopup() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    // Resume lenis if available
    if (window.lenis) window.lenis.start();
  }

  // Show popup after delay (only if not dismissed recently)
  if (!wasRecentlyDismissed()) {
    setTimeout(() => {
      openPopup();
    }, 4000);
  }

  // Close handlers
  closeBtn.addEventListener('click', closePopup);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePopup();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closePopup();
    }
  });

  // Form submission — show discount code
  if (form && successBox) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('promo-popup-email')?.value;
      if (!email) return;

      // Hide form, show success state
      form.style.display = 'none';
      successBox.classList.add('visible');

      // Auto-close after showing the code
      setTimeout(() => {
        closePopup();
      }, 4500);
    });
  }
}

/* ============================================================
   EDITORIAL PRELOADER ANIMATION LOGIC (001% -> 100%)
   ============================================================ */
function initPreloader() {
  const overlay = document.getElementById('preloader-overlay');
  const counterEl = document.getElementById('preloader-counter');
  const progressBarEl = document.getElementById('preloader-progress-bar');
  const glowDotEl = document.getElementById('preloader-glow-dot');
  const tickerEl = document.getElementById('preloader-ticker');
  if (!overlay || !counterEl || !progressBarEl) return;

  // Lock scroll during preloader
  document.body.style.overflow = 'hidden';
  if (window.lenis) window.lenis.stop();

  let count = 1;
  const duration = 2200; // 2.2s total smooth animation duration
  const startTime = performance.now();

  const tickerMessages = [
    { threshold: 1, text: 'INITIALIZING HIGH-RES ASSETS...' },
    { threshold: 25, text: 'LOADING CATALOG ARCHIVE...' },
    { threshold: 55, text: 'CALCULATING TYPOGRAPHY & LAYOUT...' },
    { threshold: 85, text: 'PREPARING STOREFRONT EXPERIENCE...' },
    { threshold: 100, text: 'WELCOME TO RELIST ARCHIVE' }
  ];

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic for realistic deceleration as it approaches 100%
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    count = Math.floor(easeProgress * 99) + 1;

    // Pad counter to 3 digits (e.g. 001, 042, 100)
    counterEl.textContent = String(count).padStart(3, '0');
    progressBarEl.style.width = `${count}%`;
    if (glowDotEl) glowDotEl.style.left = `${count}%`;

    // Update ticker text based on progress threshold
    if (tickerEl) {
      const msg = tickerMessages.slice().reverse().find(m => count >= m.threshold);
      if (msg) tickerEl.textContent = msg.text;
    }

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      counterEl.textContent = '100';
      progressBarEl.style.width = '100%';
      if (glowDotEl) glowDotEl.style.left = '100%';
      if (tickerEl) tickerEl.textContent = 'WELCOME TO RELIST ARCHIVE';

      // Pause briefly at 100% then animate curtain exit
      setTimeout(() => {
        overlay.classList.add('is-loaded');
        document.body.style.overflow = '';
        if (window.lenis) window.lenis.start();

        // Cleanup element after exit animation completes
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 900);
      }, 350);
    }
  }

  requestAnimationFrame(updateCounter);
}

// Expose replay helper on window for customizer / testing
window.replayPreloader = function() {
  const overlay = document.getElementById('preloader-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  overlay.classList.remove('is-loaded');
  initPreloader();
};

