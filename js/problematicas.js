var problemData = [];
var contenedor = document.getElementById('contenedor-cards');
var searchInput = document.getElementById('search-problemas');
var noResults = document.getElementById('no-results-problemas');

function limpiarTilde(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function filtrar() {
  var termino = limpiarTilde(searchInput.value);
  var cards = contenedor.querySelectorAll('.cards');
  var count = 0;

  cards.forEach(function (card) {
    var texto = limpiarTilde(card.textContent);
    if (!termino || texto.indexOf(termino) !== -1) {
      card.classList.remove('hidden');
      card.removeAttribute('data-aos');
      card.style.opacity = '1';
      card.style.transform = 'none';
      count++;
    } else {
      card.classList.add('hidden');
    }
  });

  if (count === 0) {
    noResults.classList.remove('hidden');
  } else {
    noResults.classList.add('hidden');
  }
}

searchInput.addEventListener('keyup', filtrar);

fetch('jsonData/problematicas.json')
  .then(function (r) { return r.json(); })
  .then(function (data) {
    problemData = data;

    data.forEach(function (p) {
      var especies = p.especiesAfectadas.map(function (e) { return '<li>' + e + '</li>'; }).join('');

      var card = document.createElement('div');
      card.className = 'cards card-problem';
      card.setAttribute('data-aos', 'fade-up');

      card.innerHTML =
        '<img src="' + p.imagen + '" alt="' + p.nombre + '" class="img-problem">' +
        '<h3>' + p.nombre + '</h3>' +
        '<p class="zone-label"><strong>Zona:</strong> ' + p.zona + '</p>' +
        '<p><strong>Provincia(s):</strong> ' + p.provincia + '</p>' +
        '<p><strong>Especies afectadas:</strong></p>' +
        '<ul class="specie-list">' + especies + '</ul>' +
        '<div class="actions">' +
        '<button class="btn btn-info" data-id="' + p.id + '">Más información</button>' +
        '<button class="btn btn-insc" data-id="' + p.id + '">Inscripción</button>' +
        '</div>';

      contenedor.appendChild(card);
    });
  });

contenedor.addEventListener('click', function (e) {
  var target = e.target.closest('button');
  if (!target) return;

  var id = parseInt(target.getAttribute('data-id'));
  var prob = problemData.find(function (p) { return p.id === id; });
  if (!prob) return;

  if (target.classList.contains('btn-info')) {
    Swal.fire({
      title: prob.nombre,
      html:
        '<p style="text-align:left"><strong>Zona:</strong> ' + prob.zona + '</p>' +
        '<p style="text-align:left"><strong>Provincia(s):</strong> ' + prob.provincia + '</p>' +
        '<hr>' +
        '<p style="text-align:left"><strong>Descripción:</strong> ' + prob.descripcion + '</p>' +
        '<hr>' +
        '<p style="text-align:left"><strong>Causas:</strong></p>' +
        '<ul style="text-align:left">' + prob.causas.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul>' +
        '<hr>' +
        '<p style="text-align:left"><strong>Consecuencias:</strong></p>' +
        '<ul style="text-align:left">' + prob.consecuencias.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul>' +
        '<hr>' +
        '<p style="text-align:left"><strong>Especies afectadas:</strong></p>' +
        '<ul style="text-align:left">' + prob.especiesAfectadas.map(function (e) { return '<li>' + e + '</li>'; }).join('') + '</ul>' +
        '<hr>' +
        '<p style="text-align:left"><strong>Soluciones propuestas:</strong></p>' +
        '<ul style="text-align:left">' + prob.soluciones.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>',
      icon: 'info',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#1b4332',
      scrollbarPadding: false
    });
  }

  if (target.classList.contains('btn-insc')) {
    Toastify({
      text: 'Redirigiendo al formulario de inscripción...',
      duration: 2000,
      gravity: 'bottom',
      position: 'right',
      style: { background: '#1b4332' }
    }).showToast();

    setTimeout(function () {
      window.location.href = 'inscripcionUsuarios.html?problematica=' + id;
    }, 1500);
  }
});
