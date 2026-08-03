import { products, categoryCards, menuCategories } from './data.js';

export function initStorefront(storefrontApp) {
  let cart = [];
  let currentCollection = 'all';
  let currentGridCols = 5;

  // Key Elements
  const catalogGrid = document.getElementById('catalog-grid');
  const homepageView = document.getElementById('homepage-view');
  const collectionView = document.getElementById('collection-view');
  const productDetailView = document.getElementById('product-detail-view');
  const detailLayoutBox = document.getElementById('product-detail-layout-box');

  // Header
  const storeHeader = document.getElementById('store-header-element');

  // Cart Drawer Elements
  const cartTriggerBtn = document.getElementById('cart-trigger-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartDrawerOverlay = document.getElementById('cart-drawer-overlay-element');
  const cartDrawerItemsBox = document.getElementById('cart-drawer-items-box');
  const cartSubtotalAmount = document.getElementById('cart-subtotal-amount');
  const cartBadgeCount = document.getElementById('cart-badge-count');

  // Search Elements
  const searchTriggerBtn = document.getElementById('search-trigger-btn');
  const searchLabelText = document.getElementById('search-label-text');
  const searchCloseBtn = document.getElementById('search-close-btn');
  const searchOverlay = document.getElementById('search-overlay-element');
  const searchInputField = document.getElementById('search-input-field');
  const searchHitsGrid = document.getElementById('search-hits-grid');

  // Quick View Elements
  const quickViewOverlay = document.getElementById('quick-view-overlay-element');
  const quickViewCloseBtn = document.getElementById('quick-view-close-btn');
  const quickViewMediaBox = document.getElementById('quick-view-media-box');
  const quickViewInfoBox = document.getElementById('quick-view-info-box');

  // Breadcrumb
  const breadcrumbHome = document.getElementById('breadcrumb-home');
  const breadcrumbCurrent = document.getElementById('breadcrumb-current');

  // Filter Drawer
  const filterDrawerOverlay = document.getElementById('filter-drawer-overlay');
  const filterDrawerTrigger = document.getElementById('filter-drawer-trigger');
  const filterDrawerClose = document.getElementById('filter-drawer-close');
  const filterApplyBtn = document.getElementById('filter-apply-btn');
  const filterClearBtn = document.getElementById('filter-clear-btn');

  // Product Count
  const productCountLabel = document.getElementById('product-count-label');

  // Global sync reference
  window.setCustomizerSync = () => {};

  /* ============================================================
     NAVIGATION — 3 views: Homepage, Collection, Product Detail
     ============================================================ */
  function showHomepage() {
    homepageView.style.display = 'block';
    collectionView.style.display = 'none';
    productDetailView.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Homepage gets transparent header
    storeHeader.classList.add('transparent');
    if (window.scrollY > 50) {
      storeHeader.classList.add('scrolled');
    } else {
      storeHeader.classList.remove('scrolled');
    }
  }

  function showCollection(collectionSlug) {
    currentCollection = collectionSlug || 'all';
    homepageView.style.display = 'none';
    collectionView.style.display = 'block';
    productDetailView.style.display = 'none';
    window.scrollTo({ top: 0 });

    // Collection page = solid white header
    storeHeader.classList.remove('transparent');
    storeHeader.classList.add('scrolled');

    // Update breadcrumb
    const collName = collectionSlug === 'all' ? 'ALL PRODUCTS' : collectionSlug.replace('-', ' ').toUpperCase();
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = 'WOMEN - ' + collName;

    // Update active filter tab
    updateFilterTabs(currentCollection);
    renderCatalog();
  }

  function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    renderProductDetailPage(product);

    homepageView.style.display = 'none';
    collectionView.style.display = 'none';
    productDetailView.style.display = 'block';
    window.scrollTo({ top: 0 });

    // PDP = solid white header
    storeHeader.classList.remove('transparent');
    storeHeader.classList.add('scrolled');
  }

  /* ============================================================
     HEADER SCROLL HANDLER
     ============================================================ */
  window.addEventListener('scroll', () => {
    // Only apply transparency toggle on homepage
    if (homepageView.style.display !== 'none') {
      if (window.scrollY > 50) {
        storeHeader.classList.add('scrolled');
      } else {
        storeHeader.classList.remove('scrolled');
      }
    }
  });

  /* ============================================================
     LOGO CLICK → HOMEPAGE
     ============================================================ */
  document.getElementById('store-logo-link').addEventListener('click', (e) => {
    e.preventDefault();
    showHomepage();
  });

  // Breadcrumb home
  if (breadcrumbHome) {
    breadcrumbHome.addEventListener('click', (e) => {
      e.preventDefault();
      showHomepage();
    });
  }

  /* ============================================================
     NAV LINKS — Go to Collection View
     ============================================================ */
  document.querySelectorAll('.nav-link-top').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showCollection(link.dataset.link || 'all');
    });
  });

  /* ============================================================
     CATEGORY CARD CLICKS (Homepage)
     ============================================================ */
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      showCollection(card.dataset.link || 'all');
    });
  });

  /* ============================================================
     PRODUCT SLIDER — Horizontal scroll with arrow navigation
     ============================================================ */
  function createSliderCard(product) {
    const card = document.createElement('div');
    card.className = `product-card card-style-${currentCardStyle}`;
    card.dataset.id = product.id;

    const comparePriceHTML = product.compareAtPrice
      ? `<span class="card-price-compare">PKR ${product.compareAtPrice.toLocaleString()}</span>`
      : '';

    const colorDotsHTML = product.colors.map((c, i) => `
      <span class="swatch-dot ${i === 0 ? 'active' : ''}" style="background-color: ${c.hex};" title="${c.name}"></span>
    `).join('');

    card.innerHTML = `
      <div class="card-media">
        ${product.compareAtPrice ? '<span class="card-badge-tag">Sale</span>' : ''}
        <img src="${product.images[0]}" class="card-img img-primary" alt="${product.title}">
        <img src="${product.images[1] || product.images[0]}" class="card-img img-hover" alt="${product.title}">
        <div class="card-quick-add-bar">
          <span class="card-quick-add-text">Add to Basket</span>
          <span class="card-quick-add-icon">
            <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          </span>
        </div>
      </div>
      <div class="card-details">
        <h3 class="card-title">${product.title}</h3>
        <div class="card-subtitle">${product.fit} | ${product.gender}</div>
        <div class="card-price-wrapper">
          <span class="card-price-current">PKR ${product.price.toLocaleString()}</span>
          ${comparePriceHTML}
        </div>
        <div class="card-swatches">
          ${colorDotsHTML}
        </div>
      </div>
    `;

    // Click on card image → product detail
    card.querySelector('.card-media').addEventListener('click', (e) => {
      if (e.target.closest('.card-quick-add-bar')) {
        e.stopPropagation();
        openQuickView(product);
      } else {
        showProductDetail(product.id);
      }
    });

    card.querySelector('.card-details').addEventListener('click', () => {
      showProductDetail(product.id);
    });

    return card;
  }

  function renderProductSlider(sliderId, filterFn) {
    const track = document.getElementById(sliderId);
    if (!track) return;

    track.innerHTML = '';
    const filtered = products.filter(filterFn);

    filtered.forEach(product => {
      const card = createSliderCard(product);
      track.appendChild(card);
    });
  }

  // Slider arrow navigation
  function initSliderArrows() {
    document.querySelectorAll('.slider-arrow').forEach(arrow => {
      arrow.addEventListener('click', () => {
        const sliderId = arrow.dataset.slider;
        const track = document.getElementById(`slider-${sliderId}`);
        if (!track) return;

        const cardWidth = track.querySelector('.product-card')?.offsetWidth || 300;
        const scrollAmount = cardWidth * 2;

        if (arrow.classList.contains('slider-prev')) {
          track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      });
    });
  }

  // Render all homepage sliders
  function renderHomepageSliders() {
    // New Arrivals
    renderProductSlider('slider-new-arrivals', p => p.tags && p.tags.includes('new-arrivals'));

    // Best Sellers (default: all)
    renderProductSlider('slider-best-sellers', p => p.tags && p.tags.includes('best-sellers'));

    // Trending Now
    renderProductSlider('slider-trending', p => p.tags && p.tags.includes('trending'));
  }

  /* ============================================================
     BEST SELLERS TABS
     ============================================================ */
  document.querySelectorAll('.bs-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.bs-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.dataset.bsCat;
      renderProductSlider('slider-best-sellers', p => {
        const isBestSeller = p.tags && p.tags.includes('best-sellers');
        if (cat === 'all') return isBestSeller;
        return isBestSeller && p.category === cat;
      });
    });
  });

  /* ============================================================
     PROMO BANNER CLICKS
     ============================================================ */
  document.querySelectorAll('.promo-banner-card').forEach(card => {
    card.addEventListener('click', () => {
      showCollection(card.dataset.link || 'all');
    });
  });

  /* ============================================================
     VIEW ALL LINKS
     ============================================================ */
  document.querySelectorAll('.view-all-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showCollection(link.dataset.link || 'all');
    });
  });

  /* ============================================================
     HAMBURGER MENU DRAWER — Relist with Gender Tabs
     ============================================================ */
  const menuDrawerOverlay = document.getElementById('menu-drawer-overlay-element');
  const menuDrawerTrigger = document.getElementById('menu-drawer-trigger-btn');
  const menuDrawerClose = document.getElementById('menu-drawer-close-btn');
  const menuNavLinks = document.getElementById('menu-drawer-nav-links');

  let currentMenuGender = 'WOMEN';

  function renderMenuLinks(gender) {
    if (!menuNavLinks) return;
    menuNavLinks.innerHTML = '';
    const cats = menuCategories[gender] || [];
    cats.forEach(cat => {
      const link = document.createElement('a');
      link.href = '#';
      link.className = 'menu-nav-link';
      link.textContent = cat.label;
      link.dataset.link = cat.slug;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        menuDrawerOverlay.classList.remove('active');
        showCollection(cat.slug);
      });
      menuNavLinks.appendChild(link);
    });
  }

  // Gender tab clicks
  document.querySelectorAll('.menu-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentMenuGender = tab.dataset.gender;
      renderMenuLinks(currentMenuGender);
    });
  });

  if (menuDrawerTrigger) {
    menuDrawerTrigger.addEventListener('click', () => {
      renderMenuLinks(currentMenuGender);
      menuDrawerOverlay.classList.add('active');
    });
  }

  if (menuDrawerClose) {
    menuDrawerClose.addEventListener('click', () => {
      menuDrawerOverlay.classList.remove('active');
    });
  }

  if (menuDrawerOverlay) {
    menuDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === menuDrawerOverlay) {
        menuDrawerOverlay.classList.remove('active');
      }
    });
  }

  // Promo button in menu drawer
  document.querySelectorAll('.menu-promo-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      menuDrawerOverlay.classList.remove('active');
      showCollection(btn.dataset.link || 'all');
    });
  });

  /* ============================================================
     FILTER TABS (Collection Page)
     ============================================================ */
  function updateFilterTabs(slug) {
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.collection === slug);
    });
  }

  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentCollection = tab.dataset.collection;
      updateFilterTabs(currentCollection);
      renderCatalog();
    });
  });

  /* ============================================================
     FILTER DRAWER
     ============================================================ */
  if (filterDrawerTrigger) {
    filterDrawerTrigger.addEventListener('click', () => {
      filterDrawerOverlay.classList.add('active');
    });
  }

  if (filterDrawerClose) {
    filterDrawerClose.addEventListener('click', () => {
      filterDrawerOverlay.classList.remove('active');
    });
  }

  if (filterDrawerOverlay) {
    filterDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === filterDrawerOverlay) {
        filterDrawerOverlay.classList.remove('active');
      }
    });
  }

  if (filterApplyBtn) {
    filterApplyBtn.addEventListener('click', () => {
      filterDrawerOverlay.classList.remove('active');
      renderCatalog();
    });
  }

  if (filterClearBtn) {
    filterClearBtn.addEventListener('click', () => {
      // Clear all filter inputs
      filterDrawerOverlay.querySelectorAll('input[type="radio"]').forEach(r => r.checked = r.value === 'featured');
      filterDrawerOverlay.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
      filterDrawerOverlay.querySelectorAll('.filter-size-pill').forEach(p => p.classList.remove('active'));
    });
  }

  // Size pill toggle
  document.querySelectorAll('.filter-size-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('active');
    });
  });

  /* ============================================================
     GRID LAYOUT TOGGLES
     ============================================================ */
  document.querySelectorAll('.grid-toggle[data-cols]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cols = parseInt(btn.dataset.cols);
      if (!cols) return;
      currentGridCols = cols;
      catalogGrid.className = `product-grid cols-${cols}`;
      document.querySelectorAll('.grid-toggle[data-cols]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* ============================================================
     CATALOG RENDERING — Relist product card layout
     ============================================================ */
  let currentCardStyle = 'minimal';

  function renderCatalog() {
    catalogGrid.innerHTML = '';

    let filtered = currentCollection === 'all'
      ? products
      : products.filter(p => p.category === currentCollection);

    // Apply sort
    const sortValue = filterDrawerOverlay?.querySelector('input[name="sort"]:checked')?.value;
    if (sortValue === 'price-asc') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-desc') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    // Update product count
    if (productCountLabel) {
      productCountLabel.textContent = `${filtered.length} Products`;
    }

    filtered.forEach(product => {
      const card = createSliderCard(product);
      catalogGrid.appendChild(card);
    });
  }

  function updateProductCardStyle(styleName) {
    currentCardStyle = styleName;
    renderCatalog();
  }

  /* ============================================================
     CART DRAWER
     ============================================================ */
  function openCartDrawer() { cartDrawerOverlay.classList.add('active'); }
  function closeCartDrawer() { cartDrawerOverlay.classList.remove('active'); }

  cartTriggerBtn.addEventListener('click', openCartDrawer);
  cartCloseBtn.addEventListener('click', closeCartDrawer);
  cartDrawerOverlay.addEventListener('click', (e) => {
    if (e.target === cartDrawerOverlay) closeCartDrawer();
  });

  function addToCart(product, color, size, qty = 1) {
    const existing = cart.find(item =>
      item.product.id === product.id && item.color === color && item.size === size
    );
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ product, color, size, qty });
    }
    renderCart();
    openCartDrawer();
  }

  function renderCart() {
    cartDrawerItemsBox.innerHTML = '';
    if (cart.length === 0) {
      cartDrawerItemsBox.innerHTML = '<div class="cart-empty-message">Your bag is empty</div>';
      cartSubtotalAmount.textContent = 'PKR 0';
      cartBadgeCount.textContent = '0';
      return;
    }

    let subtotal = 0;
    let badgeCount = 0;

    cart.forEach((item, index) => {
      subtotal += item.product.price * item.qty;
      badgeCount += item.qty;

      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <div class="cart-item-img"><img src="${item.product.images[0]}" alt="${item.product.title}"></div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.product.title}</h4>
          <div class="cart-item-meta">Size: ${item.size} | Color: ${item.color}</div>
          <span class="cart-item-price">PKR ${item.product.price.toLocaleString()}</span>
          <div class="cart-item-qty">
            <button class="qty-btn dec-qty" data-index="${index}">-</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn inc-qty" data-index="${index}">+</button>
          </div>
          <button class="cart-item-remove" data-index="${index}">Remove</button>
        </div>
      `;

      cartItem.querySelector('.dec-qty').addEventListener('click', () => updateQty(index, -1));
      cartItem.querySelector('.inc-qty').addEventListener('click', () => updateQty(index, 1));
      cartItem.querySelector('.cart-item-remove').addEventListener('click', () => removeCartItem(index));
      cartDrawerItemsBox.appendChild(cartItem);
    });

    cartSubtotalAmount.textContent = `PKR ${subtotal.toLocaleString()}`;
    cartBadgeCount.textContent = badgeCount;
  }

  function updateQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    renderCart();
  }

  function removeCartItem(index) {
    cart.splice(index, 1);
    renderCart();
  }

  /* ============================================================
     SEARCH
     ============================================================ */
  function openSearch() {
    searchOverlay.classList.add('active');
    setTimeout(() => searchInputField.focus(), 150);
  }

  function closeSearch() {
    searchOverlay.classList.remove('active');
    searchInputField.value = '';
  }

  // Click on search icon or label
  if (searchTriggerBtn) searchTriggerBtn.addEventListener('click', openSearch);
  if (searchLabelText) searchLabelText.addEventListener('click', openSearch);
  if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);

  if (searchInputField) {
    searchInputField.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (q === '') {
        searchHitsGrid.innerHTML = '';
        return;
      }

      const hits = products.filter(p =>
        p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );

      searchHitsGrid.innerHTML = '';
      if (hits.length === 0) {
        searchHitsGrid.innerHTML = '<div style="grid-column:1/-1; font-size:13px; opacity:0.6;">No results found</div>';
        return;
      }

      hits.forEach(hit => {
        const hitEl = document.createElement('a');
        hitEl.className = 'hit-item';
        hitEl.href = '#';
        hitEl.innerHTML = `
          <img class="hit-img" src="${hit.images[0]}" alt="${hit.title}">
          <div class="hit-info">
            <h4>${hit.title}</h4>
            <span>PKR ${hit.price.toLocaleString()}</span>
          </div>
        `;
        hitEl.addEventListener('click', (ev) => {
          ev.preventDefault();
          closeSearch();
          showProductDetail(hit.id);
        });
        searchHitsGrid.appendChild(hitEl);
      });
    });
  }

  document.querySelectorAll('.suggestion-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      searchInputField.value = tag.textContent;
      searchInputField.dispatchEvent(new Event('input'));
    });
  });

  /* ============================================================
     QUICK VIEW MODAL
     ============================================================ */
  function openQuickView(product) {
    quickViewMediaBox.innerHTML = `<img src="${product.images[0]}" alt="${product.title}">`;

    const colorsHTML = product.colors.map((c, i) => `
      <button class="color-swatch-btn ${i === 0 ? 'active' : ''}" style="background-color: ${c.hex};" data-color="${c.name}"></button>
    `).join('');

    const sizesHTML = product.sizes.map((s, i) => `
      <button class="size-option-btn ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>
    `).join('');

    quickViewInfoBox.innerHTML = `
      <h3 style="font-size:16px; font-weight:700; text-transform:uppercase; margin-bottom:4px;">${product.title}</h3>
      <div style="font-size:13px; color:#6B6B6B; margin-bottom:12px;">${product.fit}</div>
      <div style="font-size:15px; font-weight:700; margin-bottom:20px;">PKR ${product.price.toLocaleString()}</div>
      <div style="margin-bottom:20px;">
        <div style="font-size:12px; margin-bottom:8px;">Color: <span id="qv-selected-color">${product.colors[0].name}</span></div>
        <div class="color-swatches-row">${colorsHTML}</div>
      </div>
      <div style="margin-bottom:24px;">
        <div style="font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px;">Select Size</div>
        <div class="size-options-row">${sizesHTML}</div>
      </div>
      <button class="add-to-cart-btn" id="qv-add-btn">
        <span>ADD TO CART</span>
        <span class="btn-bag-icon"><svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg></span>
      </button>
      <a href="#" id="qv-full-details" style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#000; margin-top:16px; text-align:center; font-weight:600; text-decoration:underline;">View Full Details</a>
    `;

    // Wire up interactions
    const colorBtns = quickViewInfoBox.querySelectorAll('.color-swatch-btn');
    const colorLabel = quickViewInfoBox.querySelector('#qv-selected-color');
    colorBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        colorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        colorLabel.textContent = btn.dataset.color;
      });
    });

    const sizeBtns = quickViewInfoBox.querySelectorAll('.size-option-btn');
    sizeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    quickViewInfoBox.querySelector('#qv-add-btn').addEventListener('click', () => {
      const color = quickViewInfoBox.querySelector('.color-swatch-btn.active').dataset.color;
      const size = quickViewInfoBox.querySelector('.size-option-btn.active').dataset.size;
      addToCart(product, color, size);
      closeQuickView();
    });

    quickViewInfoBox.querySelector('#qv-full-details').addEventListener('click', (e) => {
      e.preventDefault();
      closeQuickView();
      showProductDetail(product.id);
    });

    quickViewOverlay.classList.add('active');
  }

  function closeQuickView() { quickViewOverlay.classList.remove('active'); }
  quickViewCloseBtn.addEventListener('click', closeQuickView);
  quickViewOverlay.addEventListener('click', (e) => {
    if (e.target === quickViewOverlay) closeQuickView();
  });

  /* ============================================================
     PRODUCT DETAIL PAGE — Relist exact layout
     ============================================================ */
  function renderProductDetailPage(product) {
    const colorsHTML = product.colors.map((c, i) => `
      <button class="color-swatch-btn ${i === 0 ? 'active' : ''}" style="background-color: ${c.hex};" data-color="${c.name}"></button>
    `).join('');

    const sizesHTML = product.sizes.map((s, i) => `
      <button class="size-option-btn ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>
    `).join('');

    const comparePriceHTML = product.compareAtPrice
      ? `<span class="compare-price">PKR ${product.compareAtPrice.toLocaleString()}</span>`
      : '';

    // Build image gallery — use 2-column grid of images
    const galleryImages = [];
    product.images.forEach(img => {
      galleryImages.push(img);
    });
    if (galleryImages.length < 3) {
      galleryImages.push(...product.images);
    }

    const galleryHTML = galleryImages.map(img => `
      <img class="product-gallery-img" src="${img}" alt="${product.title}">
    `).join('');

    detailLayoutBox.innerHTML = `
      <!-- Image Gallery (2 column grid) -->
      <div class="product-gallery">
        ${galleryHTML}
      </div>

      <!-- Info Panel -->
      <div class="product-info-panel">
        <h2 class="product-title-large">${product.title}</h2>
        <div class="product-fit-label">${product.fit}</div>

        <div class="product-price-large">
          <span>PKR ${product.price.toLocaleString()}</span>
          ${comparePriceHTML}
        </div>

        <!-- Color -->
        <div class="variant-section">
          <div class="variant-label">${product.colors[0].name}</div>
          <div class="color-swatches-row">${colorsHTML}</div>
        </div>

        <!-- Size -->
        <div class="variant-section">
          <div class="size-selector-header">
            <span class="size-selector-label">SELECT SIZE</span>
            <span class="size-guide-link">SIZE GUIDE</span>
          </div>
          <div class="size-options-row">${sizesHTML}</div>
        </div>

        <!-- ADD TO CART Button -->
        <button class="add-to-cart-btn" id="detail-add-btn">
          <span>ADD TO CART</span>
          <span class="btn-bag-icon">
            <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          </span>
        </button>

        <!-- Description -->
        <div class="product-description-section">
          <h3 class="product-description-title">PRODUCT DESCRIPTION</h3>
          <div class="product-description-text">${product.description}</div>
        </div>

        <!-- Accordion Sections — + icon on LEFT like Relist -->
        <div class="accordion-wrapper">
          <div class="accordion-item">
            <button class="accordion-header">
              <span class="accordion-icon">+</span>
              SIZE GUIDE
            </button>
            <div class="accordion-content">
              <p>Please refer to our size chart for accurate measurements. We recommend ordering your usual size for a true-to-size fit.</p>
            </div>
          </div>
          <div class="accordion-item">
            <button class="accordion-header">
              <span class="accordion-icon">+</span>
              PRODUCT DETAILS & COMPOSITION
            </button>
            <div class="accordion-content">
              <p>100% Cotton. Machine washable at 30°C. Do not bleach. Iron on medium heat. Do not tumble dry.</p>
            </div>
          </div>
          <div class="accordion-item">
            <button class="accordion-header">
              <span class="accordion-icon">+</span>
              DELIVERIES & RETURNS
            </button>
            <div class="accordion-content">
              <p>Standard delivery: 3-5 working days. Free shipping on orders above PKR 3,000. Returns accepted within 15 days of delivery. Items must be unworn with tags attached.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Wire up interactions
    const colorBtns = detailLayoutBox.querySelectorAll('.color-swatch-btn');
    const colorLabel = detailLayoutBox.querySelector('.variant-label');
    colorBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        colorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (colorLabel) colorLabel.textContent = btn.dataset.color;
      });
    });

    const sizeBtns = detailLayoutBox.querySelectorAll('.size-option-btn');
    sizeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Add to cart
    detailLayoutBox.querySelector('#detail-add-btn').addEventListener('click', () => {
      const color = detailLayoutBox.querySelector('.color-swatch-btn.active').dataset.color;
      const size = detailLayoutBox.querySelector('.size-option-btn.active').dataset.size;
      addToCart(product, color, size);
    });

    // Accordions
    detailLayoutBox.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const isActive = item.classList.contains('active');

        detailLayoutBox.querySelectorAll('.accordion-item').forEach(acc => {
          acc.classList.remove('active');
          acc.querySelector('.accordion-content').style.maxHeight = '0';
        });

        if (!isActive) {
          item.classList.add('active');
          const content = item.querySelector('.accordion-content');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  /* ============================================================
     FOOTER LINKS
     ============================================================ */
  document.querySelectorAll('.footer-links a[data-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showCollection(link.dataset.link || 'all');
    });
  });

  /* ============================================================
     HERO VIDEO SLIDER
     ============================================================ */
  function initHeroSlider() {
    const slider = document.getElementById('hero-slider-element');
    const track = document.getElementById('hero-slides-track');
    const dotsContainer = document.getElementById('hero-dots-container');
    if (!slider || !track || !dotsContainer) return;

    const slides = track.querySelectorAll('.hero-slide');
    const dots = dotsContainer.querySelectorAll('.dot');
    let currentIndex = 0;
    let autoSlideInterval;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
        const video = slide.querySelector('video');
        if (video) {
          if (i === index) {
            video.play().catch(e => {});
          } else {
            video.pause();
          }
        }
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });

      currentIndex = index;
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        const index = parseInt(dot.dataset.slide);
        showSlide(index);
        startAutoSlide();
      });
    });

    // Handle slide click to collection
    slides.forEach(slide => {
      const cta = slide.querySelector('.hero-cta-btn');
      if (cta) {
        cta.addEventListener('click', (e) => {
          e.preventDefault();
          showCollection(cta.dataset.link || 'all');
        });
      }
    });

    function startAutoSlide() {
      autoSlideInterval = setInterval(() => {
        let nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex);
      }, 7000);
    }

    startAutoSlide();
  }

  /* ============================================================
     INIT — Render all homepage content
     ============================================================ */
  renderCart();
  renderHomepageSliders();
  initSliderArrows();
  initHeroSlider();
  initPreloader();

  return {
    updateProductCardStyle,
    showCollection,
    showHomepage
  };
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

  document.body.style.overflow = 'hidden';

  let count = 1;
  const duration = 2200;
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

    const easeProgress = 1 - Math.pow(1 - progress, 3);
    count = Math.floor(easeProgress * 99) + 1;

    counterEl.textContent = String(count).padStart(3, '0');
    progressBarEl.style.width = `${count}%`;
    if (glowDotEl) glowDotEl.style.left = `${count}%`;

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

      setTimeout(() => {
        overlay.classList.add('is-loaded');
        document.body.style.overflow = '';

        setTimeout(() => {
          overlay.style.display = 'none';
        }, 900);
      }, 350);
    }
  }

  requestAnimationFrame(updateCounter);
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('preloader-overlay') && !window.preloaderInitialized) {
    window.preloaderInitialized = true;
    initPreloader();
  }

  // Initialize Mega Menu
  const navItems = document.querySelectorAll('.nav-item-has-megamenu');
  const megaOverlay = document.getElementById('mega-menu-overlay');
  const megaPanels = document.querySelectorAll('.mega-menu-panel');
  const closeBtn = document.getElementById('mega-menu-close-btn');
  const storeHeader = document.getElementById('store-header-element');
  if (megaOverlay && navItems.length > 0) {
    let activeTarget = null;
    let closeTimer = null;

    function openMegaPanel(targetId) {
      if (closeTimer) clearTimeout(closeTimer);
      activeTarget = targetId;

      megaPanels.forEach(panel => {
        if (panel.id === `megamenu-panel-${targetId}`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });

      megaOverlay.classList.add('is-active');
      if (storeHeader) storeHeader.classList.add('megamenu-open');
    }

    function closeMegaMenu() {
      megaOverlay.classList.remove('is-active');
      if (storeHeader) storeHeader.classList.remove('megamenu-open');
      activeTarget = null;
    }

    function scheduleClose() {
      closeTimer = setTimeout(() => {
        closeMegaMenu();
      }, 200);
    }

    navItems.forEach(item => {
      const targetId = item.dataset.megamenu;

      item.addEventListener('mouseenter', () => openMegaPanel(targetId));
      item.addEventListener('mouseleave', () => scheduleClose());
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (megaOverlay.classList.contains('is-active') && activeTarget === targetId) {
          closeMegaMenu();
        } else {
          openMegaPanel(targetId);
        }
      });
    });

    megaOverlay.addEventListener('mouseenter', () => {
      if (closeTimer) clearTimeout(closeTimer);
    });

    megaOverlay.addEventListener('mouseleave', () => scheduleClose());

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeMegaMenu();
      });
    }

    document.addEventListener('click', (e) => {
      if (megaOverlay.classList.contains('is-active')) {
        if (!megaOverlay.contains(e.target) && !e.target.closest('.nav-item-has-megamenu')) {
          closeMegaMenu();
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMegaMenu();
    });
  }
});

