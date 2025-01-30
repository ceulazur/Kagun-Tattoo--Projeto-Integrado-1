class Controller {
    constructor(service) {
        this.service = service;
    }

    // POST
    async criar(req, res, next) {
        try {
            const novoRegistro = await this.service.criarNovoRegistro(req.body);

            return res.status(201).json(novoRegistro);
        } catch (erro) {
            next(erro);
        }
    }

    // GET all
    async listar(req, res, next) {
        try {
            const registros = await this.service.buscarTodosRegistros(req.query);

            return res.status(200).json(registros);
        } catch (erro) {
            next(erro);
        }
    }

    // GET by ID
    async buscarPorId(req, res, next) {
        try {
            const { id } = req.params;

            const registro = await this.service.buscarRegistroPorId(Number(id));

            return res.status(200).json(registro);
        } catch (erro) {
            next(erro);
        }
    }

    // PUT
    async atualizar(req, res, next) {
        try {
            const { id } = req.params;

            const registroAtualizado = await this.service.atualizarRegistro(Number(id), req.body);

            return res.status(200).json(registroAtualizado);
        } catch (erro) {
            next(erro);
        }
    }

    // DELETE
    async excluir(req, res, next) {
        try {
            const { id } = req.params;

            await this.service.excluirRegistro(Number(id));
            
            return res.status(204).send();
        } catch (erro) {
            next(erro);
        }
    }
}

export default Controller;
