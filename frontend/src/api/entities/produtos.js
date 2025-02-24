import {
  deleteMethod,
  getMethod,
  postMethod,
  putMethod,
} from "../common/api_requests";
import { URLS } from "../common/endpoints";

export const listarProdutos = async () => {
  try {
    const response = await getMethod(URLS.LISTAR_PRODUTOS);
    const produtos = response.data;

    // Fetch fornecedor details for each produto
    const produtosComFornecedores = await Promise.all(
      produtos.map(async (produto) => {
        try {
          const fornecedorResponse = await getMethod(
            `${URLS.FORNECEDORES}/${produto.idFornecedor}`
          );
          return {
            ...produto,
            fornecedor: fornecedorResponse.data,
          };
        } catch (error) {
          console.error(
            `Erro ao buscar fornecedor do produto ${produto.id}:`,
            error
          );
          return {
            ...produto,
            fornecedor: { nome: "Fornecedor não encontrado" },
          };
        }
      })
    );

    return produtosComFornecedores;
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    throw error;
  }
};

export const cadastrarProduto = async (produto) => {
  try {
    const response = await postMethod(URLS.CADASTRAR_PRODUTO, produto);
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    throw error;
  }
};

export const atualizarProduto = async (id, produto) => {
  try {
    const response = await putMethod(`${URLS.ATUALIZAR_PRODUTO}${id}`, produto);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    throw error;
  }
};

export const excluirProduto = async (id) => {
  try {
    const response = await deleteMethod(`${URLS.EXCLUIR_PRODUTO}${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    throw error;
  }
};
