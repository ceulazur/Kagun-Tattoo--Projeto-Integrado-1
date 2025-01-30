import express from 'express';
import SessaoController from '../controllers/SessaoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import paginatorMiddleware from '../middlewares/paginatorMiddleware.js';

const router = express.Router();

router.post('/agendar',        authMiddleware, SessaoController.agendar);
router.get('/listar',          authMiddleware, paginatorMiddleware, SessaoController.listarSessoes);
router.get('/:id',             authMiddleware, SessaoController.buscarPorId);
router.put('/:id',             authMiddleware, SessaoController.atualizar);
router.delete('/cancelar/:id', authMiddleware, SessaoController.cancelar);
router.delete('/excluir/:id',  authMiddleware, SessaoController.excluir);

export default router;
