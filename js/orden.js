// js/orden.js

let vehiculoOT = null;

function cargarListaReparacion() {
    const contenedor = document.getElementById('listaVehiculosReparacion');
    if (!contenedor) return;

    const vehiculos = obtenerVehiculos();
    // Filtramos los que están en proceso de reparación
    const enReparacion = vehiculos.filter(v => 
        v.estado === "En Reparación" || 
        v.estado === "En Espera de Repuestos" || 
        v.estado === "Control de Calidad"
    );

    if (enReparacion.length === 0) {
        contenedor.innerHTML = '<p style="color: #666;">No hay vehículos en reparación.</p>';
        return;
    }

    let html = '<table style="width: 100%; border-collapse: collapse; text-align: left;">';
    html += '<tr style="background-color: #cbd5e1;"><th style="padding: 8px;">Patente</th><th style="padding: 8px;">Modelo</th><th style="padding: 8px;">Estado Actual</th><th style="padding: 8px;">Acción</th></tr>';
    
    enReparacion.forEach(v => {
        html += `<tr style="border-bottom: 1px solid #cbd5e1;">
            <td style="padding: 8px;">${v.patente}</td>
            <td style="padding: 8px;">${v.modelo}</td>
            <td style="padding: 8px; font-weight: bold; color: #7c3aed;">${v.estado}</td>
            <td style="padding: 8px;"><button class="btn btn-primary" style="padding: 5px 10px; font-size: 0.8rem;" onclick="seleccionarOT('${v.patente}')">Actualizar</button></td>
        </tr>`;
    });
    html += '</table>';
    contenedor.innerHTML = html;
}

function seleccionarOT(patente) {
    const vehiculo = buscarVehiculo(patente);
    if (!vehiculo) return;

    vehiculoOT = vehiculo;
    document.getElementById('dispPatenteOT').textContent = vehiculo.patente;
    document.getElementById('nuevoEstado').value = vehiculo.estado;
    document.getElementById('formOrden').style.display = "block";
}

document.getElementById('formOrden').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!vehiculoOT) return;

    const nuevoEstado = document.getElementById('nuevoEstado').value;
    const observaciones = document.getElementById('observacionesOT').value;

    const exito = actualizarVehiculo(vehiculoOT.patente, {
        estado: nuevoEstado,
        observacionesOT: observaciones
    });

    const mensaje = document.getElementById('mensajeOT');

    if (exito) {
        mensaje.style.color = "green";
        mensaje.textContent = "Estado actualizado con éxito.";
        document.getElementById('formOrden').style.display = "none";
        cargarListaReparacion();
    } else {
        mensaje.style.color = "red";
        mensaje.textContent = "Error al actualizar.";
    }
});

document.addEventListener('DOMContentLoaded', cargarListaReparacion);