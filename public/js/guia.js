// public/js/guia.js
document.addEventListener('DOMContentLoaded', async () => {
  const cuerpo             = document.getElementById('cuerpo-prestadores');
  const formBusqueda       = document.getElementById('form-busqueda');
  const selTipoInstitucion = document.getElementById('tipoInstitucion');
  const selEspecialidad    = document.getElementById('especialidad');
  const selDepartamento    = document.getElementById('departamento');
  const selCiudad          = document.getElementById('ciudad');

  let todosLosPrestadores = [];

  // 1) Carga tipos de institución
  async function cargarTipos() {
    try {
      const res  = await fetch('https://guia-sanavid.onrender.com/api/tipo_institucion');
      const data = await res.json(); // [{id, nombre},…]
      selTipoInstitucion.innerHTML = '<option value="">Seleccione...</option>';
      data
        .map(o => o.nombre.trim())
        .sort((a,b) => a.localeCompare(b))
        .forEach(nombre => {
          const o = document.createElement('option');
          o.value       = nombre.toLowerCase();
          o.textContent = nombre;
          selTipoInstitucion.appendChild(o);
        });
    } catch (err) {
      console.error('❌ Error al cargar tipos de institución:', err);
    }
  }

  // 2) Carga especialidades
  async function cargarEspecialidades() {
    try {
      const res  = await fetch('https://guia-sanavid.onrender.com/api/especialidades');
      const data = await res.json(); // [{id, especialidad},…]
      selEspecialidad.innerHTML = '<option value="">Seleccione...</option>';
      data
        .map(o => (o.nombre || o.especialidad || '').trim())
        .filter(n => n)
        .sort((a,b) => a.localeCompare(b))
        .forEach(nombre => {
          const o = document.createElement('option');
          o.value       = nombre.toLowerCase();
          o.textContent = nombre;
          selEspecialidad.appendChild(o);
        });
    } catch (err) {
      console.error('❌ Error al cargar especialidades:', err);
    }
  }

  // 3) Carga departamentos
  async function cargarDepartamentos() {
    try {
      const res  = await fetch('https://guia-sanavid.onrender.com/api/departamentos');
      const data = await res.json(); // [{id, nombre},…]
      selDepartamento.innerHTML = '<option value="">Seleccione...</option>';
      data
        .sort((a,b) => a.nombre.localeCompare(b.nombre))
        .forEach(d => {
          const o = document.createElement('option');
          o.value       = String(d.id);   // aquí el id
          o.textContent = d.nombre;
          selDepartamento.appendChild(o);
        });
    } catch (err) {
      console.error('❌ Error al cargar departamentos:', err);
    }
  }

  // 4) Carga localidades según departamento elegido
  async function cargarLocalidades(depId) {
    selCiudad.innerHTML = '<option value="">Seleccione...</option>';
    if (!depId) return;
    try {
      const res  = await fetch(`https://guia-sanavid.onrender.com/api/localidades/${depId}`);
      const data = await res.json(); // [{id, nombre,…},…]
      data
        .sort((a,b) => a.nombre.localeCompare(b.nombre))
        .forEach(loc => {
          const o = document.createElement('option');
          o.value       = String(loc.id); // id de la localidad
          o.textContent = loc.nombre;
          selCiudad.appendChild(o);
        });
    } catch (err) {
      console.error('❌ Error al cargar localidades:', err);
    }
  }
  selDepartamento.addEventListener('change', e => {
    cargarLocalidades(e.target.value);
  });

  // 5) Carga prestadores e inicializa tabla
  async function cargarPrestadores() {
    try {
      const res   = await fetch('https://guia-sanavid.onrender.com/api/prestadores');
      const datos = await res.json();
      if (!Array.isArray(datos)) throw new Error('Respuesta no es array');
      todosLosPrestadores = datos;
      mostrarPrestadores(datos);
    } catch (err) {
      console.error('❌ Error al cargar prestadores:', err);
      cuerpo.innerHTML = `<tr><td colspan="7" class="text-danger">Error al cargar datos.</td></tr>`;
    }
  }

  // 6) Renderiza la tabla
  function mostrarPrestadores(list) {
    const jer = ['hospital','sanatorio','clinica','laboratorio','médico'];
    list.sort((a,b) => {
      const A = (a.tipo||'').toLowerCase();
      const B = (b.tipo||'').toLowerCase();
      const ia = jer.indexOf(A), ib = jer.indexOf(B);
      return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib);
    });

    cuerpo.innerHTML = '';
    if (list.length === 0) {
      cuerpo.innerHTML = `<tr><td colspan="7" class="text-muted">No se encontraron resultados.</td></tr>`;
      return;
    }
    list.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.nombre}</td>
        <td>${p.localidad?.nombre   || '-'}</td>
        <td>${p.localidad?.departamento?.nombre || p.departamento?.nombre || '-'}</td>
        <td>${p.direccion  || '-'}</td>
        <td>${p.telefono   || '-'}</td>
        <td>${p.horario    || '-'}</td>
        <td>${capitalizar(p.tipo) || '-'}</td>
      `;
      cuerpo.appendChild(tr);
    });
  }

  // 7) Capitalizar texto
  function capitalizar(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';
  }

  // 8) Filtrar al enviar el form
  formBusqueda.addEventListener('submit', e => {
    e.preventDefault();
    const fTipo = selTipoInstitucion.value;   // string (nombre.toLowerCase())
    const fEsp  = selEspecialidad.value;      // string
    const fDep  = selDepartamento.value;      // id string
    const fCid  = selCiudad.value;            // id string

    const filtrados = todosLosPrestadores.filter(p => {
      const tipo    = (p.tipo||'').toLowerCase();
      const esp     = (p.especialidad||'').toLowerCase();
      const depId   = String(p.departamento_id);
      const locId   = String(p.localidad_id);

      return  (!fTipo || tipo === fTipo)
           && (!fEsp  || esp.includes(fEsp))
           && (!fDep  || depId === fDep)
           && (!fCid  || locId === fCid);
    });

    mostrarPrestadores(filtrados);
  });

  // 9) Inicializar todo
  await Promise.all([
    cargarTipos(),
    cargarEspecialidades(),
    cargarDepartamentos()
  ]);
  await cargarPrestadores();
});





