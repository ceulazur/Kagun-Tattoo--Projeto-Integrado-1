import Controller from './Controller.js';
import ClienteService from '../services/ClienteService.js';

class ClienteController extends Controller {
    constructor() {
        super(ClienteService);

        // Bindando os métodos
        Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((method) => {
            if (typeof this[method] === 'function' && method !== 'constructor') {
                this[method] = this[method].bind(this);
            }
        });
    }

    async cadastrar(req, res, next) {
        try {
            const cliente = await this.service.cadastrarCliente(req.body);

            return res.status(201).json({ mensagem: 'Cliente cadastrado com sucesso.', cliente });
        } catch (erro) {
            next(erro);
        }
    }

    async listar(req, res, next) {
        try {
            const clientes = await this.service.listarClientes(req.query);

            return res.status(200).json(clientes);
        } catch (erro) {
            next(erro);
        }
    }

    async buscarPorId(req, res, next) {
        try {
            const { id } = req.params;

            const cliente = await this.service.buscarClientePorId(Number(id));

            return res.status(200).json(cliente);
        } catch (erro) {
            next(erro);
        }
    }

    async atualizar(req, res, next) {
        try {
            const { id } = req.params;

            const clienteAtualizado = await this.service.atualizarCliente(Number(id), req.body);

            return res.status(200).json({ mensagem: 'Cliente atualizado com sucesso.', clienteAtualizado });
        } catch (erro) {
            next(erro);
        }
    }

    async excluir(req, res, next) {
        try {
            const { id } = req.params;

            await this.service.excluirCliente(Number(id));
    
            return res.status(200).json({ mensagem: "Cliente excluído com sucesso." });
        } catch (erro) {
            next(erro);
        }
    }
}

export default new ClienteController();
