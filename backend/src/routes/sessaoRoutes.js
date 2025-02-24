import express from "express";
import SessaoController from "../controllers/SessaoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import paginatorMiddleware from "../middlewares/paginatorMiddleware.js";

const router = express.Router();

router.post("/agendar", authMiddleware, SessaoController.agendarSessao);
router.get(
  "/listar",
  authMiddleware,
  paginatorMiddleware,
  SessaoController.listarSessoes
);
router.get("/:id", authMiddleware, SessaoController.buscarSessaoPorId);
router.put("/:id", authMiddleware, SessaoController.atualizarSessao);
router.delete("/cancelar/:id", authMiddleware, SessaoController.cancelarSessao);
router.delete("/excluir/:id", authMiddleware, SessaoController.excluirSessao);

export default router;
