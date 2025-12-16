import { DataTypes } from 'sequelize';
import conexion from '../config/database.js';
import Usuario from './User.js';

const Favorito = conexion.define('Favorito', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  videoId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT, 
    allowNull: true
  },
  imagenUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  usuarioId: {
    type: DataTypes.UUID,
    allowNull: false
  }
});
Favorito.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Usuario.hasMany(Favorito, { foreignKey: 'usuarioId' });

export default Favorito;