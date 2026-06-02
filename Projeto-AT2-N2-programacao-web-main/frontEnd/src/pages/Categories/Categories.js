import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import GenericTable from '../../components/common/GenericTable';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

function Categories() {
  const { user } = useContext(AuthContext);
  const [categorias, setCategorias] = useState(() => {
    const saved = localStorage.getItem('cevada_categorias');
    return saved ? JSON.parse(saved) : [{ id: Date.now(), nome: 'cerveja', descricao: 'bebida a base de grãos fermentados' }];
  });

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    localStorage.setItem('cevada_categorias', JSON.stringify(categorias));
  }, [categorias]);

  const validate = () => {
    const newErrors = {};
    if (!nome.trim()) newErrors.nome = 'O nome da categoria é obrigatório';
    if (!descricao.trim()) newErrors.descricao = 'A descrição é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingId) {
      setCategorias(categorias.map(cat => 
        cat.id === editingId 
          ? { ...cat, nome, descricao }
          : cat
      ));
      setEditingId(null);
    } else {
      setCategorias([...categorias, { id: Date.now(), nome, descricao }]);
    }
    
    setNome('');
    setDescricao('');
    setErrors({});
  };

  const handleEdit = (categoria) => {
    setNome(categoria.nome);
    setDescricao(categoria.descricao);
    setEditingId(categoria.id);
  };

  const handleCancelEdit = () => {
    setNome('');
    setDescricao('');
    setEditingId(null);
    setErrors({});
  };

  const handleDeleteConfirm = (id, nomeCategoria) => {
    setDeleteConfirm({ id, nome: nomeCategoria });
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      setCategorias(categorias.filter(cat => cat.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    }
  };

  const columns = [
    { header: 'Nome da Categoria', accessor: 'nome' },
    { header: 'Descrição', accessor: 'descricao' }
  ];

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h1>Gerenciamento de Categorias</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <div style={{ marginBottom: '15px' }}>
          <InputField
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            error={errors.nome}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <InputField
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            error={errors.descricao}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {editingId ? (
            <>
              <Button label="Atualizar Categoria" variant="primary" type="submit" />
              <Button label="Cancelar Edição" variant="secondary" onClick={handleCancelEdit} type="button" />
            </>
          ) : (
            <Button label="Cadastrar Categoria" variant="primary" type="submit" />
          )}
        </div>
      </form>

      <GenericTable
        columns={columns}
        data={categorias}
        onEdit={handleEdit}
        onDelete={(categoria) => handleDeleteConfirm(categoria.id, categoria.nome)}
      />

      {deleteConfirm && (
        <Modal
          title="Confirmação de Exclusão"
          message={`Tem certeza de que deseja excluir a categoria "${deleteConfirm.nome}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}

export default Categories;
