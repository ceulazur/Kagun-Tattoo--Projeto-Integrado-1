import express from 'express';
import ProdutoController from '../controllers/ProdutoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import paginatorMiddleware from '../middlewares/paginatorMiddleware.js';

const router = express.Router();

router.post('/cadastrar',   authMiddleware, ProdutoController.cadastrarProduto);
router.get('/listar',       authMiddleware, paginatorMiddleware, ProdutoController.listarProdutos);
router.get('/estoqueBaixo', authMiddleware, paginatorMiddleware, ProdutoController.listarProdutosEstoqueBaixo);
router.get('/:id',          authMiddleware, ProdutoController.buscarProdutoPorId);
router.put('/:id',          authMiddleware, ProdutoController.atualizarProduto);
router.delete('/:id',       authMiddleware, ProdutoController.excluirProduto);

export default router;
