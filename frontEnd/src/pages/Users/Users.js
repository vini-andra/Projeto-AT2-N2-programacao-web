import { useState, useEffect } from 'react';
import GenericTable from '../../components/common/GenericTable';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const Users = () => {
  const [usuarios, setUsuarios] = useState(() => {
    const saved = localStorage.getItem('cevada_usuarios');
    return saved ? JSON.parse(saved) : [];
  });

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });

  useEffect(() => {
    localStorage.setItem('cevada_usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  const validate = () => {
    const errs = {};
    if (!nome.trim()) errs.nome = 'O nome é obrigatório';
    if (!email.trim()) {
      errs.email = 'O email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Formato de email inválido';
    }
    if (!telefone.trim()) errs.telefone = 'O telefone é obrigatório';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingId) {
      setUsuarios(usuarios.map(u =>
        u.id === editingId ? { ...u, nome, email, telefone } : u
      ));
      setEditingId(null);
    } else {
      const novo = { id: String(Date.now()), nome, email, telefone };
      setUsuarios([...usuarios, novo]);
    }

    setNome('');
    setEmail('');
    setTelefone('');
    setErrors({});
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setNome(item.nome);
    setEmail(item.email);
    setTelefone(item.telefone);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNome('');
    setEmail('');
    setTelefone('');
    setErrors({});
  };

  const handleDeleteConfirm = () => {
    setUsuarios(usuarios.filter(u => u.id !== deleteModal.item.id));
    setDeleteModal({ open: false, item: null });
  };

  const columns = [
    { header: 'Nome', accessor: 'nome' },
    { header: 'email', accessor: 'email' },
    { header: 'Telefone', accessor: 'telefone' },
  ];

  return (
    <div className="container" style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ color: '#fff', marginBottom: '30px' }}>Gerenciamento de Usuários</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '40px', background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '15px' }}>
        <InputField label="Nome" value={nome} onChange={e => setNome(e.target.value)} error={errors.nome} name="nome" />
        <InputField label="email" type="email" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} name="email" />
        <InputField label="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} error={errors.telefone} name="telefone" />

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <Button type="submit" variant="primary">
            {editingId ? 'Atualizar' : 'Cadastrar Usuário'}
          </Button>
          {editingId && (
            <Button variant="secondary" onClick={handleCancelEdit}>
              Cancelar
            </Button>
          )}
        </div>
      </form>

      <GenericTable
        columns={columns}
        data={usuarios}
        onEdit={handleEdit}
        onDelete={(item) => setDeleteModal({ open: true, item })}
      />

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        title="Confirmação de Exclusão"
        onConfirm={handleDeleteConfirm}
      >
        <p>Tem certeza de que deseja continuar? "{deleteModal.item?.nome}"?</p>
      </Modal>
    </div>
  );
};

export default Users;
