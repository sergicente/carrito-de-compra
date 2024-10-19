class Carrito {
    constructor() {
        this.productos = [];
    }

    // Método para agregar un producto al carrito o incrementar una unidad si ya existe
    agregarProducto(producto) {
        let existe = false;

        // Buscamos si está en el carrito y si está incrementamos cantidad en 1 unidad
        for (let i = 0; i < this.productos.length; i++) {
            if (this.productos[i].SKU === producto.SKU) {
                existe = true;
                this.productos[i].cantidad++;
                this.productos[i].total = this.productos[i].price * this.productos[i].cantidad;
                break;
            }
        }

        // Si no está en el carrito lo añadimos con cantidad 1
        if (!existe) {
            this.productos.push({
                title: producto.title,
                SKU: producto.SKU,
                price: producto.price,
                cantidad: 1,
                total: producto.price,
            });
        }
    }

    // Método para obtener la lista de productos en el carrito
    obtenerProductos() {
        return this.productos;
    }

    // Método para sumar una unidad
    sumarUnidad(sku) {
        for (let i = 0; i < this.productos.length; i++) {
            if (this.productos[i].SKU === sku) {
                ++this.productos[i].cantidad;
                this.productos[i].total = this.productos[i].price * this.productos[i].cantidad;
                break;
            }
        }
    }

    // Método para restar una unidad
    restarUnidad(sku) {
        for (let i = 0; i < this.productos.length; i++) {
            if (this.productos[i].SKU === sku) {
                --this.productos[i].cantidad;
                this.productos[i].total = this.productos[i].price * this.productos[i].cantidad;
                break;
            }
        }
    }

    // Método para sacar un producto del carrito
    eliminarProducto(sku) {
        let nuevoArrayProductos = [];
        for (let i = 0; i < this.productos.length; i++) {
            if (this.productos[i].SKU !== sku) {
                nuevoArrayProductos.push(this.productos[i]);
            }
        }
        this.productos = nuevoArrayProductos;
    }

    // Método para calcular el total
    calcularSubtotal() {
        let subtotal = 0;
        for (let i = 0; i < this.productos.length; i++) {
            subtotal += this.productos[i].price * this.productos[i].cantidad;
        }

        return subtotal;
    }

    // Método para calcular el IVA
    calcularIva() {
        let subtotal = this.calcularSubtotal();
        return subtotal * 0.21;
    }

    // Método para sumar el subtotal y el IVA
    calcularTotal() {
        let subtotal = this.calcularSubtotal();
        let iva = this.calcularIva();
        return subtotal + iva;
    }
}

export default Carrito;
