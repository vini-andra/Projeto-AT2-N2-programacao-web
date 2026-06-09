// INTEGRAÇÃO: Os produtos são salvos em 'cevada_produtos' com o formato:
// { id, nome, preco, categoriaId, usuarioId }
// O Integrante 6 pode usar categoriaId e usuarioId para fazer o JOIN no relatório.

// NOTA: Este CRUD depende das chaves 'cevada_categorias' e 'cevada_usuarios' no localStorage.
// Se mudarem o nome dessas chaves nos CRUDs 1 ou 2, atualizar aqui também!

import React, { useState, useEffect } from 'react';
import GenericTable from '../../components/common/GenericTable';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

// Chaves do localStorage — COMBINADO DO GRUPO
const STORAGE_KEY = 'cevada_produtos';
const CATEGORIAS_KEY = 'cevada_categorias';
const USUARIOS_KEY = 'cevada_usuarios';

const Products = () => {
  // ==========================================
  // 1️⃣ ESTADO PRINCIPAL — Lista de produtos (carrega do localStorage)
  // ==========================================
  const [produtos, setProdutos] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

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
  // 4️⃣ CONTROLES DE EDIÇÃO, ERROS E MODAL
  // ==========================================
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });

  // ==========================================
  // 5️⃣ EFEITOS — Persistência e carregamento de dados externos
  // ==========================================

  // Salvar produtos no localStorage toda vez que a lista mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
  }, [produtos]);

  // Carregar categorias e usuários do localStorage (dados dos outros CRUDs)
  // TODO: (VINICIUS) Se quisermos que os selects atualizem em tempo real quando
  // outro integrante cadastrar dados, podemos usar um intervalo ou Context API.
  // Por enquanto, carrega uma vez ao montar + sempre que o formulário é aberto.
  useEffect(() => {
    carregarDadosExternos();
  }, []);

  const carregarDadosExternos = () => {
    const cats = localStorage.getItem(CATEGORIAS_KEY);
    const users = localStorage.getItem(USUARIOS_KEY);
    if (cats) setCategorias(JSON.parse(cats));
    if (users) setUsuarios(JSON.parse(users));
  };

  // ==========================================
  // 6️⃣ VALIDAÇÃO — Checa campos obrigatórios
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
  // 7️⃣ RESET DO FORMULÁRIO
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
  // 8️⃣ SUBMIT — Cria ou atualiza produto
  // ==========================================
  const handleSubmit = (e) => {
    e.preventDefault();

    // Recarregar dados externos antes de validar (garante selects atualizados)
    carregarDadosExternos();

    if (!validate()) return;

    if (editingId) {
      // UPDATE — Atualiza produto existente
      setProdutos((current) =>
        current.map((prod) =>
          prod.id === editingId
            ? {
                ...prod,
                nome: nome.trim(),
                preco: parseFloat(preco),
                categoriaId,
                usuarioId,
              }
            : prod
        )
      );
    } else {
      // CREATE — Cadastra novo produto
      const novoProduto = {
        id: String(Date.now()),
        nome: nome.trim(),
        preco: parseFloat(preco),
        categoriaId,
        usuarioId,
      };
      setProdutos((current) => [...current, novoProduto]);
    }

    resetForm();
  };

  // ==========================================
  // 9️⃣ EDIÇÃO — Preenche formulário com dados existentes
  // ==========================================
  const handleEdit = (item) => {
    // Recarregar dados externos para garantir que os selects estejam atualizados
    carregarDadosExternos();

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
  // 🔟 EXCLUSÃO — Modal de confirmação + remover do estado
  // ==========================================
  const handleConfirmDelete = () => {
    if (!deleteModal.item) return;

    setProdutos((current) =>
      current.filter((prod) => prod.id !== deleteModal.item.id)
    );
    setDeleteModal({ open: false, item: null });
  };

  // ==========================================
  // 1️⃣1️⃣ PREPARAÇÃO DOS DADOS PARA A TABELA
  // Resolve as FKs — mostra NOME em vez de ID
  // ==========================================
  const produtosComNomes = produtos.map((prod) => ({
    ...prod,
    precoFormatado: `R$ ${prod.preco.toFixed(2)}`,
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
  // 1️⃣2️⃣ RENDER
  // ==========================================
  return (
    <div
      className="container"
      style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column' }}
    >
      <h1 style={{ color: '#fff', marginBottom: '30px' }}>
        Gerenciamento de Produtos
      </h1>

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
