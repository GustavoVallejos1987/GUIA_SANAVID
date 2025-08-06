document.addEventListener("DOMContentLoaded", () => {
  const tipoSelect = document.getElementById("tipoSelect");
  const especialidadSelect = document.getElementById("especialidadSelect");
  const localidadSelect = document.getElementById("localidadSelect");
  const encabezadoTabla = document.querySelector("#tablaResultados thead tr");
  const tbodyResultados = document.querySelector("#tablaResultados tbody");

  // Cargar filtros iniciales
  cargarEspecialidades();
  cargarLocalidades();

  // Cargar datos por defecto (sanatorios)
  cargarDatos("sanatorios");

  // Evento para cambiar entre tipos de prestadores
  tipoSelect.addEventListener("change", () => {
    const tipo = tipoSelect.value;
    cargarDatos(tipo);
  });

  // Eventos para aplicar filtros
  especialidadSelect.addEventListener("change", () => {
    cargarDatos(tipoSelect.value);
  });

  localidadSelect.addEventListener("change", () => {
    cargarDatos(tipoSelect.value);
  });

  // ====== FUNCIONES ======

  // Cargar especialidades dinámicamente
  function cargarEspecialidades() {
    fetch("/api/especialidades")
      .then(res => res.json())
      .then(data => {
        especialidadSelect.innerHTML = '<option value="">-- Todas --</option>';
        data.forEach(item => {
          const option = document.createElement("option");
          option.value = item;
          option.textContent = item;
          especialidadSelect.appendChild(option);
        });
      })
      .catch(error => console.error("Error al cargar especialidades:", error));
  }

  // Cargar localidades dinámicamente
  function cargarLocalidades() {
    fetch("/api/localidades")
      .then(res => res.json())
      .then(data => {
        localidadSelect.innerHTML = '<option value="">-- Todas --</option>';
        data.forEach(item => {
          const option = document.createElement("option");
          option.value = item;
          option.textContent = item;
          localidadSelect.appendChild(option);
        });
      })
      .catch(error => console.error("Error al cargar localidades:", error));
  }

  // Cargar datos según el tipo seleccionado
  function cargarDatos(tipo) {
    const especialidad = especialidadSelect.value;
    const localidad = localidadSelect.value;
    let url = `/api/${tipo}`;
    const params = [];

    if (especialidad && tipo !== "sanatorios" && tipo !== "laboratorios") {
      params.push(`especialidad=${encodeURIComponent(especialidad)}`);
    }
    if (localidad) {
      params.push(`localidad=${encodeURIComponent(localidad)}`);
    }
    if (params.length > 0) url += `?${params.join("&")}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        generarEncabezado(tipo);
        mostrarDatos(tipo, data);
      })
      .catch(error => console.error(`Error al cargar ${tipo}:`, error));
  }

  // Generar encabezado dinámico
  function generarEncabezado(tipo) {
    encabezadoTabla.innerHTML = "";
    let columnas = [];

    switch (tipo) {
      case "medicos":
        columnas = ["Nombre", "Especialidad", "Teléfono", "Sanatorio", "Dirección"];
        break;
      case "sanatorios":
        columnas = ["Nombre", "Localidad", "Dirección", "Teléfono", "Email", "Horario"];
        break;
      case "laboratorios":
        columnas = ["Nombre", "Localidad", "Dirección", "Teléfono", "Email", "Horario"];
        break;
      case "diagnosticos":
      case "fisioterapias":
        columnas = ["Nombre", "Especialidad", "Localidad", "Dirección", "Teléfono", "Email", "Horario"];
        break;
      default:
        columnas = ["Nombre", "Dirección", "Teléfono"];
    }

    columnas.forEach(col => {
      const th = document.createElement("th");
      th.textContent = col;
      encabezadoTabla.appendChild(th);
    });
  }

  // Mostrar datos en tabla
  function mostrarDatos(tipo, data) {
    tbodyResultados.innerHTML = "";

    if (!data || data.length === 0) {
      tbodyResultados.innerHTML = `<tr><td colspan="7">No se encontraron resultados.</td></tr>`;
      return;
    }

    data.forEach(item => {
      const tr = document.createElement("tr");

      if (tipo === "medicos") {
        tr.innerHTML = `
          <td>${item.nombre}</td>
          <td>${item.especialidad}</td>
          <td>${item.telefono}</td>
          <td>${item.sanatorio_nombre || ""}</td>
          <td>${item.sanatorio_direccion || ""}</td>
        `;
      } else if (tipo === "sanatorios" || tipo === "laboratorios") {
        tr.innerHTML = `
          <td>${item.nombre}</td>
          <td>${item.localidad}</td>
          <td>${item.direccion}</td>
          <td>${item.telefono}</td>
          <td>${item.email || ""}</td>
          <td>${item.horario || ""}</td>
        `;
      } else if (tipo === "diagnosticos" || tipo === "fisioterapias") {
        tr.innerHTML = `
          <td>${item.nombre}</td>
          <td>${item.especialidad}</td>
          <td>${item.localidad}</td>
          <td>${item.direccion}</td>
          <td>${item.telefono}</td>
          <td>${item.email || ""}</td>
          <td>${item.horario || ""}</td>
        `;
      }

      tbodyResultados.appendChild(tr);
    });
  }
});



