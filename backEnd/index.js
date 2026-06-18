// ============================================
// Backend Entry Point — Servidor Express
//
// Inicializa o servidor, carrega variáveis de ambiente,
// configura middlewares e registra todas as rotas da API.
//
// Arquitetura de 3 Camadas:
//   Camada de Apresentação: Frontend React (porta 3000)
//   Camada de Lógica:       Este servidor Express (porta 5000)
//   Camada de Dados:        Firebase Firestore (via dataService.js)
// ============================================

// Carrega variáveis de ambiente do .env ANTES de qualquer outro import
// O dotenv lê o arquivo .env e injeta as variáveis em process.env
// Isso é necessário porque o Node.js não carrega .env automaticamente
// (diferente do Create React App que injeta REACT_APP_* em build time)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const dataRoutes = require('./src/routes/dataRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// Middlewares
// cors() — permite requests cross-origin (frontend:3000 → backend:5000)
// express.json() — parseia body de requests como JSON
// ============================================
app.use(cors());
app.use(express.json());

// ============================================
// Inicializa conexão com Firebase Firestore
// Chamado na startup para validar que as credenciais estão corretas
// ============================================
connectDB();

// ============================================
// Rotas da API
//
// /api/login             — Autenticação (authRoutes)
// /api/usuarios          — CRUD de Usuários (dataRoutes)
// /api/categorias        — CRUD de Categorias (dataRoutes)
// /api/produtos          — CRUD de Produtos (dataRoutes)
// ============================================
app.use('/api', authRoutes);
app.use('/api', dataRoutes);

// Root Route — Health check
app.get('/', (req, res) => {
    res.send('Cevada Backend is running! Arquitetura de 3 camadas ativa.');
});

// Server start
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
