// js/app.js

// Función para guardar un vehículo/turno en la "base de datos" local
function guardarVehiculo(vehiculo) {
    let vehiculos = JSON.parse(localStorage.getItem('vehiculos')) || [];
    // Si el vehículo ya existe (misma patente), no lo duplicamos
    const existe = vehiculos.find(v => v.patente === vehiculo.patente);
    if (!existe) {
        vehiculos.push(vehiculo);
        localStorage.setItem('vehiculos', JSON.stringify(vehiculos));
        return true;
    }
    return false;
}

// Función para obtener todos los vehículos
function obtenerVehiculos() {
    return JSON.parse(localStorage.getItem('vehiculos')) || [];
}

// Función para actualizar el estado o diagnóstico de un vehículo por patente
function actualizarVehiculo(patente, nuevosDatos) {
    let vehiculos = obtenerVehiculos();
    const index = vehiculos.findIndex(v => v.patente === patente);
    if (index !== -1) {
        vehiculos[index] = { ...vehiculos[index], ...nuevosDatos };
        localStorage.setItem('vehiculos', JSON.stringify(vehiculos));
        return true;
    }
    return false;
}

// Función para buscar un vehículo por patente
function buscarVehiculo(patente) {
    let vehiculos = obtenerVehiculos();
    return vehiculos.find(v => v.patente.toUpperCase() === patente.toUpperCase());
}

// Función para registrar un pago
function registrarPago(patente, pago) {
    let pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    pagos.push({ patente, ...pago });
    localStorage.setItem('pagos', JSON.stringify(pagos));
}