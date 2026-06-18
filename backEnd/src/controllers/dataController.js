// ============================================
// Controller de Dados — CRUD Genérico
//
// Este controller fornece funções CRUD que funcionam para QUALQUER entidade
// (usuarios, categorias, produtos). O nome da coleção no Firestore é
// determinado pelo parâmetro recebido das rotas.
//
// Padrão: Cada função retorna um FACTORY que gera o middleware Express.
// Exemplo: getAll('usuarios') retorna (req, res) => { ... }
//
// Camada de Lógica de Negócios — recebe requests HTTP,
// delega ao dataService (camada de dados) e retorna respostas JSON.
// ============================================

const { fetchAll, createItem, updateItem, deleteItem } = require('../services/dataService');

// ============================================
// GET ALL — Lista todos os itens de uma coleção
// Rota: GET /api/:entidade
// Resposta sucesso: { success: true, data: [...] }
// Resposta erro: { success: false, message: '...' }
// ============================================
const getAll = (collectionName) => {
    return async (req, res) => {
        try {
            const data = await fetchAll(collectionName);
            return res.json({ success: true, data });
        } catch (error) {
            console.error(`[dataController] Erro ao buscar ${collectionName}:`, error.message);
            return res.status(500).json({ 
                success: false, 
                message: `Erro ao buscar dados de ${collectionName}` 
            });
        }
    };
};

// ============================================
// CREATE — Cria um novo item na coleção
// Rota: POST /api/:entidade
// Body: { campo1: valor1, campo2: valor2, ... }
// Resposta sucesso: { success: true, data: { id, ...campos } }
// Resposta erro: { success: false, message: '...' }
// ============================================
const create = (collectionName) => {
    return async (req, res) => {
        try {
            const item = req.body;

            // Validação básica — o body não pode estar vazio
            if (!item || Object.keys(item).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'O corpo da requisição não pode estar vazio'
                });
            }

            const newItem = await createItem(collectionName, item);
            return res.status(201).json({ success: true, data: newItem });
        } catch (error) {
            console.error(`[dataController] Erro ao criar em ${collectionName}:`, error.message);
            return res.status(500).json({ 
                success: false, 
                message: `Erro ao criar item em ${collectionName}` 
            });
        }
    };
};

// ============================================
// UPDATE — Atualiza um item existente na coleção
// Rota: PUT /api/:entidade/:id
// Params: id — ID do documento no Firestore
// Body: { campo1: novoValor, ... }
// Resposta sucesso: { success: true, data: { id, ...camposAtualizados } }
// Resposta erro: { success: false, message: '...' }
// ============================================
const update = (collectionName) => {
    return async (req, res) => {
        try {
            const { id } = req.params;
            const updatedFields = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'O ID do item é obrigatório'
                });
            }

            if (!updatedFields || Object.keys(updatedFields).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Os campos a atualizar não podem estar vazios'
                });
            }

            const result = await updateItem(collectionName, id, updatedFields);
            return res.json({ success: true, data: result });
        } catch (error) {
            console.error(`[dataController] Erro ao atualizar em ${collectionName}:`, error.message);
            return res.status(500).json({ 
                success: false, 
                message: `Erro ao atualizar item em ${collectionName}` 
            });
        }
    };
};

// ============================================
// DELETE — Remove um item da coleção
// Rota: DELETE /api/:entidade/:id
// Params: id — ID do documento no Firestore
// Resposta sucesso: { success: true, message: 'Item removido' }
// Resposta erro: { success: false, message: '...' }
// ============================================
const remove = (collectionName) => {
    return async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'O ID do item é obrigatório'
                });
            }

            await deleteItem(collectionName, id);
            return res.json({ success: true, message: `Item removido de ${collectionName}` });
        } catch (error) {
            console.error(`[dataController] Erro ao deletar de ${collectionName}:`, error.message);
            return res.status(500).json({ 
                success: false, 
                message: `Erro ao remover item de ${collectionName}` 
            });
        }
    };
};

module.exports = { getAll, create, update, remove };
