import axios from "axios";
import Swal from 'sweetalert2';
import { actualizarAvance } from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if(tareas){
    tareas.addEventListener('click', e => {
        // Cambia estado de la tarea
        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;   
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            
            //Request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;

            axios.patch(url, { idTarea } )
                .then(function(respuesta){
                    if(respuesta.status === 200) {
                        icono.classList.toggle('completo');
                        
                        actualizarAvance();
                    }  
                })

        };
        // Elimina la tarea
        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement;   
            const idTarea = tareaHTML.dataset.tarea;

            // Sweet alert confirmacion Delete
            Swal.fire({
                title: 'Estás seguro que deseas eliminar esta tarea?',
                text: "Esta acción no será reversible!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminarla!',
                cancelButtonText: 'No, cancelar!'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Enviar petición a Axios
                    const url = `${location.origin}/tareas/${idTarea}`; //armamos la url para la peticion
                    axios.delete(url, {params: { idTarea }} )
                        .then(function(respuesta){
                            if(respuesta.status === 200) {
                                // eliminamos el nodo del ul(lista de tareas) 
                                tareaHTML.parentElement.removeChild(tareaHTML);

                                //Infomamos que se realizó la eliminacion
                                Swal.fire(
                                    'Tarea eliminada!',
                                    respuesta.data, // Proviene del controlador "eliminarTarea" desde res.send
                                    'success'
                                );
                                
                                actualizarAvance();
                            }     
                        })
                        .catch(() => {
                            Swal.fire({
                                type: 'error',
                                title: 'Hubo un error',
                                text: 'No se pudo eliminar la Tarea'
                            })
                        })
                }
            })

            
        }
    });
}

export default tareas;
