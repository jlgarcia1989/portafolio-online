/**
 * @fileoverview CVGenerator - Orquestador de exportación de CV a PDF.
 * Sigue principios SOLID (SRP) y Clean Code.
 */
import { CONFIG } from './config.js';

export class CVGenerator {
    constructor() {
        this.triggers = document.querySelectorAll('.cv-download-trigger');
        this.loader = null;
        this.init();
    }

    /**
     * Inicializa los event listeners de forma desacoplada.
     */
    init() {
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleDownload();
            });
        });
    }

    /**
     * Proceso principal de descarga.
     */
    async handleDownload() {
        this.showLoader();

        try {
            const container = this.createHiddenContainer();
            const html = await this.fetchTemplate('cv-print.html');
            container.innerHTML = html;

            this.executeInternalScripts(container);

            this.waitForDataAndPrint(container);

        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Crea un contenedor oculto para el renderizado previo.
     * @returns {HTMLElement}
     */
    createHiddenContainer() {
        const container = document.createElement('div');
        container.style.cssText = 'position:fixed; left:-9999px; top:0; width:210mm;';
        document.body.appendChild(container);
        return container;
    }

    /**
     * Obtiene la plantilla HTML.
     */
    async fetchTemplate(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Template not found: ${url}`);
        return await response.text();
    }

    /**
     * Ejecuta los scripts embebidos en la plantilla cargada via fetch.
     */
    executeInternalScripts(container) {
        container.querySelectorAll('script').forEach(oldScript => {
            const newScript = document.createElement('script');
            newScript.type = oldScript.type || 'text/javascript';
            if (oldScript.src) newScript.src = oldScript.src;
            else newScript.textContent = oldScript.textContent;
            document.head.appendChild(newScript);
        });
    }

    /**
     * Espera a que el servicio de datos interno notifique que está listo.
     */
    waitForDataAndPrint(container) {
        const checkReady = setInterval(async () => {
            if (window.cvDataReady) {
                clearInterval(checkReady);
                await this.generatePDF(container);
                this.cleanup(container);
            }
        }, 500);
    }

    /**
     * Motor de generación de PDF (html2pdf).
     */
    async generatePDF(element) {
        const content = element.querySelector('#cv-content');
        const options = {
            margin: 0,
            filename: 'Julian_Garcia_CV_Premium.pdf',
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { scale: 2, useCORS: true, backgroundColor: '#030303' },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        await html2pdf().set(options).from(content).save();
    }

    /**
     * Gestión de errores y UI.
     */
    handleError(error) {
        console.error('Error en generación de CV:', error);
        this.hideLoader();
        alert('Error técnico al generar el CV. Intente de nuevo.');
    }

    cleanup(container) {
        this.hideLoader();
        document.body.removeChild(container);
    }

    showLoader() {
        this.loader = document.createElement('div');
        this.loader.className = 'cv-loader-overlay';
        this.loader.innerHTML = `
            <div class="loader-spinner"></div>
            <div class="loader-text">ORQUESTANDO TALENTO QA</div>
            <div class="loader-subtext">Compilando 13 años de trayectoria estratégica...</div>
        `;
        document.body.appendChild(this.loader);
        document.body.style.overflow = 'hidden';
    }

    hideLoader() {
        if (this.loader) {
            this.loader.remove();
            document.body.style.overflow = '';
        }
    }
}
