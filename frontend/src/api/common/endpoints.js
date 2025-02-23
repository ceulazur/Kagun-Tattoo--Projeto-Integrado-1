const API_END_POINT =
  import.meta.env.VITE_API_END_POINT || "http://localhost:3000";

// Endpoints da API
export const URLS = {
  LOGIN: `${API_END_POINT}/auth/login`,
  CADASTRO: `${API_END_POINT}/tatuadores/cadastrar`,
  SESSOES: `${API_END_POINT}/sessoes`,
  LISTAR_SESSOES: `${API_END_POINT}/sessoes/listar`,
  AGENDAR_SESSAO: `${API_END_POINT}/sessoes/agendar`,
  REAGENDAR_SESSAO: `${API_END_POINT}/sessoes/reagendar`,
  CANCELAR_SESSAO: `${API_END_POINT}/sessoes/cancelar`,

  // endpoints para fornecedores
  FORNECEDORES: `${API_END_POINT}/fornecedores`,
  LISTAR_FORNECEDORES: `${API_END_POINT}/fornecedores/listar`,
  CADASTRAR_FORNECEDOR: `${API_END_POINT}/fornecedores/cadastrar`,
  ATUALIZAR_FORNECEDOR: `${API_END_POINT}/fornecedores/atualizar`,
  EXCLUIR_FORNECEDOR: `${API_END_POINT}/fornecedores/excluir`,
};

