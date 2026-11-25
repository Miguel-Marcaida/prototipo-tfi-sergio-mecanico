// js/turnos.js

function renderizarTurnos() {
    const lista = document.getElementById('listaTurnos');
    const inputFecha = document.getElementById('fechaConsulta');
    if (!lista) return;

    // Si no hay fecha seleccionada, usamos la de hoy
    let fechaFiltro = inputFecha.value;
    if (!fechaFiltro) {
        const hoy = new Date();
        fechaFiltro = hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        inputFecha.value = fechaFiltro;
    }

    const turnos = JSON.parse(localStorage.getItem('turnos')) || [];
    
    // Filtramos por la fecha seleccionada
    const turnosFiltrados = turnos.filter(t => t.fecha === fechaFiltro);

    lista.innerHTML = ''; 

    if (turnosFiltrados.length === 0) {
        lista.innerHTML = '<p style="color: #666;">No hay turnos registrados para esta fecha.</p>';
        return;
    }

    turnosFiltrados.forEach(t => {
        const div = document.createElement('div');
        div.className = 'turno-item';
        div.innerHTML = `
            <span class="turno-hora">${t.hora}</span>
            <span class="turno-cliente">${t.cliente}</span><br>
            <span class="turno-detalle">${t.patente} - ${t.modelo}</span><br>
            <span class="turno-detalle">${t.motivo}</span>
        `;
        lista.appendChild(div);
    });
}

const formTurno = document.getElementById('formTurno');
if (formTurno) {
    formTurno.addEventListener('submit', function(e) {
        e.preventDefault();

        const nuevoTurno = {
            cliente: document.getElementById('cliente').value,
            telefono: document.getElementById('telefono').value,
            dni: document.getElementById('dni').value,
            patente: document.getElementById('patente').value.toUpperCase(),
            modelo: document.getElementById('modelo').value,
            fecha: document.getElementById('fecha').value,
            hora: document.getElementById('hora').value,
            motivo: document.getElementById('motivo').value,
            estado: "Pendiente" // <--- ¡ESTA ES LA LÍNEA QUE FALTABA!
        };

        let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
        turnos.push(nuevoTurno);
        localStorage.setItem('turnos', JSON.stringify(turnos));

        const mensajeDiv = document.getElementById('mensaje');
        mensajeDiv.style.color = "green";
        mensajeDiv.textContent = "Turno registrado con éxito.";
        
        this.reset();
        renderizarTurnos();
    });
}

// Cargar la lista al iniciar
renderizarTurnos();