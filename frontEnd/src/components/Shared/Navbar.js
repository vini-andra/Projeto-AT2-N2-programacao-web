import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="cabecalho">
      <div className="cabecalho-img">
        <Link to="/">
          <img src={logo} alt="Cevada Logo" style={{ height: '50px', objectFit: 'contain' }} />
        </Link>
      </div>
      <nav className="cabecalho-txt">
        <Link to="/" className="cabecalho-txt-it">INÍCIO | </Link>
        <Link to="/sobre" className="cabecalho-txt-it">SOBRE A CEVADA | </Link>
        <Link to="/contatos" className="cabecalho-txt-it">CONTATOS | </Link>
        
        {user ? (
          <>
            <Link to="/dashboard" className="cabecalho-txt-it">PAINEL | </Link>
            <Link to="/usuarios" className="cabecalho-txt-it">USUÁRIOS | </Link>
            <Link to="/categorias" className="cabecalho-txt-it">CATEGORIAS | </Link>
            <Link to="/produtos" className="cabecalho-txt-it">PRODUTOS | </Link>
            <Link to="/relatorio" className="cabecalho-txt-it">RELATÓRIO | </Link>
            <button onClick={handleLogout} className="cabecalho-txt-it" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit' }}>SAIR | </button>
          </>
        ) : (
          <Link to="/login" className="cabecalho-txt-it">ADQUIRA A SUA | </Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
