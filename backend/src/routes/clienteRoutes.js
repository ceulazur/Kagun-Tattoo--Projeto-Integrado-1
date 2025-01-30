import express from 'express';
import ClienteController from '../controllers/ClienteController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import paginatorMiddleware from '../middlewares/paginatorMiddleware.js';

const router = express.Router();

router.post('/cadastrar', authMiddleware, ClienteController.cadastrarCliente);
router.get('/listar',     authMiddleware, paginatorMiddleware, ClienteController.listarClientes);
router.get('/:id',        authMiddleware, ClienteController.buscarClientePorId);
router.put('/:id',        authMiddleware, ClienteController.atualizarCliente);
router.delete('/:id',     authMiddleware, ClienteController.excluirCliente);

export default router;
