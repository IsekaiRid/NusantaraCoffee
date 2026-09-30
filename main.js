// ===== DATA SPESIALIS KOPI GAYO =====

const products = [
    {
        id: 1,
        name: "Kopi Gayo Single Origin (250g)",
        category: "Gram",
        weight: "250g",
        price: 75000,
        rating: 4.9,
        reviewCount: 128,
        image: "assets/gayo.png",
        description: "Biji/Bubuk Kopi Gayo pilihan dengan aroma fruity dan acidity seimbang."
    },
    {
        id: 2,
        name: "Kopi Gayo Single Origin (500g)",
        category: "Gram",
        weight: "500g",
        price: 140000,
        rating: 4.9,
        reviewCount: 95,
        image: "assets/gayo.png",
        description: "Ukuran medium hemat untuk konsumsi mingguan penikmat kopi V60/Manual Brew."
    },
    {
        id: 3,
        name: "Kopi Gayo Specialty Grade (1 kg)",
        category: "Kilogram",
        weight: "1 kg",
        price: 260000,
        rating: 5.0,
        reviewCount: 210,
        image: "assets/gayo.png",
        description: "Kemasan 1 KG cocok untuk kebutuhan Kedai Kopi, Cafe, atau stok bulanan rumah."
    },
    {
        id: 4,
        name: "Kopi Gayo Wine Process / Fermentation (250g)",
        category: "Gram",
        weight: "250g",
        price: 95000,
        rating: 4.8,
        reviewCount: 64,
        image: "assets/gayo.png",
        description: "Proses fermentasi alami yang menghasilkan aroma anggur khas dan rasa manis tajam."
    },
    {
        id: 5,
        name: "Kopi Gayo Honey Process (250g)",
        category: "Gram",
        weight: "250g",
        price: 85000,
        rating: 4.7,
        reviewCount: 42,
        image: "assets/gayo.png",
        description: "Sensasi manis alami yang lembut dengan tingkat keasaman sedang."
    },
    {
        id: 6,
        name: "Kopi Gayo Bulk Pack (5 kg)",
        category: "Kilogram",
        weight: "5 kg",
        price: 1200000,
        rating: 4.9,
        reviewCount: 38,
        image: "assets/gayo.png",
        description: "Paket usaha Grosir 5 KG khusus roastery, cafe, dan reseller."
    }
];

const promos = [
    {
        id: 1,
        name: "Beli 2 Pcs Kopi Gayo 250g – Diskon 15%",
        productId: 1,
        minQty: 2,
        type: "percent",
        value: 15,
        active: true
    },
    {
        id: 2,
        name: "Grosir Kopi Gayo 1 KG – Hemat Rp 20.000",
        productId: 3,
        minQty: 1,
        type: "fixed",
        value: 20000,
        active: true
    },
    {
        id: 3,
        name: "Paket Coba Gayo Wine Process – Potongan Rp 15.000",
        productId: 4,
        minQty: 1,
        type: "fixed",
        value: 15000,
        active: true
    }
];

const defaultReviews = [
    {
        name: "Andi P.",
        product: "Kopi Gayo Single Origin (250g)",
        rating: 5,
        text: "Aromanya kuat, rasa balance antara asam manisnya. Cocok buat seduh V60 tiap pagi.",
        date: "12 Sep 2026"
    },
    {
        name: "Siti R.",
        product: "Kopi Gayo Specialty Grade (1 kg)",
        rating: 5,
        text: "Beli kemasan 1 kg buat cafe, roast date-nya segar banget. Pelanggan pada suka!",
        date: "5 Sep 2026"
    },
    {
        name: "Budi S.",
        product: "Kopi Gayo Wine Process (250g)",
        rating: 5,
        text: "Rasa fruity dan aroma wine-nya dapet banget. Unik dan nagih!",
        date: "28 Agu 2026"
    },
    {
        name: "Rizky H.",
        product: "Kopi Gayo Single Origin (250g)",
        rating: 5,
        text: "Promo beli 2 hemat banget. Kualitas Kopi Gayo tetap premium seratus persen.",
        date: "15 Agu 2026"
    },
    {
        name: "Dewi A.",
        product: "Kopi Gayo Specialty Grade (1 kg)",
        rating: 4,
        text: "Pengiriman cepat, kemasan vacuum rapat. Sangat recommended untuk stok bulanan!",
        date: "8 Agu 2026"
    }
];

