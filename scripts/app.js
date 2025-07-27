console.log("E-Commerce Website Loaded");

const productGrid = document.getElementById('product-grid');

function updateCartCount() {
    const cartCountElem = document.querySelector('.cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Sum quantities of all items
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    cartCountElem.textContent = totalCount;
}

function addToCart(product) {
    if (!product.quantity || product.quantity < 1) {
        showAddToCartFeedback('Quantity must be at least 1.');
        return;
    }
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Check if product with same id exists and merge quantities
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex !== -1) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + (product.quantity || 1);
    } else {
        cart.push(product);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showAddToCartFeedback(`Added "${product.title}" to cart.`);
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showAddToCartFeedback('Item removed from cart.');
}

function showAddToCartFeedback(message) {
    let feedback = document.getElementById('add-to-cart-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.id = 'add-to-cart-feedback';
        feedback.style.position = 'fixed';
        feedback.style.top = '10px';
        feedback.style.right = '10px';
        feedback.style.backgroundColor = '#4caf50';
        feedback.style.color = 'white';
        feedback.style.padding = '10px 20px';
        feedback.style.borderRadius = '5px';
        feedback.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        feedback.style.zIndex = '1000';
        feedback.style.opacity = '0';
        feedback.style.transition = 'opacity 0.5s ease-in-out';
        document.body.appendChild(feedback);
    }
    feedback.textContent = message;
    feedback.style.opacity = '1';
    setTimeout(() => {
        feedback.style.opacity = '0';
    }, 3000);
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    const img = document.createElement('img');
    img.className = 'product-image';
    img.src = product.image;
    img.alt = product.title;
    img.loading = 'lazy';

    // Make image clickable to go to product detail page
    img.style.cursor = 'pointer';
    img.onclick = () => {
        window.location.href = `product.html?id=${product.id}`;
    };

    const title = document.createElement('div');
    title.className = 'product-title';
    title.textContent = product.title;

    // Make title clickable to go to product detail page
    title.style.cursor = 'pointer';
    title.onclick = () => {
        window.location.href = `product.html?id=${product.id}`;
    };

    const price = document.createElement('div');
    price.className = 'product-price';
    price.textContent = `$${product.price.toFixed(2)}`;

    const button = document.createElement('button');
    button.className = 'add-to-cart-btn';
    button.textContent = 'Add to Cart';
    button.onclick = () => {
        // Add default quantity 1 when adding from product listing
        addToCart({...product, quantity: 1});
    };

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(button);

    return card;
}

function renderProducts(products) {
    productGrid.innerHTML = '';
    products.forEach(product => {
        const card = createProductCard(product);
        productGrid.appendChild(card);
    });
}

function showLoading() {
    productGrid.innerHTML = '<p>Loading products...</p>';
}

function showError(message) {
    productGrid.innerHTML = `<p class="error-message">${message}</p>`;
}

function fetchProducts() {
    showLoading();
    fetch('https://fakestoreapi.com/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            renderProducts(data);
            updateCartCount();
        })
        .catch(error => {
            showError('Failed to load products. Please try again later.');
            console.error('Fetch error:', error);
        });
}

// Fetch products from API on page load
fetchProducts();

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        if (navMenu.style.display === 'flex') {
            navMenu.style.display = 'none';
        } else {
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'column';
        }
    });
});
