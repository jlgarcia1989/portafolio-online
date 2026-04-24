/**
 * Gestiona los efectos de revelación de elementos al hacer scroll.
 * Utiliza Intersection Observer para detectar cuándo una sección entra en el viewport.
 * Sigue el principio de Open/Closed al permitir cualquier selector para la revelación.
 */
export class ScrollEffect {
    /**
     * Crea una instancia del efecto de scroll para los selectores indicados.
     * @param {string} selector - Selector CSS de los elementos a animar.
     * @example
     * const reveal = new ScrollEffect('.reveal-on-scroll');
     */
    constructor(selector) {
        this.sections = document.querySelectorAll(selector);
        this.observerOptions = {
            root: null,
            threshold: 0.15,
        };
        this.init();
    }

    /**
     * Inicializa el observador de intersección.
     */
    init() {
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
     * Prepara el elemento con estilos iniciales antes de la animación.
     * @param {HTMLElement} element - El elemento a preparar.
     */
    prepare(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    }

    /**
     * Realiza la animación de revelación del elemento.
     * @param {HTMLElement} element - El elemento a revelar.
     */
    reveal(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }
}
