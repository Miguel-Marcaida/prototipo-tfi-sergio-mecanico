// js/detalle.js

document.addEventListener('DOMContentLoaded', function() {
    const patente = sessionStorage.getItem('vehiculoDetalle');
    const contenedor = document.getElementById('contenedorDetalle');

    if (!patente) {
        contenedor.innerHTML = '<p>No se seleccionó ningún vehículo.</p>';
        return;
    }

    const vehiculo = buscarVehiculo(patente);
    if (!vehiculo) {
        contenedor.innerHTML = '<p>Vehículo no encontrado.</p>';
        return;
    }

    // Formatear la conformidad para mostrarla linda
    let conformidadTexto = "Conforme";
    if (vehiculo.conformidad === "observaciones") {
        conformidadTexto = `Con observaciones: ${vehiculo.observacionesEntrega || 'Sin detalle'}`;
    }

    // Armamos el HTML con los datos
    contenedor.innerHTML = `
        <div class="panel">
            <h1 style="text-align: center; margin-bottom: 5px;">COMPROBANTE DE SERVICIO</h1>
            <p style="text-align: center; color: #666; margin-bottom: 30px;">Taller de Mecánica Integral "Sergio Mecánico"</p>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <h3>Datos del Cliente</h3>
                    <p><strong>Nombre:</strong> ${vehiculo.nombre}</p>
                    <p><strong>DNI:</strong> ${vehiculo.dni}</p>
                    <p><strong>Teléfono:</strong> ${vehiculo.telefono}</p>
                </div>
                <div>
                    <h3>Datos del Vehículo</h3>
                    <p><strong>Patente:</strong> ${vehiculo.patente}</p>
                    <p><strong>Modelo:</strong> ${vehiculo.modelo}</p>
                    <p><strong>N° Chasis:</strong> ${vehiculo.chasis}</p>
                </div>
            </div>

            <hr>

            <div style="margin: 20px 0;">
                <h3>Detalle del Servicio</h3>
                <p><strong>Diagnóstico:</strong> ${vehiculo.diagnostico}</p>
                <p><strong>Códigos:</strong> ${vehiculo.codigos}</p>
                <p><strong>Repuestos:</strong> ${vehiculo.repuestos}</p>
            </div>

            <hr>

            <div style="margin: 20px 0;">
                <h3>Resumen de Pago</h3>
                <p><strong>Mano de obra:</strong> $${vehiculo.presupuesto}</p>
                <p><strong>Estado del Pago:</strong> Pagado</p>
            </div>

            <hr>

            <div style="margin: 20px 0;">
                <h3>Entrega</h3>
                <p><strong>Estado de la entrega:</strong> ${conformidadTexto}</p>
                <p><strong>Fecha de emisión:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="text-align: center; margin-top: 40px;">
                <p>_________________________________________</p>
                <p>Firma del Taller</p>
            </div>
        </div>
    `;
});