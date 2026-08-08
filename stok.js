/* =========================================================
   WARUNG GENZ
   STOK JAVASCRIPT
========================================================= */


/* =========================================================
   DATA
========================================================= */

let products = [];

let currentPage = 0;

let totalPages = 0;



/* =========================================================
   AMBIL PRODUK
========================================================= */

function getProducts() {

    products =
        JSON.parse(
            localStorage.getItem("products")
        ) || [];

    return products;

}



/* =========================================================
   FORMAT ANGKA
========================================================= */

function formatNumber(number) {

    return Number(number || 0)
        .toLocaleString("id-ID");

}



/* =========================================================
   STATUS STOK
========================================================= */

function getStockStatus(product) {

    const stock =
        Number(product.stock || 0);

    const minStock =
        Number(product.minStock || 0);


    if (stock <= 0) {

        return {

            className: "status-empty",

            icon: "fa-solid fa-circle-xmark",

            text: "Habis"

        };

    }


    if (stock <= minStock) {

        return {

            className: "status-low",

            icon:
                "fa-solid fa-triangle-exclamation",

            text: "Menipis"

        };

    }


    return {

        className: "status-safe",

        icon:
            "fa-solid fa-circle-check",

        text: "Aman"

    };

}



/* =========================================================
   RINGKASAN
========================================================= */

function displayStockSummary() {

    const data =
        getProducts();


    let safe = 0;

    let low = 0;

    let empty = 0;


    data.forEach(function(product) {

        const stock =
            Number(product.stock || 0);

        const minStock =
            Number(product.minStock || 0);


        if (stock <= 0) {

            empty++;

        }

        else if (stock <= minStock) {

            low++;

        }

        else {

            safe++;

        }

    });


    const total =
        document.getElementById(
            "stockTotalProducts"
        );


    const safeElement =
        document.getElementById(
            "stockSafe"
        );


    const lowElement =
        document.getElementById(
            "stockLow"
        );


    const emptyElement =
        document.getElementById(
            "stockEmpty"
        );


    if (total) {

        total.textContent =
            data.length;

    }


    if (safeElement) {

        safeElement.textContent =
            safe;

    }


    if (lowElement) {

        lowElement.textContent =
            low;

    }


    if (emptyElement) {

        emptyElement.textContent =
            empty;

    }

}



/* =========================================================
   BUAT KARTU
========================================================= */

function createStockCard(product) {

    const stock =
        Number(product.stock || 0);


    const minStock =
        Number(product.minStock || 0);


    const status =
        getStockStatus(product);


    const card =
        document.createElement("div");


    card.className =
        "stock-card";


    /* HEADER */

    const header =
        document.createElement("div");


    header.className =
        "stock-card-header";


    /* ICON */

    const icon =
        document.createElement("div");


    icon.className =
        "stock-product-icon";


    icon.innerHTML =
        '<i class="fa-solid fa-box"></i>';


    /* STATUS */

    const statusElement =
        document.createElement("span");


    statusElement.className =
        "stock-status " +
        status.className;


    statusElement.innerHTML =
        '<i class="' +
        status.icon +
        '"></i> ' +
        status.text;


    header.appendChild(icon);

    header.appendChild(statusElement);



    /* BODY */

    const body =
        document.createElement("div");


    body.className =
        "stock-card-body";


    const name =
        document.createElement("h3");


    name.textContent =
        product.name ||
        "Produk Tanpa Nama";


    const category =
        document.createElement("p");


    category.className =
        "stock-category";


    category.textContent =
        product.category ||
        "Tanpa kategori";



    /* STOCK VALUE */

    const stockValue =
        document.createElement("div");


    stockValue.className =
        "stock-value";


    const label =
        document.createElement("span");


    label.textContent =
        "Jumlah Stok";


    const number =
        document.createElement("strong");


    number.textContent =
        formatNumber(stock);


    const unit =
        document.createElement("small");


    unit.textContent =
        " pcs";


    number.appendChild(unit);


    stockValue.appendChild(label);

    stockValue.appendChild(number);


    body.appendChild(name);

    body.appendChild(category);

    body.appendChild(stockValue);



    /* FOOTER */

    const footer =
        document.createElement("div");


    footer.className =
        "stock-card-footer";


    const minimumLabel =
        document.createElement("span");


    minimumLabel.textContent =
        "Minimum stok";


    const minimum =
        document.createElement("strong");


    minimum.textContent =
        formatNumber(minStock) +
        " pcs";


    footer.appendChild(
        minimumLabel
    );


    footer.appendChild(
        minimum
    );


    /* GABUNG */

    card.appendChild(header);

    card.appendChild(body);

    card.appendChild(footer);


    return card;

}



