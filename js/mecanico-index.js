// js/mecanico-index.js

function cargarGrillaDiagnosticos() {
    const contenedor = document.getElementById('grillaDiagnosticos');
    if (!contenedor) return;

    const vehiculos = obtenerVehiculos();
    // Filtramos los que tienen diagnóstico pero aún no están en reparación
    const pendientes = vehiculos.filter(v => 
        v.estado === "Diagnóstico Completado" || 
        v.estado === "Presupuesto Enviado"
    );

    if (pendientes.length === 0) {
        contenedor.innerHTML = '<p style="color: #666;">No hay diagnósticos pendientes de aprobación.</p>';
        return;
    }

    let html = '<table style="width: 100%; border-collapse: collapse; text-align: left;">';
    html += '<tr style="background-color: #cbd5e1;">';
    html += '<th style="padding: 8px;">Patente</th><th style="padding: 8px;">Modelo</th><th style="padding: 8px;">Diagnóstico</th><th style="padding: 8px;">Códigos</th><th style="padding: 8px;">Estado</th>';
    html += '</tr>';

    pendientes.forEach(v => {
        // Determinamos el texto y color según el estado
        let estadoTexto = "Esperando Presupuesto";
        let estadoColor = "#d97706"; // Naranja

        if (v.estado === "Presupuesto Enviado") {
            estadoTexto = "Esperando Aprobación del Cliente";
            estadoColor = "#2563eb"; // Azul
        }

        html += `<tr style="border-bottom: 1px solid #cbd5e1;">
            <td style="padding: 8px; font-weight: bold;">${v.patente}</td>
            <td style="padding: 8px;">${v.modelo}</td>
            <td style="padding: 8px; font-size: 0.9rem;">${v.diagnostico}</td>
            <td style="padding: 8px; font-size: 0.9rem; color: #1e3a8a; font-weight: bold;">${v.codigos}</td>
            <td style="padding: 8px; color: ${estadoColor}; font-weight: bold;">${estadoTexto}</td>
        </tr>`;
    });

    html += '</table>';
    contenedor.innerHTML = html;
}

// Cargar la grilla al iniciar
document.addEventListener('DOMContentLoaded', cargarGrillaDiagnosticos);