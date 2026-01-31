/* ==================================
    Promo Modal
===================================== */

const modal = document.getElementById("proModal");
const STORAGE_KEY = 'saatva_promo_dismissed';

// 1. THE CHECKER: Only show if they haven't dismissed it yet

function triggerModal() {
    const isDismissed = sessionStorage.getItem(STORAGE_KEY);

    if (!isDismissed) {
        modal.style.display = 'flex';
    }
}

// 2. THE DISMISSER: When they click X, we remember their choice
function closeProModal() {
    modal.style.display = 'none';

    // This tells the browser: "The user said no, don't as again this session."
    sessionStorage.setItem(STORAGE_KEY, 'true');
    clearInterval(promoInterval);
}

// 3. THE 2-MINUTE TIMER
// We store this in a variable so we can stop it if they click X
const promoInterval = setInterval(() => {
    triggerModal();
}, 120000);

// 4. THE EXIT INTENT Respecting the users for the session
document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 0) {
        triggerModal();
    }
})

// 5. LIVE COUNTDOWN CLOCK 
let timerMinutes = 9;
let timerSeconds = 59;
function startCountdown() {
    setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds--;
        } else if (timerMinutes > 0) {
            timerMinutes--;
            timerSeconds = 59;
        }

        let displaySec = timerSeconds < 10 ? '0' + timerSeconds : timerSeconds;
        const timerElement = document.getElementById('timer');
        if(timerElement) timerElement.innerText = `0${timerMinutes}:${displaySec}`;
    }, 1000);
}
startCountdown();

// Shop Now Action
function shopNow() {
    window.location.href = 'index.html';
}

function copyCoupon() {
    const couponCode = document.getElementById('coupon-code').textContent;

    // Copy to clipboard
    navigator.clipboard.writeText(couponCode).then(() => {
        // Show notification
        const notification = document.getElementById('copyNotification');
        notification.classList.add('show');
        // Reset after 2 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        copyBtn.textContent = originalText;
        copyBtn.style.background = '#5ba3d0'
    }, 2000);
    })   
}

/* ==================================
    Nav Sliding For MObile
===================================== */

const sidebar = document.getElementById('mobileSidebar');
const overlay = document.getElementById('sidebarOverlay');
const sidebarWrap = document.getElementById('sidebarWrap');
const matSubContainer = document.querySelector('.mattress-sub-container');
const furnitureSub = document.getElementById('furnitureSub');
const beddingSub = document.getElementById('beddingSub');
const bundleSub = document.getElementById('bundleSub');
function toggleMenu() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
    document.body.classList.toggle('no-scroll');
    if (matSubContainer.classList.contains('show')) {
        matSubContainer.style.display = 'block';
    } else {
        matSubContainer.style.display = 'none';
        furnitureSub.style.display = 'none';
        beddingSub.style.display = 'none';
        bundleSub.style.display = 'none';
        sidebarWrap.style.display = 'block';
    }
    
}

// Mattress
function mattressA() {
    matSubContainer.style.display = 'block';
    sidebarWrap.style.display = 'none';
}

function closeSubMenu() {
    matSubContainer.style.display = 'none';
    furnitureSub.style.display = 'none';
    beddingSub.style.display = 'none';
    bundleSub.style.display = 'none';
    sidebarWrap.style.display = 'block'
}

// Furniture
function furnitureD() {
    furnitureSub.style.display = 'block';
    sidebarWrap.style.display = 'none';
}
// Bedding
function bedding() {
    beddingSub.style.display = 'block'
    sidebarWrap.style.display = 'none';
}

// Bundle
function bundle() {
    bundleSub.style.display = 'block'
    sidebarWrap.style.display = 'none';
}


/* ===============================
    Recently Section
================================== */

