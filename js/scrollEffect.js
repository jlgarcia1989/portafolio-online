/**
 * Gestiona los efectos de revelación de elementos al hacer scroll.
 * Utiliza Intersection Observer para detectar cuándo una sección entra en el viewport.
 * Fix: threshold reducido a 0 + rootMargin para garantizar visibilidad en mobile
 * donde secciones largas nunca alcanzarían un threshold mayor.
 * Fallback incluido para browsers sin soporte de IntersectionObserver (Safari < 12.1).
 */
export class ScrollEffect {
    /**
     * @param {string} selector - Selector CSS de los elementos a animar.
     * @example
     * const reveal = new ScrollEffect('.reveal-on-scroll');
     */
    constructor(selector) {
        this.sections = document.querySelectorAll(selector);
        // threshold:0 = se activa al primer píxel visible (crucial en mobile con secciones largas)
        // rootMargin:'0px 0px -50px 0px' = pequeño margen para evitar revelar demasiado pronto
        this.observerOptions = {
            root: null,
            threshold: 0,
            rootMargin: '0px 0px -50px 0px',
        };
        this.init();
    }

    /**
     * Inicializa el observador. Si no hay soporte (Safari < 12.1), revela todos inmediatamente.
     */
    init() {
        // Fallback para browsers sin IntersectionObserver
        if (!('IntersectionObserver' in window)) {
            this.sections.forEach(section => this.reveal(section));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.reveal(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        this.sections.forEach(section => {
            this.prepare(section);
            observer.observe(section);
        });
    }

    /**
     * Prepara el elemento con estilos iniciales (invisible, desplazado hacia abajo).
     * @param {HTMLElement} element
     */
    prepare(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
    }

    /**
     * Ejecuta la animación de revelación.
     * @param {HTMLElement} element
     */
    reveal(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }
}
