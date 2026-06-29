var datosProblematicas = [];
var problemaId = null;
var seleccionarProblematica = document.getElementById('problematica');

function mostrarPreview(id) {
  var contenedor = document.getElementById('preview-card');
  var prob = datosProblematicas.find(function (p) { return p.id == id; });
  if (!prob) {
    contenedor.innerHTML = '<div class="preview-placeholder">Seleccione una problemática para ver la vista previa</div>';
    return;
  }
  var especies = prob.especiesAfectadas.map(function (e) { return '<li>' + e + '</li>'; }).join('');
  contenedor.innerHTML =
    '<div class="cards card-problem preview-card">' +
    '<img src="' + prob.imagen + '" alt="' + prob.nombre + '" class="img-problem">' +
    '<h3>' + prob.nombre + '</h3>' +
    '<p class="zone-label"><strong>Zona:</strong> ' + prob.zona + '</p>' +
    '<p><strong>Provincia(s):</strong> ' + prob.provincia + '</p>' +
    '<p><strong>Especies afectadas:</strong></p>' +
    '<ul class="specie-list">' + especies + '</ul>' +
    '<p class="zone-label"><strong>Soluciones:</strong> ' + prob.soluciones.join(', ') + '</p>' +
    '</div>';
}

seleccionarProblematica.addEventListener('change', function () {
  mostrarPreview(this.value);
});

document.getElementById('form-inscripcion').addEventListener('submit', function (e) {
  e.preventDefault();

  var registro = {
    id: Date.now(),
    nombre: document.getElementById('nombre').value.trim(),
    correo: document.getElementById('correo').value.trim(),
    provincia: document.getElementById('provincia').value,
    problematicaId: document.getElementById('problematica').value,
    contribucion: document.getElementById('contribucion').value,
    fecha: document.getElementById('fecha').value,
    comentario: document.getElementById('comentario').value.trim()
  };

  var registros = JSON.parse(localStorage.getItem('woodnation_inscripciones') || '[]');
  registros.push(registro);
  localStorage.setItem('woodnation_inscripciones', JSON.stringify(registros));

  Toastify({
    text: '¡Inscripción registrada con éxito!',
    duration: 3000,
    gravity: 'bottom',
    position: 'right',
    style: { background: '#1b4332' }
  }).showToast();

  this.reset();
  if (problemaId) { seleccionarProblematica.value = problemaId; }
  cargarRegistros();
});

function cargarRegistros() {
  var contenedorRegistros = document.getElementById('contenedor-registros');
  var registros = JSON.parse(localStorage.getItem('woodnation_inscripciones') || '[]');

  if (registros.length === 0) {
    contenedorRegistros.innerHTML = '<p class="empty">No hay inscripciones registradas aún.</p>';
    return;
  }

  var html = '<div class="table-registros">';
  registros.slice().reverse().forEach(function (r) {
    var probNombre = datosProblematicas.find(function (p) { return p.id == r.problematicaId; });
    html +=
      '<div class="item-registro">' +
      '<div class="registro-info">' +
      '<p><strong>' + r.nombre + '</strong> — ' + r.provincia + '</p>' +
      '<p>Problemática: ' + (probNombre ? probNombre.nombre : 'General') + '</p>' +
      '<p>Contribución: ' + r.contribucion + ' | Fecha: ' + r.fecha + '</p>' +
      (r.comentario ? '<p class="comment">"' + r.comentario + '"</p>' : '') +
      '</div>' +
      '<button class="btn btn-eliminar" data-id="' + r.id + '">Eliminar</button>' +
      '</div>';
  });
  html += '</div>';
  contenedorRegistros.innerHTML = html;

  contenedorRegistros.querySelectorAll('.btn-eliminar').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = parseInt(this.getAttribute('data-id'));
      Swal.fire({
        title: '¿Desea eliminar su inscripción?',
        text: 'No podrá retroceder despues de su acción.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, seguro',
        cancelButtonText: 'No, cancelar',
        confirmButtonColor: '#E76F51',
        cancelButtonColor: '#1B4332'
      }).then(function (result) {
        if (result.isConfirmed) {
          var lista = JSON.parse(localStorage.getItem('woodnation_inscripciones') || '[]');
          lista = lista.filter(function (r) { return r.id !== id; });
          localStorage.setItem('woodnation_inscripciones', JSON.stringify(lista));
          Toastify({
            text: 'Inscripción eliminada.',
            duration: 2000,
            gravity: 'bottom',
            position: 'right',
            style: { background: '#E76F51' }
          }).showToast();
          cargarRegistros();
        }
      });
    });
  });
}

fetch('data/problematicas.json')
  .then(function (r) { return r.json(); })
  .then(function (data) {
    datosProblematicas = data;

    data.forEach(function (p) {
      var opcion = document.createElement('option');
      opcion.value = p.id;
      opcion.textContent = p.nombre;
      seleccionarProblematica.appendChild(opcion);
    });

    var parametros = new URLSearchParams(window.location.search);
    problemaId = parametros.get('problematica');
    if (problemaId) {
      seleccionarProblematica.value = problemaId;
      mostrarPreview(problemaId);
      var probNombre = datosProblematicas.find(function (p) { return p.id == problemaId; });
      if (probNombre) {
        document.getElementById('subtitulo-form').textContent =
          'Inscripción para: ' + probNombre.nombre;
      }
    }

    cargarRegistros();
  });
