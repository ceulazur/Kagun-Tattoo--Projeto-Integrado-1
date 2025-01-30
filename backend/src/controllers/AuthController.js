import Controller from './Controller.js';
import AuthService from '../services/AuthService.js';

class AuthController extends Controller {
    constructor(){
        super(AuthService);

        // Bindando todos os métodos automaticamente
        Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((method) => {
            if (typeof this[method] === 'function' && method !== 'constructor') {
                this[method] = this[method].bind(this);
            }
        });
    }

    // Sobscreve o método genérico pra usar a lógica personalizada
    async cadastrar(req, res, next){
        try {
            const tatuador = await this.service.cadastrarTatuador(req.body);

            return res.status(201).json({ mensagem: 'Tatuador cadastrado com sucesso.', tatuador });
        } catch (erro) {
            next(erro);
        }
    }

    async login(req, res, next){
        try {
            const { token, tatuador } = await this.service.logarTatuador(req.body);
            
            return res.status(200).json({ token, mensagem: 'Login realizado com sucesso.', tatuador });
        } catch (erro) {
            next(erro);
        }
    }
}

export default new AuthController();