// Gabungkan ulasan default + ulasan user dari localStorage
function loadReviews() {
    try {
        const stored = JSON.parse(localStorage.getItem("nc_user_reviews") || "[]");
        return [...stored, ...defaultReviews];
    } catch {
        return [...defaultReviews];
    }
}

let reviews = loadReviews();
let cart = [];
let activeOrders = JSON.parse(sessionStorage.getItem("nc_active_orders") || "[]");

// ===== HELPERS =====
const formatPrice = (price) => `Rp ${price.toLocaleString("id-ID")}`;
const randBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const formatDateID = (ts) => new Date(ts).toLocaleDateString("id-ID", {
    weekday: "short", day: "numeric", month: "short", year: "numeric"
});

function formatReviewDate(ts) {
    return new Date(ts).toLocaleDateString("id-ID", {
        day: "numeric", month: "short", year: "numeric"
    });
}

let toastTimer = null;
function showToast(message) {
    $(".toast").remove();
    clearTimeout(toastTimer);
    const $toast = $('<div class="toast"></div>').text(message).appendTo("body");
    toastTimer = setTimeout(() => {
        $toast.css({ opacity: 0, transition: "opacity 0.3s" });
        setTimeout(() => $toast.remove(), 300);
    }, 2500);
}

let shakeTimer = null;
function shakeCart() {
    const $target = $("#cartIcon").length ? $("#cartIcon") : $("#cartBtn");
    $target.removeClass("animate-cart-shake");
    void $target[0]?.offsetWidth;
    $target.addClass("animate-cart-shake");
    const $badge = $("#cartCount");
    if ($badge.length) {
        $badge.removeClass("animate-badge-pop");
        void $badge[0].offsetWidth;
        $badge.addClass("animate-badge-pop");
    }
    clearTimeout(shakeTimer);
    shakeTimer = setTimeout(() => {
        $target.removeClass("animate-cart-shake");
        $badge.removeClass("animate-badge-pop");
    }, 700);
}

function notify(message) {
    $("#navbar").removeClass("navbar-hidden");
    shakeCart();
    showToast(message);
}

function openModal($modal) {
    if (!$modal?.length) return;
    $modal.addClass("active");
    $("body").css("overflow", "hidden");
}
function closeModal($modal) {
    if (!$modal?.length) return;
    $modal.removeClass("active");
    if (!$(".modal.active").length) $("body").css("overflow", "");
}
function closeAllModals() {
    closeModal($("#cartModal"));
    closeModal($("#checkoutModal"));
    closeModal($("#trackingModal"));
}

// ===== PROMO =====
function getApplicablePromos() {
    return promos.filter(p => p.active);
}

function calcItemDiscount(item) {
    const rules = getApplicablePromos().filter(p => p.productId === item.id && item.quantity >= p.minQty);
    if (!rules.length) return { discount: 0, applied: null };
    let best = { discount: 0, applied: null };
    rules.forEach(rule => {
        const subtotal = item.price * item.quantity;
        let disc = rule.type === "percent"
            ? Math.round(subtotal * (rule.value / 100))
            : rule.value;
        disc = Math.min(disc, subtotal);
        if (disc > best.discount) best = { discount: disc, applied: rule };
    });
    return best;
}

function calcCartTotals() {
    let subtotal = 0, totalDiscount = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        totalDiscount += calcItemDiscount(item).discount;
    });
    return { subtotal, totalDiscount, total: Math.max(0, subtotal - totalDiscount) };
}

// ===== STARS =====
function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let html = "";
    for (let i = 0; i < 5; i++) {
        if (i < full) html += '<i class="fas fa-star text-amber-500 text-xs"></i>';
        else if (i === full && half) html += '<i class="fas fa-star-half-alt text-amber-500 text-xs"></i>';
        else html += '<i class="far fa-star text-amber-500 text-xs"></i>';
    }
    return html;
}

