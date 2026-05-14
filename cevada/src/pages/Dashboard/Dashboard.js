import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import GenericTable from '../../components/common/GenericTable';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  // Exemplo de dados para a tabela
  const colunasCervejas = [
    { header: 'Nome', accessor: 'nome' },
    { header: 'Tipo', accessor: 'tipo' },
    { header: 'Preço', accessor: 'preco' },
    { header: 'Estoque', accessor: 'estoque' }
  ];

  const dadosCervejas = [
    { nome: 'Cevada Golden', tipo: 'Pilsen', preco: 'R$ 12,00', estoque: '50 un' },
    { nome: 'Amber Ale', tipo: 'Red Ale', preco: 'R$ 15,00', estoque: '30 un' },
    { nome: 'IPA Turbo', tipo: 'IPA', preco: 'R$ 18,00', estoque: '20 un' }
  ];

  return (
    <div className="dashboard-container container">
      <header className="dashboard-header">
        <h1>Painel de <span>Administração</span></h1>
        <p>Bem-vindo de volta, <strong>{user?.name}</strong>!</p>
      </header>

      <div className="dashboard-grid">
        <div className="glass-card stat-card">
          <h4>Total de Cervejas</h4>
          <span className="stat-value">{dadosCervejas.length}</span>
        </div>
        <div className="glass-card stat-card">
          <h4>Fornecedores</h4>
          <span className="stat-value">12</span>
        </div>
        <div className="glass-card stat-card">
          <h4>Pedidos Hoje</h4>
          <span className="stat-value">08</span>
        </div>
      </div>

      <section className="dashboard-section">
        <h2>Gerenciamento de Cervejas</h2>
        <div className="section-actions">
          <Button variant="primary">Nova Cerveja</Button>
        </div>
        
        <GenericTable 
          columns={colunasCervejas} 
          data={dadosCervejas} 
          onEdit={(item) => console.log('Editando', item)}
          onDelete={(item) => console.log('Excluindo', item)}
        />
      </section>
    </div>
  );
};

export default Dashboard;
