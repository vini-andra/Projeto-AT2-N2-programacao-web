import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// ============================================================
// Usuários de teste — login simulado, funciona sem Firebase
// e sem backend. O professor pode usar essas credenciais.
// ============================================================
const USUARIOS_TESTE = [
  { email: 'admin@email.com', password: '1234', name: 'Admin' },
  { email: 'usuario@email.com', password: '5678', name: 'Usuário' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ao montar, restaura a sessão salva no localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('cevada_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('cevada_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // ─── Tentativa 1: Firebase Auth (descomentada pelo André quando integrar) ───
    //
    // import { signInWithEmailAndPassword } from 'firebase/auth';
    // import { auth } from '../services/firebase';
    //
    // try {
    //   const credential = await signInWithEmailAndPassword(auth, email, password);
    //   const firebaseUser = credential.user;
    //   const userData = { name: firebaseUser.displayName || email, email: firebaseUser.email };
    //   setUser(userData);
    //   localStorage.setItem('cevada_user', JSON.stringify(userData));
    //   return { success: true };
    // } catch (err) {
    //   console.warn('Firebase indisponível, usando login simulado.', err);
    // }

    // ─── Tentativa 2: Login simulado (fallback seguro, sem dependências externas) ───
    const found = USUARIOS_TESTE.find(
      u => u.email === email && u.password === password
    );

    if (found) {
      const userData = { name: found.name, email: found.email };
      setUser(userData);
      localStorage.setItem('cevada_user', JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, message: 'E-mail ou senha incorretos.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cevada_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
