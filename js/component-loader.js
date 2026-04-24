/**
 * ComponentLoader - Clase utilitaria para la carga de componentes HTML compartidos.
 * 
 * Este módulo soluciona el problema de la duplicación de código (DRY). 
 * En lugar de copiar y pegar el Navbar y el Footer en cada archivo .html, 
 * los cargamos dinámicamente desde la carpeta /components.
 */
export class ComponentLoader {
    /**
     * Busca los contenedores designados y carga su contenido desde archivos externos.
     * Es un método estático, por lo que no requiere instanciar la clase (ComponentLoader.loadAll()).
     * @returns {Promise<void>}
     */
    static async loadAll() {
        // Mapa de componentes: 'selector' es el tag en el HTML, 'file' es la ruta al fragmento.
        const components = [
            { selector: '.navbar', file: 'components/header.html' },
            { selector: '.footer', file: 'components/footer.html' }
        ];

        // Creamos una lista de tareas (promesas) para cargar todo en paralelo
        const tasks = components.map(async ({ selector, file }) => {
            const container = document.querySelector(selector);
            
            // Si el contenedor no existe en esta página, ignoramos esta tarea
            if (!container) return;

            try {
                // Realizamos la petición HTTP al archivo del componente
                const response = await fetch(file);
                
                // Si la respuesta es exitosa (200 OK)
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                
                // Extraemos el texto (HTML plano)
                const html = await response.text();
                
                // Inyectamos el HTML en el contenedor del DOM
                container.innerHTML = html;
            } catch (error) {
                // Error crítico si el componente no se encuentra (revisar rutas)
                console.error(`Error crítico cargando componente ${file}:`, error);
            }
        });

        // Esperamos a que todas las cargas finalicen antes de continuar con la ejecución del sitio
        await Promise.all(tasks);
    }
}
