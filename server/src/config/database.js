import { Sequelize } from 'sequelize';

// Configuración  para conectar la BD
const conexion = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', 
  logging: false 
});

export default conexion;