//Requerimos Passport
const passport = require('passport');
const { findOne } = require('../models/Usuarios');
// Requerimos el modelo de usuarios
const Usuarios = require('../models/Usuarios');
//Requerimos Crypto para generar tokens
const crypto = require('crypto'); 
const { Sequelize } = require('../config/db');
//Requerimos los operadores de Sequelize
const Op = Sequelize.Op;
//Requerimos Bcrypt para encriptar las nuevas passwords
const bcrypt = require('bcrypt-nodejs');
//Requerimos el handler de Emails
const enviarEmail = require('../handlers/email');

//Definimos el controlador
const authController = {}

//Definimos los metodos del controlador

authController.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true, //Activa los mensajes de connect-flash
    badRequestMessage: 'Ambos Campos Obligatorios'

});

//Funcion para verificar si el usuario esta logueado o no
authController.usuarioAutenticado = (req, res, next) => {
    //Si esta autenticado
    if(req.isAuthenticated()){
        return next();
    }else{
        //No esta autenticado, redirige al form de iniciar sesion
        return res.redirect('/iniciar-sesion');
    }
}

//Cerrar sesion
authController.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); // Al cerrar session, nos redirige al inicio de sesion
    });
}

//Genera un Token si el usuario es válido, para restablecimiento de contraseña
authController.enviarToken = async (req, res) =>{
    //verificar que el usuario existe
    const { email } = req.body;
    const usuario = await Usuarios.findOne({ where: { email }});

    //Si NO existe el usuario
    if (!usuario) {
        req.flash('error', 'Cuenta inexistente!');
        res.redirect('/restablecer-password');
    }

    //Si el usuario EXISTE, generamos y asignamos al objeto usuario 
    //un token y la expiracion del mismo, 
    //luego los insertamos en la base de datos
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000; // expiracion por 1 hora = 3600000

    //Guardamos en la base de datos
    await usuario.save();

    //URL de reset
    const resetUrl = `http://${req.headers.host}/restablecer-password/${usuario.token}`;
    
    //Envia el correo de restablecimiento de password
    await enviarEmail.enviar({
        usuario,
        subject: 'Reset de password',
        resetUrl,
        archivo: 'restablecer-password' 
    });

    //Terminar
    req.flash('correcto', 'Se ha enviado un mensaje a su email');
    res.redirect('/iniciar-sesion');
}

//Validacion de token generado
authController.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({ 
        where: { token: req.params.token}
    });
    //sino encuentra el usuario con el token dado
    if(!usuario){
        req.flash('error', 'No válido');
        res.redirect('/restablecer-password');
    }
    //Formulario para Reset Password
    res.render('resetPassword',{
        nombrePagina: 'Restablecer Contraseña',
    })
}

//Restablece el password
authController.actualizarPaswword = async (req, res) => {
    //Verificamos el token válido y la fecha de expiración
    const usuario = await Usuarios.findOne({
        where: { 
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now() //Comparamos si expiracion en mayor o igual a Date.now
            }
        }
    });

    // Si el usuario NO existe
    if(!usuario){
        req.flash('error', 'No válido');
        res.redirect('/restablecer-password');
    }

    //Si el usuario EXISTE, hasheamos la nueva password
    const nuevaPassword = req.body.password;
    usuario.password = bcrypt.hashSync(nuevaPassword, bcrypt.genSaltSync(10));
    //Anulamos el token y expiracion del usuario
    usuario.token = null;
    usuario.expiracion = null;
    //Guardamos el nuevo password
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');

}

module.exports = authController;