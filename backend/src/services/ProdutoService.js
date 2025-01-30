import Service from './Service.js';
import BadRequestError from '../errors/BadRequestError.js';
import ConflictError from '../errors/ConflictError.js';
import { DateTime } from 'luxon';

class ProdutoService extends Service {
    constructor() {
        super('produto');
    }

    async cadastrarProduto({ nome, codigo, lote, validade, quantidade, categoria, estoqueMinimo }) {
        if (!nome || !codigo || !lote || !validade || quantidade === undefined || !categoria || estoqueMinimo === undefined)
            throw new BadRequestError('Todos os campos são obrigatórios.');

        const codigoExiste = await this.buscarRegistroPorCampo({ codigo }, {}, false);
        if (codigoExiste) throw new ConflictError('Código do produto já cadastrado.');

        const dataValidade = DateTime.fromISO(validade);
        if (!dataValidade.isValid) throw new BadRequestError('Data de validade inválida.');
        
        return this.criarRegistro({ nome, codigo, lote, validade: dataValidade.toJSDate(), quantidade, categoria, estoqueMinimo });
    }

    async listarProdutos(filtros = {}, paginacao = {}) {
        return this.listarRegistros(filtros, { orderBy: { nome: 'asc' }, ...paginacao });
    }

    async buscarProdutoPorId(id) {
        return this.buscarRegistroPorId(id);
    }

    async atualizarProduto(id, dadosAtualizados) {
        if (Object.keys(dadosAtualizados).length === 0)
            throw new BadRequestError('Nenhuma informação foi fornecida para atualização.');

        const produtoAtual = await this.buscarRegistroPorId(id);
        const dadosSaoIguais = Object.keys(dadosAtualizados).every(
            (key) => produtoAtual[key] === dadosAtualizados[key]
        );
        if (dadosSaoIguais) throw new BadRequestError('Nenhuma alteração foi feita nos dados.');

        return this.atualizarRegistro(id, dadosAtualizados);
    }

    async excluirProduto(id) {
        return this.excluirRegistro(id);
    }
}

export default new ProdutoService();
