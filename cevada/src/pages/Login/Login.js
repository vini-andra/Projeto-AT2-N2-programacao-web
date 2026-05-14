import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    const success = login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Erro ao fazer login.');
    }
  };

  return (
    <div className="login-container">
      <div className="glass-card login-card">
        <h2>Entrar na <span>Cevada</span></h2>
        <p>Acesse o painel administrativo</p>

        <form onSubmit={handleSubmit}>
          {error && <p className="error-msg">{error}</p>}
          
          <InputField 
            label="E-mail"
            type="email"
            name="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField 
            label="Senha"
            type="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" className="btn-full">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
