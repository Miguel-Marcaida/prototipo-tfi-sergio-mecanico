// js/db.js

// Inicializar la base de datos si no existe
if (!localStorage.getItem('vehiculos')) {
    localStorage.setItem('vehiculos', JSON.stringify([]));
}

// Guardar un vehículo nuevo
function guardarVehiculo(vehiculo) {
    let vehiculos = JSON.parse(localStorage.getItem('vehiculos'));
    
    // Verificar si la patente ya existe
    const existe = vehiculos.find(v => v.patente.toUpperCase() === vehiculo.patente.toUpperCase());
    if (existe) {
        return { success: false, message: "Error: La patente ya está registrada en el sistema." };
    }

    vehiculos.push(vehiculo);
    localStorage.setItem('vehiculos', JSON.stringify(vehiculos));
    return { success: true, message: "Vehículo registrado con éxito." };
}

// Obtener todos los vehículos
function obtenerVehiculos() {
    return JSON.parse(localStorage.getItem('vehiculos')) || [];
}

// BUSCAR UN VEHÍCULO POR PATENTE (Faltaba esta)
function buscarVehiculo(patente) {
    const vehiculos = obtenerVehiculos();
    return vehiculos.find(v => v.patente.toUpperCase() === patente.toUpperCase());
}

// ACTUALIZAR LOS DATOS DE UN VEHÍCULO (Faltaba esta)
function actualizarVehiculo(patente, nuevosDatos) {
    let vehiculos = obtenerVehiculos();
    const index = vehiculos.findIndex(v => v.patente.toUpperCase() === patente.toUpperCase());
    
    if (index !== -1) {
        // Mezclamos los datos viejos con los nuevos
        vehiculos[index] = { ...vehiculos[index], ...nuevosDatos };
        localStorage.setItem('vehiculos', JSON.stringify(vehiculos));
        return true;
    }
    return false;
}