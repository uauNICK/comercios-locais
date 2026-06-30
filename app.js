// Mock Data Definition (Default Database)
const DEFAULT_DB = {
    settings: {
        storeName: "GlowStyle Estética",
        storeDesc: "Transformamos o seu visual com excelência no atendimento. Barbearia, manicure, spa e produtos premium para cuidados pessoais.",
        storeBadge: "Cuidado & Bem-Estar",
        phone: "5511999999999", // Format: CountryCode + AreaCode + Number (no spaces or dashes for WA links)
        instagram: "glowstyle_estetica",
        address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
        mapsUrl: "https://maps.google.com",
        bannerUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1200",
        featureUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=600",
        theme: "barber-dark",
        hoursWeekdayStart: "09:00",
        hoursWeekdayEnd: "19:00",
        hoursSaturdayStart: "08:00",
        hoursSaturdayEnd: "17:00",
        hoursSundayOpen: false,
        hoursSundayStart: "09:00",
        hoursSundayEnd: "13:00",
        categories: [
            { id: "cat_1", name: "Serviços", type: "servico" },
            { id: "cat_2", name: "Lanches", type: "produto" },
            { id: "cat_3", name: "Bebidas", type: "produto" }
        ]
    },
    catalog: [
        {
            id: "s1",
            name: "Corte de Cabelo Premium",
            type: "servico",
            price: 60.00,
            category: "Cabelo",
            image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=600",
            description: "Corte personalizado de acordo com o seu perfil, com lavagem premium e finalização com pomada modeladora."
        },
        {
            id: "s2",
            name: "Barba Completa com Toalha Quente",
            type: "servico",
            price: 45.00,
            category: "Barba",
            image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600",
            description: "Alinhamento e corte da barba com terapia de toalha quente, óleos essenciais e massagem facial relaxante."
        },
        {
            id: "s3",
            name: "Manicure & Pedicure Express",
            type: "servico",
            price: 70.00,
            category: "Unhas",
            image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=600",
            description: "Cututilagem, hidratação profunda e esmaltação com produtos de alta durabilidade e secagem rápida."
        },
        {
            id: "p1",
            name: "Pomada Efeito Matte 150g",
            type: "produto",
            price: 45.00,
            category: "Cabelo",
            image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600",
            description: "Alta fixação com efeito seco/fosco natural. Ideal para penteados modernos de longa duração."
        },
        {
            id: "p2",
            name: "Óleo Hidratante Premium 30ml",
            type: "produto",
            price: 38.00,
            category: "Barba",
            image: "https://images.unsplash.com/photo-1626015276681-28516e706b81?auto=format&fit=crop&q=80&w=600",
            description: "Fórmula leve enriquecida com óleo de argan para amaciar, perfumar e fortalecer os fios da sua barba."
        },
        {
            id: "p3",
            name: "Shampoo Revitalizante Antiqueda",
            type: "produto",
            price: 55.00,
            category: "Cuidados",
            image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=600",
            description: "Limpa profundamente o couro cabeludo, estimulando a circulação sanguínea e fortalecendo os fios desde a raiz."
        }
    ],
    bookings: [
        {
            id: "b1",
            clientName: "Guilherme Silva",
            phone: "5511988887777",
            type: "servico",
            itemName: "Corte de Cabelo Premium",
            dateVal: "2026-06-30",
            timeVal: "14:00",
            notes: "Gostaria de fazer corte degradê médio."
        },
        {
            id: "b2",
            clientName: "Amanda Lima",
            phone: "5511977776666",
            type: "produto",
            itemName: "Pomada Efeito Matte 150g (2x)",
            dateVal: "2026-06-28",
            timeVal: "Reserva de Produto",
            notes: "Retirada à tarde."
        }
    ]
};

// Configuração do Firebase (Substitua pelas credenciais do seu console do Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyCtPTnYCGwXwTKyXUwHEmPz9Uzv5PABGGc",
    authDomain: "plataforma-cantinhodosaborvr.firebaseapp.com",
    projectId: "plataforma-cantinhodosaborvr",
    storageBucket: "plataforma-cantinhodosaborvr.firebasestorage.app",
    messagingSenderId: "910821162996",
    appId: "1:910821162996:web:3480f67a67acf15fef83a1"
};

const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey !== "";
let db = null;
let auth = null;

if (isFirebaseConfigured) {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        auth = firebase.auth();
        console.log("Firebase inicializado com sucesso!");
    } catch (err) {
        console.error("Falha ao inicializar o Firebase. Fallback para LocalStorage ativo.", err);
    }
}

