import Carrito from "./Carrito.js";

const tablaProductos = document.querySelector("#productos table");
const tablaCarrito = document.querySelector("#carrito table");
const subtotal = document.querySelector("#subtotal");
const botonLS = document.querySelector("btnLocalStorage");
const iva = document.querySelector("#iva");
const total = document.querySelector("#total");
const carrito = new Carrito();
let catalogoProductos = [];



// Obtenemos los productos desde la API utilizando al forma moderna con arrow functions
fetch("https://jsonblob.com/api/jsonBlob/1294949121184882688")
    .then((response) => response.json())
    .then((posts) => {
        catalogoProductos = posts.products;
        crearTablaProductos(catalogoProductos);
    });

// Función para crear la tabla de productos
function crearTablaProductos(productos) {
    for (let i = 0; i < productos.length; i++) {
        const nuevaFila = document.createElement("tr");
        nuevaFila.innerHTML = `
            <td>${productos[i].title}</td>
            <td>${productos[i].SKU}</td>
            <td>${productos[i].price} €</td>
            <td><button class="comprar" sku="${productos[i].SKU}">Añadir a la Cesta</button></td>
        `;
        tablaProductos.appendChild(nuevaFila);
    }

    // Agregamos funcionalidad a los botones de compra
    const botonesComprar = document.querySelectorAll(".comprar");
    botonesComprar.forEach((boton) => {
        boton.addEventListener("click", () => {
            agregarAlCarrito(boton.getAttribute("sku"));
        });
    });
}

// Función para agregar producto al carrito de compra
function agregarAlCarrito(sku) {
    for (let i = 0; i < catalogoProductos.length; i++) {
        if (catalogoProductos[i].SKU === sku) {
            carrito.agregarProducto(catalogoProductos[i]);
            actualizarCarrito();
        }
    }
}

// Función para actualizar el carrito
function actualizarCarrito() {
    subtotal.textContent = parseFloat(carrito.calcularSubtotal()).toFixed(2) + " €";
    iva.textContent = parseFloat(carrito.calcularIva()).toFixed(2) + " €";
    total.textContent = parseFloat(carrito.calcularTotal()).toFixed(2) + " €";
    const productosEnElCarrito = carrito.obtenerProductos();

    // Añadimos la cabecera de la tabla
    tablaCarrito.innerHTML = `
        <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Total</th>
        </tr>
    `;

    // Añadimos por cada artículo en el carrito una línea en la tabla
    for (let i = 0; i < productosEnElCarrito.length; i++) {
        const nuevaFila = document.createElement("tr");
        nuevaFila.innerHTML = `
            <td>${productosEnElCarrito[i].title}</td>
            <td>
                <button class="botCantMenos" sku="${productosEnElCarrito[i].SKU}">-</button>
                ${productosEnElCarrito[i].cantidad}
                <button class="botCantMas" sku="${productosEnElCarrito[i].SKU}">+</button>
            </td>
            <td>${parseFloat(productosEnElCarrito[i].price).toFixed(2)} €</td>
            <td>${parseFloat(productosEnElCarrito[i].total).toFixed(2)} €</td>
        `;
        tablaCarrito.appendChild(nuevaFila);
    }

    // Añadir eventos a los botones "menos" y "más"
    const botonesMas = document.querySelectorAll(".botCantMas");
    const botonesMenos = document.querySelectorAll(".botCantMenos");

    // Añadimos la funcionalidad de sumar una unidad
    for (let i = 0; i < botonesMas.length; i++) {
        botonesMas[i].addEventListener("click", function () {
            const sku = this.getAttribute("sku");
            carrito.sumarUnidad(sku);
            actualizarCarrito();
        });
    }
    // Añadimos la funcionalidad de restar una unidad
    for (let i = 0; i < botonesMenos.length; i++) {
        botonesMenos[i].addEventListener("click", function () {
            const sku = this.getAttribute("sku");
            if (buscarProductoEnCarrito(sku).cantidad > 1) {
                carrito.restarUnidad(sku);
            } else {
                carrito.eliminarProducto(sku);
            }
            actualizarCarrito();
        });
    }

    // Convertimos el carrito a una cadena JSON
    const carritoComoJSON = JSON.stringify(carrito.productos);

    // Guardar la cadena en localStorage con el nombre carrito
    localStorage.setItem("carrito", carritoComoJSON);
}

// Función para buscar un producto en el carrito
function buscarProductoEnCarrito(sku) {
    for (let i = 0; i < carrito.obtenerProductos().length; i++) {
        if (carrito.obtenerProductos()[i].SKU === sku) {
            return carrito.obtenerProductos()[i];
            break;
        }
    }
    return null;
}

// Obtenemos el carrito desde el Local Storage una vez se carga la página
window.onload = function () {
    const carritoEnJson = localStorage.getItem("carrito");
    if (carritoEnJson) {
        carrito.productos = JSON.parse(carritoEnJson);
    }
    actualizarCarrito();
};
