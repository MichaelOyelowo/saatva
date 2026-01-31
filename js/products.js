/* ==================================
    Breadcrumb
===================================== */
function generateBreadcrumbs() {
    const breadcrumbList = document.getElementById('breadcrumb-js');
    if (!breadcrumbList) return;

    // 1. Get current path (e.g., /mattresses/saatva-classic.html)
    const pathArray = window.location.pathname.split('/').filter(path => path !== "");

    // 2. Always start with Home
    let breadcrumbHTML = `
        <li class="breadcrumb-item">
            <a href="index.html" class="breadcrumb-link">Home</a>
        </li>`;

    let currentPath = "";

    // 3. Loop through the folders/files in the URL
    pathArray.forEach((path, index) => {
        // Clean the name: remove .html and replace dashes with spaces
        let cleanName = path.replace('.html', '').replace(/-/g, ' ');
        cleanName = cleanName.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');

        const isLast = index === pathArray.length - 1;
        
        if (isLast) {
            breadcrumbHTML += `<li class="breadcrumb-item">${cleanName}</li>`;
        } else {
            currentPath += `/${path}`;
            breadcrumbHTML += `
                <li class="breadcrumb-item">
                    <a href="${currentPath}.html" class="breadcrumb-link">${cleanName}</a>
                </li>`;
        }
    });

    breadcrumbList.innerHTML = breadcrumbHTML;
}

document.addEventListener('DOMContentLoaded', generateBreadcrumbs);

/* ==================================
   Zoom Modal Functionality
===================================== */

const zoomModal = document.getElementById('zoomModal');
const zoomImage = document.getElementById('zoomImage');
const zoomThumbnails = document.getElementById('zoomThumbnails');
let currentZoom = 1;
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;

// Get all image sources from thumbnails
function getImageSources() {
    const thumbs = document.querySelectorAll('.thumb[data-type="image"]');
    return Array.from(thumbs).map(t => t.dataset.src);
}

// Open zoom modal
function openZoomModal(imageSrc) {
    const images = getImageSources();
    
    // Build thumbnails
    zoomThumbnails.innerHTML = images.map((src, i) => `
        <button class="zoom-thumb ${src === imageSrc ? 'active' : ''}" data-src="${src}">
            <img src="${src}" alt="Thumbnail ${i + 1}">
        </button>
    `).join('');
    
    // Set main image
    zoomImage.src = imageSrc;
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
    updateZoomTransform();
    
    zoomModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close zoom modal
function closeZoomModal() {
    zoomModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Update image transform
function updateZoomTransform() {
    zoomImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
}

// Zoom in
document.getElementById('zoomIn').addEventListener('click', function() {
    if (currentZoom < 3) {
        currentZoom += 0.5;
        updateZoomTransform();
    }
});

// Zoom out
document.getElementById('zoomOut').addEventListener('click', function() {
    if (currentZoom > 1) {
        currentZoom -= 0.5;
        if (currentZoom === 1) {
            translateX = 0;
            translateY = 0;
        }
        updateZoomTransform();
    }
});

// Close button
document.querySelector('.zoom-close').addEventListener('click', closeZoomModal);

// Close on backdrop click
zoomModal.addEventListener('click', function(e) {
    if (e.target === zoomModal) {
        closeZoomModal();
    }
});

// Close on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && zoomModal.classList.contains('active')) {
        closeZoomModal();
    }
});

