import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ mensaje: 'No tienes permiso. Inicia sesión.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_temporal');
    req.usuarioId = decoded.id;
    next();
    
  } catch (error) {
    console.log("Error verificando token:", error.message);
    return res.status(401).json({ mensaje: 'Token inválido o expirado.' });
  }
};