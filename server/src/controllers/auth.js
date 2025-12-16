import Usuario from '../models/User.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize'; 
import axios from 'axios';
import nodemailer from 'nodemailer'; 

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, nombreUsuario, correo, contrasena, confirmarContrasena, recaptchaToken } = req.body;

    if (!recaptchaToken) {
      return res.status(400).json({ mensaje: 'Por favor confirma que no eres un robot' });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const urlGoogle = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
    
    const respuestaGoogle = await axios.post(urlGoogle);
    
    if (!respuestaGoogle.data.success) {
      return res.status(400).json({ mensaje: 'Error de validación de Captcha. Intenta de nuevo.' });
    }

    if (contrasena !== confirmarContrasena) {
      return res.status(400).json({ mensaje: 'Las contraseñas no coinciden, checa bien.' });
    }

    const existeUsuario = await Usuario.findOne({
      where: {
        [Op.or]: [{ correo: correo }, { nombreUsuario: nombreUsuario }]
      }
    });

    if (existeUsuario) {
      return res.status(400).json({ mensaje: 'Estas credenciales ya están registradas.' });
    }

    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      nombreUsuario,
      correo,
      contrasena
    });

    res.status(201).json({ 
      mensaje: 'Tu usuario se creó correctamente', 
      usuarioId: nuevoUsuario.id 
    });

  } catch (error) {
    console.log('Error en el registro:', error);
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
      { expiresIn: '1d' } 
    );

    
    res.cookie("token", token, {
      httpOnly: true, 
      secure: true,  
      sameSite: "none", 
      maxAge: 24 * 60 * 60 * 1000 // 1 día
    });

    res.json({
      mensaje: 'Hola de nuevo',
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

export const solicitarRecuperacion = async (req, res) => {
  try {
    const { correo } = req.body;
    
    const usuario = await Usuario.findOne({ where: { correo } });
    
    if (!usuario) {
      return res.status(200).json({ mensaje: 'Si el correo existe, te hemos enviado instrucciones.' });
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET || 'secreto_temporal', {
      expiresIn: '10m' 
    });

    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const enlace = `${frontendURL}/restablecer/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
      }
    });
    
    const mailOptions = {
      from: '"Soporte InnovaTube" <no-reply@innovatube.com>',
      to: usuario.correo,
      subject: 'Recupera tu contraseña - InnovaTube',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #dc2626; text-align: center;">InnovaTube</h2>
          <p>Hola <strong>${usuario.nombre}</strong>,</p>
          <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
          <p>Haz clic en el siguiente botón para crear una nueva (el enlace expira en 10 minutos):</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${enlace}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Restablecer Contraseña
            </a>
          </div>
          
          <p style="font-size: 12px; color: #888; text-align: center;">Si tú no pediste esto, ignora este correo.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ mensaje: 'Correo enviado. Revisa tu bandeja de entrada.' });

  } catch (error) {
    console.log('Error enviando correo:', error);
    res.status(500).json({ mensaje: 'Error al enviar el correo.' });
  }
};

export const restablecerContrasena = async (req, res) => {
  try {
    const { token } = req.params;
    const { nuevaContrasena } = req.body;
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_temporal');
    } catch (error) {
      return res.status(400).json({ mensaje: 'El enlace ya expiró o no es válido.' });
    }

    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });

    usuario.contrasena = nuevaContrasena;
    await usuario.save();

    res.json({ mensaje: '¡Contraseña actualizada con éxito! Ya puedes iniciar sesión.' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: 'Error al cambiar la contraseña.' });
  }
};