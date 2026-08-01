

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const DELIVERY_COST = 5;

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");

    if (!cartCountElement) {
        return;
    }

    const totalItems = cart.reduce(function (total, product) {
        return total + product.quantity;
    }, 0);

    cartCountElement.textContent = totalItems;
}

function addProductToCart(product) {
    const existingProduct = cart.find(function (item) {
        return item.id === product.id;
    });

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();

    // alert(`${product.name} has been added to your cart.`);

   Swal.fire({ icon: 'success', title: 'Added to Cart!', text: `${product.name} has been added to your cart.`, timer: 1500, showConfirmButton: false });

}
function getProductDataFromCard(card) {
    return {
        id: card.dataset.id,
        name: card.dataset.name,
        price: Number(card.dataset.price),
        category: card.dataset.category,
        image: card.dataset.image,
        description:
            card.dataset.description || "No description available."
    };
}
function setupProductCards() {
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach(function (card) {
        const addButton = card.querySelector(".add-to-cart");

        if (addButton) {
            addButton.addEventListener("click", function (event) {
                event.stopPropagation();

                const product = getProductDataFromCard(card);

                addProductToCart(product);
            });
        }

        card.addEventListener("click", function () {
            const selectedProduct = getProductDataFromCard(card);

            localStorage.setItem(
                "selectedProduct",
                JSON.stringify(selectedProduct)
            );

            window.location.href = "product-details.html";
        });
    });
}

function showProductDetails() {
    const detailsName = document.getElementById("details-name");

    if (!detailsName) {
        return;
    }

    const selectedProduct = JSON.parse(
        localStorage.getItem("selectedProduct")
    );

    if (!selectedProduct) {
        detailsName.textContent = "Product Not Found";
        return;
    }

    const detailsImage =
        document.getElementById("details-image");

    const detailsCategory =
        document.getElementById("details-category");

    const detailsPrice =
        document.getElementById("details-price");

    const detailsDescription =
        document.getElementById("details-description");

    const addButton =
        document.getElementById("product-details-add-button");

    detailsName.textContent = selectedProduct.name;

    if (detailsCategory) {
        detailsCategory.textContent =
            selectedProduct.category;
    }

    if (detailsPrice) {
        detailsPrice.textContent =
            `$${Number(selectedProduct.price).toFixed(2)}`;
    }

    if (detailsDescription) {
        detailsDescription.textContent =
            selectedProduct.description;
    }

    if (detailsImage) {
        detailsImage.src = selectedProduct.image;
        detailsImage.alt = selectedProduct.name;
    }

    document.title =
        `${selectedProduct.name} | PinkShop`;

    if (addButton) {
        addButton.dataset.id = selectedProduct.id;
        addButton.dataset.name = selectedProduct.name;
        addButton.dataset.price = selectedProduct.price;
        addButton.dataset.category = selectedProduct.category;
        addButton.dataset.image = selectedProduct.image;
        addButton.dataset.description =
            selectedProduct.description;
    }
}

function setupProductDetailsButton() {
    const addButton = document.getElementById(
        "product-details-add-button"
    );

    if (!addButton) {
        return;
    }

    addButton.addEventListener("click", function () {
        const product = {
            id: addButton.dataset.id,
            name: addButton.dataset.name,
            price: Number(addButton.dataset.price),
            category: addButton.dataset.category,
            image: addButton.dataset.image,
            description:
                addButton.dataset.description ||
                "No description available."
        };

        addProductToCart(product);
    });
}

function renderCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const emptyCartMessage = document.getElementById(
        "empty-cart-message"
    );

    if (!cartItemsContainer) {
        return;
    }

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        if (emptyCartMessage) {
            emptyCartMessage.classList.remove("d-none");
        }

        updateCartSummary();
        return;
    }

    if (emptyCartMessage) {
        emptyCartMessage.classList.add("d-none");
    }

    cart.forEach(function (product) {
        const productTotal = product.price * product.quantity;

        cartItemsContainer.innerHTML += `
            <div
                class="card border-0 shadow-sm rounded-4 mb-3"
                data-product-id="${product.id}"
            >
                <div class="card-body">
                    <div class="row align-items-center g-3">

                        <div class="col-4 col-md-3">
                            <img
                                src="${product.image}"
                                class="img-fluid rounded-3 cart-product-image"
                                alt="${product.name}"
                            >
                        </div>

                        <div class="col-8 col-md-4">
                            <h5 class="fw-bold mb-1">
                                ${product.name}
                            </h5>

                            <p class="social-link mb-0">
                                ${product.category}
                            </p>
                        </div>

                        <div class="col-6 col-md-2">
                            <span class="product-price">
                                $${productTotal.toFixed(2)}
                            </span>
                        </div>

                        <div class="col-6 col-md-2">
                            <div class="input-group input-group-sm">

                                <button
                                    type="button"
                                    class="btn btn-outline-secondary decrease-quantity"
                                >
                                    -
                                </button>

                                <input
                                    type="number"
                                    class="form-control text-center quantity-input"
                                    value="${product.quantity}"
                                    min="1"
                                >

                                <button
                                    type="button"
                                    class="btn btn-outline-secondary increase-quantity"
                                >
                                    +
                                </button>

                            </div>
                        </div>

                        <div class="col-12 col-md-1 text-md-end">
                            <button
                                type="button"
                                class="btn btn-link text-danger p-0 remove-product"
                            >
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        `;
    });

    setupCartButtons();
    updateCartSummary();
}

function setupCartButtons() {
    const cartProductCards = document.querySelectorAll(
        "[data-product-id]"
    );

    cartProductCards.forEach(function (card) {
        const productId = card.dataset.productId;

        const increaseButton = card.querySelector(
            ".increase-quantity"
        );

        const decreaseButton = card.querySelector(
            ".decrease-quantity"
        );

        const removeButton = card.querySelector(
            ".remove-product"
        );

        const quantityInput = card.querySelector(
            ".quantity-input"
        );

        increaseButton.addEventListener("click", function () {
            changeQuantity(productId, 1);
        });

        decreaseButton.addEventListener("click", function () {
            changeQuantity(productId, -1);
        });

        removeButton.addEventListener("click", function () {
            removeProductFromCart(productId);
        });

        quantityInput.addEventListener("change", function () {
            setProductQuantity(
                productId,
                Number(quantityInput.value)
            );
        });
    });
}

function changeQuantity(productId, change) {
    const product = cart.find(function (item) {
        return item.id === productId;
    });

    if (!product) {
        return;
    }

    product.quantity += change;

    if (product.quantity < 1) {
        product.quantity = 1;
    }

    saveCart();
    updateCartCount();
    renderCart();
}

function setProductQuantity(productId, newQuantity) {
    const product = cart.find(function (item) {
        return item.id === productId;
    });

    if (!product) {
        return;
    }

    if (!Number.isInteger(newQuantity) || newQuantity < 1) {
        product.quantity = 1;
    } else {
        product.quantity = newQuantity;
    }

    saveCart();
    updateCartCount();
    renderCart();
}

function removeProductFromCart(productId) {
    cart = cart.filter(function (item) {
        return item.id !== productId;
    });

    saveCart();
    updateCartCount();
    renderCart();
}

function updateCartSummary() {
    const subtotalElement = document.getElementById(
        "cart-subtotal"
    );

    const deliveryElement = document.getElementById(
        "delivery-cost"
    );

    const totalElement = document.getElementById(
        "cart-total"
    );

    const checkoutButton = document.getElementById(
        "checkout-button"
    );

    if (!subtotalElement || !totalElement) {
        return;
    }

    const subtotal = cart.reduce(function (total, product) {
        return total + product.price * product.quantity;
    }, 0);

    const delivery = cart.length > 0 ? DELIVERY_COST : 0;
    const total = subtotal + delivery;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;

    if (deliveryElement) {
        deliveryElement.textContent = `$${delivery.toFixed(2)}`;
    }

    if (checkoutButton) {
        checkoutButton.disabled = cart.length === 0;
    }
}

function setupSearch() {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");

    if (!searchForm || !searchInput) {
        return;
    }

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();

        filterProducts(searchInput.value);
    });

    searchInput.addEventListener("input", function () {
        filterProducts(searchInput.value);
    });
}

function filterProducts(searchValue) {
    const productCards = document.querySelectorAll(".product-card");

    const searchText = searchValue.trim().toLowerCase();

    productCards.forEach(function (card) {
        const productColumn = card.closest(".col-12");

        const productName = card.dataset.name.toLowerCase();
        const category = card.dataset.category.toLowerCase();

        const productMatches =
            productName.includes(searchText) ||
            category.includes(searchText);

        productColumn.classList.toggle(
            "d-none",
            !productMatches
        );
    });
}
updateCartCount();
setupProductCards();
showProductDetails();
setupProductDetailsButton();
setupSearch();
renderCart();