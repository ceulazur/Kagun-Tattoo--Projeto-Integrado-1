import express from 'express';
import SessaoController from '../controllers/SessaoController.js';

const router = express.Router();

router.post('/agendar',    SessaoController.agendarSessao);
router.get('/listar',      SessaoController.listarSessoes);
router.get('/:idSessao',   SessaoController.listarSessaoPorId);
router.put('/reagendar',   SessaoController.atualizarSessao);
router.delete('/cancelar', SessaoController.cancelarSessao);

export default router;