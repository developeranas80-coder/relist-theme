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
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

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
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0 });
    }

    // Collection page = solid white header
    storeHeader.classList.remove('transparent');
    storeHeader.classList.add('scrolled');

    // Update breadcrumb
    const collName = collectionSlug === 'all' ? 'ALL PRODUCTS' : collectionSlug.replace('-', ' ').toUpperCase();
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = 'WOMEN - ' + collName;

    // Dynamic Collection Banner updates
    const bannerTitle = document.getElementById('collection-banner-title');
    const bannerImg = document.getElementById('collection-banner-img');
    const bannerEyebrow = document.getElementById('collection-banner-eyebrow');
    const bannerDesc = document.getElementById('collection-banner-desc');

    const bannerInfo = {
      'all': { title: 'ALL PRODUCTS', img: '/images/charcoal_wool_coat.png', eyebrow: '— COMPLETE CATALOG —', desc: 'Discover our full range of curated luxury streetwear and elevated basics.' },
      't-shirts': { title: 'T-SHIRTS & TEES', img: '/images/graphic_tshirt_green.png', eyebrow: '— ESSENTIAL TEES —', desc: 'Heavyweight organic cotton tees with relaxed boxy silhouettes.' },
      'shirts': { title: 'SHIRTS & TOPS', img: '/images/white_shirt.png', eyebrow: '— TAILORED SHIRTS —', desc: 'Crisp oversized button-downs crafted from premium poplin and linen.' },
      'dresses': { title: 'DRESSES', img: '/images/brown_dress.png', eyebrow: '— ELEGANT SILHOUETTES —', desc: 'Fluid midi dresses and sculpted gowns designed for effortless elegance.' },
      'denim': { title: 'DENIM & OUTERWEAR', img: '/images/charcoal_wool_coat.png', eyebrow: '— STRUCTURED OUTERWEAR —', desc: 'Tailored wool coats, relaxed denim, and modern utilitarian jackets.' },
      'skirts': { title: 'SKIRTS & SHORTS', img: '/images/black_silk_dress.png', eyebrow: '— BOTTOMS & SKIRTS —', desc: 'Pleated skirts, tailored shorts, and fluid silk bottoms.' }
    };

    const info = bannerInfo[currentCollection] || bannerInfo['all'];
    if (bannerTitle) bannerTitle.textContent = info.title;
    if (bannerImg) bannerImg.src = info.img;
    if (bannerEyebrow) bannerEyebrow.textContent = info.eyebrow;
    if (bannerDesc) bannerDesc.innerHTML = `<p>${info.desc}</p>`;

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
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0 });
    }

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
  /* ============================================================
     SIZE CHART MODAL & STICKY BAR INTERACTION
     ============================================================ */
  const sizeChartOverlay = document.getElementById('size-chart-overlay');
  const sizeChartCloseBtn = document.getElementById('size-chart-close-btn');
  const pdpStickyBar = document.getElementById('pdp-sticky-bar');
  const pdpStickyAddBtn = document.getElementById('pdp-sticky-add-btn');

  function openSizeChart() {
    if (sizeChartOverlay) sizeChartOverlay.classList.add('active');
  }

  function closeSizeChart() {
    if (sizeChartOverlay) sizeChartOverlay.classList.remove('active');
  }

  if (sizeChartCloseBtn) sizeChartCloseBtn.addEventListener('click', closeSizeChart);
  if (sizeChartOverlay) {
    sizeChartOverlay.addEventListener('click', (e) => {
      if (e.target === sizeChartOverlay) closeSizeChart();
    });
  }

  // Size chart unit toggle (INCHES / CM)
  document.querySelectorAll('.size-unit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-unit-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const unit = btn.dataset.unit;
      const rows = document.querySelectorAll('#size-chart-table tbody tr');

      rows.forEach(row => {
        const data = JSON.parse(row.dataset[unit] || '{}');
        if (data.chest) row.querySelector('.val-chest').textContent = data.chest;
        if (data.waist) row.querySelector('.val-waist').textContent = data.waist;
        if (data.hips) row.querySelector('.val-hips').textContent = data.hips;
        if (data.shoulder) row.querySelector('.val-shoulder').textContent = data.shoulder;
        if (data.length) row.querySelector('.val-length').textContent = data.length;
      });
    });
  });

  /* ============================================================
     PRODUCT DETAIL PAGE — Relist exact layout + enhancements
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

    // Deterministic low stock number (2 to 5)
    const stockCount = ((product.id.length * 3) % 4) + 2;
    const stockPercentage = Math.round((stockCount / 15) * 100);

    // Build image gallery
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

    // Related products (same category or top picks)
    const relatedProducts = products
      .filter(p => p.id !== product.id && (p.category === product.category || p.tags.includes('trending')))
      .slice(0, 4);

    const relatedGridHTML = relatedProducts.map(p => `
      <div class="product-card" data-id="${p.id}">
        <div class="card-media">
          <img src="${p.images[0]}" class="card-img img-primary" alt="${p.title}">
          <img src="${p.images[1] || p.images[0]}" class="card-img img-hover" alt="${p.title}">
        </div>
        <div class="card-details">
          <h3 class="card-title">${p.title}</h3>
          <div class="card-subtitle">${p.fit}</div>
          <div class="card-price-wrapper">
            <span class="card-price-current">PKR ${p.price.toLocaleString()}</span>
          </div>
        </div>
      </div>
    `).join('');

    detailLayoutBox.innerHTML = `
      <div class="pdp-main-content">
        <!-- Image Gallery (2 column stacked grid with zoom) -->
        <div class="product-gallery">
          ${galleryHTML}
        </div>

        <!-- Info Panel -->
        <div class="product-info-panel">
          <div class="pdp-category-tag">${product.category ? product.category.toUpperCase() : 'EDITORIAL EDIT'}</div>
          <h1 class="product-title-large">${product.title}</h1>
          <div class="product-fit-label">${product.fit}</div>

          <div class="product-price-large">
            <span>PKR ${product.price.toLocaleString()}</span>
            ${comparePriceHTML}
            <span class="pdp-tax-note">Tax included. Shipping calculated at checkout.</span>
          </div>

          <!-- Stock Urgency Indicator -->
          <div class="stock-status-bar">
            <div class="stock-status-header">
              <span class="stock-status-icon">⚡</span>
              <span class="stock-status-text">Low Stock Alert: Only <strong>${stockCount} items</strong> left in stock</span>
            </div>
            <div class="stock-progress-track">
              <div class="stock-progress-fill" style="width: ${stockPercentage}%;"></div>
            </div>
          </div>

          <!-- Color Selector -->
          <div class="variant-section">
            <div class="variant-label-row">
              <span class="variant-label-title">COLOR:</span>
              <span class="variant-label" id="pdp-color-name">${product.colors[0].name}</span>
            </div>
            <div class="color-swatches-row">${colorsHTML}</div>
          </div>

          <!-- Size Selector -->
          <div class="variant-section">
            <div class="size-selector-header">
              <span class="size-selector-label">SELECT SIZE</span>
              <button type="button" class="size-guide-btn" id="open-size-chart-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 6v4M11 6v3M15 6v4M19 6v3"/></svg>
                SIZE GUIDE & MEASUREMENTS
              </button>
            </div>
            <div class="size-options-row">${sizesHTML}</div>
          </div>

          <!-- ADD TO CART Button -->
          <button class="add-to-cart-btn" id="detail-add-btn">
            <span>ADD TO BAG</span>
            <span class="btn-bag-icon">
              <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            </span>
          </button>

          <!-- Luxury Perks Row -->
          <div class="pdp-perks-bar">
            <div class="pdp-perk-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16,8 20,8 23,11 23,16 16,16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              <span>Express 2-3 Day Delivery</span>
            </div>
            <div class="pdp-perk-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Easy 15-Day Returns & Exchange</span>
            </div>
            <div class="pdp-perk-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>100% Authentic Atelier Sourced</span>
            </div>
            <div class="pdp-perk-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>
              <span>Cash on Delivery Supported</span>
            </div>
          </div>

          <!-- Description -->
          <div class="product-description-section">
            <h3 class="product-description-title">GARMENT DESCRIPTION</h3>
            <div class="product-description-text">${product.description}</div>
          </div>

          <!-- Accordions -->
          <div class="accordion-wrapper">
            <div class="accordion-item">
              <button class="accordion-header">
                <span class="accordion-icon">+</span>
                SIZING & FIT NOTES
              </button>
              <div class="accordion-content">
                <p>Designed with a relaxed contemporary cut. Fits true to size for an oversized look; take one size down for a more structured tailored fit. <a href="#" id="accordion-open-chart" style="text-decoration:underline; font-weight:600; color:var(--text-color);">Open Size Chart</a>.</p>
              </div>
            </div>
            <div class="accordion-item">
              <button class="accordion-header">
                <span class="accordion-icon">+</span>
                COMPOSITION & CARE INSTRUCTIONS
              </button>
              <div class="accordion-content">
                <p>• 100% Premium Long-Staple Cotton<br>• Machine wash cold on gentle cycle<br>• Do not tumble dry, lay flat to dry in shade<br>• Cool iron on reverse side if needed</p>
              </div>
            </div>
            <div class="accordion-item">
              <button class="accordion-header">
                <span class="accordion-icon">+</span>
                DELIVERY & FREE RETURNS
              </button>
              <div class="accordion-content">
                <p>Complimentary nationwide shipping on orders over PKR 3,000. Orders dispatched within 24 hours. Returns accepted within 15 days in unworn condition with original tags.</p>
              </div>
            </div>
          </div>

          <!-- Payment Trust Icons -->
          <div class="pdp-trust-footer">
            <span class="pdp-trust-title">GUARANTEED SAFE CHECKOUT</span>
            <div class="pdp-trust-badges">
              <span class="pdp-badge-pill">Visa</span>
              <span class="pdp-badge-pill">MasterCard</span>
              <span class="pdp-badge-pill">Apple Pay</span>
              <span class="pdp-badge-pill">Cash on Delivery</span>
            </div>
          </div>

        </div>
      </div>

      <!-- Customer Reviews Section -->
      <div class="pdp-reviews-section" id="pdp-reviews-section">
        <div class="pdp-reviews-header">
          <div class="pdp-reviews-header-left">
            <h3 class="pdp-reviews-heading">CUSTOMER REVIEWS</h3>
            <p class="pdp-reviews-subheading">What our customers are saying</p>
          </div>
          <div class="pdp-reviews-summary">
            <div class="pdp-reviews-avg">
              <span class="pdp-reviews-avg-number">4.8</span>
              <div class="pdp-reviews-avg-meta">
                <div class="pdp-reviews-stars">
                  <span class="pdp-star filled">&#9733;</span>
                  <span class="pdp-star filled">&#9733;</span>
                  <span class="pdp-star filled">&#9733;</span>
                  <span class="pdp-star filled">&#9733;</span>
                  <span class="pdp-star half">&#9733;</span>
                </div>
                <span class="pdp-reviews-count">Based on 24 reviews</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Rating Breakdown Bars -->
        <div class="pdp-reviews-breakdown">
          <div class="pdp-breakdown-row">
            <span class="pdp-breakdown-label">5 &#9733;</span>
            <div class="pdp-breakdown-track"><div class="pdp-breakdown-fill" style="width: 72%;"></div></div>
            <span class="pdp-breakdown-count">17</span>
          </div>
          <div class="pdp-breakdown-row">
            <span class="pdp-breakdown-label">4 &#9733;</span>
            <div class="pdp-breakdown-track"><div class="pdp-breakdown-fill" style="width: 20%;"></div></div>
            <span class="pdp-breakdown-count">5</span>
          </div>
          <div class="pdp-breakdown-row">
            <span class="pdp-breakdown-label">3 &#9733;</span>
            <div class="pdp-breakdown-track"><div class="pdp-breakdown-fill" style="width: 8%;"></div></div>
            <span class="pdp-breakdown-count">2</span>
          </div>
          <div class="pdp-breakdown-row">
            <span class="pdp-breakdown-label">2 &#9733;</span>
            <div class="pdp-breakdown-track"><div class="pdp-breakdown-fill" style="width: 0%;"></div></div>
            <span class="pdp-breakdown-count">0</span>
          </div>
          <div class="pdp-breakdown-row">
            <span class="pdp-breakdown-label">1 &#9733;</span>
            <div class="pdp-breakdown-track"><div class="pdp-breakdown-fill" style="width: 0%;"></div></div>
            <span class="pdp-breakdown-count">0</span>
          </div>
        </div>

        <!-- Write Review Button -->
        <div class="pdp-reviews-write-row">
          <button class="pdp-write-review-btn" id="pdp-write-review-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            WRITE A REVIEW
          </button>
        </div>

        <!-- Write Review Form (hidden by default) -->
        <div class="pdp-review-form-wrapper" id="pdp-review-form-wrapper" style="display:none;">
          <div class="pdp-review-form">
            <h4 class="pdp-review-form-title">SHARE YOUR EXPERIENCE</h4>
            <div class="pdp-review-form-group">
              <label class="pdp-review-form-label">YOUR NAME</label>
              <input type="text" class="pdp-review-form-input" id="review-name-input" placeholder="Enter your name">
            </div>
            <div class="pdp-review-form-group">
              <label class="pdp-review-form-label">RATING</label>
              <div class="pdp-review-star-picker" id="review-star-picker">
                <span class="pdp-star-pick" data-value="1">&#9733;</span>
                <span class="pdp-star-pick" data-value="2">&#9733;</span>
                <span class="pdp-star-pick" data-value="3">&#9733;</span>
                <span class="pdp-star-pick" data-value="4">&#9733;</span>
                <span class="pdp-star-pick" data-value="5">&#9733;</span>
              </div>
            </div>
            <div class="pdp-review-form-group">
              <label class="pdp-review-form-label">REVIEW TITLE</label>
              <input type="text" class="pdp-review-form-input" id="review-title-input" placeholder="Sum it up in a few words">
            </div>
            <div class="pdp-review-form-group">
              <label class="pdp-review-form-label">YOUR REVIEW</label>
              <textarea class="pdp-review-form-textarea" id="review-body-input" placeholder="Tell us what you think about this piece..." rows="4"></textarea>
            </div>
            <div class="pdp-review-form-actions">
              <button class="pdp-review-submit-btn" id="pdp-review-submit-btn">SUBMIT REVIEW</button>
              <button class="pdp-review-cancel-btn" id="pdp-review-cancel-btn">CANCEL</button>
            </div>
          </div>
        </div>

        <!-- Reviews List -->
        <div class="pdp-reviews-list" id="pdp-reviews-list">
          <div class="pdp-review-card">
            <div class="pdp-review-card-header">
              <div class="pdp-review-author-info">
                <div class="pdp-review-avatar">A</div>
                <div>
                  <span class="pdp-review-author">Ahmed R.</span>
                  <span class="pdp-review-badge">Verified Buyer</span>
                </div>
              </div>
              <div class="pdp-review-card-stars">
                <span class="pdp-star filled">&#9733;</span>
                <span class="pdp-star filled">&#9733;</span>
                <span class="pdp-star filled">&#9733;</span>
                <span class="pdp-star filled">&#9733;</span>
                <span class="pdp-star filled">&#9733;</span>
              </div>
            </div>
            <h4 class="pdp-review-title">Absolutely premium quality</h4>
            <p class="pdp-review-body">The fabric quality is exceptional — feels luxury at an accessible price. Fit is true to size with a relaxed contemporary cut. The stitching and finishing is impeccable. Will definitely order more pieces.</p>
            <span class="pdp-review-date">3 days ago</span>
          </div>

          <div class="pdp-review-card">
            <div class="pdp-review-card-header">
              <div class="pdp-review-author-info">
                <div class="pdp-review-avatar">S</div>
                <div>
                  <span class="pdp-review-author">Sara K.</span>
                  <span class="pdp-review-badge">Verified Buyer</span>
                </div>
              </div>
              <div class="pdp-review-card-stars">
                <span class="pdp-star filled">&#9733;</span>
                <span class="pdp-star filled">&#9733;</span>
                <span class="pdp-star filled">&#9733;</span>
                <span class="pdp-star filled">&#9733;</span>
                <span class="pdp-star filled">&#9733;</span>
              </div>
            </div>
            <h4 class="pdp-review-title">Perfect oversized fit</h4>
            <p class="pdp-review-body">Ordered my usual size and the relaxed fit is exactly what I wanted. The color is exactly as shown in photos. Fast delivery within 2 days to Lahore. Packaging was beautiful too.</p>
            <span class="pdp-review-date">1 week ago</span>
          </div>

          <div class="pdp-review-card">
            <div class="pdp-review-card-header">
              <div class="pdp-review-author-info">
                <div class="pdp-review-avatar">M</div>
                <div>
                  <span class="pdp-review-author">Muhammad H.</span>
                  <span class="pdp-review-badge">Verified Buyer</span>
                </div>
              </div>
              <div class="pdp-review-card-stars">
                <span class="pdp-star filled">&#9733;</span>
                <span class="pdp-star filled">&#9733;</span>
                <span class="pdp-star filled">&#9733;</span>
                <span class="pdp-star filled">&#9733;</span>
                <span class="pdp-star">&#9733;</span>
              </div>
            </div>
            <h4 class="pdp-review-title">Great piece, minor sizing note</h4>
            <p class="pdp-review-body">Really impressed with the construction and fabric weight. Only note — if you prefer a more structured fit, size down once. The oversized cut runs a bit generous but that's the intended aesthetic.</p>
            <span class="pdp-review-date">2 weeks ago</span>
          </div>

          <div class="pdp-review-card">
            <div class="pdp-review-card-header">
              <div class="pdp-review-author-info">
                <div class="pdp-review-avatar">F</div>
                <div>
                  <span class="pdp-review-author">Fatima A.</span>
                  <span class="pdp-review-badge">Verified Buyer</span>
                </div>
              </div>
              <div class="pdp-review-card-stars">
                <span class="pdp-star filled">&#9733;</span>
                <span class="pdp-star filled">&#9733;</span>
                <span class="pdp-star filled">&#9733;</span>
                <span class="pdp-star filled">&#9733;</span>
                <span class="pdp-star filled">&#9733;</span>
              </div>
            </div>
            <h4 class="pdp-review-title">Best streetwear brand in Pakistan</h4>
            <p class="pdp-review-body">I've tried many local brands but this is on another level. The attention to detail, the minimal packaging, and the quality — everything screams premium. Already placed my second order!</p>
            <span class="pdp-review-date">3 weeks ago</span>
          </div>
        </div>

        <button class="pdp-reviews-load-more" id="pdp-reviews-load-more">LOAD MORE REVIEWS</button>
      </div>

      <!-- Related Products Section -->
      <div class="pdp-related-section">
        <div class="pdp-related-header">
          <h3 class="pdp-related-title">STYLED WITH & RELATED PIECES</h3>
          <p class="pdp-related-subtitle">Curated recommendations to complete your look</p>
        </div>
        <div class="pdp-related-grid">
          ${relatedGridHTML}
        </div>
      </div>
    `;

    // Populate Sticky Bar Elements
    const stickyThumb = document.getElementById('pdp-sticky-thumb');
    const stickyTitle = document.getElementById('pdp-sticky-title');
    const stickyPrice = document.getElementById('pdp-sticky-price');
    const stickyVariant = document.getElementById('pdp-sticky-variant-summary');

    if (stickyThumb) stickyThumb.src = product.images[0];
    if (stickyTitle) stickyTitle.textContent = product.title;
    if (stickyPrice) stickyPrice.textContent = `PKR ${product.price.toLocaleString()}`;

    let selectedSize = product.sizes[0] || 'M';
    let selectedColor = product.colors[0]?.name || 'Standard';

    function updateStickySummary() {
      if (stickyVariant) stickyVariant.textContent = `${selectedColor} / Size ${selectedSize}`;
    }
    updateStickySummary();

    // Wire up interactions
    const colorBtns = detailLayoutBox.querySelectorAll('.color-swatch-btn');
    const colorLabel = detailLayoutBox.querySelector('.variant-label');
    colorBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        colorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedColor = btn.dataset.color;
        if (colorLabel) colorLabel.textContent = selectedColor;
        updateStickySummary();
      });
    });

    const sizeBtns = detailLayoutBox.querySelectorAll('.size-option-btn');
    sizeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSize = btn.dataset.size;
        updateStickySummary();
      });
    });

    // Add to cart main button
    const mainAddBtn = detailLayoutBox.querySelector('#detail-add-btn');
    if (mainAddBtn) {
      mainAddBtn.addEventListener('click', () => {
        addToCart(product, selectedColor, selectedSize);
      });
    }

    // Add to cart sticky button
    if (pdpStickyAddBtn) {
      pdpStickyAddBtn.onclick = () => {
        addToCart(product, selectedColor, selectedSize);
      };
    }

    // Size Guide modal links
    const sizeGuideBtn = detailLayoutBox.querySelector('#open-size-chart-link');
    if (sizeGuideBtn) sizeGuideBtn.addEventListener('click', openSizeChart);

    const accordionOpenChart = detailLayoutBox.querySelector('#accordion-open-chart');
    if (accordionOpenChart) {
      accordionOpenChart.addEventListener('click', (e) => {
        e.preventDefault();
        openSizeChart();
      });
    }

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

    // Related products click listener
    detailLayoutBox.querySelectorAll('.pdp-related-grid .product-card').forEach(card => {
      card.addEventListener('click', () => {
        showProductDetail(card.dataset.id);
      });
    });

    // Reviews Section Interactions
    const writeReviewBtn = document.getElementById('pdp-write-review-btn');
    const reviewFormWrapper = document.getElementById('pdp-review-form-wrapper');
    const reviewCancelBtn = document.getElementById('pdp-review-cancel-btn');
    const reviewSubmitBtn = document.getElementById('pdp-review-submit-btn');
    const reviewStarPicker = document.getElementById('review-star-picker');
    const reviewsList = document.getElementById('pdp-reviews-list');
    const loadMoreBtn = document.getElementById('pdp-reviews-load-more');

    let selectedReviewRating = 0;

    if (writeReviewBtn && reviewFormWrapper) {
      writeReviewBtn.addEventListener('click', () => {
        reviewFormWrapper.style.display = reviewFormWrapper.style.display === 'none' ? 'block' : 'none';
      });
    }

    if (reviewCancelBtn && reviewFormWrapper) {
      reviewCancelBtn.addEventListener('click', () => {
        reviewFormWrapper.style.display = 'none';
      });
    }

    // Star picker interaction
    if (reviewStarPicker) {
      const starPicks = reviewStarPicker.querySelectorAll('.pdp-star-pick');
      starPicks.forEach(star => {
        star.addEventListener('click', () => {
          selectedReviewRating = parseInt(star.dataset.value);
          starPicks.forEach((s, i) => {
            s.classList.toggle('active', i < selectedReviewRating);
          });
        });
        star.addEventListener('mouseenter', () => {
          const hoverVal = parseInt(star.dataset.value);
          starPicks.forEach((s, i) => {
            s.classList.toggle('hover', i < hoverVal);
          });
        });
        star.addEventListener('mouseleave', () => {
          starPicks.forEach(s => s.classList.remove('hover'));
        });
      });
    }

    // Submit review
    if (reviewSubmitBtn && reviewsList && reviewFormWrapper) {
      reviewSubmitBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('review-name-input');
        const titleInput = document.getElementById('review-title-input');
        const bodyInput = document.getElementById('review-body-input');
        const name = nameInput?.value.trim() || 'Anonymous';
        const title = titleInput?.value.trim() || 'Great product';
        const body = bodyInput?.value.trim() || '';
        const rating = selectedReviewRating || 5;

        if (!body) return;

        const starsHTML = Array.from({ length: 5 }, (_, i) =>
          `<span class="pdp-star ${i < rating ? 'filled' : ''}">&#9733;</span>`
        ).join('');

        const newReviewHTML = `
          <div class="pdp-review-card pdp-review-new">
            <div class="pdp-review-card-header">
              <div class="pdp-review-author-info">
                <div class="pdp-review-avatar">${name.charAt(0).toUpperCase()}</div>
                <div>
                  <span class="pdp-review-author">${name}</span>
                  <span class="pdp-review-badge">New Review</span>
                </div>
              </div>
              <div class="pdp-review-card-stars">${starsHTML}</div>
            </div>
            <h4 class="pdp-review-title">${title}</h4>
            <p class="pdp-review-body">${body}</p>
            <span class="pdp-review-date">Just now</span>
          </div>
        `;

        reviewsList.insertAdjacentHTML('afterbegin', newReviewHTML);
        reviewFormWrapper.style.display = 'none';

        // Reset form
        if (nameInput) nameInput.value = '';
        if (titleInput) titleInput.value = '';
        if (bodyInput) bodyInput.value = '';
        selectedReviewRating = 0;
        if (reviewStarPicker) {
          reviewStarPicker.querySelectorAll('.pdp-star-pick').forEach(s => s.classList.remove('active'));
        }
      });
    }

    // Load more reviews (demo: just shows a message)
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        loadMoreBtn.textContent = 'NO MORE REVIEWS';
        loadMoreBtn.disabled = true;
        loadMoreBtn.style.opacity = '0.5';
      });
    }

    // Scroll listener for Sticky Add to Cart bar
    if (pdpStickyBar) {
      const handleStickyScroll = () => {
        if (productDetailView.style.display !== 'none') {
          const btnRect = mainAddBtn ? mainAddBtn.getBoundingClientRect() : null;
          if (btnRect && btnRect.bottom < 0) {
            pdpStickyBar.classList.add('active');
          } else {
            pdpStickyBar.classList.remove('active');
          }
        } else {
          pdpStickyBar.classList.remove('active');
        }
      };

      window.removeEventListener('scroll', window._pdpStickyScrollHandler);
      window._pdpStickyScrollHandler = handleStickyScroll;
      window.addEventListener('scroll', handleStickyScroll);
    }
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
    if (!slider) return;

    const slides = slider.querySelectorAll('.hero-slide');
    const dots = slider.querySelectorAll('.dot');
    const playPauseBtn = document.getElementById('hero-play-pause-btn');
    const dotsContainer = document.getElementById('hero-dots-container');
    if (!slides.length) return;

    let currentIndex = 0;
    let autoSlideTimeout;
    let isPlaying = true;
    let slideStartTime = 0;
    const SLIDE_DURATION = 6000;

    // Force autoplay readiness on all video elements
    slides.forEach(slide => {
      const v = slide.querySelector('video');
      if (v) {
        v.muted = true;
        v.playsInline = true;
        v.play().catch(() => {});
      }
    });

    function showSlide(index) {
      clearTimeout(autoSlideTimeout);
      if (dotsContainer && isPlaying) dotsContainer.classList.remove('paused');

      slides.forEach((slide, i) => {
        const isActive = i === index;
        slide.classList.toggle('active', isActive);
        const video = slide.querySelector('video');
        if (video) {
          if (isActive) {
            video.style.display = 'block';
            video.muted = true;
            video.playsInline = true;
            if (isPlaying) {
              const playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {});
              }
            }
          } else {
            video.pause();
          }
        }
      });

      dots.forEach((dot, i) => {
        const isActive = i === index;
        dot.classList.remove('active');
        void dot.offsetWidth; // Force CSS animation restart
        if (isActive) {
          dot.classList.add('active');
        }
      });

      currentIndex = index;
      slideStartTime = Date.now();

      if (isPlaying) {
        autoSlideTimeout = setTimeout(() => {
          let nextIndex = (currentIndex + 1) % slides.length;
          showSlide(nextIndex);
        }, SLIDE_DURATION);
      }
    }

    // Play/Pause button toggle handler
    if (playPauseBtn) {
      const iconPause = playPauseBtn.querySelector('.icon-pause');
      const iconPlay = playPauseBtn.querySelector('.icon-play');

      playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isPlaying = !isPlaying;
        if (!isPlaying) {
          // Pause slider and animation
          clearTimeout(autoSlideTimeout);
          if (dotsContainer) dotsContainer.classList.add('paused');
          if (iconPause) iconPause.style.display = 'none';
          if (iconPlay) iconPlay.style.display = 'block';

          const activeVideo = slides[currentIndex]?.querySelector('video');
          if (activeVideo) activeVideo.pause();
        } else {
          // Resume slider and animation
          if (dotsContainer) dotsContainer.classList.remove('paused');
          if (iconPause) iconPause.style.display = 'block';
          if (iconPlay) iconPlay.style.display = 'none';

          const activeVideo = slides[currentIndex]?.querySelector('video');
          if (activeVideo) {
            activeVideo.muted = true;
            activeVideo.play().catch(() => {});
          }

          const elapsed = Date.now() - slideStartTime;
          const remaining = Math.max(1000, SLIDE_DURATION - elapsed);
          autoSlideTimeout = setTimeout(() => {
            let nextIndex = (currentIndex + 1) % slides.length;
            showSlide(nextIndex);
          }, remaining);
        }
      });
    }

    // Play active slide video on startup & gesture
    showSlide(0);

    const triggerPlayOnInteraction = () => {
      const activeSlide = slides[currentIndex];
      if (activeSlide && isPlaying) {
        const v = activeSlide.querySelector('video');
        if (v) {
          v.muted = true;
          v.playsInline = true;
          v.play().catch(() => {});
        }
      }
    };

    ['click', 'touchstart', 'scroll', 'mousemove', 'pointerdown'].forEach(evt => {
      window.addEventListener(evt, triggerPlayOnInteraction, { passive: true });
    });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.slide, 10);
        showSlide(index);
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
  }

  /* ============================================================
     LOOKBOOK — Shop This Look Interactions
     ============================================================ */
  function initLookbookInteractions() {
    // Hotspot pin click handler -> highlight corresponding product in panel
    document.querySelectorAll('.lookbook-hotspot').forEach(hotspot => {
      hotspot.addEventListener('click', () => {
        const targetNum = hotspot.dataset.hotspot;
        const targetItem = document.querySelector(`.lookbook-panel-item[data-hotspot-target="${targetNum}"]`);
        if (targetItem) {
          document.querySelectorAll('.lookbook-panel-item').forEach(i => i.style.background = '');
          targetItem.style.background = '#F5F5F5';
          targetItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => { targetItem.style.background = ''; }, 2000);
        }
      });
    });

    // Choose Options / Add to Cart buttons inside lookbook panel
    document.querySelectorAll('.lookbook-panel-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.dataset.productId;
        const product = products.find(p => p.id === productId);
        if (!product) return;

        if (btn.classList.contains('lookbook-panel-btn-filled')) {
          addToCart(product, product.colors[0]?.name || 'Standard', product.sizes[0] || 'M');
          openCartDrawer();
        } else {
          openQuickView(product);
        }
      });
    });

    // Add All to Cart bundle button
    const bundleBtn = document.querySelector('.lookbook-panel-bundle-btn');
    if (bundleBtn) {
      bundleBtn.addEventListener('click', () => {
        const p1 = products.find(p => p.id === 'oversized-button-down');
        const p2 = products.find(p => p.id === 'tiered-midi-dress');
        const p3 = products.find(p => p.id === 'relaxed-polo-tee');
        [p1, p2, p3].forEach(p => {
          if (p) addToCart(p, p.colors[0]?.name || 'Standard', p.sizes[0] || 'M');
        });
        openCartDrawer();
      });
    }
  }

  /* ============================================================
     MEGA MENU CONTROLLER — Hover, Click, & Touch Support
     ============================================================ */
  function initMegaMenu() {
    const navItems = document.querySelectorAll('.nav-item-has-megamenu');
    const megaOverlay = document.getElementById('mega-menu-overlay');
    const megaPanels = document.querySelectorAll('.mega-menu-panel');
    const closeBtn = document.getElementById('mega-menu-close-btn');
    if (!megaOverlay || navItems.length === 0) return;

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

      navItems.forEach(item => {
        const link = item.querySelector('.nav-link-top');
        if (item.dataset.megamenu === targetId) {
          if (link) link.classList.add('active');
        } else {
          if (link) link.classList.remove('active');
        }
      });

      megaOverlay.classList.add('is-active');
      storeHeader.classList.add('megamenu-open');
    }

    function closeMegaMenu() {
      megaOverlay.classList.remove('is-active');
      storeHeader.classList.remove('megamenu-open');
      activeTarget = null;
    }

    function scheduleClose() {
      closeTimer = setTimeout(() => {
        closeMegaMenu();
      }, 200);
    }

    navItems.forEach(item => {
      const targetId = item.dataset.megamenu;

      item.addEventListener('mouseenter', () => {
        openMegaPanel(targetId);
      });

      item.addEventListener('mouseleave', () => {
        scheduleClose();
      });

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

    megaOverlay.addEventListener('mouseleave', () => {
      scheduleClose();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeMegaMenu();
      });
    }

    const megaLinks = megaOverlay.querySelectorAll('a[data-link], .mega-promo-card[data-link]');
    megaLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const slug = link.dataset.link;
        closeMegaMenu();
        showCollection(slug);
      });
    });

    document.addEventListener('click', (e) => {
      if (megaOverlay.classList.contains('is-active')) {
        if (!megaOverlay.contains(e.target) && !e.target.closest('.nav-item-has-megamenu')) {
          closeMegaMenu();
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMegaMenu();
      }
    });
  }

  /* ============================================================
     INIT — Render all homepage content
     ============================================================ */
  renderCart();
  renderHomepageSliders();
  initSliderArrows();
  initHeroSlider();
  initLookbookInteractions();
  initMegaMenu();

  return {
    updateProductCardStyle,
    showCollection,
    showHomepage
  };
}
