// ============================================
// CRUD de Categorias — Arquitetura de 3 Camadas
//
// Fluxo de dados:
//   1. React (Apresentação) → Express (Lógica) → Firestore (Dados)
//   2. Se o backend estiver offline, usa localStorage como fallback
//   3. localStorage é SEMPRE sincronizado como redundância/cache
//
// Coleção Firestore: 'categorias'
// Chave localStorage: 'cevada_categorias'
// ============================================

import React, { useState, useEffect } from 'react';
import GenericTable from '../../components/common/GenericTable';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { apiGetAll, apiCreate, apiUpdate, apiDelete } from '../../services/api';

const STORAGE_KEY = 'cevada_categorias';
const ENTIDADE = 'categorias';

const Categories = () => {
  // ==========================================
  // 1️⃣ ESTADO — Lista de categorias (inicia vazio, carrega do backend)
  // ==========================================
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [aviso, setAviso] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // ==========================================
  // 2️⃣ CARREGAMENTO INICIAL — Backend first, localStorage fallback
  // ==========================================
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const response = await apiGetAll(ENTIDADE);
        if (response.success) {
          setCategorias(response.data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
          setAviso('');
          console.log(`[Categories] Dados carregados do Firebase via backend (${response.data.length} itens)`);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.warn('[Categories] Backend indisponível, usando localStorage como fallback:', error.message);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setCategorias(JSON.parse(saved));
        }
        setAviso('⚠️ Modo offline — dados carregados do cache local');
      } finally {
        setIsLoaded(true);
      }
    };

    carregarDados();
  }, []);

  // ==========================================
  // 3️⃣ SINCRONIZAÇÃO — Atualiza localStorage como redundância
  // ==========================================
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categorias));
    }
  }, [categorias, isLoaded]);

  // ==========================================
  // 4️⃣ VALIDAÇÃO
  // ==========================================
  const validate = () => {
    const errs = {};
    if (!nome.trim()) errs.nome = 'O nome da categoria é obrigatório';
    if (!descricao.trim()) errs.descricao = 'A descrição da categoria é obrigatória';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetForm = () => {
    setNome('');
    setDescricao('');
    setEditingId(null);
    setErrors({});
  };

  // ==========================================
  // 5️⃣ CREATE / UPDATE — Backend first, localStorage fallback
  // ==========================================
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const itemData = { nome: nome.trim(), descricao: descricao.trim() };

    if (editingId) {
      // UPDATE
      try {
        const response = await apiUpdate(ENTIDADE, editingId, itemData);
        if (response.success) {
          setCategorias((current) =>
            current.map((cat) =>
              cat.id === editingId ? { ...cat, ...itemData } : cat
            )
          );
          setAviso('');
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.warn('[Categories] Erro ao atualizar no backend, atualizando localmente:', error.message);
        setCategorias((current) =>
          current.map((cat) =>
            cat.id === editingId ? { ...cat, ...itemData } : cat
          )
        );
        setAviso('⚠️ Atualizado localmente — sincronize quando o servidor voltar');
      }
    } else {
      // CREATE
      try {
        const response = await apiCreate(ENTIDADE, itemData);
        if (response.success) {
          setCategorias((current) => [...current, response.data]);
          setAviso('');
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.warn('[Categories] Erro ao criar no backend, criando localmente:', error.message);
        const novaCategoria = { id: `local_${Date.now()}`, ...itemData };
        setCategorias((current) => [...current, novaCategoria]);
        setAviso('⚠️ Criado localmente — sincronize quando o servidor voltar');
      }
    }

    resetForm();
  };

  // ==========================================
  // 6️⃣ EDIT — Preenche formulário com dados do item
  // ==========================================
  const handleEdit = (item) => {
    setEditingId(item.id);
    setNome(item.nome);
    setDescricao(item.descricao);
    setErrors({});
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  // ==========================================
  // 7️⃣ DELETE — Backend first, localStorage fallback
  // ==========================================
  const handleConfirmDelete = async () => {
    if (!deleteModal.item) return;

    const itemToDelete = deleteModal.item;

    try {
      const response = await apiDelete(ENTIDADE, itemToDelete.id);
      if (response.success) {
        setCategorias((current) => current.filter((cat) => cat.id !== itemToDelete.id));
        setAviso('');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.warn('[Categories] Erro ao deletar no backend, removendo localmente:', error.message);
      setCategorias((current) => current.filter((cat) => cat.id !== itemToDelete.id));
      setAviso('⚠️ Removido localmente — sincronize quando o servidor voltar');
    }

    setDeleteModal({ open: false, item: null });
  };

  // ==========================================
  // 8️⃣ COLUNAS DA TABELA
  // ==========================================
  const columns = [
    { header: 'Nome da Categoria', accessor: 'nome' },
    { header: 'Descrição', accessor: 'descricao' },
  ];

  // ==========================================
  // 9️⃣ RENDER
  // ==========================================
  return (
    <div className="container" style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ color: '#fff', marginBottom: '30px' }}>Gerenciamento de Categorias</h1>

      {/* Aviso de modo offline */}
      {aviso && (
        <div style={{
          background: 'rgba(197, 160, 89, 0.2)',
          border: '1px solid var(--cevada-amber, #C5A059)',
          borderRadius: '10px',
          padding: '12px 20px',
          marginBottom: '20px',
          color: 'var(--cevada-amber, #C5A059)',
          fontSize: '0.9em'
        }}>
          {aviso}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: '40px',
          background: 'rgba(255,255,255,0.08)',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 0 40px rgba(0,0,0,0.15)',
        }}
      >
        <InputField
          label="Nome"
          name="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite o nome da categoria"
          error={errors.nome}
        />

        <InputField
          label="Descrição"
          name="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Digite a descrição da categoria"
          error={errors.descricao}
        />

        <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button type="submit" variant="primary">
            {editingId ? 'Atualizar Categoria' : 'Cadastrar Categoria'}
          </Button>
          {editingId && (
            <Button type="button" variant="secondary" onClick={handleCancelEdit}>
              Cancelar Edição
            </Button>
          )}
        </div>
      </form>

      <GenericTable columns={columns} data={categorias} onEdit={handleEdit} onDelete={(item) => setDeleteModal({ open: true, item })} />

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        title="Confirmar exclusão"
        onConfirm={handleConfirmDelete}
      >
        <p style={{ margin: 0 }}>
          Tem certeza de que deseja excluir a categoria "{deleteModal.item?.nome}"?
        </p>
      </Modal>
    </div>
  );
};

export default Categories;
