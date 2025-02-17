import Service from './Service.js';

class ClienteService extends Service {
    constructor() {
        super('cliente');
    }

    async cadastrarCliente({ nome, email, telefone }) {
        if (!nome || !telefone) throw new Error('Nome e telefone são obrigatórios.');
        
        const telefoneExiste = await this.buscarRegistroPorCampo({ telefone }, {}, false);
        if (telefoneExiste) throw new Error('Telefone já cadastrado.');

        return this.criarRegistro({ nome, email, telefone });
    }

    async listarClientes(filtros = {}, paginacao = {}) {
        return this.listarRegistros(filtros, { orderBy: { nome: 'asc' }, ...paginacao });
    }

    async buscarClientePorId(id) {
        return this.buscarRegistroPorId(id);
    }

    async atualizarCliente(id, dadosAtualizados) {
        if (Object.keys(dadosAtualizados).length === 0)
            throw new Error('Nenhuma informação foi fornecida para atualização.');
    
        const clienteAtual = await this.buscarRegistroPorId(id);
        const dadosSaoIguais = Object.keys(dadosAtualizados).every(
            (key) => clienteAtual[key] === dadosAtualizados[key]
        );
        if(dadosSaoIguais) throw new Error('Nenhuma alteração foi feita nos dados.');

        return this.atualizarRegistro(id, dadosAtualizados);
    }

    async excluirCliente(id) {
        return this.excluirRegistro(id);
    }
}

export default new ClienteService();
