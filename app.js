// --- ¡IMPORTANTE! ---
// Usá tu URL que termina en output=tsv
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTzsalmKmMs0A7Uo3JeO76oJVjWMotKYiFl3d4HuuLJ0oejUt_yO-plTgY4GiJdP8bo8-tGZXPlwtd4/pub?gid=0&single=true&output=tsv';
// ---------------------

const contenedor = document.getElementById('catalogo-container');

fetch(GOOGLE_SHEET_URL)
  .then(respuesta => respuesta.text())
  .then(csvTexto => {
    contenedor.innerHTML = '';
    const filas = csvTexto.split('\n');

    for (let i = 1; i < filas.length; i++) {

      if (!filas[i]) continue;
      const celdas = filas[i].split('\t'); // Separador por Tab

      if (!celdas[0] || celdas[0] === "") {
        continue;
      }

      // --- CAMBIO 1: Ya no leemos el stock de celdas[5] ---
      const sku = celdas[0];
      const producto = celdas[1];
      const precio = celdas[2];
      const imagenUrl = celdas[3];
      const descripcion = celdas[4]; // Columna E

      // Creamos la tarjeta del producto
      const productoCard = document.createElement('div');
      productoCard.className = 'producto-card';

      // --- CAMBIO 2: El 'sku' se usa para el ID del botón de stock ---
      // ... (código anterior) ...

            // --- CAMBIO 2: El 'sku' se usa para el ID del botón de stock ---
            const skuLimpio = sku.replace(/[^a-zA-Z0-9]/g, '-'); // Limpia el SKU para usarlo como ID

            productoCard.innerHTML = `
                
                ${imagenUrl ? `<img src="${imagenUrl}" alt="${producto || ''}">` : ''}
                
                <div class="producto-info">
                    <h3>${producto || ''}</h3>
                    <p class="descripcion">${descripcion || ''}</p> 

                    <div class="info-botones">
                        
                        <div class="boton-grupo">
                            <h5 class="leyenda-boton">Stock</h5>
                            <span class="boton-info stock-boton" id="stock-${skuLimpio}">
                                Consultando...
                            </span>
                        </div>

                        <div class="boton-grupo">
                            <h5 class="leyenda-boton">SKU</h5>
                            <span class="boton-info sku-boton">${sku || ''}</span>
                        </div>
                        
                        <div class="boton-grupo">
                            <h5 class="leyenda-boton">MAYORISTA SIN IVA 10.5%</h5>
                            <span class="boton-info precio-boton">$ ${precio || 'N/A'}</span>
                        </div>

                    </div>
                </div>
            `;

            // ... (resto del código) ...

      contenedor.appendChild(productoCard);
    }
  })
  .catch(error => {
    console.error('¡Error al cargar el catálogo!', error);
    contenedor.innerHTML = '<p>Error al cargar productos. Intente más tarde.</p>';
  });


