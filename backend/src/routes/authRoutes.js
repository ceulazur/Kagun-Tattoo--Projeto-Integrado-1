import express from 'express';
import AuthController from '../controllers/aauthController.js';

const router = express.Router();

router.post('/cadastro', AuthController.cadastrarTatuador);
router.post('/login',    AuthController.logarTatuador);

export default router;
