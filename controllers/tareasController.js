//Requerimos el modelo
//const { findAll, findOne, destroy } = require('../models/Tareas');
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

// Definimos el controlador Tareas
const tareasController = {};

//Definimos los metodos del controlador
tareasController.agregarTarea = async (req, res, next) => {
    // Obtenemos el proyecto actual
    const proyecto = await Proyectos.findOne({ where: { url: req.params.url }});

    // Leemos el valor del input de tareas
    const {tarea} = req.body;
    
    // Inicializamos el estado de la tarea
    const estado = 0; // Tarea Incompleta
    const proyectoId = proyecto.id;

    //Insertar en la bd y redireccionar
    const resultado = await Tareas.create({
        tarea, 
        estado, 
        proyectoId
    });

    // Si no hay resultado(no se crea tarea)
    if(!resultado){
        return next();
    }

    //Redireccionamos
    res.redirect(`/proyectos/${ req.params.url }`);
}

// Cambiar estado tarea
tareasController.cambiarEstadoTarea = async (req, res) => {
    //Capturamos el Id de la tarea del proyecto Seleccionado
    const { id } = req.params;
    const tarea = await Tareas.findOne({ where: { id }});

    //Cambiamos el estado
    let estado = 0;
    if (tarea.estado == estado){
        estado = 1;   
    }
    tarea.estado = estado; 

    const resultado = await tarea.save();
    
    if (!resultado) return next();

    res.status(200).send('Actualizado');

}

// Elimina tarea
tareasController.eliminarTarea = async (req, res) => {
    //Capturamos el Id de la tarea del proyecto Seleccionado
    const { id } = req.params;
    
    //Eliminamos la tarea
    const resultado = await Tareas.destroy({ where: {id} });
    
    if (!resultado) return next();

    res.status(200).send('Eliminada correctamente');

}

module.exports = tareasController;