//Requerimos Passport y la estrategia de autenticacion local
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Establecemos la referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

// Local strategy - Login con credenciales propias (usuario y password)
passport.use(
    new LocalStrategy(
        //Por default passport espera un usuario y password
        //pero nosostros tenemos email y password, por lo que
        // reescribiremos la configuracion por defecto
        {
            usernameField: 'email',  // por defecto aqui recibe un username
            passwordField: 'password'
        },
        // Aqui se realiza la consulta a la base de datos
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({ 
                    where: { 
                        email,
                        activo: 1 //Pueden ingresar el usuario que confirmo la cuenta
                    } 
                });
                //El usuario existe, pero el password es incorrecto
                if(!usuario.verificarPassword(password)) {
                    // Esa password no es correcta
                    return done(null, false, {
                        message: 'Password Incorrecta!'
                    });    
                }
                //El email existe y la password existe, entonces retornamos el usuario
                return done(null, usuario);

            } catch (error) {
                // Ese usuario no existe
                return done(null, false, {
                    message: 'Cuenta Inexistente!'
                });    
            }
        }

    )
)
// Serializar el usuario 
passport.serializeUser((usuario, callback)=>{
    callback(null, usuario);
});

// Deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport;