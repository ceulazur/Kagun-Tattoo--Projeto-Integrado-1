import prisma from '../config/prismaSingleton.js';
import NotFoundError from '../errors/NotFoundError.js';
import BadRequestError from '../errors/BadRequestError.js';

class Service {
    constructor(modelName) {
        this.model = modelName;
    }

    // POST
    async criarRegistro(data) {
        try {
            return await prisma[this.model].create({ data });
        } catch (erro) {
            throw new BadRequestError(`Erro ao criar registro: ${erro.message}`);
        }
    }

    // GET all
    async listarRegistros(where = {}, extras = {}) {
        try {
            return await prisma[this.model].findMany({ where, ...extras });
        } catch (erro) {
            throw new BadRequestError(`Erro ao buscar registros: ${erro.message}`);
        }
    }

    // GET by Id
    async buscarRegistroPorId(id) {
        try {
            const registro = await prisma[this.model].findUnique({ where: { id } });

            if (!registro) throw new NotFoundError('Registro não encontrado.');

            return registro;
        } catch (erro) {
            throw new BadRequestError(`Erro ao buscar registro por ID: ${erro.message}`);
        }
    }

    // GET by any field
    async buscarRegistroPorCampo(where, extras = {}, throwError = true) {
        try {
            // Remove campos undefined antes de passar para o Prisma
            const filtrosValidos = Object.fromEntries(
                Object.entries(where).filter(([_, v]) => v !== undefined)
            );

            if (Object.keys(filtrosValidos).length === 0) return null;

            const registro = await prisma[this.model].findUnique({ where, ...extras });

            if (!registro && throwError) throw new NotFoundError('Registro não encontrado.');

            return registro;
        } catch (erro) {
            throw new BadRequestError(`Erro ao buscar registro em ${this.model}: ${erro.message}`);
        }
    }

    // GET first by any field
    async buscarPrimeiroRegistroPorCampo(where, include = {}) {
        try {
            return await prisma[this.model].findFirst({ where, include }) || null;
        } catch (erro) {
            throw new BadRequestError(`Erro ao buscar primeiro registro: ${erro.message}`);
        }
    }

    // PUT
    async atualizarRegistro(id, data) {
        try {
            await this.buscarRegistroPorId(id);

            return await prisma[this.model].update({ where: { id }, data });
        } catch (erro) {
            throw new BadRequestError(`Erro ao atualizar registro: ${erro.message}`);
        }
    }

    // DEL
    async excluirRegistro(id) {
        try {
            await this.buscarRegistroPorId(id);
            return await prisma[this.model].delete({ where: { id } });
        } catch (erro) {
            throw new BadRequestError(`Erro ao excluir registro: ${erro.message}`);
        }
    }
}

export default Service;
