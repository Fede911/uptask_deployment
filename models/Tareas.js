//Requerimos el ORM Sequelize
const { Sequelize } = require('sequelize');

//Requerimos el archivo de configuracion del Orm Sequelize
const db = require('../config/db');
const Proyectos = require('./Proyectos'); //importamos el modelo Proyectos para relacionarlo con las tareas
//Definimos el modelo Tareas
const Tareas = db.define('tareas', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    tarea:{
        type: Sequelize.STRING(100)
    },
    
    estado:{
        type: Sequelize.INTEGER(1)
    }
});
// Creamos claves foraneas para vincular Tareas y proyectos 
//(tambien podemos usar "Proyectos.hasMany(Tareas)" pero iria en el modelo Proyectos)
Tareas.belongsTo(Proyectos); // Una tarea "pertenece a(belongsTo) o va a tener" un Proyecto

module.exports = Tareas;