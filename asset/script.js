document.addEventListener("DOMContentLoaded", () => {
    // ============================================
    //  MAGIC: LOAD RANDOM ITEMS FROM items/
    // ============================================
    const homeGrid = document.getElementById('home-items-grid');
    
    // Check if we are on the Home Page
    if (homeGrid) {
        
        // 1. Fetch the code from the items folder
        fetch('items/') 
            .then(response => response.text())
            .then(htmlText => {
                
                // 2. Convert text to real HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');
                
                // 3. Grab all ad-cards
                const allItems = Array.from(doc.querySelectorAll('.ad-card'));
                
                if (allItems.length > 0) {
                    // 4. Shuffle them randomly
                    const shuffled = allItems.sort(() => 0.5 - Math.random());
                    
                    // 5. Pick the first 15
                    const selected = shuffled.slice(0, 15);
                    
                    // 6. Inject them (AND FIX THE IMAGES)
                    homeGrid.innerHTML = ""; 
                    
                    selected.forEach(card => {
                        // --- IMAGE FIX START ---
                        const img = card.querySelector('img');
                        if (img) {
                            // Get the raw path (e.g., "../img/pic.png")
                            const rawSrc = img.getAttribute('src');
                            
                            // If it starts with "../", remove it so it becomes "img/pic.png"
                            if (rawSrc && rawSrc.startsWith('../')) {
                                img.setAttribute('src', rawSrc.replace('../', ''));
                            }
                        }
                        // --- IMAGE FIX END ---

                        homeGrid.appendChild(card);
                    });
                    
                } else {
                    homeGrid.innerHTML = "<p style='padding:10px; color:#777;'>No items found.</p>";
                }
            })
            .catch(err => {
                console.error("Error loading items:", err);
                homeGrid.innerHTML = "<p>Could not load items.</p>";
            });
            // ============================================
    //  MAGIC 2: LOAD RANDOM VENDORS FROM vendors/
    // ============================================
    const vendorGrid = document.getElementById('vendor-grid');

    // Only run if we are on the Home Page
    if (vendorGrid) {
        
        // 1. Fetch the code from the vendors folder
        fetch('vendors/') 
            .then(response => response.text())
            .then(htmlText => {
                
                // 2. Convert text to real HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');
                
                // 3. Grab all vendor-cards
                const allVendors = Array.from(doc.querySelectorAll('.vendor-card'));
                
                if (allVendors.length > 0) {
                    // 4. Shuffle them randomly
                    const shuffled = allVendors.sort(() => 0.5 - Math.random());
                    
                    // 5. Pick the first 15 (so it fits nicely)
                    const selected = shuffled.slice(0, 15);
                    
                    // 6. Clear the placeholder content
                    vendorGrid.innerHTML = ""; 
                    
                    selected.forEach(card => {
                        // --- FIX 1: IMAGES ---
                        // Changes "../img/person.png" to "img/person.png"
                        const img = card.querySelector('img');
                        if (img) {
                            const rawSrc = img.getAttribute('src');
                            if (rawSrc && rawSrc.startsWith('../')) {
                                img.setAttribute('src', rawSrc.replace('../', ''));
                            }
                        }

                        // --- FIX 2: BUTTON LINKS ---
                        // Changes onclick="window.location.href='../ID/V001/'" to "ID/V001/"
                        const btn = card.querySelector('button');
                        if (btn) {
                            const rawClick = btn.getAttribute('onclick');
                            if (rawClick && rawClick.includes('../')) {
                                btn.setAttribute('onclick', rawClick.replace('../', ''));
                            }
                        }

                        vendorGrid.appendChild(card);
                    });
                    
                } else {
                    vendorGrid.innerHTML = "<p style='padding:10px; color:#777;'>No vendors found.</p>";
                }
            })
            .catch(err => {
                console.error("Error loading vendors:", err);
                vendorGrid.innerHTML = "<p>Could not load vendors.</p>";
            });
    }
    }

    // ============================================
    //  WHATSAPP CHAT BUTTONS (Global Listener)
    // ============================================
    // This makes sure buttons work even on the randomly loaded items
    document.body.addEventListener('click', (e) => {
        // Check if clicked element is a Chat Button
        const btn = e.target.closest('.chat-btn');
        
        if (btn) {
            e.preventDefault(); // Stop it from jumping to top
            
            // Find the Product Name in the same card
            const card = btn.closest('.ad-card') || btn.closest('.profile-section');
            const title = card ? card.querySelector('.ad-title, .business-name').innerText.trim() : "this item";
            
            // Generate WhatsApp Link
            // Replace '2348123456789' with a real number or logic to fetch specific vendor numbers
            const waLink = `https://wa.me/2348123456789?text=${encodeURIComponent(`Hi, is "${title}" available?`)}`;
            
            window.open(waLink, '_blank');
        }
    });


    // ============================================
    //  GLOBAL & INDEX PAGE LOGIC (Existing Code)
    // ============================================

   // --- PROMO SYSTEM ---
    const promoData = {
        hasAd: true, 
        title: "Place Your Ad Here!",
        text: "DM us to place your ads here. Your ad will be featured on this screen for 24 hours!",
        img: "img/ads.png",  // Used your logo, or put "img/ads.png" if you have one
        link: "https://wa.me/2348144516127?text=I%20want%20to%20run%20ads%20on%20ADM"       // Directs them to the contact page to DM you
    };

    const modal = document.getElementById('promo-modal');
    if (modal && promoData.hasAd) {
        document.getElementById('modal-title').innerText = promoData.title;
        document.getElementById('modal-text').innerText = promoData.text;
        document.getElementById('modal-img').src = promoData.img;
        document.getElementById('modal-link').href = promoData.link;
        const closeBtn = document.querySelector('.close-modal');
        const notifBtn = document.getElementById('notif-btn');

        setTimeout(() => { modal.style.display = "flex"; }, 2000);

        closeBtn.addEventListener('click', () => {
            modal.style.display = "none";
            showBadge();
        });
        window.addEventListener('click', (e) => {
            if (e.target == modal) {
                modal.style.display = "none";
                showBadge();
            }
        });
        notifBtn.addEventListener('click', () => {
             modal.style.display = "flex";
        });
        function showBadge() {
            if (!document.querySelector('.badge')) {
                const badge = document.createElement('div');
                badge.className = 'badge';
                badge.innerText = '1';
                notifBtn.appendChild(badge);
            }
        }
    }

  // --- VENDOR GRID SHUFFLE (Index Page) ---
    const allVendors = [
        // 1. ADD THE "link" PROPERTY TO EACH VENDOR HERE
        // Make sure the path points to "ID/Foldername/index.html"
        
        { 
            id: "V000", 
            name: "Null", 
            cat: "category", 
            loc: "location", 
            img: "img/person.png", 
            link: "ID/V001/"  // <--- THIS IS THE NEW LINK
        },

        /* <-- START COMMENT HERE
        { 
          id: "V002", 
            name: "Mama Tee Food", 
            cat: "Food", 
            loc: "Student Centre", 
            img: "img/person.png", 
            link: "ID/V002/index.html" 
        },
        { 
            id: "V003", 
            name: "Styles by John", 
            cat: "Fashion", 
            loc: "Off Campus", 
            img: "img/person.png", 
            link: "ID/V003/index.html" 
        },

        END COMMENT HERE --> */
        // ... Add the rest of your vendors with their specific links ...
    ];

    const vendorGrid = document.getElementById('vendor-grid');
    if(vendorGrid) {
        // Shuffle & Render 4
        const shuffled = [...allVendors].sort(() => Math.random() - 0.5);
        
        function renderVendors(list) {
            vendorGrid.innerHTML = "";
            list.forEach(v => {
                vendorGrid.innerHTML += `
                <div class="vendor-card">
                    <img src="${v.img}" class="vendor-logo" alt="${v.name}">
                    <span class="vendor-id">${v.id}</span>
                    <div class="vendor-name">${v.name} <i class="fas fa-check-circle" style="color:#2d8eff; font-size:10px;"></i></div>
                    <div class="vendor-cat">${v.cat} | ${v.loc}</div>
                    
                    <button class="view-vendor-btn" onclick="window.location.href='${v.link}'">View Vendor</button>
                    
                </div>`;
            });
        }
        renderVendors(shuffled.slice(0, 4));

        const viewMoreBtn = document.getElementById('view-more-vendors');
        if(viewMoreBtn) {
            viewMoreBtn.addEventListener('click', () => {
                renderVendors(shuffled); // Show All
                viewMoreBtn.style.display = 'none';
            });
        }
    }

    // --- INDEX PAGE SEARCH ---
    const mainSearch = document.getElementById('main-search');
    if(mainSearch) {
        mainSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const type = document.getElementById('search-type').value;
            
            if(type === 'vendor') {
                const results = allVendors.filter(v => v.id.toLowerCase().includes(query) || v.name.toLowerCase().includes(query));
                if(vendorGrid) {
                    vendorGrid.innerHTML = "";
                    results.forEach(v => {
                        vendorGrid.innerHTML += `
                        <div class="vendor-card">
                            <img src="${v.img}" class="vendor-logo" alt="${v.name}">
                            <span class="vendor-id">${v.id}</span>
                            <div class="vendor-name">${v.name}</div>
                            <button class="view-vendor-btn" onclick="window.location.href='profile.html'">View</button>
                        </div>`;
                    });
                }
            } else {
                // Product Search
                document.querySelectorAll('.ad-card').forEach(card => {
                    const title = card.querySelector('.ad-title').innerText.toLowerCase();
                    card.style.display = title.includes(query) ? "block" : "none";
                });
            }
        });
    }

    // ============================================
    //  PAGE 2: CATEGORY/VENDOR LIST SEARCH LOGIC
    // ============================================
    
    const vendorSearchInput = document.getElementById('vendor-search');
    if(vendorSearchInput) {
        vendorSearchInput.addEventListener('input', (e) => {
            const searchText = e.target.value.toLowerCase();
            const vendorItems = document.querySelectorAll('.cat-item');
            
            vendorItems.forEach(item => {
                const name = item.querySelector('.cat-name').innerText.toLowerCase();
                const id = item.querySelector('.vendor-list-id').innerText.toLowerCase();
                
                // Check if Name OR ID matches
                if(name.includes(searchText) || id.includes(searchText)) {
                    item.style.display = "flex"; // Show
                } else {
                    item.style.display = "none"; // Hide
                }
            });
        });
    }

    // --- SHARED: SLIDER LOGIC ---
    const reviewSlider = document.getElementById('reviews-slider');
    if(reviewSlider) {
        let scrollAmount = 0;
        setInterval(() => {
            scrollAmount += 270;
            if (scrollAmount >= reviewSlider.scrollWidth - reviewSlider.clientWidth) scrollAmount = 0;
            reviewSlider.scrollTo({ top: 0, left: scrollAmount, behavior: 'smooth' });
        }, 3500);
    }

});

