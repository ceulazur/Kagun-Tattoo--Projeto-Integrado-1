import Controller from './Controller.js';
import FornecedorService from '../services/FornecedorService.js';

class FornecedorController extends Controller {
    constructor() {
        super(FornecedorService);

        Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((method) => {
            if (typeof this[method] === 'function' && method !== 'constructor') {
                this[method] = this[method].bind(this);
            }
        });
    }

    async cadastrarFornecedor(req, res, next) {
        try {
            const fornecedor = await this.service.cadastrarFornecedor(req.body);

            return res.status(201).json({ mensagem: 'Fornecedor cadastrado com sucesso.', fornecedor });
        } catch (erro) {
            next(erro);
        }
    }

    async listarFornecedores(req, res, next) {
        try {
            const fornecedores = await this.service.listarFornecedores(req.query);

            return res.status(200).json(fornecedores);
        } catch (erro) {
            next(erro);
        }
    }

    async buscarFornecedorPorId(req, res, next) {
        try {
            const { id } = req.params;

            const fornecedor = await this.service.buscarFornecedorPorId(Number(id));

            return res.status(200).json(fornecedor);
        } catch (erro) {
            next(erro);
        }
    }

    async atualizarFornecedor(req, res, next) {
        try {
            const { id } = req.params;

            const fornecedorAtualizado = await this.service.atualizarFornecedor(Number(id), req.body);

            return res.status(200).json({ mensagem: 'Fornecedor atualizado com sucesso.', fornecedorAtualizado });
        } catch (erro) {
            next(erro);
        }
    }

    async excluirFornecedor(req, res, next) {
        try {
            const { id } = req.params;

            await this.service.excluirFornecedor(Number(id));

            return res.status(200).json({ mensagem: 'Fornecedor excluído com sucesso.' });
        } catch (erro) {
            next(erro);
        }
    }
}

export default new FornecedorController();
