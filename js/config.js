/**
 * Configuración global de la aplicación (Versión de Producción / GitHub)
 * REEMPLAZA LOS VALORES CON TUS CREDENCIALES REALES EN UN ENTORNO LOCAL.
 */
export const CONFIG = {
    AIRTABLE: {
        API_KEY: "TU_AIRTABLE_PERSONAL_ACCESS_TOKEN",
        BASE_ID: "TU_BASE_ID",
        TABLE_ID: "TU_TABLE_ID"
    },
    EMAILJS: {
        PUBLIC_KEY: "TU_EMAILJS_PUBLIC_KEY",
        SERVICE_ID: "TU_EMAILJS_SERVICE_ID",
        TEMPLATE_ID: "TU_EMAILJS_TEMPLATE_ID"
    },
    VALIDATION: {
        NAME_REGEX: /^[A-Za-zÀ-ÿñÑ\s]{2,80}$/,
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        PHONE_REGEX: /^\d{7,15}$/,
        MAX_MESSAGE_LENGTH: 500
    },
    CV_CONFIG: {
        TEMPLATE_PATH: "cv-template.html",
        DEFAULT_NAME: "JULIAN GARCIA",
        DEFAULT_ROLE: "Ingeniero de Sistemas // QA Senior",
        FILENAME: "Julian_Garcia_CV_Premium.pdf"
    }
};
