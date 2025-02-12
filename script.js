

const cartAPI = "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889";

async function fetchCartData() {
    try {
        const response = await fetch(cartAPI);
        const cartData = await response.json();
        displayCartItems(cartData.items);
    } catch (error) {
        console.error("Error fetching cart data:", error);
    }
}

function displayCartItems(items) {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = "";

    let total = 0;

    items.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <img src="${item.image}" alt="${item.title}" width="80">
                <p>${item.title}</p>
            </td>
            <td>${(item.price / 100).toFixed(2)}</td>
            <td>
                <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
            </td>
            <td class="subtotal">${(item.line_price / 100).toFixed(2)}</td>
            <td>
                <button class="remove-btn" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        cartItemsContainer.appendChild(row);
        total += item.line_price;
    });

    updateTotal(total);
    addEventListeners();
}

function updateTotal(total) {
    document.getElementById("subtotal").textContent = (total / 100).toFixed(2);
    document.getElementById("total").textContent = (total / 100).toFixed(2);
}

function addEventListeners() {
    document.querySelectorAll(".quantity-input").forEach(input => {
        input.addEventListener("change", updateQuantity);
    });

    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", removeItem);
    });
}

function updateQuantity(event) {
    const quantity = parseInt(event.target.value);
    if (quantity < 1) return;

    const row = event.target.closest("tr");
    const price = parseFloat(row.children[1].textContent);
    const subtotalCell = row.querySelector(".subtotal");

    subtotalCell.textContent = (price * quantity).toFixed(2);

    updateTotal(calculateTotal());
}

function calculateTotal() {
    let total = 0;
    document.querySelectorAll(".subtotal").forEach(cell => {
        total += parseFloat(cell.textContent);
    });
    return total * 100;
}

function removeItem(event) {
    const row = event.target.closest("tr");
    row.remove();
    updateTotal(calculateTotal());
}

document.getElementById("checkout-btn").addEventListener("click", () => {
    alert("Proceeding to checkout...");
});

fetchCartData();
