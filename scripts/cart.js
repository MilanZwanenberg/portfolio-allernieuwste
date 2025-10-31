document.addEventListener("DOMContentLoaded", () => {
    initCart();

    function initCart() {
        updateCartCount();
        if (document.getElementById("cart-items")) {
            renderCart();
        }
    }

    function getCart() {
        return JSON.parse(localStorage.getItem("cart")) || [];
    }

    function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function updateCartCount() {
        let cart = getCart();
        let count = cart.reduce((total, item) => total + item.quantity, 0);
        let cartCountElement = document.getElementById("cart-count");
        if (cartCountElement) {
            cartCountElement.textContent = count;
        }
    }

    function renderCart() {
        let cart = getCart();
        let cartContainer = document.getElementById("cart-items");
        let totalContainer = document.getElementById("cart-total");

        if (!cartContainer || !totalContainer) return;

        cartContainer.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Uw winkelmand is leeg.</p>";
            totalContainer.textContent = "€0,00";
            return;
        }

        cart.forEach(item => {
            let cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <span>${item.name}</span>
                <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="cart-quantity">
                <span>€${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-item" data-id="${item.id}">❌</button>
            `;
            cartContainer.appendChild(cartItem);
            total += item.price * item.quantity;
        });

        totalContainer.textContent = `€${total.toFixed(2)}`;
    }

    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-to-cart")) {
            let product = {
                id: event.target.dataset.id,
                name: event.target.dataset.name,
                price: parseFloat(event.target.dataset.price),
                quantity: 1
            };

            let cart = getCart();
            let existingProduct = cart.find(item => item.id === product.id);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push(product);
            }

            saveCart(cart);
            updateCartCount();
        }

        if (event.target.classList.contains("remove-item")) {
            let cart = getCart();
            cart = cart.filter(item => item.id !== event.target.dataset.id);
            saveCart(cart);
            renderCart();
            updateCartCount();
        }
    });

    document.addEventListener("change", (event) => {
        if (event.target.classList.contains("cart-quantity")) {
            let cart = getCart();
            let product = cart.find(item => item.id === event.target.dataset.id);
            if (product) {
                product.quantity = parseInt(event.target.value);
                saveCart(cart);
                renderCart();
                updateCartCount();
            }
        }
    });

    document.getElementById("clear-cart")?.addEventListener("click", () => {
        localStorage.removeItem("cart");
        renderCart();
        updateCartCount();
    });
});


function toggleMenu() {
    document.querySelector(".nav-links").classList.toggle("active");
}
