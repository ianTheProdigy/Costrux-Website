const siteNavbar = document.getElementById('site-navbar');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

function updateNavbarState() {
    if (!siteNavbar || siteNavbar.classList.contains('navbar-solid')) return;

    if (window.scrollY > 40) {
        siteNavbar.classList.add('navbar-scrolled');
    } else {
        siteNavbar.classList.remove('navbar-scrolled');
    }
}

function closeMobileMenu() {
    if (!mobileMenu || !mobileMenuButton) return;

    mobileMenu.classList.remove('is-open');
    mobileMenuButton.setAttribute('aria-expanded', 'false');
}

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('is-open');
        mobileMenuButton.setAttribute('aria-expanded', String(isOpen));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMobileMenu();
    });
}

updateNavbarState();
window.addEventListener('scroll', updateNavbarState, { passive: true });