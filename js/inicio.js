// Marca el enlace activo en el menú según la página actual
document.querySelectorAll('.menu .btn').forEach(function (enlace) {
  var currentPath = window.location.pathname.replace(/\/+$/, '');
  var linkPath = new URL(enlace.href).pathname.replace(/\/+$/, '');
  if (currentPath === linkPath) {
    enlace.classList.add('activo');
  }
});

function handleFetchError(containerId) {
  var el = document.getElementById(containerId);
  if (el) el.innerHTML = '<p class="empty">Error al cargar los datos. Intente de nuevo más tarde.</p>';
}

// Carga las zonas afectadas desde el JSON y genera las tarjetas
fetch('data/problematicas.json')
  .then(function (r) { return r.json(); })
  .then(function (data) {
    var contenedor = document.getElementById('contenedor-zonas');
    if (!contenedor) return;
    contenedor.innerHTML = '';

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
  })
  .catch(function () { handleFetchError('contenedor-zonas'); });

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
  })
  .catch(function () {});

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
  })
  .catch(function () {});

// Contadores dinámicos
fetch('data/problematicas.json')
  .then(function (r) { return r.json(); })
  .then(function (data) {
    var el = document.getElementById('total-problematicas');
    if (el) el.textContent = data.length;
  })
  .catch(function () {});

fetch('data/especies.json')
  .then(function (r) { return r.json(); })
  .then(function (data) {
    var el = document.getElementById('total-especies');
    if (el) el.textContent = data.length;

    // Estadísticas de especies por estado de conservación
    var grupos = {
      'En peligro crítico': { label: 'En peligro crítico', count: 0 },
      'En peligro': { label: 'En peligro', count: 0 },
      'Vulnerable': { label: 'Vulnerables', count: 0 },
      'Casi amenazado': { label: 'En recuperación', count: 0 }
    };
    var estables = 0;

    data.forEach(function (e) {
      if (grupos[e.estado]) {
        grupos[e.estado].count++;
      } else {
        estables++;
      }
    });

    var container = document.getElementById('estados-especies');
    if (!container) return;
    container.innerHTML = '';

    Object.keys(grupos).forEach(function (key) {
      var card = document.createElement('div');
      card.className = 'cards';
      card.innerHTML = '<span class="number">' + grupos[key].count + '</span><p>' + grupos[key].label + '</p>';
      container.appendChild(card);
    });

    var card = document.createElement('div');
    card.className = 'cards';
    card.innerHTML = '<span class="number">' + estables + '</span><p>Protegidas / Estables</p>';
    container.appendChild(card);
  })
  .catch(function () { handleFetchError('estados-especies'); });

// Contador de inscripciones desde localStorage
(function () {
  var el = document.getElementById('total-inscritos');
  if (el) {
    var registros = JSON.parse(localStorage.getItem('woodnation_inscripciones') || '[]');
    el.textContent = registros.length;
  }
})();

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
