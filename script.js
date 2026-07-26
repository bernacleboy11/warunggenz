// ===============================
// DATA PRODUK
// ===============================

let products =
    JSON.parse(localStorage.getItem("products")) || [];


// ===============================
// DATA TRANSAKSI
// ===============================

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];



// ===============================
// PINDAH HALAMAN
// ===============================

function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {

        page.classList.remove("active-page");

    });


    const selectedPage = document.getElementById(pageId);

    selectedPage.classList.add("active-page");


    const pageTitle = document.getElementById("page-title");

    pageTitle.textContent =
        pageId.charAt(0).toUpperCase() + pageId.slice(1);


    const menus = document.querySelectorAll(".menu");

    menus.forEach(function(menu) {

        menu.classList.remove("active");

    });


    menus.forEach(function(menu) {

        if (menu.getAttribute("onclick") === `showPage('${pageId}')`) {

            menu.classList.add("active");

        }

    });


    // Jika membuka halaman produk
if (pageId === "produk") {

    displayProducts();

}


// Jika membuka halaman transaksi
if (pageId === "transaksi") {

    displayCashierProducts();

    displayCart();

}


if (pageId === "laporan") {

    updateReport();

}

if (pageId === "stok") {

    displayStock();

}

}


// ===============================
// BUKA MODAL PRODUK
// ===============================

function openProductModal() {

    document.getElementById("productModal").classList.add("show");


    document.getElementById("modalTitle").textContent =
        "Tambah Produk";


    document.getElementById("productForm").reset();


    document.getElementById("editProductIndex").value = "";

}


// ===============================
// TUTUP MODAL
// ===============================

function closeProductModal() {

    document.getElementById("productModal").classList.remove("show");

}


// ===============================
// SIMPAN PRODUK
// ===============================

document.getElementById("productForm").addEventListener(

    "submit",

    function(event) {

        event.preventDefault();


        const name =
            document.getElementById("productName").value;


        const category =
            document.getElementById("productCategory").value;


        const buyPrice =
            Number(document.getElementById("buyPrice").value);


        const sellPrice =
            Number(document.getElementById("sellPrice").value);


        const stock =
            Number(document.getElementById("productStock").value);


        const editIndex =
            document.getElementById("editProductIndex").value;


        const productData = {

            name: name,

            barcode:
            document.getElementById(
            "productBarcode"
            ).value,

            category: category,

            buyPrice: buyPrice,

            sellPrice: sellPrice,

            stock: stock

        };


        // Jika sedang edit
        if (editIndex !== "") {

            products[editIndex] = productData;

        }

        // Jika produk baru
        else {

            products.push(productData);

        }


        // Simpan ke localStorage
        localStorage.setItem(

            "products",

            JSON.stringify(products)

        );


        closeProductModal();


        displayProducts();


        alert("Produk berhasil disimpan!");

    }

);


// ===============================
// TAMPILKAN PRODUK
// ===============================

