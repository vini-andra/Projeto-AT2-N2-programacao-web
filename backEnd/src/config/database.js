// ============================================
// Configuração do Banco de Dados
// Inicializa a conexão com o Firebase Firestore
// Esta função é chamada no index.js na startup do servidor
// ============================================

const connectDB = async () => {
    try {
        // Importa o firebaseConfig para garantir que o Firebase é inicializado
        // O require dispara a execução de initializeApp() e getFirestore()
        const { db } = require('../services/firebaseConfig');
        
        if (db) {
            console.log("✅ Firebase Firestore conectado com sucesso.");
        } else {
            console.warn("⚠️ Firebase Firestore não foi inicializado. Verifique o .env");
        }
    } catch (error) {
        console.error("❌ Erro ao conectar ao Firebase Firestore:", error.message);
        // Não faz process.exit(1) para permitir que o servidor suba
        // mesmo sem Firebase — o frontend usará localStorage como fallback
    }
};

module.exports = connectDB;
