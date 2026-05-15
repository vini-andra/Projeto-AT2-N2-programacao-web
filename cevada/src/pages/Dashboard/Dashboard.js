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
    <div className="dashboard-container container" style={{ paddingTop: '50px' }}>
      <header className="dashboard-header" style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3em', fontWeight: '700' }}>Painel de <span style={{ color: 'var(--cevada-orange)' }}>Administração</span></h1>
        <p style={{ fontSize: '1.2em' }}>Bem-vindo de volta, <strong>{user?.name}</strong>!</p>
      </header>

      <section className="dashboard-content" style={{ textAlign: 'center', padding: '100px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px' }}>
        <h2 style={{ color: '#fff' }}>Estrutura Base Pronta</h2>
        <p style={{ color: '#fff', marginTop: '20px' }}>
          Este é o espaço reservado para os CRUDs e Relatórios que serão <br />
          desenvolvidos pelos outros integrantes do grupo.
        </p>
      </section>
    </div>
  );
};

export default Dashboard;