/* =========================================================
   JUMLAH PRODUK PER HALAMAN
========================================================= */

function getProductsPerPage() {

    if (
        window.innerWidth <= 600
    ) {

        return 6;

    }


    return 9;

}



/* =========================================================
   BUAT HALAMAN
========================================================= */

function renderStockPages(data) {

    const slider =
        document.getElementById(
            "stockSlider"
        );


    if (!slider) {

        return;

    }


    slider.innerHTML =
        "";


    const perPage =
        getProductsPerPage();


    totalPages =
        Math.ceil(
            data.length /
            perPage
        );


    if (totalPages === 0) {

        currentPage = 0;

        updateNavigation();

        return;

    }


    if (
        currentPage >= totalPages
    ) {

        currentPage =
            totalPages - 1;

    }


    /* =====================================
       BUAT HALAMAN
    ====================================== */

    for (
        let i = 0;
        i < totalPages;
        i++
    ) {


        const page =
            document.createElement("div");


        page.className =
            "stock-page";


        const start =
            i * perPage;


        const end =
            start + perPage;


        const pageProducts =
            data.slice(
                start,
                end
            );


        pageProducts.forEach(
            function(product) {

                page.appendChild(
                    createStockCard(
                        product
                    )
                );

            }
        );


        slider.appendChild(page);

    }


    /* =====================================
       PAGINATION
    ====================================== */

    renderPagination();


    /* =====================================
       POSISI HALAMAN
    ====================================== */

    setTimeout(
        function() {

            goToPage(
                currentPage,
                false
            );

        },
        0
    );

}



/* =========================================================
   PAGINATION DOT
========================================================= */

function renderPagination() {

    const pagination =
        document.getElementById(
            "stockPagination"
        );


    if (!pagination) {

        return;

    }


    pagination.innerHTML =
        "";


    if (totalPages <= 1) {

        return;

    }


    for (
        let i = 0;
        i < totalPages;
        i++
    ) {

        const dot =
            document.createElement("button");


        dot.type =
            "button";


        dot.className =
            "stock-page-dot";


        if (
            i === currentPage
        ) {

            dot.classList.add(
                "active"
            );

        }


        dot.addEventListener(
            "click",
            function() {

                goToPage(i);

            }
        );


        pagination.appendChild(dot);

    }

}



/* =========================================================
   PINDAH HALAMAN
========================================================= */

function goToPage(
    page,
    smooth = true
) {

    if (
        totalPages <= 0
    ) {

        return;

    }


    currentPage =
        Math.max(
            0,
            Math.min(
                page,
                totalPages - 1
            )
        );


    const slider =
        document.getElementById(
            "stockSlider"
        );


    if (!slider) {

        return;

    }


    const width =
        slider.clientWidth;


    slider.scrollTo({

        left:
            width * currentPage,

        behavior:
            smooth
                ? "smooth"
                : "auto"

    });


    updateNavigation();

}



/* =========================================================
   NAVIGATION
========================================================= */

function updateNavigation() {

    const prev =
        document.getElementById(
            "stockPrev"
        );


    const next =
        document.getElementById(
            "stockNext"
        );


    if (prev) {

        prev.disabled =
            currentPage <= 0;

    }


    if (next) {

        next.disabled =
            currentPage >=
            totalPages - 1;

    }


    const dots =
        document.querySelectorAll(
            ".stock-page-dot"
        );


    dots.forEach(
        function(dot, index) {

            dot.classList.toggle(
                "active",
                index === currentPage
            );

        }
    );

}



