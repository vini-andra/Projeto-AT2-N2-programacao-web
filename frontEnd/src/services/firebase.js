// ============================================
// Configuração do Firebase — Frontend
// Inicializa a aplicação Firebase com as credenciais do .env
// Exporta as instâncias de Auth e Firestore para uso no frontend
// ============================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ============================================
// Objeto de configuração do Firebase
// As credenciais vêm das variáveis de ambiente REACT_APP_*
// Configuradas no arquivo .env (baseado no .env.example)
// ============================================
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// ============================================
// Inicialização condicional do Firebase
// Se a API key não estiver definida (.env ausente), NÃO inicializa
// para evitar crash — o app roda em modo mock via AuthContext
// ============================================
let app = null;
let auth = null;
let db = null;

if (process.env.REACT_APP_FIREBASE_API_KEY) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.warn(
    '⚠️ Firebase NÃO inicializado: REACT_APP_FIREBASE_API_KEY não encontrado.\n' +
    '   Crie o arquivo .env baseado no .env.example para ativar o Firebase.'
  );
}

// Exporta instâncias para uso no frontend (podem ser null em modo mock)
export { auth, db };
export default app;
