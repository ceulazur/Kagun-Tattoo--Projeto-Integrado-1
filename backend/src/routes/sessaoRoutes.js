import express from 'express';
import SessaoController from '../controllers/SessaoController.js';

const router = express.Router();

router.post('/agendar',    SessaoController.agendar);
router.get('/listar',      SessaoController.listarSessoes);
router.get('/:id',         SessaoController.buscarPorId);
router.put('/reagendar',   SessaoController.atualizar);
router.delete('/cancelar', SessaoController.cancelar);

export default router;
