// Global Variables
let basket = {};

(function() {
    function fetchStoreItems() {
        return fetch('/api/store-items')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .catch(e => {
                console.error("Could not fetch store items:", e.message);
            });
    }

    document.addEventListener('DOMContentLoaded', () => {
        fetchStoreItems();
    });
})();

// Then use it
document.addEventListener('DOMContentLoaded', () => {
    fetchStoreItems();
});

// Utility functions for cart persistence
function saveCartToLocalStorage() {
    localStorage.setItem('shopping-cart', JSON.stringify(basket));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('shopping-cart');
    if (savedCart) {
        basket = JSON.parse(savedCart);
        updateCartDisplay();
        updateCartCount();
        updateTotalAmount();
    }
}

// Display Functions
function displayStoreItems(items) {
    const itemsContainer = document.getElementById('items-container');
    itemsContainer.innerHTML = ''; // Clear existing items
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'product-item';
        itemElement.innerHTML = `
            <img src="${item.imageUrl || item.stripeImageUrl}" alt="${item.name}" class="product-image">
            <div class="product-details">
                <h3 class="product-title">${item.name}</h3>
                <p class="product-description">${item.description}</p>
                <p class="product-price">$${(item.priceInCents / 100).toFixed(2)}</p>
                <button class="add-to-cart-btn" onclick="addToBasket(${item.id})">
                <i class="ri-shopping-cart-line"></i> Add to Cart
                </button>
            </div>
        `;
        itemsContainer.appendChild(itemElement);
    });
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear the cart display
    Object.values(basket).forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.imageUrl}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-quantity">
                    <button onclick="decrementQuantity(${item.id})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="incrementQuantity(${item.id})">+</button>
                </div>
                <div class="cart-item-price">$${((item.priceInCents * item.quantity) / 100).toFixed(2)}</div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });
    updateTotalAmount();
}

// Cart Functions
function addToBasket(itemId) {
    if (basket[itemId]) {
        basket[itemId].quantity += 1;
        updateCartDisplay();
        updateCartCount();
        saveCartToLocalStorage();
    } else {
        fetchStoreItems().then(items => {
            const item = items.find(i => i.id === itemId);
            if (item) {
                const imageUrl = item.imageUrl || item.stripeImageUrl || '';
                basket[itemId] = { ...item, imageUrl: imageUrl, quantity: 1 };
                updateCartDisplay();
                updateCartCount();
                saveCartToLocalStorage();
            }
        }).catch(e => {
            console.error("Error adding item to basket:", e.message);
        });
    }

    const cartContainer = document.getElementById('cart-container');
    if (!cartContainer.classList.contains('visible')) {
        toggleShoppingCart();
    }
}

function incrementQuantity(itemId) {
    if (basket[itemId]) {
        basket[itemId].quantity += 1;
        updateCartDisplay();
        updateCartCount();
        saveCartToLocalStorage();
    }
}

function decrementQuantity(itemId) {
    if (basket[itemId] && basket[itemId].quantity > 1) {
        basket[itemId].quantity -= 1;
    } else {
        delete basket[itemId];
    }
    updateCartDisplay();
    updateCartCount();
    saveCartToLocalStorage();
}

function updateCartCount() {
    const cartCount = Object.values(basket).reduce((count, item) => count + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}

function updateTotalAmount() {
    const totalAmount = Object.values(basket).reduce((total, item) => {
        return total + (item.priceInCents * item.quantity);
    }, 0);
    document.getElementById('total-amount').textContent = `Total: $${(totalAmount / 100).toFixed(2)}`;
}

function checkAndDisplayEmptyCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartContainer = document.getElementById('cart-container');
    const totalAmountElement = document.getElementById('total-amount');

    if (Object.keys(basket).length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-message"><p>Your cart is empty😔</p></div>';
        totalAmountElement.textContent = 'Total: $0.00';
        
        if (cartContainer.style.display === 'none') {
            toggleCart();
        }
    } else {
        updateCartDisplay();
    }
}

// UI Interaction Functions
function toggleCart() {
    const cartContainer = document.getElementById('cart-container');
    if (!cartContainer.classList.contains('visible')) {
        cartContainer.classList.add('visible');
        checkAndDisplayEmptyCart();
    } else {
        cartContainer.classList.remove('visible');
    }
}

function toggleShoppingCart() {
    const cartContainer = document.getElementById('cart-container');
    const arrowIcon = document.querySelector('.shopping-cart-title i');

    if (cartContainer.classList.contains('visible')) {
        cartContainer.classList.remove('visible');
        arrowIcon.classList.remove('ri-arrow-left-line');
        arrowIcon.classList.add('ri-arrow-left-line');
    } else {
        cartContainer.classList.add('visible');
        arrowIcon.classList.remove('ri-arrow-right-line');
        arrowIcon.classList.add('ri-arrow-right-line');
        checkAndDisplayEmptyCart();
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    // Load cart from localStorage
    loadCartFromLocalStorage();

    // Fetch and display store items
    fetchStoreItems()
        .then(items => {
            if (items) {
                displayStoreItems(items);
            }
        });

    // Set up checkout button
    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.addEventListener("click", () => {
        const itemsArray = Object.values(basket).map(item => ({
            id: item.id,
            quantity: item.quantity
        }));

        fetch("https://mcqueensdetailing.eu/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ items: itemsArray }),
        })
        .then(res => {
            if (res.ok) return res.json();
            return res.json().then(json => Promise.reject(json));
        })
        .then(({ url }) => {
            window.location = url;
        })
        .catch(e => {
            console.error(e.error);
            alert("Error: " + e.error);
        });
    });

    // Set up other event listeners
    const shoppingCartTitle = document.querySelector('.shopping-cart-title');
    shoppingCartTitle.addEventListener('click', toggleShoppingCart);

    document.querySelectorAll('.form-check-input').forEach(checkbox => {
        checkbox.addEventListener('change', updateDisplayedItems);
    });

    const priceSlider = document.getElementById('priceSlider');
    if (priceSlider) {
        priceSlider.addEventListener('input', function() {
            const [minPrice, maxPrice] = this.value.split(',');
            document.getElementById('minPrice').textContent = minPrice;
            document.getElementById('maxPrice').textContent = maxPrice;
            updateDisplayedItems();
        });
    }

    // Initialize cart display
    updateCartDisplay();
    updateTotalAmount();
    checkAndDisplayEmptyCart();
});