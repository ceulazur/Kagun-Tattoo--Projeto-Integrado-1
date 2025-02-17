import { Prisma } from '@prisma/client';
import BaseError from '../errors/BaseError.js';
import ErrorFactory from '../errors/ErrorFactory.js';
import errorMessages from '../errors/errorsMessages.js';

const errorMiddleware = (err, req, res, next) => {
    // Vê se é um Erro básico
    if (err instanceof BaseError) return err.enviarResposta(res);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const erroPrisma = ErrorFactory.criarErroPrisma(err);
        return erroPrisma.enviarResposta(res);
    }

    // Buscar no array de mensagens de erro um match
    const erroEncontrado = errorMessages.find(e => err.message.startsWith(e.mensagem));
    if(erroEncontrado) return ErrorFactory.criarErro(erroEncontrado.tipo, err.message).enviarResposta(res);

    // Se não for um erro mapeado, trata como erro interno
    const erroGenerico = ErrorFactory.criarErro('BaseError', 'Erro interno do servidor.');
    return erroGenerico.enviarResposta(res);
};

export default errorMiddleware;
