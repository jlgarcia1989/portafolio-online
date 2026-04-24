# 🚀 Julian Garcia - Senior QA Tech Lead & Systems Engineer Portfolio

![Portfolio Preview](assets/og-image.png)

> Portafolio profesional interactivo y dinámico, construido con una arquitectura sólida y limpia. Este proyecto no solo sirve como una vitrina de más de 13 años de experiencia, sino que también funciona como una aplicación robusta que integra generación de documentos PDF en tiempo real y sincronización de datos con un Headless CMS.

## 🎯 Visión General del Proyecto

Este repositorio contiene el código fuente del portafolio personal y profesional de Julian Garcia. El sistema está diseñado con una mentalidad **API-First** y **Component-Based**, evitando frameworks pesados innecesarios y priorizando el rendimiento, la accesibilidad y el Clean Code mediante Vanilla JavaScript moderno.

### ✨ Características Principales

- **Arquitectura Modular (Component-Based)**: Implementación DRY mediante `ComponentLoader` para reutilización dinámica de encabezados y pies de página.
- **Generador de CV PDF Avanzado**: Motor de renderizado en tiempo real (basado en `html2pdf.js`) que compila la trayectoria completa (+20 experiencias, proyectos y metodologías) en un documento PDF de alta fidelidad, respetando el modo oscuro y la paginación.
- **Headless CMS con Airtable**: Toda la información profesional (Experiencia, Proyectos, Habilidades) se extrae de Airtable, funcionando como una única fuente de verdad (Single Source of Truth).
- **Diseño Responsive & UI/UX Premium**: Estética moderna con variables CSS nativas, modo oscuro por defecto y animaciones fluidas basadas en scroll.
- **Formulario de Contacto Seguro**: Integración con EmailJS, validación por expresiones regulares (RegEx) y manejo de estados de carga.
- **Principios SOLID & Clean Code**: Refactorización estricta asegurando el Principio de Responsabilidad Única (SRP) en orquestadores, servicios y renderizadores.

## 🛠️ Stack Tecnológico

- **Frontend Core**: HTML5 Semántico, CSS3 (CSS Variables, Flexbox, CSS Grid), Vanilla ES6+ JavaScript.
- **BaaS / Headless CMS**: Airtable REST API.
- **Librerías de Utilidad**:
  - `html2pdf.js`: Para la generación asíncrona de documentos PDF.
  - `EmailJS`: Para la gestión transaccional de correos de contacto.
  - `FontAwesome`: Iconografía vectorial.
- **Metodología de Desarrollo**: Mobile-First, BEM (modificado para clases utilitarias), SOLID.

## ⚙️ Configuración y Despliegue Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/jlgarcia1989/portafolio-online.git
cd portafolio-online
```

### 2. Configurar Variables de Entorno (Credenciales)
Por razones de seguridad, las credenciales de las APIs no están incluidas en este repositorio.
1. Abre el archivo `js/config.js`.
2. Reemplaza los valores de `TU_AIRTABLE_PERSONAL_ACCESS_TOKEN`, `TU_BASE_ID`, y las credenciales de `EmailJS` con tus llaves reales.
3. **Importante:** Si vas a realizar commits locales, asegúrate de no subir tus llaves privadas. Puedes usar un archivo local ignorado por Git (ej. `config.local.js`) durante el desarrollo.

### 3. Ejecutar el Servidor de Desarrollo
Al utilizar Vanilla JS y módulos de ES6, necesitas levantar un servidor local para evitar problemas de CORS al cargar componentes o realizar peticiones a la API. Puedes usar extensiones como "Live Server" en VSCode o herramientas de Node:

```bash
npx serve .
```
Abre `http://localhost:3000` en tu navegador.

## 🏗️ Arquitectura de Carpetas

```text
/
├── assets/                 # Imágenes, PDFs y recursos estáticos
├── components/             # Fragmentos HTML reutilizables (header, footer)
├── css/                    # Hojas de estilo modulares (variables, base, layout, etc.)
├── js/                     # Lógica de negocio (ES Modules)
│   ├── services/           # Conectores externos (AirtableService, EmailService)
│   ├── component-loader.js # Motor de inyección de dependencias UI
│   ├── cv-generator.js     # Orquestador principal de exportación a PDF
│   └── main.js             # Punto de entrada de la aplicación
├── scripts/                # Scripts utilitarios (ej. Scraping local a Airtable)
├── cv-print.html           # Plantilla aislada para el motor de PDF
└── *.html                  # Vistas principales (index, proyectos, experiencia, etc.)
```

## 🔒 Postura de Seguridad (SecOps)
- Ausencia de llaves hardcodeadas en el código versionado.
- Prevención de inyección de código mediante mapeo seguro de datos en el renderizado del DOM (`textContent` vs `innerHTML` estratégico).
- Configuración de CORS adecuada en las llamadas a la API de Airtable.

---
*Desarrollado con altos estándares de Ingeniería de Calidad por Julian Garcia.*