import { Prisma } from '@prisma/client';
import BaseError from '../errors/BaseError.js';
import BadRequestError from '../errors/BadRequestError.js';
import ConflictError from '../errors/ConflictError.js';
import NotFoundError from '../errors/NotFoundError.js';

const errorMiddleware = (err, req, res, next) => {
    if (err instanceof BaseError)
        return err.sendResponse(res);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002':
                return new ConflictError('Conflito: já existe um registro com esse valor único.').sendResponse(res);
            case 'P2025':
                return new NotFoundError('Registro não encontrado.').sendResponse(res);
            default:
                return new BadRequestError('Erro de banco de dados.').sendResponse(res);
        }
    }

    return new BaseError().sendResponse(res);
};

export default errorMiddleware;
