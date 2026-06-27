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
        theme: "barber-dark"
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

// Available Time Slots for Booking
const TIME_SLOTS = [
    "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

// App State Management
class LocalBizApp {
    constructor() {
        this.db = this.loadDatabase();
        this.activeFilter = "all";
        this.selectedTheme = this.db.settings.theme || "barber-dark";
        this.initDOM();
        this.applyBranding();
        this.renderCatalog();
        this.setupEventListeners();
        this.checkAdminSession();
    }

    loadDatabase() {
        const stored = localStorage.getItem("local_biz_db");
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Error parsing database, falling back to mock details.", e);
            }
        }
        // Save initial default database to localStorage
        localStorage.setItem("local_biz_db", JSON.stringify(DEFAULT_DB));
        return JSON.parse(JSON.stringify(DEFAULT_DB));
    }

    saveDatabase() {
        localStorage.setItem("local_biz_db", JSON.stringify(this.db));
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
        
        // Catalog Form bindings
        this.modalCatalogForm = document.getElementById("modal-catalog-form");
        this.formCatalogItem = document.getElementById("form-catalog-item");
        this.catalogFormTitle = document.getElementById("catalog-form-title");
        this.btnCatalogAdd = document.getElementById("btn-catalog-add");
        this.catalogItemId = document.getElementById("catalog-item-id");

        // Setup Copyright Year
        if (this.yearCopy) this.yearCopy.textContent = new Date().getFullYear();
    }

    applyBranding() {
        const s = this.db.settings;

        // Apply Theme Stylesheet Class
        document.body.className = `theme-${s.theme}`;

        // Top Header
        if (this.logoText) {
            let icon = "fa-scissors";
            if (s.theme === "rose-gold") icon = "fa-sparkles";
            if (s.theme === "emerald-spa") icon = "fa-spa";
            if (s.theme === "cyberpunk") icon = "fa-bolt-lightning";
            this.logoText.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${s.storeName}</span>`;
        }

        // Hero Content
        if (this.heroBannerImage) this.heroBannerImage.style.backgroundImage = `url('${s.bannerUrl}')`;
        if (this.heroBadge) this.heroBadge.textContent = s.badge;
        
        // Highlight logic for the last word of title
        if (this.heroTitle) {
            const titleWords = s.storeName.split(" ");
            const lastWord = titleWords[titleWords.length - 1];
            const startPhrase = s.storeName.substring(0, s.storeName.length - lastWord.length);
            this.heroTitle.innerHTML = `${startPhrase}<span>${lastWord}</span>`;
        }
        if (this.heroDesc) this.heroDesc.textContent = s.storeDesc;
        if (this.heroFeatureImage) this.heroFeatureImage.src = s.featureUrl;

        // Footer Content
        if (this.footerStoreName) this.footerStoreName.textContent = s.storeName;
        if (this.footerStoreDesc) this.footerStoreDesc.textContent = s.storeDesc;
        if (this.footerPhone) this.footerPhone.textContent = this.formatPhoneDisplay(s.phone);
        if (this.footerAddress) this.footerAddress.textContent = s.address;
        if (this.copyrightBrand) this.copyrightBrand.textContent = s.storeName;

        // Contact links
        if (this.socialWhatsapp) this.socialWhatsapp.href = `https://wa.me/${s.phone}`;
        if (this.socialInstagram) this.socialInstagram.href = `https://instagram.com/${s.instagram}`;
        if (this.socialFacebook) this.socialFacebook.href = `https://facebook.com`;
        if (this.btnGoogleMaps) this.btnGoogleMaps.href = s.mapsUrl;

        // Admin Customization Inputs Sync
        document.getElementById("settings-store-name").value = s.storeName;
        document.getElementById("settings-badge").value = s.badge;
        document.getElementById("settings-description").value = s.storeDesc;
        document.getElementById("settings-banner-url").value = s.bannerUrl;
        document.getElementById("settings-feature-url").value = s.featureUrl;
        document.getElementById("settings-phone").value = s.phone;
        document.getElementById("settings-instagram").value = s.instagram;
        document.getElementById("settings-address").value = s.address;
        document.getElementById("settings-maps-url").value = s.mapsUrl;
        document.getElementById("settings-theme").value = s.theme;

        // Select Theme Option visually
        document.querySelectorAll(".theme-option").forEach(opt => {
            if (opt.dataset.theme === s.theme) {
                opt.classList.add("selected");
            } else {
                opt.classList.remove("selected");
            }
        });
    }

    renderCatalog() {
        if (!this.catalogGrid) return;
        this.catalogGrid.innerHTML = "";

        const filtered = this.db.catalog.filter(item => {
            if (this.activeFilter === "all") return true;
            return item.type === this.activeFilter;
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
            const actionText = isService ? "Agendar Horário" : "Reservar e Retirar";
            const actionIcon = isService ? "fa-calendar-days" : "fa-bag-shopping";
            const actionClass = isService ? "btn-booking-trigger" : "btn-reserve-trigger";

            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${item.image}" alt="${item.name}" class="card-img" onerror="this.src='https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&q=80&w=400'">
                    <span class="badge" style="position: absolute; top: 12px; left: 12px; z-index: 5;">${item.category}</span>
                </div>
                <div class="card-body">
                    <h3 class="card-title">${item.name}</h3>
                    <p class="card-desc">${item.description}</p>
                    <div class="card-footer">
                        <span class="card-price">R$ ${this.formatPrice(item.price)}</span>
                        <button class="btn-primary ${actionClass}" data-id="${item.id}" style="padding: 8px 16px; font-size: 0.85rem;">
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
                    <img src="${item.image}" alt="${item.name}" class="card-img" onerror="this.src='https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&q=80&w=400'">
                    <span class="badge" style="position: absolute; top: 8px; left: 8px;">${item.category}</span>
                </div>
                <div class="card-body" style="padding: 16px;">
                    <span style="font-size: 0.75rem; color: var(--accent-color); font-weight:600; text-transform: uppercase;">${typeLabel}</span>
                    <h4 style="margin: 4px 0 8px 0; font-size: 1.05rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.name}</h4>
                    <span class="card-price" style="font-size: 1.1rem;">R$ ${this.formatPrice(item.price)}</span>
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

        const list = this.db.bookings || [];
        
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
            const waMsg = encodeURIComponent(`Olá ${booking.clientName}! Estou entrando em contato sobre o seu agendamento de ${booking.itemName}.`);
            const waLink = `https://wa.me/${booking.phone}?text=${waMsg}`;

            tr.innerHTML = `
                <td><strong>${booking.clientName}</strong><br><small style="color:var(--text-secondary);">${booking.notes || 'Sem observações'}</small></td>
                <td>${this.formatPhoneDisplay(booking.phone)}</td>
                <td>${typeLabel}</td>
                <td>${booking.itemName}</td>
                <td>${detailText}</td>
                <td>
                    <a href="${waLink}" target="_blank" class="table-action-btn whatsapp" title="Falar no WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
                    <button class="table-action-btn delete btn-delete-booking" data-id="${booking.id}" title="Excluir Registro"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            rows.appendChild(tr);
        });

        rows.querySelectorAll(".btn-delete-booking").forEach(btn => {
            btn.addEventListener("click", (e) => this.deleteBooking(e.currentTarget.dataset.id));
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

    handleBookingSubmit(e) {
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

        // Save to Database
        const newBooking = {
            id: "b_" + Date.now(),
            clientName: nameVal,
            phone: phoneVal,
            type: "servico",
            itemName: service.name,
            dateVal: dateVal,
            timeVal: timeVal,
            notes: notesVal
        };

        this.db.bookings.push(newBooking);
        this.saveDatabase();

        this.showToast("Agendamento salvo com sucesso!");
        this.closeModal("modal-booking");
        this.formBooking.reset();

        // Redirect to WhatsApp Link
        const formattedDate = this.formatDateBR(dateVal);
        const message = `Olá! Gostaria de confirmar meu agendamento:\n\n` +
                        `🔹 *Serviço:* ${service.name}\n` +
                        `📅 *Data:* ${formattedDate}\n` +
                        `⏰ *Horário:* ${timeVal}\n` +
                        `👤 *Nome:* ${nameVal}\n` +
                        `📞 *Contato:* ${this.formatPhoneDisplay(phoneVal)}` +
                        (notesVal ? `\n📝 *Notas:* ${notesVal}` : "");

        const waUrl = `https://api.whatsapp.com/send?phone=${this.db.settings.phone}&text=${encodeURIComponent(message)}`;
        
        setTimeout(() => {
            window.open(waUrl, "_blank");
        }, 800);
    }

    openReserveModal(productId) {
        const product = this.db.catalog.find(item => item.id === productId);
        if (!product) return;

        this.reserveProductId.value = product.id;
        this.reserveProductImg.src = product.image;
        this.reserveProductImg.onerror = () => { this.reserveProductImg.src = "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&q=80&w=400" };
        this.reserveProductName.textContent = product.name;
        this.reserveProductPrice.textContent = `R$ ${this.formatPrice(product.price)}`;
        
        document.getElementById("reserve-qty").value = "1";

        this.openModal("modal-reserve");
    }

    handleReserveSubmit(e) {
        e.preventDefault();

        const productId = this.reserveProductId.value;
        const product = this.db.catalog.find(p => p.id === productId);
        const nameVal = document.getElementById("reserve-name").value.trim();
        const phoneVal = this.cleanPhoneNumber(document.getElementById("reserve-phone").value);
        const qtyVal = parseInt(document.getElementById("reserve-qty").value);

        const totalCost = product.price * qtyVal;

        // Save to Database
        const newReservation = {
            id: "r_" + Date.now(),
            clientName: nameVal,
            phone: phoneVal,
            type: "produto",
            itemName: `${product.name} (${qtyVal}x)`,
            dateVal: new Date().toISOString().split("T")[0],
            timeVal: "Reserva de Produto",
            notes: `Retirada agendada. Total: R$ ${this.formatPrice(totalCost)}`
        };

        this.db.bookings.push(newReservation);
        this.saveDatabase();

        this.showToast("Reserva salva com sucesso!");
        this.closeModal("modal-reserve");
        this.formReserve.reset();

        // Redirect to WhatsApp Link
        const message = `Olá! Gostaria de reservar o produto no catálogo:\n\n` +
                        `🎁 *Produto:* ${product.name}\n` +
                        `🔢 *Quantidade:* ${qtyVal} unidade(s)\n` +
                        `💰 *Total:* R$ ${this.formatPrice(totalCost)}\n` +
                        `👤 *Reservado por:* ${nameVal}\n` +
                        `📞 *Contato:* ${this.formatPhoneDisplay(phoneVal)}\n\n` +
                        `Vou retirar na loja física!`;

        const waUrl = `https://api.whatsapp.com/send?phone=${this.db.settings.phone}&text=${encodeURIComponent(message)}`;
        
        setTimeout(() => {
            window.open(waUrl, "_blank");
        }, 800);
    }

    // Admin Dashboard Authorization
    handleAdminLogin(e) {
        e.preventDefault();
        const pass = document.getElementById("admin-password").value;
        if (pass === "admin") {
            sessionStorage.setItem("admin_logged_in", "true");
            this.closeModal("modal-admin-login");
            this.formAdminLogin.reset();
            this.openAdminDashboard();
        } else {
            this.showToast("Senha incorreta. Tente novamente!", "error");
        }
    }

    checkAdminSession() {
        if (sessionStorage.getItem("admin_logged_in") === "true") {
            this.btnAdminOpen.innerHTML = `<i class="fa-solid fa-unlock-keyhole"></i> Painel Ativo`;
        }
    }

    openAdminDashboard() {
        this.adminDashboard.classList.add("active");
        this.renderAdminCatalog();
        this.renderAdminBookings();
    }

    handleAdminLogout() {
        sessionStorage.removeItem("admin_logged_in");
        this.adminDashboard.classList.remove("active");
        this.btnAdminOpen.innerHTML = `<i class="fa-solid fa-lock"></i> Painel Admin`;
        this.showToast("Sessão administrativa encerrada.");
    }

    // Update branding and general parameters
    handleSettingsSubmit(e) {
        e.preventDefault();

        this.db.settings.storeName = document.getElementById("settings-store-name").value.trim();
        this.db.settings.badge = document.getElementById("settings-badge").value.trim();
        this.db.settings.storeDesc = document.getElementById("settings-description").value.trim();
        this.db.settings.bannerUrl = document.getElementById("settings-banner-url").value.trim();
        this.db.settings.featureUrl = document.getElementById("settings-feature-url").value.trim();
        this.db.settings.phone = this.cleanPhoneNumber(document.getElementById("settings-phone").value);
        this.db.settings.instagram = document.getElementById("settings-instagram").value.replace("@", "").trim();
        this.db.settings.address = document.getElementById("settings-address").value.trim();
        this.db.settings.mapsUrl = document.getElementById("settings-maps-url").value.trim();
        this.db.settings.theme = document.getElementById("settings-theme").value;

        this.saveDatabase();
        this.applyBranding();
        this.renderCatalog();
        this.showToast("Configurações atualizadas com sucesso!");
    }

    // Catalog Administration Form logic
    openCatalogFormModal(itemId = null) {
        this.formCatalogItem.reset();
        
        if (itemId) {
            const item = this.db.catalog.find(i => i.id === itemId);
            if (!item) return;
            
            this.catalogFormTitle.textContent = "Editar Item";
            this.catalogItemId.value = item.id;
            document.getElementById("catalog-item-name").value = item.name;
            document.getElementById("catalog-item-type").value = item.type;
            document.getElementById("catalog-item-price").value = item.price;
            document.getElementById("catalog-item-category").value = item.category;
            document.getElementById("catalog-item-image").value = item.image;
            document.getElementById("catalog-item-description").value = item.description;
        } else {
            this.catalogFormTitle.textContent = "Novo Item no Catálogo";
            this.catalogItemId.value = "";
        }

        this.openModal("modal-catalog-form");
    }

    handleCatalogFormSubmit(e) {
        e.preventDefault();

        const id = this.catalogItemId.value;
        const name = document.getElementById("catalog-item-name").value.trim();
        const type = document.getElementById("catalog-item-type").value;
        const price = parseFloat(document.getElementById("catalog-item-price").value);
        const category = document.getElementById("catalog-item-category").value.trim();
        const image = document.getElementById("catalog-item-image").value.trim();
        const description = document.getElementById("catalog-item-description").value.trim();

        if (id) {
            // Edit mode
            const index = this.db.catalog.findIndex(i => i.id === id);
            if (index !== -1) {
                this.db.catalog[index] = { id, name, type, price, category, image, description };
                this.showToast("Item atualizado no catálogo!");
            }
        } else {
            // New mode
            const newItem = {
                id: "c_" + Date.now(),
                name, type, price, category, image, description
            };
            this.db.catalog.push(newItem);
            this.showToast("Novo item inserido no catálogo!");
        }

        this.saveDatabase();
        this.closeModal("modal-catalog-form");
        this.renderCatalog();
        this.renderAdminCatalog();
    }

    deleteCatalogItem(itemId) {
        if (confirm("Deseja realmente excluir este item do catálogo?")) {
            this.db.catalog = this.db.catalog.filter(i => i.id !== itemId);
            this.saveDatabase();
            this.renderCatalog();
            this.renderAdminCatalog();
            this.showToast("Item removido do catálogo.", "error");
        }
    }

    deleteBooking(bookingId) {
        if (confirm("Confirmar a exclusão deste agendamento/reserva?")) {
            this.db.bookings = this.db.bookings.filter(b => b.id !== bookingId);
            this.saveDatabase();
            this.renderAdminBookings();
            this.showToast("Registro excluído.", "error");
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
}

// Instantiate the App on Page Load
document.addEventListener("DOMContentLoaded", () => {
    window.appInstance = new LocalBizApp();
});
