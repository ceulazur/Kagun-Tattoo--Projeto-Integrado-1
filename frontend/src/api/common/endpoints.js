const API_END_POINT =
  import.meta.env.VITE_API_END_POINT || "http://localhost:3000";

// Endpoints da API
export const URLS = {
  LOGIN: `${API_END_POINT}/auth/login`,
  CADASTRO: `${API_END_POINT}/auth/cadastro`,
  SESSOES: `${API_END_POINT}/sessoes`,
  LISTAR_SESSOES: `${API_END_POINT}/sessoes/listar`,
  AGENDAR_SESSAO: `${API_END_POINT}/sessoes/agendar`,
  REAGENDAR_SESSAO: `${API_END_POINT}/sessoes/reagendar`,
  CANCELAR_SESSAO: `${API_END_POINT}/sessoes/cancelar`,
};