// ============================================
//  PAGE 3: FAQ ACCORDION & SEARCH
// ============================================

// 1. Accordion Logic (Click to Open)
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if(question){
        question.addEventListener('click', () => {
            // Close all others first
            faqItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });
            // Toggle current
            item.classList.toggle('active');
        });
    }
});

// 2. FAQ Search Logic
const faqSearch = document.getElementById('faq-search');
if (faqSearch) {
    faqSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        faqItems.forEach(item => {
            const questionText = item.querySelector('.faq-question span').innerText.toLowerCase();
            const answerText = item.querySelector('.faq-answer').innerText.toLowerCase();

            if (questionText.includes(query) || answerText.includes(query)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// --- INDEX PAGE SEARCH ---
    const mainSearch = document.getElementById('main-search');
    if(mainSearch) {
        
        // 1. Real-time Search Logic (Existing)
        mainSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const type = document.getElementById('search-type').value;
            
            if(type === 'vendor') {
                const results = allVendors.filter(v => v.id.toLowerCase().includes(query) || v.name.toLowerCase().includes(query));
                if(vendorGrid) {
                    vendorGrid.innerHTML = "";
                    results.forEach(v => {
                        vendorGrid.innerHTML += `
                        <div class="vendor-card">
                            <img src="${v.img}" class="vendor-logo" alt="${v.name}">
                            <span class="vendor-id">${v.id}</span>
                            <div class="vendor-name">${v.name}</div>
                            <button class="view-vendor-btn" onclick="window.location.href='profile.html'">View</button>
                        </div>`;
                    });
                }
            } else {
                // Product Search
                document.querySelectorAll('.ad-card').forEach(card => {
                    const title = card.querySelector('.ad-title').innerText.toLowerCase();
                    card.style.display = title.includes(query) ? "block" : "none";
                });
            }
        });

        // 2. KEYBOARD FIX: Close keyboard when "Enter" is pressed
        mainSearch.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                mainSearch.blur(); // This command closes the mobile keyboard
            }
        });
    }

    // ===========================
    // DARK MODE LOGIC
    // ===========================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle ? themeToggle.querySelector('i') : null;

    // 1. Check LocalStorage when page loads
    // If user previously chose dark, apply it immediately
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        if(icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun'); // Change icon to Sun
        }
    }

    // 2. Listen for Click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');

            if (body.classList.contains('dark-mode')) {
                // IT IS DARK: Save 'dark' and show Sun icon
                localStorage.setItem('theme', 'dark');
                if(icon) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
            } else {
                // IT IS LIGHT: Save 'light' and show Moon icon
                localStorage.setItem('theme', 'light');
                if(icon) {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        });
    }

    // ===========================
