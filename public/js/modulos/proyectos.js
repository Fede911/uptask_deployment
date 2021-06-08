// Terminologia ECMA2015
import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');
// si existe el boton eliminar, ejecuta el sweetalert
if (btnEliminar){
    btnEliminar.addEventListener('click', e => {
        // leemos la url del proyecto para realizar la peticion de DELETE
        const urlProyecto = e.target.dataset.proyectoUrl;
        console.log(urlProyecto);
        
        // Sweet alert confirmacion Delete
        Swal.fire({
            title: 'Estás seguro que deseas eliminar el proyecto?',
            text: "Esta acción no será reversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo!',
            cancelButtonText: 'No, cancelar!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Enviar petición a Axios
                const url = `${location.origin}/proyectos/${urlProyecto}`; //armamos la url para la peticion
                axios.delete(url, {params: {urlProyecto}} )
                    .then(function(respuesta){
                        
                        Swal.fire(
                            'Eliminado!',
                            respuesta.data, // Proviene del controlador "eliminarProyecto" desde res.send
                            'success'
                        );
                        // Redireccionar al home
                        setTimeout( () => {
                            window.location.href = '/'
                        }, 3000);    
                    })
                    .catch(() => {
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar el Proyecto'
                        })
                    })
            }
        })
    })
}

export default btnEliminar;

