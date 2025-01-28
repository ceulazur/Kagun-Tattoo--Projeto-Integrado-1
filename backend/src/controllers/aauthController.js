import AuthService from '../services/AuthService.js';

class AuthController {
    async cadastrarTatuador(req, res){
        try {
            const tatuador = await AuthService.cadastrarTatuador(req.body);
            return res.status(201).json({ mensagem: 'Tatuador cadastrado com sucesso.', tatuador });
        } catch (erro) {
            return res.status(400).json({ mensagem: erro.message });
        }
    }

    async logarTatuador(req, res){
        try {
            const { token, tatuador } = await AuthService.logarTatuador(req.body);
            return res.status(200).json({ token, mensagem: 'Login realizado com sucesso.', tatuador });
        } catch (erro) {
            return res.status(400).json({ mensagem: erro.message });
        }
    }
}

export default new AuthController();
