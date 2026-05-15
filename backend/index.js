// backend/index.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');

// Import Routes
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Prepare Database
connectDB();

// API Routes
app.use('/api', authRoutes);

// Placeholders para os CRUDs (Outros Integrantes)
app.use('/api/usuarios', (req, res) => res.json({ message: 'Rota de Usuários (Pendente)' }));
app.use('/api/categorias', (req, res) => res.json({ message: 'Rota de Categorias (Pendente)' }));
app.use('/api/produtos', (req, res) => res.json({ message: 'Rota de Produtos (Pendente)' }));
app.use('/api/relatorio', (req, res) => res.json({ message: 'Rota de Relatórios (Pendente)' }));

// Root Route
app.get('/', (req, res) => {
    res.send('Cevada Backend is running! Base structure ready.');
});

// Server start
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
