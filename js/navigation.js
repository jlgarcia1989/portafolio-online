/**
 * Gestiona la navegación principal de la aplicación.
 * Responsable de la apertura/cierre del menú móvil y del feedback visual en enlaces.
 * Cumple con los principios de SOLID al encargarse únicamente de la lógica de navegación.
 */
export class Navigation {
    /**
     * Inicializa los elementos necesarios para la navegación.
     * @example
     * const nav = new Navigation();
     */
    constructor() {
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navLinks = document.querySelector('.nav-links');
        this.links = document.querySelectorAll('a');
        this.init();
    }

    /**
     * Configura los listeners de eventos para el menú móvil y enlaces.
     */
    init() {
        if (this.mobileMenu) {
            this.mobileMenu.addEventListener('click', () => this.toggleMenu());
        }
        this.setupLinks();
    }

    /**
     * Alterna la visibilidad del menú móvil mediante clases CSS.
     */
    toggleMenu() {
        const isActive = this.mobileMenu.classList.toggle('active');
        this.navLinks.classList.toggle('active');
        this.mobileMenu.setAttribute('aria-expanded', isActive);
    }

    /**
     * Cierra el menú móvil si está abierto.
     */
    closeMenu() {
        if (this.navLinks.classList.contains('active')) {
            this.mobileMenu.classList.remove('active');
            this.navLinks.classList.remove('active');
            this.mobileMenu.setAttribute('aria-expanded', 'false');
        }
    }

    /**
     * Configura el comportamiento de los enlaces y la navegación por anclas.
     */
    setupLinks() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#' || href === '') {
                    e.preventDefault();
                }
                
                this.closeMenu();
                this.provideFeedback(link);
            });
        });
    }

    /**
     * Proporciona retroalimentación visual al hacer clic en un enlace.
     * @param {HTMLElement} link - El elemento enlace accionado.
     */
    provideFeedback(link) {
        const originalColor = link.style.color;
        link.style.color = 'var(--color-primary)';
        setTimeout(() => {
            link.style.color = originalColor;
        }, 300);
    }
}
