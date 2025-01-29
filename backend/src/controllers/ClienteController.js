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

    async cadastrar(req, res) {
        try {
            const cliente = await this.service.cadastrarCliente(req.body);

            return res.status(201).json({ mensagem: 'Cliente cadastrado com sucesso.', cliente });
        } catch (erro) {
            return res.status(400).json({ mensagem: erro.message });
        }
    }

    async listar(req, res) {
        try {
            const clientes = await this.service.listarClientes(req.query);

            return res.status(200).json(clientes);
        } catch (erro) {
            return res.status(400).json({ mensagem: erro.message });
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            const cliente = await this.service.buscarClientePorId(Number(id));

            if (!cliente) return res.status(404).json({ mensagem: 'Cliente não encontrado.' });

            return res.status(200).json(cliente);
        } catch (erro) {
            return res.status(400).json({ mensagem: erro.message });
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;

            const clienteAtualizado = await this.service.atualizarCliente(Number(id), req.body);

            if (!clienteAtualizado) return res.status(404).json({ mensagem: "Cliente não encontrado." });

            return res.status(200).json({ mensagem: 'Cliente atualizado com sucesso.', clienteAtualizado });
        } catch (erro) {
            return res.status(400).json({ mensagem: erro.message });
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params;

            const clienteExcluido = await this.service.excluirCliente(Number(id));
    
            if (!clienteExcluido) return res.status(404).json({ mensagem: "Cliente não encontrado." });
    
            return res.status(200).json({ mensagem: "Cliente excluído com sucesso." });
        } catch (erro) {
            return res.status(400).json({ mensagem: erro.message });
        }
    }
}

export default new ClienteController();
