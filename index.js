//Requerimos express
const express = require('express');
//Requerimos el modulo de rutas
const routes = require('./routes');
// Requerimos body-parser para leer datos del form
const bodyParser = require('body-parser');
// Requerimos path para poder leer la carpeta Views
const path = require('path');
// Requerimos connect-flash 
const flash = require('connect-flash');
//Requerimos cookie-parser
const cookieParser = require('cookie-parser');
//Requerimos express-session
const session = require('express-session');
//Requerimos Passport para las autenticaciones de usuarios
const passport = require('./config/passport');
//Requerimos Dotenv que extrae valores de variables.env
const dotenv = require('dotenv').config({ path: 'variables.env'}); 

//Requerimos HELPERS, funciones utiles
const helpers = require('./helpers');

//Creamos la conexion a la base de datos
const db = require('./config/db');

//Importamos el modelo: Proyectos
const proyectos = require('./models/Proyectos');
const tareas = require('./models/Tareas');
const usuarios = require('./models/Usuarios');

db.sync()
    .then(() => { console.log('Conectado al Servidor Mysql - Port:', db.config.port) })
    .catch(error => { console.log(error) });

//Instanciamos express
const app = express();

//Establecemos la carpeta de archivos estaticos
app.use(express.static('public'));

//Usamos el body parser
app.use(bodyParser.urlencoded({ extended: true }));

//Seteamos el servidor
//app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug'); //Habilitamos el motor de plantillas pug
app.set('views', path.join(__dirname, './views')); //Añadimos carpeta de vistas

//Agregamos flash messages
app.use(flash());

app.use(cookieParser());

//Agregamos el manejo de sesiones que nos permiten navegar entre 
//distintas paginas sin volvernos a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize()); //Instanciamos Passport
app.use(passport.session()); //Utilizamos las sesiones

//Pasar var dump a la app 
app.use((req, res, next) => {
    //console.log(req.user);
    res.locals.vardump = helpers.vardump; //locals crea variables q se puede consumir(utilizar) en cualquier parte 
    res.locals.mensajes = req.flash(); // mensajes flash
    res.locals.usuario = {...req.user} || null; //Guarda el usuario, si esta definido, sino null
    next();
});

//Pasar Fecha (año)
app.use((req, res, next) => {
    const fecha = new Date();
    res.locals.year = fecha.getFullYear(); //locals crea variables q se puede consumir(utilizar) en cualquier parte 
    next();
});


//Ruta principal
app.use('/', routes);

//Iniciamos servidor
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('Servidor en puerto ', port);
});

