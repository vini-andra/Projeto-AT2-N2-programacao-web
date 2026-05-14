const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
console.log('Servidor iniciado com sucesso!');
