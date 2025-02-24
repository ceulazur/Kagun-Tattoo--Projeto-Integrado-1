import NotFoundError from '../errors/NotFoundError.js';

const notFoundMiddleware = (req, res, next) => {
    next( new NotFoundError("Página não encontrada") );
};

export default notFoundMiddleware;
