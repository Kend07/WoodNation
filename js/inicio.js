// Marca el enlace activo en el menú según la página actual
document.querySelectorAll('.menu .btn').forEach(function (enlace) {
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

// Aplica rotaciones alternadas a las tarjetas decorativas laterales
function applyTilts(container) {
  var cards = container.querySelectorAll('.side-card');
  cards.forEach(function (card, i) {
    var tilt = i % 2 === 0 ? -4 : 4;
    card.style.transform = 'rotate(' + tilt + 'deg)';
  });
}

// Carga imágenes de problemáticas en la galería lateral izquierda
fetch('data/problematicas.json')
  .then(function (r) { return r.json(); })
  .then(function (data) {
    var container = document.getElementById('side-problemas');
    if (!container) return;
    for (var i = 0; i < 6; i++) {
      var p = data[i % data.length];
      var card = document.createElement('div');
      card.className = 'side-card';
      card.innerHTML = '<img src="' + p.imagen + '" alt="' + p.nombre + '">';
      container.appendChild(card);
    }
    applyTilts(container);
  });

// Carga imágenes de especies en la galería lateral derecha
fetch('data/especies.json')
  .then(function (r) { return r.json(); })
  .then(function (data) {
    var container = document.getElementById('side-especies');
    if (!container) return;
    data.slice(0, 6).forEach(function (e) {
      var card = document.createElement('div');
      card.className = 'side-card';
      card.innerHTML = '<img src="' + e.imagen + '" alt="' + e.nombreComun + '">';
      container.appendChild(card);
    });
    applyTilts(container);
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