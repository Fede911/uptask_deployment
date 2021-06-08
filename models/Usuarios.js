const Sequelize = require('Sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos'); //importamos el modelo Proyectos para relacionarlo con los usuarios
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false, //campo no permitido el vacio 
        validate: {
            isEmail: {
                msg: 'Agrega un correo válido'
            },
            notEmpty: {
                msg: 'El email no puede ir vacío'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado' 
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false, //campo no permitido el vacio
        validate: {
            notEmpty: {
                msg: 'El password no puede ir vacío'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }, 
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE    
}, {
    hooks: {
        beforeCreate(usuario) {
            //Hasheamos el password
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

//Metodos personalizados
Usuarios.prototype.verificarPassword = function(password){
    //Retorna TRUE O FALSE de la comparación
    return bcrypt.compareSync(password, this.password); //utilizamos metodo de comparacion de bcrypt
}

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;