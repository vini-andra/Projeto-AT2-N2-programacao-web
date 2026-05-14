import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import Beers from '../pages/Beers/Beers';
import Categories from '../pages/Categories/Categories';
import Suppliers from '../pages/Suppliers/Suppliers';
import Reports from '../pages/Reports/Reports';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/Layout/Layout';

const AppRouter = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
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
          path="/cervejas" 
          element={
            <ProtectedRoute>
              <Beers />
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
          path="/fornecedores" 
          element={
            <ProtectedRoute>
              <Suppliers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/relatorios" 
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
