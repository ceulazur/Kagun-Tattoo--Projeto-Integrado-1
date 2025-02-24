import {
  deleteMethod,
  getMethod,
  postMethod,
  putMethod,
} from "../common/api_requests";
import { URLS } from "../common/endpoints";

// Função para listar todos os fornecedores
export const listarFornecedores = async () => {
  try {
    const response = await getMethod(URLS.LISTAR_FORNECEDORES);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar fornecedores:", error);
    throw error;
  }
};

// Função para buscar um fornecedor específico por ID
export const buscarFornecedorPorId = async (id) => {
  try {
    const response = await getMethod(`${URLS.FORNECEDORES}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar fornecedor:", error);
    throw error;
  }
};

// Função para cadastrar um novo fornecedor
export const cadastrarFornecedor = async (nome, telefone, email) => {
  try {
    const response = await postMethod(URLS.CADASTRAR_FORNECEDOR, {
      nome,
      telefone,
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar fornecedor:", error);
    throw error;
  }
};

// Função para atualizar um fornecedor existente
export const atualizarFornecedor = async (id, nome, telefone, email) => {
  try {
    const response = await putMethod(URLS.ATUALIZAR_FORNECEDOR + id, {
      nome,
      telefone,
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar fornecedor:", error);
    throw error;
  }
};

// Função para excluir um fornecedor
export const excluirFornecedor = async (id) => {
  try {
    const response = await deleteMethod(`${URLS.EXCLUIR_FORNECEDOR}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao excluir fornecedor:", error);
    throw error;
  }
};
