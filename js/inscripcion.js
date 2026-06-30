// Marca el enlace activo en el menú según la página actual
document.querySelectorAll('.menu .btn').forEach(function (enlace) {
  var currentPath = window.location.pathname.replace(/\/+$/, '');
  var linkPath = new URL(enlace.href).pathname.replace(/\/+$/, '');
  if (currentPath === linkPath) {
    enlace.classList.add('activo');
  }
});

var datosProblematicas = [];
var problemaId = null;
var seleccionarProblematica = document.getElementById('problematica');

// Muestra la tarjeta de vista previa al seleccionar una problemática
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

// Muestra u oculta el mensaje de error debajo de un campo
function mostrarError(id, mensaje) {
  var campo = document.getElementById(id);
  var span = document.getElementById('error-' + id);
  if (!span) return;
  if (mensaje) {
    span.textContent = mensaje;
    span.classList.add('visible');
    campo.classList.add('error');
  } else {
    span.textContent = '';
    span.classList.remove('visible');
    campo.classList.remove('error');
  }
}

// Valida un campo específico según su id
function validarCampo(id) {
  var campo = document.getElementById(id);
  var valor = campo.value.trim();

  if (id === 'nombre') {
    if (!valor) return mostrarError(id, 'El nombre es obligatorio.');
    if (valor.length < 3) return mostrarError(id, 'El nombre debe tener al menos 3 caracteres.');
    mostrarError(id, '');
  }

  if (id === 'correo') {
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!valor) return mostrarError(id, 'El correo es obligatorio.');
    if (!regex.test(valor)) return mostrarError(id, 'Ingresá un correo válido.');
    mostrarError(id, '');
  }

  if (id === 'provincia') {
    if (!valor) return mostrarError(id, 'Seleccioná una provincia.');
    mostrarError(id, '');
  }

  if (id === 'problematica') {
    if (!valor) return mostrarError(id, 'Seleccioná una problemática.');
    mostrarError(id, '');
  }

  if (id === 'contribucion') {
    if (!valor) return mostrarError(id, 'Seleccioná un tipo de contribución.');
    mostrarError(id, '');
  }

  if (id === 'fecha') {
    if (!valor) return mostrarError(id, 'La fecha es obligatoria.');
    mostrarError(id, '');
  }
}

// Valida en tiempo real mientras el usuario interactúa con cada campo
['nombre', 'correo', 'provincia', 'problematica', 'contribucion', 'fecha'].forEach(function (id) {
  var campo = document.getElementById(id);
  if (campo) {
    campo.addEventListener('input', function () { validarCampo(id); });
    campo.addEventListener('change', function () { validarCampo(id); });
    campo.addEventListener('blur', function () { validarCampo(id); });
  }
});

// Envío del formulario — valida todo antes de guardar en localStorage
document.getElementById('form-inscripcion').addEventListener('submit', function (e) {
  e.preventDefault();

  var camposObligatorios = ['nombre', 'correo', 'provincia', 'problematica', 'contribucion', 'fecha'];
  var hayError = false;

  camposObligatorios.forEach(function (id) {
    validarCampo(id);
    var span = document.getElementById('error-' + id);
    if (span && span.classList.contains('visible')) {
      hayError = true;
    }
  });

  if (hayError) {
    Toastify({
      text: 'Por favor corregí los errores antes de continuar.',
      duration: 3000,
      gravity: 'bottom',
      position: 'right',
      style: { background: '#E76F51' }
    }).showToast();
    return;
  }

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

// Lee el localStorage y muestra los registros guardados
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
        text: 'No podrá retroceder después de su acción.',
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

// Elimina todas las inscripciones con confirmación
function limpiarTodosLosRegistros() {
  Swal.fire({
    title: '¿Eliminar todas las inscripciones?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar todo',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#E76F51',
    cancelButtonColor: '#1B4332'
  }).then(function (result) {
    if (result.isConfirmed) {
      localStorage.removeItem('woodnation_inscripciones');
      Toastify({
        text: 'Todos los registros fueron eliminados.',
        duration: 2500,
        gravity: 'bottom',
        position: 'right',
        style: { background: '#E76F51' }
      }).showToast();
      cargarRegistros();
    }
  });
}

var btnLimpiar = document.getElementById('btn-limpiar-todo');
if (btnLimpiar) {
  btnLimpiar.addEventListener('click', limpiarTodosLosRegistros);
}

// Carga las problemáticas desde el JSON y llena el select del formulario
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

    // Si viene con parámetro en la URL, preselecciona la problemática
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
  })
  .catch(function () {
    var el = document.getElementById('problematica');
    if (el) {
      var op = document.createElement('option');
      op.textContent = 'Error al cargar problemáticas';
      el.appendChild(op);
    }
  });