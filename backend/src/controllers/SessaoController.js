import Controller from './Controller.js';
import SessaoService from '../services/SessaoService.js';
import SessaoIterator from '../iterators/SessaoIterator.js';


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

    async agendarSessao(req, res, next) {
        try {
            const { idCliente, dataHorario } = req.body;
            const idTatuador = req.usuario.idTatuador; // Pegando do token

            const sessao = await this.service.agendarSessao({ idCliente, idTatuador, dataHorario });

            return res.status(201).json({ mensagem: 'Sessão agendada com sucesso.', sessao });
        } catch (erro) {
            next(erro);
        }
    }

    async listarSessoes(req, res, next) {
        try {
            console.log("Filtros recebidos:", req.filtros);
            console.log("Paginação recebida:", req.paginacao);

            const sessoes = await this.service.listarSessoes(req.filtros, req.paginacao);
            console.log("Sessões encontradas:", sessoes);
            const iterator = new SessaoIterator(sessoes, req.filtros);
            console.log("Iterator criado com sucesso!");

            // Permitir ordenação dinâmica antes de iterar
            if (req.query.ordenarPor){
                iterator.ordenarPor(req.query.ordenarPor, req.query.ordem || 'asc');
                console.log("Ordenação aplicada:", req.query.ordenarPor, req.query.ordem);
            }
            let sessoesFiltradas = [];
            while (iterator.temProximo()) {
                sessoesFiltradas.push(iterator.proximo());
            }

            console.log("Sessões filtradas pelo Iterator:", sessoesFiltradas);
            return res.status(200).json(sessoesFiltradas);
        } catch (erro) {
            console.error("Erro ao listar sessões:", erro);
            next(erro);
        }
    }

    async buscarSessaoPorId(req, res, next){
        try {
            const { id } = req.params;

            const sessao = await this.service.listarSessaoPorId(Number(id));

            return res.status(200).json({ sessao });
        } catch (erro) {
            next(erro);
        }
    }

    async atualizarSessao(req, res, next) {
        try {
            const { id } = req.params;
            const { novaDataHorario, novoStatus, produtosConsumidos = [] } = req.body;
            
            const sessaoAtualizada = await this.service.atualizarSessao({
                idSessao: Number(id),
                novaDataHorario,
                novoStatus,
                produtosConsumidos
            });
    
            return res.status(200).json({ mensagem: 'Sessão atualizada com sucesso.', sessaoAtualizada });
        } catch (erro) {
            next(erro);
        }
    }

    async excluirSessao(req, res, next) {
        try {
            const { id } = req.params;
            await this.service.excluirSessao({ idSessao: Number(id) });
    
            return res.status(200).json({ mensagem: 'Sessão excluída com sucesso.' });
        } catch (erro) {
            next(erro);
        }
    }

    async cancelarSessao(req, res, next) {
        try {
            const { id } = req.params;
    
            const sessaoCancelada = await this.service.cancelarSessao({ idSessao: Number(id) });
    
            return res.status(200).json({ mensagem: 'Sessão cancelada com sucesso.', sessaoCancelada });
        } catch (erro) {
            next(erro);
        }
    }
}

export default new SessaoController();
