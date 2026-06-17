import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const crudCards = [
    {
      id: 'usuarios',
      title: 'Usuários',
      description: 'Gerencie os usuários do sistema, permissões e acessos.',
      icon: '👥',
      path: '/usuarios',
      gradient: 'linear-gradient(135deg, #C5A059 0%, #8B6914 100%)',
      accentColor: '#C5A059',
    },
    {
      id: 'categorias',
      title: 'Categorias',
      description: 'Organize e administre as categorias de produtos.',
      icon: '📂',
      path: '/categorias',
      gradient: 'linear-gradient(135deg, #1B4D3E 0%, #0D7B52 100%)',
      accentColor: '#1B4D3E',
    },
    {
      id: 'produtos',
      title: 'Produtos',
      description: 'Cadastre, edite e controle o estoque de cervejas.',
      icon: '🍺',
      path: '/produtos',
      gradient: 'linear-gradient(135deg, #0A192F 0%, #1E3A5F 100%)',
      accentColor: '#0A192F',
    },
    {
      id: 'relatorio',
      title: 'Relatórios',
      description: 'Visualize métricas, vendas e dados analíticos.',
      icon: '📊',
      path: '/relatorio',
      gradient: 'linear-gradient(135deg, #5C1A1B 0%, #A93226 100%)',
      accentColor: '#5C1A1B',
    },
  ];

  const quickStats = [
    { label: 'Módulos Ativos', value: '4', icon: '⚡' },
    { label: 'Último Acesso', value: currentTime.toLocaleDateString('pt-BR'), icon: '📅' },
    { label: 'Status', value: 'Online', icon: '🟢' },
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-overlay"></div>

      <div className="dashboard-container container">
        {/* Header Section */}
        <header className="dash-header animate-slide-down">
          <div className="dash-greeting">
            <h1 className="dash-title">
              {getGreeting()}, <span className="dash-user-name">{user?.nome || user?.name || 'Admin'}</span>
            </h1>
            <p className="dash-subtitle">
              Bem-vindo ao painel de administração da <strong>Cevada</strong>. Gerencie tudo em um só lugar.
            </p>
          </div>
          <div className="dash-time-badge">
            <span className="dash-time-icon">🕐</span>
            <span className="dash-time-text">
              {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </header>

        {/* Quick Stats */}
        <section className="dash-stats animate-slide-up">
          {quickStats.map((stat, index) => (
            <div className="dash-stat-card glass-card" key={index} style={{ animationDelay: `${index * 0.1}s` }}>
              <span className="dash-stat-icon">{stat.icon}</span>
              <div className="dash-stat-info">
                <span className="dash-stat-value">{stat.value}</span>
                <span className="dash-stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Section Title */}
        <div className="dash-section-header animate-fade-in">
          <h2 className="dash-section-title">
            Módulos do <span>Sistema</span>
          </h2>
          <p className="dash-section-desc">Acesse rapidamente cada área de gerenciamento</p>
        </div>

        {/* CRUD Cards Grid */}
        <section className="dash-cards-grid">
          {crudCards.map((card, index) => (
            <button
              key={card.id}
              id={`crud-card-${card.id}`}
              className="dash-crud-card animate-card-in"
              style={{ animationDelay: `${0.15 + index * 0.1}s` }}
              onClick={() => navigate(card.path)}
            >
              <div className="dash-card-glow" style={{ background: card.gradient }}></div>
              <div className="dash-card-content">
                <div className="dash-card-icon-wrapper" style={{ background: card.gradient }}>
                  <span className="dash-card-icon">{card.icon}</span>
                </div>
                <h3 className="dash-card-title">{card.title}</h3>
                <p className="dash-card-desc">{card.description}</p>
                <div className="dash-card-action">
                  <span>Acessar</span>
                  <span className="dash-card-arrow">→</span>
                </div>
              </div>
            </button>
          ))}
        </section>

        {/* Footer hint */}
        <div className="dash-footer-hint animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p>💡 Use a barra de navegação acima para acessar as páginas públicas como <strong>Sobre</strong> e <strong>Contatos</strong>.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
