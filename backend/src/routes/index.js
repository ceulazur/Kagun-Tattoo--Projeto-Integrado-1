import express from 'express';
import authRoutes from './authRoutes.js';
import tatuadorRoutes from './tatuadorRoutes.js';
import clientesRoutes from './clienteRoutes.js';
import sessaoRoutes from './sessaoRoutes.js';

const router = express.Router();

// Define as rotas principais
router.use('/auth', authRoutes);
router.use('/tatuadores', tatuadorRoutes);
router.use('/clientes', clientesRoutes);
router.use('/sessoes', sessaoRoutes);

export default router;
