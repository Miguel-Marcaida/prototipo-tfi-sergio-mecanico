// js/factura.js

let vehiculoFactura = null;

function cargarListaFacturacion() {
    const contenedor = document.getElementById('listaVehiculosFacturar');
    if (!contenedor) return;

    const vehiculos = obtenerVehiculos();
    const pendientes = vehiculos.filter(v => v.estado === "Finalizado");

    if (pendientes.length === 0) {
        contenedor.innerHTML = '<p style="color: #666;">No hay vehículos listos para facturar.</p>';
        return;
    }

    let html = '<table style="width: 100%; border-collapse: collapse; text-align: left;">';
    html += '<tr style="background-color: #cbd5e1;"><th style="padding: 8px;">Patente</th><th style="padding: 8px;">Modelo</th><th style="padding: 8px;">Cliente</th><th style="padding: 8px;">Acción</th></tr>';
    
    pendientes.forEach(v => {
        html += `<tr style="border-bottom: 1px solid #cbd5e1;">
            <td style="padding: 8px; font-weight: bold;">${v.patente}</td>
            <td style="padding: 8px;">${v.modelo}</td>
            <td style="padding: 8px;">${v.nombre}</td>
            <td style="padding: 8px;"><button class="btn btn-primary" style="padding: 5px 10px; font-size: 0.8rem;" onclick="seleccionarParaFacturar('${v.patente}')">Facturar</button></td>
        </tr>`;
    });
    html += '</table>';
    contenedor.innerHTML = html;
}

function seleccionarParaFacturar(patente) {
    const vehiculo = buscarVehiculo(patente);
    if (!vehiculo) return;

    vehiculoFactura = vehiculo;
    
    document.getElementById('dispPatente').textContent = vehiculo.patente;
    document.getElementById('dispModelo').textContent = vehiculo.modelo;
    document.getElementById('dispCliente').textContent = vehiculo.nombre;
    document.getElementById('dispDiagnostico').textContent = vehiculo.diagnostico;
    document.getElementById('dispRepuestos').textContent = vehiculo.repuestos;
    document.getElementById('dispManoObra').textContent = vehiculo.presupuesto;
    
    // Limpiamos los campos de pago y el select de cliente
    document.getElementById('tipoCliente').value = "comun";
    document.getElementById('medioPago').value = "Efectivo";
    document.getElementById('montoRecibido').value = "";
    document.getElementById('vuelto').value = "";
    
    document.getElementById('formFactura').style.display = "block";
    document.getElementById('mensajeFactura').textContent = "";
    
    calcularTotal();
}

function calcularTotal() {
    if (!vehiculoFactura) return;

    const manoObra = parseFloat(vehiculoFactura.presupuesto) || 0;
    const medioPago = document.getElementById('medioPago').value;
    const tipoCliente = document.getElementById('tipoCliente').value;
    
    // Descuento del 10% solo si es habitual o flota
    let desc10 = 0;
    if (tipoCliente === "habitual" || tipoCliente === "flota") {
        desc10 = manoObra * 0.10;
    }
    
    // Descuento del 5% solo si es efectivo
    const desc5 = medioPago === "Efectivo" ? manoObra * 0.05 : 0;
    
    const total = manoObra - desc10 - desc5;

    document.getElementById('dispDesc10').textContent = desc10.toFixed(0);
    document.getElementById('dispDesc5').textContent = desc5.toFixed(0);
    document.getElementById('dispTotalFactura').textContent = total.toFixed(0);
}

function calcularVuelto() {
    const total = parseFloat(document.getElementById('dispTotalFactura').textContent) || 0;
    const recibido = parseFloat(document.getElementById('montoRecibido').value) || 0;
    
    const vuelto = recibido - total;
    document.getElementById('vuelto').value = vuelto >= 0 ? vuelto.toFixed(0) : "Falta dinero";
}

function registrarPago() {
    if (!vehiculoFactura) return;

    const confirmar = confirm("¿Está seguro de registrar el pago? El vehículo pasará a 'Pagado' y estará listo para su entrega.");
    if (!confirmar) return;

    const exito = actualizarVehiculo(vehiculoFactura.patente, {
        estado: "Pagado"
    });

    const mensaje = document.getElementById('mensajeFactura');

    if (exito) {
        alert("Pago registrado con éxito.\n\nSe ha generado el comprobante digital y el vehículo está listo para la entrega.");
        mensaje.style.color = "green";
        mensaje.textContent = "Pago registrado. Vehículo listo para entrega.";
        document.getElementById('formFactura').style.display = "none";
        cargarListaFacturacion();
    } else {
        mensaje.style.color = "red";
        mensaje.textContent = "Error al registrar el pago.";
    }
}

function cancelarFactura() {
    document.getElementById('formFactura').style.display = "none";
    document.getElementById('formFactura').reset();
    vehiculoFactura = null;
}

document.addEventListener('DOMContentLoaded', cargarListaFacturacion);