// ===============================
// DATA UTAMA
// ===============================
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// ===============================
// UPDATE LAPORAN
// ===============================
function updateReport() {
    const filterSelect = document.getElementById("reportFilter");
    const filter = filterSelect ? filterSelect.value : "today";

    let filteredTransactions = [...transactions];
    const now = new Date();

    if (filter === "today") {
        filteredTransactions = transactions.filter(transaction => {
            return new Date(transaction.date).toDateString() === now.toDateString();
        });
    } else if (filter === "7days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        filteredTransactions = transactions.filter(transaction => {
            return new Date(transaction.date) >= sevenDaysAgo;
        });
    } else if (filter === "30days") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        filteredTransactions = transactions.filter(transaction => {
            return new Date(transaction.date) >= thirtyDaysAgo;
        });
    }

    // Calculation
    let totalSales = 0;
    let totalProfit = 0;
    let totalItems = 0;

    filteredTransactions.forEach(transaction => {
        totalSales += transaction.total;

        transaction.items.forEach(item => {
            totalItems += item.quantity;
            const profit = (item.price - item.buyPrice) * item.quantity;
            totalProfit += profit;
        });
    });

    document.getElementById("reportSales").textContent = "Rp " + formatRupiah(totalSales);
    document.getElementById("reportTransactions").textContent = filteredTransactions.length;
    document.getElementById("reportProfit").textContent = "Rp " + formatRupiah(totalProfit);
    document.getElementById("reportItems").textContent = totalItems;

    displayReportTable(filteredTransactions);
}

// ===============================
// TABEL RIWAYAT TRANSAKSI
// ===============================
function displayReportTable(reportTransactions) {
    const table = document.getElementById("reportTable");
    const emptyReport = document.getElementById("emptyReport");

    if (!table) return;
    table.innerHTML = "";

    if (reportTransactions.length === 0) {
        if (emptyReport) emptyReport.style.display = "block";
        return;
    }

    if (emptyReport) emptyReport.style.display = "none";

    const reversedTransactions = [...reportTransactions].reverse();

    reversedTransactions.forEach((transaction, index) => {
        let itemCount = 0;
        let profit = 0;

        transaction.items.forEach(item => {
            itemCount += item.quantity;
            profit += (item.price - item.buyPrice) * item.quantity;
        });

        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleString("id-ID");

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>#${transaction.id}</td>
            <td>${formattedDate}</td>
            <td>${itemCount}</td>
            <td>Rp ${formatRupiah(transaction.total)}</td>
            <td class="profit-positive">Rp ${formatRupiah(profit)}</td>
        `;

        table.appendChild(row);
    });
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
updateReport();