/* =========================================================
   DISPLAY STOCK
========================================================= */

function displayStock() {

    const data =
        getProducts();


    const searchInput =
        document.getElementById(
            "stockSearch"
        );


    const keyword =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const filtered =
        data.filter(
            function(product) {

                const name =
                    String(
                        product.name || ""
                    ).toLowerCase();


                const category =
                    String(
                        product.category || ""
                    ).toLowerCase();


                const barcode =
                    String(
                        product.barcode || ""
                    ).toLowerCase();


                return (

                    name.includes(
                        keyword
                    ) ||

                    category.includes(
                        keyword
                    ) ||

                    barcode.includes(
                        keyword
                    )

                );

            }
        );


    const slider =
        document.getElementById(
            "stockSlider"
        );


    const empty =
        document.getElementById(
            "emptyStock"
        );


    if (
        filtered.length === 0
    ) {

        if (slider) {

            slider.style.display =
                "none";

        }


        if (empty) {

            empty.style.display =
                "flex";

        }


        totalPages = 0;

        currentPage = 0;

        updateNavigation();

        return;

    }


    if (slider) {

        slider.style.display =
            "flex";

    }


    if (empty) {

        empty.style.display =
            "none";

    }


    currentPage = 0;


    renderStockPages(
        filtered
    );

}



/* =========================================================
   REFRESH
========================================================= */

function refreshStock() {

    displayStockSummary();

    displayStock();

}



/* =========================================================
   TOMBOL NEXT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {


        /* LOAD */

        refreshStock();


        /* SEARCH */

        const search =
            document.getElementById(
                "stockSearch"
            );


        if (search) {

            search.addEventListener(
                "input",
                function() {

                    currentPage = 0;

                    displayStock();

                }
            );

        }


        /* PREVIOUS */

        const prev =
            document.getElementById(
                "stockPrev"
            );


        if (prev) {

            prev.addEventListener(
                "click",
                function() {

                    goToPage(
                        currentPage - 1
                    );

                }
            );

        }


        /* NEXT */

        const next =
            document.getElementById(
                "stockNext"
            );


        if (next) {

            next.addEventListener(
                "click",
                function() {

                    goToPage(
                        currentPage + 1
                    );

                }
            );

        }


        /* =================================
           SWIPE / SCROLL
        ================================= */

        const slider =
            document.getElementById(
                "stockSlider"
            );


        if (slider) {

            let scrollTimer;


            slider.addEventListener(
                "scroll",
                function() {

                    clearTimeout(
                        scrollTimer
                    );


                    scrollTimer =
                        setTimeout(
                            function() {

                                const width =
                                    slider.clientWidth;


                                if (
                                    width <= 0
                                ) {

                                    return;

                                }


                                currentPage =
                                    Math.round(
                                        slider.scrollLeft /
                                        width
                                    );


                                updateNavigation();

                            },
                            80
                        );

                }
            );

        }


        /* =================================
           RESIZE
        ================================= */

        window.addEventListener(
            "resize",
            function() {

                const oldPage =
                    currentPage;


                displayStock();


                if (
                    totalPages > 0
                ) {

                    currentPage =
                        Math.min(
                            oldPage,
                            totalPages - 1
                        );

                    goToPage(
                        currentPage,
                        false
                    );

                }

            }
        );

    }
);


/* =========================================================
   LOCAL STORAGE BERUBAH
========================================================= */

window.addEventListener(
    "storage",
    function(event) {

        if (
            event.key === "products"
        ) {

            refreshStock();

        }

    }
);


/* =========================================================
   SAAT KEMBALI KE HALAMAN
========================================================= */

window.addEventListener(
    "pageshow",
    function() {

        refreshStock();

    }
);