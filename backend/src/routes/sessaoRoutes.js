import express from 'express';
import SessaoController from '../controllers/SessaoController.js';

const router = express.Router();

router.get('/listar', SessaoController.listarSessoes);
router.post('/agendar', SessaoController.agendarSessao);
router.put('/reagendar', SessaoController.reagendarSessao);
router.delete('/cancelar', SessaoController.cancelarSessao);

export default router;