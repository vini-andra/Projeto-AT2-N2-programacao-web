// ============================================
// Configuração do Firebase — Inicializa a aplicação Firebase
// Este arquivo configura as credenciais do Firebase usando variáveis de ambiente
// e exporta a instância do Firestore para ser usada em outras partes da aplicação
//
// NOTA: Convertido de ESM (import/export) para CommonJS (require/module.exports)
// pois o package.json do backend usa "type": "commonjs"
// ============================================

const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

// ============================================
// Objeto de configuração do Firebase
// As credenciais vêm das variáveis de ambiente (.env)
// carregadas pelo dotenv no index.js
// para evitar expor chaves sensíveis no repositório
// ============================================
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// ============================================
// Inicializa a aplicação Firebase com as credenciais configuradas
// ============================================
const app = initializeApp(firebaseConfig);

// ============================================
// Exporta a instância do Firestore para ser usada nos serviços de dados
// Esta será importada em dataService.js para executar operações CRUD
// ============================================
const db = getFirestore(app);

module.exports = { db, app };
