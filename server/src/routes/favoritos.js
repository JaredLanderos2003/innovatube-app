import { Router } from 'express';
import { agregarFavorito, misFavoritos, eliminarFavorito } from '../controllers/controladorFavoritos.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', verificarToken, agregarFavorito);
router.get('/', verificarToken, misFavoritos);
router.delete('/:id', verificarToken, eliminarFavorito);

export default router;