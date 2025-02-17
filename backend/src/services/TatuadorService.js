import Service from './Service.js';
import bcrypt from 'bcrypt';

class TatuadorService extends Service {
    constructor() {
        super('tatuador');
    }

    async cadastrarTatuador({ cpf, nome, email, telefone, senha }) {
        if (!cpf || !nome || !email || !telefone || !senha)
            throw new Error('Todos os campos são obrigatórios.');

        // Verificando se já existe algum tatuador com os mesmos dados
        const cpfExiste = await this.buscarRegistroPorCampo({ cpf }, {}, false);
        const emailExiste = await this.buscarRegistroPorCampo({ email }, {}, false);
        const telefoneExiste = await this.buscarRegistroPorCampo({ telefone }, {}, false);

        if (cpfExiste) throw new Error('CPF já cadastrado.');
        if (emailExiste) throw new Error('E-mail já cadastrado.');
        if (telefoneExiste) throw new Error('Telefone já cadastrado.');

        // Criptografando a senha antes de salvar
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        return this.criarRegistro({ cpf, nome, email, telefone, senha: senhaCriptografada });
    }

    async listarTatuadores(filtros = {}, paginacao = {}) {
        return this.listarRegistros(filtros, { orderBy: { nome: 'asc' }, ...paginacao });
    }

    async buscarTatuadorPorId(id) {
        return this.buscarRegistroPorId(id);
    }

    async atualizarTatuador(id, dadosAtualizados) {
        if (Object.keys(dadosAtualizados).length === 0)
            throw new Error('Nenhuma informação foi fornecida para atualização.');

        const tatuadorAtual = await this.buscarRegistroPorId(id);
        const dadosSaoIguais = Object.keys(dadosAtualizados).every(
            (key) => tatuadorAtual[key] === dadosAtualizados[key]
        );
        if (dadosSaoIguais) throw new Error('Nenhuma alteração foi feita nos dados.');

        return this.atualizarRegistro(id, dadosAtualizados);
    }

    async excluirTatuador(id) {
        return this.excluirRegistro(id);
    }
}

export default new TatuadorService();
