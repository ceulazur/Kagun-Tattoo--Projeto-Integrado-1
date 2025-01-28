import Service from './Service.js';
import { DateTime } from 'luxon';

class SessaoService extends Service {
    constructor() {
        super('sessao');
    }

    async agendarSessao({ idCliente, idTatuador, dataHorario }){
        // Valida se o idCliente existe
        const clienteExiste = await this.buscarRegistroPorId(idCliente);
        if (!clienteExiste) throw new Error('Cliente não encontrado.');

        // Valida se o idTatuador existe
        const tatuadorExiste = await new Service('tatuador').buscarRegistroPorId(idTatuador);
        if (!tatuadorExiste) throw new Error('Tatuador não encontrado.');

        // Valida se a data é no futuro
        const dataHora = DateTime.fromISO(dataHorario);
        if (dataHora <= DateTime.now()) throw new Error('Data e horário devem ser no futuro.');

        // Verifica conflitos de horário
        const conflito = await this.buscarPrimeiroRegistroPorCampo({
            dataHorario: dataHora.toJSDate(),
            idTatuador
        });
        if (conflito) throw new Error('Já existe uma sessão nesse horário.');

        return this.criarNovoRegistro({
            idCliente, idTatuador, dataHorario: dataHora.toJSDate()
        });
    }

    async listarSessoes({ periodo, status = 'agendada', idTatuador }){
        // Inicializa o objeto de filtros
        const filtros = {};

        // Filtra por período (dia, semana, mês, ano)
        if (periodo) {
            const dataAtual = DateTime.now();
            const periodos = {
                dia:    { gte: dataAtual.startOf('day'), lt: dataAtual.endOf('day') },
                semana: { gte: dataAtual.startOf('week'), lt: dataAtual.endOf('week') },
                mes:    { gte: dataAtual.startOf('month'), lt: dataAtual.endOf('month') },
                ano:    { gte: dataAtual.startOf('year'), lt: dataAtual.endOf('year') },
            };

            const intervalo = periodos[periodo];

            if (!intervalo) throw new Error('Período inválido.');

            filtros.dataHorario = { gte: intervalo.gte.toJSDate(), lt: intervalo.lt.toJSDate() };
        }

        // Filtra por status e idTatuador
        if (status) filtros.status = status;
        if (idTatuador) filtros.idTatuador = Number(idTatuador);

        // Busca registros usando os filtros e parâmetros adicionais
        return this.buscarTodosRegistros(filtros, {
            include: { cliente: true, tatuador: true },
            orderBy: { dataHorario: 'asc' },
        });    
    }

    async listarSessaoPorId(idSessao) {
        const sessao = await this.buscarRegistroPorCampo(
            { id: idSessao },
            { include: { cliente: true, tatuador: true } }
        );

        if (!sessao) throw new Error('Sessão não encontrada.');

        return sessao;
    }

    async atualizarSessao({ idSessao, novaDataHorario }){
        // Busca a sessão existente
        const sessao = await this.buscarRegistroPorId(idSessao);

        if (!sessao) throw new Error('Sessão não encontrada.');

        // Valida se a sessão é passada
        const dataHoraAtual = DateTime.fromJSDate(sessao.dataHorario);
        if (dataHoraAtual <= DateTime.now()) throw new Error('Não é possível reagendar sessões passadas.');

        // Valida o novo horário
        const novoDataHora = DateTime.fromISO(novaDataHorario);
        if (novoDataHora <= DateTime.now()) throw new Error('O novo horário deve ser no futuro.');

        const conflito = await this.buscarRegistroPorCampot({
            dataHorario: novoDataHora.toJSDate(),
            idTatuador: sessao.idTatuador
        });
        if (conflito)throw new Error('Conflito com outra sessão.');

        return this.atualizarRegistro(idSessao, { dataHorario: novoDataHora.toJSDate() });
    }

    async cancelarSessao({ idSessao }){
        // Busca a sessão existente
        const sessao = await this.buscarRegistroPorId(idSessao);
        if (!sessao) throw new Error('Sessão não encontrada.') ;

        // Valida se a sessão já foi cancelada ou é passada
        const dataHoraAtual = DateTime.fromJSDate(sessao.dataHorario);
        if (dataHoraAtual <= DateTime.now()) throw new Error('Não é possível cancelar sessões passadas.')
        if (sessao.status === 'cancelada')   throw new Error('Essa sessão já foi cancelada.')

        return this.atualizarRegistro(idSessao, { status: 'cancelada' });
    }
}

export default new SessaoService();
