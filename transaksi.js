// ===============================
// DATA UTAMA & KERANJANG
// ===============================
let products = JSON.parse(localStorage.getItem("products")) || [];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let cart = [];
let html5QrCode = null;

// ===============================
// TAMPILKAN PRODUK KASIR
// ===============================
function displayCashierProducts() {
    const productList = document.getElementById("cashierProductList");
    const emptyProduct = document.getElementById("emptyCashierProduct");
    const searchInput = document.getElementById("cashierSearch");
    const search = searchInput ? searchInput.value.toLowerCase() : "";

    if (!productList) return;
    productList.innerHTML = "";

    const filteredProducts = products.filter(product => {
        return (
            product.name.toLowerCase().includes(search) ||
            (product.barcode && product.barcode.toLowerCase().includes(search))
        );
    });

    if (filteredProducts.length === 0) {
        if (emptyProduct) emptyProduct.style.display = "block";
        return;
    }

    if (emptyProduct) emptyProduct.style.display = "none";

    filteredProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "cashier-product-card";
        productCard.onclick = () => addToCart(product);

        const stockClass = product.stock <= 0 ? "stock-empty" : "";

        productCard.innerHTML = `
            <div class="cashier-product-icon">
                <i class="fa-solid fa-box"></i>
            </div>
            <h3>${product.name}</h3>
            <div class="cashier-product-price">
                Rp ${formatRupiah(product.sellPrice)}
            </div>
            <div class="cashier-product-stock ${stockClass}">
                Stok: ${product.stock}
            </div>
        `;

        productList.appendChild(productCard);
    });
}

// ===============================
// KELOLA KERANJANG
// ===============================
function addToCart(product) {
    if (!product.stock || product.stock <= 0) {
        alert("Stok produk ini habis!");
        return;
    }

    const existingProduct = cart.find(item => item.name === product.name);

    if (existingProduct) {
        if (existingProduct.quantity < product.stock) {
            existingProduct.quantity++;
        } else {
            alert("Jumlah melebihi stok yang tersedia!");
            return;
        }
    } else {
        cart.push({
            name: product.name,
            price: product.sellPrice,
            quantity: 1,
            stock: product.stock,
            discount: 0
        });
    }

    displayCart();
}

