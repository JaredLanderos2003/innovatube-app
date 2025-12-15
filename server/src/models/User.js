import { DataTypes } from 'sequelize';
import conexion from '../config/database.js'; //conexión
import bcrypt from 'bcrypt';

const Usuario = conexion.define('Usuario', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nombreUsuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  contrasena: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Encriptacion antes de guardar
Usuario.beforeCreate(async (usuario) => {
  const salt = await bcrypt.genSalt(10);
  usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
});

// Verificador de la contraseña
Usuario.prototype.validarContrasena = async function (passwordIngresado) {
  return await bcrypt.compare(passwordIngresado, this.contrasena);
};

export default Usuario;