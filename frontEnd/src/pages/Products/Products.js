// ============================================
// CRUD de Produtos — Arquitetura de 3 Camadas
//
// INTEGRAÇÃO: Os produtos são salvos na coleção 'produtos' do Firestore com o formato:
// { id, nome, preco, categoriaId, usuarioId }
// O módulo de Relatório usa categoriaId e usuarioId para fazer o JOIN.
//
// Fluxo de dados:
//   1. React (Apresentação) → Express (Lógica) → Firestore (Dados)
//   2. Se o backend estiver offline, usa localStorage como fallback
//   3. localStorage é SEMPRE sincronizado como redundância/cache
//
// Coleção Firestore: 'produtos'
// Chave localStorage: 'cevada_produtos'
// Dependências: 'cevada_categorias' e 'cevada_usuarios' (para popular selects)
// ============================================

import React, { useState, useEffect } from 'react';
import GenericTable from '../../components/common/GenericTable';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { apiGetAll, apiCreate, apiUpdate, apiDelete } from '../../services/api';

// Chaves do localStorage — COMBINADO DO GRUPO
const STORAGE_KEY = 'cevada_produtos';
const CATEGORIAS_KEY = 'cevada_categorias';
const USUARIOS_KEY = 'cevada_usuarios';

const ENTIDADE = 'produtos';

