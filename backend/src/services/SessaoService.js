import Service from './Service.js';
import BadRequestError from '../errors/BadRequestError.js';
import ConflictError from '../errors/ConflictError.js';
import { DateTime } from 'luxon';

class SessaoService extends Service {
    constructor() {
        super('sessao');
    }

    async agendarSessao({ idCliente, idTatuador, dataHorario }){
        if (!idCliente || !idTatuador || !dataHorario)
            throw new BadRequestError('Todos os campos são obrigatórios.');

        await new Service('cliente').buscarRegistroPorId(idCliente);
        await new Service('tatuador').buscarRegistroPorId(idTatuador);

        // Valida se a data é no futuro
        const dataHora = DateTime.fromISO(dataHorario);
        if (dataHora <= DateTime.now()) throw new BadRequestError('Data e horário devem ser no futuro.');

        // Verifica se já existe uma sessão no mesmo horário para este tatuador
        const conflito = await this.buscarPrimeiroRegistroPorCampo( { idTatuador, dataHorario: dataHora.toJSDate() } );
        if (conflito) throw new ConflictError('Já existe uma sessão agendada nesse horário. Escolha outro horário.');

        return this.criarRegistro({
            idCliente, idTatuador, dataHorario: dataHora.toJSDate()
        });
    }

    async listarSessoes(filtros = {}, paginacao = {}){
        return this.listarRegistros(filtros, {
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
        return this.buscarRegistroPorId(idSessao);
    }

    async atualizarSessao({ idSessao, novaDataHorario }){
        const sessao = await this.buscarRegistroPorId(idSessao);

        // Valida se a sessão é passada
        const dataHoraAtual = DateTime.fromJSDate(sessao.dataHorario);
        if (dataHoraAtual <= DateTime.now()) throw new BadRequestError('Não é possível reagendar sessões passadas.');

        // Valida o novo horário
        const novoDataHora = DateTime.fromISO(novaDataHorario);
        if (novoDataHora <= DateTime.now()) throw new BadRequestError('O novo horário deve ser no futuro.');

        const conflito = await this.buscarPrimeiroRegistroPorCampo({
            idTatuador: sessao.idTatuador,
            dataHorario: novoDataHora.toJSDate()
        });
        if (conflito && conflito.id !== idSessao) {
            throw new ConflictError('Já existe uma sessão agendada nesse horário para esse tatuador.');
        }

        return this.atualizarRegistro(idSessao, { dataHorario: novoDataHora.toJSDate() });
    }

    async excluirSessao({ idSessao }){
        await this.buscarRegistroPorId(idSessao);
        return this.excluirRegistro(idSessao);
    }

    async cancelarSessao({ idSessao }){
        // Busca a sessão existente
        const sessao = await this.buscarRegistroPorId(idSessao);

        // Valida se a sessão já foi cancelada ou é passada
        const dataHoraAtual = DateTime.fromJSDate(sessao.dataHorario);
        if (dataHoraAtual <= DateTime.now()) throw new BadRequestError('Não é possível cancelar sessões passadas.')
        if (sessao.status === 'cancelada')   throw new BadRequestError('Essa sessão já foi cancelada.')

        return this.atualizarRegistro(idSessao, { status: 'cancelada' });
    }
}

export default new SessaoService();
