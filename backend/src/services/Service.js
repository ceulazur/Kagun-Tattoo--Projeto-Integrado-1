import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class Service {
    constructor(modelName){
        this.model = modelName;
    }

    // POST
    async criarNovoRegistro(data){
        return prisma[this.model].create({ data });
    }

    // GET all
    async buscarTodosRegistros(where = {}, extras = {}){
        return prisma[this.model].findMany({ where });
    }

    // GET by Id
    async buscarRegistroPorId(id){
        return prisma[this.model].findUnique({ where: { id } });
    }

    // GET by any field
    async buscarRegistroPorCampo(where, include = {}){
        return prisma[this.model].findUnique({ where, include });
    }

    // GET first by any field
    async buscarPrimeiroRegistroPorCampo(where, include = {}){
        return prisma[this.model].findFirst({ where, include });
    }

    // PUT
    async atualizarRegistro(id, data){
        return prisma[this.model].update({ where: { id }, data });
    }

    // DEL
    async excluirRegistro(id){
        return prisma[this.model].delete({ where: { id } });
    }
}

export default Service;
