// js/admin.js

let vehiculoPresupuesto = null;

// Cargar la lista de vehículos con diagnóstico completado
function cargarListaPresupuestos() {
    const contenedor = document.getElementById('listaVehiculosPresupuesto');
    if (!contenedor) return;

    const vehiculos = obtenerVehiculos();
    const pendientes = vehiculos.filter(v => v.estado === "Diagnóstico Completado");

    if (pendientes.length === 0) {
        contenedor.innerHTML = '<p style="color: #666;">No hay vehículos pendientes de presupuesto.</p>';
        return;
    }

    let html = '<table style="width: 100%; border-collapse: collapse; text-align: left;">';
    html += '<tr style="background-color: #cbd5e1;"><th style="padding: 8px;">Patente</th><th style="padding: 8px;">Modelo</th><th style="padding: 8px;">Cliente</th><th style="padding: 8px;">Acción</th></tr>';
    
    pendientes.forEach(v => {
        html += `<tr style="border-bottom: 1px solid #cbd5e1;">
            <td style="padding: 8px;">${v.patente}</td>
            <td style="padding: 8px;">${v.modelo}</td>
            <td style="padding: 8px;">${v.nombre}</td>
            <td style="padding: 8px;"><button class="btn btn-primary" style="padding: 5px 10px; font-size: 0.8rem;" onclick="seleccionarParaPresupuesto('${v.patente}')">Presupuestar</button></td>
        </tr>`;
    });
    html += '</table>';
    contenedor.innerHTML = html;
}

// Seleccionar un vehículo para presupuestar
function seleccionarParaPresupuesto(patente) {
    const vehiculo = buscarVehiculo(patente);
    if (!vehiculo) return;

    vehiculoPresupuesto = vehiculo;
    
    // Mostrar datos en pantalla
    document.getElementById('dispPatente').textContent = vehiculo.patente;
    document.getElementById('dispModelo').textContent = vehiculo.modelo;
    document.getElementById('dispCliente').textContent = vehiculo.nombre;
    document.getElementById('dispDiagnostico').textContent = vehiculo.diagnostico;
    document.getElementById('dispCodigos').textContent = vehiculo.codigos;
    document.getElementById('dispRepuestos').textContent = vehiculo.repuestos;
    
    document.getElementById('formPresupuesto').style.display = "block";
    document.getElementById('mensajePresupuesto').textContent = "";
}

// Calcular total visualmente
document.getElementById('manoObra').addEventListener('input', function() {
    document.getElementById('dispTotal').textContent = this.value;
});

// Generar Presupuesto (solo muestra el total calculado)
function generarPresupuesto() {
    const manoObra = document.getElementById('manoObra').value;
    document.getElementById('dispTotal').textContent = manoObra;
    document.getElementById('mensajePresupuesto').style.color = "blue";
    document.getElementById('mensajePresupuesto').textContent = "Presupuesto generado. Ahora puede aprobarlo para emitir la Orden de Trabajo.";
}

// Aprobar Presupuesto y generar OT
function aprobarPresupuesto() {
    if (!vehiculoPresupuesto) return;

    const manoObra = document.getElementById('manoObra').value;

    // Actualizamos el vehículo: guardamos el presupuesto y cambiamos el estado
    const exito = actualizarVehiculo(vehiculoPresupuesto.patente, {
        presupuesto: manoObra,
        estado: "En Reparación" // Se genera la OT y pasa a reparación
    });

    const mensaje = document.getElementById('mensajePresupuesto');

    if (exito) {
        mensaje.style.color = "green";
        mensaje.textContent = "Presupuesto aprobado. Se ha generado la Orden de Trabajo y el vehículo pasó a 'En Reparación'.";
        document.getElementById('formPresupuesto').style.display = "none";
        cargarListaPresupuestos(); // Recargar la lista
    } else {
        mensaje.style.color = "red";
        mensaje.textContent = "Error al aprobar el presupuesto.";
    }
}

// Cargar la lista al iniciar
document.addEventListener('DOMContentLoaded', cargarListaPresupuestos);