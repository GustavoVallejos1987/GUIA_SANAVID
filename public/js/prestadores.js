// public/js/prestadores.js
document.addEventListener("DOMContentLoaded", () => {
  const API_BASE            = "http://127.0.0.1:5000/api";
  const API_PRESTADORES     = `${API_BASE}/prestadores`;
  const API_TIPOS           = `${API_BASE}/tipo_institucion`;
  const API_ESPECIALIDADES  = `${API_BASE}/especialidades`;
  const API_DEPARTAMENTOS   = `${API_BASE}/departamentos`;
  const API_LOCALIDADES     = `${API_BASE}/localidades`;

  const form         = document.getElementById("formPrestador");
  const tablaBody    = document.querySelector("#tablaPrestadores tbody");
  const selTipo      = document.getElementById("tipo");
  const selEsp       = document.getElementById("especialidad");
  const selDepto     = document.getElementById("departamento");
  const selLocalidad = document.getElementById("localidad");
  const selMadre     = document.getElementById("id_madre");
  const selEsInst    = document.getElementById("es_institucion");

  let prestadores = [];
  let editId      = null;

  // 1) cargar lista de tipos
  async function cargarTipos() {
    try {
      const res  = await fetch(API_TIPOS);
      const data = await res.json();
      selTipo.innerHTML = `<option value="">Seleccione...</option>`;
      data
        .sort((a,b)=> a.nombre.localeCompare(b.nombre))
        .forEach(o => {
          const opt = document.createElement("option");
          opt.value       = o.nombre.toLowerCase();
          opt.textContent = o.nombre;
          selTipo.appendChild(opt);
        });
    } catch(err) {
      console.error("❌ tipos:", err);
    }
  }

  // 2) cargar lista de especialidades
  async function cargarEspecialidades() {
    try {
      const res  = await fetch(API_ESPECIALIDADES);
      const data = await res.json();
      selEsp.innerHTML = `<option value="">Seleccione...</option>`;
      // data puede ser array de strings o array de objetos { nombre }
      data
        .map(x => typeof x==="string"? x : x.nombre || x.especialidad)
        .filter(n => !!n)
        .sort((a,b)=> a.localeCompare(b))
        .forEach(nombre => {
          const opt = document.createElement("option");
          opt.value       = nombre.toLowerCase();
          opt.textContent = nombre;
          selEsp.appendChild(opt);
        });
    } catch(err) {
      console.error("❌ especialidades:", err);
    }
  }

  // 3) cargar departamentos
  async function cargarDepartamentos() {
    try {
      const res  = await fetch(API_DEPARTAMENTOS);
      const data = await res.json();
      selDepto.innerHTML = `<option value="">Seleccione...</option>`;
      data
        .sort((a,b)=> a.nombre.localeCompare(b.nombre))
        .forEach(d => {
          const opt = document.createElement("option");
          opt.value       = d.id;
          opt.textContent = d.nombre;
          selDepto.appendChild(opt);
        });
    } catch(err) {
      console.error("❌ departamentos:", err);
    }
  }

  // 4) cargar localidades según depto
  async function cargarLocalidades(deptoId) {
    selLocalidad.innerHTML = `<option value="">Seleccione...</option>`;
    if (!deptoId) return;
    try {
      const res  = await fetch(`${API_LOCALIDADES}/${deptoId}`);
      const data = await res.json();
      data
        .sort((a,b)=> a.nombre.localeCompare(b.nombre))
        .forEach(loc => {
          const opt = document.createElement("option");
          opt.value       = loc.id;
          opt.textContent = loc.nombre;
          selLocalidad.appendChild(opt);
        });
    } catch(err) {
      console.error("❌ localidades:", err);
    }
  }

  // 5) cargar instituciones madre
  async function cargarMadres() {
    try {
      const res  = await fetch(API_PRESTADORES);
      const data = await res.json();
      selMadre.innerHTML = `<option value="">-- Seleccionar --</option>`;
      data
        .filter(p => p.es_institucion)
        .forEach(p => {
          const opt = document.createElement("option");
          opt.value       = p.id;
          opt.textContent = p.nombre;
          selMadre.appendChild(opt);
        });
    } catch(err) {
      console.error("❌ madres:", err);
    }
  }

  // 6) cargar prestadores y pintar tabla
  async function cargarPrestadores() {
    tablaBody.innerHTML = "";
    try {
      const res  = await fetch(API_PRESTADORES);
      prestadores = await res.json();
      mostrarTabla(prestadores);
    } catch(err) {
      console.error("❌ prestadores:", err);
      tablaBody.innerHTML = `<tr><td colspan="10" class="text-danger">Error al cargar datos.</td></tr>`;
    }
  }

  // 7) renderizar tabla
  function mostrarTabla(list) {
    tablaBody.innerHTML = "";
    if (!list.length) {
      tablaBody.innerHTML = `<tr><td colspan="10" class="text-muted">No hay prestadores.</td></tr>`;
      return;
    }

    list.forEach(p => {
      // si no es institución y tiene madre, hereda algunos datos
      if (!p.es_institucion && p.id_madre) {
        const m = prestadores.find(x=>x.id===p.id_madre);
        if (m) {
          p.direccion  = p.direccion || m.direccion;
          p.telefono   = p.telefono  || m.telefono;
          p.localidad  = p.localidad || m.localidad;
          p.departamento = p.departamento || m.departamento;
        }
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.nombre}</td>
        <td>${p.tipo}</td>
        <td>${p.telefono||""}</td>
        <td>${p.especialidad||""}</td>
        <td>${p.localidad?.nombre||""}</td>
        <td>${p.localidad?.departamento?.nombre||p.departamento?.nombre||""}</td>
        <td>${p.es_institucion ? "Sí":"No"}</td>
        <td>${
          p.id_madre
            ? (prestadores.find(x=>x.id===p.id_madre)?.nombre||"")
            : ""
        }</td>
        <td><b>${p.nombre_usuario || '-'}</b></td> 
        <td>
          <button class="icon-btn btn-editar" title="Editar">
            <i class="fas fa-pen"></i>
          </button>
          <button class="icon-btn btn-eliminar" title="Eliminar">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>`;
      tablaBody.appendChild(tr);
    });
  }

  // 8) escucha cambio de depto
  selDepto.addEventListener("change", e => {
    cargarLocalidades(e.target.value);
  });

  // 9) editar / borrar
  tablaBody.addEventListener("click", async e => {
    const id = +e.target.dataset.id;
    // editar
    if (e.target.classList.contains("btn-editar")) {
      const p = prestadores.find(x=>x.id===id);
      if (!p) return;
      // poblar form
      editId = id;
      form.nombre.value         = p.nombre;
      form.tipo.value           = p.tipo;
      form.telefono.value       = p.telefono||"";
      form.direccion.value      = p.direccion||"";
      form.especialidad.value   = p.especialidad||"";
      form.es_institucion.value = p.es_institucion?"true":"false";
      form.id_madre.value       = p.id_madre||"";
      form.departamento.value   = p.departamento_id||"";
      await cargarLocalidades(p.departamento_id);
      form.localidad.value      = p.localidad_id||"";
      return;
    }
    // eliminar
    if (e.target.classList.contains("btn-eliminar")) {
      if (!confirm("¿Eliminar este prestador?")) return;
      try {
        await fetch(`${API_PRESTADORES}/${id}`, { method:"DELETE" });
        await cargarPrestadores();
        await cargarMadres();
      } catch(err) {
        console.error("❌ borrar:", err);
        alert("Error al eliminar");
      }
    }
  });

  // 10) submit (nuevo o editar)
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const body = {
      nombre:           form.nombre.value,
      tipo:             form.tipo.value,
      telefono:         form.telefono.value,
      direccion:        form.direccion.value,
      departamento_id:  +form.departamento.value || null,
      localidad_id:     +form.localidad.value   || null,
      especialidad:     form.especialidad.value,
      id_madre:         form.id_madre.value     || null,
      es_institucion:   form.es_institucion.value==="true"
    };

    try {
      const url    = editId
        ? `${API_PRESTADORES}/${editId}`
        : API_PRESTADORES;
      const method = editId ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify(body)
      });

      // limpiar
      form.reset();
      editId = null;

      // recargar todo
      await Promise.all([
        cargarPrestadores(),
        cargarMadres()
      ]);
    } catch(err) {
      console.error("❌ guardar:", err);
      alert("Error al guardar");
    }
  });

  // 11) inicializar
  Promise.all([
    cargarTipos(),
    cargarEspecialidades(),
    cargarDepartamentos()
  ]).then(_ => {
    cargarMadres();
    cargarPrestadores();
  });
});






