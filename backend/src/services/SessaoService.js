import Service from './Service.js';
import { DateTime } from 'luxon';

class SessaoService extends Service {
    constructor() {
        super('sessao');
    }

    async agendarSessao({ idCliente, idTatuador, dataHorario }){
        // Valida se o idCliente existe
        const clienteExiste = await new Service('cliente').buscarRegistroPorId(idCliente);
        if (!clienteExiste) throw new Error('Cliente não encontrado.');

        // Valida se o idTatuador existe
        const tatuadorExiste = await new Service('tatuador').buscarRegistroPorId(idTatuador);
        if (!tatuadorExiste) throw new Error('Tatuador não encontrado.');

        // Valida se a data é no futuro
        const dataHora = DateTime.fromISO(dataHorario);
        if (dataHora <= DateTime.now()) throw new Error('Data e horário devem ser no futuro.');

        // Verifica se já existe uma sessão no mesmo horário para este tatuador
        const conflito = await this.buscarPrimeiroRegistroPorCampo({
            idTatuador,
            dataHorario: dataHora.toJSDate()
        });

        if (conflito) throw new Error('Já existe uma sessão agendada nesse horário. Escolha outro horário.');

        return this.criarNovoRegistro({
            idCliente, idTatuador, dataHorario: dataHora.toJSDate()
        });
    }

    async listarSessoes(filtros = {}, paginacao = {}){
        return this.buscarTodosRegistros(filtros, {
            include: {
                cliente: {
                    select: { id: true, nome: true, telefone: true }
                },
                tatuador: {
                    select: { id: true, nome: true, telefone: true }
                }
            },
            orderBy: { dataHorario: 'asc' },
            ...paginacao
        });    
    }

    async listarSessaoPorId(idSessao) {
        const sessao = await this.buscarRegistroPorCampo(
            { id: idSessao },
            { cliente: true, tatuador: true }
        );

        if (!sessao) throw new Error('Sessão não encontrada.');

        return sessao;
    }

    async atualizarSessao({ idSessao, novaDataHorario }){
        const sessao = await this.buscarRegistroPorId(idSessao);

        if (!sessao) throw new Error('Sessão não encontrada.');

        // Valida se a sessão é passada
        const dataHoraAtual = DateTime.fromJSDate(sessao.dataHorario);
        if (dataHoraAtual <= DateTime.now()) throw new Error('Não é possível reagendar sessões passadas.');

        // Valida o novo horário
        const novoDataHora = DateTime.fromISO(novaDataHorario);
        if (novoDataHora <= DateTime.now()) throw new Error('O novo horário deve ser no futuro.');

        const conflito = await this.buscarPrimeiroRegistroPorCampo({
            idTatuador: sessao.idTatuador,
            dataHorario: novoDataHora.toJSDate()
        });
    
        if (conflito && conflito.id !== idSessao) {
            throw new Error('Já existe uma sessão agendada nesse horário para esse tatuador.');
        }

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
