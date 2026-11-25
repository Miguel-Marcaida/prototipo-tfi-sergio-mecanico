// js/recepcion.js

function cargarGrillaTurnos() {
  const contenedor = document.getElementById("grillaTurnos");
  const inputFecha = document.getElementById("fechaGrilla");
  if (!contenedor) return;

  let fechaFiltro = inputFecha.value;
  if (!fechaFiltro) {
    const hoy = new Date();
    fechaFiltro = hoy.toISOString().split("T")[0];
    inputFecha.value = fechaFiltro;
  }

  const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
  const turnosFiltrados = turnos.filter((t) => t.fecha === fechaFiltro);

  if (turnosFiltrados.length === 0) {
    contenedor.innerHTML =
      '<p style="color: #666;">No hay turnos para esta fecha.</p>';
    return;
  }

  let html =
    '<table style="width: 100%; border-collapse: collapse; text-align: left;">';
  html += '<tr style="background-color: #cbd5e1;">';
  html +=
    '<th style="padding: 8px;">Hora</th><th style="padding: 8px;">Cliente</th><th style="padding: 8px;">Patente</th><th style="padding: 8px;">Estado</th><th style="padding: 8px; text-align: center;">Acciones</th>';
  html += "</tr>";

  turnosFiltrados.forEach((t, index) => {
    // Determinamos el color y texto del estado
    let estadoColor = "#d97706"; // Naranja por defecto (Pendiente)
    let estadoTexto = "Pendiente";

    if (t.estado === "Atendido") {
      estadoColor = "#059669";
      estadoTexto = "Atendido";
    }
    if (t.estado === "No se presentó") {
      estadoColor = "#dc2626";
      estadoTexto = "No se presentó";
    }
    if (t.estado === "Cancelado") {
      estadoColor = "#64748b";
      estadoTexto = "Cancelado";
    }

    html += `<tr style="border-bottom: 1px solid #cbd5e1;">
            <td style="padding: 8px; font-weight: bold;">${t.hora}</td>
            <td style="padding: 8px;">${t.cliente}</td>
            <td style="padding: 8px;">${t.patente}</td>
            <td style="padding: 8px;"><span style="color: ${estadoColor}; font-weight: bold;">${estadoTexto}</span></td>
            <td style="padding: 8px; text-align: center;">`;

    // Si está pendiente, mostramos los botones de acción
    if (t.estado === "Pendiente" || !t.estado) {
      html += `
                <button title="Confirmar Llegada" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; color: #059669;" onclick="confirmarLlegada(${index})">✅</button>
                <button title="No se presentó" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; color: #dc2626;" onclick="cambiarEstadoTurno(${index}, 'No se presentó')">❌</button>
                <button title="Cancelar Turno" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; color: #64748b;" onclick="cambiarEstadoTurno(${index}, 'Cancelado')">🚫</button>
            `;
    } else {
      html += `<span style="color: #ccc; font-size: 1.2rem;">-</span>`;
    }

    html += `</td></tr>`;
  });

  html += "</table>";
  contenedor.innerHTML = html;
}

// Función para cambiar el estado (No presentado / Cancelado)
function cambiarEstadoTurno(index, nuevoEstado) {
  let turnos = JSON.parse(localStorage.getItem("turnos")) || [];
  // Como filtramos por fecha, necesitamos encontrar el turno real en el array global
  // Para simplificar, buscamos por la patente y la fecha (que son únicos en este contexto)
  const fechaFiltro = document.getElementById("fechaGrilla").value;
  const turnosDelDia = turnos.filter((t) => t.fecha === fechaFiltro);
  const turnoAmodificar = turnosDelDia[index];

  // Encontramos el índice real en el array global
  const indexReal = turnos.findIndex(
    (t) =>
      t.patente === turnoAmodificar.patente &&
      t.fecha === turnoAmodificar.fecha &&
      t.hora === turnoAmodificar.hora,
  );

  if (indexReal !== -1) {
    turnos[indexReal].estado = nuevoEstado;
    localStorage.setItem("turnos", JSON.stringify(turnos));
    cargarGrillaTurnos(); // Recargar la grilla
  }
}

