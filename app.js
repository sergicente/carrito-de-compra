import Carrito from "./Carrito.js";

const tablaProductos = document.querySelector("#productos table");
const listadoProductos = document.querySelector("#productos");
const cestaVacia = document.querySelector(".vacia");
const tablaCarrito = document.querySelector("#carrito table");
const subtotal = document.querySelector("#subtotal");
const botonLocalStorage = document.querySelector("#btnLocalStorage");
const iva = document.querySelector("#iva");
const total = document.querySelector("#total");
const carrito = new Carrito();
let catalogoProductos = [];

document.addEventListener("DOMContentLoaded", function (event) {
    // Obtenemos los productos desde la API utilizando al forma moderna con arrow functions
    fetch("https://jsonblob.com/api/jsonBlob/1294949121184882688")
        .then((response) => response.json())
        .then((posts) => {
            catalogoProductos = posts.products;
            crearTablaProductos(catalogoProductos);
        })
        // Añadimos también un mensaje de error que aparezca en el listado de productos
        .catch(() => {
            const mensajeError = document.createElement("p");
            mensajeError.textContent = "Error al cargar los productos. Por favor, inténtalo más tarde.";
            listadoProductos.appendChild(mensajeError);
        });

    // Función para crear la tabla de productos
    function crearTablaProductos(productos) {
        productos.forEach((p) => {
            const nuevaLinea = document.createElement("tr");
            const nombre = document.createElement("td");
            const id = document.createElement("td");
            const precio = document.createElement("td");
            const comprar = document.createElement("td");
            const botonComprar = document.createElement("button");
            nombre.innerText = p.title;
            id.innerText = p.SKU;
            precio.innerText = p.price + " €";
            botonComprar.innerHTML = `Añadir a la cesta`;
            botonComprar.classList.add("comprar");
            botonComprar.addEventListener("click", function () {
                carrito.agregarProducto(p);
                actualizarCarrito();
            });
            comprar.classList.add("celdacomprar");
            comprar.append(botonComprar);
            nuevaLinea.append(nombre, id, precio, comprar);
            tablaProductos.appendChild(nuevaLinea);
        });
    }

    function crearCabecera(){
        
    }

    // Función para actualizar el carrito
    function actualizarCarrito() {
        subtotal.textContent = parseFloat(carrito.calcularSubtotal()).toFixed(2) + " €";
        iva.textContent = parseFloat(carrito.calcularIva()).toFixed(2) + " €";
        total.textContent = parseFloat(carrito.calcularTotal()).toFixed(2) + " €";
        const productosEnElCarrito = carrito.obtenerProductos();

        if (carrito.calcularTotal() !== 0) {

            // Añadimos la cabecera de la tabla
            cestaVacia.classList.add("noMostrar");
            tablaCarrito.innerHTML = null;
            const cabecera = document.createElement("tr");
            const thProducto = document.createElement("th");
            thProducto.textContent = "Producto";
            const thCantidad = document.createElement("th");
            thCantidad.textContent = "Cantidad";
            const thPrecio = document.createElement("th");
            thPrecio.textContent = "Precio";
            const thTotal = document.createElement("th");
            thTotal.textContent = "Total";
            cabecera.append(thProducto, thCantidad, thPrecio, thTotal);
            tablaCarrito.append(cabecera);



            // Añadimos por cada artículo en el carrito una línea en la tabla
            productosEnElCarrito.forEach((producto) => {
                // Producto
                const nuevaFila = document.createElement("tr");
                const tdProducto = document.createElement("td");
                tdProducto.textContent = producto.title;

                // Cantidad
                const tdCantidad = document.createElement("td");
                const divBotones = document.createElement("div");
                divBotones.classList.add("celdaMenosMas");
                const botonMenos = document.createElement("button");
                const botonMas = document.createElement("button");
                const cantidad = document.createElement("span");
                cantidad.classList.add("numeros");
                botonMenos.innerText = "-";
                cantidad.innerText = producto.cantidad;
                botonMas.innerText = "+";

                // Añadimos los estilos
                botonMenos.classList.add("botCantMenos");
                botonMas.classList.add("botCantMas");

                // Añadimos funcionalidad al botón de restar
                botonMenos.addEventListener("click", function () {
                    if (producto.cantidad > 1) {
                        carrito.restarUnidad(producto.SKU);
                    } else {
                        carrito.eliminarProducto(producto.SKU);
                    }

                    // Disparar actualizarCarrito después de 0.1 segundos
                    setTimeout(function () {
                        actualizarCarrito();
                    }, 100);

                    // Añadimos nuevamente el mensaje de que no hay productos
                    setTimeout(function () {
                        if (carrito.calcularTotal() === 0) {
                            cestaVacia.classList.remove("noMostrar");
                            tablaCarrito.innerHTML = null;
                        }
                    }, 110);


                });

                // Añadimos funcionalidad al botón de sumar
                botonMas.addEventListener("click", function () {
                    carrito.sumarUnidad(producto.SKU);

                    // Disparar actualizarCarrito después de un instante para ver la animación del botón correctamente
                    setTimeout(function () {
                        actualizarCarrito();
                    }, 100);
                });

                divBotones.append(botonMenos, cantidad, botonMas);
                tdCantidad.append(divBotones);

                // Precio
                const tdPrecio = document.createElement("td");
                tdPrecio.textContent = parseFloat(producto.price).toFixed(2) + " €";

                // Total
                const tdTotal = document.createElement("td");
                tdTotal.textContent = parseFloat(producto.total).toFixed(2) + " €";

                // Añadimos todo a la nueva fila
                nuevaFila.append(tdProducto, tdCantidad, tdPrecio, tdTotal);
                tablaCarrito.appendChild(nuevaFila);
            });

        }

        // Guardamos los cambios en el Local Storage
        guardarEnLocalStorage();
        console.log(carrito);
    }

    // Listener que escuchará si se activa o no el botón de guardado de datos en LocalStorage
    botonLocalStorage.addEventListener("click", function () {
        if (botonLocalStorage.textContent === "Activado") {
            botonLocalStorage.textContent = "Desactivado";
            botonLocalStorage.classList.remove("activado");
        } else {
            botonLocalStorage.textContent = "Activado";
            botonLocalStorage.classList.add("activado");
            guardarEnLocalStorage();
        }
        localStorage.setItem("botonTexto", botonLocalStorage.textContent);
    });

    // Función que se encarga de guardar el carrito en el Local Storage
    function guardarEnLocalStorage() {
        // Convertimos el Map del carrito a un array
        const carritoComoArray = Array.from(carrito.productos.entries());
        // Guardar el array como json en localStorage
        localStorage.setItem("carrito", JSON.stringify(carritoComoArray));
    }

    // Obtenemos el carrito desde el Local Storage una vez se carga la página
    window.onload = function () {
        // Asignamos un posible carrito del localStorage a una variable
        const carritoEnJson = localStorage.getItem("carrito");

        // Si existe la posición del botón, recuperarla y asignarla al botón
        const botonTextoGuardado = localStorage.getItem("botonTexto");
        if (botonTextoGuardado) {
            botonLocalStorage.textContent = botonTextoGuardado;
        }

        // Actualizamos la clase del botón según su estado almacenado
        if (botonLocalStorage.textContent === "Activado") {
            botonLocalStorage.classList.add("activado");
        } else {
            botonLocalStorage.classList.remove("activado");
        }

        // Cargamos el carrito solo si el botón está activado
        if (carritoEnJson && botonLocalStorage.textContent === "Activado") {
            // Convertimos el JSON a un array y luego lo convertimos en un Map
            const carritoComoArray = JSON.parse(carritoEnJson);
            carrito.productos = new Map(carritoComoArray);

            actualizarCarrito();
        }
    };
});
