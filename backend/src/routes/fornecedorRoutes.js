import express from 'express';
import FornecedorController from '../controllers/FornecedorController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import paginatorMiddleware from '../middlewares/paginatorMiddleware.js';

const router = express.Router();

router.post('/cadastrar', authMiddleware, FornecedorController.cadastrarFornecedor);
router.get('/listar', authMiddleware, paginatorMiddleware, FornecedorController.listarFornecedores);
router.get('/:id', authMiddleware, FornecedorController.buscarFornecedorPorId);
router.put('/:id', authMiddleware, FornecedorController.atualizarFornecedor);
router.delete('/:id', authMiddleware, FornecedorController.excluirFornecedor);

export default router;
