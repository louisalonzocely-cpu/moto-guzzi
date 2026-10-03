// ============================================================
// tienda.js — Brisa Moda
// Nuestro JavaScript. Se carga después de Bootstrap, por eso
// aquí ya existe el objeto «bootstrap».
// ============================================================
const botonesFiltro = document.querySelectorAll('.btn-filtro');
const columnasProducto = document.querySelectorAll('[data-categoria]');
const carrito = [];
const formatoPesos = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
});

botonesFiltro.forEach((boton) => {
    boton.addEventListener('click', () => {
        botonesFiltro.forEach((b) => {
            b.classList.remove('active', 'btn-dark');
            b.classList.add('btn-outline-dark');
        });
        boton.classList.add('active', 'btn-dark');
        boton.classList.remove('btn-outline-dark');

        const categoria = boton.dataset.filtro;
        columnasProducto.forEach((columna) => {
            const mostrar = categoria === 'todos' || columna.dataset.categoria === categoria;
            columna.classList.toggle('d-none', !mostrar);
        });
    });
});

function mostrarAviso(mensaje) {
    const aviso = document.getElementById('avisoCarrito');
    aviso.querySelector('.toast-body').textContent = mensaje;
    bootstrap.Toast.getOrCreateInstance(aviso).show();
}

function calcularTotal() {
    return carrito.reduce((suma, item) => suma + item.precio, 0);
}

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    document.dispatchEvent(new CustomEvent('carrito:cambio'));
    mostrarAviso(`${nombre} se agregó por ${formatoPesos.format(precio)}`);
}

function renderCarrito() {
    const lista = document.getElementById('listaCarrito');
    const hayItems = carrito.length > 0;

    lista.innerHTML = carrito.map((item, indice) => `
        <li class="list-group-item d-flex justify-content-between align-items-center gap-3">
            <div>
                <div class="fw-semibold">${item.nombre}</div>
                <small class="text-muted">${formatoPesos.format(item.precio)}</small>
            </div>
            <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar"
                    data-indice="${indice}" aria-label="Quitar ${item.nombre}">
                <i class="bi bi-trash"></i>
            </button>
        </li>`).join('');

    document.getElementById('carritoVacio').classList.toggle('d-none', hayItems);
    document.getElementById('resumenCarrito').classList.toggle('d-none', !hayItems);
    document.getElementById('totalCarrito').textContent = formatoPesos.format(calcularTotal());
    document.getElementById('contadorCarrito').textContent = carrito.length;
}

document.querySelectorAll('.btn-agregar').forEach((boton) => {
    boton.addEventListener('click', () => {
        agregarAlCarrito(boton.dataset.nombre, Number(boton.dataset.precio));
    });
});

document.getElementById('listaCarrito').addEventListener('click', (evento) => {
    const boton = evento.target.closest('.btn-eliminar');
    if (!boton) {
        return;
    }
    const nombre = carrito[Number(boton.dataset.indice)].nombre;
    carrito.splice(Number(boton.dataset.indice), 1);
    document.dispatchEvent(new CustomEvent('carrito:cambio'));
    mostrarAviso(`${nombre} se quitó del carrito`);
});

document.getElementById('btnFinalizar').addEventListener('click', () => {
    if (carrito.length === 0) {
        return;
    }
    const total = calcularTotal();
    carrito.length = 0;
    document.dispatchEvent(new CustomEvent('carrito:cambio'));
    mostrarAviso(`Compra confirmada por ${formatoPesos.format(total)}`);
    bootstrap.Offcanvas.getInstance(document.getElementById('panelCarrito')).hide();
});

document.addEventListener('carrito:cambio', renderCarrito);
