const express = require('express');
const app = express();
const path = require('path');

// Configurando o Express para usar arquivos estáticos (HTML, CSS, JavaScript)
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para a soma
app.get('/somar', (req, res) => {
  // Recuperando os números enviados pelo formulário
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);
  
  // Realizando a soma
  const resultado = num1 + num2;
  
  // Enviando o resultado como resposta
  res.send(`A soma de ${num1} e ${num2} é ${resultado}`);
});

// Iniciando o servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
