import express from 'express';
import authRoutes from './authRoutes.js';
import tatuadorRoutes from './tatuadorRoutes.js';
import clientesRoutes from './clienteRoutes.js';
import sessaoRoutes from './sessaoRoutes.js';
import produtoRoutes from './produtoRoutes.js';

const router = express.Router();

// Define as rotas principais
router.use('/auth', authRoutes);
router.use('/tatuadores', tatuadorRoutes);
router.use('/clientes', clientesRoutes);
router.use('/sessoes', sessaoRoutes);
router.use('/produtos', produtoRoutes);

export default router;
