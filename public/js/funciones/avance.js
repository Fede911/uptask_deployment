import Swal from 'sweetalert2';

export const actualizarAvance = () =>{
    // Seleccionar todas las tareas del proyecto seleccionado
    const tareas =  document.querySelectorAll('li.tarea');

    if(tareas.length){
    // Seleccionar las tareas completadas del proyecto seleccionado
    const tareasCompletas =  document.querySelectorAll('i.completo');

    // Calcular el avance
    const avance = Math.round((tareasCompletas.length/tareas.length) * 100);

    // Mostrar el avance
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance+"%";

    if(avance === 100){
        Swal.fire({
            type: 'success',
            title: 'Completaste el proyecto!',
            text: 'Felicidades, has terminado tus tareas.'
        });
    }

    }
};