// Thumbnail click in modal
zoomThumbnails.addEventListener('click', function(e) {
    const thumb = e.target.closest('.zoom-thumb');
    if (thumb) {
        document.querySelectorAll('.zoom-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        zoomImage.src = thumb.dataset.src;
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
        updateZoomTransform();
    }
});

// Drag to pan when zoomed
const zoomContent = document.querySelector('.zoom-content');

zoomContent.addEventListener('mousedown', function(e) {
    if (currentZoom > 1) {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
    }
});

document.addEventListener('mousemove', function(e) {
    if (isDragging) {
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateZoomTransform();
    }
});

document.addEventListener('mouseup', function() {
    isDragging = false;
});

// Open modal when clicking zoom trigger (using event delegation)
document.getElementById('mainStage').addEventListener('click', function(e) {
    const trigger = e.target.closest('.zoom-trigger');
    if (trigger) {
        const mainImg = this.querySelector('img');
        if (mainImg) {
            openZoomModal(mainImg.src);
        }
    }
});


/* ==================================
   Products Zoom & Img/video selector
===================================== */

function updateMainImg(el) {
    const mainStage = document.getElementById('mainStage');
    const type = el.dataset.type;
    const src = el.dataset.src;
    
    // Check if currently saved (before replacing HTML)
    const wasSaved = mainStage.querySelector('.favoriteIcon')?.classList.contains('is-saved');

    document.querySelectorAll('.thumb').forEach(t => {
        t.classList.remove('active');
    });
    el.classList.add('active');

    if (type === "image") {
        mainStage.innerHTML = ` 
        <span class="wishlist-link favoriteIcon ${wasSaved ? 'is-saved' : ''}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart">
                <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
            </svg>
        </span>
        <img src="${src}">
        <div class="zoom-trigger">
            <span>Click to zoom </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zoom-in-icon lucide-zoom-in"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>
        </div>
        `;
    } else {
        mainStage.innerHTML = `
        <span class="wishlist-link favoriteIcon ${wasSaved ? 'is-saved' : ''}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart">
                <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
            </svg>
        </span>
        <video src="${src}" controls muted autoplay></video>`;
    }
}


// ============================================
// SAVED ITEMS FUNCTIONALITY
// ============================================

// Get current product data (customize these selectors for your page)
function getCurrentProduct() {
  return {
    id: 'saatva-latex-hybrid', // Unique product ID
    name: document.querySelector('.pdp-title')?.textContent || 'Saatva Latex Hybrid Mattress',
    image: document.querySelector('#mainStage img')?.src || '',
    originalPrice: document.querySelector('.original-price')?.textContent || '$1,699',
    salePrice: document.querySelector('.sale-price')?.textContent || '$1,445',
    saveBadge: document.querySelector('.save-badge')?.textContent || 'SAVE $254',
    size: document.querySelector('.size-btn.active')?.textContent || 'Twin',
    url: window.location.href
  };
}

// Get saved items from localStorage
function getSavedItems() {
  const saved = localStorage.getItem('savedItems');
  return saved ? JSON.parse(saved) : [];
}

// Save items to localStorage
function setSavedItems(items) {
  localStorage.setItem('savedItems', JSON.stringify(items));
}

// Check if current product is saved
function isProductSaved(productId) {
  const items = getSavedItems();
  return items.some(item => item.id === productId);
}

// Add product to saved items
function addToSavedItems(product) {
  const items = getSavedItems();
  // Don't add duplicates
  if (!items.some(item => item.id === product.id)) {
    product.savedAt = Date.now();
    items.push(product);
    setSavedItems(items);
  }
}

// Remove product from saved items
function removeFromSavedItems(productId) {
  let items = getSavedItems();
  items = items.filter(item => item.id !== productId);
  setSavedItems(items);
}

// Show notification popup
function showNotification(isAdded, product) {
  const notification = document.getElementById('savedNotification');
  const title = notification.querySelector('.saved-notification-title');
  const img = notification.querySelector('.saved-notification-img');
  const name = notification.querySelector('.saved-notification-name');
  const size = notification.querySelector('.saved-notification-size');

  // Update content
  title.textContent = isAdded ? 'Added to Saved Items' : 'Removed from Saved Items';
  img.src = product.image;
  name.textContent = product.name;
  size.textContent = 'Size: ' + product.size;

  // Show notification
  notification.classList.add('show');

  // Auto-hide after 4 seconds
  setTimeout(() => {
    notification.classList.remove('show');
  }, 4000);
}

// Close notification on X click
document.querySelector('.saved-notification-close')?.addEventListener('click', function() {
  document.getElementById('savedNotification').classList.remove('show');
});

// ============================================
// HEART ICON CLICK HANDLER (Event Delegation)
// ============================================

document.getElementById('mainStage').addEventListener('click', function(e) {
  const heart = e.target.closest('.favoriteIcon');
  if (!heart) return;

  const product = getCurrentProduct();
  const isSaved = heart.classList.contains('is-saved');
  const secondaryBtn = document.querySelector('.favorite-save-content');

  if (isSaved) {
    heart.classList.remove('is-saved');
    secondaryBtn?.classList.remove('is-saved');
    removeFromSavedItems(product.id);
    showNotification(false, product);
  } else {
    heart.classList.add('is-saved');
    secondaryBtn?.classList.add('is-saved');
    addToSavedItems(product);
    showNotification(true, product);
  }
});

document.querySelector('.favorite-save-content')?.addEventListener('click', function() {
  const product = getCurrentProduct();
  const isSaved = this.classList.contains('is-saved');
  const mainHeart = document.querySelector('.favoriteIcon');

  if (isSaved) {
    this.classList.remove('is-saved');
    mainHeart?.classList.remove('is-saved');
    removeFromSavedItems(product.id);
    showNotification(false, product);
  } else {
    this.classList.add('is-saved');
    mainHeart?.classList.add('is-saved');
    addToSavedItems(product);
    showNotification(true, product);
  }
});


// On page load, check if product is already saved
document.addEventListener('DOMContentLoaded', function() {
  const product = getCurrentProduct();
  if (isProductSaved(product.id)) {
    const heart = document.querySelector('.favoriteIcon');
    if (heart) heart.classList.add('is-saved');
  }
});


/* ==================================
   Products Button Updates
===================================== */

const priceData = {
    "Twin": { original: "$1,699", sale: "$1,445", save: "SAVE $254"},
    "Twin XL": { original: "$1,824", sale: "$1,551", save: "SAVE $273"},
    "Full": { original: "$2,329", sale: "$1,980", save: "SAVE $349"},
    "Queen": { original: "$2,599", sale: "$2,210", save: "SAVE $389"},
    "King": { original: "$3,099", sale: "$2,635", save: "SAVE $464"},
    "Split King": { original: "$3,648", sale: "$3,101", save: "SAVE $547"},
    "Cal King": { original: "$3,099", sale: "$2,635", save: "SAVE $464"},
};

const originalPriceEl = document.querySelector('.original-price');
const salePriceEl = document.querySelector('.sale-price');
const saveBadgeEl = document.querySelector('.save-badge');
const sizeButtons = document.querySelectorAll('.size-btn');

function updateProductDetails(size) {
    const data = priceData[size];
    if (data) {
        originalPriceEl.textContent = data.original;
        salePriceEl.textContent = data.sale;
        saveBadgeEl.textContent = data.save;

        sizeButtons.forEach(btn => {
            btn.classList.remove('active');
            // If the button text matches the size, making it active
            if (btn.textContent.trim() === size) {
                btn.classList.add('active');
            }
        });

        // Save to localStorage
        localStorage.setItem('selectedMattressSize',size);
    }
}

sizeButtons.forEach(button => {
    button.addEventListener('click', () => {
    const selectedSize = button.textContent.trim();
    updateProductDetails(selectedSize);
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const savedSize = localStorage.getItem('selectedMattressSize') || "Twin";
    updateProductDetails(savedSize);
});

// ============================================
// SUBTOTAL CALCULATION
// ============================================


// Add-on prices
const addOns = {
    mattressPad: { original: 295, sale: 295, save: 0 },
    pillows: { original: 370, sale: 310, save: 60 }
};

// Helper to parse price strings to numbers
function parsePrice(price) {
    if (typeof price === 'number') return price;
    return parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;
}

function calculateSubtotal() {
    // Get selected size
    const activeBtn = document.querySelector('.size-btn.active');
    const selectedSize = activeBtn ? activeBtn.textContent.trim() : 'Twin';
    const mattressPrice = priceData[selectedSize];

    // Parse mattress prices as numbers
    let totalOriginal = parsePrice(mattressPrice.original);
    let totalSale = parsePrice(mattressPrice.sale);
    let totalSave = parsePrice(mattressPrice.save);

    // Check add-ons
    const checkboxes = document.querySelectorAll('.add-more-p-container input[type="checkbox"]');
    
    // First checkbox = Mattress Pad
    if (checkboxes[0] && checkboxes[0].checked) {
        totalOriginal += addOns.mattressPad.original;
        totalSale += addOns.mattressPad.sale;
        totalSave += addOns.mattressPad.save;
    }
    
    // Second checkbox = Pillows
    if (checkboxes[1] && checkboxes[1].checked) {
        totalOriginal += addOns.pillows.original;
        totalSale += addOns.pillows.sale;
        totalSave += addOns.pillows.save;
    }

    // Update subtotal display
    const subtotalOriginal = document.querySelector('[data-selector="product-original-price"]');
    const subtotalSale = document.querySelector('[data-selector="product-sale-price"]');
    const subtotalSave = document.querySelector('[data-selector="product-save-amount"]');


    if (subtotalOriginal) subtotalOriginal.textContent = '$' + totalOriginal.toLocaleString();
    if (subtotalSale) subtotalSale.textContent = '$' + totalSale.toLocaleString();
    if (subtotalSave) subtotalSave.textContent = 'Save $' + totalSave.toLocaleString();
}

// Listen for size button clicks
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', calculateSubtotal);
});

// Listen for checkbox changes
document.querySelectorAll('.add-more-p-container input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', calculateSubtotal);
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', calculateSubtotal);


// ============================================
// CART FUNCTIONALITY
// ============================================

// Helper to parse price strings to numbers
function parsePrice(price) {
    if (typeof price === 'number') return price;
    return parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;
}

// Update cart count badge
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        countEl.textContent = totalQty;
        countEl.style.display = totalQty > 0 ? 'flex' : 'none';
    }
}

