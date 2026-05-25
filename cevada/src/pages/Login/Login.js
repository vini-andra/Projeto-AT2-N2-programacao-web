import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateForm = () => {
    const tempErrors = {};
    
    // Required fields check
    if (!email) {
      tempErrors.email = 'O e-mail é obrigatório.';
    } else {
      // Email format regex check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        tempErrors.email = 'Por favor, insira um e-mail válido.';
      }
    }
    
    if (!password) {
      tempErrors.password = 'A senha é obrigatória.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setGeneralError(result.message || 'Erro ao entrar. Tente novamente.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-overlay"></div>
      <div className="login-card glass-card animate-fade-in">
        <div className="login-header">
          <img src={logo} alt="Cevada Logo" className="login-logo" />
          <h2 className="login-title">
            Painel <span>Administrativo</span>
          </h2>
          <p className="login-subtitle">Entre para gerenciar seus produtos, categorias e relatórios</p>
        </div>

        {generalError && (
          <div className="error-alert animate-shake">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="email">E-mail corporativo</label>
            <div className="input-with-icon">
              <i className="fa-solid fa-envelope"></i>
              <input
                id="email"
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                disabled={isLoading}
                required
              />
            </div>
            {errors.email && <span className="error-text-msg">{errors.email}</span>}
          </div>

          <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
            <label htmlFor="password">Senha de acesso</label>
            <div className="input-with-icon">
              <i className="fa-solid fa-lock"></i>
              <input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                disabled={isLoading}
                required
              />
            </div>
            {errors.password && <span className="error-text-msg">{errors.password}</span>}
          </div>

          <button 
            type="submit" 
            className={`login-btn-submit ${isLoading ? 'btn-loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner-container">
                <span className="spinner"></span>
                Autenticando...
              </span>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
