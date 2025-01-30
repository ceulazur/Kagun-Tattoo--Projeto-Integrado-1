import BaseError from './BaseError.js';

// Erro 403 - Acesso negado
class ForbiddenError extends BaseError {
    constructor(message = "Acesso negado") {
        super(message, 403);
    }
}

export default ForbiddenError;
