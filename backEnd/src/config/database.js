// ============================================
// Configuração do Banco de Dados
// Inicializa a conexão com o Firebase Firestore
// Esta função é chamada no index.js na startup do servidor
// ============================================

const fs = require('fs');
const path = require('path');

const seedDatabase = async () => {
    try {
        const { fetchAll, createItem } = require('../services/dataService');
        const usuarios = await fetchAll('usuarios');
        
        if (usuarios.length === 0) {
            console.log("Banco de dados vazio. Iniciando seed automático com mock_db.json...");
            const mockPath = path.join(__dirname, '../../mock_db.json');
            const mockData = JSON.parse(fs.readFileSync(mockPath, 'utf8'));
            
            const idMap = { usuarios: {}, categorias: {} };
            
            // Popula Usuários
            if (mockData.usuarios) {
                for (const item of mockData.usuarios) {
                    const oldId = item.id;
                    const { id, ...data } = item; // Remove o ID antigo
                    const newItem = await createItem('usuarios', data);
                    idMap.usuarios[oldId] = newItem.id;
                }
            }
            
            // Popula Categorias
            if (mockData.categorias) {
                for (const item of mockData.categorias) {
                    const oldId = item.id;
                    const { id, ...data } = item;
                    const newItem = await createItem('categorias', data);
                    idMap.categorias[oldId] = newItem.id;
                }
            }
            
            // Popula Produtos mantendo relacionamentos
            if (mockData.produtos) {
                for (const item of mockData.produtos) {
                    const { id, ...data } = item;
                    if (data.categoriaId && idMap.categorias[data.categoriaId]) {
                        data.categoriaId = idMap.categorias[data.categoriaId];
                    }
                    if (data.usuarioId && idMap.usuarios[data.usuarioId]) {
                        data.usuarioId = idMap.usuarios[data.usuarioId];
                    }
                    await createItem('produtos', data);
                }
            }
            console.log("✅ Seed automático finalizado com sucesso!");
        }
    } catch (error) {
        console.error("⚠️ Erro ao executar seed automático:", error.message);
    }
};

const connectDB = async () => {
    try {
        // Importa o firebaseConfig para garantir que o Firebase é inicializado
        // O require dispara a execução de initializeApp() e getFirestore()
        const { db } = require('../services/firebaseConfig');
        
        if (db) {
            console.log("✅ Firebase Firestore conectado com sucesso.");
            // Executa o seed automático se necessário
            await seedDatabase();
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
