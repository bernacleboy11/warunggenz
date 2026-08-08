// ===============================
// DATA UTAMA
// ===============================

let products =
    JSON.parse(
        localStorage.getItem("products")
    ) || [];

let transactions =
    JSON.parse(
        localStorage.getItem("transactions")
    ) || [];


// ===============================
// PAGINATION
// ===============================

let currentProductPage = 1;

const PRODUCTS_PER_PAGE = 10;


// ===============================
// MODAL & FORM PRODUK
// ===============================

function openProductModal() {

    document
        .getElementById("productModal")
        .classList.add("show");

    document
        .getElementById("modalTitle")
        .textContent = "Tambah Produk";

    document
        .getElementById("productForm")
        .reset();

    document
        .getElementById("editProductIndex")
        .value = "";
}


function closeProductModal() {

    document
        .getElementById("productModal")
        .classList.remove("show");
}


// ===============================
// SIMPAN PRODUK
// ===============================

document
    .getElementById("productForm")
    ?.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("productName")
                    .value;

            const barcode =
                document
                    .getElementById("productBarcode")
                    .value;

            const category =
                document
                    .getElementById("productCategory")
                    .value;

            const buyPrice =
                Number(
                    document
                        .getElementById("buyPrice")
                        .value
                );

            const sellPrice =
                Number(
                    document
                        .getElementById("sellPrice")
                        .value
                );

            const stock =
                Number(
                    document
                        .getElementById("productStock")
                        .value
                );

            const editIndex =
                document
                    .getElementById("editProductIndex")
                    .value;


            const productData = {

                name,
                barcode,
                category,
                buyPrice,
                sellPrice,
                stock

            };


            // ===============================
            // EDIT PRODUK
            // ===============================

            if (editIndex !== "") {

                products[editIndex] =
                    productData;

            }

            // ===============================
            // TAMBAH PRODUK
            // ===============================

            else {

                products.push(
                    productData
                );

            }


            // ===============================
            // SIMPAN
            // ===============================

            localStorage.setItem(
                "products",
                JSON.stringify(products)
            );


            closeProductModal();

            currentProductPage = 1;

            displayProducts();

            alert(
                "Produk berhasil disimpan!"
            );

        }
    );


// ===============================
// TAMPILKAN PRODUK
// ===============================

