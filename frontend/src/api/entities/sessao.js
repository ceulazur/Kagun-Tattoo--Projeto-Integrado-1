import {
  deleteMethod,
  getMethod,
  postMethod,
  putMethod,
} from "../common/api_requests";
import { URLS } from "../common/endpoints";

export const listarSessoes = async () => {
  try {
    const response = await getMethod(URLS.LISTAR_SESSOES);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar sessões:", error);
    throw error;
  }
};

export const agendarSessao = async (sessaoData) => {
  try {
    const response = await postMethod(URLS.AGENDAR_SESSAO, sessaoData);
    return response.data;
  } catch (error) {
    console.error("Erro ao agendar sessão:", error);
    throw error;
  }
};

export const reagendarSessao = async (sessaoData) => {
  try {
    const response = await putMethod(URLS.REAGENDAR_SESSAO, sessaoData);
    return response.data;
  } catch (error) {
    console.error("Erro ao reagendar sessão:", error);
    throw error;
  }
};

export const cancelarSessao = async (sessaoId) => {
  try {
    const response = await deleteMethod(`${URLS.CANCELAR_SESSAO}/${sessaoId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao cancelar sessão:", error);
    throw error;
  }
};
