import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import Users from '../pages/Users/Users';
import Categories from '../pages/Categories/Categories';
import Products from '../pages/Products/Products';
import Reports from '../pages/Reports/Reports';
import About from '../pages/About/About';
import Contact from '../pages/Contact/Contact';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/Layout/Layout';

const AppRouter = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/contatos" element={<Contact />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/usuarios" 
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/categorias" 
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/produtos" 
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/relatorio" 
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
};

export default AppRouter;