function displayProducts() {

    const table =
        document.getElementById("productTable");


    const emptyProduct =
        document.getElementById("emptyProduct");


    const searchInput =
        document.getElementById("searchProduct");


    const search =
        searchInput.value.toLowerCase();


    table.innerHTML = "";


    const filteredProducts = products.filter(function(product) {

    return (

        product.name
            .toLowerCase()
            .includes(search)

        ||

        (product.barcode &&
            product.barcode
                .toLowerCase()
                .includes(search))

    );

});


    if (filteredProducts.length === 0) {

        emptyProduct.style.display = "block";

        return;

    }


    emptyProduct.style.display = "none";


    filteredProducts.forEach(function(product, index) {


        const originalIndex =
            products.indexOf(product);


        const stockClass =
            product.stock <= 5
                ? "stock-low"
                : "stock-good";


        const row = document.createElement("tr");


        row.innerHTML = `

            <td>${index + 1}</td>


            <td class="product-name">

                ${product.name}

            </td>


            <td>

                ${product.category}

            </td>


            <td>

                Rp ${formatRupiah(product.buyPrice)}

            </td>


            <td>

                Rp ${formatRupiah(product.sellPrice)}

            </td>


            <td class="${stockClass}">

                ${product.stock}

            </td>


            <td>

                <button

                    class="action-button edit-button"

                    onclick="editProduct(${originalIndex})"

                >

                    <i class="fa-solid fa-pen"></i>

                </button>


                <button

                    class="action-button delete-button"

                    onclick="deleteProduct(${originalIndex})"

                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


// ===============================
// EDIT PRODUK
// ===============================

function editProduct(index) {

    const product = products[index];


    document.getElementById("productModal")

        .classList.add("show");


    document.getElementById("modalTitle")

        .textContent = "Edit Produk";


    document.getElementById("productName")

        .value = product.name;


    document.getElementById("productCategory")

        .value = product.category;


    document.getElementById("buyPrice")

        .value = product.buyPrice;


    document.getElementById("sellPrice")

        .value = product.sellPrice;


    document.getElementById("productStock")

        .value = product.stock;


    document.getElementById("editProductIndex")

        .value = index;

}


// ===============================
// HAPUS PRODUK
// ===============================

function deleteProduct(index) {

    const confirmDelete = confirm(

        "Apakah kamu yakin ingin menghapus produk ini?"

    );


    if (confirmDelete) {


        products.splice(index, 1);


        localStorage.setItem(

            "products",

            JSON.stringify(products)

        );


        displayProducts();


        alert("Produk berhasil dihapus!");

    }

}


// ===============================
// FORMAT RUPIAH
// ===============================

function formatRupiah(number) {

    return number.toLocaleString("id-ID");

}


// ===============================
// BUKA / TUTUP SIDEBAR
// ===============================

function toggleSidebar() {

    const sidebar =
        document.querySelector(".sidebar");

    if (!sidebar) return;

    if (sidebar.classList.contains("show")) {

        // Jika sidebar terbuka, tutup
        sidebar.classList.remove("show");

    } else {

        // Jika sidebar tertutup, buka
        sidebar.classList.add("show");

    }

}

// ===============================
// DATA KERANJANG
// ===============================

let cart = [];


// ===============================
// TAMPILKAN PRODUK DI KASIR
// ===============================

function displayCashierProducts() {

    const productList =
        document.getElementById("cashierProductList");


    const emptyProduct =
        document.getElementById("emptyCashierProduct");


    const searchInput =
        document.getElementById("cashierSearch");


    const search =
        searchInput.value.toLowerCase();


    productList.innerHTML = "";


    const filteredProducts = products.filter(function(product) {

    return (

        product.name
            .toLowerCase()
            .includes(search)

        ||

        (product.barcode &&
            product.barcode
                .toLowerCase()
                .includes(search))

    );

});


    if (filteredProducts.length === 0) {

        emptyProduct.style.display = "block";

        return;

    }


    emptyProduct.style.display = "none";


    filteredProducts.forEach(function(product) {

        const productCard =
            document.createElement("div");


        productCard.className =
            "cashier-product-card";


        productCard.onclick = function() {

            addToCart(product);

        };


        const stockClass =
            product.stock <= 0
                ? "stock-empty"
                : "";


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
// TAMBAH KE KERANJANG
// ===============================

function addToCart(product) {

    // Pastikan stok tersedia

    if (!product.stock || product.stock <= 0) {

        alert("Stok produk ini habis!");

        return;

    }


    const existingProduct =
        cart.find(function(item) {

            return item.name === product.name;

        });


    // Jika produk sudah ada di keranjang

    if (existingProduct) {


        if (

            existingProduct.quantity <

            product.stock

        ) {

            existingProduct.quantity++;

        }

        else {

            alert(

                "Jumlah melebihi stok yang tersedia!"

            );

            return;

        }

    }


    // Jika produk belum ada di keranjang

    else {

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
// ===============================
// TAMPILKAN KERANJANG
// ===============================

function displayCart() {


    const cartItems =
        document.getElementById("cartItems");


    const cartCount =
        document.getElementById("cartCount");


    const totalItems =
        document.getElementById("totalItems");


    const cartTotal =
        document.getElementById("cartTotal");


    cartItems.innerHTML = "";


    if (cart.length === 0) {


        cartItems.innerHTML = `

            <div class="empty-cart">

                <i class="fa-solid fa-cart-shopping"></i>

                <p>Keranjang masih kosong</p>

            </div>

        `;


        cartCount.textContent = "0 item";

        totalItems.textContent = "0";

        cartTotal.textContent = "Rp 0";


        calculateChange();


        return;

    }


    let total = 0;

    let itemCount = 0;


    cart.forEach(function(item, index) {

    // Total harga sebelum diskon
    const grossTotal =
        item.price * item.quantity;


    // Diskon untuk total produk ini
    const discountAmount =
        item.discount || 0;


    // Total setelah diskon
    const subtotal =
        grossTotal - discountAmount;


    total += subtotal;


    // Hitung jumlah item
    itemCount += item.quantity;


    const cartItem =
        document.createElement("div");


        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-info">

                <h4>${item.name}</h4>

                <p>

                    Rp ${formatRupiah(item.price)}

                </p>

                <div class="discount-control">

    <label>

        <i class="fa-solid fa-tag"></i>

        Diskon

    </label>

    <div class="discount-input-wrapper">

        <span>Rp</span>

        <input

            type="number"

            min="0"

            value="${item.discount || 0}"

            onchange="updateItemDiscount(${index}, this.value)"

        >

    </div>

</div>

            </div>


            <div class="quantity-control">


                <button

                    onclick="decreaseQuantity(${index})"

                >

                    −

                </button>


                <span>${item.quantity}</span>


                <button

                    onclick="increaseQuantity(${index})"

                >

                    +

                </button>


            </div>


            <strong>

                Rp ${formatRupiah(subtotal)}

            </strong>


            <button

                class="remove-cart"

                onclick="removeFromCart(${index})"

            >

                <i class="fa-solid fa-trash"></i>

            </button>

        `;


        cartItems.appendChild(cartItem);

    });


    cartCount.textContent =
        `${itemCount} item`;


    totalItems.textContent =
        itemCount;


    cartTotal.textContent =
        `Rp ${formatRupiah(total)}`;


    calculateChange();

}

