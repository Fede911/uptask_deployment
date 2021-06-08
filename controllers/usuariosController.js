//Requerimos el modelo
const Usuarios = require('../models/Usuarios');
//Requerimos la funcion enviarEmail
const enviarEmail = require('../handlers/email');


//Definimos el controlador
const usuariosController = {}

//Definimos los metodos del controlador
//Crear Cuenta de usuario
usuariosController.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en UpTask'
    })
}
usuariosController.crearCuenta = async(req, res) => {
    //Capturar los datos
    const { email, password } = req.body;
    try {
        //Creamos usuario
        await Usuarios.create({
            email,
            password
        })
        //Creamos una Url de confirmacion de usuario
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
        
        //Creamos el objeto usuario
        const usuario = {
            email
        }

        //Envia el correo de confirmacion de usuario
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirmacón de Cuenta Nueva en UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta' 
        });

        //Redirigimos al usuario
        req.flash('correcto', 'Email de confirmación enviado')
        res.redirect('/iniciar-sesion');

    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(), //Error enviado por Sequelize
            nombrePagina: 'Crear Cuenta en UpTask',
            email,
            password
        })
    }
}

//Confirmar cuenta nueva cambiando el estado de una cuenta de usuario
usuariosController.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({ 
        where: { 
            email:req.params.correo 
        }
    });
    //Si NO existe el usuario(correo)
    if(!usuario){
       req.flash('error', 'No valiado');
       res.redirect('/crear-cuenta'); 

    }
    //Si EXISTE el correo, cambiamos el estado a 1(ACTIVO)
    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');

}

// Iniciar sesión
usuariosController.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes; 
    res.render('iniciarSesion', {
        nombrePagina: 'Inicia Sesion en UpTask',
        error 
    })
}

//Restablecer Password
usuariosController.formRestablecerPassword = (req, res) => {
    res.render('restablecerPassword', {
        nombrePagina: 'Restablecer tu Password'  
    })    
}

module.exports = usuariosController;