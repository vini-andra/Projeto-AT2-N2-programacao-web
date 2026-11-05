// ============================================
// Serviço de API — Frontend
// Funções para comunicação com o backend Express
//
// Todas as funções seguem o padrão:
//   1. Tenta fazer a requisição ao backend
//   2. Se o backend responder, retorna os dados
//   3. Se falhar (backend offline), lança erro para que
//      a page trate com localStorage como fallback
//
// O frontend NUNCA acessa o Firebase diretamente para dados CRUD.
// O caminho é sempre: React → Express → Firestore
// ============================================

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'cevada_token';

export const salvarToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

const cabecalhos = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const base = { 'Content-Type': 'application/json' };
  return token ? { ...base, Authorization: `Bearer ${token}` } : base;
};

let aoExpirarSessao = () => {};

export const quandoSessaoExpirar = (callback) => {
  aoExpirarSessao = callback;
};

//401 aqui é token vencido ou inválido, não servidor fora do ar
const lerResposta = (response, acao) => {
  if (response.status === 401) aoExpirarSessao();
  if (!response.ok) throw new Error(`Erro HTTP ${response.status} ${acao}`);
  return response.json();
};

// ============================================
// LOGIN — Envia credenciais ao backend para autenticação
// @param {string} email — e-mail do usuário
// @param {string} idToken — token do Firebase Auth
// @returns {Object} — { success, user, token, message }
// Se der certo, guarda o token para as próximas chamadas
// ============================================
export const loginUser = async (email, idToken, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, idToken, password }),
    });
    const resultado = await response.json();
    if (resultado.success) salvarToken(resultado.token);
    return resultado;
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, offline: true, message: 'Erro ao conectar ao servidor' };
  }
};

// ============================================
// CRUD GENÉRICO — Funções reutilizáveis para qualquer entidade
// Cada função comunica com o backend via HTTP REST:
//   GET    /api/{entidade}       → apiGetAll
//   POST   /api/{entidade}       → apiCreate
//   PUT    /api/{entidade}/{id}  → apiUpdate
//   DELETE /api/{entidade}/{id}  → apiDelete
// ============================================

/**
 * apiGetAll — Busca todos os itens de uma entidade
 * @param {string} entidade — nome da entidade ('usuarios', 'categorias', 'produtos')
 * @returns {Object} — { success: boolean, data: Array }
 * @throws {Error} — se o backend estiver offline
 */
export const apiGetAll = async (entidade) => {
  const response = await fetch(`${BASE_URL}/${entidade}`, { headers: cabecalhos() });
  return lerResposta(response, `ao buscar ${entidade}`);
};

/**
 * apiCreate — Cria um novo item
 * @param {string} entidade — nome da entidade
 * @param {Object} item — dados do novo item (sem id, o Firestore gera)
 * @returns {Object} — { success: boolean, data: { id, ...item } }
 * @throws {Error} — se o backend estiver offline
 */
export const apiCreate = async (entidade, item) => {
  const response = await fetch(`${BASE_URL}/${entidade}`, {
    method: 'POST',
    headers: cabecalhos(),
    body: JSON.stringify(item),
  });
  return lerResposta(response, `ao criar em ${entidade}`);
};

/**
 * apiUpdate — Atualiza um item existente
 * @param {string} entidade — nome da entidade
 * @param {string} id — ID do documento no Firestore
 * @param {Object} updatedFields — campos a atualizar
 * @returns {Object} — { success: boolean, data: { id, ...campos } }
 * @throws {Error} — se o backend estiver offline
 */
export const apiUpdate = async (entidade, id, updatedFields) => {
  const response = await fetch(`${BASE_URL}/${entidade}/${id}`, {
    method: 'PUT',
    headers: cabecalhos(),
    body: JSON.stringify(updatedFields),
  });
  return lerResposta(response, `ao atualizar em ${entidade}`);
};

/**
 * apiDelete — Remove um item
 * @param {string} entidade — nome da entidade
 * @param {string} id — ID do documento no Firestore
 * @returns {Object} — { success: boolean, message: string }
 * @throws {Error} — se o backend estiver offline
 */
export const apiDelete = async (entidade, id) => {
  const response = await fetch(`${BASE_URL}/${entidade}/${id}`, {
    method: 'DELETE',
    headers: cabecalhos(),
  });
  return lerResposta(response, `ao deletar de ${entidade}`);
};
