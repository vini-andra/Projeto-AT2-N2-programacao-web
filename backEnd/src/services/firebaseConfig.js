// ============================================
// Configuração do Firebase — Inicializa a aplicação Firebase
// ============================================

const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const projectId = process.env.FIREBASE_PROJECT_ID;

let db = null;
let app = null;

if (projectId) {
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: projectId,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  };

  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} else {
  console.warn('⚠️ FIREBASE_PROJECT_ID ausente. O banco de dados operará em modo offline simulado (erros forçados).');
}

module.exports = { db, app };
