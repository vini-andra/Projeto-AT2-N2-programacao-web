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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="login-page">
      <div id="form">
        <form onSubmit={handleSubmit}>
          <h2 className="titulo">Adquira a sua</h2>
          
          {error && <p style={{ color: 'red', marginBottom: '10px', fontSize: '0.8em' }}>{error}</p>}

          <label htmlFor="email">Email</label>
          <div className="input">
            <i className="fa-solid fa-envelope"></i>
            <input 
              id="email" 
              name="email" 
              placeholder="insira seu email" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label htmlFor="password">Senha</label>
          <div className="input">
            <i className="fa-solid fa-lock"></i>
            <input 
              id="password" 
              name="password" 
              placeholder="••••••••" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div id="btn">
            <button type="submit">Entrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
