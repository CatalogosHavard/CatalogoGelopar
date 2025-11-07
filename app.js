// --- ¡IMPORTANTE! ---
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTzsalmKmMs0A7Uo3JeO76oJVjWMotKYiFl3d4HuuLJ0oejUt_yO-plTgY4GiJdP8bo8-tGZXPlwtd4/pub?gid=0&single=true&output=csv';
// ---------------------

const contenedor = document.getElementById('catalogo-container');

fetch(GOOGLE_SHEET_URL)
    .then(respuesta => respuesta.text())
    .then(csvTexto => {
        contenedor.innerHTML = ''; 
        const filas = csvTexto.split('\n');

        for (let i = 1; i < filas.length; i++) {
            
            // Ignoramos la fila si está totalmente vacía
            if (!filas[i]) continue; 

            const celdas = filas[i].split(',');

            // --- ¡AQUÍ ESTÁ LA NUEVA VALIDACIÓN! ---
            // Si la primera celda (tu SKU) está vacía o indefinida,
            // nos saltamos esta fila por completo.
            if (!celdas[0] || celdas[0] === "") {
                continue;
            }
            
            // Asignamos las variables (asegurate que el orden sea correcto)
            const sku = celdas[0];
            const producto = celdas[1];
            const precio = celdas[2];
            // const imagenUrl = celdas[3];

            // Creamos la tarjeta del producto
            const productoCard = document.createElement('div');
            productoCard.className = 'producto-card'; 

            productoCard.innerHTML = `
                <h3>${producto || ''}</h3>
                <p class="precio">$ ${precio || 'N/A'}</p>
                <p class="sku">SKU: ${sku || ''}</p>
            `;

            contenedor.appendChild(productoCard);
        }
    })
    .catch(error => {
        console.error('¡Error al cargar el catálogo!', error);
        contenedor.innerHTML = '<p>Error al cargar productos. Intente más tarde.</p>';
    });