// Available Time Slots for Booking
const TIME_SLOTS = [
    "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

// App State Management
class LocalBizApp {
    constructor() {
        this.db = null;
        this.activeFilter = "all";
        this.initDOM();
        this.setupEventListeners();

        // Inicialização assíncrona dos dados
        this.loadDatabase().then((database) => {
            this.db = database;
            this.selectedTheme = this.db.settings.theme || "barber-dark";
            this.applyBranding();
            this.renderCatalog();
            this.checkAdminSession();

            // Exibe o aviso de entrega na primeira abertura do site
            this.openModal("modal-delivery-welcome");

            // Ajusta instruções de login baseadas na configuração ativa
            const helperText = document.getElementById("login-helper-text");
            if (helperText) {
                if (isFirebaseConfigured) {
                    helperText.innerHTML = `Faça login usando o e-mail e senha cadastrados no console do Firebase Authentication.`;
                } else {
                    helperText.innerHTML = `Modo local: e-mail <strong>admin@admin.com</strong> e senha <strong>admin</strong>`;
                }
            }
        }).catch((err) => {
            console.error("Falha ao carregar banco de dados", err);
            this.showToast("Erro ao carregar banco de dados", "error");
        });
    }

    async loadDatabase() {
        if (isFirebaseConfigured) {
            try {
                // Configurações
                const settingsDoc = await db.collection("settings").doc("store").get();
                let settings = {};
                if (settingsDoc.exists) {
                    settings = settingsDoc.data();
                    if (!settings.categories) {
                        settings.categories = [
                            { id: "cat_1", name: "Serviços", type: "servico" },
                            { id: "cat_2", name: "Lanches", type: "produto" },
                            { id: "cat_3", name: "Bebidas", type: "produto" }
                        ];
                    }
                } else {
                    settings = DEFAULT_DB.settings;
                    await db.collection("settings").doc("store").set(settings);
                }

                // Catálogo
                const catalogSnapshot = await db.collection("catalog").get();
                let catalog = [];
                if (!catalogSnapshot.empty) {
                    catalogSnapshot.forEach(doc => {
                        catalog.push({ id: doc.id, ...doc.data() });
                    });
                } else {
                    for (const item of DEFAULT_DB.catalog) {
                        const { id, ...data } = item;
                        await db.collection("catalog").doc(id).set(data);
                        catalog.push(item);
                    }
                }

                // Agendamentos
                const bookingsSnapshot = await db.collection("bookings").get();
                let bookings = [];
                bookingsSnapshot.forEach(doc => {
                    bookings.push({ id: doc.id, ...doc.data() });
                });

                return { settings, catalog, bookings };
            } catch (err) {
                console.error("Falha ao carregar dados do Firebase. Usando LocalStorage...", err);
                return this.loadDatabaseLocalStorage();
            }
        } else {
            return this.loadDatabaseLocalStorage();
        }
    }

    loadDatabaseLocalStorage() {
        const stored = localStorage.getItem("local_biz_db");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.settings && !parsed.settings.categories) {
                    parsed.settings.categories = [
                        { id: "cat_1", name: "Serviços", type: "servico" },
                        { id: "cat_2", name: "Lanches", type: "produto" },
                        { id: "cat_3", name: "Bebidas", type: "produto" }
                    ];
                }
                return parsed;
            } catch (e) {
                console.error("Erro ao ler LocalStorage, usando valores mockados.", e);
            }
        }
        localStorage.setItem("local_biz_db", JSON.stringify(DEFAULT_DB));
        return JSON.parse(JSON.stringify(DEFAULT_DB));
    }

    saveDatabase() {
        if (!isFirebaseConfigured) {
            localStorage.setItem("local_biz_db", JSON.stringify(this.db));
        }
    }

    initDOM() {
        // Landing Page bindings
        this.logoText = document.getElementById("logo-text");
        this.heroBannerImage = document.getElementById("hero-banner-image");
        this.heroBadge = document.getElementById("hero-badge");
        this.heroTitle = document.getElementById("hero-title");
        this.heroDesc = document.getElementById("hero-desc");
        this.heroFeatureImage = document.getElementById("hero-feature-image");
        this.catalogGrid = document.getElementById("catalog-grid");
        
        // Footer bindings
        this.footerStoreName = document.getElementById("footer-store-name");
        this.footerStoreDesc = document.getElementById("footer-store-desc");
        this.footerPhone = document.getElementById("footer-phone");
        this.footerAddress = document.getElementById("footer-address");
        this.copyrightBrand = document.getElementById("copyright-brand");
        this.socialWhatsapp = document.getElementById("social-whatsapp");
        this.socialInstagram = document.getElementById("social-instagram");
        this.socialFacebook = document.getElementById("social-facebook");
        this.btnGoogleMaps = document.getElementById("btn-google-maps");
        this.yearCopy = document.getElementById("year-copy");
        
        // Modal Booking bindings
        this.modalBooking = document.getElementById("modal-booking");
        this.bookingItemTitle = document.getElementById("booking-item-title");
        this.bookingServiceId = document.getElementById("booking-service-id");
        this.bookingDate = document.getElementById("booking-date");
        this.bookingTimeInput = document.getElementById("booking-time");
        this.slotsContainer = document.getElementById("slots-container");
        this.formBooking = document.getElementById("form-booking");

        // Modal Reserve bindings
        this.modalReserve = document.getElementById("modal-reserve");
        this.reserveProductId = document.getElementById("reserve-product-id");
        this.reserveProductImg = document.getElementById("reserve-product-img");
        this.reserveProductName = document.getElementById("reserve-product-name");
        this.reserveProductPrice = document.getElementById("reserve-product-price");
        this.formReserve = document.getElementById("form-reserve");

        // Modal Admin Login bindings
        this.modalAdminLogin = document.getElementById("modal-admin-login");
        this.formAdminLogin = document.getElementById("form-admin-login");

        // Admin Dashboard bindings
        this.adminDashboard = document.getElementById("admin-dashboard");
        this.btnAdminOpen = document.getElementById("btn-admin-open");
        this.btnAdminLogout = document.getElementById("btn-admin-logout");
        this.btnAdminBack = document.getElementById("btn-admin-back");
        this.btnAdminBackSettings = document.getElementById("btn-admin-back-settings");
        
        // Catalog Form bindings
        this.modalCatalogForm = document.getElementById("modal-catalog-form");
        this.formCatalogItem = document.getElementById("form-catalog-item");
        this.catalogFormTitle = document.getElementById("catalog-form-title");
        this.btnCatalogAdd = document.getElementById("btn-catalog-add");
        this.catalogItemId = document.getElementById("catalog-item-id");
        this.catalogItemImageFile = document.getElementById("catalog-item-image-file");
        this.catalogItemStock = document.getElementById("catalog-item-stock");
        this.groupItemStock = document.getElementById("group-item-stock");

        // Setup Copyright Year
        if (this.yearCopy) this.yearCopy.textContent = new Date().getFullYear();
    }

    applyBranding() {
        const s = this.db.settings;

        // Fallbacks for schedule settings if undefined (backward compatibility)
        s.hoursWeekdayStart = s.hoursWeekdayStart || "09:00";
        s.hoursWeekdayEnd = s.hoursWeekdayEnd || "19:00";
        s.hoursSaturdayStart = s.hoursSaturdayStart || "08:00";
        s.hoursSaturdayEnd = s.hoursSaturdayEnd || "17:00";
        s.hoursSundayOpen = s.hoursSundayOpen !== undefined ? s.hoursSundayOpen : false;
        s.hoursSundayStart = s.hoursSundayStart || "09:00";
        s.hoursSundayEnd = s.hoursSundayEnd || "13:00";

        // Apply Theme Stylesheet Class
        document.body.className = `theme-${s.theme}`;

        // Top Header
        if (this.logoText) {
            let icon = "fa-utensils";
            if (s.theme === "rose-gold") icon = "fa-cake-candles";
            if (s.theme === "emerald-spa") icon = "fa-carrot";
            if (s.theme === "cyberpunk") icon = "fa-pizza-slice";
            this.logoText.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${s.storeName}</span>`;
        }

        // Hero Content
        if (this.heroBannerImage) {
            if (this.isVideo(s.bannerUrl)) {
                this.heroBannerImage.style.backgroundImage = "none";
                this.heroBannerImage.innerHTML = `<video src="${s.bannerUrl}" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; position: absolute; top:0; left:0;"></video>`;
            } else {
                this.heroBannerImage.innerHTML = "";
                this.heroBannerImage.style.backgroundImage = `url('${s.bannerUrl}')`;
            }
        }
        if (this.heroBadge) this.heroBadge.textContent = s.badge;
        
        // Highlight logic for the last word of title
        if (this.heroTitle) {
            const titleWords = s.storeName.split(" ");
            const lastWord = titleWords[titleWords.length - 1];
            const startPhrase = s.storeName.substring(0, s.storeName.length - lastWord.length);
            this.heroTitle.innerHTML = `${startPhrase}<span>${lastWord}</span>`;
        }
        if (this.heroDesc) this.heroDesc.textContent = s.storeDesc;
        
        if (this.heroFeatureImage) {
            const wrapper = document.querySelector(".hero-image-wrapper");
            if (wrapper) {
                if (this.isVideo(s.featureUrl)) {
                    wrapper.innerHTML = `<video src="${s.featureUrl}" autoplay loop muted playsinline class="hero-main-image" id="hero-feature-image"></video>`;
                } else {
                    wrapper.innerHTML = `<img src="${s.featureUrl}" alt="Destaque" class="hero-main-image" id="hero-feature-image" onerror="this.src='https://images.unsplash.com/photo-1582201942988-13e60e4556ee?auto=format&fit=crop&q=80&w=600'">`;
                }
                this.heroFeatureImage = document.getElementById("hero-feature-image");
            } else {
                this.heroFeatureImage.src = s.featureUrl;
            }
        }

        // Footer Content
        if (this.footerStoreName) this.footerStoreName.textContent = s.storeName;
        if (this.footerStoreDesc) this.footerStoreDesc.textContent = s.storeDesc;
        if (this.footerPhone) this.footerPhone.textContent = this.formatPhoneDisplay(s.phone);
        if (this.footerAddress) this.footerAddress.textContent = s.address;
        if (this.copyrightBrand) this.copyrightBrand.textContent = s.storeName;

        // Contact links
        if (this.socialWhatsapp) this.socialWhatsapp.href = `https://wa.me/${s.phone}`;
        if (this.socialInstagram) this.socialInstagram.href = `https://instagram.com/${s.instagram}`;
        const btnHeroContact = document.getElementById("btn-hero-contact");
        if (btnHeroContact) btnHeroContact.href = `https://wa.me/${s.phone}`;
        if (this.socialFacebook) this.socialFacebook.href = `https://facebook.com`;
        if (this.btnGoogleMaps) this.btnGoogleMaps.href = s.mapsUrl;

        // Footer schedule display
        const displayW = document.getElementById("display-hours-weekday");
        const displayS = document.getElementById("display-hours-sat");
        const displaySu = document.getElementById("display-hours-sun");
        if (displayW) displayW.textContent = `${s.hoursWeekdayStart} - ${s.hoursWeekdayEnd}`;
        if (displayS) displayS.textContent = `${s.hoursSaturdayStart} - ${s.hoursSaturdayEnd}`;
        if (displaySu) displaySu.textContent = s.hoursSundayOpen ? `${s.hoursSundayStart} - ${s.hoursSundayEnd}` : "Fechado";

        // Admin Customization Inputs Sync
        document.getElementById("settings-store-name").value = s.storeName;
        document.getElementById("settings-badge").value = s.badge;
        document.getElementById("settings-description").value = s.storeDesc;
        document.getElementById("settings-banner-url").value = s.bannerUrl;
        document.getElementById("settings-feature-url").value = s.featureUrl;

        const bannerFileEl = document.getElementById("settings-banner-file");
        const featureFileEl = document.getElementById("settings-feature-file");
        if (bannerFileEl) bannerFileEl.value = "";
        if (featureFileEl) featureFileEl.value = "";

        document.getElementById("settings-phone").value = s.phone;
        
        // Render dynamic categories
        this.renderFilters();
        this.renderAdminCategories();
        document.getElementById("settings-instagram").value = s.instagram;
        document.getElementById("settings-address").value = s.address;
        document.getElementById("settings-maps-url").value = s.mapsUrl;
        document.getElementById("settings-theme").value = s.theme;

        // Admin schedule Inputs Sync
        document.getElementById("settings-hours-weekday-start").value = s.hoursWeekdayStart;
        document.getElementById("settings-hours-weekday-end").value = s.hoursWeekdayEnd;
        document.getElementById("settings-hours-sat-start").value = s.hoursSaturdayStart;
        document.getElementById("settings-hours-sat-end").value = s.hoursSaturdayEnd;
        
        const checkSun = document.getElementById("settings-hours-sun-open");
        if (checkSun) {
            checkSun.checked = s.hoursSundayOpen;
            const sunRow = document.getElementById("settings-hours-sun-row");
            if (sunRow) sunRow.style.display = s.hoursSundayOpen ? "grid" : "none";
        }
        document.getElementById("settings-hours-sun-start").value = s.hoursSundayStart;
        document.getElementById("settings-hours-sun-end").value = s.hoursSundayEnd;

        // Select Theme Option visually
        document.querySelectorAll(".theme-option").forEach(opt => {
            if (opt.dataset.theme === s.theme) {
                opt.classList.add("selected");
            } else {
                opt.classList.remove("selected");
            }
        });

        // Update Store Open/Closed indicator on storefront
        this.updateStoreStatus();
    }

    updateStoreStatus() {
        const s = this.db.settings;
        const now = new Date();
        
        // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const day = now.getDay();
        
        // Get current time in minutes since midnight
        const currentHour = now.getHours();
        const currentMin = now.getMinutes();
        const currentTotalMin = currentHour * 60 + currentMin;
        
        let isOpen = false;
        
        const parseTimeToMinutes = (timeStr) => {
            if (!timeStr) return 0;
            const parts = timeStr.split(":");
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        };
        
        if (day >= 1 && day <= 5) {
            // Weekday (Mon-Fri)
            const startMin = parseTimeToMinutes(s.hoursWeekdayStart);
            const endMin = parseTimeToMinutes(s.hoursWeekdayEnd);
            isOpen = currentTotalMin >= startMin && currentTotalMin < endMin;
        } else if (day === 6) {
            // Saturday
            const startMin = parseTimeToMinutes(s.hoursSaturdayStart);
            const endMin = parseTimeToMinutes(s.hoursSaturdayEnd);
            isOpen = currentTotalMin >= startMin && currentTotalMin < endMin;
        } else if (day === 0) {
            // Sunday
            if (s.hoursSundayOpen) {
                const startMin = parseTimeToMinutes(s.hoursSundayStart);
                const endMin = parseTimeToMinutes(s.hoursSundayEnd);
                isOpen = currentTotalMin >= startMin && currentTotalMin < endMin;
            } else {
                isOpen = false;
            }
        }
        
        const badge = document.getElementById("store-status-badge");
        if (badge) {
            if (isOpen) {
                const closingHour = day === 0 ? s.hoursSundayEnd : day === 6 ? s.hoursSaturdayEnd : s.hoursWeekdayEnd;
                badge.innerHTML = `<i class="fa-solid fa-circle" style="font-size: 0.65rem; color: #22c55e; margin-right: 6px;"></i> Aberto (Fecha às ${closingHour})`;
                badge.style.backgroundColor = "rgba(34, 197, 94, 0.15)";
                badge.style.color = "#22c55e";
                badge.style.borderColor = "rgba(34, 197, 94, 0.3)";
            } else {
                let nextDayText = "Abre amanhã às ";
                if (day === 6 && !s.hoursSundayOpen) {
                    nextDayText = "Abre segunda às " + s.hoursWeekdayStart;
                } else if (day === 0) {
                    nextDayText = "Abre segunda às " + s.hoursWeekdayStart;
                } else {
                    nextDayText = "Abre amanhã às " + (day === 5 ? s.hoursSaturdayStart : s.hoursWeekdayStart);
                }
                
                badge.innerHTML = `<i class="fa-solid fa-circle" style="font-size: 0.65rem; color: #ef4444; margin-right: 6px;"></i> Fechado (${nextDayText})`;
                badge.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
                badge.style.color = "#ef4444";
                badge.style.borderColor = "rgba(239, 68, 68, 0.3)";
            }
        }
    }

    renderCatalog() {
        if (!this.catalogGrid) return;
        this.catalogGrid.innerHTML = "";

        const filtered = this.db.catalog.filter(item => {
            if (this.activeFilter === "all") return true;
            return item.category === this.activeFilter;
        });

        if (filtered.length === 0) {
            this.catalogGrid.innerHTML = `
                <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fa-regular fa-folder-open" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 16px; display: block;"></i>
                    <p style="color: var(--text-secondary);">Nenhum item disponível nesta categoria no momento.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement("div");
            card.className = "glass-card catalog-card";
            
            const isService = item.type === "servico";
            
            // Stock checks
            let stockBadgeHtml = "";
            let isOutOfStock = false;
            if (item.type === "produto" && item.stock !== null && item.stock !== undefined) {
                const stockNum = parseInt(item.stock);
                if (stockNum <= 0) {
                    stockBadgeHtml = `<span class="badge" style="position: absolute; top: 12px; right: 12px; z-index: 5; background-color: rgba(239, 68, 68, 0.2); color: #ef4444; border-color: rgba(239, 68, 68, 0.3);">Esgotado</span>`;
                    isOutOfStock = true;
                } else {
                    stockBadgeHtml = `<span class="badge" style="position: absolute; top: 12px; right: 12px; z-index: 5; background-color: rgba(16, 185, 129, 0.15); color: var(--accent-color); border-color: rgba(16, 185, 129, 0.3);">${stockNum} restando</span>`;
                }
            }

            const actionText = isOutOfStock ? "Consultar estoque" : (isService ? "Entrar em contato" : "Reservar e Retirar");
            const actionIcon = isOutOfStock ? "fa-circle-xmark" : (isService ? "fa-comments" : "fa-bag-shopping");
            const actionClass = isOutOfStock ? "btn-out-of-stock-trigger" : (isService ? "btn-booking-trigger" : "btn-reserve-trigger");
            const actionStyle = isOutOfStock ? "background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.4); color: #ef4444;" : "";
            const actionDisabledAttr = "";

            card.innerHTML = `
                <div class="card-img-wrapper" style="${isOutOfStock ? 'filter: grayscale(0.8);' : ''}">
                    ${this.isVideo(item.image) 
                        ? `<video src="${item.image}" autoplay loop muted playsinline class="card-img" style="object-fit: cover; width: 100%; height: 100%;"></video>` 
                        : `<img src="${item.image}" alt="${item.name}" class="card-img" onerror="this.src='https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&q=80&w=400'">`
                    }
                    <span class="badge" style="position: absolute; top: 12px; left: 12px; z-index: 5;">${item.category}</span>
                    ${stockBadgeHtml}
                </div>
                <div class="card-body">
                    <h3 class="card-title">${item.name}</h3>
                    <p class="card-desc">${item.description}</p>
                    <div class="card-footer">
                        <span class="card-price">R$ ${this.formatPrice(item.price)}</span>
                        <button class="btn-primary ${actionClass}" data-id="${item.id}" ${actionDisabledAttr} style="padding: 8px 16px; font-size: 0.85rem; ${actionStyle}">
                            <i class="fa-solid ${actionIcon}"></i> ${actionText}
                        </button>
                    </div>
                </div>
            `;
            this.catalogGrid.appendChild(card);
        });

        // Re-attach triggers to newly rendered buttons
        document.querySelectorAll(".btn-booking-trigger").forEach(btn => {
            btn.addEventListener("click", (e) => this.openBookingModal(e.currentTarget.dataset.id));
        });

        document.querySelectorAll(".btn-reserve-trigger").forEach(btn => {
            btn.addEventListener("click", (e) => this.openReserveModal(e.currentTarget.dataset.id));
        });

        document.querySelectorAll(".btn-out-of-stock-trigger").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const item = this.db.catalog.find(i => i.id === e.currentTarget.dataset.id);
                if (item) {
                    const desc = document.getElementById("out-of-stock-modal-desc");
                    if (desc) {
                        desc.innerHTML = `Lamentamos, mas o produto <strong>${item.name}</strong> está temporariamente esgotado (estoque zerado). Deseja enviar uma consulta pelo WhatsApp para saber quando receberemos novas unidades?`;
                    }
                    const btnWa = document.getElementById("btn-out-of-stock-whatsapp");
                    if (btnWa) {
                        const msg = `Olá! Vi no site que o produto "${item.name}" está esgotado. Gostaria de consultar com a loja a disponibilidade ou previsão de chegada de novas unidades.`;
                        btnWa.onclick = () => {
                            window.open(`https://api.whatsapp.com/send?phone=${this.db.settings.phone}&text=${encodeURIComponent(msg)}`, "_blank");
                            this.closeModal("modal-out-of-stock");
                        };
                    }
                    this.openModal("modal-out-of-stock");
                }
            });
        });
    }

    renderAdminCatalog() {
        const grid = document.getElementById("admin-catalog-grid");
        if (!grid) return;
        grid.innerHTML = "";

        this.db.catalog.forEach(item => {
            const card = document.createElement("div");
            card.className = "glass-card admin-catalog-card";
            const typeLabel = item.type === "servico" ? "Serviço" : "Produto";
            
            card.innerHTML = `
                <div class="admin-card-actions">
                    <button class="admin-card-btn edit" data-id="${item.id}" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="admin-card-btn delete" data-id="${item.id}" title="Excluir"><i class="fa-solid fa-trash-can"></i></button>
                </div>
                <div class="card-img-wrapper" style="height: 140px;">
                    ${this.isVideo(item.image) 
                        ? `<video src="${item.image}" autoplay loop muted playsinline class="card-img" style="object-fit: cover; width: 100%; height: 100%;"></video>` 
                        : `<img src="${item.image}" alt="${item.name}" class="card-img" onerror="this.src='https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&q=80&w=400'">`
                    }
                    <span class="badge" style="position: absolute; top: 8px; left: 8px;">${item.category}</span>
                </div>
                <div class="card-body" style="padding: 16px;">
                    <span style="font-size: 0.75rem; color: var(--accent-color); font-weight:600; text-transform: uppercase;">${typeLabel}</span>
                    <h4 style="margin: 4px 0 8px 0; font-size: 1.05rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.name}</h4>
                    <span class="card-price" style="font-size: 1.1rem;">R$ ${this.formatPrice(item.price)}</span>
                    ${item.stock !== null && item.stock !== undefined ? `<br><span style="font-size: 0.8rem; color: var(--text-secondary);">Disponível: <strong>${item.stock}</strong></span>` : ''}
                    ${item.reserved ? `<br><span style="font-size: 0.8rem; color: #f59e0b;">Reservado: <strong>${item.reserved}</strong></span>` : ''}
                </div>
            `;
            grid.appendChild(card);
        });

        // Actions
        grid.querySelectorAll(".admin-card-btn.edit").forEach(btn => {
            btn.addEventListener("click", (e) => this.openCatalogFormModal(e.currentTarget.dataset.id));
        });
        grid.querySelectorAll(".admin-card-btn.delete").forEach(btn => {
            btn.addEventListener("click", (e) => this.deleteCatalogItem(e.currentTarget.dataset.id));
        });
    }

    renderAdminBookings() {
        const rows = document.getElementById("admin-bookings-rows");
        const countBadge = document.getElementById("bookings-count");
        if (!rows) return;
        rows.innerHTML = "";

        const searchInput = document.getElementById("admin-bookings-search");
        const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

        let list = this.db.bookings || [];
        
        if (query) {
            list = list.filter(b => 
                (b.clientName && b.clientName.toLowerCase().includes(query)) ||
                (b.phone && b.phone.includes(query)) ||
                (b.orderNum && String(b.orderNum).includes(query)) ||
                (b.itemName && b.itemName.toLowerCase().includes(query))
            );
        }

        // Sort bookings by date descending
        list.sort((a, b) => new Date(b.dateVal) - new Date(a.dateVal));

        if (countBadge) countBadge.textContent = `${list.length} Registros`;

        if (list.length === 0) {
            rows.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 40px 0;">
                        Nenhum agendamento ou reserva realizado ainda.
                    </td>
                </tr>
            `;
            return;
        }

        list.forEach(booking => {
            const tr = document.createElement("tr");
            const typeLabel = booking.type === "servico" 
                ? `<span class="badge" style="background-color:rgba(245, 158, 11, 0.1); color:#f59e0b; border:none;">Serviço</span>`
                : `<span class="badge" style="background-color:rgba(16, 185, 129, 0.1); color:#10b981; border:none;">Produto</span>`;
            
            const detailText = booking.type === "servico" 
                ? `${this.formatDateBR(booking.dateVal)} às <strong>${booking.timeVal}</strong>`
                : `Reserva em ${this.formatDateBR(booking.dateVal)}`;

            // Create WhatsApp contact link
            const displayOrderNum = booking.orderNum ? `#${booking.orderNum} ` : '';
            const waMsg = encodeURIComponent(`Olá ${booking.clientName}! Estou entrando em contato sobre o seu agendamento/reserva ${displayOrderNum}de ${booking.itemName}.`);
            const waLink = `https://wa.me/${booking.phone}?text=${waMsg}`;

            const bookingStatus = booking.status || (booking.type === "servico" ? "confirmado" : "pendente");
            const statusBadge = bookingStatus === "confirmado"
                ? `<span class="badge" style="background-color:rgba(16, 185, 129, 0.1); color:#10b981; border: 1px solid rgba(16, 185, 129, 0.2); font-size: 0.7rem; padding: 2px 6px; margin-left: 6px;">Confirmado</span>`
                : `<span class="badge" style="background-color:rgba(245, 158, 11, 0.1); color:#f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); font-size: 0.7rem; padding: 2px 6px; margin-left: 6px;">Pendente</span>`;

            const showConfirmBtn = booking.type === "produto" && bookingStatus === "pendente";
            const confirmBtnHtml = showConfirmBtn
                ? `<button class="table-action-btn confirm btn-confirm-booking" data-id="${booking.id}" title="Confirmar Pagamento e Venda" style="background-color: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2);"><i class="fa-solid fa-check"></i></button>`
                : '';

            tr.innerHTML = `
                <td><strong>${displayOrderNum}</strong><strong style="color:var(--accent-color);">${booking.clientName}</strong>${statusBadge}<br><small style="color:var(--text-secondary);">${booking.notes || 'Sem observações'}</small></td>
                <td>${this.formatPhoneDisplay(booking.phone)}</td>
                <td>${typeLabel}</td>
                <td>${booking.itemName}</td>
                <td>${detailText}</td>
                <td>
                    ${confirmBtnHtml}
                    <a href="${waLink}" target="_blank" class="table-action-btn whatsapp" title="Falar no WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
                    <button class="table-action-btn delete btn-delete-booking" data-id="${booking.id}" title="Excluir Registro"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            rows.appendChild(tr);
        });

        rows.querySelectorAll(".btn-delete-booking").forEach(btn => {
            btn.addEventListener("click", (e) => this.deleteBooking(e.currentTarget.dataset.id));
        });

        rows.querySelectorAll(".btn-confirm-booking").forEach(btn => {
            btn.addEventListener("click", (e) => this.confirmBooking(e.currentTarget.dataset.id));
        });
    }

    setupEventListeners() {
        // Catalog filter switching
        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
                e.currentTarget.classList.add("active");
                this.activeFilter = e.currentTarget.dataset.filter;
                this.renderCatalog();
            });
        });

        // Generic Modal Closes
        document.querySelectorAll(".modal-close, .modal-overlay").forEach(el => {
            el.addEventListener("click", (e) => {
                if (e.target.classList.contains("modal-overlay") || e.target.closest(".modal-close")) {
                    const activeModal = document.querySelector(".modal-overlay.active");
                    if (activeModal) this.closeModal(activeModal.id);
                }
            });
        });

        // Booking Modal Flows
        if (this.bookingDate) {
            // Set min booking date to today
            const today = new Date().toISOString().split("T")[0];
            this.bookingDate.min = today;
            
            this.bookingDate.addEventListener("change", () => {
                this.generateTimeSlots(this.bookingDate.value);
            });
        }

        if (this.formBooking) {
            this.formBooking.addEventListener("submit", (e) => this.handleBookingSubmit(e));
        }

        // Product Reservation Flows
        if (this.formReserve) {
            this.formReserve.addEventListener("submit", (e) => this.handleReserveSubmit(e));
        }

        // Admin Trigger Opens
        if (this.btnAdminOpen) {
            this.btnAdminOpen.addEventListener("click", () => {
                if (sessionStorage.getItem("admin_logged_in") === "true") {
                    this.openAdminDashboard();
                } else {
                    this.openModal("modal-admin-login");
                }
            });
        }

        if (this.formAdminLogin) {
            this.formAdminLogin.addEventListener("submit", (e) => this.handleAdminLogin(e));
        }

        if (this.btnAdminLogout) {
            this.btnAdminLogout.addEventListener("click", () => this.handleAdminLogout());
        }

        const closeAdmin = () => {
            this.adminDashboard.classList.remove("active");
            this.checkAdminSession();
        };

        if (this.btnAdminBack) {
            this.btnAdminBack.addEventListener("click", closeAdmin);
        }
        if (this.btnAdminBackSettings) {
            this.btnAdminBackSettings.addEventListener("click", closeAdmin);
        }

        // Admin Tab switching
        document.querySelectorAll(".admin-nav-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                document.querySelectorAll(".admin-nav-btn").forEach(b => b.classList.remove("active"));
                document.querySelectorAll(".admin-tab-pane").forEach(pane => pane.classList.remove("active"));
                
                e.currentTarget.classList.add("active");
                const targetTabId = e.currentTarget.dataset.tab;
                document.getElementById(targetTabId).classList.add("active");
            });
        });

        // Theme Selector clicks
        document.querySelectorAll(".theme-option").forEach(opt => {
            opt.addEventListener("click", (e) => {
                const targetTheme = e.currentTarget.dataset.theme;
                document.querySelectorAll(".theme-option").forEach(o => o.classList.remove("selected"));
                e.currentTarget.classList.add("selected");
                document.getElementById("settings-theme").value = targetTheme;
            });
        });

        // Save settings form
        const formSettings = document.getElementById("form-settings");
        if (formSettings) {
            formSettings.addEventListener("submit", (e) => this.handleSettingsSubmit(e));
        }

        // Catalog Manager Add/Save flows
        if (this.btnCatalogAdd) {
            this.btnCatalogAdd.addEventListener("click", () => this.openCatalogFormModal());
        }

        if (this.formCatalogItem) {
            this.formCatalogItem.addEventListener("submit", (e) => this.handleCatalogFormSubmit(e));
        }

        // Sunday Hours Toggle
        const checkSunOpen = document.getElementById("settings-hours-sun-open");
        const sunRow = document.getElementById("settings-hours-sun-row");
        if (checkSunOpen && sunRow) {
            checkSunOpen.addEventListener("change", () => {
                sunRow.style.display = checkSunOpen.checked ? "grid" : "none";
            });
        }

        // Add Category Trigger
        const btnAddCat = document.getElementById("btn-add-category");
        if (btnAddCat) {
            btnAddCat.addEventListener("click", () => this.addCategory());
        }

        // Delivery Popups Triggers
        const btnCloseWelcome = document.getElementById("btn-delivery-welcome-close");
        if (btnCloseWelcome) {
            btnCloseWelcome.addEventListener("click", () => {
                this.closeModal("modal-delivery-welcome");
            });
        }

        const btnCancelCheckout = document.getElementById("btn-delivery-checkout-cancel");
        if (btnCancelCheckout) {
            btnCancelCheckout.addEventListener("click", () => {
                this.closeModal("modal-delivery-checkout");
            });
        }

        const btnConfirmCheckout = document.getElementById("btn-delivery-checkout-confirm");
        if (btnConfirmCheckout) {
            btnConfirmCheckout.addEventListener("click", () => {
                this.closeModal("modal-delivery-checkout");
                if (this.pendingWaUrl) {
                    window.open(this.pendingWaUrl, "_blank");
                    this.pendingWaUrl = null;
                }
            });
        }

        // Close out-of-stock modal
        const btnCloseOutOfStock = document.getElementById("btn-out-of-stock-close");
        if (btnCloseOutOfStock) {
            btnCloseOutOfStock.addEventListener("click", () => {
                this.closeModal("modal-out-of-stock");
            });
        }

        // Search bookings filter
        const bookingsSearch = document.getElementById("admin-bookings-search");
        if (bookingsSearch) {
            bookingsSearch.addEventListener("input", () => this.renderAdminBookings());
        }
    }

    // Modal Control Utils
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add("active");
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove("active");
    }

    // Modals Initialization content mapping
    openBookingModal(serviceId) {
        const service = this.db.catalog.find(item => item.id === serviceId);
        if (!service) return;

        this.bookingServiceId.value = service.id;
        this.bookingItemTitle.innerHTML = `Serviço: <strong>${service.name}</strong> - R$ ${this.formatPrice(service.price)}`;
        this.bookingDate.value = "";
        this.bookingTimeInput.value = "";
        this.slotsContainer.innerHTML = `<p style="color:var(--text-secondary); font-size:0.9rem; grid-column:1/-1; text-align:center;">Selecione uma data para ver os horários livres.</p>`;

        this.openModal("modal-booking");
    }

    generateTimeSlots(selectedDate) {
        this.slotsContainer.innerHTML = "";
        this.bookingTimeInput.value = "";

        if (!selectedDate) return;

        // Get booked times on the selected date
        const bookedSlots = this.db.bookings
            .filter(b => b.dateVal === selectedDate && b.type === "servico")
            .map(b => b.timeVal);

        TIME_SLOTS.forEach(time => {
            const isBooked = bookedSlots.includes(time);
            
            const btn = document.createElement("div");
            btn.className = `slot-btn ${isBooked ? 'disabled' : ''}`;
            btn.textContent = time;
            
            if (!isBooked) {
                btn.addEventListener("click", () => {
                    document.querySelectorAll(".slot-btn").forEach(s => s.classList.remove("selected"));
                    btn.classList.add("selected");
                    this.bookingTimeInput.value = time;
                });
            } else {
                btn.title = "Horário já reservado";
            }
            this.slotsContainer.appendChild(btn);
        });
    }

    async handleBookingSubmit(e) {
        e.preventDefault();

        const serviceId = this.bookingServiceId.value;
        const service = this.db.catalog.find(s => s.id === serviceId);
        const dateVal = this.bookingDate.value;
        const timeVal = this.bookingTimeInput.value;
        const nameVal = document.getElementById("booking-name").value.trim();
        const phoneVal = this.cleanPhoneNumber(document.getElementById("booking-phone").value);
        const notesVal = document.getElementById("booking-notes").value.trim();

        if (!timeVal) {
            this.showToast("Por favor, selecione um horário disponível!", "error");
            return;
        }

        const orderNum = Math.floor(10000 + Math.random() * 90000);

        // Save to Database
        const newId = "b_" + Date.now();
        const newBooking = {
            id: newId,
            orderNum: orderNum,
            clientName: nameVal,
            phone: phoneVal,
            type: "servico",
            itemName: service.name,
            dateVal: dateVal,
            timeVal: timeVal,
            status: "confirmado",
            notes: notesVal
        };

        try {
            if (isFirebaseConfigured) {
                try {
                    const { id, ...data } = newBooking;
                    await db.collection("bookings").doc(newId).set(data);
                } catch (fsErr) {
                    console.warn("Falha ao salvar agendamento no Firebase (continuando localmente):", fsErr);
                }
            }
            this.db.bookings.push(newBooking);
            this.saveDatabase();

            this.showToast("Agendamento salvo com sucesso!");
            this.closeModal("modal-booking");
            this.formBooking.reset();

            // Redirect to WhatsApp Link
            const formattedDate = this.formatDateBR(dateVal);
            const message = `Olá! Gostaria de confirmar meu agendamento:\n\n` +
                            `🆔 *Pedido:* #${orderNum}\n` +
                            `🔹 *Serviço:* ${service.name}\n` +
                            `📅 *Data:* ${formattedDate}\n` +
                            `⏰ *Horário:* ${timeVal}\n` +
                            `👤 *Nome:* ${nameVal}\n` +
                            `📞 *Contato:* ${this.formatPhoneDisplay(phoneVal)}` +
                            (notesVal ? `\n📝 *Notas:* ${notesVal}` : "");

            const waUrl = `https://api.whatsapp.com/send?phone=${this.db.settings.phone}&text=${encodeURIComponent(message)}`;
            
            setTimeout(() => {
                this.pendingWaUrl = waUrl;
                this.openModal("modal-delivery-checkout");
            }, 800);
        } catch (err) {
            console.error("Failed to save booking", err);
            this.showToast("Erro ao salvar o agendamento.", "error");
        }
    }

    openReserveModal(productId) {
        const product = this.db.catalog.find(item => item.id === productId);
        if (!product) return;

        this.reserveProductId.value = product.id;
        this.reserveProductName.textContent = product.name;
        this.reserveProductPrice.textContent = `R$ ${this.formatPrice(product.price)}`;

        const mediaContainer = document.getElementById("reserve-product-media-container");
        if (mediaContainer) {
            if (this.isVideo(product.image)) {
                mediaContainer.innerHTML = `<video src="${product.image}" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;"></video>`;
            } else {
                mediaContainer.innerHTML = `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" onerror="this.src='https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&q=80&w=400'">`;
            }
        }

        const displayStock = document.getElementById("reserve-product-stock-display");
        const inputQty = document.getElementById("reserve-qty");
        if (product.stock !== null && product.stock !== undefined) {
            displayStock.textContent = `Disponível: ${product.stock} unidades`;
            inputQty.max = product.stock;
        } else {
            displayStock.textContent = "Consultar estoque com a loja";
            inputQty.removeAttribute("max");
        }
        
        document.getElementById("reserve-qty").value = "1";

        this.openModal("modal-reserve");
    }

    async handleReserveSubmit(e) {
        e.preventDefault();

        const productId = this.reserveProductId.value;
        const product = this.db.catalog.find(p => p.id === productId);
        const nameVal = document.getElementById("reserve-name").value.trim();
        const phoneVal = this.cleanPhoneNumber(document.getElementById("reserve-phone").value);
        const qtyVal = parseInt(document.getElementById("reserve-qty").value);

        if (product.stock !== null && product.stock !== undefined) {
            if (qtyVal > product.stock) {
                this.showToast(`Quantidade solicitada excede o estoque disponível (${product.stock} un)!`, "error");
                return;
            }
        }

        const totalCost = product.price * qtyVal;
        const orderNum = Math.floor(10000 + Math.random() * 90000);

        // Save to Database
        const newId = "r_" + Date.now();
        const newReservation = {
            id: newId,
            orderNum: orderNum,
            productId: productId,
            qty: qtyVal,
            clientName: nameVal,
            phone: phoneVal,
            type: "produto",
            itemName: `${product.name} (${qtyVal}x)`,
            dateVal: new Date().toISOString().split("T")[0],
            timeVal: "Reserva de Produto",
            status: "pendente",
            notes: `Retirada agendada. Total: R$ ${this.formatPrice(totalCost)}`
        };

        try {
            if (product.stock !== null && product.stock !== undefined) {
                product.stock -= qtyVal;
                product.reserved = (product.reserved || 0) + qtyVal;
                if (isFirebaseConfigured) {
                    try {
                        await db.collection("catalog").doc(productId).set({ stock: product.stock, reserved: product.reserved }, { merge: true });
                    } catch (fsErr) {
                        console.warn("Falha ao atualizar estoque no Firebase (continuando localmente):", fsErr);
                    }
                }
            }

            if (isFirebaseConfigured) {
                try {
                    const { id, ...data } = newReservation;
                    await db.collection("bookings").doc(newId).set(data);
                } catch (fsErr) {
                    console.warn("Falha ao salvar reserva no Firebase (continuando localmente):", fsErr);
                }
            }
            this.db.bookings.push(newReservation);
            this.saveDatabase();

            this.showToast("Reserva salva com sucesso!");
            this.closeModal("modal-reserve");
            this.formReserve.reset();
            this.renderCatalog();
            this.renderAdminCatalog();

            // Redirect to WhatsApp Link
            let stockWarningText = "";
            if (product.stock !== null && product.stock !== undefined) {
                if (product.stock === 0) {
                    stockWarningText = `\n\n🚨 *[ALERTA DE ESTOQUE]* O estoque do produto *${product.name}* acaba de *ESGOTAR* (0 unidades restantes)!`;
                } else if (product.stock <= 5) {
                    stockWarningText = `\n\n⚠️ *[ALERTA DE ESTOQUE]* O estoque do produto *${product.name}* está baixo (restam apenas *${product.stock}* unidades)!`;
                }
            }

            const message = `Olá! Gostaria de reservar o produto no catálogo:\n\n` +
                            `🆔 *Pedido:* #${orderNum}\n` +
                            `🎁 *Produto:* ${product.name}\n` +
                            `🔢 *Quantidade:* ${qtyVal} unidade(s)\n` +
                            `💰 *Total:* R$ ${this.formatPrice(totalCost)}\n` +
                            `👤 *Reservado por:* ${nameVal}\n` +
                            `📞 *Contato:* ${this.formatPhoneDisplay(phoneVal)}\n\n` +
                            `Vou retirar na loja física!${stockWarningText}`;

            const waUrl = `https://api.whatsapp.com/send?phone=${this.db.settings.phone}&text=${encodeURIComponent(message)}`;
            
            setTimeout(() => {
                this.pendingWaUrl = waUrl;
                this.openModal("modal-delivery-checkout");
            }, 800);
        } catch (err) {
            console.error("Failed to save reservation", err);
            this.showToast("Erro ao processar a reserva.", "error");
        }
    }

    // Admin Dashboard Authorization
    async handleAdminLogin(e) {
        e.preventDefault();
        const email = document.getElementById("admin-email").value.trim();
        const pass = document.getElementById("admin-password").value;

        if (isFirebaseConfigured) {
            try {
                this.showToast("Autenticando...");
                await auth.signInWithEmailAndPassword(email, pass);
                sessionStorage.setItem("admin_logged_in", "true");
                this.closeModal("modal-admin-login");
                this.formAdminLogin.reset();
                this.openAdminDashboard();
                this.showToast("Acesso administrativo autorizado!");
            } catch (err) {
                console.error("Firebase Auth Error:", err);
                this.showToast("E-mail ou senha incorretos!", "error");
            }
        } else {
            if (email === "admin@admin.com" && pass === "admin") {
                sessionStorage.setItem("admin_logged_in", "true");
                this.closeModal("modal-admin-login");
                this.formAdminLogin.reset();
                this.openAdminDashboard();
                this.showToast("Acesso administrativo (Modo local)!");
            } else {
                this.showToast("E-mail ou senha incorretos!", "error");
            }
        }
    }

    checkAdminSession() {
        if (isFirebaseConfigured) {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    sessionStorage.setItem("admin_logged_in", "true");
                    this.btnAdminOpen.innerHTML = `<i class="fa-solid fa-unlock-keyhole"></i> Painel Ativo`;
                } else {
                    sessionStorage.removeItem("admin_logged_in");
                    this.btnAdminOpen.innerHTML = `<i class="fa-solid fa-lock"></i> Painel Admin`;
                    this.adminDashboard.classList.remove("active");
                }
            });
        } else {
            if (sessionStorage.getItem("admin_logged_in") === "true") {
                this.btnAdminOpen.innerHTML = `<i class="fa-solid fa-unlock-keyhole"></i> Painel Ativo`;
            }
        }
    }

    openAdminDashboard() {
        this.adminDashboard.classList.add("active");
        this.renderAdminCatalog();
        this.renderAdminBookings();
        this.renderStockAlerts();
    }

    async handleAdminLogout() {
        if (isFirebaseConfigured) {
            try {
                await auth.signOut();
            } catch (err) {
                console.error("Firebase SignOut Error:", err);
            }
        }
        sessionStorage.removeItem("admin_logged_in");
        this.adminDashboard.classList.remove("active");
        this.btnAdminOpen.innerHTML = `<i class="fa-solid fa-lock"></i> Painel Admin`;
        this.showToast("Sessão administrativa encerrada.");
    }

    // Update branding and general parameters
    async handleSettingsSubmit(e) {
        e.preventDefault();

        this.db.settings.storeName = document.getElementById("settings-store-name").value.trim();
        this.db.settings.badge = document.getElementById("settings-badge").value.trim();
        this.db.settings.storeDesc = document.getElementById("settings-description").value.trim();
        this.db.settings.phone = this.cleanPhoneNumber(document.getElementById("settings-phone").value);
        this.db.settings.instagram = document.getElementById("settings-instagram").value.replace("@", "").trim();
        this.db.settings.address = document.getElementById("settings-address").value.trim();
        this.db.settings.mapsUrl = document.getElementById("settings-maps-url").value.trim();
        this.db.settings.theme = document.getElementById("settings-theme").value;

        // Schedule inputs
        this.db.settings.hoursWeekdayStart = document.getElementById("settings-hours-weekday-start").value;
        this.db.settings.hoursWeekdayEnd = document.getElementById("settings-hours-weekday-end").value;
        this.db.settings.hoursSaturdayStart = document.getElementById("settings-hours-sat-start").value;
        this.db.settings.hoursSaturdayEnd = document.getElementById("settings-hours-sat-end").value;
        this.db.settings.hoursSundayOpen = document.getElementById("settings-hours-sun-open").checked;
        this.db.settings.hoursSundayStart = document.getElementById("settings-hours-sun-start").value;
        this.db.settings.hoursSundayEnd = document.getElementById("settings-hours-sun-end").value;

        const bannerFile = document.getElementById("settings-banner-file").files[0];
        const featureFile = document.getElementById("settings-feature-file").files[0];

        try {
            if (bannerFile) {
                this.showToast("Processando mídia do banner...");
                this.db.settings.bannerUrl = await this.processUploadFile(bannerFile);
            } else {
                this.db.settings.bannerUrl = document.getElementById("settings-banner-url").value.trim();
            }

            if (featureFile) {
                this.showToast("Processando mídia de destaque...");
                this.db.settings.featureUrl = await this.processUploadFile(featureFile);
            } else {
                this.db.settings.featureUrl = document.getElementById("settings-feature-url").value.trim();
            }

            if (isFirebaseConfigured) {
                await db.collection("settings").doc("store").set(this.db.settings);
            }
            this.saveDatabase();
            this.applyBranding();
            this.renderCatalog();
            this.showToast("Configurações salvas com sucesso!");
        } catch (err) {
            console.error("Failed to save settings", err);
            this.showToast(err.message || "Erro ao salvar as configurações.", "error");
        }
    }

    // Catalog Administration Form logic
    openCatalogFormModal(itemId = null) {
        this.formCatalogItem.reset();
        if (this.catalogItemImageFile) this.catalogItemImageFile.value = "";

        const categorySelect = document.getElementById("catalog-item-category-id");
        const categories = this.db.settings.categories || [];

        // Sync stock field visibility helper
        const syncStockVisibility = () => {
            if (!categorySelect) return;
            const catId = categorySelect.value;
            const activeCat = categories.find(c => c.id === catId);
            const isProduct = activeCat && activeCat.type === "produto";
            const groupStock = document.getElementById("group-item-stock");
            if (groupStock) {
                groupStock.style.display = isProduct ? "block" : "none";
            }
        };

        if (categorySelect) {
            categorySelect.innerHTML = "";
            categories.forEach(cat => {
                const opt = document.createElement("option");
                opt.value = cat.id;
                opt.textContent = `${cat.name} (${cat.type === 'servico' ? 'Contato' : 'Reserva'})`;
                categorySelect.appendChild(opt);
            });

            categorySelect.removeEventListener("change", categorySelect._syncFn);
            categorySelect._syncFn = syncStockVisibility;
            categorySelect.addEventListener("change", syncStockVisibility);
            syncStockVisibility();
        }
        
        if (itemId) {
            const item = this.db.catalog.find(i => i.id === itemId);
            if (!item) return;
            
            this.catalogFormTitle.textContent = "Editar Item";
            this.catalogItemId.value = item.id;
            document.getElementById("catalog-item-name").value = item.name;
            document.getElementById("catalog-item-price").value = item.price;
            document.getElementById("catalog-item-image").value = item.image;
            document.getElementById("catalog-item-description").value = item.description;

            const stockVal = item.stock !== undefined && item.stock !== null ? item.stock : "";
            document.getElementById("catalog-item-stock").value = stockVal;

            // Preselect correct category ID option based on name match
            const catObj = (this.db.settings.categories || []).find(c => c.name === item.category);
            if (catObj && categorySelect) {
                categorySelect.value = catObj.id;
                syncStockVisibility(); // Trigger explicit visibility check
            }
        } else {
            this.catalogFormTitle.textContent = "Novo Item no Catálogo";
            this.catalogItemId.value = "";
            document.getElementById("catalog-item-stock").value = "";
        }

        this.openModal("modal-catalog-form");
    }

    async handleCatalogFormSubmit(e) {
        e.preventDefault();

        const id = this.catalogItemId.value;
        const name = document.getElementById("catalog-item-name").value.trim();
        const categoryId = document.getElementById("catalog-item-category-id").value;
        const price = parseFloat(document.getElementById("catalog-item-price").value);
        let imageUrl = document.getElementById("catalog-item-image").value.trim();
        const description = document.getElementById("catalog-item-description").value.trim();

        // Resolve type and category name from selected category metadata
        const categories = this.db.settings.categories || [];
        const selectedCat = categories.find(c => c.id === categoryId) || { name: "Geral", type: "produto" };
        const type = selectedCat.type;
        const category = selectedCat.name;

        const stockInput = document.getElementById("catalog-item-stock").value;
        const stock = type === "produto" && stockInput !== "" ? parseInt(stockInput) : null;

        const file = this.catalogItemImageFile && this.catalogItemImageFile.files[0];

        try {
            if (file) {
                this.showToast("Processando arquivo de mídia...");
                imageUrl = await this.processUploadFile(file);
            }

            if (!imageUrl) {
                imageUrl = "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&q=80&w=400";
            }

            if (id) {
                // Edit mode
                const index = this.db.catalog.findIndex(i => i.id === id);
                if (index !== -1) {
                    const updatedItem = { id, name, type, price, category, image: imageUrl, description, stock };
                    this.db.catalog[index] = updatedItem;
                    
                    if (isFirebaseConfigured) {
                        const { id: _, ...data } = updatedItem;
                        await db.collection("catalog").doc(id).set(data);
                    }
                    this.showToast("Item atualizado no catálogo!");
                }
            } else {
                // New mode
                const newId = "c_" + Date.now();
                const newItem = {
                    id: newId,
                    name, type, price, category, image: imageUrl, description, stock
                };
                
                if (isFirebaseConfigured) {
                    const { id: _, ...data } = newItem;
                    await db.collection("catalog").doc(newId).set(data);
                }
                this.db.catalog.push(newItem);
                this.showToast("Novo item inserido no catálogo!");
            }

            this.saveDatabase();
            this.closeModal("modal-catalog-form");
            this.renderCatalog();
            this.renderAdminCatalog();
            this.renderStockAlerts();
        } catch (err) {
            console.error("Failed to save catalog item", err);
            this.showToast(err.message || "Erro ao salvar o item.", "error");
        }
    }

    async deleteCatalogItem(itemId) {
        if (confirm("Deseja realmente excluir este item do catálogo?")) {
            try {
                if (isFirebaseConfigured) {
                    await db.collection("catalog").doc(itemId).delete();
                }
                this.db.catalog = this.db.catalog.filter(i => i.id !== itemId);
                this.saveDatabase();
                this.renderCatalog();
                this.renderAdminCatalog();
                this.renderStockAlerts();
                this.showToast("Item removido do catálogo.", "error");
            } catch (err) {
                console.error("Failed to delete item", err);
                this.showToast("Erro ao remover o item.", "error");
            }
        }
    }

    async deleteBooking(bookingId) {
        if (confirm("Confirmar a exclusão deste agendamento/reserva?")) {
            try {
                const booking = this.db.bookings.find(b => b.id === bookingId);
                if (booking && booking.type === "produto" && booking.status === "pendente") {
                    let product = this.db.catalog.find(p => p.id === booking.productId);
                    if (!product && booking.itemName) {
                        product = this.db.catalog.find(p => booking.itemName.startsWith(p.name));
                    }
                    let qty = booking.qty;
                    if (!qty && booking.itemName) {
                        const match = booking.itemName.match(/\((\d+)x\)/);
                        qty = match ? parseInt(match[1]) : 1;
                    }

                    if (product && product.stock !== null && product.stock !== undefined) {
                        product.stock += qty;
                        product.reserved = Math.max(0, (product.reserved || 0) - qty);
                        
                        if (isFirebaseConfigured) {
                            try {
                                await db.collection("catalog").doc(product.id).set({ stock: product.stock, reserved: product.reserved }, { merge: true });
                            } catch (fsErr) {
                                console.warn("Failed to sync stock restoration on deletion to Firestore:", fsErr);
                            }
                        }
                    }
                }

                if (isFirebaseConfigured) {
                    await db.collection("bookings").doc(bookingId).delete();
                }
                this.db.bookings = this.db.bookings.filter(b => b.id !== bookingId);
                this.saveDatabase();
                
                this.renderCatalog();
                this.renderAdminCatalog();
                this.renderAdminBookings();
                this.renderStockAlerts();
                this.showToast("Registro excluído com estorno de estoque.", "error");
            } catch (err) {
                console.error("Failed to delete booking", err);
                this.showToast("Erro ao excluir o registro.", "error");
            }
        }
    }

    async confirmBooking(bookingId) {
        try {
            const booking = this.db.bookings.find(b => b.id === bookingId);
            if (!booking) return;

            if (booking.type === "produto") {
                let product = this.db.catalog.find(p => p.id === booking.productId);
                if (!product && booking.itemName) {
                    product = this.db.catalog.find(p => booking.itemName.startsWith(p.name));
                }
                let qty = booking.qty;
                if (!qty && booking.itemName) {
                    const match = booking.itemName.match(/\((\d+)x\)/);
                    qty = match ? parseInt(match[1]) : 1;
                }

                if (product && product.stock !== null && product.stock !== undefined) {
                    product.reserved = Math.max(0, (product.reserved || 0) - qty);
                    
                    if (isFirebaseConfigured) {
                        try {
                            await db.collection("catalog").doc(product.id).set({ reserved: product.reserved }, { merge: true });
                        } catch (fsErr) {
                            console.warn("Failed to sync stock reservation settlement to Firestore:", fsErr);
                        }
                    }
                }
            }

            booking.status = "confirmado";
            
            if (isFirebaseConfigured) {
                try {
                    const { id, ...data } = booking;
                    await db.collection("bookings").doc(bookingId).set(data);
                } catch (fsErr) {
                    console.warn("Failed to sync booking status confirmation to Firestore:", fsErr);
                }
            }

            this.saveDatabase();
            this.renderCatalog();
            this.renderAdminCatalog();
            this.renderAdminBookings();
            this.renderStockAlerts();
            this.showToast("Reserva confirmada e estoque finalizado com sucesso!");
        } catch (err) {
            console.error("Failed to confirm booking", err);
            this.showToast("Erro ao confirmar a reserva.", "error");
        }
    }

    // Toast Alert notification helper
    showToast(message, type = "success") {
        const container = document.getElementById("toast-container");
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        
        const icon = type === "success" 
            ? '<i class="fa-solid fa-circle-check toast-icon"></i>' 
            : '<i class="fa-solid fa-circle-exclamation toast-icon"></i>';

        toast.innerHTML = `
            ${icon}
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add("show"), 10);

        // Animate out & remove
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // Text Formatting Helpers
    formatPrice(value) {
        return Number(value).toFixed(2).replace(".", ",");
    }

    formatDateBR(dateStr) {
        if (!dateStr) return "";
        const parts = dateStr.split("-");
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateStr;
    }

    cleanPhoneNumber(phoneStr) {
        // Strip everything except numbers
        let clean = phoneStr.replace(/\D/g, "");
        // If it does not start with Brazil code '55' and has standard length, prepend it
        if (clean.length === 10 || clean.length === 11) {
            clean = "55" + clean;
        }
        return clean;
    }

    formatPhoneDisplay(phoneStr) {
        // E.g. 5511999999999 to (11) 99999-9999
        let num = phoneStr;
        if (num.startsWith("55")) num = num.substring(2);
        
        if (num.length === 11) {
            return `(${num.substring(0, 2)}) ${num.substring(2, 7)}-${num.substring(7)}`;
        } else if (num.length === 10) {
            return `(${num.substring(0, 2)}) ${num.substring(2, 6)}-${num.substring(6)}`;
        }
        return phoneStr;
    }

    isVideo(url) {
        if (!url) return false;
        return url.startsWith("data:video/") || 
               url.endsWith(".mp4") || 
               url.endsWith(".webm") || 
               url.endsWith(".mov") || 
               url.includes(".mp4?") || 
               url.includes(".webm?") || 
               url.includes(".mov?");
    }

    processUploadFile(file, maxWidth = 600, maxHeight = 600, quality = 0.7) {
        return new Promise((resolve, reject) => {
            const isVideo = file.type.startsWith("video/");
            const isGif = file.type === "image/gif";

            if (isVideo) {
                // Video limit size check: 900KB
                if (file.size > 900 * 1024) {
                    return reject(new Error("Vídeos locais devem ter menos de 900KB. Para vídeos maiores, use link de URL externo no campo abaixo."));
                }
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (event) => resolve(event.target.result);
                reader.onerror = () => reject(new Error("Erro ao ler o arquivo de vídeo do dispositivo."));
                return;
            }

            if (isGif) {
                // GIF limit size check: 800KB
                if (file.size > 800 * 1024) {
                    return reject(new Error("GIFs locais devem ter menos de 800KB. Para GIFs maiores, use link de URL externo no campo abaixo."));
                }
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (event) => resolve(event.target.result);
                reader.onerror = () => reject(new Error("Erro ao ler o arquivo de imagem GIF."));
                return;
            }

            // Normal image resizing/compression (JPG/PNG/WEBP)
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = Math.round((width * maxHeight) / height);
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL("image/jpeg", quality);
                    resolve(dataUrl);
                };
                img.onerror = () => reject(new Error("Formato de imagem não suportado. Use JPG, PNG ou WEBP."));
            };
            reader.onerror = () => reject(new Error("Erro ao ler o arquivo de imagem do dispositivo."));
        });
    }

    renderFilters() {
        const container = document.querySelector(".catalog-filters");
        if (!container) return;
        
        const categories = this.db.settings.categories || [];
        
        // Start with "Todos" button
        let html = `<button class="filter-btn ${this.activeFilter === 'all' ? 'active' : ''}" data-filter="all">Todos</button>`;
        
        categories.forEach(cat => {
            const activeClass = this.activeFilter === cat.name ? 'active' : '';
            html += `<button class="filter-btn ${activeClass}" data-filter="${cat.name}">${cat.name}</button>`;
        });
        
        container.innerHTML = html;
        
        // Rebind filter buttons
        container.querySelectorAll(".filter-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                container.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                this.activeFilter = btn.dataset.filter;
                this.renderCatalog();
            });
        });
    }

    renderAdminCategories() {
        const listContainer = document.getElementById("admin-categories-list");
        if (!listContainer) return;
        
        listContainer.innerHTML = "";
        const categories = this.db.settings.categories || [];
        
        if (categories.length === 0) {
            listContainer.innerHTML = `<span style="color: var(--text-secondary); font-size: 0.85rem; text-align: center; padding: 10px 0;">Nenhuma categoria criada.</span>`;
            return;
        }
        
        categories.forEach(cat => {
            const div = document.createElement("div");
            div.style.display = "flex";
            div.style.justifyContent = "space-between";
            div.style.alignItems = "center";
            div.style.background = "rgba(255, 255, 255, 0.02)";
            div.style.padding = "6px 12px";
            div.style.borderRadius = "6px";
            div.style.border = "1px solid var(--card-border)";
            
            div.innerHTML = `
                <span style="font-size: 0.85rem; font-weight: 500;">${cat.name} <small style="color: var(--text-secondary); font-size: 0.75rem;">(${cat.type === 'servico' ? 'Contato' : 'Reserva'})</small></span>
                <button type="button" class="btn-delete-cat" data-id="${cat.id}" style="background: transparent; border: none; color: #ef4444; cursor: pointer; padding: 4px;"><i class="fa-solid fa-trash-can"></i></button>
            `;
            
            listContainer.appendChild(div);
        });
        
        // Bind category delete triggers
        listContainer.querySelectorAll(".btn-delete-cat").forEach(btn => {
            btn.addEventListener("click", () => this.deleteCategory(btn.dataset.id));
        });
    }

    deleteCategory(catId) {
        const categories = this.db.settings.categories || [];
        if (categories.length <= 1) {
            this.showToast("Você precisa manter pelo menos uma categoria ativa!", "error");
            return;
        }
        
        const catToDelete = categories.find(c => c.id === catId);
        if (confirm(`Deseja realmente excluir a categoria "${catToDelete.name}"? Os itens vinculados a ela não serão excluídos, mas você precisará reclassificá-los.`)) {
            this.db.settings.categories = categories.filter(c => c.id !== catId);
            
            // Sync categories deletion to Firebase Firestore settings document if connected
            if (isFirebaseConfigured) {
                db.collection("settings").doc("store").set(this.db.settings).catch(err => {
                    console.error("Failed to sync categories deletion to Firestore", err);
                });
            }
            this.saveDatabase();
            this.renderAdminCategories();
            this.renderFilters();
            this.renderCatalog();
            this.showToast("Categoria removida.", "error");
        }
    }

    addCategory() {
        const nameInput = document.getElementById("new-category-name");
        const typeInput = document.getElementById("new-category-type");
        
        if (!nameInput || !typeInput) return;
        
        const name = nameInput.value.trim();
        const type = typeInput.value;
        
        if (!name) {
            this.showToast("Digite o nome da categoria!", "error");
            return;
        }
        
        const categories = this.db.settings.categories || [];
        const exists = categories.some(c => c.name.toLowerCase() === name.toLowerCase());
        
        if (exists) {
            this.showToast("Essa categoria já existe!", "error");
            return;
        }
        
        const newCat = {
            id: "cat_" + Date.now(),
            name,
            type
        };
        
        this.db.settings.categories = [...categories, newCat];
        
        // Sync categories addition to Firebase Firestore settings document if connected
        if (isFirebaseConfigured) {
            db.collection("settings").doc("store").set(this.db.settings).catch(err => {
                console.error("Failed to sync categories addition to Firestore", err);
            });
        }
        this.saveDatabase();
        
        nameInput.value = "";
        this.renderAdminCategories();
        this.renderFilters();
        this.showToast(`Categoria "${name}" adicionada com sucesso!`);
    }

    renderStockAlerts() {
        const alertBox = document.getElementById("admin-stock-alerts");
        const alertList = document.getElementById("admin-stock-alerts-list");
        if (!alertBox || !alertList) return;

        alertList.innerHTML = "";
        const lowStockItems = this.db.catalog.filter(item => 
            item.type === "produto" && 
            item.stock !== null && 
            item.stock !== undefined && 
            item.stock <= 5
        );
        
        if (lowStockItems.length > 0) {
            alertBox.style.display = "block";
            lowStockItems.forEach(item => {
                const isZero = parseInt(item.stock) === 0;
                const alertHtml = isZero 
                    ? `<div style="color: #ef4444; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; gap: 6px;"><i class="fa-solid fa-circle-xmark"></i> O produto <strong>${item.name}</strong> está com estoque ESGOTADO (0 unidades)!</div>`
                    : `<div style="color: #f59e0b; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; gap: 6px;"><i class="fa-solid fa-circle-exclamation"></i> O produto <strong>${item.name}</strong> está com estoque baixo (apenas ${item.stock} unidades restantes)!</div>`;
                alertList.innerHTML += alertHtml;
            });
        } else {
            alertBox.style.display = "none";
        }
    }
}

// Instantiate the App on Page Load
document.addEventListener("DOMContentLoaded", () => {
    window.appInstance = new LocalBizApp();
});
