const siteNavbar = document.getElementById('site-navbar');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const brandLogo = document.querySelector('.brand-logo');
const logoLight = brandLogo?.dataset.logoLight;
const logoDark = brandLogo?.dataset.logoDark;
let logoSwapTimer;
let navigationTimer;

function updateLogo(isScrolled) {
    if (!brandLogo || !logoLight || !logoDark || brandLogo.dataset.logoState === String(isScrolled)) return;

    window.clearTimeout(logoSwapTimer);
    brandLogo.style.opacity = '0';
    logoSwapTimer = window.setTimeout(() => {
        brandLogo.src = isScrolled ? logoDark : logoLight;
        brandLogo.dataset.logoState = String(isScrolled);
        brandLogo.style.opacity = '1';
    }, 130);
}

function updateNavbarState() {
    if (!siteNavbar) return;

    const isScrolled = siteNavbar.classList.contains('navbar-solid') || window.scrollY > 40;

    if (siteNavbar.classList.contains('navbar-solid')) {
        updateLogo(true);
        return;
    }

    if (isScrolled) {
        siteNavbar.classList.add('navbar-scrolled');
    } else {
        siteNavbar.classList.remove('navbar-scrolled');
    }

    updateLogo(isScrolled);
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

function animateActiveIndicator(currentLink, targetLink) {
    const linkGroup = targetLink.parentElement;
    if (!linkGroup) return;

    const currentBounds = currentLink?.getBoundingClientRect() || targetLink.getBoundingClientRect();
    const targetBounds = targetLink.getBoundingClientRect();
    const groupBounds = linkGroup.getBoundingClientRect();
    const indicator = document.createElement('span');

    indicator.className = 'nav-active-indicator';
    indicator.style.left = `${currentBounds.left - groupBounds.left}px`;
    indicator.style.top = `${currentBounds.top - groupBounds.top}px`;
    indicator.style.width = `${currentBounds.width}px`;
    indicator.style.height = `${currentBounds.height}px`;
    linkGroup.classList.add('nav-link-group');
    linkGroup.append(indicator);
    currentLink?.classList.add('nav-link-transitioning');
    targetLink.classList.add('nav-link-transitioning');

    requestAnimationFrame(() => {
        indicator.style.left = `${targetBounds.left - groupBounds.left}px`;
        indicator.style.top = `${targetBounds.top - groupBounds.top}px`;
        indicator.style.width = `${targetBounds.width}px`;
        indicator.style.height = `${targetBounds.height}px`;
    });
}

document.querySelectorAll('.nav-link, .mobile-menu-link:not(.bg-primary)').forEach((link) => {
    link.addEventListener('click', (event) => {
        const destination = new URL(link.href, window.location.href);
        const isInternalPage = destination.origin === window.location.origin
            && destination.pathname !== window.location.pathname
            && !link.hasAttribute('download');

        if (isInternalPage && !navigationTimer) {
            event.preventDefault();
            const currentLink = link.parentElement?.querySelector('.nav-link-active');
            animateActiveIndicator(currentLink, link);
            navigationTimer = window.setTimeout(() => {
                window.location.href = link.href;
            }, 260);
        }
    });
});

updateNavbarState();
window.addEventListener('scroll', updateNavbarState, { passive: true });