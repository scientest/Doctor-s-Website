document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');
const hamburgerIcon = document.getElementById('hamburgerIcon');
const closeIcon = document.getElementById('closeIcon');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    if (mobileMenu.classList.contains('hidden')) {
        hamburgerIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    } else {
        hamburgerIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
    }
});

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        hamburgerIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    });
});

function toggleAccordion(header) {
    const content = header.nextElementSibling;

    // Close all other open accordions
    document.querySelectorAll('.accordion-header').forEach(h => {
        if (h !== header && h.classList.contains('active')) {
            h.classList.remove('active');
            const c = h.nextElementSibling;
            c.style.maxHeight = '0'; // Set max-height to 0 for collapsing
            c.classList.remove('open'); // Remove 'open' class
            c.style.paddingTop = '0';
            c.style.paddingBottom = '0';
        }
    });

    header.classList.toggle('active'); // Toggle 'active' class on current header

    if (header.classList.contains('active')) {
        // If it's now active (meaning it's opening)
        content.classList.add('open'); // Add 'open' class
        content.style.maxHeight = content.scrollHeight + 'px'; // Set to scrollHeight to animate

        // After transition, remove maxHeight to allow content to grow naturally
        content.addEventListener('transitionend', function handler() {
            content.style.maxHeight = 'none';
            content.removeEventListener('transitionend', handler);
        });
    } else {
        // If it's not active (meaning it's closing)
        // First, set max-height to its current scrollHeight to enable transition from current height
        content.style.maxHeight = content.scrollHeight + 'px';
        // Then, in the next animation frame, set it to 0 to collapse
        requestAnimationFrame(() => {
            content.style.maxHeight = '0';
            content.classList.remove('open'); // Remove 'open' class
        });
    }
}

const counters = document.querySelectorAll('[data-counter-target]');
const speed = 200;

const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-counter-target');
    let current = 0;
    const increment = target / speed;

    const updateCount = () => {
        if (current < target) {
            current += increment;
            counter.textContent = Math.ceil(current);
            requestAnimationFrame(updateCount);
        } else {
            counter.textContent = target;
        }
    };

    updateCount();
};

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (entry.target.id === 'why-trust-us') {
                entry.target.querySelectorAll('[data-counter-target]').forEach(counter => animateCounter(counter));
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    if (section.id !== 'contact' && section.id !== 'about' && section.id !== 'hero') {
        section.classList.add('animate-on-scroll');
        sectionObserver.observe(section);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.hero-gradient');
    if (heroSection) {
        heroSection.classList.add('is-visible');
    }
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        aboutSection.classList.add('is-visible');
    }
});

const searchLanguageToggle = document.getElementById('searchLanguageToggle');
const desktopSearchBar = document.getElementById('desktopSearchBar');
const desktopSearchInput = document.getElementById('desktopSearchInput');
const desktopSearchButton = document.getElementById('desktopSearchButton');

const mobileSearchToggle = document.getElementById('mobileSearchToggle');
const mobileSearchBar = document.getElementById('mobileSearchBar');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const mobileSearchButton = document.getElementById('mobileSearchButton');

const messageBox = document.getElementById('messageBox');

function showMessage(message, type = 'info', duration = 3000) {
    messageBox.textContent = message;
    messageBox.className = 'message-box show';
    setTimeout(() => {
        messageBox.classList.remove('show');
    }, duration);
}

searchLanguageToggle.addEventListener('click', () => {
    desktopSearchBar.classList.toggle('hidden');
    if (!desktopSearchBar.classList.contains('hidden')) {
        desktopSearchInput.focus();
    }
});

desktopSearchButton.addEventListener('click', () => {
    const query = desktopSearchInput.value.trim();
    if (query) {
        showMessage(`Searching for: "${query}"`);
        desktopSearchInput.value = '';
        desktopSearchBar.classList.add('hidden');
    } else {
        showMessage('Please enter a search query.', 'error');
    }
});

desktopSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        desktopSearchButton.click();
    }
});

mobileSearchToggle.addEventListener('click', () => {
    mobileSearchBar.classList.toggle('hidden');
    if (!mobileSearchBar.classList.contains('hidden')) {
        mobileSearchInput.focus();
    }
});

mobileSearchButton.addEventListener('click', () => {
    const query = mobileSearchInput.value.trim();
    if (query) {
        showMessage(`Searching for: "${query}"`);
        mobileSearchInput.value = '';
        mobileSearchBar.classList.add('hidden');
        mobileMenu.classList.add('hidden');
        hamburgerIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    } else {
        showMessage('Please enter a search query.', 'error');
    }
});

mobileSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        mobileSearchButton.click();
    }
});