const mattressCatalog = {
    "classic": {
        name: "Saatva Classic",
        subtitle: "Luxury Innerspring",
        price: "$1,190 - $2,685",
        oldPrice: "$1,399 - $3,158",
        affirmPrice: "$67/mo",
        img: "https://res.cloudinary.com/dffuf2gwh/image/upload/v1767985442/solaire-lifestyle-standard-3-2_eoqw4a.jpg",
        hoverImg: "https://res.cloudinary.com/dffuf2gwh/image/upload/v1767985438/saatva-latex-hybrid-detail1-3-2_qdgy2q.jpg",
        badge: "MOST POPULAR",
        url: "classic.html",
        reviews: "4,989"
    },
    "rx": {
        name: "Saatva Rx",
        subtitle: "Memory Foam Hybrid",
        price: "$1,700 - $3,909",
        oldPrice: "$1,999 - $4,598",
        affirmPrice: "$95/mo",
        img: "https://res.cloudinary.com/dffuf2gwh/image/upload/v1767985440/saatva-rx-lifestyle-3-2_lro7ll.jpg",
        hoverImg: "https://res.cloudinary.com/dffuf2gwh/image/upload/v1767985436/saatva-classic-diagram-1-1_dvosvd.jpg",
        badge: "FOR BACK PAIN",
        reviews: "321"
    },
    "latex": {
        name: "Saatva Latex Hybrid",
        subtitle: "Organic Natural Latex Hybrid",
        price: "$1,445 - $3,101",
        oldPrice: "$1,699 - $3,648",
        affirmPrice: "$81/mo",
        img: "https://res.cloudinary.com/dffuf2gwh/image/upload/v1767985440/santorini-angle-taupe-3-2_dbcj3y.jpg",
        hoverImg: "https://res.cloudinary.com/dffuf2gwh/image/upload/v1767985442/solaire-sweep-3-2_k1qrb0.jpg",
        badge: "BEST COOLING",
        reviews: "345"
    },
    "contour5": {
        name: "Contour5",
        subtitle: "Cooling Ultra-Premium Memory Foam",
        price: "$1,445 - $3,101",
        oldPrice: "$1,699 - $3,648",
        affirmPrice: "$90/mo",
        img: "https://res.cloudinary.com/dffuf2gwh/image/upload/v1767985427/memory-foam-hybrid-angle-standard-3-2_mxhcej.jpg",
        hoverImg: "https://res.cloudinary.com/dffuf2gwh/image/upload/v1767985427/memory-foam-hybrid-sweep-3-2_qskztk.jpg",
        badge: "BEST COOLING",
        reviews: "345"
    },
    "foam": {
        name: "Memory Foam Hybrid",
        subtitle: "Cooling Premium Memory Foam Hybrid",
        price: "$1,445 - $3,101",
        oldPrice: "$1,699 - $3,648",
        affirmPrice: "$81/mo",
        img: "https://res.cloudinary.com/dffuf2gwh/image/upload/v1767985412/basel-studio-linen-16-9_psiois.jpg",
        hoverImg: "https://res.cloudinary.com/dffuf2gwh/image/upload/v1767985439/saatva-rx-detail1-3-2_cfmem7.jpg",
        badge: "BEST COOLING",
        reviews: "345"
    },
    "zenhaven": {
        name: "Zenhaven",
        subtitle: "Dual-Sided Organic Natural Latex",
        price: "$1,445 - $3,101",
        oldPrice: "$1,699 - $3,648",
        affirmPrice: "$81/mo",
        img: "https://res.cloudinary.com/dffuf2gwh/image/upload/v1767985431/organic-mattress-pad-detail-3-2_byzygl.jpg",
        hoverImg: "https://res.cloudinary.com/dffuf2gwh/image/upload/v1767985431/organic-mattress-pad-detail-3-2_byzygl.jpg",
        badge: "BEST COOLING",
        reviews: "345"
    }  
};

const rvTrack = document.getElementById('rv-track');

