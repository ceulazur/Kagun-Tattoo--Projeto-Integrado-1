class Controller {
    constructor(service) {
        this.service = service;
    }

    // POST
    async criar(req, res) {
        try {
            const novoRegistro = await this.service.criarNovoRegistro(req.body);
            return res.status(201).json(novoRegistro);
        } catch (erro) {
            return res.status(500).json({ mensagem: erro.message });
        }
    }

    // GET all
    async listar(req, res) {
        try {
            const registros = await this.service.buscarTodosRegistros(req.query);
            return res.status(200).json(registros);
        } catch (erro) {
            return res.status(500).json({ mensagem: erro.message });
        }
    }

    // GET by ID
    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const registro = await this.service.buscarRegistroPorId(Number(id));
            if (!registro) return res.status(404).json({ mensagem: 'Registro não encontrado.' });
            return res.status(200).json(registro);
        } catch (erro) {
            return res.status(500).json({ mensagem: erro.message });
        }
    }

    // PUT
    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const registroAtualizado = await this.service.atualizarRegistro(Number(id), req.body);
            return res.status(200).json(registroAtualizado);
        } catch (erro) {
            return res.status(500).json({ mensagem: erro.message });
        }
    }

    // DELETE
    async excluir(req, res) {
        try {
            const { id } = req.params;
            await this.service.excluirRegistro(Number(id));
            return res.status(204).send();
        } catch (erro) {
            return res.status(500).json({ mensagem: erro.message });
        }
    }
}

export default Controller;
