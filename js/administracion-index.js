// js/administracion-index.js

function cargarGrillaEstadoVehiculos() {
    const contenedor = document.getElementById('grillaEstadoVehiculos');
    if (!contenedor) return;

    const vehiculos = obtenerVehiculos();
    // Mostramos todos los autos que están en el taller (excluimos entregados)
    const enTaller = vehiculos.filter(v => v.estado !== "Entregado");

    if (enTaller.length === 0) {
        contenedor.innerHTML = '<p style="color: #666;">No hay vehículos en el taller.</p>';
        return;
    }

    let html = '<table style="width: 100%; border-collapse: collapse; text-align: left;">';
    html += '<tr style="background-color: #cbd5e1;">';
    html += '<th style="padding: 8px;">Patente</th><th style="padding: 8px;">Modelo</th><th style="padding: 8px;">Cliente</th><th style="padding: 8px;">Estado Actual</th>';
    html += '</tr>';

    enTaller.forEach(v => {
        // Colores según el estado para que sea visual
        let estadoColor = "#64748b"; // Gris por defecto
        if (v.estado === "Pendiente de Diagnóstico") estadoColor = "#d97706"; // Naranja
        if (v.estado === "Diagnóstico Completado") estadoColor = "#d97706";
        if (v.estado === "Presupuesto Enviado") estadoColor = "#2563eb"; // Azul
        if (v.estado === "En Reparación") estadoColor = "#7c3aed"; // Violeta
        if (v.estado === "En Espera de Repuestos") estadoColor = "#dc2626"; // Rojo
        if (v.estado === "Control de Calidad") estadoColor = "#2563eb";
        if (v.estado === "Finalizado") estadoColor = "#059669"; // Verde
        if (v.estado === "Pagado") estadoColor = "#059669";

        html += `<tr style="border-bottom: 1px solid #cbd5e1;">
            <td style="padding: 8px; font-weight: bold;">${v.patente}</td>
            <td style="padding: 8px;">${v.modelo}</td>
            <td style="padding: 8px;">${v.nombre}</td>
            <td style="padding: 8px; color: ${estadoColor}; font-weight: bold;">${v.estado}</td>
        </tr>`;
    });

    html += '</table>';
    contenedor.innerHTML = html;
}

// Cargar la grilla al iniciar
document.addEventListener('DOMContentLoaded', cargarGrillaEstadoVehiculos);