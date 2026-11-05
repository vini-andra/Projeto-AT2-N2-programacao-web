const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', dataRoutes);

app.get('/', (req, res) => {
    res.send('Cevada Backend is running! Arquitetura de 3 camadas ativa.');
});

module.exports = app;
