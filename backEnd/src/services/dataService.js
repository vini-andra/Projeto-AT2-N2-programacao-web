// ============================================
// Serviço de Dados — Funções CRUD que comunicam com Firebase Firestore
// Este arquivo fornece funções reutilizáveis para qualquer entidade
//
// MOCK FALLBACK: Se o Firebase não estiver configurado (sem .env),
// o sistema automaticamente cai para o mock_db.json.
// ============================================

const { db } = require('./firebaseConfig.js');
const {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Caminho para o mock_db.json na raiz do backend
const mockDbPath = path.join(__dirname, '../../mock_db.json');

// Função auxiliar para ler o banco de dados JSON
const readDB = () => {
  try {
    const data = fs.readFileSync(mockDbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('[dataService] Erro ao ler mock_db.json:', error);
    return {};
  }
};

// Função auxiliar para salvar no banco de dados JSON
const writeDB = (data) => {
  try {
    fs.writeFileSync(mockDbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('[dataService] Erro ao escrever no mock_db.json:', error);
    throw error;
  }
};

// ============================================
// READ — Busca todos os itens de uma coleção no Firebase
// Parâmetro: collectionName (string) — nome da coleção no Firestore
// Retorna: array de objetos com { id, ...dados }
// Lança erro se Firebase estiver indisponível (frontend trata com fallback)
// ============================================
const fetchAll = async (collectionName) => {
  if (!db) {
    console.warn(`[dataService] Firebase não configurado. Usando mock_db.json para ${collectionName}`);
    const mockDb = readDB();
    return mockDb[collectionName] || [];
  }
  try {
    // Busca todos os documentos da coleção no Firestore
    const snapshot = await getDocs(collection(db, collectionName));

    // Mapeia os documentos para objetos com id e dados
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    console.log(`[dataService] Dados carregados do Firebase: ${collectionName} (${data.length} itens)`);
    return data;
  } catch (error) {
    // Lança o erro para que o frontend trate com localStorage como fallback
    console.error(`[dataService] Erro ao buscar "${collectionName}" do Firebase:`, error);
    throw error;
  }
};

// ============================================
// CREATE — Adiciona um novo item à coleção no Firebase
// Parâmetros:
//   - collectionName (string) — nome da coleção
//   - item (object) — dados do novo item
// Retorna: objeto criado com { id, ...item }
// Lança erro se Firebase estiver indisponível
// ============================================
const createItem = async (collectionName, item) => {
  if (!db) {
    console.warn(`[dataService] Firebase não configurado. Criando item no mock_db.json (${collectionName})`);
    const mockDb = readDB();
    
    if (!mockDb[collectionName]) mockDb[collectionName] = [];

    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      ...item
    };

    mockDb[collectionName].push(newItem);
    writeDB(mockDb);
    return newItem;
  }
  try {
    // Adiciona o documento ao Firestore
    const docRef = await addDoc(collection(db, collectionName), item);

    // Retorna o item com o ID gerado pelo Firestore
    const newItem = { id: docRef.id, ...item };

    console.log(`[dataService] Item criado em ${collectionName}:`, newItem.id);
    return newItem;
  } catch (error) {
    // Lança o erro para que o frontend trate apropriadamente
    console.error(`[dataService] Erro ao criar item em "${collectionName}":`, error);
    throw error;
  }
};

// ============================================
// UPDATE — Atualiza um item existente no Firebase
// Parâmetros:
//   - collectionName (string) — nome da coleção
//   - id (string) — ID do documento a atualizar
//   - updatedFields (object) — campos a atualizar
// Retorna: objeto com os campos atualizados + id
// Lança erro se Firebase estiver indisponível
// ============================================
const updateItem = async (collectionName, id, updatedFields) => {
  if (!db) {
    console.warn(`[dataService] Firebase não configurado. Atualizando item no mock_db.json (${collectionName})`);
    const mockDb = readDB();
    
    if (!mockDb[collectionName]) throw new Error(`Coleção ${collectionName} não encontrada no mock_db`);

    const index = mockDb[collectionName].findIndex(item => item.id === id);
    if (index === -1) throw new Error(`Item ${id} não encontrado em ${collectionName}`);

    mockDb[collectionName][index] = { ...mockDb[collectionName][index], ...updatedFields };
    writeDB(mockDb);
    return mockDb[collectionName][index];
  }
  try {
    // Atualiza apenas os campos especificados (merge, não sobrescreve tudo)
    await updateDoc(doc(db, collectionName, id), updatedFields);

    console.log(`[dataService] Item atualizado em ${collectionName}:`, id);
    return { id, ...updatedFields };
  } catch (error) {
    // Lança o erro para que o frontend trate apropriadamente
    console.error(`[dataService] Erro ao atualizar item em "${collectionName}":`, error);
    throw error;
  }
};

// ============================================
// DELETE — Remove um item do Firebase
// Parâmetros:
//   - collectionName (string) — nome da coleção
//   - id (string) — ID do documento a deletar
// Lança erro se Firebase estiver indisponível
// ============================================
const deleteItem = async (collectionName, id) => {
  if (!db) {
    console.warn(`[dataService] Firebase não configurado. Deletando item do mock_db.json (${collectionName})`);
    const mockDb = readDB();
    
    if (!mockDb[collectionName]) throw new Error(`Coleção ${collectionName} não encontrada no mock`);

    const initialLength = mockDb[collectionName].length;
    mockDb[collectionName] = mockDb[collectionName].filter(item => item.id !== id);

    if (mockDb[collectionName].length === initialLength) {
      throw new Error(`Item ${id} não encontrado em ${collectionName}`);
    }

    writeDB(mockDb);
    return;
  }
  try {
    // Deleta o documento do Firestore
    await deleteDoc(doc(db, collectionName, id));

    console.log(`[dataService] Item deletado de ${collectionName}:`, id);
  } catch (error) {
    // Lança o erro para que o frontend trate apropriadamente
    console.error(`[dataService] Erro ao deletar item de "${collectionName}":`, error);
    throw error;
  }
};

module.exports = { fetchAll, createItem, updateItem, deleteItem };
