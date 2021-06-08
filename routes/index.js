//Requirimos express
const express = require('express');

//Requerimos express-validator
const { body } = require('express-validator'); // Chequea el body de los que enviamos al servidor

//Requerimos modulos Controllers
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

//Requerimos un metodo de express ROUTER
const router = express.Router();

// Rutas para el home
router.get('/', 
    authController.usuarioAutenticado, //Verificamos si el usuario esta autenticado
    proyectosController.proyectosHome
);

router.get('/nuevo-proyecto', 
    authController.usuarioAutenticado, //Verificamos si el usuario esta autenticado
    proyectosController.formularioProyecto
);

router.post('/nuevo-proyecto',
    authController.usuarioAutenticado, //Verificamos si el usuario esta autenticado
    //Sanitizamos nombre que proviene del form nuevo proyecto
    body('nombre').not().isEmpty().trim().escape(),
    proyectosController.nuevoProyecto
);

// Ruta para listar proyecto 
router.get('/proyectos/:url', 
    authController.usuarioAutenticado, //Verificamos si el usuario esta autenticado
    proyectosController.proyectoPorUrl
);

//Ruta para actualizar proyecto
router.get('/proyecto/editar/:id', 
    authController.usuarioAutenticado, //Verificamos si el usuario esta autenticado
    proyectosController.formularioEditar
);
router.post('/nuevo-proyecto/:id', 
    authController.usuarioAutenticado, //Verificamos si el usuario esta autenticado
    //Sanitizamos nombre que proviene del form  proyecto
    body('nombre').not().isEmpty().trim().escape(),
    proyectosController.actualizarProyecto
); 

//Ruta para eliminar proyecto
router.delete('/proyectos/:url', 
    authController.usuarioAutenticado, //Verificamos si el usuario esta autenticado
    proyectosController.eliminarProyecto
);

//Rutas de Tareas
//Agregar una tarea
router.post('/proyectos/:url', 
    authController.usuarioAutenticado, //Verificamos si el usuario esta autenticado
    tareasController.agregarTarea
);
//Actualizar una tarea
router.patch('/tareas/:id', 
    authController.usuarioAutenticado, //Verificamos si el usuario esta autenticado     
    tareasController.cambiarEstadoTarea
);
//Eliminar una tarea
router.delete('/tareas/:id', 
    authController.usuarioAutenticado, //Verificamos si el usuario esta autenticado
    tareasController.eliminarTarea
);

//Rutas Usuarios
//Crear nueva cuenta
router.get('/crear-cuenta', usuariosController.formCrearCuenta);
router.post('/crear-cuenta', usuariosController.crearCuenta);
router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

//Iniciar Sesión
router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
router.post('/iniciar-sesion', authController.autenticarUsuario);

//Cerrar Sesion
router.get('/cerrar-sesion', authController.cerrarSesion);

//Restablecer contraseña
router.get('/restablecer-password', usuariosController.formRestablecerPassword);
router.post('/restablecer-password', authController.enviarToken);
router.get('/restablecer-password/:token', authController.validarToken);
router.post('/restablecer-password/:token', authController.actualizarPaswword);

//Exportamos el modulo de rutas
module.exports = router;