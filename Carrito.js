class Carrito {
    constructor() {
        // Iniciamos una colección Map
        this.productosCarrito = new Map();
    }

    // Método para agregar un producto al carrito o incrementar una unidad si ya existe
    agregarProducto(producto) {
        // Buscamos si está en el carrito y si está incrementamos cantidad en 1 unidad
        if (this.productosCarrito.has(producto.SKU)) {
            let p = this.productosCarrito.get(producto.SKU);
            p.cantidad++;
            p.total = p.price * p.cantidad;
        } else {
            // Si no está en el carrito lo añadimos con cantidad 1
            this.productosCarrito.set(producto.SKU, {
                title: producto.title,
                SKU: producto.SKU,
                price: parseFloat(producto.price),
                cantidad: 1,
                total: parseFloat(producto.price),
            });
        }
    }

    // Método para obtener la lista de productos en el carrito en formato Array
    obtenerProductos() {
        return Array.from(this.productosCarrito.values());
    }

    // Método para sumar una unidad
    sumarUnidad(sku) {
        if (this.productosCarrito.has(sku)) {
            let p = this.productosCarrito.get(sku);
            p.cantidad++;
            p.total = p.price * p.cantidad;
        }
    }

    // Método para restar una unidad
    restarUnidad(sku) {
        if (this.productosCarrito.has(sku)) {
            let p = this.productosCarrito.get(sku);
            p.cantidad--;
            p.total = p.price * p.cantidad;
        }
    }

    // Método para sacar un producto del carrito
    eliminarProducto(sku) {
        this.productosCarrito.delete(sku);
    }

    // Método para calcular el total
    calcularSubtotal() {
        let subtotal = 0;
        this.productosCarrito.forEach((p) => {
            subtotal += p.price * p.cantidad;
        });
        return subtotal;
    }

    // Método para calcular el IVA
    calcularIva() {
        return this.calcularSubtotal() * 0.21;
    }

    // Método para sumar el subtotal y el IVA
    calcularTotal() {
        return this.calcularSubtotal() + this.calcularIva();
    }
}

export default Carrito;
