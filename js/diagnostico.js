// js/diagnostico.js

let vehiculoActual = null;
let codigosAgregados = []; // Array para guardar los códigos

// Función para agregar un código a la lista
function agregarCodigo() {
    const input = document.getElementById('codigoInput');
    const codigo = input.value.trim().toUpperCase();
    
    if (codigo && !codigosAgregados.includes(codigo)) {
        codigosAgregados.push(codigo);
        actualizarListaCodigos();
        input.value = ''; // Limpiar el input
    }
}

// Función para dibujar la lista de códigos en el HTML
function actualizarListaCodigos() {
    const lista = document.getElementById('listaCodigos');
    lista.innerHTML = '';
    codigosAgregados.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c;
        lista.appendChild(li);
    });
}

// Función para cancelar y limpiar todo
function cancelarDiagnostico() {
    document.getElementById('formDiagnostico').style.display = 'none';
    document.getElementById('formDiagnostico').reset();
    codigosAgregados = [];
    actualizarListaCodigos();
    vehiculoActual = null;
}

// Cargar la lista de pendientes
function cargarListaPendientes() {
    const contenedor = document.getElementById('listaVehiculosPendientes');
    if (!contenedor) return;

    const vehiculos = obtenerVehiculos();
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

// Seleccionar un vehículo para diagnosticar
function seleccionarVehiculo(patente) {
    const vehiculo = buscarVehiculo(patente);
    if (!vehiculo) return;

    vehiculoActual = vehiculo;
    document.getElementById('dispPatente').textContent = vehiculo.patente;
    document.getElementById('dispModelo').textContent = vehiculo.modelo;
    document.getElementById('dispCliente').textContent = vehiculo.nombre;
    
    // Limpiamos el formulario y los códigos anteriores
    document.getElementById('formDiagnostico').reset();
    codigosAgregados = [];
    actualizarListaCodigos();
    
    document.getElementById('formDiagnostico').style.display = "block";
    document.getElementById('mensajeDiagnostico').textContent = "";
}

// Guardar el diagnóstico (con confirmación)
document.getElementById('formDiagnostico').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!vehiculoActual) return;

    // Pedimos confirmación antes de guardar
    const confirmar = confirm("¿Está seguro de guardar el diagnóstico? Una vez guardado, el vehículo pasará a la bandeja de presupuestos del administrador.");
    
    if (!confirmar) return; // Si el usuario dice "Cancelar", no hace nada

    // Verificamos que haya al menos un código agregado (opcional, pero recomendado)
    if (codigosAgregados.length === 0) {
        alert("Por favor, agregue al menos un código de error antes de confirmar.");
        return;
    }

    const exito = actualizarVehiculo(vehiculoActual.patente, {
        diagnostico: document.getElementById('descripcion').value,
        codigos: codigosAgregados.join(', '), // Guardamos los códigos como un string separado por comas
        repuestos: document.getElementById('repuestos').value,
        estado: "Diagnóstico Completado"
    });

    const mensaje = document.getElementById('mensajeDiagnostico');

    if (exito) {
        mensaje.style.color = "green";
        mensaje.textContent = "Diagnóstico guardado. El vehículo está listo para presupuestar.";
        
        // Ocultamos el formulario y recargamos la lista
        document.getElementById('formDiagnostico').style.display = "none";
        cargarListaPendientes();
    } else {
        mensaje.style.color = "red";
        mensaje.textContent = "Error al guardar el diagnóstico.";
    }
});

// Cargar la lista al iniciar
document.addEventListener('DOMContentLoaded', cargarListaPendientes);