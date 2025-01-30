import Controller from './Controller.js';
import TatuadorService from '../services/TatuadorService.js';

class TatuadorController extends Controller {
    constructor() {
        super(TatuadorService);

        // Bindando os métodos automaticamente
        Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((method) => {
            if (typeof this[method] === 'function' && method !== 'constructor') {
                this[method] = this[method].bind(this);
            }
        });
    }

    async cadastrarTatuador(req, res, next) {
        try {
            const tatuador = await this.service.cadastrarTatuador(req.body);
            return res.status(201).json({ mensagem: 'Tatuador cadastrado com sucesso.', tatuador });
        } catch (erro) {
            next(erro);
        }
    }

    async listarTatuadores(req, res, next) {
        try {
            const tatuadores = await this.service.listarTatuadores(req.query);
            return res.status(200).json(tatuadores);
        } catch (erro) {
            next(erro);
        }
    }

    async buscarTatuadorPorId(req, res, next) {
        try {
            const { id } = req.params;
            const tatuador = await this.service.buscarTatuadorPorId(Number(id));
            return res.status(200).json(tatuador);
        } catch (erro) {
            next(erro);
        }
    }

    async atualizarTatuador(req, res, next) {
        try {
            const { id } = req.params;
            const tatuadorAtualizado = await this.service.atualizarTatuador(Number(id), req.body);
            return res.status(200).json({ mensagem: 'Tatuador atualizado com sucesso.', tatuadorAtualizado });
        } catch (erro) {
            next(erro);
        }
    }

    async excluirTatuador(req, res, next) {
        try {
            const { id } = req.params;
            await this.service.excluirTatuador(Number(id));
            return res.status(200).json({ mensagem: 'Tatuador excluído com sucesso.' });
        } catch (erro) {
            next(erro);
        }
    }
}

export default new TatuadorController();
