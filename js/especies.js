var especiesData = [];
var contenedor = document.getElementById('contenedor-especies');
var searchInput = document.getElementById('search-especies');
var noResults = document.getElementById('no-results-especies');

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

fetch('jsonData/especies.json')
  .then(function (r) { return r.json(); })
  .then(function (data) {
    especiesData = data;

    data.forEach(function (e) {
      var card = document.createElement('div');
      card.className = 'cards card-problem';
      card.setAttribute('data-aos', 'fade-up');

      card.innerHTML =
        '<img src="' + e.imagen + '" alt="' + e.nombreComun + '" class="img-problem">' +
        '<h3>' + e.nombreComun + '</h3>' +
        '<p class="zone-label"><em>' + e.nombreCientifico + '</em></p>' +
        '<p class="zone-label"><strong>Problemática:</strong> ' + e.problematica + '</p>' +
        '<p class="zone-label"><strong>Zona:</strong> ' + e.zona + '</p>' +
        '<div class="actions">' +
        '<button class="btn btn-info" data-id="' + e.id + '">Más información</button>' +
        '</div>';

      contenedor.appendChild(card);
    });
  });

contenedor.addEventListener('click', function (e) {
  var target = e.target.closest('button');
  if (!target) return;

  var id = parseInt(target.getAttribute('data-id'));
  var esp = especiesData.find(function (e) { return e.id === id; });
  if (!esp) return;

  Swal.fire({
    title: esp.nombreComun + ' (' + esp.nombreCientifico + ')',
    html:
      '<p style="text-align:left"><strong>Estado de conservación:</strong> ' + esp.estado + '</p>' +
      '<hr>' +
      '<p style="text-align:left"><strong>Problemática asociada:</strong> ' + esp.problematica + '</p>' +
      '<p style="text-align:left"><strong>Zona afectada:</strong> ' + esp.zona + '</p>' +
      '<hr>' +
      '<p style="text-align:left">' + esp.descripcion + '</p>' +
      '<hr>' +
      '<p style="text-align:left"><strong>Usos:</strong></p>' +
      '<ul style="text-align:left">' + esp.usos.map(function (u) { return '<li>' + u + '</li>'; }).join('') + '</ul>',
    icon: 'info',
    confirmButtonText: 'Cerrar',
    confirmButtonColor: '#1B4332',
    scrollbarPadding: false
  });
});