// Función para confirmar llegada (redirige a vehiculo.html)
function confirmarLlegada(index) {
  let turnos = JSON.parse(localStorage.getItem("turnos")) || [];
  const fechaFiltro = document.getElementById("fechaGrilla").value;
  const turnosDelDia = turnos.filter((t) => t.fecha === fechaFiltro);
  const turnoSeleccionado = turnosDelDia[index];

  // Guardamos los datos del turno en sessionStorage para pasarlos a la pantalla de vehículo
  sessionStorage.setItem("turnoAConfirmar", JSON.stringify(turnoSeleccionado));

  // Redirigimos a la pantalla de registrar vehículo
  window.location.href = "vehiculo.html";
}

// js/recepcion.js

// ... (tu código anterior de turnos)

// Función para cargar la grilla de vehículos en el taller
function cargarGrillaVehiculos() {
  const contenedor = document.getElementById("grillaVehiculos");
  if (!contenedor) return;

  const vehiculos = obtenerVehiculos();

  if (vehiculos.length === 0) {
    contenedor.innerHTML =
      '<p style="color: #666;">No hay vehículos registrados en el taller.</p>';
    return;
  }

  let html =
    '<table style="width: 100%; border-collapse: collapse; text-align: left;">';
  html += '<tr style="background-color: #cbd5e1;">';
  html +=
    '<th style="padding: 8px;">Patente</th><th style="padding: 8px;">Dueño</th><th style="padding: 8px;">Estado</th><th style="padding: 8px; text-align: center;">Acción</th>';
  html += "</tr>";

  vehiculos.forEach((v) => {
    // Definimos colores según el estado
    let estadoColor = "#64748b"; // Gris por defecto
    if (v.estado === "Pendiente de Diagnóstico") estadoColor = "#d97706";
    if (v.estado === "Diagnóstico Completado") estadoColor = "#2563eb";
    if (v.estado === "En Reparación") estadoColor = "#7c3aed";
    if (v.estado === "Finalizado") estadoColor = "#059669";
    if (v.estado === "Pagado") estadoColor = "#059669";
    if (v.estado === "Entregado") estadoColor = "#64748b";

    html += `<tr style="border-bottom: 1px solid #cbd5e1;">
            <td style="padding: 8px; font-weight: bold;">${v.patente}</td>
            <td style="padding: 8px;">${v.nombre}</td>
            <td style="padding: 8px;"><span style="color: ${estadoColor}; font-weight: bold;">${v.estado || "Pendiente"}</span></td>
            <td style="padding: 8px; text-align: center;">`;

    // Mostramos el botón de entregar SOLO si el estado es "Pagado" (o "Finalizado" si no hay paso de pago)
    if (v.estado === "Pagado" || v.estado === "Finalizado") {
      html += `<button class="btn btn-success" style="padding: 5px 10px; font-size: 0.8rem;" onclick="irAEntregar('${v.patente}')">Verificar y Entregar</button>`;
    } else if (v.estado === "Entregado") {
      html += `<button class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.8rem;" onclick="verDetalle('${v.patente}')">👁️ Ver Detalles</button>`;
    } else {
      html += `<span style="color: #ccc;">-</span>`;
    }
    html += `</td></tr>`;
  });

  html += "</table>";
  contenedor.innerHTML = html;
}

// Función para redirigir a la pantalla de entrega (que está en administración)
function irAEntregar(patente) {
  // Guardamos la patente en sessionStorage para que la pantalla de entrega sepa qué auto es
  sessionStorage.setItem("vehiculoAEntregar", patente);
  // Redirigimos a la pantalla de entrega (que luego moveremos a recepción o dejaremos en admin)
  window.location.href = "entrega.html";
}

// Llamamos a la función al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  cargarGrillaTurnos();
  cargarGrillaVehiculos();
});

function verDetalle(patente) {
    sessionStorage.setItem('vehiculoDetalle', patente);
    window.location.href = 'detalle.html';
}