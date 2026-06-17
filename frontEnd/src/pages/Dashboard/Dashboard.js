import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

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
