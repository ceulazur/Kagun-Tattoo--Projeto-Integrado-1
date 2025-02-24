import axios from "axios";
import CryptoJS from "crypto-js";

// Função para descriptografar token
const decryptToken = (encryptedToken) => {
  const secretKey = import.meta.env.VITE_SECRET_KEY;
  const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const API_BASE_URL =
  import.meta.env.VITE_API_END_POINT || "http://localhost:8080";

// Cria instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Adiciona interceptor de requisição
api.interceptors.request.use(
  (config) => {
    const encryptedToken = localStorage.getItem("jwt");
    if (encryptedToken) {
      const token = decryptToken(encryptedToken);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Função para detectar se está rodando no Electron
function isElectron() {
  return !!(
    navigator &&
    navigator.userAgent &&
    navigator.userAgent.indexOf("Electron") !== -1
  );
}

// Função para lidar com erros
const handleError = (error) => {
  console.error("Erro Inesperado: ", error);

  if (axios.isAxiosError(error)) {
    // Verifica se o erro é de resposta da API
    if (error.response) {
      // Se o status for 401 (não autorizado), limpa o localStorage e redireciona para login
      if (!isElectron()) {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        } else {
          // Loga outros erros de resposta
          console.error(
            `Erro ${error.response.status}: ${error.response.data}`
          );
        }
      }
    } else if (!isElectron() && error.code === "ERR_NETWORK") {
      // Lida com erros de rede
      console.error("Erro de rede:", error);
      window.location.href = "/error";
    }
  } else {
    // Lida com outros tipos de erros
    console.error("Erro ao conectar com o servidor. Verifique sua conexão.");
    console.log(error);
    if (!isElectron()) {
      window.location.href = "/error";
    }
  }

  throw error;
};

// Função para fazer requisições à API
const request = async (method, url, data = null, params = null) => {
  try {
    const response = await api.request({ method, url, data, params });
    return response;
  } catch (error) {
    return handleError(error);
  }
};

// Métodos exportados para requisições à API
export const postMethod = (url, entity) => request("post", url, entity);
export const getMethod = (url) => request("get", url);
export const getMethodWithParams = (url, params) =>
  request("get", url, null, params);
export const putMethod = (url, entity) => request("put", url, entity);
export const deleteMethod = (url) => request("delete", url);
export const deleteMethodWithBody = (url, data) => request("delete", url, data);
