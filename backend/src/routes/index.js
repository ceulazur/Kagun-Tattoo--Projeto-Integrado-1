import express from 'express';
import authRoutes from './authRoutes.js';
import tatuadorRoutes from './tatuadorRoutes.js';
import clientesRoutes from './clienteRoutes.js';
import sessaoRoutes from './sessaoRoutes.js';
import produtoRoutes from './produtoRoutes.js';
import fornecedorRoutes from './fornecedorRoutes.js';

const router = express.Router();

// Define as rotas principais
router.use('/auth', authRoutes);
router.use('/tatuadores', tatuadorRoutes);
router.use('/clientes', clientesRoutes);
router.use('/sessoes', sessaoRoutes);
router.use('/produtos', produtoRoutes);
router.use('/fornecedores', fornecedorRoutes);

export default router;
