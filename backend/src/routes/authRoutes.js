import express from 'express';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

router.post('/cadastro', AuthController.cadastrarTatuador);
router.post('/login',    AuthController.loginTatuador);

export default router;
