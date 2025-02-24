import BadRequestError from './BadRequestError.js';
import ConflictError from './ConflictError.js';
import ForbiddenError from './ForbiddenError.js';
import NotFoundError from './NotFoundError.js';
import UnauthorizedError from './UnauthorizedError.js';
import BaseError from './BaseError.js';

class ErrorFactory {
    static criarErro(tipo, mensagem = '') {
        switch (tipo) {
            case 'BadRequestError':
                return new BadRequestError(mensagem || 'Requisição inválida');
            case 'ConflictError':
                return new ConflictError(mensagem || 'Conflito de dados');
            case 'ForbiddenError':
                return new ForbiddenError(mensagem || 'Acesso negado');
            case 'NotFoundError':
                return new NotFoundError(mensagem || 'Recurso não encontrado');
            case 'UnauthorizedError':
                return new UnauthorizedError(mensagem || 'Não autorizado');
            default:
                return new BaseError(mensagem || 'Erro interno do servidor');
        }
    }

    static criarErroPrisma(erro) {
        switch (erro.code) {
            case 'P2002':
                return this.criarErro('ConflictError', 'Conflito: já existe um registro com esse valor único.');
            case 'P2025':
                return this.criarErro('NotFoundError', 'Registro não encontrado.');
            default:
                return this.criarErro('BaseError', `Erro desconhecido do Prisma: ${erro.message}`);
        }
    }
}

export default ErrorFactory;