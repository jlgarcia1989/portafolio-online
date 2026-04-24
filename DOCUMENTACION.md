# 🚀 Guía Técnica del Portafolio Profesional - Julian Garcia

Esta documentación está diseñada para que cualquier desarrollador pueda entender, mantener y escalar el portafolio de manera eficiente, siguiendo principios de **Clean Code**, **SOLID** y **Arquitectura Modular**.

---

## 🏗️ 1. Arquitectura del Proyecto

El proyecto está construido como una aplicación web estática modular que utiliza JavaScript moderno (ES6 Modules) para desacoplar las responsabilidades.

### Directorios Principales
- `/components`: Contiene fragmentos HTML reutilizables (Header, Footer).
- `/css`: Hojas de estilo organizadas por capas (Variables, Base, Componentes, Secciones).
- `/js`: Lógica de negocio dividida en clases y módulos.
- `/assets`: Recursos visuales (Imágenes, Iconos, PDFs).

---

## 🛠️ 2. Sistema de Componentes (DRY)

Para evitar la duplicación de código en las 8 páginas HTML, utilizamos un sistema de carga dinámica.

- **`js/component-loader.js`**: Esta clase se encarga de buscar selectores como `.navbar` y `.footer` e inyectar el contenido de los archivos en `/components`.
- **Cómo modificar el menú**: Edita únicamente `components/header.html`. El cambio se reflejará automáticamente en todas las páginas.

---

## ⚙️ 3. Configuración Centralizada (SOLID)

Siguiendo el principio de **Responsabilidad Única (SRP)**, hemos centralizado todos los parámetros del sistema en:

- **`js/config.js`**: Contiene las API Keys de Airtable, URLs de Webhooks y parámetros de configuración del CV (rutas, nombres de archivo).
- **`js/seo-config.js`**: Contiene todos los títulos, descripciones y palabras clave para el motor de búsqueda.

---

## 📄 4. Motor de Generación de CV

El generador de CV (`js/cv-generator.js`) es una de las piezas más complejas:

1. **Captura de Datos**: Utiliza `fetch` y `DOMParser` para leer el contenido de todas las páginas del sitio de forma asíncrona.
2. **Template**: Utiliza `cv-template.html` como base visual (Dark Mode Premium).
3. **Conversión**: Emplea la librería `html2pdf.js` con una configuración de alta resolución (3x scale) para generar un documento profesional.

---

## 🔍 5. Estrategia SEO (Expert Level)

El SEO se gestiona en dos niveles:
1. **Estático**: Etiquetas inyectadas directamente en el `<head>` de cada archivo HTML para máxima indexación.
2. **Dinámico**: Configuración en `js/seo-config.js` para facilitar actualizaciones masivas.
3. **Técnico**: Se incluyen archivos `robots.txt` y `sitemap.xml` generados para optimizar el rastreo de Google.

---

## 📬 6. Formulario de Contacto

Ubicado en `js/contact.js`, la clase `ContactForm` realiza una triple acción:
1. **Validación**: Verifica regex de nombre, email y teléfono.
2. **Persistencia**: Envía los datos a **Airtable** mediante su API REST.
3. **Notificación**: Dispara un Webhook hacia **n8n** para notificaciones en tiempo real.

---

## 🛠️ 7. Guía para Desarrolladores

### Agregar una nueva página
1. Crea el archivo `.html`.
2. Incluye los tags vacíos: `<header class="navbar"></header>` y `<footer class="footer"></footer>`.
3. Importa `js/main.js` como un módulo al final del body.
4. Agrega la metadata de la página en `js/seo-config.js`.

### Cambiar el estilo visual
- Los colores y espaciados principales están en `css/variables.css`.
- Las sombras y estilos de tarjetas están unificados bajo la clase `.card` en `css/components.css`.

### Actualizar API Keys
- Modifica únicamente el objeto `CONFIG` en `js/config.js`.

---

**Nota sobre Seguridad**: Este proyecto sigue las recomendaciones de **OWASP** para prevenir inyecciones y fallos de autenticación en formularios de frontend.
