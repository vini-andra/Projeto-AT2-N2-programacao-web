// cevada/src/services/api.js
const BASE_URL = 'http://localhost:5000/api';

export const loginUser = async (email, idToken) => {
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, idToken })
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, message: 'Erro ao conectar ao servidor' };
    }
};

// Generic CRUD methods
export const fetchData = async (endpoint) => {
    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
};
