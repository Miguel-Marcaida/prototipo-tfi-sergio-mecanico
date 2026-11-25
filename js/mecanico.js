// js/mecanico.js

let vehiculoActual = null;

// Array temporal para guardar los códigos agregados
let codigosAgregados = [];

function agregarCodigo() {
    const input = document.getElementById('codigoInput');
    const codigo = input.value.trim().toUpperCase();
    
    if (codigo && !codigosAgregados.includes(codigo)) {
        codigosAgregados.push(codigo);
        actualizarListaCodigos();
        input.value = ''; // Limpiar el input
    }
}

function actualizarListaCodigos() {
    const lista = document.getElementById('listaCodigos');
    lista.innerHTML = '';
    codigosAgregados.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c;
        lista.appendChild(li);
    });
}

// Cargar la lista de vehículos pendientes al iniciar
function cargarListaPendientes() {
    const contenedor = document.getElementById('listaVehiculosPendientes');
    if (!contenedor) return;

    const vehiculos = obtenerVehiculos();
    // Filtramos solo los que están pendientes de diagnóstico
    const pendientes = vehiculos.filter(v => v.estado === "Pendiente de Diagnóstico");

    if (pendientes.length === 0) {
        contenedor.innerHTML = '<p style="color: #666;">No hay vehículos pendientes.</p>';
        return;
    }

    let html = '<table style="width: 100%; border-collapse: collapse; text-align: left;">';
    html += '<tr style="background-color: #cbd5e1;"><th style="padding: 8px;">Patente</th><th style="padding: 8px;">Modelo</th><th style="padding: 8px;">Cliente</th><th style="padding: 8px;">Acción</th></tr>';
    
    pendientes.forEach(v => {
        html += `<tr style="border-bottom: 1px solid #cbd5e1;">
            <td style="padding: 8px;">${v.patente}</td>
            <td style="padding: 8px;">${v.modelo}</td>
            <td style="padding: 8px;">${v.nombre}</td>
            <td style="padding: 8px;"><button class="btn btn-primary" style="padding: 5px 10px; font-size: 0.8rem;" onclick="seleccionarVehiculo('${v.patente}')">Seleccionar</button></td>
        </tr>`;
    });
    html += '</table>';
    contenedor.innerHTML = html;
}

// Seleccionar un vehículo de la lista para diagnosticar
function seleccionarVehiculo(patente) {
    const vehiculo = buscarVehiculo(patente);
    if (!vehiculo) return;

    vehiculoActual = vehiculo;
    
    // Mostramos los datos en el formulario
    document.getElementById('dispPatente').textContent = vehiculo.patente;
    document.getElementById('dispModelo').textContent = vehiculo.modelo;
    document.getElementById('dispCliente').textContent = vehiculo.nombre;
    document.getElementById('dispFecha').textContent = new Date().toLocaleDateString();
    
    // Mostramos el formulario y lo limpiamos
    document.getElementById('formDiagnostico').reset();
    document.getElementById('formDiagnostico').style.display = "block";
    document.getElementById('mensajeDiagnostico').textContent = "";

    // Limpiamos la lista de códigos
    codigosAgregados = [];
    actualizarListaCodigos();
}

// Guardar el diagnóstico
document.getElementById('formDiagnostico').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!vehiculoActual) return;

    const descripcion = document.getElementById('descripcion').value;
    const codigos = document.getElementById('codigos').value;
    const repuestos = document.getElementById('repuestos').value;

    // Actualizamos el vehículo en la base de datos
    const exito = actualizarVehiculo(vehiculoActual.patente, {
        diagnostico: descripcion,
        codigos: codigos.join(', '), // Guardamos como string separado por comas,
        repuestos: repuestos,
        estado: "Diagnóstico Completado" // Estado para que el admin sepa que ya está listo
    });

    const mensaje = document.getElementById('mensajeDiagnostico');

    if (exito) {
        mensaje.style.color = "green";
        mensaje.textContent = "Diagnóstico guardado. El vehículo está listo para presupuestar.";
        document.getElementById('formDiagnostico').style.display = "none";
        cargarListaPendientes(); // Recargamos la lista (el auto desaparece de pendientes)
    } else {
        mensaje.style.color = "red";
        mensaje.textContent = "Error al guardar el diagnóstico.";
    }
});

// Cargar la lista al iniciar la página
document.addEventListener('DOMContentLoaded', cargarListaPendientes);