// ===============================
// UPDATE DISKON PRODUK
// ===============================

function updateItemDiscount(index, value) {


    let discount =
        Number(value) || 0;


    // Diskon tidak boleh negatif

    if (discount < 0) {

        discount = 0;

    }


    // Diskon tidak boleh melebihi harga produk

    if (discount > cart[index].price) {

        discount = cart[index].price;

    }


    cart[index].discount =
        discount;


    displayCart();

}


// ===============================
// TAMBAH JUMLAH
// ===============================

function increaseQuantity(index) {

    const item = cart[index];


    const product =
        products.find(function(product) {

            return product.name === item.name;

        });


    if (!product) {

        alert("Produk tidak ditemukan!");

        return;

    }


    if (item.quantity >= product.stock) {

        alert(
            "Jumlah melebihi stok yang tersedia!"
        );

        return;

    }


    item.quantity++;


    displayCart();

}


// ===============================
// KURANGI JUMLAH
// ===============================

function decreaseQuantity(index) {

    const item = cart[index];


    if (item.quantity > 1) {

        item.quantity--;

    }

    else {

        cart.splice(index, 1);

    }


    displayCart();

}


// ===============================
// HAPUS DARI KERANJANG
// ===============================

function removeFromCart(index) {

    cart.splice(index, 1);

    displayCart();

}


// ===============================
// HITUNG KEMBALIAN
// ===============================

