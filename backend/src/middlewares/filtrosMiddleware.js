import { DateTime } from 'luxon';

const filtrosMiddleware = (req, res, next) => {
    let { periodo, status, idTatuador, idCliente } = req.query;
    let filtros = {};

    if (periodo) {
        const dataAtual = DateTime.now();
        const periodos = {
            dia: { gte: dataAtual.startOf('day'), lt: dataAtual.endOf('day') },
            semana: { gte: dataAtual.startOf('week'), lt: dataAtual.endOf('week') },
            mes: { gte: dataAtual.startOf('month'), lt: dataAtual.endOf('month') },
            ano: { gte: dataAtual.startOf('year'), lt: dataAtual.endOf('year') }
        };

        const intervalo = periodos[periodo];
        if (!intervalo) {
            return res.status(400).json({ mensagem: 'Período inválido.' });
        }

        filtros.dataHorario = { gte: intervalo.gte.toJSDate(), lt: intervalo.lt.toJSDate() };
    }

    if (status) filtros.status = status;
    if (idTatuador) filtros.idTatuador = parseInt(idTatuador, 10);
    if (idCliente) filtros.idCliente = parseInt(idCliente, 10);

    req.filtros = filtros;
    next();
};

export default filtrosMiddleware;
