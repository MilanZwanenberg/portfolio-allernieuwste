// main.js - Winkelmand functionaliteit

document.addEventListener("DOMContentLoaded", () => {
    initShoppingCart();
    setupAddToCartButtons();
    if (document.getElementById("cart-items")) {
        renderCartPage();
    }
});

function initShoppingCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartCount(cart);
}

function setupAddToCartButtons() {
    document.querySelectorAll(".add-to-cart-btn").forEach(button => {
        button.addEventListener("click", () => {
            let product = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                quantity: 1
            };
            addToCart(product);
        });
    });
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount(cart);
    showCartNotification();
}

function updateCartCount(cart) {
    let count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart-count").textContent = count;
}

function showCartNotification() {
    let notification = document.getElementById("cart-notification");
    if (notification) {
        notification.classList.add("show");
        setTimeout(() => notification.classList.remove("show"), 2000);
    }
}

function renderCartPage() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = "";
    
    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Uw winkelmand is leeg.</p>";
        return;
    }
    
    cart.forEach(item => {
        let cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <span>${item.name}</span>
            <span>€${item.price.toFixed(2)}</span>
            <span>Aantal: <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="cart-quantity"></span>
            <button class="remove-item" data-id="${item.id}">Verwijderen</button>
        `;
        cartContainer.appendChild(cartItem);
    });

    document.querySelectorAll(".cart-quantity").forEach(input => {
        input.addEventListener("change", (e) => {
            updateCartQuantity(e.target.dataset.id, parseInt(e.target.value));
        });
    });

    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", () => {
            removeFromCart(button.dataset.id);
        });
    });
}

function updateCartQuantity(id, quantity) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let product = cart.find(item => item.id === id);
    if (product) {
        product.quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCartPage();
        updateCartCount(cart);
    }
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartPage();
    updateCartCount(cart);
}