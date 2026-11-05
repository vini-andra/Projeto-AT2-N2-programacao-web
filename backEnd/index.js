// ============================================
// Backend Entry Point — Servidor Express
//
// Arquitetura de 3 Camadas:
//   Camada de Apresentação: Frontend React (porta 3000)
//   Camada de Lógica:       Este servidor Express (porta 5000)
//   Camada de Dados:        Firebase Firestore (via dataService.js)
//
// As rotas e middlewares ficam em src/app.js, assim os testes
// conseguem usar a API sem subir o servidor.
// ============================================

//o dotenv precisa rodar antes de qualquer require que leia process.env
require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
