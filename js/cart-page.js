document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    renderMainCartPage();
});

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        countEl.textContent = totalQty;
        countEl.style.display = totalQty > 0 ? 'flex' : 'none';
    }
}

function updateItemQty(id, size, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === id && item.size === size);
    if (index > -1) {
        cart[index].qty = Math.max(1, cart[index].qty + delta);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderMainCartPage();
    }
}

function removeFromMainCart(id, size) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => !(item.id === id && item.size === size));
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderMainCartPage();
}

function renderMainCartPage() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.querySelector('.main-cart-container');
    const emptyCartView = document.querySelector('.empty-cart-view');
    
    if (cart.length === 0) {
        if (emptyCartView) emptyCartView.style.display = 'block';
        const cartLayout = document.querySelector('.cart-layout');
        if (cartLayout) cartLayout.remove();
        return; 
    }

    if (emptyCartView) emptyCartView.style.display = 'none';

    let subtotal = 0;
    let totalSavings = 0;
    let totalQty = 0;

    const itemsHTML = cart.map(item => {
        subtotal += item.originalPrice * item.qty;
        totalSavings += (item.originalPrice - item.salePrice) * item.qty;
        totalQty += item.qty;
        
        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-content">
                    <div class="cart-item-header">
                        <h3 class="cart-item-title">${item.name}</h3>
                        <div class="cart-item-pricing">
                            <span class="original-price">$${(item.originalPrice * item.qty).toLocaleString()}</span>
                            <span class="sale-price">$${(item.salePrice * item.qty).toLocaleString()}</span>
                        </div>
                    </div>
                    <p class="cart-item-size">Size: <span>${item.size}</span></p>
                    <div class="cart-item-actions">
                        <div class="qty-selector">
                            <button class="qty-btn" onclick="updateItemQty('${item.id}', '${item.size}', -1)">−</button>
                            <span class="qty-value">${item.qty}</span>
                            <button class="qty-btn" onclick="updateItemQty('${item.id}', '${item.size}', 1)">+</button>
                        </div>
                        <div class="item-links">
                            <a href="#" class="edit-link">Edit</a>
                            <a href="#" class="save-later-link">Save for later</a>
                        </div>
                    </div>
                    <button class="remove-item-btn" onclick="removeFromMainCart('${item.id}', '${item.size}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    const totalBeforeTax = subtotal - totalSavings;

    let cartLayout = document.querySelector('.cart-layout');
    if (!cartLayout) {
        cartLayout = document.createElement('div');
        cartLayout.className = 'cart-layout';
        cartContainer.appendChild(cartLayout);
    }

    cartLayout.innerHTML = `
        <div class="cart-items-column">
            <div class="cart-header">
                <h1>Your cart <span class="cart-count-label">(${totalQty})</span></h1>
                <button class="share-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
                </button>
            </div>
            <div class="delivery-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
                <span>White Glove Delivery</span>
                <button class="info-tooltip">ⓘ</button>
            </div>
            <div class="cart-items-list">
                ${itemsHTML}
            </div>
        </div>
        <div class="order-summary-column">
            <div class="order-summary-card">
                <h2>Order summary</h2>
                <div class="summary-lines">
                    <div class="summary-line">
                        <span>Order subtotal</span>
                        <span>$${subtotal.toLocaleString()}</span>
                    </div>
                    <div class="summary-line discount-line">
                        <span class="discount-toggle">
                            Discounts & savings
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 15-6-6-6 6"/></svg>
                        </span>
                        <span class="discount-amount">-$${totalSavings.toLocaleString()}</span>
                    </div>
                    <div class="discount-breakdown">
                        <div class="breakdown-line">
                            <span>Sale discount</span>
                            <span>-$${totalSavings.toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="summary-line">
                        <span>White glove delivery</span>
                        <span class="free-label">Free</span>
                    </div>
                    <div class="summary-line tax-line">
                        <span>Tax calculated in checkout</span>
                        <span>$-</span>
                    </div>
                </div>
                <div class="summary-total">
                    <span>Total before tax</span>
                    <span>$${totalBeforeTax.toLocaleString()}</span>
                </div>
                <button class="checkout-btn">
                    Proceed to checkout
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </button>
                <div class="payment-icons">
                    <img src="https://cdn-icons-png.flaticon.com/32/349/349221.png" alt="Visa">
                    <img src="https://cdn-icons-png.flaticon.com/32/349/349228.png" alt="Mastercard">
                    <img src="https://cdn-icons-png.flaticon.com/32/349/349230.png" alt="Discover">
                    <img src="https://cdn-icons-png.flaticon.com/32/349/349222.png" alt="Amex">
                </div>
            </div>
        </div>
    `;
}