function calculateChange() {

    const paymentInput =
        document.getElementById("paymentAmount");


    const changeAmount =
        document.getElementById("changeAmount");


    const payment =
        Number(paymentInput.value) || 0;


    const totalText =
        document.getElementById("cartTotal").textContent;


    const total =
        Number(

            totalText

                .replace(/[^\d]/g, "")

        ) || 0;


    const change =
        payment - total;


    if (payment === 0) {

        changeAmount.textContent =
            "Rp 0";

    }


    else if (change < 0) {

        changeAmount.textContent =
            "Uang kurang";

    }


    else {

        changeAmount.textContent =

            `Rp ${formatRupiah(change)}`;

    }

}


// ===============================
// SELESAIKAN TRANSAKSI
// ===============================

function completeTransaction() {


    if (cart.length === 0) {

        alert("Keranjang masih kosong!");

        return;

    }


    const payment =
        Number(

            document.getElementById("paymentAmount").value

        );


    const totalText =
        document.getElementById("cartTotal").textContent;


    const total =
        Number(

            totalText

                .replace("Rp", "")

                .replace(/\./g, "")

                .trim()

        );


    if (payment < total) {

        alert("Uang pembayaran masih kurang!");

        return;

    }


    // ===============================
    // SIMPAN DATA TRANSAKSI
    // ===============================

    const transaction = {

        id: Date.now(),

        date: new Date().toISOString(),

        items: cart.map(function(item) {

    const product =
        products.find(function(product) {

            return product.name === item.name;

        });


    return {

    name: item.name,

    price: item.price,

    buyPrice: product
        ? product.buyPrice
        : 0,

    quantity: item.quantity,

    discount: item.discount || 0,

    subtotal:
        (item.price * item.quantity) -
        (item.discount || 0)

};

}),

        total: total,

        payment: payment,

        change: payment - total

    };


    transactions.push(transaction);


    localStorage.setItem(

        "transactions",

        JSON.stringify(transactions)

    );


    // ===============================
    // KURANGI STOK
    // ===============================

    cart.forEach(function(cartItem) {


        const product =
            products.find(function(product) {

                return product.name === cartItem.name;

            });


        if (product) {

            product.stock -= cartItem.quantity;

        }

    });


    localStorage.setItem(

        "products",

        JSON.stringify(products)

    );


    const change =
        payment - total;


    showReceipt(transaction);

        "Transaksi berhasil!\n\n" +

        "Total: Rp " +

        formatRupiah(total) +

        "\nBayar: Rp " +

        formatRupiah(payment) +

        "\nKembalian: Rp " +

        formatRupiah(change)

    ;


    cart = [];


    document.getElementById("paymentAmount").value = "";


    displayCart();


    displayCashierProducts();


    updateDashboard();

    showReceipt(transaction);

}

// ===============================
// UPDATE DASHBOARD
// ===============================

    function updateDashboard() {


    // ===============================
    // TOTAL PRODUK
    // ===============================

    const totalProducts =
        document.getElementById("totalProducts");


    if (totalProducts) {

        totalProducts.textContent =
            products.length;

    }


    // ===============================
    // STOK MENIPIS
    // ===============================

    const lowStock =
        products.filter(function(product) {

            return product.stock <= 5;

        });


    const lowStockElement =
        document.getElementById("lowStock");


    if (lowStockElement) {

        lowStockElement.textContent =
            lowStock.length;

    }


    // ===============================
    // TOTAL TRANSAKSI
    // ===============================

    const totalTransactions =
        document.getElementById("totalTransactions");


    if (totalTransactions) {

        totalTransactions.textContent =
            transactions.length;

    }


    // ===============================
    // PENJUALAN HARI INI
    // ===============================

    const today =
        new Date().toDateString();


    const todayTransactions =
        transactions.filter(function(transaction) {


            return new Date(transaction.date)

                .toDateString() === today;

        });


    let todaySales = 0;


    todayTransactions.forEach(function(transaction) {

        todaySales += transaction.total;

    });


    const todaySalesElement =
        document.getElementById("todaySales");


    if (todaySalesElement) {

        todaySalesElement.textContent =

            "Rp " + formatRupiah(todaySales);

    }


    // ===============================
    // TRANSAKSI TERBARU
    // ===============================

    displayRecentTransactions();

}

