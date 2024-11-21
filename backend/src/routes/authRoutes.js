import express from 'express';
import { cadastrarTatuador } from '../controllers/authController.js';

const router = express.Router();

router.post('/cadastro', cadastrarTatuador);

export default router;
