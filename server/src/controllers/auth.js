import Usuario from '../models/User.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize'; 

// Nuevo Usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, nombreUsuario, correo, contrasena, confirmarContrasena } = req.body;

    if (contrasena !== confirmarContrasena) {
      return res.status(400).json({ mensaje: 'Las contraseñas no coinciden, checa bien.' });
    }

    const existeUsuario = await Usuario.findOne({
      where: {
        [Op.or]: [{ correo: correo }, { nombreUsuario: nombreUsuario }]
      }
    });

    if (existeUsuario) {
      return res.status(400).json({ mensaje: 'Estas credenciales ya estan registradas.' });
    }

    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      nombreUsuario,
      correo,
      contrasena
    });

    res.status(201).json({ 
      mensaje: 'Tu usuario se creo correctamente', 
      usuarioId: nuevoUsuario.id 
    });

  } catch (error) {
    console.log('Error en el registro:');
    res.status(500).json({ mensaje: 'Hubo un error al registrarte.', error: error.message });
  }
};

export const iniciarSesion = async (req, res) => {
  try {
    const { identificador, contrasena } = req.body; 

    const usuarioEncontrado = await Usuario.findOne({
      where: {
        [Op.or]: [{ correo: identificador }, { nombreUsuario: identificador }]
      }
    });

    if (!usuarioEncontrado) {
      return res.status(404).json({ mensaje: 'No encontramos este usuario.' });
    }

    const esCorrecta = await usuarioEncontrado.validarContrasena(contrasena);
    if (!esCorrecta) {
      return res.status(401).json({ mensaje: 'Contraseña Incorrecta.' });
    }

    const token = jwt.sign(
      { id: usuarioEncontrado.id, usuario: usuarioEncontrado.nombreUsuario },
      process.env.JWT_SECRET || 'secreto_temporal',
      { expiresIn: '1d' } // 1 dia dura
    );

    res.json({
      mensaje: 'Hola que tal?',
      token,
      usuario: {
        nombre: usuarioEncontrado.nombre,
        usuario: usuarioEncontrado.nombreUsuario
      }
    });

  } catch (error) {
    console.log('Error en el login:');
    res.status(500).json({ mensaje: 'Error del server.' });
  }
};