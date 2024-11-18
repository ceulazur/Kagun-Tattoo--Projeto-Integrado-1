import { postMethod } from "../common/api_requests";
import { URLS } from "../common/endpoints";

// Função para login do usuário
export const loginUser = async ({ email, password }) => {
  try {
    const response = await postMethod(URLS.LOGIN, { email, password });
    return response.data;
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    throw error;
  }
};

// Função para registrar usuário
export const registerUser = async ({ email, password }) => {
  try {
    const response = await postMethod(URLS.REGISTER, { email, password });
    return response.data;
  } catch (error) {
    console.error("Erro ao realizar cadastro:", error);
    throw error;
  }
};
