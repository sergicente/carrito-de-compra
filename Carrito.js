class Carrito {
    constructor() {
        this.productos = [];
    }

    // Método para agregar un producto al carrito o incrementar una unidad si ya existe
    agregarProducto(producto) {
        let existe = false;

        // Buscamos si está en el carrito y si está incrementamos cantidad en 1 unidad
        this.productos.forEach((p) => {
            if (p.SKU === producto.SKU) {
                existe = true;
                p.cantidad++;
                p.total = p.price * p.cantidad;
                return; // Para simular el break y salir del forEach.
            }
        });

        // Si no está en el carrito lo añadimos con cantidad 1
        if (!existe) {
            this.productos.push({
                title: producto.title,
                SKU: producto.SKU,
                price: parseFloat(producto.price),
                cantidad: 1,
                total:  parseFloat(producto.price),
            });
        }
    }

    // Método para obtener la lista de productos en el carrito
    obtenerProductos() {
        return this.productos;
    }

    // Método para sumar una unidad
    sumarUnidad(sku) {
        this.productos.forEach((p) => {
            if (p.SKU === sku) {
                ++p.cantidad;
                p.total = p.price * p.cantidad;
                return; // Para simular el break y salir del forEach.
            }
        });
    }

    // Método para restar una unidad
    restarUnidad(sku) {
        this.productos.forEach((p)=>{
            if (p.SKU === sku) {
                --p.cantidad;
                p.total = p.price * p.cantidad;
                return;
            }
        })

    }

    // Método para sacar un producto del carrito
    eliminarProducto(sku) {
        let nuevoArrayProductos = [];
        this.productos.forEach((p) => {
            if (p.SKU !== sku) {
                nuevoArrayProductos.push(p);
            }
        });
        this.productos = nuevoArrayProductos;
    }

    // Método para calcular el total
    calcularSubtotal() {
        let subtotal = 0;
        this.productos.forEach((p) => {
            subtotal += p.price * p.cantidad;
        });
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
