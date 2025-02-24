import { DateTime } from "luxon";
import BadRequestError from "../errors/BadRequestError.js";
import NotFoundError from "../errors/NotFoundError.js";
import FornecedorService from "./FornecedorService.js";
import Service from "./Service.js";

class ProdutoService extends Service {
  constructor() {
    super("produto");
  }

  async cadastrarProduto({
    nome,
    lote,
    validade,
    quantidade,
    categoria,
    estoqueMinimo,
    idFornecedor,
  }) {
    if (
      !nome ||
      !lote ||
      !validade ||
      quantidade === undefined ||
      !categoria ||
      estoqueMinimo === undefined ||
      !idFornecedor
    )
      throw new BadRequestError("Todos os campos são obrigatórios.");

    const dataValidade = DateTime.fromISO(validade);
    if (!dataValidade.isValid)
      throw new BadRequestError("Data de validade inválida.");

    const fornecedor = await FornecedorService.buscarRegistroPorId(
      idFornecedor
    );
    if (!fornecedor) throw new NotFoundError("Fornecedor não encontrado.");

    const novoProduto = await this.criarRegistro({
      nome,
      lote,
      validade: dataValidade.toJSDate(),
      quantidade,
      categoria,
      estoqueMinimo,
      idFornecedor,
    });

    return novoProduto;
  }

  async listarProdutos(filtros = {}, paginacao = {}) {
    return this.listarRegistros(filtros, {
      orderBy: { nome: "asc" },
      ...paginacao,
    });
  }

  async listarProdutosEstoqueBaixo() {
    const produtos = await this.listarRegistros();
    return produtos.filter(
      (produto) => produto.quantidade < produto.estoqueMinimo
    );
  }

  async buscarProdutoPorId(id) {
    return this.buscarRegistroPorId(id);
  }

  async atualizarProduto(id, dadosAtualizados) {
    if (Object.keys(dadosAtualizados).length === 0)
      throw new BadRequestError(
        "Nenhuma informação foi fornecida para atualização."
      );

    const produtoAtual = await this.buscarRegistroPorId(id);
    const dadosSaoIguais = Object.keys(dadosAtualizados).every(
      (key) => produtoAtual[key] === dadosAtualizados[key]
    );
    if (dadosSaoIguais)
      throw new BadRequestError("Nenhuma alteração foi feita nos dados.");

    return this.atualizarRegistro(id, dadosAtualizados);
  }

  async excluirProduto(id, forcarExclusao = false) {
    const produto = await this.buscarRegistroPorId(id);

    if (!produto) {
      throw new NotFoundError("Produto não encontrado.");
    }

    if (produto.quantidade > 0) {
      if (!forcarExclusao) {
        throw new BadRequestError(
          "Não é possível excluir um produto com estoque disponível."
        );
      }

      // Zera o estoque antes de excluir.
      await this.atualizarRegistro(id, { quantidade: 0 });
    }

    return this.excluirRegistro(id);
  }

  async reduzirEstoque(produtosConsumidos) {
    for (const { idProduto, quantidadeUsada } of produtosConsumidos) {
      if (!idProduto || quantidadeUsada === undefined || quantidadeUsada <= 0)
        throw new BadRequestError(
          `Quantidade inválida para reduzir estoque do produto com ID ${idProduto}.`
        );

      const produto = await this.buscarRegistroPorId(idProduto);

      if (produto.quantidade < quantidadeUsada)
        throw new BadRequestError(
          `Estoque insuficiente para o produto ${produto.nome}.`
        );

      const novaQuantidade = produto.quantidade - quantidadeUsada;
      await this.atualizarRegistro(idProduto, { quantidade: novaQuantidade });

      // Disparar notificação futuramente
      if (novaQuantidade <= produto.estoqueMinimo)
        console.warn(
          `Alerta: Estoque do produto ${produto.nome} está abaixo do limite mínimo!`
        );
    }
  }
}

export default new ProdutoService();
