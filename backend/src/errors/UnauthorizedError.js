import BaseError from './BaseError.js';

// Erro 401 - Não autorizado
class UnauthorizedError extends BaseError {
    constructor(message = "Não autorizado") {
        super(message, 401);
    }
}

export default UnauthorizedError;
