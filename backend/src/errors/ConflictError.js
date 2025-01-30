import BaseError from './BaseError.js';

// Erro 409 - Conflito de dados
class ConflictError extends BaseError {
    constructor(message = "Conflito de dados") {
        super(message, 409);
    }
}

export default ConflictError;
