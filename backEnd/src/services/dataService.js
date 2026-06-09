// ============================================
// Serviço de Dados — Funções CRUD que comunicam com Firebase Firestore
// Este arquivo fornece funções reutilizáveis para qualquer entidade
// (usuários, categorias, produtos, etc.)
// O backend comunica APENAS com Firebase
// O localStorage como fallback/redundância fica NO FRONTEND (React)
// ============================================

import { db } from './firebaseConfig.js';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

// ============================================
// READ — Busca todos os itens de uma coleção no Firebase
// Parâmetro: collectionName (string) — nome da coleção no Firestore
// Retorna: array de objetos com { id, ...dados }
// Lança erro se Firebase estiver indisponível (frontend trata com fallback)
// ============================================
export const fetchAll = async (collectionName) => {
  try {
    // Busca todos os documentos da coleção no Firestore
    const snapshot = await getDocs(collection(db, collectionName));

    // Mapeia os documentos para objetos com id e dados
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    console.log(`[dataService] Dados carregados do Firebase: ${collectionName}`);
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
export const createItem = async (collectionName, item) => {
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
// Lança erro se Firebase estiver indisponível
// ============================================
export const updateItem = async (collectionName, id, updatedFields) => {
  try {
    // Atualiza apenas os campos especificados (merge, não sobrescreve tudo)
    await updateDoc(doc(db, collectionName, id), updatedFields);

    console.log(`[dataService] Item atualizado em ${collectionName}:`, id);
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
export const deleteItem = async (collectionName, id) => {
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
