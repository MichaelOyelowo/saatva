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
