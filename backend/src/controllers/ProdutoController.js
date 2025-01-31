import Controller from './Controller.js';
import ProdutoService from '../services/ProdutoService.js';

class ProdutoController extends Controller {
    constructor() {
        super(ProdutoService);

        Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((method) => {
            if (typeof this[method] === 'function' && method !== 'constructor') {
                this[method] = this[method].bind(this);
            }
        });
    }

    async cadastrarProduto(req, res, next) {
        try {
            const produto = await this.service.cadastrarProduto(req.body);

            return res.status(201).json({ mensagem: 'Produto cadastrado com sucesso.', produto });
        } catch (erro) {
            next(erro);
        }
    }

    async listarProdutos(req, res, next) {
        try {
            const produtos = await this.service.listarProdutos(req.query);

            return res.status(200).json(produtos);
        } catch (erro) {
            next(erro);
        }
    }

    async buscarProdutoPorId(req, res, next) {
        try {
            const { id } = req.params;

            const produto = await this.service.buscarProdutoPorId(Number(id));

            return res.status(200).json(produto);
        } catch (erro) {
            next(erro);
        }
    }

    async atualizarProduto(req, res, next) {
        try {
            const { id } = req.params;

            const produtoAtualizado = await this.service.atualizarProduto(Number(id), req.body);

            return res.status(200).json({ mensagem: 'Produto atualizado com sucesso.', produtoAtualizado });
        } catch (erro) {
            next(erro);
        }
    }

    async excluirProduto(req, res, next) {
        try {
            const { id } = req.params;
            const { forcarExclusao = false } = req.query;

            await this.service.excluirProduto(Number(id), forcarExclusao === 'true');

            return res.status(200).json({ mensagem: 'Produto excluído com sucesso.' });
        } catch (erro) {
            next(erro);
        }
    }
}

export default new ProdutoController();
