import Service from './Service.js';
import BadRequestError from '../errors/BadRequestError.js';
import ConflictError from '../errors/ConflictError.js';

class FornecedorService extends Service {
    constructor() {
        super('fornecedor');
    }

    async cadastrarFornecedor({ nome, telefone, email }) {
        if (!nome || !telefone || !email)
            throw new BadRequestError('Todos os campos são obrigatórios.');

        // Verifica se telefone ou e-mail já estão cadastrados
        const telefoneExiste = await this.buscarRegistroPorCampo({ telefone }, {}, false);
        const emailExiste    = await this.buscarRegistroPorCampo({ email }, {}, false);

        if (telefoneExiste) throw new ConflictError('Telefone já cadastrado.');
        if (emailExiste)    throw new ConflictError('E-mail já cadastrado.');

        return this.criarRegistro({ nome, telefone, email });
    }

    async listarFornecedores(filtros = {}, paginacao = {}) {
        return this.listarRegistros(filtros, {
            include: { produtos: true },
            orderBy: { nome: 'asc' },
            ...paginacao
        });
    }    

    async buscarFornecedorPorId(id) {
        return this.buscarRegistroPorId(id, {
            include: { produtos: true } // Inclui os produtos associados
        });
    }

    async atualizarFornecedor(id, dadosAtualizados) {
        if (Object.keys(dadosAtualizados).length === 0)
            throw new BadRequestError('Nenhuma informação foi fornecida para atualização.');

        return this.atualizarRegistro(id, dadosAtualizados);
    }

    async excluirFornecedor(id) {
        return this.excluirRegistro(id);
    }
}

export default new FornecedorService();
