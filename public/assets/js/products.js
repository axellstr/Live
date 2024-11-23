// products.js

// Product data
const products = [
    { id: 1, name: "Fusionskin® Matt Shampoo", description: "Description of Product 1", price: 19.99, image: "/assets/images/pruk.png" },
    { id: 2, name: "Product 2", description: "Description of Product 2", price: 24.99, image: "https://via.placeholder.com/300x200" },
    { id: 3, name: "Product 3", description: "Description of Product 3", price: 29.99, image: "https://via.placeholder.com/300x200" },
    { id: 4, name: "Product 4", description: "Description of Product 4", price: 34.99, image: "https://via.placeholder.com/300x200" },
    { id: 5, name: "Product 5", description: "Description of Product 5", price: 39.99, image: "https://via.placeholder.com/300x200" },
    { id: 6, name: "Product 6", description: "Description of Product 6", price: 44.99, image: "https://via.placeholder.com/300x200" },
    { id: 7, name: "Product 7", description: "Description of Product 7", price: 49.99, image: "https://via.placeholder.com/300x200" },
    { id: 8, name: "Product 8", description: "Description of Product 8", price: 54.99, image: "https://via.placeholder.com/300x200" },
    { id: 9, name: "Product 9", description: "Description of Product 9", price: 59.99, image: "https://via.placeholder.com/300x200" },
    { id: 9, name: "Product 9", description: "Description of Product 9", price: 59.99, image: "https://via.placeholder.com/300x200" },
    { id: 9, name: "Product 9", description: "Description of Product 9", price: 59.99, image: "https://via.placeholder.com/300x200" },
    { id: 9, name: "Product 9", description: "Description of Product 9", price: 59.99, image: "https://via.placeholder.com/300x200" },
    { id: 9, name: "Product 9", description: "Description of Product 9", price: 59.99, image: "https://via.placeholder.com/300x200" },
    { id: 9, name: "Product 9", description: "Description of Product 9", price: 59.99, image: "https://via.placeholder.com/300x200" },
];

// Example categories for products
const categories = {
    category1: [1, 2, 3],
    category2: [4, 5, 6],
    category3: [7, 8, 9]
};

// Initialize cart and item count
let cart = [];
let itemCount = 0;

// Function to add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateItemCount();
        updateCartItems();
        saveCartToLocalStorage();  // Add this line

    }
}

// Function to update the item count
function updateItemCount() {
    itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('item-count').textContent = itemCount;
}

// Function to update the cart items display
function updateCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.😔</p>';
        cartTotalContainer.innerHTML = '';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h5>${item.name}</h5>
                    <p>${item.description}</p>
                    <p>
                        <strong>$${item.price.toFixed(2)}</strong>
                       <button onclick="removeItem(${item.id})">-</button>
                       ${item.quantity}
                       <button onclick="addItem(${item.id})">+</button>
                       
                    </p>
                </div>
            </div>
        `).join('');
        const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        cartItemsContainer.innerHTML += `
            <div id="cart-total">
                <p>Total: <strong>$${totalPrice.toFixed(2)}</strong></p>
            </div>
            <button class="checkout-button" onclick="checkout()">Checkout</button>
        `;
    }
}


// Function to add an item to the cart
function addItem(productId) {
    addToCart(parseInt(productId));
}

// Function to remove an item from the cart
function removeItem(productId) {
    const index = cart.findIndex(item => item.id === parseInt(productId));
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
        updateItemCount();
        updateCartItems();
        saveCartToLocalStorage();  // Add this line

    }
}

// Function to toggle cart display
function toggleCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    if (cartItems.style.display === 'none') {
        cartItems.style.display = 'block';
        updateCartItems();  // Add this line
    } else {
        cartItems.style.display = 'none';
    }
}

// Function to handle checkout
function checkout() {
    alert('Proceeding to checkout...');
    // Add your checkout logic here
}

// Function to create a product card
function createProductCard(product) {
    return `
        <div class="col-md-4 mb-4">
            <div class="card">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text"><strong>$${product.price.toFixed(2)}</strong></p>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
}

// Function to filter products by selected categories
function filterProducts() {
    const selectedCategories = Array.from(document.querySelectorAll('.form-check-input:checked')).map(checkbox => checkbox.value);
    const productContainer = document.getElementById('product-container');
    let filteredProducts = products;

    if (selectedCategories.length > 0) {
        filteredProducts = products.filter(product => selectedCategories.some(category => categories[category].includes(product.id)));
    }

    productContainer.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

// Function to render all products
function renderProducts() {
    filterProducts();
}

// Event listeners for category checkboxes
document.querySelectorAll('.form-check-input').forEach(checkbox => {
    checkbox.addEventListener('change', filterProducts);
});



// Render products when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    loadCartFromLocalStorage();  // Add this line
});


function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('itemCount', itemCount);
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    const savedItemCount = localStorage.getItem('itemCount');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        itemCount = parseInt(savedItemCount || '0');
        updateCartItems();
        updateItemCount();
    }
}
