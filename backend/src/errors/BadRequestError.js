import BaseError from './BaseError.js';

// Erro 400 - Requisição inválida
class BadRequestError extends BaseError {
    constructor(message = "Requisição inválida") {
        super(message, 400);
    }
}

export default BadRequestError;
