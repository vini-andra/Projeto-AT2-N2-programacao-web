import React, { useState, useEffect } from 'react';
import GenericTable from '../../components/common/GenericTable';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const STORAGE_KEY = 'cevada_categorias';

const Categories = () => {
  const [categorias, setCategorias] = useState(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(categorias));
  }, [categorias]);

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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    if (editingId) {
      setCategorias((current) =>
        current.map((categoria) =>
          categoria.id === editingId
            ? { ...categoria, nome: nome.trim(), descricao: descricao.trim() }
            : categoria
        )
      );
    } else {
      const novaCategoria = {
        id: String(Date.now()),
        nome: nome.trim(),
        descricao: descricao.trim(),
      };

      setCategorias((current) => [...current, novaCategoria]);
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setNome(item.nome);
    setDescricao(item.descricao);
    setErrors({});
  };

  const handleConfirmDelete = () => {
    if (!deleteModal.item) return;

    setCategorias((current) => current.filter((categoria) => categoria.id !== deleteModal.item.id));
    setDeleteModal({ open: false, item: null });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const columns = [
    { header: 'Nome da Categoria', accessor: 'nome' },
    { header: 'Descrição', accessor: 'descricao' },
  ];

  return (
    <div className="container" style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ color: '#fff', marginBottom: '30px' }}>Gerenciamento de Categorias</h1>

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