// Remove item from cart
function removeFromCart(id, size) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => !(item.id === id && item.size === size));
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartDropdown();
}

// Render the cart dropdown content
function renderCartDropdown() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const dropdown = document.querySelector('.cart-dropdown');
    if (!dropdown) return;

    if (cart.length === 0) {
        dropdown.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        return;
    }

    // Calculate totals
    let subtotal = 0;
    let totalSavings = 0;

    cart.forEach(item => {
        subtotal += item.originalPrice * item.qty;
        totalSavings += (item.originalPrice - item.salePrice) * item.qty;
    });

    const totalBeforeTax = subtotal - totalSavings;

    // Build items HTML
    const itemsHTML = cart.map(item => `
        <div class="cart-dropdown-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <a href="#" class="cart-item-name">${item.name}</a>
                <p class="cart-item-size">${item.size}</p>
                <p class="cart-item-qty">Qty: ${item.qty}</p>
                <a href="#" class="cart-item-remove" onclick="removeFromCart('${item.id}', '${item.size}'); return false;">Remove</a>
            </div>
            <div class="cart-item-prices">
                <span class="cart-item-original">$${item.originalPrice.toLocaleString()}</span>
                <span class="cart-item-sale">$${item.salePrice.toLocaleString()}</span>
            </div>
        </div>
    `).join('');

    dropdown.innerHTML = `
        <div class="cart-dropdown-items">
            ${itemsHTML}
        </div>
        <div class="cart-dropdown-summary">
            <div class="summary-row">
                <span>Subtotal</span>
                <span>$${subtotal.toLocaleString()}</span>
            </div>
            <div class="summary-row savings">
                <span>Discount</span>
                <span class="savings-amount">-$${totalSavings.toLocaleString()}</span>
            </div>
            <div class="summary-row total">
                <span>Total before tax</span>
                <span>$${totalBeforeTax.toLocaleString()}</span>
            </div>
        </div>
        <div class="cart-dropdown-actions">
            <a href="./cart.html" class="view-cart-btn">View Cart</a>
            <a href="./checkout.html" class="checkout-btn">Proceed to checkout</a>
        </div>
    `;
}