// ===============================
// TRANSAKSI TERBARU
// ===============================

function displayRecentTransactions() {


    const container =
        document.getElementById("recentTransactions");


    if (!container) {

        return;

    }


    if (transactions.length === 0) {


        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-receipt"></i>

                <h3>Belum Ada Transaksi</h3>

                <p>

                    Transaksi yang dilakukan akan muncul di sini.

                </p>

            </div>

        `;


        return;

    }


    const recentTransactions =
        transactions.slice(-5).reverse();


    container.innerHTML = "";


    recentTransactions.forEach(function(transaction) {


        const date =
            new Date(transaction.date);


        const formattedDate =
            date.toLocaleString("id-ID");


        const transactionElement =
            document.createElement("div");


        transactionElement.className =
            "recent-transaction";


        transactionElement.innerHTML = `

            <div class="transaction-icon">

                <i class="fa-solid fa-receipt"></i>

            </div>


            <div class="transaction-info">

                <strong>

                    Transaksi #${transaction.id}

                </strong>


                <small>

                    ${formattedDate}

                </small>

            </div>


            <strong class="transaction-price">

                Rp ${formatRupiah(transaction.total)}

            </strong>

        `;


        container.appendChild(transactionElement);

    });

}

// Jalankan dashboard ketika aplikasi dibuka

updateDashboard();

// ===============================
// UPDATE LAPORAN
// ===============================

function updateReport() {


    const filter =
        document.getElementById("reportFilter").value;


    let filteredTransactions =
        [...transactions];


    const now =
        new Date();


    if (filter === "today") {


        filteredTransactions =
            transactions.filter(function(transaction) {


                const transactionDate =
                    new Date(transaction.date);


                return transactionDate.toDateString()

                    === now.toDateString();

            });

    }


    else if (filter === "7days") {


        const sevenDaysAgo =
            new Date();


        sevenDaysAgo.setDate(

            now.getDate() - 7

        );


        filteredTransactions =
            transactions.filter(function(transaction) {


                return new Date(transaction.date)

                    >= sevenDaysAgo;

            });

    }


    else if (filter === "30days") {


        const thirtyDaysAgo =
            new Date();


        thirtyDaysAgo.setDate(

            now.getDate() - 30

        );


        filteredTransactions =
            transactions.filter(function(transaction) {


                return new Date(transaction.date)

                    >= thirtyDaysAgo;

            });

    }


    // ===============================
    // HITUNG DATA
    // ===============================


    let totalSales = 0;

    let totalProfit = 0;

    let totalItems = 0;


    filteredTransactions.forEach(function(transaction) {


        totalSales += transaction.total;


        transaction.items.forEach(function(item) {

    totalItems += item.quantity;


    const profit =
        (item.price - item.buyPrice)
        * item.quantity;


    totalProfit += profit;

});

    });


    // ===============================
    // TAMPILKAN RINGKASAN
    // ===============================


    document.getElementById("reportSales")

        .textContent =

        "Rp " + formatRupiah(totalSales);


    document.getElementById("reportTransactions")

        .textContent =

        filteredTransactions.length;


    document.getElementById("reportProfit")

        .textContent =

        "Rp " + formatRupiah(totalProfit);


    document.getElementById("reportItems")

        .textContent =

        totalItems;


    displayReportTable(filteredTransactions);

}

// ===============================
// TABEL LAPORAN
// ===============================

function displayReportTable(reportTransactions) {


    const table =
        document.getElementById("reportTable");


    const emptyReport =
        document.getElementById("emptyReport");


    table.innerHTML = "";


    if (reportTransactions.length === 0) {


        emptyReport.style.display = "block";


        return;

    }


    emptyReport.style.display = "none";


    const reversedTransactions =
        [...reportTransactions].reverse();


    reversedTransactions.forEach(function(

        transaction,

        index

    ) {


        let itemCount = 0;

        let profit = 0;


        transaction.items.forEach(function(item) {

    itemCount += item.quantity;


    profit +=

        (item.price - item.buyPrice)

        * item.quantity;

});


        const date =
            new Date(transaction.date);


        const formattedDate =
            date.toLocaleString("id-ID");


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                ${index + 1}

            </td>


            <td>

                #${transaction.id}

            </td>


            <td>

                ${formattedDate}

            </td>


            <td>

                ${itemCount}

            </td>


            <td>

                Rp ${formatRupiah(transaction.total)}

            </td>


            <td class="profit-positive">

                Rp ${formatRupiah(profit)}

            </td>

        `;


        table.appendChild(row);

    });

}

