//Requerimos el ORM Sequelize
const { DataTypes } = require('sequelize');

//Requerimos SLUG para formatear la url
const slug = require('slug');

//Requirmos SHORTID para 
const shortid = require('shortid');

//Requerimos el archivo de configuracion del Orm Sequelize
const db = require('../config/db');
//const { report } = require('../routes');

//Definimos el modelo Proyectos
const Proyectos = db.define('proyectos', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    nombre:{
        type: DataTypes.STRING(100),
    },
    
    url:{
        type: DataTypes.STRING
    }
}, {
    hooks: {
        // Antes de crear(insertar) en la base de datos se ejecuta...
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre).toLowerCase();

            proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
});

module.exports = Proyectos;
