// ============================================
// SAVED ITEMS PAGE
// ============================================

function getSavedItems() {
  const saved = localStorage.getItem('savedItems');
  return saved ? JSON.parse(saved) : [];
}

function setSavedItems(items) {
  localStorage.setItem('savedItems', JSON.stringify(items));
}

function removeFromSavedItems(productId) {
  let items = getSavedItems();
  items = items.filter(item => item.id !== productId);
  setSavedItems(items);
  renderSavedItems(); // Re-render after removal
}

function renderSavedItems() {
  const container = document.getElementById('savedItemsGrid');
  const items = getSavedItems();

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No saved items yet.</p>
        <p>Click on the heart symbol on any product to add them to your saved items.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="saved-item-card" data-id="${item.id}">
      <div class="saved-item-image">
        <span class="save-badge">${item.saveBadge}</span>
        <button class="saved-item-heart is-saved" onclick="removeFromSavedItems('${item.id}')">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </button>
        <a href="${item.url}">
          <img src="${item.image}" alt="${item.name}">
        </a>
      </div>
      <button class="add-to-cart-btn">Add to Cart</button>
      <div class="saved-item-info">
        <h3><a href="${item.url}">${item.name}</a></h3>
        <div class="saved-item-price">
          <span class="sale-price">${item.salePrice}</span>
          <span class="original-price">${item.originalPrice}</span>
        </div>
        <p class="saved-item-size">Size: ${item.size}</p>
      </div>
    </div>
  `).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', renderSavedItems);
