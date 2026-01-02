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
                    
                    // 5. Pick the first 4
                    const selected = shuffled.slice(0, 4);
                    
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
        link: "#"       // Directs them to the contact page to DM you
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