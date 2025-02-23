import {
  deleteMethod,
  getMethod,
  postMethod,
  putMethod,
} from "../common/api_requests";
import { URLS } from "../common/endpoints";

export const listarUsuarios = async () => {
  try {
    const response = await getMethod(URLS.LISTAR_USUARIOS);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    throw error;
  }
};

export const criarUsuario = async (userData) => {
  try {
    const response = await postMethod(URLS.CRIAR_USUARIO, userData);
    return response;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
};

export const atualizarUsuario = async (userData, userId) => {
  try {
    const response = await putMethod(URLS.ATUALIZAR_USUARIO + userId, userData);
    return response;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error;
  }
};

export const deletarUsuario = async (userId) => {
  try {
    const response = await deleteMethod(URLS.DELETAR_USUARIO + userId);
    return response;
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    throw error;
  }
};
