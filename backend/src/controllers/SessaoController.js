import { PrismaClient } from '@prisma/client';
import { DateTime } from 'luxon';

const prisma = new PrismaClient();

class SessaoController {
    async listarSessoes(req, res) {
        try {
            const { periodo, status = 'agendada', idTatuador } = req.query;

            // Inicializa o objeto de filtros
            const filtros = {};

            // Filtra por período (dia, semana, mês, ano)
            // Filtra por período
            if (periodo) {
                const dataAtual = DateTime.now();

                switch (periodo) {
                    case 'dia':
                        filtros.dataHorario = {
                            gte: dataAtual.startOf('day').toJSDate(),
                            lt: dataAtual.endOf('day').toJSDate(),
                        };
                        break;

                    case 'semana':
                        filtros.dataHorario = {
                            gte: dataAtual.startOf('week').toJSDate(),
                            lt: dataAtual.endOf('week').toJSDate(),
                        };
                        break;

                    case 'mes':
                        filtros.dataHorario = {
                            gte: dataAtual.startOf('month').toJSDate(),
                            lt: dataAtual.endOf('month').toJSDate(),
                        };
                        break;

                    case 'ano':
                        filtros.dataHorario = {
                            gte: dataAtual.startOf('year').toJSDate(),
                            lt: dataAtual.endOf('year').toJSDate(),
                        };
                        break;

                    default:
                        return res.status(400).json({ mensagem: 'Período inválido.' });
                }
            }

            // Filtra por status
            if (status) filtros.status = status;

            // Filtra pelo id do tatuador
            if (idTatuador) filtros.idTatuador = Number(idTatuador);

            // Busca no banco com os filtros
            const sessoes = await prisma.sessao.findMany({
                where: filtros,
                include: { cliente: true, tatuador: true },
                orderBy: { dataHorario: 'asc' },
            });

            return res.status(200).json({ sessoes });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: 'Erro ao buscar sessões.' });
        }
    }

    async agendarSessao(req, res) {
        try {
            const { idCliente, idTatuador, dataHorario } = req.body;

            // Validação de campos obrigatórios
            if(!idCliente || !idTatuador || !dataHorario)
                return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios.' })

            // Valida se a data é no futuro
            const dataHora = DateTime.fromISO(dataHorario);
            if (dataHora <= DateTime.now())
                return res.status(400).json({ mensagem: 'Data e horário devem ser no futuro.' });

            // Verifica conflitos de horário
            const conflito = await prisma.sessao.findFirst({
                where: { dataHorario: dataHora.toJSDate(), idTatuador },
            });
            if (conflito)
                return res.status(400).json({ mensagem: 'Já existe uma sessão nesse horário.' });

            // Cria a sessão
            const sessao = await prisma.sessao.create({
                data: { idCliente, idTatuador, dataHorario: dataHora.toJSDate() },
            });

            return res.status(201).json({ mensagem: 'Sessão agendada com sucesso.', sessao });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: 'Erro ao agendar a sessão.' });
        }
    }

    async reagendarSessao(req, res) {
        try {
            const { idSessao, novaDataHorario } = req.body;

            // Busca a sessão existente
            const sessao = await prisma.sessao.findUnique({ where: { id: idSessao } });

            if (!sessao)
                return res.status(404).json({ mensagem: 'Sessão não encontrada.' });

            // Valida se a sessão é passada
            const dataHoraAtual = DateTime.fromJSDate(sessao.dataHorario);
            if (dataHoraAtual <= DateTime.now())
                return res.status(400).json({ mensagem: 'Não é possível reagendar sessões passadas.' });

            // Valida o novo horário
            const novoDataHora = DateTime.fromISO(novaDataHorario);
            if (novoDataHora <= DateTime.now())
                return res.status(400).json({ mensagem: 'O novo horário deve ser no futuro.' });

            const conflito = await prisma.sessao.findFirst({
                where: { dataHorario: novoDataHora.toJSDate(), idTatuador: sessao.idTatuador },
            });
            if (conflito)
                return res.status(400).json({ mensagem: 'Conflito com outra sessão.' });

            // Atualiza a sessão
            const sessaoAtualizada = await prisma.sessao.update({
                where: { id: idSessao },
                data: { dataHorario: novoDataHora.toJSDate() },
            });

            return res.status(200).json({ mensagem: 'Sessão reagendada com sucesso.', sessaoAtualizada });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: 'Erro ao reagendar a sessão.' });
        }
    }

    async cancelarSessao(req, res) {
        try {
            const { idSessao } = req.body;

            // Busca a sessão existente
            const sessao = await prisma.sessao.findUnique({ where: { id: idSessao } });

            if (!sessao)
                return res.status(404).json({ mensagem: 'Sessão não encontrada.' });

            // Valida se a sessão já foi cancelada ou é passada
            const dataHoraAtual = DateTime.fromJSDate(sessao.dataHorario);
            if (dataHoraAtual <= DateTime.now())
                return res.status(400).json({ mensagem: 'Não é possível cancelar sessões passadas.' });

            if (sessao.status === 'cancelada')
                return res.status(400).json({ mensagem: 'Essa sessão já foi cancelada.' });

            // Cancela a sessão
            const sessaoCancelada = await prisma.sessao.update({
                where: { id: idSessao },
                data: { status: 'cancelada' },
            });

            return res.status(200).json({ mensagem: 'Sessão cancelada com sucesso.', sessaoCancelada });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: 'Erro ao cancelar a sessão.' });
        }
    }
}

export default new SessaoController();
