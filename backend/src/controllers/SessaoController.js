import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class SessaoController {
    async listarSessoes(req, res) {
        try {
            const { periodo, status = 'agendada', idTatuador } = req.query;

            // Inicializa o objeto de filtros
            const filtros = {};

            // Filtra por período (dia, semana, mês, ano)
            if (periodo) {
                const dataAtual = new Date();
                if (periodo === 'dia') {
                    filtros.data = {
                        gte: new Date(dataAtual.setHours(0, 0, 0, 0)), // Início do dia
                        lt: new Date(dataAtual.setHours(23, 59, 59, 999)), // Fim do dia
                    };
                } else if (periodo === 'semana') {
                    const primeiroDiaSemana = new Date(dataAtual.setDate(dataAtual.getDate() - dataAtual.getDay()));
                    const ultimoDiaSemana = new Date(primeiroDiaSemana);
                    ultimoDiaSemana.setDate(primeiroDiaSemana.getDate() + 6);

                    filtros.data = {
                        gte: new Date(primeiroDiaSemana.setHours(0, 0, 0, 0)),
                        lt: new Date(ultimoDiaSemana.setHours(23, 59, 59, 999)),
                    };
                } else if (periodo === 'mes') {
                    const inicioMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
                    const fimMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);

                    filtros.data = {
                        gte: new Date(inicioMes.setHours(0, 0, 0, 0)),
                        lt: new Date(fimMes.setHours(23, 59, 59, 999)),
                    };
                } else if (periodo === 'ano') {
                    const inicioAno = new Date(dataAtual.getFullYear(), 0, 1);
                    const fimAno = new Date(dataAtual.getFullYear(), 11, 31);

                    filtros.data = {
                        gte: new Date(inicioAno.setHours(0, 0, 0, 0)),
                        lt: new Date(fimAno.setHours(23, 59, 59, 999)),
                    };
                }
            }

            // Filtra por status (opcional)
            if (status) {
                filtros.status = status;
            }

            // Filtra por idTatuador (opcional)
            if (idTatuador) {
                filtros.idTatuador = Number(idTatuador);
            }

            // Busca no banco de dados com os filtros
            const sessoes = await prisma.sessao.findMany({
                where: filtros,
                orderBy: { data: 'asc' }, // Ordena por data em ordem crescente
            });

            return res.status(200).json({ sessoes });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: 'Erro ao buscar sessões.' });
        }
    }

    async agendarSessao(req, res) {
        try {
            const { nomeCliente, data, horario, idTatuador } = req.body;

            // Validar se a data é no futuro
            const dataHora = new Date(`${data}T${horario}`);
            if (dataHora <= new Date())
                return res.status(400).json({ mensagem: 'Data e horário devem ser no futuro.' });

            // Verificar conflitos de horário
            const conflito = await prisma.sessao.findFirst({
                where: { data: dataHora, idTatuador },
            });
            if (conflito)
                return res.status(400).json({ mensagem: 'Já existe uma sessão nesse horário.' });

            // Criar a sessão
            const sessao = await prisma.sessao.create({
                data: { nomeCliente, data: dataHora, horario: dataHora, idTatuador },
            });

            return res.status(201).json({ mensagem: 'Sessão agendada com sucesso.', sessao });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: 'Erro ao agendar a sessão.' });
        }
    }

    async reagendarSessao(req, res) {
        try {
            const { idSessao, novaData, novoHorario } = req.body;

            const sessao = await prisma.sessao.findUnique({ where: { idSessao } });

            if (!sessao)
                return res.status(404).json({ mensagem: 'Sessão não encontrada.' });

            if (new Date(sessao.data) <= new Date())
                return res.status(400).json({ mensagem: 'Não é possível reagendar sessões passadas.' });

            // Validar novo horário
            const novoDataHora = new Date(`${novaData}T${novoHorario}`);
            const conflito = await prisma.sessao.findFirst({
                where: { data: novoDataHora, idTatuador: sessao.idTatuador },
            });
            if (conflito)
                return res.status(400).json({ mensagem: 'Conflito com outra sessão.' });

            const sessaoAtualizada = await prisma.sessao.update({
                where: { idSessao },
                data: { data: novoDataHora, horario: novoDataHora },
            });

            return res.status(200).json({ mensagem: 'Sessão reagendada com sucesso.', sessaoAtualizada });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: 'Erro ao reagendar a sessão.' });
        }
    }

    async cancelarSessao(req, res) {
        const { idSessao } = req.body;

        try {
            const sessao = await prisma.sessao.findUnique({ where: { idSessao } });

            if (!sessao) return res.status(404).json({ mensagem: 'Sessão não encontrada.' });

            if (new Date(sessao.data) <= new Date())
                return res.status(400).json({ mensagem: 'Não é possível cancelar sessões passadas.' });

            if (sessao.status === 'cancelada') {
                return res.status(400).json({ mensagem: 'Essa sessão já foi cancelada.' });
            }

            const sessaoCancelada = await prisma.sessao.update({
                where: { idSessao },
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
