/**
 * ContactForm - Versión Final Ultra-Robust
 */
import { CONFIG } from './config.js';
import { emailService } from './services/emailService.js';

export class ContactForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;

        this.submitBtn = this.form.querySelector('button[type="submit"]');
        this.charCounter = document.getElementById('char-counter');
        this.messageField = document.getElementById('message');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.messageField && this.charCounter) {
            this.messageField.addEventListener('input', () => this.updateCharCounter());
        }

        ['name', 'email', 'phone', 'message'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => this.clearError(id));
        });

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Forzamos la escucha del botón de éxito de forma global
        document.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'modal-accept-btn') {
                const modal = document.getElementById('success-modal');
                if (modal) modal.style.display = 'none';
                window.location.href = 'index.html';
            }
        });
    }

    updateCharCounter() {
        const len = this.messageField.value.length;
        this.charCounter.textContent = `(${len}/${CONFIG.VALIDATION.MAX_MESSAGE_LENGTH})`;
    }

    setError(id, msg) {
        const field = document.getElementById(id);
        const errorEl = document.getElementById(`error-${id}`);
        if (errorEl) errorEl.textContent = msg;
        if (field) field.classList.add('input-error');
    }

    clearError(id) {
        const field = document.getElementById(id);
        const errorEl = document.getElementById(`error-${id}`);
        if (errorEl) errorEl.textContent = '';
        if (field) field.classList.remove('input-error');
    }

    validate(data) {
        let isValid = true;
        const { NAME_REGEX, EMAIL_REGEX, PHONE_REGEX, MAX_MESSAGE_LENGTH } = CONFIG.VALIDATION;

        if (!NAME_REGEX.test(data.name)) {
            this.setError('name', 'Nombre inválido.');
            isValid = false;
        }
        if (!EMAIL_REGEX.test(data.email)) {
            this.setError('email', 'Email inválido.');
            isValid = false;
        }
        if (!PHONE_REGEX.test(data.phone)) {
            this.setError('phone', 'Teléfono inválido.');
            isValid = false;
        }
        if (!data.message || data.message.length > MAX_MESSAGE_LENGTH) {
            this.setError('message', 'Mensaje requerido.');
            isValid = false;
        }

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        if (!this.validate(formData)) return;

        this.setLoading(true);

        try {
            // Ejecutamos Airtable y EmailJS de forma robusta
            const airtablePromise = this.sendToAirtable(formData).catch(err => {
                console.warn('[Airtable] Falló al guardar (Omitido):', err);
            });
            
            const emailPromise = emailService.sendEmails(formData).catch(err => {
                console.warn('[EmailService] Falló al enviar:', err);
                throw new Error('No se pudo enviar el correo.');
            });

            // Si Email falla, se va al catch general. Si Airtable falla, simplemente avisa y sigue.
            await Promise.all([airtablePromise, emailPromise]);
            
            this.form.reset();
            this.updateCharCounter();
            this.showSuccess();

        } catch (error) {
            console.error('Error Crítico:', error);
            this.setError('message', 'Error al enviar. Revisa que los servicios estén configurados.');
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(state) {
        if (!this.submitBtn) return;
        this.submitBtn.disabled = state;
        this.submitBtn.innerHTML = state 
            ? '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...' 
            : '<i class="fa-solid fa-paper-plane"></i> Enviar';
    }

    async sendToAirtable(data) {
        // En producción (Render), el tableId debería venir de las variables de entorno si se expusieran,
        // pero aquí usamos el nombre real de la tabla en Airtable.
        let tableId = CONFIG.AIRTABLE.TABLE_ID;
        if (!tableId || tableId.includes('TU_')) {
            tableId = 'Contact Form Submissions'; // Nombre exacto en la base de Julian
        }

        const url = `/api/airtable/${tableId}`;
        const payload = {
            records: [{ 
                fields: { 
                    "Name": data.name, 
                    "Email": data.email, 
                    "Phone": data.phone, 
                    "Message": data.message 
                } 
            }]
        };
        
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.error('[Airtable Error]:', err);
            throw new Error('Error al guardar en Airtable');
        }
        return res.json();
    }

    showSuccess() {
        const modal = document.getElementById('success-modal');
        if (modal) modal.style.display = 'flex';
    }
}
