import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          CEVADA <span>🍺</span>
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          {user ? (
            <>
              <Link to="/dashboard">Painel</Link>
              <Link to="/cervejas">Cervejas</Link>
              <Link to="/categorias">Categorias</Link>
              <Link to="/fornecedores">Fornecedores</Link>
              <Link to="/relatorios">Relatórios</Link>
              <button onClick={handleLogout} className="btn-logout">Sair</button>
            </>
          ) : (
            <Link to="/login" className="btn-login">Entrar</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
