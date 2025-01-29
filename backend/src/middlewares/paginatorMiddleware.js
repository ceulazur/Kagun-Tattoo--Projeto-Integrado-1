import { DateTime } from 'luxon';

const paginatorMiddleware = (req, res, next) => {
    let { pagina = 1, limite = 10, periodo, ...filtros } = req.query;

    // Paginação
    pagina = Math.max(parseInt(pagina, 10), 1);
    limite = Math.max(parseInt(limite, 10), 1);
    req.paginacao = {
        skip: (pagina - 1) * limite,
        take: limite
    };

    // Se houver um período específico de busca, processa a data corretamente
    if (periodo) {
        const dataAtual = DateTime.now();
        const periodos = {
            dia: { gte: dataAtual.startOf('day'), lt: dataAtual.endOf('day') },
            semana: { gte: dataAtual.startOf('week'), lt: dataAtual.endOf('week') },
            mes: { gte: dataAtual.startOf('month'), lt: dataAtual.endOf('month') },
            ano: { gte: dataAtual.startOf('year'), lt: dataAtual.endOf('year') }
        };

        const intervalo = periodos[periodo];
        if (!intervalo) return res.status(400).json({ mensagem: 'Período inválido.' });

        filtros.dataHorario = { gte: intervalo.gte.toJSDate(), lt: intervalo.lt.toJSDate() };
    }

    req.filtros = filtros;
    next();
};

export default paginatorMiddleware;