// ===== PRODUCTS =====
function renderProducts() {
    const $grid = $("#productGrid");
    if (!$grid.length) return;
    $grid.html(products.map(product => {
        const promo = getApplicablePromos().find(p => p.productId === product.id);
        const badge = promo
            ? `<span class="absolute top-3 left-3 bg-amber-700 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">Promo</span>`
            : "";
        return `
        <article class="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="relative overflow-hidden bg-stone-100">
                ${badge}
                <img src="${product.image}" alt="${product.name}" loading="lazy"
                    class="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105">
            </div>
            <div class="p-5">
                <h3 class="text-lg font-semibold text-stone-800 leading-snug min-h-[3.5rem]">${product.name}</h3>
                <div class="flex items-center gap-1.5 mt-2">
                    ${renderStars(product.rating)}
                    <span class="text-xs text-stone-500 ml-1">${product.rating} (${product.reviewCount})</span>
                </div>
                ${promo ? `<p class="text-xs text-amber-800 font-medium mt-2">${promo.name}</p>` : ""}
                <div class="mt-3 mb-5"><span class="text-xl font-bold text-amber-900">${formatPrice(product.price)}</span></div>
                <button type="button" data-add-to-cart="${product.id}"
                    class="w-full bg-amber-800 hover:bg-amber-900 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200">
                    <i class="fas fa-cart-plus mr-2"></i>Tambah ke Keranjang
                </button>
            </div>
        </article>`;
    }).join(""));
}

// ===== REVIEWS =====
function populateReviewProductSelect() {
    const $select = $('[name="reviewProduct"]');
    if (!$select.length) return;
    const options = products.map(p => `<option value="${p.name}">${p.name}</option>`).join("");
    $select.html(`<option value="">-- Pilih produk --</option>${options}`);
}

function renderReviews() {
    const $grid = $("#reviewsGrid");
    if (!$grid.length) return;
    $grid.html(reviews.map(r => `
        <div class="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition">
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">${r.name.charAt(0)}</div>
                    <div>
                        <p class="font-semibold text-stone-800 text-sm">${r.name}</p>
                        <p class="text-xs text-stone-400">${r.date}</p>
                    </div>
                </div>
                <div class="flex gap-0.5">${renderStars(r.rating)}</div>
            </div>
            <p class="text-xs text-amber-800 font-medium mb-2">${r.product}</p>
            <p class="text-sm text-stone-600 leading-relaxed">"${r.text}"</p>
        </div>
    `).join(""));
}

function saveUserReview(review) {
    try {
        const stored = JSON.parse(localStorage.getItem("nc_user_reviews") || "[]");
        stored.unshift(review);
        // Batasi max 50 ulasan user
        if (stored.length > 50) stored.length = 50;
        localStorage.setItem("nc_user_reviews", JSON.stringify(stored));
    } catch (e) {
        console.warn("Gagal menyimpan ulasan:", e);
    }
}

function handleReviewSubmit(e) {
    e.preventDefault();
    const $form = $(e.target);
    const name = $.trim($form.find('[name="reviewName"]').val());
    const product = $form.find('[name="reviewProduct"]').val();
    const rating = Number($form.find('[name="reviewRating"]:checked').val());
    const text = $.trim($form.find('[name="reviewText"]').val());

    if (!name || !product || !rating || !text) {
        notify("Lengkapi semua field ulasan terlebih dahulu.");
        return;
    }
    if (text.length < 10) {
        notify("Ulasan minimal 10 karakter.");
        return;
    }

    const newReview = {
        name: name.length > 40 ? name.slice(0, 40) : name,
        product,
        rating,
        text: text.length > 300 ? text.slice(0, 300) : text,
        date: formatReviewDate(Date.now())
    };

    reviews.unshift(newReview);
    saveUserReview(newReview);
    renderReviews();
    $form[0].reset();
    notify("Terima kasih! Ulasan Anda berhasil dikirim.");
}

// ===== CART =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existing = cart.find(i => i.id === productId);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    updateCartUI();
    const item = cart.find(i => i.id === productId);
    const { applied } = calcItemDiscount(item);
    notify(applied ? `Promo aktif! ${applied.name}` : `"${product.name}" berhasil ditambahkan ke keranjang.`);
}

window.updateQuantity = function (productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.quantity += change;
    if (item.quantity <= 0) cart = cart.filter(i => i.id !== productId);
    updateCartUI();
};

