const express = require ('express');
const { cadastrarTatuador, logarTatuador } = require ('../controllers/authController.js');

const router = express.Router();

router.post('/cadastro', cadastrarTatuador);
router.post('/login', logarTatuador);

module.exports = router;