// 3. LIVE SHOP STATUS LOGIC (ULTIMATE VERSION)
// ===========================
const statusBadge = document.getElementById('shop-status');

if (statusBadge) {
    // 1. Get Settings from HTML (or use defaults if not found)
    // If data-open="8" is in HTML, use it. If not, default to 9 (9am).
    const openHour = parseInt(statusBadge.getAttribute('data-open')) || 9; 
    
    // If data-close="17" is in HTML, use it. If not, default to 20 (8pm).
    const closeHour = parseInt(statusBadge.getAttribute('data-close')) || 20; 
    
    // Check if this shop opens on Sunday (default is false/closed)
    const opensOnSunday = statusBadge.getAttribute('data-sunday') === "true";

    // Check if it is a 24/7 online store
    const isOnline247 = statusBadge.getAttribute('data-online') === "true";

    // 2. Get Current Time
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday...
    const currentHour = now.getHours(); // 0 - 23

    // 3. The Logic
    if (isOnline247) {
        // CASE A: Online Store (Always Open)
        statusBadge.innerText = "🟢 Online 24/7";
        statusBadge.classList.add('status-open');
    } 
    else if (currentDay === 0 && !opensOnSunday) {
        // CASE B: It's Sunday, and this shop does NOT open on Sundays
        statusBadge.innerText = "🔴 Closed (Sunday)";
        statusBadge.classList.add('status-closed');
    }
    else if (currentHour < openHour || currentHour >= closeHour) {
        // CASE C: It's too early or too late
        statusBadge.innerText = "🔴 Closed Now";
        statusBadge.classList.add('status-closed');
    } 
    else {
        // CASE D: Open!
        statusBadge.innerText = "🟢 Open Now";
        statusBadge.classList.add('status-open');
    }
}
    // ===========================
    // PWA INSTALLATION LOGIC (MANUAL BUTTON SUPPORT)
    // ===========================
    
    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('https://brightsitedevapp.github.io/adm/sw.js')
            .then(reg => console.log('✅ Service Worker Registered'))
            .catch(err => console.error('❌ SW Failed:', err));
    }

    // 2. Variable to store the event
    let deferredPrompt;
    
    // Get Elements
    const manualInstallContainer = document.getElementById('manual-install-container');
    const manualInstallBtn = document.getElementById('manual-install-btn');
    const popupInstallBtn = document.getElementById('install-btn'); // From the popup
    const popup = document.getElementById('install-popup');

    // 3. Listen for the "Ready to Install" event
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log("📢 Browser is ready to install!"); 
        
        e.preventDefault(); // Stop automatic mini-infobar
        deferredPrompt = e; // Save event for later
        
        // A. Show the Manual Button in Footer
        if (manualInstallContainer) {
            manualInstallContainer.style.display = 'block';
        }

        // B. Show Popup after 3 seconds (Optional, kept from before)
        setTimeout(() => {
            if (popup) popup.style.display = 'block';
        }, 3000);
    });

    // 4. Function to Trigger Install
    async function triggerInstall() {
        if (deferredPrompt) {
            deferredPrompt.prompt(); // Show native prompt
            
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User choice: ${outcome}`);
            
            deferredPrompt = null; // Reset
            
            // Hide UI
            if (popup) popup.style.display = 'none';
            if (manualInstallContainer) manualInstallContainer.style.display = 'none';
        }
    }

    // 5. Attach Click Events
    if (manualInstallBtn) {
        manualInstallBtn.addEventListener('click', triggerInstall);
    }
    
    if (popupInstallBtn) {
        popupInstallBtn.addEventListener('click', triggerInstall);
    }

    // 6. Check if already installed
    window.addEventListener('appinstalled', () => {
        console.log('✅ App Installed Successfully');
        if (manualInstallContainer) manualInstallContainer.style.display = 'none';
        if (popup) popup.style.display = 'none';
    });

    // ==========================================
//  REGISTER SERVICE WORKER (For Offline Mode)
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker Registered!', reg.scope))
            .catch(err => console.log('Service Worker Failed:', err));
    });
}