function displayProducts(
    resetPage = false
) {

    const table =
        document.getElementById(
            "productTable"
        );

    const emptyProduct =
        document.getElementById(
            "emptyProduct"
        );

    const searchInput =
        document.getElementById(
            "searchProduct"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    if (!table) return;


    if (resetPage) {

        currentProductPage = 1;

    }


    table.innerHTML = "";


    // ===============================
    // FILTER PRODUK
    // ===============================

    const filteredProducts =
        products.filter(
            function(product) {

                const name =
                    String(
                        product.name || ""
                    )
                    .toLowerCase();

                const barcode =
                    String(
                        product.barcode || ""
                    )
                    .toLowerCase();


                return (
                    name.includes(search) ||
                    barcode.includes(search)
                );

            }
        );


    // ===============================
    // TIDAK ADA PRODUK
    // ===============================

    if (
        filteredProducts.length === 0
    ) {

        if (emptyProduct) {

            emptyProduct.style.display =
                "block";

        }


        renderProductPagination(
            0,
            0
        );

        return;

    }


    if (emptyProduct) {

        emptyProduct.style.display =
            "none";

    }


    // ===============================
    // TOTAL HALAMAN
    // ===============================

    const totalPages =
        Math.ceil(
            filteredProducts.length /
            PRODUCTS_PER_PAGE
        );


    // Jika halaman melebihi jumlah halaman
    if (
        currentProductPage >
        totalPages
    ) {

        currentProductPage =
            totalPages;

    }


    // ===============================
    // DATA HALAMAN SEKARANG
    // ===============================

    const startIndex =
        (
            currentProductPage - 1
        ) *
        PRODUCTS_PER_PAGE;


    const pageProducts =
        filteredProducts.slice(
            startIndex,
            startIndex +
            PRODUCTS_PER_PAGE
        );


    // ===============================
    // TAMPILKAN PRODUK
    // ===============================

    pageProducts.forEach(
        function(product, pageIndex) {


            const originalIndex =
                products.indexOf(
                    product
                );


            const stockClass =
                Number(
                    product.stock || 0
                ) <= 5
                    ? "stock-low"
                    : "stock-good";


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td data-label="No">
                    ${
                        startIndex +
                        pageIndex +
                        1
                    }
                </td>


                <td
                    data-label="Nama Produk"
                    class="product-name"
                >
                    ${
                        product.name ||
                        "-"
                    }
                </td>


                <td data-label="Kategori">
                    ${
                        product.category ||
                        "-"
                    }
                </td>


                <td data-label="Harga Beli">
                    Rp ${
                        formatRupiah(
                            product.buyPrice
                        )
                    }
                </td>


                <td data-label="Harga Jual">
                    Rp ${
                        formatRupiah(
                            product.sellPrice
                        )
                    }
                </td>


                <td
                    data-label="Stok"
                    class="${stockClass}"
                >
                    ${
                        product.stock || 0
                    }
                </td>


                <td
                    data-label="Aksi"
                    class="product-actions-cell"
                >

                    <button
                        class="action-button edit-button"
                        onclick="editProduct(${originalIndex})"
                        title="Edit produk"
                    >

                        <i
                            class="fa-solid fa-pen"
                        ></i>

                    </button>


                    <button
                        class="action-button delete-button"
                        onclick="deleteProduct(${originalIndex})"
                        title="Hapus produk"
                    >

                        <i
                            class="fa-solid fa-trash"
                        ></i>

                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );


    // ===============================
    // PAGINATION
    // ===============================

    renderProductPagination(
        filteredProducts.length,
        totalPages
    );

}


// ===============================
// PAGINATION UI
// ===============================

function renderProductPagination(
    totalItems,
    totalPages
) {

    let pagination =
        document.getElementById(
            "productPagination"
        );


    const container =
        document.querySelector(
            ".product-table-container"
        );


    if (!container) return;


    // ===============================
    // BUAT CONTAINER PAGINATION
    // ===============================

    if (!pagination) {

        pagination =
            document.createElement(
                "div"
            );

        pagination.id =
            "productPagination";

        pagination.className =
            "product-pagination";


        container.appendChild(
            pagination
        );

    }


    pagination.innerHTML = "";


    // ===============================
    // JIKA HANYA 1 HALAMAN
    // ===============================

    if (
        totalItems <=
        PRODUCTS_PER_PAGE
    ) {

        pagination.style.display =
            "none";

        return;

    }


    pagination.style.display =
        "flex";


    // ===============================
    // TOMBOL SEBELUMNYA
    // ===============================

    const previousButton =
        document.createElement(
            "button"
        );


    previousButton.className =
        "pagination-button";


    previousButton.innerHTML =
        `
            <i
                class="fa-solid fa-chevron-left"
            ></i>
        `;


    previousButton.disabled =
        currentProductPage === 1;


    previousButton.onclick =
        function() {

            if (
                currentProductPage > 1
            ) {

                currentProductPage--;

                displayProducts();

            }

        };


    pagination.appendChild(
        previousButton
    );


    // ===============================
    // NOMOR HALAMAN
    // ===============================

    const maxVisiblePages = 5;


    let startPage =
        Math.max(
            1,
            currentProductPage -
            Math.floor(
                maxVisiblePages / 2
            )
        );


    let endPage =
        Math.min(
            totalPages,
            startPage +
            maxVisiblePages -
            1
        );


    if (
        endPage -
        startPage +
        1 <
        maxVisiblePages
    ) {

        startPage =
            Math.max(
                1,
                endPage -
                maxVisiblePages +
                1
            );

    }


    for (
        let page = startPage;
        page <= endPage;
        page++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.className =
            "pagination-button" +
            (
                page ===
                currentProductPage
                    ? " active"
                    : ""
            );


        button.textContent =
            page;


        button.onclick =
            function() {

                currentProductPage =
                    page;

                displayProducts();

            };


        pagination.appendChild(
            button
        );

    }


    // ===============================
    // TOMBOL BERIKUTNYA
    // ===============================

    const nextButton =
        document.createElement(
            "button"
        );


    nextButton.className =
        "pagination-button";


    nextButton.innerHTML =
        `
            <i
                class="fa-solid fa-chevron-right"
            ></i>
        `;


    nextButton.disabled =
        currentProductPage ===
        totalPages;


    nextButton.onclick =
        function() {

            if (
                currentProductPage <
                totalPages
            ) {

                currentProductPage++;

                displayProducts();

            }

        };


    pagination.appendChild(
        nextButton
    );


    // ===============================
    // INFO PRODUK
    // ===============================

    const info =
        document.createElement(
            "span"
        );


    info.className =
        "pagination-info";


    info.textContent =
        `${totalItems} produk • Halaman ${currentProductPage}/${totalPages}`;


    pagination.appendChild(
        info
    );

}


// ===============================
// EDIT PRODUK
// ===============================

function editProduct(index) {

    const product =
        products[index];


    document
        .getElementById("productModal")
        .classList.add("show");


    document
        .getElementById("modalTitle")
        .textContent =
        "Edit Produk";


    document
        .getElementById("productName")
        .value =
        product.name;


    document
        .getElementById("productBarcode")
        .value =
        product.barcode || "";


    document
        .getElementById("productCategory")
        .value =
        product.category;


    document
        .getElementById("buyPrice")
        .value =
        product.buyPrice;


    document
        .getElementById("sellPrice")
        .value =
        product.sellPrice;


    document
        .getElementById("productStock")
        .value =
        product.stock;


    document
        .getElementById("editProductIndex")
        .value =
        index;

}


// ===============================
// HAPUS PRODUK
// ===============================

function deleteProduct(index) {

    if (
        confirm(
            "Apakah kamu yakin ingin menghapus produk ini?"
        )
    ) {

        products.splice(
            index,
            1
        );


        localStorage.setItem(
            "products",
            JSON.stringify(products)
        );


        displayProducts();


        alert(
            "Produk berhasil dihapus!"
        );

    }

}


// ===============================
// IMPORT & EXPORT DATA
// ===============================

function exportData() {

    const backupData = {

        products:
            products,

        transactions:
            transactions,

        exportDate:
            new Date().toISOString()

    };


    const dataString =
        JSON.stringify(
            backupData,
            null,
            2
        );


    const blob =
        new Blob(
            [dataString],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "backup-warung-genz.json";


    document
        .body
        .appendChild(
            link
        );


    link.click();


    document
        .body
        .removeChild(
            link
        );


    URL.revokeObjectURL(
        url
    );

}


// ===============================
// IMPORT DATA
// ===============================

function importData(event) {

    const file =
        event.target.files[0];


    if (!file) return;


    const reader =
        new FileReader();


    reader.onload =
        function(e) {

            try {

                const importedData =
                    JSON.parse(
                        e.target.result
                    );


                if (
                    !importedData.products ||
                    !Array.isArray(
                        importedData.products
                    )
                ) {

                    return alert(
                        "File backup tidak valid!"
                    );

                }


                const choice =
                    prompt(
                        "Pilih tindakan:\n\n" +
                        "1 = Gabungkan Data\n" +
                        "2 = Ganti Semua Data\n" +
                        "3 = Batal"
                    );


                // ===============================
                // GANTI SEMUA DATA
                // ===============================

                if (
                    choice === "2"
                ) {

                    products =
                        importedData.products;


                    localStorage.setItem(
                        "products",
                        JSON.stringify(
                            products
                        )
                    );


                    alert(
                        "Semua data berhasil diganti!"
                    );

                }


                // ===============================
                // GABUNGKAN DATA
                // ===============================

                else if (
                    choice === "1"
                ) {

                    importedData
                        .products
                        .forEach(
                            function(
                                importedProduct
                            ) {

                                const existingProduct =
                                    products.find(
                                        function(p) {

                                            return (
                                                p.barcode ===
                                                importedProduct.barcode
                                            );

                                        }
                                    );


                                if (
                                    existingProduct
                                ) {

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
                        JSON.stringify(
                            products
                        )
                    );


                    alert(
                        "Data berhasil digabungkan!"
                    );

                }


                else {

                    return;

                }


                currentProductPage = 1;

                displayProducts();

            }

            catch (error) {

                alert(
                    "File tidak dapat dibaca!"
                );

            }

        };


    reader.readAsText(
        file
    );


    event.target.value = "";

}


// ===============================
// SEARCH PRODUK
// ===============================

document
    .getElementById("searchProduct")
    ?.addEventListener(
        "input",
        function() {

            currentProductPage = 1;

            displayProducts();

        }
    );


// ===============================
// HELPER
// ===============================

function formatRupiah(number) {

    return (
        Number(number || 0)
            .toLocaleString("id-ID")
    );

}


// ===============================
// SIDEBAR
// ===============================

function toggleSidebar() {

    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    if (sidebar) {

        sidebar.classList.toggle(
            "show"
        );

    }

}


// ===============================
// INISIALISASI
// ===============================

displayProducts();