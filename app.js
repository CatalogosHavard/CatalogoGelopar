// --- ¡IMPORTANTE! ---
// Pegá acá la URL de tu Google Sheet publicado como .csv
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTzsalmKmMs0A7Uo3JeO76oJVjWMotKYiFl3d4HuuLJ0oejUt_yO-plTgY4GiJdP8bo8-tGZXPlwtd4/pub?gid=0&single=true&output=csv';
// ---------------------

// 1. Seleccionamos el contenedor que creamos en el HTML
const contenedor = document.getElementById('catalogo-container');

// 2. Usamos 'fetch' para ir a buscar los datos a la URL
fetch(GOOGLE_SHEET_URL)
    .then(respuesta => respuesta.text()) // Pedimos la respuesta como texto
    .then(csvTexto => {
        // 3. Limpiamos el contenedor que decía "Cargando..."
        contenedor.innerHTML = ''; 

        // 4. Convertimos el texto CSV en filas
        const filas = csvTexto.split('\n');

        // 5. Nos saltamos la primera fila (fila 0) porque es el encabezado
        for (let i = 1; i < filas.length; i++) {
            
            if (!filas[i]) continue; // Ignoramos filas vacías

            // 6. Separamos cada fila por la coma
            // OJO: Si tus productos tienen comas, esto se complica.
            const celdas = filas[i].split(',');

            // Asignamos según el orden de tu Google Sheet
            const sku = celdas[0];
            const producto = celdas[1];
            const precio = celdas[2];
            // const imagenUrl = celdas[3]; // Si agregaste imagen

            // 7. Creamos el HTML para este producto
            const productoCard = document.createElement('div');
            // IMPORTANTE: Le damos una "clase" para poder darle estilos en CSS
            productoCard.className = 'producto-card'; 

            productoCard.innerHTML = `
                <h3>${producto}</h3>
                <p class="precio">$ ${precio}</p>
                <p class="sku">SKU: ${sku}</p>
            `;

            // 8. Añadimos la tarjeta del producto al contenedor
            contenedor.appendChild(productoCard);
        }
    })
    .catch(error => {
        console.error('¡Error al cargar el catálogo!', error);
        contenedor.innerHTML = '<p>Error al cargar productos. Intente más tarde.</p>';

    });


