// Added animations, confirmation modal logic, and accessibility improvements

console.log("Cart Page Loaded");

let itemToRemoveId = null;

function updateCartCount() {
    const cartCountElem = document.querySelector('.cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    cartCountElem.textContent = totalCount;
}

function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items-container');
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        updateCheckoutButtonState();
        updateTotalPrice();
        return;
    }

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item fade-in';

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;
        img.className = 'cart-item-image';

        const title = document.createElement('div');
        title.className = 'cart-item-title';
        title.textContent = item.title;

        // Display selected options if any
        const options = document.createElement('div');
        options.className = 'cart-item-options';
        if (item.options) {
            options.textContent = 'Options: ' + Object.entries(item.options).map(([key, value]) => `${key}: ${value}`).join(', ');
        }

        // Quantity selector with + and - buttons
        const quantityContainer = document.createElement('div');
        quantityContainer.className = 'cart-item-quantity-container';

        const quantityLabel = document.createElement('span');
        quantityLabel.textContent = 'Quantity: ';

        const minusBtn = document.createElement('button');
        minusBtn.textContent = '−';
        minusBtn.className = 'quantity-btn minus-btn';
        minusBtn.setAttribute('aria-label', `Decrease quantity of ${item.title}`);
        minusBtn.onclick = () => {
            if (item.quantity > 1) {
                updateItemQuantity(item.id, item.quantity - 1);
            }
        };

        const quantityValue = document.createElement('input');
        quantityValue.type = 'number';
        quantityValue.min = '1';
        quantityValue.value = item.quantity;
        quantityValue.className = 'cart-item-quantity-input';
        quantityValue.setAttribute('aria-label', `Quantity of ${item.title}`);
        quantityValue.onchange = (e) => {
            const newQuantity = parseInt(e.target.value);
            if (newQuantity < 1) {
                e.target.value = item.quantity;
                alert('Quantity must be at least 1.');
                return;
            }
            updateItemQuantity(item.id, newQuantity);
        };

        const plusBtn = document.createElement('button');
        plusBtn.textContent = '+';
        plusBtn.className = 'quantity-btn plus-btn';
        plusBtn.setAttribute('aria-label', `Increase quantity of ${item.title}`);
        plusBtn.onclick = () => {
            updateItemQuantity(item.id, item.quantity + 1);
        };

        quantityContainer.appendChild(quantityLabel);
        quantityContainer.appendChild(minusBtn);
        quantityContainer.appendChild(quantityValue);
        quantityContainer.appendChild(plusBtn);

        const price = document.createElement('div');
        price.className = 'cart-item-price';
        price.textContent = `Price: $${(item.price * item.quantity).toFixed(2)}`;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'cart-item-remove-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.setAttribute('aria-label', `Remove ${item.title} from cart`);
        removeBtn.onclick = () => {
            showConfirmationModal(item.id);
        };

        itemDiv.appendChild(img);
        itemDiv.appendChild(title);
        itemDiv.appendChild(options);
        itemDiv.appendChild(quantityContainer);
        itemDiv.appendChild(price);
        itemDiv.appendChild(removeBtn);

        container.appendChild(itemDiv);
    });

    updateCheckoutButtonState();
    updateTotalPrice();
}

function updateItemQuantity(productId, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart[index].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
}

function showConfirmationModal(productId) {
    itemToRemoveId = productId;
    const modal = document.getElementById('confirmation-modal');
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    // Focus on the confirm button for accessibility
    document.getElementById('confirm-remove-btn').focus();
}

function hideConfirmationModal() {
    const modal = document.getElementById('confirmation-modal');
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    itemToRemoveId = null;
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCartItems();

    const continueBtn = document.getElementById('continue-shopping-btn');
    continueBtn.onclick = () => {
        window.location.href = 'index.html';
    };

    // Add total price display
    const container = document.querySelector('main.container');
    const totalDiv = document.createElement('div');
    totalDiv.id = 'cart-total';
    totalDiv.style.fontWeight = 'bold';
    totalDiv.style.fontSize = '1.2em';
    totalDiv.style.marginTop = '20px';
    container.appendChild(totalDiv);

    // Add proceed to checkout button
    const checkoutBtn = document.createElement('button');
    checkoutBtn.id = 'proceed-to-checkout-btn';
    checkoutBtn.textContent = 'Proceed to Checkout';
    checkoutBtn.style.marginLeft = '10px';
    checkoutBtn.disabled = true; // Initially disabled
    checkoutBtn.onclick = () => {
        window.location.href = 'checkout.html';
    };
    container.appendChild(checkoutBtn);

    // Confirmation modal buttons
    const confirmBtn = document.getElementById('confirm-remove-btn');
    const cancelBtn = document.getElementById('cancel-remove-btn');

    confirmBtn.onclick = () => {
        if (itemToRemoveId !== null) {
            removeFromCart(itemToRemoveId);
            hideConfirmationModal();
        }
    };

    cancelBtn.onclick = () => {
        hideConfirmationModal();
    };

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('confirmation-modal');
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            hideConfirmationModal();
        }
    });

    updateTotalPrice();
    updateCheckoutButtonState();
});

function updateCheckoutButtonState() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutBtn = document.getElementById('proceed-to-checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
}

function updateTotalPrice() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalDiv = document.getElementById('cart-total');
    if (totalDiv) {
        totalDiv.textContent = `Total: $${total.toFixed(2)}`;
    }
}