function renderRecentlyViewed() {
    const history = JSON.parse(localStorage.getItem('saatva_history')) || [];
    const section = document.getElementById('recently-viewed');

    if (history.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';

    // This creates the EXACT HTML structure from your screenshot
    rvTrack.innerHTML = history.map(id => {
        const item = mattressCatalog[id];
        return `
            <div class="product-card">
                <a href="${item.url}" target="_blank">
                <div class="image-container">
                    <span class="badge">${item.badge}</span>
                    <img src="${item.img}" class="main-img" alt="${item.name}">
                    <!-- Secondary Image for your Hover effect -->
                    <img src="${item.hoverImg}" class="hover-img" alt="Detail">
                </div>
                </a>
                
                <div class="product-info">
                    <div class="ratings">
                        <span class="stars">★★★★★</span>
                        <span class="rating-score">4.8</span>
                        <a href="#">${item.reviews} Reviews</a>
                    </div>
                    <a href="#" class="product-name">${item.name}</a>
                    <p class="product-subtitle">${item.subtitle}</p>
                    <div class="pricing">
                        <span class="current-price">${item.price}</span>
                        <span class="old-price">${item.oldPrice}</span>
                    </div>
                    <a href="${item.url}" target="_blank"><p class="affirm-text">Or as low as <strong>${item.affirmPrice}</strong> with 
                        <span class="affirm-brand">
                            <img src="./black_logo-transparent_bg-removebg-preview.png" alt="affirm">
                        </span>
                    </p></a>
                </div>
            </div>
        `;
    }).join('');
}

// listener for clicks on the bottom section cards
document.querySelectorAll('.clickable-product').forEach(card => {
    card.addEventListener('click', (e) => {
        const id = card.getAttribute('data-id');
        if (e.target.tagName !== 'A') {
            window.location.href = `${id}.html`; // Takes them to classic.html
        }
        let history = JSON.parse(localStorage.getItem('saatva_history')) || [];
        history = history.filter(item => item !== id);
        history.unshift(id);
        localStorage.setItem('saatva_history', JSON.stringify(history.slice(0, 5)));
        renderRecentlyViewed();
    });
});

document.addEventListener('DOMContentLoaded', renderRecentlyViewed);




/* ==================================
    Business Section Image Sliding
===================================== */

let currentSlide = 0;
const totalSlides = 3;
const track = document.getElementById("sliderTrack");

function moveSlider() {
    currentSlide++;
    // If we reach the end, go  back to the first image
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }
    // Calculate the move (0%, -33.33%, -66.66%)
    const amountToMove = -(currentSlide * (100 / totalSlides))
    // Apply the movement using CSS transform
    track.style.transform = `translateX(${amountToMove}%)`;
}

// Run the moveSlider function every 2000ms (2 seconds)
setInterval(moveSlider, 2000);


/* ===============================
    Review Section
================================== */

const tracks = document.getElementById('reviewTrack');
const cards = document.querySelectorAll('.r-card');
const dots = document.querySelectorAll('.dot');
const nextBtn = document.querySelector('.nav-arrow:last-child'); // Right arrow
const prevBtn = document.querySelector('.nav-arrow:first-child'); // Left arrow

let currentIndex = 0;
let isPaused = false;
const cardWidth = 380; 
const gap = 32;

function updateSlider() {
    // Calculate movement
    const moveAmount = currentIndex * (cardWidth + gap);
    tracks.style.transform = `translateX(-${moveAmount}px)`;

    // Update Dots (Assuming 9 cards / 3 dots = 3 cards per dot)
    const activeDotIndex = Math.floor(currentIndex / 3);
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeDotIndex);
    });
}

// NEXT BUTTON LOGIC
nextBtn.addEventListener('click', () => {
    // If we aren't at the very end (showing the last 3 cards)
    if (currentIndex < cards.length - 3) {
        currentIndex++;
    } else {
        currentIndex = 0; // Loop back to start
    }
    updateSlider();
});

// PREVIOUS BUTTON LOGIC
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = cards.length - 3; // Loop to end
    }
    updateSlider();
});

// DOTS LOGIC
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentIndex = index * 3; // Jumps to card 0, 3, or 6
        updateSlider();
    });
});

// AUTO PLAY (Every 4 seconds)
setInterval(() => {
    if (!isPaused) {
        if (currentIndex < cards.length - 3) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateSlider();
    }
}, 2000);

// PAUSE ON HOVER
const reviewContainer = document.querySelector('.r-body');
reviewContainer.addEventListener('mouseenter', () => isPaused = true);
reviewContainer.addEventListener('mouseleave', () => isPaused = false);
reviewContainer.addEventListener('touchstart', () => isPaused = true);
reviewContainer.addEventListener('touchend', () => isPaused = false);

/* ===============================
    Video Section
================================== */

const vModal = document.getElementById('videoModal');
const fullVideo = document.getElementById('fullVideo');

function openVideoModal() {
    vModal.style.display = 'flex';
    fullVideo.play();
}

function closeVideoModal() {
    vModal.style.display = 'none';
    fullVideo.pause();
    fullVideo.currentTime = 0; 
}

window.onclick = function(e) {
    if (e.target == vModal) {
        closeVideoModal();
    }
}

/* ===============================
Footer Section
================================== */

document.addEventListener('DOMContentLoaded', () => {
    const footerHeadings = document.querySelectorAll('.footer-heading');

    footerHeadings.forEach((heading, index) => {
        if (index === 0) return;

        heading.addEventListener('click', () => {
            const parent = heading.parentElement;
            document.querySelectorAll('.footer-col').forEach(col => {
                if (col !== parent) col.classList.remove('active');
            });
            parent.classList.toggle('active');
        });
    });
});