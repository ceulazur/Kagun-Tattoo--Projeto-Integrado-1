import { Prisma } from '@prisma/client';
import BaseError from '../errors/BaseError.js';
import ErrorFactory from '../errors/ErrorFactory.js';

const errorMiddleware = (err, req, res, next) => {
    // Se o erro já for um BaseError, simplesmente envia a resposta.
    if (err instanceof BaseError)
        return err.enviarResposta(res);

    // Se for um erro do Prisma, usa o ErrorFactory para traduzi-lo para um erro customizado.
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const erroPrisma = ErrorFactory.criarErroPrisma(err);
        return erroPrisma.enviarResposta(res);
    }

    // Se não for nenhum dos casos anteriores, cria um erro genérico e responde.
    const erroGenerico = ErrorFactory.criarErro('BaseError', 'Erro interno do servidor.');
    return erroGenerico.enviarResposta(res);
};

export default errorMiddleware;
