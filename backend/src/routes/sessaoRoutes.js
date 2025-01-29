import express from 'express';
import SessaoController from '../controllers/SessaoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/agendar',    authMiddleware, SessaoController.agendar);
router.get('/listar',      authMiddleware, SessaoController.listarSessoes);
router.get('/:id',         authMiddleware, SessaoController.buscarPorId);
router.put('/reagendar',   authMiddleware, SessaoController.atualizar);
router.delete('/cancelar', authMiddleware, SessaoController.cancelar);

export default router;
