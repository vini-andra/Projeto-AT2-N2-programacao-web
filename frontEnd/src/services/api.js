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

// ============================================
// LOGIN — Envia credenciais ao backend para autenticação
// @param {string} email — e-mail do usuário
// @param {string} idToken — token do Firebase Auth
// @returns {Object} — { success, user, message }
// ============================================
export const loginUser = async (email, idToken, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, idToken, password }),
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, message: 'Erro ao conectar ao servidor' };
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
  const response = await fetch(`${BASE_URL}/${entidade}`);
  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status} ao buscar ${entidade}`);
  }
  return await response.json();
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status} ao criar em ${entidade}`);
  }
  return await response.json();
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedFields),
  });
  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status} ao atualizar em ${entidade}`);
  }
  return await response.json();
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
  });
  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status} ao deletar de ${entidade}`);
  }
  return await response.json();
};
