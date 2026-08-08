// ===============================
// DATA UTAMA
// ===============================
let products = JSON.parse(localStorage.getItem("products")) || [];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// ===============================
// DASHBOARD & STATISTIK
// ===============================
function updateDashboard() {
    // Total Produk
    const totalProducts = document.getElementById("totalProducts");
    if (totalProducts) {
        totalProducts.textContent = products.length;
    }

    // Stok Menipis (<= 5)
    const lowStock = products.filter(product => product.stock <= 5);
    const lowStockElement = document.getElementById("lowStock");
    if (lowStockElement) {
        lowStockElement.textContent = lowStock.length;
    }

    // Total Transaksi
    const totalTransactions = document.getElementById("totalTransactions");
    if (totalTransactions) {
        totalTransactions.textContent = transactions.length;
    }

    // Penjualan Hari Ini
    const today = new Date().toDateString();
    const todayTransactions = transactions.filter(transaction => {
        return new Date(transaction.date).toDateString() === today;
    });

    let todaySales = 0;
    todayTransactions.forEach(transaction => {
        todaySales += transaction.total;
    });

    const todaySalesElement = document.getElementById("todaySales");
    if (todaySalesElement) {
        todaySalesElement.textContent = "Rp " + formatRupiah(todaySales);
    }

    // Tampilkan Transaksi Terbaru
    displayRecentTransactions();
}

// ===============================
// TRANSAKSI TERBARU
// ===============================
function displayRecentTransactions() {
    const container = document.getElementById("recentTransactions");
    if (!container) return;

    if (transactions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-receipt"></i>
                <h3>Belum Ada Transaksi</h3>
                <p>Transaksi yang dilakukan akan muncul di sini.</p>
            </div>
        `;
        return;
    }

    const recentTransactions = transactions.slice(-5).reverse();
    container.innerHTML = "";

    recentTransactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleString("id-ID");

        const transactionElement = document.createElement("div");
        transactionElement.className = "recent-transaction";
        transactionElement.innerHTML = `
            <div class="transaction-icon">
                <i class="fa-solid fa-receipt"></i>
            </div>
            <div class="transaction-info">
                <strong>Transaksi #${transaction.id}</strong>
                <small>${formattedDate}</small>
            </div>
            <strong class="transaction-price">
                Rp ${formatRupiah(transaction.total)}
            </strong>
        `;

        container.appendChild(transactionElement);
    });
}

// ===============================
// HELPER & UTILITIES
// ===============================
function formatRupiah(number) {
    return (number || 0).toLocaleString("id-ID");
}

function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;
    sidebar.classList.toggle("show");
}

// Jalankan saat dashboard dibuka
updateDashboard();