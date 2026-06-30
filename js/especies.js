var especiesData = [];
var contenedor = document.getElementById('contenedor-especies');
var searchInput = document.getElementById('search-especies');
var noResults = document.getElementById('no-results-especies');
var filtroZona = document.getElementById('filtro-zona');
var filtroEstado = document.getElementById('filtro-estado');

// Quita tildes para que la búsqueda funcione sin importar acentos
function limpiarTilde(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Filtra tarjetas según buscador, zona y estado al mismo tiempo
function filtrar() {
  var termino = limpiarTilde(searchInput.value);
  var zonaSeleccionada = filtroZona ? limpiarTilde(filtroZona.value) : '';
  var estadoSeleccionado = filtroEstado ? limpiarTilde(filtroEstado.value) : '';

  var cards = contenedor.querySelectorAll('.cards');
  var count = 0;

  cards.forEach(function (card) {
    var texto = limpiarTilde(card.textContent);

    var coincideTexto = !termino || texto.indexOf(termino) !== -1;
    var coincideZona = !zonaSeleccionada || texto.indexOf(zonaSeleccionada) !== -1;
    var coincideEstado = !estadoSeleccionado || texto.indexOf(estadoSeleccionado) !== -1;

    if (coincideTexto && coincideZona && coincideEstado) {
      card.classList.remove('hidden');
      card.removeAttribute('data-aos');
      card.style.opacity = '1';
      card.style.transform = 'none';
      count++;
    } else {
      card.classList.add('hidden');
    }
  });

  noResults.classList.toggle('hidden', count !== 0);
}

searchInput.addEventListener('keyup', filtrar);
if (filtroZona) filtroZona.addEventListener('change', filtrar);
if (filtroEstado) filtroEstado.addEventListener('change', filtrar);

// Carga las especies desde el JSON y genera las tarjetas
fetch('data/especies.json')
  .then(function (r) { return r.json(); })
  .then(function (data) {
    especiesData = data;

    // Llena el filtro de zonas con los valores únicos del JSON
    var zonas = [];
    data.forEach(function (e) {
      if (zonas.indexOf(e.zona) === -1) zonas.push(e.zona);
    });
    zonas.forEach(function (z) {
      var op = document.createElement('option');
      op.value = z;
      op.textContent = z;
      filtroZona.appendChild(op);
    });

    // Genera una tarjeta por cada especie
    data.forEach(function (e) {
      var card = document.createElement('div');
      card.className = 'cards card-problem';
      card.setAttribute('data-aos', 'fade-up');

      card.innerHTML =
        '<img src="' + e.imagen + '" alt="' + e.nombreComun + '" class="img-problem" onerror="this.src=\'assets/placeholder.jpg\'">' +
        '<h3>' + e.nombreComun + '</h3>' +
        '<p class="zone-label"><em>' + e.nombreCientifico + '</em></p>' +
        '<p class="zone-label"><strong>Estado:</strong> ' + e.estado + '</p>' +
        '<p class="zone-label"><strong>Zona:</strong> ' + e.zona + '</p>' +
        '<div class="actions">' +
        '<button class="btn btn-info" data-id="' + e.id + '">Más información</button>' +
        '</div>';

      contenedor.appendChild(card);
    });
  });

// Abre el modal con el detalle completo de la especie
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