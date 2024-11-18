const API_END_POINT =
  import.meta.env.VITE_API_END_POINT || "http://localhost:8080";

// Endpoints da API
export const URLS = {
  LOGIN: `${API_END_POINT}/login`,
  REGISTER: `${API_END_POINT}/register`, // Adicionei o endpoint de registro
};
