// js/seed.js

function cargarDatosDePrueba() {
    // Borramos todo para que no se dupliquen
    localStorage.clear();

    const datosPrueba = [
        {
            nombre: "Juan Pérez",
            dni: "20123456",
            telefono: "3811234567",
            patente: "AB123CD",
            modelo: "Ford Focus",
            chasis: "9BWZZZ377VT004251",
            observaciones: "Cliente reporta ruido en la parte delantera.",
            estado: "Pendiente de Diagnóstico",
            diagnostico: "",
            codigos: "",
            repuestos: "",
            presupuesto: 0
        },
        {
            nombre: "María Gómez",
            dni: "27876543",
            telefono: "3819876543",
            patente: "EF456GH",
            modelo: "Chevrolet Onix",
            chasis: "8AP12345678901234",
            observaciones: "Mantenimiento preventivo.",
            estado: "Diagnóstico Completado",
            diagnostico: "Falla en cilindro 1. Se recomienda cambio de bujías.",
            codigos: "P0301",
            repuestos: "Bujías (x4), Filtro de aceite",
            presupuesto: 0
        },
        {
            nombre: "Carlos López",
            dni: "33456789",
            telefono: "3815555555",
            patente: "IJ789KL",
            modelo: "Toyota Corolla",
            chasis: "9BR12345678901234",
            observaciones: "Problema de embrague.",
            estado: "En Reparación",
            diagnostico: "Desgaste del disco de embrague.",
            codigos: "P0700",
            repuestos: "Kit de embrague completo",
            presupuesto: 45000
        },
        {
            nombre: "Ana Martínez",
            dni: "40123456",
            telefono: "3814444444",
            patente: "MN012OP",
            modelo: "Fiat Cronos",
            chasis: "9BD12345678901234",
            observaciones: "Service de 10.000 km.",
            estado: "Entregado",
            diagnostico: "Cambio de aceite y filtros.",
            codigos: "N/A",
            repuestos: "Aceite 5W30, Filtro de aceite, Filtro de aire",
            presupuesto: 25000,
            conformidad: "conforme",
            observacionesEntrega: ""
        }
    ];

    localStorage.setItem('vehiculos', JSON.stringify(datosPrueba));
    
    // Creamos un turno de prueba para hoy
    const hoy = new Date().toISOString().split('T')[0];
    const turnosPrueba = [
        {
            cliente: "Juan Pérez",
            telefono: "3811234567",
            dni: "20123456",
            patente: "AB123CD",
            modelo: "Ford Focus",
            fecha: hoy,
            hora: "10:00",
            motivo: "Ruido en la parte delantera",
            estado: "Pendiente"
        }
    ];
    localStorage.setItem('turnos', JSON.stringify(turnosPrueba));

    alert("Datos de prueba cargados con éxito.\n\nSe han creado 4 vehículos en distintos estados y 1 turno para hoy.");
    
    // Recargamos la página para que se vean los cambios
    window.location.reload();
}

// Para vaciar la base de datos y empezar de cero
function limpiarDatos() {
    if (confirm("¿Está seguro de borrar todos los datos? Esta acción no se puede deshacer.")) {
        localStorage.clear();
        alert("Base de datos limpia.");
        window.location.reload();
    }
}