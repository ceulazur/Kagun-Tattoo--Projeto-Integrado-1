import express from 'express';
import TatuadorController from '../controllers/TatuadorController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import paginatorMiddleware from '../middlewares/paginatorMiddleware.js';

const router = express.Router();

router.post('/cadastrar', TatuadorController.cadastrarTatuador);
router.get('/listar', authMiddleware, paginatorMiddleware, TatuadorController.listarTatuadores);
router.get('/:id', authMiddleware, TatuadorController.buscarTatuadorPorId);
router.put('/:id', authMiddleware, TatuadorController.atualizarTatuador);
router.delete('/:id', authMiddleware, TatuadorController.excluirTatuador);

export default router;