// ===============================
// TAMPILKAN STRUK
// ===============================

function showReceipt(transaction) {


    const receiptModal =
        document.getElementById("receiptModal");


    const receiptInfo =
        document.getElementById("receiptInfo");


    const receiptItems =
        document.getElementById("receiptItems");


    const receiptTotal =
        document.querySelector(".receipt-total");


    const date =
        new Date(transaction.date);


    const formattedDate =
        date.toLocaleString("id-ID");


    // INFORMASI TRANSAKSI

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


    // PRODUK

    receiptItems.innerHTML = "";


    transaction.items.forEach(function(item) {


        const grossTotal =
            item.price * item.quantity;


        const discount =
            item.discount || 0;


        const subtotal =
            grossTotal - discount;


        const itemElement =
            document.createElement("div");


        itemElement.className =
            "receipt-item";


        itemElement.innerHTML = `

    <span class="receipt-item-name">

        ${item.name}

        <br>

        ${item.quantity} x

        Rp ${formatRupiah(item.price)}

        ${
            discount > 0
            ? `

                <br>

                <small class="receipt-discount">

                    Diskon:
                    -Rp ${formatRupiah(discount)}

                </small>

              `
            : ""

        }

    </span>


    <strong>

        Rp ${formatRupiah(subtotal)}

    </strong>

`;


        receiptItems.appendChild(itemElement);

    });


    // TOTAL

    receiptTotal.innerHTML = `

        <div class="receipt-total-row">

            <span>Subtotal</span>

            <strong>

                Rp ${formatRupiah(transaction.total)}

            </strong>

        </div>


        <div class="receipt-total-row">

            <span>Bayar</span>

            <strong>

                Rp ${formatRupiah(transaction.payment)}

            </strong>

        </div>


        <div class="receipt-total-row total">

            <span>Kembalian</span>

            <strong>

                Rp ${formatRupiah(transaction.change)}

            </strong>

        </div>

    `;


    receiptModal.classList.add("show");

}

// ===============================
// TUTUP STRUK
// ===============================

function closeReceipt() {

    document
        .getElementById("receiptModal")
        .classList.remove("show");

}


// ===============================
// CETAK STRUK
// ===============================

function printReceipt() {

    window.print();

}

// ===============================
// TAMPILKAN DATA STOK
// ===============================

