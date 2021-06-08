//Requerimos el modelo
const { findAll, findOne, destroy } = require('../models/Proyectos');
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

//Definimos el controlador
const proyectosController = {}

//Definimos los metodos del controlador
proyectosController.proyectosHome = async (req, res) => {
        // Pasamos el Id del usuario para filtrar los proyectos 
        const usuarioId = res.locals.usuario.id;
        // Buscamos los proyectos del usuario
        const proyectos = await Proyectos.findAll({ 
                where: {usuarioId} 
        });
        //console.log(proyectos.length)
        res.render('index', {
                nombrePagina: 'Proyectos',
                proyectos
        });
}

proyectosController.formularioProyecto = async (req, res) => {
        // Pasamos el Id del usuario para filtrar los proyectos 
        const usuarioId = res.locals.usuario.id;
        // Buscamos los proyectos del usuario
        const proyectos = await Proyectos.findAll({ 
                where: {usuarioId} 
        });
        res.render('nuevoProyecto', {
                nombrePagina: 'Nuevo Proyecto',
                proyectos
        });
}

// Nuevo Proyecto
proyectosController.nuevoProyecto = async (req, res) => {
        // Pasamos el Id del usuario para filtrar los proyectos 
        const usuarioId = res.locals.usuario.id;
        // Buscamos los proyectos del usuario
        const proyectos = await Proyectos.findAll({ 
                where: {usuarioId} 
        });

        const { nombre } = req.body;

        let errores = [];
        // Validamos que la const nombre no sea vacia
        if (!nombre){
                errores.push({'texto': 'Agrega un nombre al Proyecto'})
        }
        // Si hay errores
        if (errores.length > 0){
                res.render('nuevoProyecto', {
                        nombrePagina: 'Nuevo Proyecto',
                        errores,
                        proyectos
                });
        }else{ // NO hay errores, entonces insertamos en la db y mostramos en la vista principal
                const usuarioId = res.locals.usuario.id; // Variable global del proyecto definida en index.js
                const proyecto = await Proyectos.create({
                        nombre,
                        usuarioId
                });

                res.redirect('/');
        }
        
}

proyectosController.proyectoPorUrl = async (req, res, next) => {
        // Pasamos el Id del usuario para filtrar los proyectos 
        const usuarioId = res.locals.usuario.id;
        // Buscamos los proyectos del usuario
        const proyectosPromise = Proyectos.findAll({ 
                where: {usuarioId} 
        });

        const proyectoPromise = Proyectos.findOne( {
                where: {
                        url: req.params.url,
                        usuarioId
                }
        });
        const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

        // Consultar tareas relacionadas al proyecto actual(SELECCIONADO)
        const tareas = await Tareas.findAll({ 
                where: {
                        proyectoId: proyecto.id
                } 
        });

        // si no hay proyectos, retorna siguiente
        if(!proyecto) return next();

        res.render('tareas', {
               nombrePagina: 'Tareas del Proyecto',
               proyectos,
               proyecto,
               tareas
        })
}
// Formulario Editar proyecto
proyectosController.formularioEditar = async (req, res) => {
        // Pasamos el Id del usuario para filtrar los proyectos 
        const usuarioId = res.locals.usuario.id;
        // Buscamos los proyectos del usuario
        const proyectosPromise = Proyectos.findAll({ 
                where: {usuarioId} 
        });

        const proyectoPromise = Proyectos.findOne( {
                where: {
                        id: req.params.id,
                        usuarioId
                }
        });
        const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

        res.render('nuevoProyecto', {
                nombrePagina: 'Editar Proyecto',
                proyectos,
                proyecto
                
         })

}
// Editar Proyecto
proyectosController.actualizarProyecto = async (req, res) => {
        // Pasamos el Id del usuario para filtrar los proyectos 
        const usuarioId = res.locals.usuario.id;
        // Buscamos los proyectos del usuario
        const proyectos = await Proyectos.findAll({ 
                where: {usuarioId} 
        });
        const { nombre } = req.body;
        let errores = [];
        // Validamos que la const nombre no sea vacia
        if (!nombre){
                errores.push({'texto': 'Agrega un nombre al Proyecto'})
        }
        // Si hay errores
        if (errores.length > 0){
                res.render('nuevoProyecto', {
                        nombrePagina: 'Nuevo Proyecto',
                        errores,
                        proyectos
                });
        }else{ // NO hay errores, entonces insertamos en la db y mostramos en la vista principal
                
                const proyecto = await Proyectos.update(
                        { nombre },
                        { where: { id: req.params.id }}
                );
                res.redirect('/');
        }
        
}

// Eliminar proyecto
proyectosController.eliminarProyecto = async (req, res, next) => {
        //req, query o params sirven para leer los datos
        const {urlProyecto} = req.query;

        const resultado = await Proyectos.destroy({ where: { url : urlProyecto } });

        // Si no se pudo eliminar pasa al proximo middleware(NEXT)
        if (!resultado){
                return next();
        }
        
        res.status(200).send('El proyecto ha sido eliminado correctamente.');

}

module.exports = proyectosController;