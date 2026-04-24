/**
 * Punto de entrada principal de la aplicación.
 * Orquestador de los módulos de navegación y efectos visuales.
 * Encargado de inicializar la lógica una vez que el DOM está listo.
 */

import { ComponentLoader } from './component-loader.js';
import { Navigation } from './navigation.js';
import { ScrollEffect } from './scrollEffect.js';
import { CVGenerator } from './cv-generator.js';
import { ContactForm } from './contact.js';

/**
 * Inicialización principal al cargar el documento.
 */
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargar componentes compartidos (DRY)
    await ComponentLoader.loadAll();

    // 2. Inicialización de módulos funcionales
    const nav = new Navigation();
    const scroll = new ScrollEffect('.reveal-on-scroll');
    const cv = new CVGenerator();
    const contact = new ContactForm('contact-form');
    
    // Log de estado del sistema (Depuración creativa)
    console.group('%c Julian Garcia | Portfolio Engine ', 'background: #3b82f6; color: #fff; padding: 5px; border-radius: 3px;');
    console.log('✔ Components Loaded: Sync OK');
    console.log('✔ Navigation System: Active');
    console.log('✔ Scroll Experience: Calibrated');
    console.groupEnd();
});