function updateCartUI() {
    const $count = $("#cartCount");
    const $list = $("#cartItemsList");
    const $total = $("#cartTotalPrice");
    if (!$count.length || !$list.length || !$total.length) return;

    $count.text(cart.reduce((s, i) => s + i.quantity, 0));

    if (!cart.length) {
        $list.html(`
            <div class="py-8 text-center">
                <i class="fas fa-mug-hot text-4xl text-stone-300 mb-3"></i>
                <p class="text-stone-500">Keranjang belanja kopi masih kosong.</p>
            </div>`);
        $total.text("Rp 0");
        return;
    }

    const { subtotal, totalDiscount, total } = calcCartTotals();

    $list.html(cart.map(item => {
        const { discount, applied } = calcItemDiscount(item);
        const lineTotal = item.price * item.quantity;
        const finalLine = lineTotal - discount;
        return `
        <div class="py-4 flex justify-between items-start gap-4">
            <div class="min-w-0 flex-1">
                <h4 class="font-semibold text-stone-800 text-sm truncate">${item.name}</h4>
                <p class="text-xs text-stone-500 mt-0.5">${formatPrice(item.price)} × ${item.quantity}</p>
                ${applied ? `<p class="text-xs text-amber-700 font-medium mt-1"><i class="fas fa-tag mr-1"></i>${applied.name} (−${formatPrice(discount)})</p>` : ""}
                <div class="flex items-center gap-2 mt-2">
                    <button type="button" onclick="updateQuantity(${item.id}, -1)" class="w-7 h-7 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md font-bold flex items-center justify-center transition">−</button>
                    <span class="text-sm font-semibold text-stone-700 w-6 text-center">${item.quantity}</span>
                    <button type="button" onclick="updateQuantity(${item.id}, 1)" class="w-7 h-7 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md font-bold flex items-center justify-center transition">+</button>
                </div>
            </div>
            <div class="text-right">
                ${discount > 0
                ? `<p class="text-xs text-stone-400 line-through">${formatPrice(lineTotal)}</p><strong class="text-amber-900 text-sm">${formatPrice(finalLine)}</strong>`
                : `<strong class="text-amber-900 text-sm">${formatPrice(lineTotal)}</strong>`}
            </div>
        </div>`;
    }).join(""));

    if (totalDiscount > 0) {
        $total.html(`
            <div class="text-right">
                <p class="text-xs text-stone-400 line-through">${formatPrice(subtotal)}</p>
                <p class="text-xs text-amber-700 font-medium">Hemat ${formatPrice(totalDiscount)}</p>
                <span class="font-bold text-xl text-amber-900">${formatPrice(total)}</span>
            </div>`);
    } else {
        $total.text(formatPrice(total));
    }
}

// ===== TRACKING =====
function getOrderProgress(order) {
    const elapsedMs = Date.now() - order.createdAt;
    const elapsedHours = elapsedMs / (1000 * 60 * 60);
    const etaDays = order.etaDays || 4;
    const etaHours = etaDays * 24;

    if (elapsedHours < 1) return 0;
    if (elapsedHours < etaHours * 0.25) return 1;
    if (elapsedHours < etaHours) return 2;
    return 3;
}

