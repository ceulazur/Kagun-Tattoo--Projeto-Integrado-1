import { Prisma } from '@prisma/client';
import BaseError from '../errors/BaseError.js';
import ErrorFactory from '../errors/ErrorFactory.js';

const errorMiddleware = (err, req, res, next) => {
    if (err instanceof BaseError)
        return err.enviarResposta(res);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const erroPrisma = ErrorFactory.criarErroPrisma(err);
        return erroPrisma.enviarResposta(res);
    }

    const erroGenerico = ErrorFactory.criarErro('BaseError', 'Erro interno do servidor.');
    return erroGenerico.enviarResposta(res);
};

export default errorMiddleware;
