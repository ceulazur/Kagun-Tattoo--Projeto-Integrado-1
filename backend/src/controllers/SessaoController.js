import Controller from './Controller.js';
import SessaoService from '../services/SessaoService.js';

class SessaoController extends Controller {
    constructor(){
        super(SessaoService);

        // Bindando todos os métodos automaticamente
        Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((method) => {
            if (typeof this[method] === 'function' && method !== 'constructor') {
                this[method] = this[method].bind(this);
            }
        });
    }

    async agendar(req, res) {
        try {
            const { idCliente, dataHorario } = req.body;
            const idTatuador = req.usuario.idTatuador; // Pegando do token

            const sessao = await this.service.agendarSessao({ idCliente, idTatuador, dataHorario });

            return res.status(201).json({ mensagem: 'Sessão agendada com sucesso.', sessao });
        } catch (erro) {
            return res.status(400).json({ mensagem: erro.message });
        }
    }

    async listarSessoes(req, res) {
        try {
            const sessoes = await this.service.listarSessoes(req.filtros, req.paginacao);

            return res.status(200).json(sessoes);
        } catch (erro) {
            return res.status(400).json({ mensagem: erro.message });
        }
    }

    async buscarPorId(req, res){
        try {
            const { id } = req.params;

            const sessao = await this.service.listarSessaoPorId(Number(id));

            return res.status(200).json({ sessao });
        } catch (erro) {
            return res.status(404).json({ mensagem: erro.message });
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;  // ✅ Agora pega o ID da URL
            const { novaDataHorario } = req.body;
    
            const sessaoAtualizada = await this.service.atualizarSessao({ idSessao: Number(id), novaDataHorario });
    
            return res.status(200).json({ mensagem: 'Sessão reagendada com sucesso.', sessaoAtualizada });
        } catch (erro) {
            return res.status(400).json({ mensagem: erro.message });
        }
    }

    async cancelar(req, res) {
        try {
            const { id } = req.params; // ✅ Agora pega o ID da URL
    
            const sessaoCancelada = await this.service.cancelarSessao({ idSessao: Number(id) });
    
            return res.status(200).json({ mensagem: 'Sessão cancelada com sucesso.', sessaoCancelada });
        } catch (erro) {
            return res.status(400).json({ mensagem: erro.message });
        }
    }
}

export default new SessaoController();