function buildOrderCard(order) {
    const progress = getOrderProgress(order);
    const etaDays = order.etaDays ?? 4;
    const etaDate = order.createdAt + etaDays * 86400000;
    const statusLabels = ["Diproses", "Packing", "Kurir", "Tiba di Tujuan"];

    const steps = [
        { icon: "fa-clipboard-check", title: "Pesanan Diproses", desc: "Pesanan diterima & sedang disiapkan di roasting house" },
        { icon: "fa-box", title: "Sedang Dikemas (Packing)", desc: "Kopi dikemas vakum untuk menjaga kesegaran" },
        { icon: "fa-truck-fast", title: "Dalam Pengiriman (Kurir)", desc: `Menuju: ${order.address}` },
        {
            icon: "fa-house-chimney",
            title: "Tiba di Tujuan",
            desc: progress >= 3
                ? "Paket telah sampai di alamat tujuan"
                : `Estimasi ${formatDateID(etaDate)} (±${etaDays} hari)`
        }
    ];

    const stepsHTML = steps.map((s, i) => {
        const done = i < progress;
        const active = i === progress;
        const pending = i > progress;
        const color = pending ? "text-stone-400" : "text-amber-800";
        const bg = pending ? "bg-stone-100" : "bg-amber-100";
        const line = i < steps.length - 1
            ? `<div class="w-0.5 h-6 ml-[1.1rem] ${done ? "bg-amber-600" : "bg-stone-200"}"></div>`
            : "";

        let badge = "";
        if (active) badge = `<span class="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full ml-2">Sedang berlangsung</span>`;
        if (done) badge = `<span class="text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full ml-2">Selesai</span>`;

        return `
        <div>
            <div class="flex gap-4 items-start">
                <div class="flex flex-col items-center">
                    <div class="w-9 h-9 rounded-full ${bg} flex items-center justify-center">
                        <i class="fas ${s.icon} ${color}"></i>
                    </div>
                    ${line}
                </div>
                <div class="pb-2">
                    <h4 class="font-semibold text-sm ${color} flex items-center flex-wrap">${s.title}${badge}</h4>
                    <p class="text-xs text-stone-500 mt-0.5">${s.desc}</p>
                </div>
            </div>
        </div>`;
    }).join("");

    return `
    <div class="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div class="bg-amber-50 px-5 py-4 flex flex-wrap justify-between gap-3 items-center">
            <div>
                <p class="text-xs text-stone-500">Penerima</p>
                <p class="font-bold text-amber-900">${order.name}</p>
            </div>
            <div class="text-right">
                <p class="text-xs text-stone-500">Status saat ini</p>
                <p class="font-semibold text-amber-900">
                    <i class="fas fa-circle text-[8px] mr-1 ${progress >= 3 ? "text-green-500" : "text-amber-500"}"></i>
                    ${statusLabels[progress]}
                </p>
            </div>
        </div>
        <div class="px-5 py-4 border-b border-stone-100">
            <p class="text-xs text-stone-500 mb-1">Alamat tujuan</p>
            <p class="text-sm text-stone-700 font-medium"><i class="fas fa-map-marker-alt text-amber-700 mr-1"></i>${order.address}</p>
        </div>
        <div class="px-5 py-5">${stepsHTML}</div>
        <div class="px-5 pb-5">
            <div class="bg-stone-50 rounded-lg px-4 py-3 text-sm text-stone-600 flex items-center gap-3">
                <i class="fas fa-info-circle text-amber-700"></i>
                <span>Resi: <strong>${order.code}</strong> · Total: <strong>${formatPrice(order.total)}</strong> · Estimasi ${etaDays} hari</span>
            </div>
        </div>
    </div>`;
}

function renderTracking() {
    const $empty = $("#trackingEmpty");
    const $active = $("#trackingActive");
    if (!$empty.length || !$active.length) return;

    if (!activeOrders.length) {
        $empty.removeClass("hidden");
        $active.addClass("hidden").empty();
        return;
    }
    $empty.addClass("hidden");
    $active.removeClass("hidden").html(activeOrders.map(buildOrderCard).join(""));
}

// ===== HERO CAROUSEL =====
function initHeroCarousel() {
    const $slides = $(".hero-slide");
    const $dots = $(".hero-dot");
    if (!$slides.length) return;

    let currentIndex = 0;
    let timer = null;
    const DELAY = 5000;

    function showSlide(index) {
        if (index >= $slides.length) index = 0;
        if (index < 0) index = $slides.length - 1;
        currentIndex = index;
        $slides.each(function (i) {
            const on = i === currentIndex;
            $(this).toggleClass("opacity-100", on).toggleClass("opacity-0", !on).css("z-index", on ? 1 : 0);
        });
        $dots.each(function (i) {
            const on = i === currentIndex;
            $(this).toggleClass("bg-white scale-125", on).toggleClass("bg-white/50", !on);
        });
    }

    const next = () => showSlide(currentIndex + 1);
    const prev = () => showSlide(currentIndex - 1);
    const stop = () => clearInterval(timer);
    const start = () => { stop(); timer = setInterval(next, DELAY); };

    $("#heroNext").on("click", () => { next(); start(); });
    $("#heroPrev").on("click", () => { prev(); start(); });
    $dots.on("click", function () {
        showSlide(parseInt($(this).data("index"), 10));
        start();
    });
    $("#heroCarousel").on("mouseenter", stop).on("mouseleave", start);
    showSlide(0);
    start();
}

