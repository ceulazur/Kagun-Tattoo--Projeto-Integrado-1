import { postMethod } from "../common/api_requests";
import { URLS } from "../common/endpoints";

// Função para login do usuário
export const loginUser = async (email, password) => {
  try {
    const response = await postMethod(URLS.LOGIN, {
      email: email,
      senha: password,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    throw error;
  }
};

// Função para registrar usuário
export const registerUser = async (cpf, nome, email, telefone, password) => {
  try {
    const response = await postMethod(URLS.CADASTRO, {
      cpf: cpf,
      nome: nome,
      email: email,
      telefone: telefone,
      senha: password,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao realizar cadastro:", error);
    throw error;
  }
};
