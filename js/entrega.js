// js/entrega.js

let vehiculoAEntregar = null;

document.addEventListener('DOMContentLoaded', function() {
    const patente = sessionStorage.getItem('vehiculoAEntregar');
    const contenedor = document.getElementById('contenidoEntrega');
    
    if (!patente) {
        alert("No se seleccionó ningún vehículo para entregar.");
        window.location.href = 'index.html';
        return;
    }

    const vehiculo = buscarVehiculo(patente);
    if (!vehiculo) {
        alert("Vehículo no encontrado.");
        window.location.href = 'index.html';
        return;
    }

    // Verificamos que esté en estado Pagado (o Finalizado si no pasó por pago)
    if (vehiculo.estado !== "Pagado" && vehiculo.estado !== "Finalizado") {
        alert("El vehículo no está listo para entregar. Debe estar 'Pagado'.");
        window.location.href = 'index.html';
        return;
    }

    vehiculoAEntregar = vehiculo;
    contenedor.style.display = "block";

    // Mostramos los datos
    document.getElementById('dispPatente').textContent = vehiculo.patente;
    document.getElementById('dispModelo').textContent = vehiculo.modelo;
    document.getElementById('dispCliente').textContent = vehiculo.nombre;
    document.getElementById('dispEstado').textContent = vehiculo.estado;

    // Los checkboxes se marcan automáticamente porque ya validamos el estado
    document.getElementById('checkControl').checked = true;
    document.getElementById('checkPago').checked = true;
    document.getElementById('checkComprobante').checked = true;
});

// Función para mostrar/ocultar el textarea de observaciones
function toggleObservaciones() {
    const select = document.getElementById('estadoConformidad');
    const div = document.getElementById('divObservaciones');
    
    if (select.value === "observaciones") {
        div.style.display = "block";
    } else {
        div.style.display = "none";
        document.getElementById('textoObservaciones').value = ""; // Limpiar si vuelve a conforme
    }
}

function confirmarEntrega() {
    if (!vehiculoAEntregar) return;

    const confirmar = confirm("¿Confirmar la entrega del vehículo al cliente? El proceso se dará por finalizado.");
    if (!confirmar) return;

    const tipoConformidad = document.getElementById('estadoConformidad').value;
    const observaciones = document.getElementById('textoObservaciones').value;

    // Actualizamos el vehículo con el estado final y los datos de conformidad
    const exito = actualizarVehiculo(vehiculoAEntregar.patente, {
        estado: "Entregado",
        conformidad: tipoConformidad,
        observacionesEntrega: observaciones
    });

    const mensaje = document.getElementById('mensajeEntrega');

    if (exito) {
        alert("Vehículo entregado con éxito.\n\nEl proceso de servicio ha finalizado.");
        mensaje.style.color = "green";
        mensaje.textContent = "Vehículo entregado. Proceso finalizado.";
        
        // Limpiamos el sessionStorage y redirigimos después de 2 segundos
        sessionStorage.removeItem('vehiculoAEntregar');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } else {
        mensaje.style.color = "red";
        mensaje.textContent = "Error al registrar la entrega.";
    }
}