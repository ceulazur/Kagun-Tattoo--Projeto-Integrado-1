import { Prisma } from '@prisma/client';
import BaseError from '../errors/BaseError.js';
import BadRequestError from '../errors/BadRequestError.js';
import ConflictError from '../errors/ConflictError.js';
import NotFoundError from '../errors/NotFoundError.js';

const errorMiddleware = (err, req, res, next) => {
    if (err instanceof BaseError)
        return err.enviarResposta(res);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002':
                return new ConflictError('Conflito: já existe um registro com esse valor único.').enviarResposta(res);
            case 'P2025':
                return new NotFoundError('Registro não encontrado.').enviarResposta(res);
            default:
                return new BadRequestError('Erro de banco de dados.').enviarResposta(res);
        }
    }

    return new BaseError().enviarResposta(res);
};

export default errorMiddleware;
