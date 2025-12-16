import { Router } from 'express';
import { registrarUsuario, iniciarSesion, solicitarRecuperacion, restablecerContrasena } from '../controllers/auth.js';

const router = Router();


router.post('/registro', registrarUsuario);
router.post('/login', iniciarSesion);
router.post('/recuperar', solicitarRecuperacion);
router.post('/restablecer/:token', restablecerContrasena);

export default router;