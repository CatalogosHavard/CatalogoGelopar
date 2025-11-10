// --- ¡IMPORTANTE! ---
// Usá tu URL que termina en output=tsv
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTzsalmKmMs0A7Uo3JeO76oJVjWMotKYiFl3d4HuuLJ0oejUt_yO-plTgY4GiJdP8bo8-tGZXPlwtd4/pub?gid=478297482&single=true&output=tsv';
const API_STOCK_URL = 'https://script.google.com/macros/s/AKfycbznY4_l7PbrT0VhyKVP63KhJHQX21pOUKBkahp6DaFZD4Yr0g9iugrnxSHCL-mLcCENQQ/exec';
// ---------------------

/**
 * Esta función toma el texto de la celda de Specs 
 * y lo convierte en una lista <li> de HTML.
 */
function parseSpecs(specsString) {
    if (!specsString) return '';

    return specsString.split('|') // Separa por |
        .map(spec => {
            const parts = spec.split(':'); // Separa por :
            if (parts.length < 2) return `<li>${spec}</li>`; 
            const key = parts[0];
            const value = parts.slice(1).join(':');
            return `<li><strong>${key}:</strong> ${value}</li>`;
        })
        .join('');
}

// --- Código principal ---
const contenedor = document.getElementById('catalogo-container');

fetch(GOOGLE_SHEET_URL)
    .then(respuesta => respuesta.text())
    .then(csvTexto => {
        contenedor.innerHTML = ''; 
        const filas = csvTexto.split('\n');

        for (let i = 1; i < filas.length; i++) {
            
            if (!filas[i]) continue; 
            const celdas = filas[i].split('\t');

            if (!celdas[0] || celdas[0] === "") {
                continue;
            }
            
            const title = celdas[0];
            const imagenUrl = celdas[1];
            const specsRaw = celdas[2];
            const mla = celdas[3];
            const stockPlaceholder = celdas[4];
            const sku = celdas[5];
            const mayoristaLeyenda = celdas[6];
            const mayoristaPrecio = celdas[7];
            const ingresan = celdas[8]; // Columna I
            
            const skuLimpio = sku.replace(/[^a-zA-Z0-9]/g, '-');

            const productoCard = document.createElement('div');
            productoCard.className = 'producto-card';

            const specsHTML = parseSpecs(specsRaw);

            productoCard.innerHTML = `
                <div class="product-main-info">
                    <div class="product-image">
                        <img src="${imagenUrl}" alt="${title || ''}">
                        
                        ${ (ingresan && ingresan.trim() !== "") ? `<p class="leyenda-ingreso">Reingresan: ${ingresan.trim()}</p>` : '' }

                    </div>
                    <div class="product-details">
                        <h2>${title || ''}</h2>
                        <ul class="specs-list">
                            ${specsHTML}
                        </ul>
                    </div>
                </div>
                <div class="product-meta-info">
                    <div class="stock-box">
                        <span>STOCK</span>
                        <div id="stock-${skuLimpio}">${stockPlaceholder || '...'}</div>
                    </div>
                    <div class="sku-box">
                        <span>SKU</span>
                        ${sku || ''}
                    </div>
                    <div class="mayorista-box">
                        <span>${mayoristaLeyenda || ''}</span>
                        ${mayoristaPrecio || '-'}
                    </div>
                </div>
            `;
            
            // (La función de fetch de stock queda igual)
            (function(mlaParaBuscar, idDelSpan) {
                if (!mlaParaBuscar || mlaParaBuscar === "") return;
                fetch(API_STOCK_URL + "?mla=" + encodeURIComponent(mlaParaBuscar))
                    .then(respuesta => respuesta.json())
                    .then(data => {
                        if (data.stock !== undefined) {
                            const stockDiv = document.getElementById(idDelSpan);
                            if (stockDiv) {
                                stockDiv.textContent = data.stock;
                            }
                        }
                    })
                    .catch(error => {
                        console.warn('Error al buscar stock para MLA ' + mlaParaBuscar, error);
                    });
            })(mla, `stock-${skuLimpio}`);

            contenedor.appendChild(productoCard);
        }
    })
    .catch(error => {
        console.error('¡Error al cargar el catálogo!', error);
        contenedor.innerHTML = '<p>Error al cargar productos. Intente más tarde.</p>';
    });



