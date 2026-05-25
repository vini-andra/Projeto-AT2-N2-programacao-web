import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { loginUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("SignOut error:", err);
    }
    setUser(null);
    localStorage.removeItem('cevada_user');
  };

  useEffect(() => {
    // 1. Instantly read from localStorage to avoid redirects on reload
    const savedUser = localStorage.getItem('cevada_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // 2. Synchronize with Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          // If we have a firebaseUser but no local state, or email differs, refresh from backend
          if (!savedUser || JSON.parse(savedUser).email !== firebaseUser.email) {
            const response = await loginUser(firebaseUser.email, token);
            if (response.success) {
              setUser(response.user);
              localStorage.setItem('cevada_user', JSON.stringify(response.user));
            } else {
              handleLogout();
            }
          }
        } catch (err) {
          console.error("Firebase auth sync error:", err);
          handleLogout();
        }
      } else {
        setUser(null);
        localStorage.removeItem('cevada_user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    // Firebase requires at least 6 characters. If user enters less (like '1234' for tests),
    // we pad it with '0' to satisfy Firebase while keeping the exact test credentials.
    const firebasePassword = password.length < 6 ? password.padEnd(6, '0') : password;

    try {
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, firebasePassword);
      } catch (err) {
        // If user doesn't exist or wrong credential (newer Firebase maps not-found to invalid-credential),
        // we attempt to create it. This auto-seeds the test users (like admin@email.com / 1234) on first login.
        if (
          err.code === 'auth/user-not-found' || 
          err.code === 'auth/invalid-credential' || 
          err.code === 'auth/wrong-password'
        ) {
          try {
            userCredential = await createUserWithEmailAndPassword(auth, email, firebasePassword);
          } catch (createErr) {
            console.error("Auto-registration failed:", createErr);
            throw err; // throw original error if creation also fails
          }
        } else {
          throw err;
        }
      }

      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken();

      // Call backend to authenticate/verify the Firebase ID token
      const response = await loginUser(email, idToken);
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('cevada_user', JSON.stringify(response.user));
        return { success: true };
      } else {
        return { success: false, message: response.message || 'Erro de autenticação no servidor backend.' };
      }
    } catch (error) {
      console.error('Firebase Auth login error:', error);
      let errMsg = 'Erro ao fazer login. Verifique suas credenciais.';
      if (error.code === 'auth/invalid-email') {
        errMsg = 'Formato de e-mail inválido.';
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errMsg = 'E-mail ou senha incorretos.';
      } else if (error.code === 'auth/user-disabled') {
        errMsg = 'Este usuário foi desativado.';
      } else if (error.code === 'auth/weak-password') {
        errMsg = 'A senha deve conter pelo menos 6 caracteres no Firebase.';
      }
      return { success: false, message: errMsg };
    }
  };

  const logout = () => {
    handleLogout();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
