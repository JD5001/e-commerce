dconsole.log("Product Detail Page Loaded");

function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function showLoading() {
    const container = document.querySelector('.product-detail-container');
    container.innerHTML = '<p>Loading product details...</p>';
}

function showError(message) {
    const container = document.querySelector('.product-detail-container');
    container.innerHTML = `<p class="error-message">${message}</p>`;
}

function updateCartCount() {
    const cartCountElem = document.querySelector('.cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Sum quantities of all items
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    cartCountElem.textContent = totalCount;
}

function addToCart(product, quantity, size, color) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Check if product with same size and color exists
    const existingIndex = cart.findIndex(item =>
        item.id === product.id &&
        item.size === size &&
        item.color === color
    );
    if (existingIndex !== -1) {
        // Update quantity of existing item
        cart[existingIndex].quantity += quantity;
    } else {
        // Add new item with only necessary details
        const cartItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity,
            size,
            color
        };
        cart.push(cartItem);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    const feedback = document.getElementById('add-to-cart-feedback');
    if (feedback) {
        feedback.textContent = `Added ${quantity} x "${product.title}" (Size: ${size}, Color: ${color}) to cart.`;
        showAddToCartAnimation();
    }
}

function fetchProductDetails(productId) {
    showLoading();
    fetch(`https://fakestoreapi.com/products/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }
            return response.json();
        })
        .then(product => {
            populateProductDetails(product);
        })
        .catch(error => {
            console.warn('Fetch failed, loading mock product data for local testing.', error);
            const mockProduct = {
                id: productId,
                title: "Mock Product",
                description: "This is a mock product description for local testing.",
                price: 19.99,
                image: "https://via.placeholder.com/400",
                variations: {
                    size: ["Small", "Medium", "Large"],
                    color: ["Red", "Blue", "Green"]
                }
            };
            populateProductDetails(mockProduct);
        });
}

function populateProductDetails(product) {
    const imgElem = document.getElementById('product-main-image');
    const titleElem = document.getElementById('product-title');
    const descElem = document.getElementById('product-description');
    const priceElem = document.getElementById('product-price');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const sizeSelect = document.getElementById('size-select');
    const colorSelect = document.getElementById('color-select');
    const quantityInput = document.getElementById('quantity-input');
    const quantityDecrease = document.getElementById('quantity-decrease');
    const quantityIncrease = document.getElementById('quantity-increase');

    console.log('DOM Elements:', {
        imgElem,
        titleElem,
        descElem,
        priceElem,
        addToCartBtn,
        sizeSelect,
        colorSelect,
        quantityInput,
        quantityDecrease,
        quantityIncrease
    });

    // Set src and alt attributes
    imgElem.src = product.image;
    imgElem.alt = product.title;

    // Set srcset and sizes for responsive images
    const baseName = product.image.replace(/\.[^/.]+$/, ""); // remove extension
    const ext = product.image.split('.').pop();
    imgElem.srcset = `
        ${baseName}-320.${ext} 320w,
        ${baseName}-640.${ext} 640w,
        ${baseName}-1280.${ext} 1280w,
        ${baseName}-320.webp 320w,
        ${baseName}-640.webp 640w,
        ${baseName}-1280.webp 1280w
    `;
    imgElem.sizes = "(max-width: 600px) 320px, (max-width: 900px) 640px, 1280px";

    titleElem.textContent = product.title;
    descElem.textContent = product.description;
    priceElem.textContent = `$${product.price.toFixed(2)}`;


    // Populate variations dropdowns with highlighting and disabling unavailable options
    if (product.variations) {
        populateVariationOptions(sizeSelect, product.variations.size);
        populateVariationOptions(colorSelect, product.variations.color);
    }

    // Quantity selector logic
    quantityDecrease.onclick = () => {
        let current = parseInt(quantityInput.value);
        if (current > 1) {
            quantityInput.value = current - 1;
            updatePrice();
        }
    };
    quantityIncrease.onclick = () => {
        let current = parseInt(quantityInput.value);
        if (current < 10) {
            quantityInput.value = current + 1;
            updatePrice();
        }
    };
    quantityInput.oninput = () => {
        let val = parseInt(quantityInput.value);
        if (isNaN(val) || val < 1) {
            quantityInput.value = 1;
        } else if (val > 10) {
            quantityInput.value = 10;
        }
        updatePrice();
    };

    // Update price based on quantity and variations
    function updatePrice() {
        const basePrice = product.price;
        const quantity = parseInt(quantityInput.value);
        // For demo, variations do not affect price
        const totalPrice = (basePrice * quantity).toFixed(2);
        priceElem.textContent = `$${totalPrice}`;
    }

    // Variation selection change handlers with highlighting
    sizeSelect.onchange = () => {
        highlightSelectedOption(sizeSelect);
        // Placeholder: disable unavailable options if needed
    };
    colorSelect.onchange = () => {
        highlightSelectedOption(colorSelect);
        // Placeholder: disable unavailable options if needed
    };

    addToCartBtn.onclick = () => {
        const quantity = parseInt(quantityInput.value);
        const size = sizeSelect.value;
        const color = colorSelect.value;
        addToCart(product, quantity, size, color);
    };

    updatePrice();

    // Setup image zoom for desktop and mobile
    setupImageZoom(imgElem);
}

function populateVariationOptions(selectElem, options) {
    if (!selectElem || !options) return;
    selectElem.innerHTML = '';
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.toLowerCase();
        opt.textContent = option;
        selectElem.appendChild(opt);
    });
    highlightSelectedOption(selectElem);
}

function highlightSelectedOption(selectElem) {
    const options = selectElem.options;
    for (let i = 0; i < options.length; i++) {
        options[i].style.fontWeight = options[i].selected ? 'bold' : 'normal';
        options[i].style.color = options[i].selected ? '#ff6f61' : '#000';
    }
}

function showAddToCartAnimation() {
    const feedback = document.getElementById('add-to-cart-feedback');
    if (!feedback) return;
    feedback.style.opacity = 0;
    feedback.style.display = 'block';
    feedback.style.transition = 'opacity 0.5s ease-in-out';
    feedback.style.opacity = 1;
    setTimeout(() => {
        feedback.style.opacity = 0;
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 500);
    }, 3000);
}

function setupImageZoom(imgElem) {
    const zoomResult = document.getElementById('zoom-result');
    if (!zoomResult || !imgElem) return;

    // Desktop zoom on hover
    imgElem.addEventListener('mousemove', function(e) {
        zoomResult.style.display = 'block';
        const rect = imgElem.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xPercent = x / rect.width * 100;
        const yPercent = y / rect.height * 100;

        zoomResult.style.backgroundImage = `url('${imgElem.src}')`;
        zoomResult.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
    });

    imgElem.addEventListener('mouseleave', function() {
        zoomResult.style.display = 'none';
    });

    // Mobile zoom on tap
    let zoomed = false;
    imgElem.addEventListener('click', function() {
        if (!zoomed) {
            zoomResult.style.display = 'block';
            zoomResult.style.backgroundImage = `url('${imgElem.src}')`;
            zoomed = true;
        } else {
            zoomResult.style.display = 'none';
            zoomed = false;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    const productId = getProductIdFromUrl();

    if (!productId) {
        showError('No product ID specified.');
        return;
    }

    fetchProductDetails(productId);
});