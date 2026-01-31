document.addEventListener('DOMContentLoaded', function() {
    renderMainCartPage();
});

function renderMainCartPage() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.querySelector('.main-cart-container'); // Make sure this class exists in your cart.html
    
    if (cart.length === 0) {
        // Keep the empty state if nothing is there
        return; 
    }

    // 1. Calculate Totals
    let subtotal = 0;
    let totalSavings = 0;

    const itemsHTML = cart.map(item => {
        subtotal += item.originalPrice * item.qty;
        totalSavings += (item.originalPrice - item.salePrice) * item.qty;
        
        return `
            <div class="cart-page-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h2>${item.name}</h2>
                    <p>Size: ${item.size}</p>
                    <div class="qty-controls">
                        <span>Qty: ${item.qty}</span>
                    </div>
                    <button class="remove-btn" onclick="removeFromMainCart('${item.id}', '${item.size}')">Remove</button>
                </div>
                <div class="item-price">
                    <span class="orig">$${(item.originalPrice * item.qty).toLocaleString()}</span>
                    <span class="sale">$${(item.salePrice * item.qty).toLocaleString()}</span>
                </div>
            </div>
        `;
    }).join('');

    const totalBeforeTax = subtotal - totalSavings;

    // 2. Replace the "Empty" HTML with the full Cart Layout
    cartContainer.innerHTML = `
        <div class="cart-layout">
            <div class="cart-items-section">
                ${itemsHTML}
            </div>
            <div class="cart-summary-section">
                <h3>Order Summary</h3>
                <div class="summary-line"><span>Subtotal</span> <span>$${subtotal.toLocaleString()}</span></div>
                <div class="summary-line savings"><span>Savings</span> <span>-$${totalSavings.toLocaleString()}</span></div>
                <hr>
                <div class="summary-line total"><strong>Total</strong> <strong>$${totalBeforeTax.toLocaleString()}</strong></div>
                <button class="checkout-now-btn">Checkout Now</button>
            </div>
        </div>
    `;
}

// Function to handle removal specifically for the cart page
function removeFromMainCart(id, size) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => !(item.id === id && item.size === size));
    localStorage.setItem('cart', JSON.stringify(cart));
    renderMainCartPage(); // Refresh the page content immediately
}