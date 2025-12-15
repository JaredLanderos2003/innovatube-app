import { Sequelize } from 'sequelize';

// Configuración  para conectar a SQLite
const conexion = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Archivo donde se guardan los datos
  logging: false 
});

export default conexion;