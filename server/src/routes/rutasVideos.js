import { Router } from 'express';
import { buscarEnYoutube } from '../controllers/controladorVideos.js';

const router = Router();
router.get('/buscar', buscarEnYoutube);
export default router;