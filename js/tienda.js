// ============================================================
// tienda.js — Brisa Moda
// Nuestro JavaScript. Se carga después de Bootstrap, por eso
// aquí ya existe el objeto «bootstrap».
// ============================================================
const botonesFiltro = document.querySelectorAll('.btn-filtro');
const columnasProducto = document.querySelectorAll('[data-categoria]');

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
