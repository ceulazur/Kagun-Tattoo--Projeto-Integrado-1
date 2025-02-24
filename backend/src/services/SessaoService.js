import { DateTime } from "luxon";
import BadRequestError from "../errors/BadRequestError.js";
import ConflictError from "../errors/ConflictError.js";
import ProdutoService from "./ProdutoService.js";
import Service from "./Service.js";

class SessaoService extends Service {
  constructor() {
    super("sessao");
  }

  async agendarSessao({ idCliente, idTatuador, dataHorario }) {
    if (!idCliente || !idTatuador || !dataHorario)
      throw new BadRequestError("Todos os campos são obrigatórios.");

    await new Service("cliente").buscarRegistroPorId(idCliente);
    await new Service("tatuador").buscarRegistroPorId(idTatuador);

    // Valida se a data é no futuro
    const dataHora = DateTime.fromISO(dataHorario);
    if (dataHora <= DateTime.now())
      throw new BadRequestError("Data e horário devem ser no futuro.");

    // Verifica se já existe uma sessão no mesmo horário para este tatuador
    const conflito = await this.buscarPrimeiroRegistroPorCampo({
      idTatuador,
      dataHorario: dataHora.toJSDate(),
    });
    if (conflito)
      throw new ConflictError(
        "Já existe uma sessão agendada nesse horário. Escolha outro horário."
      );

    return this.criarRegistro({
      idCliente,
      idTatuador,
      dataHorario: dataHora.toJSDate(),
    });
  }

  async listarSessoes(filtros = {}, paginacao = {}) {
    return this.listarRegistros(filtros, {
      include: {
        cliente: { select: { id: true, nome: true, telefone: true } },
        tatuador: { select: { id: true, nome: true, telefone: true } },
      },
      orderBy: { dataHorario: "asc" },
      ...paginacao,
    });
  }

  async listarSessaoPorId(idSessao) {
    return this.buscarRegistroPorCampo(
      { id: idSessao },
      {
        include: {
          cliente: { select: { id: true, nome: true, telefone: true } },
          tatuador: { select: { id: true, nome: true, telefone: true } },
        },
      }
    );
  }

  async atualizarSessao({
    idSessao,
    novaDataHorario,
    novoStatus,
    produtosConsumidos,
  }) {
    const sessao = await this.buscarRegistroPorId(idSessao);
    const dadosAtualizados = {};
    if (novaDataHorario) {
      // Valida se a sessão já passou
      const dataHoraAtual = DateTime.fromJSDate(sessao.dataHorario);
      if (dataHoraAtual <= DateTime.now())
        throw new BadRequestError("Não é possível reagendar sessões passadas.");

      // Valida se o novo horário é no futuro
      const novoDataHora = DateTime.fromISO(novaDataHorario).startOf("second"); // 🔥 Remove precisão extra
      if (novoDataHora <= DateTime.now())
        throw new BadRequestError("O novo horário deve ser no futuro.");

      // Verifica se já existe uma sessão no mesmo horário para esse tatuador (exceto a própria sessão)
      const conflito = await this.buscarPrimeiroRegistroPorCampo({
        idTatuador: sessao.idTatuador,
        dataHorario: novoDataHora.toJSDate(),
      });
      //
      if (conflito && conflito.id !== idSessao)
        throw new ConflictError(
          "Já existe uma sessão agendada nesse horário para esse tatuador."
        );

      dadosAtualizados.dataHorario = novoDataHora.toJSDate();
    }

    if (novoStatus) {
      if (novoStatus === "concluida") {
        if (!produtosConsumidos || produtosConsumidos.length === 0)
          throw new BadRequestError(
            "É necessário informar os produtos consumidos para concluir a sessão."
          );

        await ProdutoService.reduzirEstoque(produtosConsumidos);
      }

      dadosAtualizados.status = novoStatus;
    }

    return this.atualizarRegistro(idSessao, dadosAtualizados);
  }

  async excluirSessao({ idSessao }) {
    try {
      const sessao = await this.buscarRegistroPorId(idSessao);

      const dataHoraAtual = DateTime.fromJSDate(sessao.dataHorario);
      if (dataHoraAtual <= DateTime.now())
        throw new BadRequestError("Não é possível excluir sessões passadas.");

      return this.excluirRegistro(idSessao);
    } catch (error) {
      console.error(`Erro ao excluir sessão ${idSessao}:`, error);
      throw error;
    }
  }

  async cancelarSessao({ idSessao }) {
    try {
      const sessao = await this.buscarRegistroPorId(idSessao);

      const dataHoraAtual = DateTime.fromJSDate(sessao.dataHorario);
      if (dataHoraAtual <= DateTime.now())
        throw new BadRequestError("Não é possível cancelar sessões passadas.");
      if (sessao.status === "cancelada")
        throw new BadRequestError("Essa sessão já foi cancelada.");

      return this.atualizarRegistro(idSessao, { status: "cancelada" });
    } catch (error) {
      console.error(`Erro ao cancelar sessão ${idSessao}:`, error);
      throw error;
    }
  }
}

export default new SessaoService();
