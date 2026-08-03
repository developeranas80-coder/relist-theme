import { themePresets } from './data.js';

export function initCustomizer(storefrontApp, updateProductCardStyle) {
  // Drawer Elements
  const customizerOverlay = document.getElementById('customizer-drawer-overlay');
  const customizerCloseBtn = document.getElementById('customizer-drawer-close-btn');
  const customizerFloatingTrigger = document.getElementById('customizer-floating-trigger');

  // Drawer open/close
  if (customizerFloatingTrigger) {
    customizerFloatingTrigger.addEventListener('click', () => {
      customizerOverlay.classList.add('active');
    });
  }
  if (customizerCloseBtn) {
    customizerCloseBtn.addEventListener('click', () => {
      customizerOverlay.classList.remove('active');
    });
  }
  if (customizerOverlay) {
    customizerOverlay.addEventListener('click', (e) => {
      if (e.target === customizerOverlay) {
        customizerOverlay.classList.remove('active');
      }
    });
  }

  const presetCards = document.querySelectorAll('.preset-card');

  // Color inputs
  const colorPrimaryBg = document.getElementById('color-primary-bg');
  const colorSecondaryBg = document.getElementById('color-secondary-bg');
  const colorAccent = document.getElementById('color-accent');
  const colorText = document.getElementById('color-text');

  // Font inputs
  const fontHeadingsSelect = document.getElementById('font-headings-select');
  const fontBodySelect = document.getElementById('font-body-select');

  // Header inputs
  const showAnnouncementCheckbox = document.getElementById('header-show-announcement');
  const announcementTextInput = document.getElementById('header-announcement-text');
  const stickyHeaderCheckbox = document.getElementById('header-sticky');
  const transparentHeaderCheckbox = document.getElementById('header-transparent');
  const announcementBar = document.getElementById('announcement-bar-element');
  const storeHeader = document.getElementById('store-header-element');

  // Hero inputs
  const heroTitleInput = document.getElementById('hero-title-input');
  const heroTitleElement = document.getElementById('hero-title-element');
  const heroOverlaySlider = document.getElementById('hero-overlay-input');
  const heroOverlay = document.getElementById('hero-overlay-element');

  // Product Card inputs
  const cardStyleSelect = document.getElementById('card-style-select');
  const showRatingCheckbox = document.getElementById('grid-show-rating');

  // Helper: HEX to RGB
  function hexToRgbChannels(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
  }

  // Apply preset
  function applyPreset(preset) {
    const root = document.documentElement;
    root.style.setProperty('--primary-bg', preset.primaryBg);
    root.style.setProperty('--secondary-bg', preset.secondaryBg);
    root.style.setProperty('--accent-color', preset.accentColor);
    root.style.setProperty('--text-color', preset.textColor);

    if (colorPrimaryBg) colorPrimaryBg.value = preset.primaryBg;
    if (colorSecondaryBg) colorSecondaryBg.value = preset.secondaryBg;
    if (colorAccent) colorAccent.value = preset.accentColor;
    if (colorText) colorText.value = preset.textColor;

    if (fontHeadingsSelect) fontHeadingsSelect.value = preset.headerFont;
    if (fontBodySelect) fontBodySelect.value = preset.bodyFont;
    root.style.setProperty('--font-family', preset.bodyFont);
  }

  // Preset card clicks
  presetCards.forEach(card => {
    card.addEventListener('click', () => {
      presetCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const presetKey = card.dataset.preset;
      if (themePresets[presetKey]) {
        applyPreset(themePresets[presetKey]);
      }
    });
  });

  // Color input changes
  function onColorChange() {
    const root = document.documentElement;
    if (colorPrimaryBg) root.style.setProperty('--primary-bg', colorPrimaryBg.value);
    if (colorSecondaryBg) root.style.setProperty('--secondary-bg', colorSecondaryBg.value);
    if (colorAccent) root.style.setProperty('--accent-color', colorAccent.value);
    if (colorText) root.style.setProperty('--text-color', colorText.value);
  }

  [colorPrimaryBg, colorSecondaryBg, colorAccent, colorText].forEach(input => {
    if (input) input.addEventListener('input', onColorChange);
  });

  // Font changes
  if (fontHeadingsSelect) {
    fontHeadingsSelect.addEventListener('change', () => {
      document.documentElement.style.setProperty('--font-family', fontHeadingsSelect.value);
    });
  }
  if (fontBodySelect) {
    fontBodySelect.addEventListener('change', () => {
      document.documentElement.style.setProperty('--font-family', fontBodySelect.value);
    });
  }

  // Announcement bar toggle
  if (showAnnouncementCheckbox && announcementBar) {
    showAnnouncementCheckbox.addEventListener('change', (e) => {
      announcementBar.classList.toggle('visible', e.target.checked);
    });
  }

  if (announcementTextInput && announcementBar) {
    announcementTextInput.addEventListener('input', (e) => {
      announcementBar.textContent = e.target.value;
    });
  }

  // Sticky header
  if (stickyHeaderCheckbox && storeHeader) {
    stickyHeaderCheckbox.addEventListener('change', (e) => {
      storeHeader.style.position = e.target.checked ? 'fixed' : 'relative';
    });
  }

  // Transparent header
  if (transparentHeaderCheckbox && storeHeader) {
    transparentHeaderCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        storeHeader.classList.add('transparent');
      } else {
        storeHeader.classList.remove('transparent');
      }
    });
  }

  // Hero title
  if (heroTitleInput && heroTitleElement) {
    heroTitleInput.addEventListener('input', (e) => {
      heroTitleElement.textContent = e.target.value;
    });
  }

  // Hero overlay
  if (heroOverlaySlider && heroOverlay) {
    heroOverlaySlider.addEventListener('input', (e) => {
      heroOverlay.style.backgroundColor = `rgba(0, 0, 0, ${e.target.value / 100})`;
    });
  }

  // Card style
  if (cardStyleSelect) {
    cardStyleSelect.addEventListener('change', (e) => {
      updateProductCardStyle(e.target.value);
    });
  }

  // Show ratings
  if (showRatingCheckbox) {
    showRatingCheckbox.addEventListener('change', (e) => {
      const ratings = storefrontApp.querySelectorAll('.card-rating-row, .product-rating');
      ratings.forEach(r => {
        r.style.display = e.target.checked ? 'flex' : 'none';
      });
    });
  }
}
