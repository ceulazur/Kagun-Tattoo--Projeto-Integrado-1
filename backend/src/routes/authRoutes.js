import express from 'express';
import { cadastrarTatuador, logarTatuador } from '../controllers/authController.js';

const router = express.Router();

router.get('/', () => {
    res.json({ mensagem: 'teste' })
})
router.post('/cadastro', cadastrarTatuador);
router.post('/login', logarTatuador);

export default router;
