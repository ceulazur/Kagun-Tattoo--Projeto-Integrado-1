import { message } from "antd";
import CryptoJS from "crypto-js";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useEffect, useReducer, useState } from "react";
import { loginUser } from "./api/entities/user";

// Cria o contexto de autenticação
const AuthContext = createContext();

// Estado inicial do contexto de autenticação
const initialState = {
  isAuthenticated: false,
  token: null,
};

// Redutor para gerenciar o estado de autenticação
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        token: null,
      };
    case "LOAD_USER":
      return {
        ...state,
        isAuthenticated: !!action.payload.token,
        token: action.payload.token,
      };
    default:
      return state;
  }
};

// Função para criptografar o token
const encryptToken = (token, secretKey) => {
  return CryptoJS.AES.encrypt(token, secretKey).toString();
};

// Função para descriptografar o token
const decryptToken = (encryptedToken, secretKey) => {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Provedor do contexto de autenticação
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [loading, setLoading] = useState(true);
  const secretKey = import.meta.env.VITE_SECRET_KEY;

  // Efeito para carregar o usuário autenticado ao montar o componente
  useEffect(() => {
    const loadUser = () => {
      const encryptedToken = localStorage.getItem("jwt");

      if (encryptedToken) {
        const token = decryptToken(encryptedToken, secretKey);
        const decodedToken = jwtDecode(token);
        const currentTimestamp = Math.floor(Date.now() / 1000);

        // Verifica se o token ainda é válido
        if (decodedToken.exp > currentTimestamp) {
          dispatch({
            type: "LOAD_USER",
            payload: { token },
          });
        } else {
          logout();
        }
      }

      setLoading(false);
    };

    loadUser();

    // Intervalo para verificar a expiração do token a cada minuto
    const interval = setInterval(() => {
      const encryptedToken = localStorage.getItem("jwt");
      if (encryptedToken) {
        const token = decryptToken(encryptedToken, secretKey);
        const decodedToken = jwtDecode(token);
        const currentTimestamp = Math.floor(Date.now() / 1000);

        // Se o token estiver expirado, faz logout e exibe mensagem
        if (decodedToken.exp <= currentTimestamp) {
          message.warning(
            "Sua sessão expirou. Por favor, faça login novamente."
          );
          logout();
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [secretKey]);

  // Função para fazer login
  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      if (data) {
        const { token } = data;
        const encryptedToken = encryptToken(token, secretKey);
        localStorage.setItem("jwt", encryptedToken);
        dispatch({
          type: "LOGIN",
          payload: { token },
        });
        message.success("Login realizado com sucesso!");
      }
      return data;
    } catch (error) {
      message.error("Erro ao realizar login");
      throw error;
    }
  };

  // Função para fazer logout
  const logout = () => {
    localStorage.removeItem("jwt");
    window.location.reload();
    dispatch({ type: "LOGOUT" });
    message.success("Logout realizado com sucesso!");
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
