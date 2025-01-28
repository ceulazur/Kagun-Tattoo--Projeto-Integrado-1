import SessaoService from '../services/SessaoService.js';

class SessaoController {
    async agendarSessao(req, res) {
        try {
            const sessao = await SessaoService.agendarSessao(req.body);
            return res.status(201).json({ mensagem: 'Sessão agendada com sucesso.', sessao });
        } catch (erro) {
            return res.status(400).json({ mensagem: erro.message });
        }
    }

    async listarSessoes(req, res) {
        try {
            const sessoes = await SessaoService.listarSessoes(req.query);
            return res.status(200).json({ sessoes });
        } catch (erro) {
            return res.status(400).json({ mensagem: erro.message });
        }
    }

    async listarSessaoPorId(req, res){
        try {
            const { idSessao } = req.params;
            const sessao = await SessaoService.listarSessaoPorId(Number(idSessao));
            return res.status(200).json({ sessao });
        } catch (erro) {
            return res.status(400).json({ mensagem: erro.message });
        }
    }

    async atualizarSessao(req, res) {
        try {
            const sessaoAtualizada = await SessaoService.atualizarSessao(req.body);
            return res.status(200).json({ mensagem: 'Sessão reagendada com sucesso.', sessaoAtualizada });
        } catch (erro) {
            return res.status(400).json({ mensagem: erro.message });
        }
    }

    async cancelarSessao(req, res) {
        try {
            const sessaoCancelada = await SessaoService.cancelarSessao(req.body);
            return res.status(200).json({ mensagem: 'Sessão cancelada com sucesso.', sessaoCancelada });
        } catch (erro) {
            return res.status(400).json({ mensagem: erro.message });
        }
    }
}

export default new SessaoController();
