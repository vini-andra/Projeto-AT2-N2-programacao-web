// ============================================
// CRUD de Usuários — Arquitetura de 3 Camadas
//
// Fluxo de dados:
//   1. React (Apresentação) → Express (Lógica) → Firestore (Dados)
//   2. Se o backend estiver offline, usa localStorage como fallback
//   3. localStorage é SEMPRE sincronizado como redundância/cache
//
// Coleção Firestore: 'usuarios'
// Chave localStorage: 'cevada_usuarios'
// ============================================

import { useState, useEffect } from 'react';
import GenericTable from '../../components/common/GenericTable';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { apiGetAll, apiCreate, apiUpdate, apiDelete } from '../../services/api';

const STORAGE_KEY = 'cevada_usuarios';
const ENTIDADE = 'usuarios';

const Users = () => {
  // ==========================================
  // 1️⃣ ESTADO — Lista de usuários (inicia vazio, carrega do backend)
  // ==========================================
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [aviso, setAviso] = useState(''); // Aviso de modo offline

  // ==========================================
  // 2️⃣ CARREGAMENTO INICIAL — Backend first, localStorage fallback
  // ==========================================
  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Tenta buscar do backend (Express → Firestore)
        const response = await apiGetAll(ENTIDADE);
        if (response.success) {
          setUsuarios(response.data);
          // Sincroniza localStorage como redundância
          localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
          setAviso('');
          console.log(`[Users] Dados carregados do Firebase via backend (${response.data.length} itens)`);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        // Fallback: carrega do localStorage
        console.warn('[Users] Backend indisponível, usando localStorage como fallback:', error.message);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setUsuarios(JSON.parse(saved));
        }
        setAviso('⚠️ Modo offline — dados carregados do cache local');
      }
    };

    carregarDados();
  }, []);

  // ==========================================
  // 3️⃣ SINCRONIZAÇÃO — Atualiza localStorage sempre que o state muda
  // Garante que o cache local está sempre atualizado como redundância
  // ==========================================
  useEffect(() => {
    if (usuarios.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
    }
  }, [usuarios]);

  // ==========================================
  // 4️⃣ VALIDAÇÃO — Campos obrigatórios + regex de email
  // ==========================================
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

  // ==========================================
  // 5️⃣ CREATE / UPDATE — Backend first, localStorage fallback
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const itemData = { nome: nome.trim(), email: email.trim(), telefone: telefone.trim() };

    if (editingId) {
      // UPDATE
      try {
        const response = await apiUpdate(ENTIDADE, editingId, itemData);
        if (response.success) {
          setUsuarios(usuarios.map(u =>
            u.id === editingId ? { ...u, ...itemData } : u
          ));
          setAviso('');
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.warn('[Users] Erro ao atualizar no backend, atualizando localmente:', error.message);
        setUsuarios(usuarios.map(u =>
          u.id === editingId ? { ...u, ...itemData } : u
        ));
        setAviso('⚠️ Atualizado localmente — sincronize quando o servidor voltar');
      }
      setEditingId(null);
    } else {
      // CREATE
      try {
        const response = await apiCreate(ENTIDADE, itemData);
        if (response.success) {
          setUsuarios([...usuarios, response.data]);
          setAviso('');
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.warn('[Users] Erro ao criar no backend, criando localmente:', error.message);
        // Fallback: gera ID local temporário
        const novo = { id: `local_${Date.now()}`, ...itemData };
        setUsuarios([...usuarios, novo]);
        setAviso('⚠️ Criado localmente — sincronize quando o servidor voltar');
      }
    }

    setNome('');
    setEmail('');
    setTelefone('');
    setErrors({});
  };

  // ==========================================
  // 6️⃣ EDIT — Preenche formulário com dados do item
  // ==========================================
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

  // ==========================================
  // 7️⃣ DELETE — Backend first, localStorage fallback
  // ==========================================
  const handleDeleteConfirm = async () => {
    const itemToDelete = deleteModal.item;
    if (!itemToDelete) return;

    try {
      const response = await apiDelete(ENTIDADE, itemToDelete.id);
      if (response.success) {
        setUsuarios(usuarios.filter(u => u.id !== itemToDelete.id));
        setAviso('');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.warn('[Users] Erro ao deletar no backend, removendo localmente:', error.message);
      setUsuarios(usuarios.filter(u => u.id !== itemToDelete.id));
      setAviso('⚠️ Removido localmente — sincronize quando o servidor voltar');
    }

    setDeleteModal({ open: false, item: null });
  };

  // ==========================================
  // 8️⃣ COLUNAS DA TABELA
  // ==========================================
  const columns = [
    { header: 'Nome', accessor: 'nome' },
    { header: 'Email', accessor: 'email' },
    { header: 'Telefone', accessor: 'telefone' },
  ];

  // ==========================================
  // 9️⃣ RENDER
  // ==========================================
  return (
    <div className="container" style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ color: '#fff', marginBottom: '30px' }}>Gerenciamento de Usuários</h1>

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

      <form onSubmit={handleSubmit} style={{ marginBottom: '40px', background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '15px' }}>
        <InputField label="Nome" value={nome} onChange={e => setNome(e.target.value)} error={errors.nome} name="nome" />
        <InputField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} name="email" />
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
