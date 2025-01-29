import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/config.js';

// Autentica o usuário
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization; // Cabeçalho de Autorização

    // Verifica se o cabeçalho "Authorization" existe e se começa com "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ mensagem: 'Token não fornecido ou inválido.' });
    }

    // Extrai o token JWT (removendo o "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // Verifica se o token é válido e decodifica os dados contidos nele
        const dadosDecodificados = jwt.verify(token, jwtSecret);

        // Adiciona o ID do tatuador à requisição para ser acessado nas rotas protegidas
        req.usuario = { idTatuador: dadosDecodificados.id };

        // Continua para o próximo middleware ou controlador
        next();
    } catch (erro) {
        return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
    }
};

export default authMiddleware;
