// Marca el enlace activo en el menú según la página actual
document.querySelectorAll('.menu a').forEach(function (enlace) {
  if (enlace.href === window.location.href) {
    enlace.classList.add('activo');
  }
});

// Carga las zonas afectadas desde el JSON y genera las tarjetas
fetch('data/problematicas.json')
  .then(function (r) { return r.json(); })
  .then(function (data) {
    var contenedor = document.getElementById('contenedor-zonas');
    if (!contenedor) return;

    data.forEach(function (p) {
      var card = document.createElement('div');
      card.className = 'cards';
      card.setAttribute('data-aos', 'zoom-in');

      card.innerHTML =
        '<h3>' + p.nombre + '</h3>' +
        '<p><strong>Zona:</strong> ' + p.zona + '</p>' +
        '<p>' + p.descripcion.substring(0, 120) + '...</p>' +
        '<a href="problematicas.html" class="btn-link">Ver problemática →</a>';

      contenedor.appendChild(card);
    });
  });

// Botón que muestra u oculta la sección de estadísticas
var btnEstadisticas = document.getElementById('btn-estadisticas');
var seccionEstadisticas = document.getElementById('seccion-estadisticas');

if (btnEstadisticas && seccionEstadisticas) {
  btnEstadisticas.addEventListener('click', function () {
    var estaOculto = seccionEstadisticas.classList.contains('hidden');
    seccionEstadisticas.classList.toggle('hidden');
    btnEstadisticas.textContent = estaOculto
      ? 'Ocultar estadísticas'
      : 'Ver estadísticas';
  });
}