const paginatorMiddleware = (req, res, next) => {
    let { pagina = 1, limite = 10 } = req.query;

    pagina = Math.max(parseInt(pagina, 10), 1);
    limite = Math.max(parseInt(limite, 10), 1);
    req.paginacao = {
        skip: (pagina - 1) * limite,
        take: limite
    };

    next();
};

export default paginatorMiddleware;
