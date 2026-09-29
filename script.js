// Theme Management
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const isDark = body.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (themeToggle) {
        updateThemeIcon(themeToggle, newTheme === 'dark');
    }
}

function updateThemeIcon(btn, isDark) {
    // Theme icon transitions are handled smoothly via CSS selectors
}

// RTL Management
function toggleRTL() {
    const isRTL = document.documentElement.dir === 'rtl';
    const newDir = isRTL ? 'ltr' : 'rtl';
    document.documentElement.dir = newDir;
    localStorage.setItem('rtl', newDir);
}

// Mobile Menu Management
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });
    }

    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }
}

// Reveal Animations
const revealElements = document.querySelectorAll('.reveal');
function checkReveal() {
    const triggerBottom = window.innerHeight * 0.85;
    revealElements.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < triggerBottom) {
            el.classList.add('active');
        }
    });
}

// Modal Management
function openModal(id) {
    const modal = document.getElementById(id);
    const overlay = document.querySelector('.modal-overlay');
    if (modal && overlay) {
        overlay.style.display = 'flex';
        modal.classList.add('active');
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    const overlay = document.querySelector('.modal-overlay');
    overlay.style.display = 'none';
    modals.forEach(m => m.classList.remove('active'));
}

// Initialize
// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const rtlToggle = document.getElementById('rtl-toggle');
    const mobileRtlToggle = document.getElementById('mobile-rtl-toggle');

    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    if (themeToggle) {
        updateThemeIcon(themeToggle, savedTheme === 'dark');
    }

    // Set initial RTL
    const savedRTL = localStorage.getItem('rtl') || 'ltr';
    document.documentElement.dir = savedRTL;

    // Listeners
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (rtlToggle) rtlToggle.addEventListener('click', toggleRTL);


    initMobileMenu();
    
    window.addEventListener('scroll', checkReveal);
    checkReveal(); // Run once on load

    // Dashboard Tab Switching
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    window.switchTab = function(tabId) {
        // Hide all tabs
        tabContents.forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
        });

        // Show selected tab
        const selectedTab = document.getElementById(`${tabId}-tab`);
        if (selectedTab) {
            selectedTab.style.display = 'block';
            setTimeout(() => selectedTab.classList.add('active'), 10);
        }

        // Update Nav UI
        navItems.forEach(item => {
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('btn-primary', 'active');
                item.style.background = 'var(--primary)';
                item.style.color = 'white';
            } else {
                item.classList.remove('btn-primary', 'active');
                item.style.background = 'transparent';
                item.style.color = 'var(--text-muted)';
            }
        });

        // Update Mobile Nav UI
        const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
        mobileLinks.forEach(link => {
            if (link.getAttribute('onclick')?.includes(tabId)) {
                link.classList.add('active');
            } else if (link.getAttribute('onclick')?.includes('switchTab')) {
                link.classList.remove('active');
            }
        });

        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const icon = mobileMenuBtn?.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        }

        // Create icons for new content
        lucide.createIcons();
        
        // Re-run reveal check
        checkReveal();
    };

    // Add click listeners to desktop nav items
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Lucide Icons
    lucide.createIcons();
});

// Close modal on overlay click
document.querySelector('.modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closeModal();
});
