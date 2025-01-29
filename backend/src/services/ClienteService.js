import Service from './Service.js';

class ClienteService extends Service {
    constructor() {
        super('cliente');
    }

    async cadastrarCliente({ nome, email, telefone }) {
        // Verifica se o telefone já está cadastrado
        const telefoneExiste = await this.buscarRegistroPorCampo({ telefone });
        if (telefoneExiste) throw new Error('Telefone já cadastrado.');

        // Criando o cliente no banco
        return this.criarNovoRegistro({ nome, email, telefone });
    }

    async listarClientes(filtros = {}, paginacao = {}) {
        return this.buscarTodosRegistros(filtros, { orderBy: { nome: 'asc' }, ...paginacao });
    }

    async buscarClientePorId(id) {
        return this.buscarRegistroPorId(id);
    }

    async atualizarCliente(id, dadosAtualizados) {
        return this.atualizarRegistro(id, dadosAtualizados);
    }

    async excluirCliente(id) {
        return this.excluirRegistro(id);
    }
}

export default new ClienteService();