function displayCart() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const totalItems = document.getElementById("totalItems");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartItems) return;
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-cart-shopping"></i>
                <p>Keranjang masih kosong</p>
            </div>
        `;

        if (cartCount) cartCount.textContent = "0 item";
        if (totalItems) totalItems.textContent = "0";
        if (cartTotal) cartTotal.textContent = "Rp 0";
        calculateChange();
        return;
    }

    let total = 0;
    let itemCount = 0;

    cart.forEach((item, index) => {
        const grossTotal = item.price * item.quantity;
        const discountAmount = item.discount || 0;
        const subtotal = grossTotal - discountAmount;

        total += subtotal;
        itemCount += item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Rp ${formatRupiah(item.price)}</p>
                <div class="discount-control">
                    <label><i class="fa-solid fa-tag"></i> Diskon</label>
                    <div class="discount-input-wrapper">
                        <span>Rp</span>
                        <input type="number" min="0" value="${item.discount || 0}" onchange="updateItemDiscount(${index}, this.value)">
                    </div>
                </div>
            </div>
            <div class="quantity-control">
                <button onclick="decreaseQuantity(${index})">−</button>
                <span>${item.quantity}</span>
                <button onclick="increaseQuantity(${index})">+</button>
            </div>
            <strong>Rp ${formatRupiah(subtotal)}</strong>
            <button class="remove-cart" onclick="removeFromCart(${index})">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;

        cartItems.appendChild(cartItem);
    });

    if (cartCount) cartCount.textContent = `${itemCount} item`;
    if (totalItems) totalItems.textContent = itemCount;
    if (cartTotal) cartTotal.textContent = `Rp ${formatRupiah(total)}`;

    calculateChange();
}

function updateItemDiscount(index, value) {
    let discount = Number(value) || 0;
    if (discount < 0) discount = 0;
    if (discount > cart[index].price) discount = cart[index].price;

    cart[index].discount = discount;
    displayCart();
}

function increaseQuantity(index) {
    const item = cart[index];
    const product = products.find(p => p.name === item.name);

    if (!product || item.quantity >= product.stock) {
        alert("Jumlah melebihi stok yang tersedia!");
        return;
    }

    item.quantity++;
    displayCart();
}

function decreaseQuantity(index) {
    const item = cart[index];
    if (item.quantity > 1) {
        item.quantity--;
    } else {
        cart.splice(index, 1);
    }
    displayCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    displayCart();
}

function clearCart() {
    cart = [];
    document.getElementById("paymentAmount").value = "";
    displayCart();
}

// ===============================
// PEMBAYARAN & KEMBALIAN
// ===============================
function calculateChange() {
    const paymentInput = document.getElementById("paymentAmount");
    const changeAmount = document.getElementById("changeAmount");
    if (!paymentInput || !changeAmount) return;

    const payment = Number(paymentInput.value) || 0;
    const totalText = document.getElementById("cartTotal").textContent;
    const total = Number(totalText.replace(/[^\d]/g, "")) || 0;
    const change = payment - total;

    if (payment === 0) {
        changeAmount.textContent = "Rp 0";
    } else if (change < 0) {
        changeAmount.textContent = "Uang kurang";
    } else {
        changeAmount.textContent = `Rp ${formatRupiah(change)}`;
    }
}

function setQuickPayment(amount) {
    const paymentInput = document.getElementById("paymentAmount");
    if (paymentInput) {
        paymentInput.value = amount;
        calculateChange();
    }
}

function selectPaymentMethod(method) {
    const buttons = document.querySelectorAll(".payment-method-button");
    buttons.forEach(button => button.classList.remove("active"));

    const selectedButton = document.querySelector(`[data-method="${method}"]`);
    if (selectedButton) selectedButton.classList.add("active");

    const qrisPayment = document.getElementById("qrisPayment");
    const cashPayment = document.getElementById("cashPayment");
    const changeBox = document.querySelector(".change-box");

    if (method === "qris") {
        if (qrisPayment) qrisPayment.style.display = "block";
        if (cashPayment) cashPayment.style.display = "none";
        if (changeBox) changeBox.style.display = "none";
    } else {
        if (qrisPayment) qrisPayment.style.display = "none";
        if (cashPayment) cashPayment.style.display = "block";
        if (changeBox) changeBox.style.display = "flex";
    }
}

// ===============================
// SELESAIKAN TRANSAKSI & STRUK
// ===============================
function completeTransaction() {
    if (cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    const payment = Number(document.getElementById("paymentAmount").value);
    const totalText = document.getElementById("cartTotal").textContent;
    const total = Number(totalText.replace("Rp", "").replace(/\./g, "").trim());

    if (payment < total) {
        alert("Uang pembayaran masih kurang!");
        return;
    }

    const transaction = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: cart.map(item => {
            const product = products.find(p => p.name === item.name);
            return {
                name: item.name,
                price: item.price,
                buyPrice: product ? product.buyPrice : 0,
                quantity: item.quantity,
                discount: item.discount || 0,
                subtotal: (item.price * item.quantity) - (item.discount || 0)
            };
        }),
        total: total,
        payment: payment,
        change: payment - total
    };

    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    // Potong stok
    cart.forEach(cartItem => {
        const product = products.find(p => p.name === cartItem.name);
        if (product) product.stock -= cartItem.quantity;
    });
    localStorage.setItem("products", JSON.stringify(products));

    showReceipt(transaction);
    cart = [];
    document.getElementById("paymentAmount").value = "";
    displayCart();
    displayCashierProducts();
}

function showReceipt(transaction) {
    const receiptModal = document.getElementById("receiptModal");
    const receiptInfo = document.getElementById("receiptInfo");
    const receiptItems = document.getElementById("receiptItems");
    const receiptTotal = document.querySelector(".receipt-total");

    const date = new Date(transaction.date);
    const formattedDate = date.toLocaleString("id-ID");

    receiptInfo.innerHTML = `
        <div class="receipt-info-row">
            <span>No. Transaksi</span>
            <span>#${transaction.id}</span>
        </div>
        <div class="receipt-info-row">
            <span>Tanggal</span>
            <span>${formattedDate}</span>
        </div>
    `;

    receiptItems.innerHTML = "";
    transaction.items.forEach(item => {
        const grossTotal = item.price * item.quantity;
        const discount = item.discount || 0;
        const subtotal = grossTotal - discount;

        const itemElement = document.createElement("div");
        itemElement.className = "receipt-item";
        itemElement.innerHTML = `
            <span class="receipt-item-name">
                ${item.name}<br>
                ${item.quantity} x Rp ${formatRupiah(item.price)}
                ${discount > 0 ? `<br><small class="receipt-discount">Diskon: -Rp ${formatRupiah(discount)}</small>` : ""}
            </span>
            <strong>Rp ${formatRupiah(subtotal)}</strong>
        `;
        receiptItems.appendChild(itemElement);
    });

    receiptTotal.innerHTML = `
        <div class="receipt-total-row">
            <span>Subtotal</span>
            <strong>Rp ${formatRupiah(transaction.total)}</strong>
        </div>
        <div class="receipt-total-row">
            <span>Bayar</span>
            <strong>Rp ${formatRupiah(transaction.payment)}</strong>
        </div>
        <div class="receipt-total-row total">
            <span>Kembalian</span>
            <strong>Rp ${formatRupiah(transaction.change)}</strong>
        </div>
    `;

    receiptModal.classList.add("show");
}

function closeReceipt() {
    document.getElementById("receiptModal").classList.remove("show");
}

function printReceipt() {
    window.print();
}

// ===============================
// BARCODE SCANNER
// ===============================
async function startBarcodeScanner() {
    const scannerContainer = document.getElementById("scannerContainer");
    const reader = document.getElementById("reader");

    if (!scannerContainer || !reader) return alert("Area kamera tidak ditemukan!");
    if (typeof Html5Qrcode === "undefined") return alert("Library barcode belum dimuat!");

    scannerContainer.style.display = "block";
    reader.innerHTML = "";
    html5QrCode = new Html5Qrcode("reader");

    try {
        await html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 150 } },
            decodedText => {
                findProductByBarcode(decodedText);
                stopBarcodeScanner();
            },
            errorMessage => {}
        );
    } catch (error) {
        alert("Kamera tidak dapat dibuka.\n\n" + error.message);
    }
}

function findProductByBarcode(barcode) {
    const product = products.find(p => String(p.barcode).trim() === String(barcode).trim());
    if (!product) return alert("Produk dengan barcode " + barcode + " tidak ditemukan!");
    addToCart(product);
}

async function stopBarcodeScanner() {
    const scannerContainer = document.getElementById("scannerContainer");
    if (html5QrCode) {
        try {
            await html5QrCode.stop();
            html5QrCode.clear();
        } catch (e) {}
        html5QrCode = null;
    }
    if (scannerContainer) scannerContainer.style.display = "none";
}

// ===============================
// HELPER
// ===============================
function formatRupiah(number) {
    return (number || 0).toLocaleString("id-ID");
}

function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) sidebar.classList.toggle("show");
}

// Inisialisasi awal
displayCashierProducts();
displayCart();