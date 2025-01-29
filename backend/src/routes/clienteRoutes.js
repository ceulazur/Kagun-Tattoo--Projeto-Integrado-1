import express from 'express';
import ClienteController from '../controllers/ClienteController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import paginatorMiddleware from '../middlewares/paginatorMiddleware.js';

const router = express.Router();

router.post('/cadastrar', authMiddleware, ClienteController.cadastrar);
router.get('/listar',     authMiddleware, paginatorMiddleware, ClienteController.listar);
router.get('/:id',        authMiddleware, ClienteController.buscarPorId);
router.put('/:id',        authMiddleware, ClienteController.atualizar);
router.delete('/:id',     authMiddleware, ClienteController.excluir);

export default router;
