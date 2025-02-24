import BaseError from './BaseError.js';

// Erro 404 - Recurso não encontrado
class NotFoundError extends BaseError {
    constructor(message = "Recurso não encontrado") {
        super(message, 404);
    }
}

export default NotFoundError;
