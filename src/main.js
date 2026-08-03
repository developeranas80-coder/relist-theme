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

  // 1. Initialize Storefront
  const storefront = initStorefront(storefrontApp);

  // 2. Initialize Customizer (pass card update function)
  initCustomizer(storefrontApp, storefront.updateProductCardStyle);

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