const Products = () => {
  // ==========================================
  // 1️⃣ ESTADO PRINCIPAL — Lista de produtos
  // ==========================================
  const [produtos, setProdutos] = useState([]);

  // ==========================================
  // 2️⃣ DADOS DAS OUTRAS ENTIDADES (para popular os selects)
  // ==========================================
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // ==========================================
  // 3️⃣ CAMPOS DO FORMULÁRIO
  // ==========================================
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [usuarioId, setUsuarioId] = useState('');

  // ==========================================
  // 4️⃣ CONTROLES DE EDIÇÃO, ERROS, MODAL E AVISO
  // ==========================================
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [aviso, setAviso] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // ==========================================
  // 5️⃣ CARREGAMENTO INICIAL — Backend first, localStorage fallback
  // Carrega produtos, categorias e usuários do backend
  // ==========================================
  useEffect(() => {
    const carregarDados = async () => {
      // --- Carregar Produtos ---
      try {
        const response = await apiGetAll(ENTIDADE);
        if (response.success) {
          setProdutos(response.data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
          console.log(`[Products] Produtos carregados do Firebase via backend (${response.data.length} itens)`);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.warn('[Products] Backend indisponível para produtos, usando localStorage:', error.message);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setProdutos(JSON.parse(saved));
        setAviso('⚠️ Modo offline — dados carregados do cache local');
      }

      // --- Carregar Categorias (para os selects) ---
      try {
        const response = await apiGetAll('categorias');
        if (response.success) {
          setCategorias(response.data);
          localStorage.setItem(CATEGORIAS_KEY, JSON.stringify(response.data));
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.warn('[Products] Usando categorias do localStorage:', error.message);
        const saved = localStorage.getItem(CATEGORIAS_KEY);
        if (saved) setCategorias(JSON.parse(saved));
      }

      // --- Carregar Usuários (para os selects) ---
      try {
        const response = await apiGetAll('usuarios');
        if (response.success) {
          setUsuarios(response.data);
          localStorage.setItem(USUARIOS_KEY, JSON.stringify(response.data));
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.warn('[Products] Usando usuários do localStorage:', error.message);
        const saved = localStorage.getItem(USUARIOS_KEY);
        if (saved) setUsuarios(JSON.parse(saved));
      } finally {
        setIsLoaded(true);
      }
    };

    carregarDados();
  }, []);

  // ==========================================
  // 6️⃣ SINCRONIZAÇÃO — Atualiza localStorage como redundância
  // ==========================================
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
    }
  }, [produtos, isLoaded]);

  // ==========================================
  // 7️⃣ RECARREGAR DADOS EXTERNOS — Para refresh dos selects
  // Tenta backend primeiro, cai no localStorage se falhar
  // ==========================================
  const carregarDadosExternos = async () => {
    try {
      const [catRes, userRes] = await Promise.all([
        apiGetAll('categorias'),
        apiGetAll('usuarios'),
      ]);
      if (catRes.success) {
        setCategorias(catRes.data);
        localStorage.setItem(CATEGORIAS_KEY, JSON.stringify(catRes.data));
      }
      if (userRes.success) {
        setUsuarios(userRes.data);
        localStorage.setItem(USUARIOS_KEY, JSON.stringify(userRes.data));
      }
    } catch (error) {
      // Fallback silencioso para localStorage
      const cats = localStorage.getItem(CATEGORIAS_KEY);
      const users = localStorage.getItem(USUARIOS_KEY);
      if (cats) setCategorias(JSON.parse(cats));
      if (users) setUsuarios(JSON.parse(users));
    }
  };

  // ==========================================
  // 8️⃣ VALIDAÇÃO — Checa campos obrigatórios
  // ==========================================
  const validate = () => {
    const errs = {};

    if (!nome.trim()) errs.nome = 'O nome do produto é obrigatório';

    if (!preco) {
      errs.preco = 'O preço é obrigatório';
    } else if (isNaN(parseFloat(preco)) || parseFloat(preco) <= 0) {
      errs.preco = 'O preço deve ser um número maior que zero';
    }

    if (!categoriaId) errs.categoriaId = 'Selecione uma categoria';
    if (!usuarioId) errs.usuarioId = 'Selecione um usuário responsável';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ==========================================
  // 9️⃣ RESET DO FORMULÁRIO
  // ==========================================
  const resetForm = () => {
    setNome('');
    setPreco('');
    setCategoriaId('');
    setUsuarioId('');
    setEditingId(null);
    setErrors({});
  };

  // ==========================================
  // 🔟 SUBMIT — Cria ou atualiza produto (Backend first)
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Recarregar dados externos antes de validar
    await carregarDadosExternos();

    if (!validate()) return;

    const itemData = {
      nome: nome.trim(),
      preco: parseFloat(preco),
      categoriaId,
      usuarioId,
    };

    if (editingId) {
      // UPDATE
      try {
        const response = await apiUpdate(ENTIDADE, editingId, itemData);
        if (response.success) {
          setProdutos((current) =>
            current.map((prod) =>
              prod.id === editingId ? { ...prod, ...itemData } : prod
            )
          );
          setAviso('');
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.warn('[Products] Erro ao atualizar no backend, atualizando localmente:', error.message);
        setProdutos((current) =>
          current.map((prod) =>
            prod.id === editingId ? { ...prod, ...itemData } : prod
          )
        );
        setAviso('⚠️ Atualizado localmente — sincronize quando o servidor voltar');
      }
    } else {
      // CREATE
      try {
        const response = await apiCreate(ENTIDADE, itemData);
        if (response.success) {
          setProdutos((current) => [...current, response.data]);
          setAviso('');
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.warn('[Products] Erro ao criar no backend, criando localmente:', error.message);
        const novoProduto = { id: `local_${Date.now()}`, ...itemData };
        setProdutos((current) => [...current, novoProduto]);
        setAviso('⚠️ Criado localmente — sincronize quando o servidor voltar');
      }
    }

    resetForm();
  };

  // ==========================================
  // 1️⃣1️⃣ EDIÇÃO — Preenche formulário com dados existentes
  // ==========================================
  const handleEdit = async (item) => {
    await carregarDadosExternos();

    setEditingId(item.id);
    setNome(item.nome);
    setPreco(String(item.preco));
    setCategoriaId(item.categoriaId);
    setUsuarioId(item.usuarioId);
    setErrors({});
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  // ==========================================
  // 1️⃣2️⃣ EXCLUSÃO — Backend first, localStorage fallback
  // ==========================================
  const handleConfirmDelete = async () => {
    if (!deleteModal.item) return;

    const itemToDelete = deleteModal.item;

    try {
      const response = await apiDelete(ENTIDADE, itemToDelete.id);
      if (response.success) {
        setProdutos((current) =>
          current.filter((prod) => prod.id !== itemToDelete.id)
        );
        setAviso('');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.warn('[Products] Erro ao deletar no backend, removendo localmente:', error.message);
      setProdutos((current) =>
        current.filter((prod) => prod.id !== itemToDelete.id)
      );
      setAviso('⚠️ Removido localmente — sincronize quando o servidor voltar');
    }

    setDeleteModal({ open: false, item: null });
  };

  // ==========================================
  // 1️⃣3️⃣ PREPARAÇÃO DOS DADOS PARA A TABELA
  // Resolve as FKs — mostra NOME em vez de ID
  // ==========================================
  const produtosComNomes = produtos.map((prod) => ({
    ...prod,
    precoFormatado: `R$ ${Number(prod.preco).toFixed(2)}`,
    categoriaNome:
      categorias.find((c) => c.id === prod.categoriaId)?.nome || 'Sem categoria',
    usuarioNome:
      usuarios.find((u) => u.id === prod.usuarioId)?.nome || 'Desconhecido',
  }));

  // Colunas da GenericTable
  const columns = [
    { header: 'Produto', accessor: 'nome' },
    { header: 'Preço', accessor: 'precoFormatado' },
    { header: 'Categoria', accessor: 'categoriaNome' },
    { header: 'Cadastrado por', accessor: 'usuarioNome' },
  ];

  // ==========================================
  // 1️⃣4️⃣ RENDER
  // ==========================================
  return (
    <div
      className="container"
      style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column' }}
    >
      <h1 style={{ color: '#fff', marginBottom: '30px' }}>
        Gerenciamento de Produtos
      </h1>

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

      {/* ---- FORMULÁRIO DE CADASTRO / EDIÇÃO ---- */}
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
        {/* Campo: Nome do produto */}
        <InputField
          label="Nome do Produto"
          name="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite o nome do produto"
          error={errors.nome}
        />

        {/* Campo: Preço */}
        <InputField
          label="Preço (R$)"
          name="preco"
          type="number"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          placeholder="Ex: 29.90"
          error={errors.preco}
        />

        {/* Campo: Categoria (SELECT — chave estrangeira) */}
        <div className="input-field-group">
          <label htmlFor="categoriaId">Categoria</label>
          <select
            id="categoriaId"
            name="categoriaId"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className={`select-field ${errors.categoriaId ? 'input-error' : ''}`}
            onFocus={carregarDadosExternos}
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
          {errors.categoriaId && (
            <span className="error-text">{errors.categoriaId}</span>
          )}
          {categorias.length === 0 && (
            <span className="error-text" style={{ color: 'var(--text-muted)' }}>
              Nenhuma categoria cadastrada. Cadastre categorias primeiro.
            </span>
          )}
        </div>

        {/* Campo: Usuário responsável (SELECT — chave estrangeira) */}
        <div className="input-field-group">
          <label htmlFor="usuarioId">Cadastrado por</label>
          <select
            id="usuarioId"
            name="usuarioId"
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
            className={`select-field ${errors.usuarioId ? 'input-error' : ''}`}
            onFocus={carregarDadosExternos}
          >
            <option value="">Selecione o usuário responsável</option>
            {usuarios.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nome}
              </option>
            ))}
          </select>
          {errors.usuarioId && (
            <span className="error-text">{errors.usuarioId}</span>
          )}
          {usuarios.length === 0 && (
            <span className="error-text" style={{ color: 'var(--text-muted)' }}>
              Nenhum usuário cadastrado. Cadastre usuários primeiro.
            </span>
          )}
        </div>

        {/* Botões do formulário */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button type="submit" variant="primary">
            {editingId ? 'Atualizar Produto' : 'Cadastrar Produto'}
          </Button>
          {editingId && (
            <Button type="button" variant="secondary" onClick={handleCancelEdit}>
              Cancelar Edição
            </Button>
          )}
        </div>
      </form>

      {/* ---- TABELA DE LISTAGEM ---- */}
      <GenericTable
        columns={columns}
        data={produtosComNomes}
        onEdit={handleEdit}
        onDelete={(item) => setDeleteModal({ open: true, item })}
      />

      {/* ---- MODAL DE CONFIRMAÇÃO DE EXCLUSÃO ---- */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        title="Confirmar exclusão"
        onConfirm={handleConfirmDelete}
      >
        <p style={{ margin: 0 }}>
          Tem certeza de que deseja excluir o produto "{deleteModal.item?.nome}"?
        </p>
      </Modal>
    </div>
  );
};

export default Products;