// Show cart dropdown
function showCartDropdown() {
    const dropdown = document.querySelector('.cart-dropdown');
    if (dropdown) dropdown.classList.add('show');
}

// Hide cart dropdown
function hideCartDropdown() {
    const dropdown = document.querySelector('.cart-dropdown');
    if (dropdown) dropdown.classList.remove('show');
}

// Add to cart button handler
document.querySelector('[data-selector="add-to-cart-button"]')?.addEventListener('click', function() {
    const cartItem = {
        id: 'saatva-latex-hybrid',
        name: document.querySelector('.pdp-title')?.textContent || 'Saatva Latex Hybrid Mattress',
        size: document.querySelector('.size-btn.active')?.textContent.trim() || 'Twin',
        image: document.querySelector('#mainStage img')?.src || '',
        originalPrice: parsePrice(document.querySelector('[data-selector="product-original-price"]')?.textContent),
        salePrice: parsePrice(document.querySelector('[data-selector="product-sale-price"]')?.textContent),
        savings: parsePrice(document.querySelector('[data-selector="product-save-amount"]')?.textContent),
        qty: 1
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(item => item.id === cartItem.id && item.size === cartItem.size);
    
    if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartDropdown();
    showCartDropdown();

    // Auto-hide after 3 seconds
    setTimeout(hideCartDropdown, 3000);
});

// Hover to show/hide cart dropdown
document.querySelector('.cart-container')?.addEventListener('mouseenter', function() {
    renderCartDropdown();
    showCartDropdown();
});

document.querySelector('.cart-container')?.addEventListener('mouseleave', hideCartDropdown);

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    renderCartDropdown();
});
