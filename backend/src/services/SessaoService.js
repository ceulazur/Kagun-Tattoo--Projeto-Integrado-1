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
        const sessoes = await this.listarRegistros(filtros, {
            include: {
                cliente:  { select: { id: true, nome: true, telefone: true } },
                tatuador: { select: { id: true, nome: true, telefone: true } }
            },
            orderBy: { dataHorario: 'asc' },
            ...paginacao
        });

        return sessoes.map(({ id, dataHorario, termino, status, cliente, tatuador }) => ({
            id,
            dataHorario,
            termino,
            status,
            cliente,
            tatuador
        }));
    }

    async listarSessaoPorId(idSessao) {
        const sessao = await this.buscarRegistroPorCampo(
            { id: idSessao },
            {
                cliente: { select: { id: true, nome: true, telefone: true } },
                tatuador: { select: { id: true, nome: true, telefone: true } }
            }
        );
    
        if (!sessao) throw new NotFoundError('Sessão não encontrada.');
    
        // Reorganizando a ordem dos atributos no retorno
        const { id, dataHorario, termino, status, cliente, tatuador } = sessao;
        return { id, dataHorario, termino, status, cliente, tatuador };
    }

    async atualizarSessao({ idSessao, novaDataHorario }) {
        const sessao = await this.buscarRegistroPorId(idSessao);

        // Valida se a sessão já passou
        const dataHoraAtual = DateTime.fromJSDate(sessao.dataHorario);
        if (dataHoraAtual <= DateTime.now()) throw new BadRequestError('Não é possível reagendar sessões passadas.');
    
        // Valida se o novo horário é no futuro
        const novoDataHora = DateTime.fromISO(novaDataHorario).startOf('second'); // 🔥 Remove precisão extra
        if (novoDataHora <= DateTime.now()) throw new BadRequestError('O novo horário deve ser no futuro.');
    
        // Verifica se já existe uma sessão no mesmo horário para esse tatuador (exceto a própria sessão)
        const conflito = await this.buscarPrimeiroRegistroPorCampo({
            idTatuador: sessao.idTatuador,
            dataHorario: novoDataHora.toJSDate()
        });
    
        if (conflito) throw new ConflictError('Já existe uma sessão agendada nesse horário para esse tatuador.');
    
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
