// js/vehiculo.js

document.addEventListener('DOMContentLoaded', function() {
    const turnoData = sessionStorage.getItem('turnoAConfirmar');
    
    if (turnoData) {
        const turno = JSON.parse(turnoData);
        
        // Autocompletamos los campos
        document.getElementById('nombre').value = turno.cliente || '';
        document.getElementById('dni').value = turno.dni || '';
        document.getElementById('telefono').value = turno.telefono || '';
        document.getElementById('patente').value = turno.patente || '';
        document.getElementById('modelo').value = turno.modelo || '';
        
        // Bloqueamos la patente para que no la cambien
        document.getElementById('patente').readOnly = true; 
        
        // Guardamos la info del turno en un campo oculto para actualizarlo después
        document.getElementById('turnoOrigen').value = JSON.stringify({
            patente: turno.patente,
            fecha: turno.fecha,
            hora: turno.hora
        });
    }
});

const formVehiculo = document.getElementById('formVehiculo');

if (formVehiculo) {
    formVehiculo.addEventListener('submit', function(e) {
        e.preventDefault();

                const nuevoVehiculo = {
            nombre: document.getElementById('nombre').value,
            dni: document.getElementById('dni').value,
            telefono: document.getElementById('telefono').value,
            patente: document.getElementById('patente').value.toUpperCase(),
            modelo: document.getElementById('modelo').value,
            chasis: document.getElementById('chasis').value,
            observaciones: document.getElementById('observaciones').value,
            estado: "Pendiente de Diagnóstico",
            diagnostico: "",
            presupuesto: 0,
            pagado: false
        };

        // --- NUEVA LÓGICA ---
        // Verificamos si el vehículo ya existe (porque vino de un turno)
        const existe = buscarVehiculo(nuevoVehiculo.patente);
        let resultado;

        if (existe) {
            // Si existe, actualizamos los datos que faltaban
            const exito = actualizarVehiculo(nuevoVehiculo.patente, {
                chasis: nuevoVehiculo.chasis,
                observaciones: nuevoVehiculo.observaciones,
                estado: "Pendiente de Diagnóstico" // Aseguramos que pase a la cola
            });
            resultado = { success: exito, message: "Vehículo actualizado con éxito." };
        } else {
            // Si no existe, lo creamos
            resultado = guardarVehiculo(nuevoVehiculo);
        }
        // --- FIN NUEVA LÓGICA ---

        const mensajeDiv = document.getElementById('mensaje');

        if (resultado.success) {
            mensajeDiv.style.color = "green";
            mensajeDiv.textContent = resultado.message;
            
            // Actualizar el turno a "Atendido" si venía de uno
            const turnoOrigenData = document.getElementById('turnoOrigen').value;
            if (turnoOrigenData) {
                const turnoInfo = JSON.parse(turnoOrigenData);
                let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
                
                // Buscamos el turno exacto
                const index = turnos.findIndex(t => 
                    t.patente === turnoInfo.patente && 
                    t.fecha === turnoInfo.fecha && 
                    t.hora === turnoInfo.hora
                );
                
                if (index !== -1) {
                    turnos[index].estado = "Atendido";
                    localStorage.setItem('turnos', JSON.stringify(turnos));
                }
            }
            
            // Limpiar y volver al menú después de 2 segundos
            sessionStorage.removeItem('turnoAConfirmar');
            this.reset();
            document.getElementById('patente').readOnly = false;
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            mensajeDiv.style.color = "red";
            mensajeDiv.textContent = resultado.message;
        }
    });
}