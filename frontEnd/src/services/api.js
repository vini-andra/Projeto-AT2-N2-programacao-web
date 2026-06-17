// ============================================
// Serviço de API — Frontend
// Funções para comunicação com o backend Express
// ============================================

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * loginUser — Envia credenciais ao backend para autenticação
 * @param {string} email — e-mail do usuário
 * @param {string} idToken — token do Firebase Auth
 * @returns {Object} — { success, user, message }
 */
export const loginUser = async (email, idToken) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, idToken }),
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, message: 'Erro ao conectar ao servidor' };
  }
};

/**
 * fetchData — Busca dados genéricos do backend
 * @param {string} endpoint — endpoint da API
 * @returns {Array} — dados retornados ou array vazio
 */
export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
};
