// js/presupuesto.js

let vehiculoPresupuesto = null;

// Cargar la lista: muestra los que necesitan presupuesto Y los que esperan aprobación
function cargarListaPresupuestos() {
  const contenedor = document.getElementById("listaVehiculosPresupuesto");
  if (!contenedor) return;

  const vehiculos = obtenerVehiculos();
  // Filtramos los que están en diagnóstico completado O presupuesto enviado
  const pendientes = vehiculos.filter(
    (v) =>
      v.estado === "Diagnóstico Completado" ||
      v.estado === "Presupuesto Enviado",
  );

  if (pendientes.length === 0) {
    contenedor.innerHTML =
      '<p style="color: #666;">No hay vehículos pendientes de presupuesto o aprobación.</p>';
    return;
  }

  let html =
    '<table style="width: 100%; border-collapse: collapse; text-align: left;">';
  html += '<tr style="background-color: #cbd5e1;">';
  html +=
    '<th style="padding: 8px;">Patente</th><th style="padding: 8px;">Modelo</th><th style="padding: 8px;">Cliente</th><th style="padding: 8px;">Estado</th><th style="padding: 8px;">Acción</th>';
  html += "</tr>";

  pendientes.forEach((v) => {
    let estadoColor =
      v.estado === "Diagnóstico Completado" ? "#d97706" : "#2563eb";
    let botonAccion = "";

    if (v.estado === "Diagnóstico Completado") {
      botonAccion = `<button class="btn btn-primary" style="padding: 5px 10px; font-size: 0.8rem;" onclick="seleccionarParaPresupuesto('${v.patente}')">Presupuestar</button>`;
    } else if (v.estado === "Presupuesto Enviado") {
      botonAccion = `<button class="btn btn-success" style="padding: 5px 10px; font-size: 0.8rem;" onclick="seleccionarParaPresupuesto('${v.patente}')">Aprobar Presupuesto</button>`;
    }

    html += `<tr style="border-bottom: 1px solid #cbd5e1;">
            <td style="padding: 8px; font-weight: bold;">${v.patente}</td>
            <td style="padding: 8px;">${v.modelo}</td>
            <td style="padding: 8px;">${v.nombre}</td>
            <td style="padding: 8px; color: ${estadoColor}; font-weight: bold;">${v.estado}</td>
            <td style="padding: 8px;">${botonAccion}</td>
        </tr>`;
  });
  html += "</table>";
  contenedor.innerHTML = html;
}

// Seleccionar un vehículo
function seleccionarParaPresupuesto(patente) {
  const vehiculo = buscarVehiculo(patente);
  if (!vehiculo) return;

  vehiculoPresupuesto = vehiculo;

  // Mostrar datos en pantalla
  document.getElementById("dispPatente").textContent = vehiculo.patente;
  document.getElementById("dispModelo").textContent = vehiculo.modelo;
  document.getElementById("dispCliente").textContent = vehiculo.nombre;
  document.getElementById("dispDiagnostico").textContent = vehiculo.diagnostico;
  document.getElementById("dispCodigos").textContent = vehiculo.codigos;
  document.getElementById("dispRepuestos").textContent = vehiculo.repuestos;

  // Si el presupuesto ya fue generado, cargamos el monto y lo bloqueamos
  if (vehiculo.estado === "Presupuesto Enviado") {
    document.getElementById("manoObra").value = vehiculo.presupuesto;
    document.getElementById("dispTotal").textContent = vehiculo.presupuesto;
    document.getElementById("manoObra").readOnly = true; // <--- BLOQUEAR EL INPUT
  } else {
    document.getElementById("manoObra").readOnly = false; // <--- DESBLOQUEAR SI ES NUEVO
  }

  // Mostramos u ocultamos el botón de aprobar según el estado
  const btnAprobar = document.getElementById("btnAprobar");
  const btnGenerar = document.getElementById("btnGenerar");

  if (vehiculo.estado === "Presupuesto Enviado") {
    btnGenerar.style.display = "none";
    btnAprobar.style.display = "inline-block";
  } else {
    btnGenerar.style.display = "inline-block";
    btnAprobar.style.display = "none";
  }

  document.getElementById("formPresupuesto").style.display = "block";
  document.getElementById("mensajePresupuesto").textContent = "";
}

// Actualizar el total visualmente
document.getElementById("manoObra").addEventListener("input", function () {
  document.getElementById("dispTotal").textContent = this.value;
});

// Generar Presupuesto (Cambia estado a "Presupuesto Enviado")
function generarPresupuesto() {
  if (!vehiculoPresupuesto) return;

  const manoObra = document.getElementById("manoObra").value;

  const exito = actualizarVehiculo(vehiculoPresupuesto.patente, {
    presupuesto: manoObra,
    estado: "Presupuesto Enviado",
  });

  const mensaje = document.getElementById("mensajePresupuesto");

  if (exito) {
    // Cartel simulando el envío por WhatsApp
    alert(
      `Presupuesto de $${manoObra} generado y enviado al cliente vía WhatsApp.\n\nEsperando confirmación del cliente para aprobar y generar la Orden de Trabajo.`,
    );

    mensaje.style.color = "blue";
    mensaje.textContent =
      "Presupuesto generado y enviado al cliente. Esperando aprobación.";
    document.getElementById("formPresupuesto").style.display = "none";
    cargarListaPresupuestos();
  } else {
    mensaje.style.color = "red";
    mensaje.textContent = "Error al generar el presupuesto.";
  }
}

// Aprobar Presupuesto (Cambia estado a "En Reparación" y genera OT)
function aprobarPresupuesto() {
  if (!vehiculoPresupuesto) return;

  const confirmar = confirm(
    "¿El cliente ha aceptado el presupuesto? Se generará la Orden de Trabajo y el vehículo pasará a 'En Reparación'.",
  );
  if (!confirmar) return;

  const manoObra = document.getElementById("manoObra").value;

  const exito = actualizarVehiculo(vehiculoPresupuesto.patente, {
    presupuesto: manoObra,
    estado: "En Reparación",
  });

  const mensaje = document.getElementById("mensajePresupuesto");

  if (exito) {
    // Cartel simulando la generación de la OT
    alert(
      "Presupuesto aprobado.\n\nSe ha generado la Orden de Trabajo (OT) y el vehículo pasó al estado 'En Reparación'.",
    );

    mensaje.style.color = "green";
    mensaje.textContent =
      "Presupuesto aprobado. Orden de Trabajo generada. El vehículo pasó a 'En Reparación'.";
    document.getElementById("formPresupuesto").style.display = "none";
    cargarListaPresupuestos();
  } else {
    mensaje.style.color = "red";
    mensaje.textContent = "Error al aprobar el presupuesto.";
  }
}

// Cancelar y limpiar
function cancelarPresupuesto() {
  document.getElementById("formPresupuesto").style.display = "none";
  document.getElementById("formPresupuesto").reset();
  vehiculoPresupuesto = null;
}

// Cargar la lista al iniciar
document.addEventListener("DOMContentLoaded", cargarListaPresupuestos);
