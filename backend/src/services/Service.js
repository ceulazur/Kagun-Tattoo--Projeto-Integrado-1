import { prisma } from '../config/prismaClient.js';

class Service {
    constructor(modelName){
        this.model = modelName;
    }

    // POST
    async criarNovoRegistro(data){
        try {
            return await prisma[this.model].create({ data });
        } catch (erro) {
            throw new Error(`Erro ao criar registro em ${this.model}: ${erro.message}`);
        }
    }

    // GET all
    async buscarTodosRegistros(where = {}, extras = {}){
        try {
            return await prisma[this.model].findMany({ where, ...extras });
        } catch (erro) {
            throw new Error(`Erro ao buscar registros em ${this.model}: ${erro.message}`);
        }
    }

    // GET by Id
    async buscarRegistroPorId(id){
        try {
            const registro = await prisma[this.model].findUnique({ where: { id } });

            if (!registro) throw new Error(`Registro com ID ${id} não encontrado em ${this.model}`);

            return registro;
        } catch (erro) {
            throw new Error(`Erro ao buscar registro por ID em ${this.model}: ${erro.message}`);
        }
    }

    // GET by any field
    async buscarRegistroPorCampo(where, include = {}){
        try {
            const registro = await prisma[this.model].findUnique({ where, include });

            if (!registro) throw new Error(`Registro não encontrado em ${this.model}`);

            return registro;
        } catch (erro) {
            throw new Error(`Erro ao buscar registro em ${this.model}: ${erro.message}`);
        }
    }

    // GET first by any field
    async buscarPrimeiroRegistroPorCampo(where, include = {}){
        try {
            const registro = await prisma[this.model].findFirst({ where, include });

            if (!registro) throw new Error(`Registro não encontrado em ${this.model}`);

            return registro;
        } catch (erro) {
            throw new Error(`Erro ao buscar primeiro registro em ${this.model}: ${erro.message}`);
        }
    }

    // PUT
    async atualizarRegistro(id, data){
        try {
            const existe = await prisma[this.model].findUnique({ where: { id } });

            if (!existe) throw new Error(`Registro com ID ${id} não encontrado em ${this.model}`);

            return await prisma[this.model].update({ where: { id }, data });
        } catch (erro) {
            throw new Error(`Erro ao atualizar registro em ${this.model}: ${erro.message}`);
        }
    }

    // DEL
    async excluirRegistro(id){
        try {
            const existe = await prisma[this.model].findUnique({ where: { id } });
            
            if (!existe) throw new Error(`Registro com ID ${id} não encontrado em ${this.model}`);

            return await prisma[this.model].delete({ where: { id } });
        } catch (erro) {
            throw new Error(`Erro ao excluir registro em ${this.model}: ${erro.message}`);
        }
    }
}

export default Service;
