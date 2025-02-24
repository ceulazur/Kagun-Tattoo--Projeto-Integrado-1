import {
  deleteMethodWithBody,
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
    const response = await postMethod(URLS.AGENDAR_SESSAO, {
      idCliente: sessaoData.idCliente,
      idTatuador: sessaoData.idTatuador,
      dataHorario: sessaoData.dataHorario,
    });
    return response;
  } catch (error) {
    console.error("Erro ao agendar sessão:", error);
    throw error;
  }
};

export const reagendarSessao = async (sessaoData, sessaoId) => {
  try {
    const response = await putMethod(`${URLS.REAGENDAR_SESSAO}/${sessaoId}`, {
      idSessao: sessaoData.idSessao,
      novaDataHorario: sessaoData.novaDataHorario,
      novoStatus: sessaoData.novoStatus,
      produtosConsumidos: sessaoData.produtosConsumidos,
    });
    return response;
  } catch (error) {
    console.error("Erro ao reagendar sessão:", error);
    throw error;
  }
};

export const cancelarSessao = async (sessaoId) => {
  try {
    const response = await deleteMethodWithBody(
      URLS.CANCELAR_SESSAO + `/${sessaoId}`,
      {
        id: sessaoId,
      }
    );
    return response;
  } catch (error) {
    console.error("Erro ao cancelar sessão:", error);
    throw error;
  }
};
