// ============================================
// Rotas de Dados — CRUD para todas as entidades
//
// Este arquivo mapeia os endpoints REST para o controller genérico.
// Cada entidade (usuarios, categorias, produtos) recebe 4 rotas:
//   GET    /api/:entidade       — Lista todos
//   POST   /api/:entidade       — Cria novo item
//   PUT    /api/:entidade/:id   — Atualiza item existente
//   DELETE /api/:entidade/:id   — Remove item
//
// O controller usa o padrão Factory: getAll('usuarios') retorna
// o middleware Express que busca na coleção 'usuarios' do Firestore.
// ============================================

const express = require('express');
const router = express.Router();
const { getAll, create, update, remove } = require('../controllers/dataController');

// ============================================
// Entidades do sistema — cada uma mapeia para uma coleção no Firestore
// Para adicionar uma nova entidade, basta adicionar uma string ao array
// ============================================
const entidades = ['usuarios', 'categorias', 'produtos'];

// ============================================
// Registra as 4 rotas CRUD para cada entidade
// Resultado:
//   GET    /api/usuarios       → dataController.getAll('usuarios')
//   POST   /api/usuarios       → dataController.create('usuarios')
//   PUT    /api/usuarios/:id   → dataController.update('usuarios')
//   DELETE /api/usuarios/:id   → dataController.remove('usuarios')
//   ... (repetido para categorias e produtos)
// ============================================
entidades.forEach((entidade) => {
    router.get(`/${entidade}`, getAll(entidade));
    router.post(`/${entidade}`, create(entidade));
    router.put(`/${entidade}/:id`, update(entidade));
    router.delete(`/${entidade}/:id`, remove(entidade));
});

module.exports = router;
