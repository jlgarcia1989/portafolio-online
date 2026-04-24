/**
 * Email Service - Ultra-Premium Implementation
 */
import { CONFIG } from '../config.js';

class EmailService {
    constructor() {
        this.config = CONFIG.EMAILJS;
        this.adminEmail = 'jlgarcia1989@hotmail.com';
    }

    _getHtmlTemplate(data, isForAdmin = true) {
        const accentColor = '#3b82f6'; // Azul corporativo (var--color-primary)
        const bgColor = '#050505';
        const cardColor = '#0a0a0a';
        
        const title = isForAdmin ? 'NOTIFICACIÓN DE LEAD' : 'CONFIRMACIÓN RECIBIDA';
        const subtitle = isForAdmin ? 'Oportunidad Estratégica Detectada' : 'Mensaje Procesado con Éxito';
        
        return `
            <div style="background-color: ${bgColor}; padding: 40px 10px; font-family: 'Segoe UI', Roboto, Arial, sans-serif; color: #ffffff;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: ${cardColor}; border: 1px solid #1a1a1a; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                    <!-- BRANDING HEADER -->
                    <tr>
                        <td align="left" style="padding: 30px 40px; border-bottom: 1px solid #1a1a1a;">
                            <span style="font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: -1px;">JG<span style="color: ${accentColor};">.</span></span>
                            <span style="float: right; font-size: 10px; color: ${accentColor}; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; padding-top: 10px;">${title}</span>
                        </td>
                    </tr>
                    
                    <!-- HERO SECTION -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px;">
                            <h2 style="margin: 0; font-size: 26px; font-weight: 700; color: #ffffff;">${subtitle}</h2>
                            <p style="margin: 15px 0 0 0; font-size: 15px; color: #888888; line-height: 1.6;">
                                ${isForAdmin 
                                    ? `Hola Julian, se ha generado una nueva interacción desde tu portafolio profesional.` 
                                    : `Hola ${data.name.split(' ')[0]}, gracias por contactar. He recibido tu requerimiento correctamente.`}
                            </p>
                        </td>
                    </tr>

                    <!-- DATA CARD -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px;">
                            <div style="background: linear-gradient(145deg, #0f0f0f, #080808); border: 1px solid #222222; border-radius: 12px; padding: 25px;">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td style="padding-bottom: 15px;">
                                            <div style="font-size: 10px; color: ${accentColor}; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Interesado</div>
                                            <div style="font-size: 16px; color: #ffffff; font-weight: 600; margin-top: 4px;">${data.name}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-bottom: 15px;">
                                            <div style="font-size: 10px; color: ${accentColor}; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Canal de Contacto</div>
                                            <div style="font-size: 14px; color: #cccccc; margin-top: 4px;">${data.email} • ${data.phone}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 15px; border-top: 1px solid #1a1a1a;">
                                            <div style="font-size: 10px; color: ${accentColor}; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Mensaje Estratégico</div>
                                            <div style="font-size: 15px; color: #ffffff; line-height: 1.5; margin-top: 8px; font-style: italic;">"${data.message}"</div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td align="center" style="padding: 30px; background-color: #050505; border-top: 1px solid #1a1a1a;">
                            <p style="margin: 0; font-size: 11px; color: #444444; text-transform: uppercase; letter-spacing: 1px;">
                                © ${new Date().getFullYear()} JULIAN GARCIA | SENIOR QA SPECIALIST
                            </p>
                        </td>
                    </tr>
                </table>
            </div>
        `;
    }

    async sendEmails(data) {
        const paramsAdmin = {
            to_email: this.adminEmail,
            message_html: this._getHtmlTemplate(data, true)
        };

        const paramsClient = {
            to_email: data.email,
            message_html: this._getHtmlTemplate(data, false)
        };

        try {
            // Intento 1: Usar el proxy del backend (producción segura, oculta las credenciales)
            const res1 = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ template_params: paramsAdmin })
            });
            const res2 = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ template_params: paramsClient })
            });

            if (!res1.ok || !res2.ok) {
                // Intento 2: Si el proxy falla (ej. localhost sin backend .env), usar EmailJS SDK
                if (typeof emailjs !== 'undefined' && this.config.PUBLIC_KEY && !this.config.PUBLIC_KEY.includes('TU_')) {
                    console.warn('[EmailService] Fallback a EmailJS SDK local...');
                    await Promise.all([
                        emailjs.send(this.config.SERVICE_ID, this.config.TEMPLATE_ID, paramsAdmin, this.config.PUBLIC_KEY),
                        emailjs.send(this.config.SERVICE_ID, this.config.TEMPLATE_ID, paramsClient, this.config.PUBLIC_KEY)
                    ]);
                    return true;
                }
                throw new Error('Email Proxy Failed and SDK not configured');
            }
            return true;
        } catch (error) {
            console.error('[EmailService] Fail:', error);
            throw error;
        }
    }
}

export const emailService = new EmailService();
