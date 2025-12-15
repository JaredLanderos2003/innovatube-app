import { Router } from 'express';
import { registrarUsuario, iniciarSesion } from '../controllers/auth.js';

const router = Router();

//http://localhost:3001/api/auth/registro
router.post('/registro', registrarUsuario);
//http://localhost:3001/api/auth/login
router.post('/login', iniciarSesion);

export default router;