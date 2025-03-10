const API_END_POINT =
  import.meta.env.VITE_API_END_POINT || "http://localhost:3000";

export const URLS = {
  LOGIN: `${API_END_POINT}/auth/login`,
  CADASTRO: `${API_END_POINT}/tatuadores/cadastrar`,
  SESSOES: `${API_END_POINT}/sessoes`,
  LISTAR_SESSOES: `${API_END_POINT}/sessoes/listar`,
  AGENDAR_SESSAO: `${API_END_POINT}/sessoes/agendar`,
  REAGENDAR_SESSAO: `${API_END_POINT}/sessoes`,
  CANCELAR_SESSAO: `${API_END_POINT}/sessoes/excluir`,
  CRIAR_USUARIO: `${API_END_POINT}/clientes/cadastrar`,
  LISTAR_USUARIOS: `${API_END_POINT}/clientes/listar`,
  BUSCAR_USUARIO_POR_ID: `${API_END_POINT}/clientes/`,
  ATUALIZAR_USUARIO: `${API_END_POINT}/clientes/`,
  DELETAR_USUARIO: `${API_END_POINT}/clientes/`,

  FORNECEDORES: `${API_END_POINT}/fornecedores`,
  LISTAR_FORNECEDORES: `${API_END_POINT}/fornecedores/listar`,
  CADASTRAR_FORNECEDOR: `${API_END_POINT}/fornecedores/cadastrar`,
  ATUALIZAR_FORNECEDOR: `${API_END_POINT}/fornecedores/`,
  EXCLUIR_FORNECEDOR: `${API_END_POINT}/fornecedores/`,

  PRODUTOS: `${API_END_POINT}/produtos`,
  LISTAR_PRODUTOS: `${API_END_POINT}/produtos/listar`,
  CADASTRAR_PRODUTO: `${API_END_POINT}/produtos/cadastrar`,
  ATUALIZAR_PRODUTO: `${API_END_POINT}/produtos/`,
  EXCLUIR_PRODUTO: `${API_END_POINT}/produtos/`,
};