// ===== READY =====
$(function () {
    let lastScrollY = window.scrollY;
    const $navbar = $("#navbar");

    $(window).on("scroll", function () {
        const y = window.scrollY;
        if (y > lastScrollY && y > 100) $navbar.addClass("navbar-hidden");
        else $navbar.removeClass("navbar-hidden");
        lastScrollY = y;
    });
    $(window).on("focus", () => $navbar.removeClass("navbar-hidden"));
    $(document).on("visibilitychange", () => {
        if (!document.hidden) $navbar.removeClass("navbar-hidden");
    });

    function toggleSidebar() {
        $("#sidebar").toggleClass("active");
        $("#sidebarOverlay").toggleClass("active");
    }
    $("#sidebarToggle, #closeSidebar, #sidebarOverlay").on("click", toggleSidebar);
    $("#sidebar a").on("click", () => $("#sidebar, #sidebarOverlay").removeClass("active"));

    // ===== TRACKING MODAL =====
    function openTrackingModal() {
        renderTracking();
        openModal($("#trackingModal"));
        $("#sidebar, #sidebarOverlay").removeClass("active");
    }

    $("#trackingBtn, #trackingBtnMobile").on("click", openTrackingModal);
    $("#closeTracking").on("click", () => closeModal($("#trackingModal")));

    $("#trackingCatalogBtn").on("click", function () {
        closeModal($("#trackingModal"));
        const el = document.getElementById("catalog");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    });

    $("#trackingModal").on("click", function (e) {
        if (e.target === this) closeModal($(this));
    });

    // ===== CART & CHECKOUT =====
    $("#productGrid").on("click", "[data-add-to-cart]", function () {
        addToCart(Number($(this).data("add-to-cart")));
    });

    $("#cartBtn").on("click", () => openModal($("#cartModal")));
    $("#closeCart").on("click", () => closeModal($("#cartModal")));

    $("#checkoutBtn").on("click", function () {
        if (!cart.length) {
            notify("Keranjang masih kosong, silakan pilih varian kopi terlebih dahulu!");
            return;
        }
        closeModal($("#cartModal"));
        openModal($("#checkoutModal"));
    });
    $("#closeCheckout").on("click", () => closeModal($("#checkoutModal")));

    $("#checkoutForm").on("submit", function (e) {
        e.preventDefault();

        const name = ($.trim($('[name="name"]').val()) || "Pelanggan");
        const address = ($.trim($('[name="address"]').val()) || "Alamat tidak diisi");
        const trackingCode = "KOPI-" + Date.now().toString().slice(-8);
        const { total, totalDiscount } = calcCartTotals();
        const etaDays = randBetween(2, 7);

        const order = {
            code: trackingCode,
            name,
            address,
            createdAt: Date.now(),
            etaDays,
            total,
            totalDiscount
        };

        activeOrders.unshift(order);
        if (activeOrders.length > 5) activeOrders = activeOrders.slice(0, 5);
        sessionStorage.setItem("nc_active_orders", JSON.stringify(activeOrders));

        cart = [];
        updateCartUI();
        closeModal($("#checkoutModal"));
        this.reset();
        renderTracking();

        notify(totalDiscount > 0
            ? `Pesanan berhasil! Hemat ${formatPrice(totalDiscount)}. Status: Diproses.`
            : `Pesanan berhasil! Status: Diproses. Lihat di Lacak Pesanan.`);

        setTimeout(() => openTrackingModal(), 400);
    });

    $("#cartModal, #checkoutModal").on("click", function (e) {
        if (e.target === this) closeModal($(this));
    });

    // ===== REVIEW FORM =====
    $("#reviewForm").on("submit", handleReviewSubmit);

    $(document).on("keydown", function (e) {
        if (e.key !== "Escape") return;
        closeAllModals();
        $("#sidebar, #sidebarOverlay").removeClass("active");
    });

    setInterval(renderTracking, 60 * 1000);

    renderProducts();
    populateReviewProductSelect();
    renderReviews();
    updateCartUI();
    renderTracking();
    initHeroCarousel();
});