function displayStock() {


    const stockTable =
        document.getElementById("stockTable");


    const emptyStock =
        document.getElementById("emptyStock");


    const searchInput =
        document.getElementById("stockSearch");


    const search =
        searchInput.value.toLowerCase();


    stockTable.innerHTML = "";


    const filteredProducts = products.filter(function(product) {

        return product.name.toLowerCase().includes(search);

    });


    // ===============================
    // RINGKASAN STOK
    // ===============================

    const totalProducts =
        products.length;


    const safeStock =
        products.filter(function(product) {

            return product.stock > 5;

        }).length;


    const lowStock =
        products.filter(function(product) {

            return product.stock > 0 && product.stock <= 5;

        }).length;


    const emptyStockCount =
        products.filter(function(product) {

            return product.stock <= 0;

        }).length;


    document.getElementById("stockTotalProducts")

        .textContent = totalProducts;


    document.getElementById("stockSafe")

        .textContent = safeStock;


    document.getElementById("stockLow")

        .textContent = lowStock;


    document.getElementById("stockEmpty")

        .textContent = emptyStockCount;


    // ===============================
    // JIKA TIDAK ADA PRODUK
    // ===============================

    if (filteredProducts.length === 0) {

        emptyStock.style.display = "block";

        return;

    }


    emptyStock.style.display = "none";


    // ===============================
    // TAMPILKAN PRODUK
    // ===============================

    filteredProducts.forEach(function(product, index) {


        let status = "";

        let statusClass = "";


        if (product.stock <= 0) {

            status = "Habis";

            statusClass = "status-empty";

        }


        else if (product.stock <= 5) {

            status = "Menipis";

            statusClass = "status-low";

        }


        else {

            status = "Aman";

            statusClass = "status-safe";

        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                ${index + 1}

            </td>


            <td>

                <strong>

                    ${product.name}

                </strong>

            </td>


            <td>

                ${product.category}

            </td>


            <td>

                Rp ${formatRupiah(product.sellPrice)}

            </td>


            <td>

                <strong>

                    ${product.stock}

                </strong>

            </td>


            <td>

                <span class="stock-status ${statusClass}">

                    ${status}

                </span>

            </td>

        `;


        stockTable.appendChild(row);

    });

}

// ===============================
// PWA SERVICE WORKER
// ===============================

if ("serviceWorker" in navigator) {


    window.addEventListener(

        "load",

        function() {


            navigator.serviceWorker.register(

                "service-worker.js"

            )

            .then(function() {


                console.log(

                    "Warung POS berhasil diaktifkan sebagai PWA"

                );

            })

            .catch(function(error) {


                console.log(

                    "Service Worker gagal:",

                    error

                );

            });

        }

    );

}

// ===============================
// BARCODE SCANNER
// ===============================

let html5QrCode = null;


// ===============================
// MULAI SCANNER
// ===============================

async function startBarcodeScanner() {

    const scannerContainer =
        document.getElementById("scannerContainer");

    const reader =
        document.getElementById("reader");


    if (!scannerContainer || !reader) {

        alert("Area kamera tidak ditemukan!");

        return;

    }


    if (typeof Html5Qrcode === "undefined") {

        alert("Library barcode belum dimuat!");

        return;

    }


    scannerContainer.style.display = "block";

    reader.innerHTML = "";


    html5QrCode =
        new Html5Qrcode("reader");


    try {

        await html5QrCode.start(

            {
                facingMode: "environment"
            },

            {
                fps: 10,

                qrbox: {
                    width: 250,
                    height: 150
                }

            },

            function(decodedText) {

                findProductByBarcode(decodedText);

                stopBarcodeScanner();

            },

            function(errorMessage) {

                // Abaikan error sementara

            }

        );

    }

    catch (error) {

        console.error(
            "Kamera gagal dibuka:",
            error
        );


        alert(
            "Kamera tidak dapat dibuka.\n\n" +
            error.message
        );

    }

}


// ===============================
// CARI PRODUK BERDASARKAN BARCODE
// ===============================

function findProductByBarcode(barcode) {

    const product =
        products.find(function(product) {

            return String(product.barcode).trim()
                === String(barcode).trim();

        });


    if (!product) {

        alert(
            "Produk dengan barcode " +
            barcode +
            " tidak ditemukan!"
        );

        return;

    }


    // Masukkan produk ke keranjang

    addToCart(product);

}


// ===============================
// HENTIKAN SCANNER
// ===============================

async function stopBarcodeScanner() {

    const scannerContainer =
        document.getElementById("scannerContainer");


    if (html5QrCode) {

        try {

            await html5QrCode.stop();

            html5QrCode.clear();

        }

        catch (error) {

            console.log(
                "Scanner sudah berhenti."
            );

        }


        html5QrCode = null;

    }


    if (scannerContainer) {

        scannerContainer.style.display =
            "none";

    }

}

// ===============================
// EXPORT DATA
// ===============================

function exportData() {

    const backupData = {

        products: products,

        transactions: transactions,

        exportDate: new Date().toISOString()

    };

    const dataString =
        JSON.stringify(backupData, null, 2);

    const blob =
        new Blob(

            [dataString],

            {
                type: "application/json"
            }

        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "backup-warung-genz.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}

function importData(event) {

    const file =
        event.target.files[0];


    if (!file) {

        return;

    }


    const reader =
        new FileReader();


    reader.onload = function(e) {

        try {

            const importedData =
                JSON.parse(e.target.result);


            if (

                !importedData.products ||

                !Array.isArray(

                    importedData.products

                )

            ) {

                alert(

                    "File backup tidak valid!"

                );

                return;

            }


            const choice =
                prompt(

                    "Pilih tindakan:\n\n" +

                    "1 = Gabungkan Data\n" +

                    "2 = Ganti Semua Data\n" +

                    "3 = Batal"

                );


            // Batal

            if (

                choice === "3" ||

                choice === null

            ) {

                return;

            }


            // Ganti semua data

            if (choice === "2") {

                products =
                    importedData.products;


                localStorage.setItem(

                    "products",

                    JSON.stringify(products)

                );


                alert(

                    "Semua data berhasil diganti!"

                );

            }


            // Gabungkan data

            else if (choice === "1") {


                importedData.products.forEach(

                    function(importedProduct) {


                        const existingProduct =

                            products.find(

                                function(product) {

                                    return (

                                        product.barcode ===

                                        importedProduct.barcode

                                    );

                                }

                            );


                        if (existingProduct) {


                            existingProduct.stock +=

                                importedProduct.stock;

                        }


                        else {

                            products.push(

                                importedProduct

                            );

                        }

                    }

                );


                localStorage.setItem(

                    "products",

                    JSON.stringify(products)

                );


                alert(

                    "Data berhasil digabungkan!"

                );

            }


            else {

                alert(

                    "Pilihan tidak valid!"

                );

                return;

            }


            displayProducts();

            displayCashierProducts();

            updateDashboard();


        }

        catch (error) {

            console.error(error);


            alert(

                "File tidak dapat dibaca!"

            );

        }

    };


    reader.readAsText(file);


    // Reset input file

    event.target.value = "";

}

// ===============================
// PEMBAYARAN CEPAT
// ===============================

function setQuickPayment(amount) {

    const paymentInput =
        document.getElementById("paymentAmount");


    paymentInput.value = amount;


    calculateChange();

}

function changePaymentMethod() {

    const method =
        document.getElementById(
            "paymentMethod"
        ).value;


    const qrisPayment =
        document.getElementById(
            "qrisPayment"
        );


    const cashPayment =
        document.getElementById(
            "cashPayment"
        );


    const changeBox =
        document.querySelector(
            ".change-box"
        );


    if (method === "qris") {

        qrisPayment.style.display =
            "block";


        cashPayment.style.display =
            "none";


        if (changeBox) {

            changeBox.style.display =
                "none";

        }

    }

    else {

        qrisPayment.style.display =
            "none";


        cashPayment.style.display =
            "block";


        if (changeBox) {

            changeBox.style.display =
                "flex";

        }

    }

}

function selectPaymentMethod(method) {

    const buttons =
        document.querySelectorAll(
            ".payment-method-button"
        );


    buttons.forEach(function(button) {

        button.classList.remove("active");

    });


    const selectedButton =
        document.querySelector(
            `[data-method="${method}"]`
        );


    if (selectedButton) {

        selectedButton.classList.add("active");

    }


    const qrisPayment =
        document.getElementById(
            "qrisPayment"
        );


    const cashPayment =
        document.getElementById(
            "cashPayment"
        );


    const changeBox =
        document.querySelector(
            ".change-box"
        );


    if (method === "qris") {

        qrisPayment.style.display =
            "block";


        cashPayment.style.display =
            "none";


        if (changeBox) {

            changeBox.style.display =
                "none";

        }

    }

    else {

        qrisPayment.style.display =
            "none";


        cashPayment.style.display =
            "block";


        if (changeBox) {

            changeBox.style.display =
                "flex";

        }

    }

}