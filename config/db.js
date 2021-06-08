const { Sequelize } = require('sequelize');
const dotenv = require('dotenv').config({ path: 'variables.env'}); //Extrae valores de variables.env

// Option 2: Passing parameters separately (other dialects)
const db = new Sequelize(
  process.env.BD_NOMBRE, 
  process.env.BD_USER, 
  process.env.BD_PASS, 
  {
    host: process.env.BD_HOST,
    port: process.env.BD_PORT, //puerto del xamp
    dialect: 'mysql',
    define:{
      timestamps: false
    }
  }
); 

module.exports = db;