// ============================================
// RELATÓRIO COM JOIN — Arquitetura de 3 Camadas
//
// Este componente implementa o relatório que combina dados de três entidades:
//   - Produtos (coleção 'produtos' no Firestore)
//   - Categorias (coleção 'categorias' no Firestore)
//   - Usuários (coleção 'usuarios' no Firestore)
//
// O JOIN é feito em JavaScript puro usando map() + find(),
// simulando o comportamento de um JOIN SQL entre tabelas relacionadas.
//
// Relacionamentos (chaves estrangeiras):
//   Produto.categoriaId → Categoria.id
//   Produto.usuarioId   → Usuário.id
//
// Fluxo de dados:
//   1. Busca as 3 entidades do backend (Express → Firestore)
//   2. Se o backend estiver offline, usa localStorage como fallback
//   3. localStorage é sincronizado como redundância/cache
// ============================================

import React, { useState, useEffect, useMemo } from 'react';
import GenericTable from '../../components/common/GenericTable';
import { buscarComCache } from '../../services/cache';
import { realizarJoin, aplicarFiltros, calcularEstatisticas } from './relatorio';
import './Reports.css';

// ============================================
// COMPONENTE PRINCIPAL — Reports
// ============================================
const Reports = () => {
  // ---- Estado dos dados brutos ----
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // ---- Estado dos filtros ----
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [precoMin, setPrecoMin] = useState('');
  const [precoMax, setPrecoMax] = useState('');

  // ---- Estado de aviso offline ----
  const [aviso, setAviso] = useState('');

  // ============================================
  // CARREGAMENTO INICIAL — Backend first, localStorage fallback
  // Busca as 3 entidades do backend (Express → Firestore)
  // Se falhar, carrega do localStorage (cache/redundância)
  // ============================================
  useEffect(() => {
    const carregarDados = async () => {
      const [prods, cats, users] = await Promise.all([
        buscarComCache('produtos'),
        buscarComCache('categorias'),
        buscarComCache('usuarios'),
      ]);

      setProdutos(prods.dados);
      setCategorias(cats.dados);
      setUsuarios(users.dados);

      if (prods.doCache || cats.doCache || users.doCache) {
        setAviso('⚠️ Alguns dados foram carregados do cache local (backend indisponível)');
      }
    };

    carregarDados();
  }, []);

  // ============================================
  // JOIN — Combina as três entidades usando map() + find()
  // useMemo garante que o JOIN só é recalculado quando os dados mudam
  // ============================================
  const dadosComJoin = useMemo(() => {
    return realizarJoin(produtos, categorias, usuarios);
  }, [produtos, categorias, usuarios]);

  // ============================================
  // FILTROS — Aplica filtros sobre os dados já combinados
  // ============================================
  const dadosFiltrados = useMemo(() => {
    return aplicarFiltros(dadosComJoin, filtroCategoria, precoMin, precoMax);
  }, [dadosComJoin, filtroCategoria, precoMin, precoMax]);

  // ---- Limpar todos os filtros ----
  const limparFiltros = () => {
    setFiltroCategoria('');
    setPrecoMin('');
    setPrecoMax('');
  };

  // ---- Calcular estatísticas do relatório ----
  const estatisticas = useMemo(() => calcularEstatisticas(dadosFiltrados), [dadosFiltrados]);

  // ---- Colunas da tabela do relatório ----
  const colunas = [
    { header: 'Produto', accessor: 'nome' },
    { header: 'Preço', accessor: 'precoFormatado' },
    { header: 'Categoria', accessor: 'categoria' },
    { header: 'Cadastrado por', accessor: 'cadastradoPor' },
  ];

  // ---- Verificar se há filtros ativos ----
  const temFiltrosAtivos = filtroCategoria || precoMin || precoMax;

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="container reports-container">
      {/* ---- CABEÇALHO ---- */}
      <div className="reports-header">
        <h1>
          Relatório <span className="highlight">com JOIN</span>
        </h1>
        <p className="reports-subtitle">
          Combinação de Produtos com Categorias e Usuários — usando{' '}
          <code>map()</code> + <code>find()</code>
        </p>
      </div>

      {/* Aviso de modo offline */}
      {aviso && (
        <div style={{
          background: 'rgba(197, 160, 89, 0.2)',
          border: '1px solid var(--cevada-amber, #C5A059)',
          borderRadius: '10px',
          padding: '12px 20px',
          marginBottom: '20px',
          color: 'var(--cevada-amber, #C5A059)',
          fontSize: '0.9em'
        }}>
          {aviso}
        </div>
      )}

      {/* ---- CARDS DE ESTATÍSTICAS ---- */}
      <div className="stats-grid">
        <div className="stat-card glass-card">
          <span className="stat-label">Total de Produtos</span>
          <span className="stat-value">{estatisticas.total}</span>
        </div>
        <div className="stat-card glass-card">
          <span className="stat-label">Preço Médio</span>
          <span className="stat-value">R$ {estatisticas.media}</span>
        </div>
        <div className="stat-card glass-card">
          <span className="stat-label">Maior Preço</span>
          <span className="stat-value">R$ {estatisticas.maior}</span>
        </div>
        <div className="stat-card glass-card">
          <span className="stat-label">Menor Preço</span>
          <span className="stat-value">R$ {estatisticas.menor}</span>
        </div>
      </div>

      {/* ---- SEÇÃO DE FILTROS ---- */}
      <div className="filters-section glass-card">
        <div className="filters-header">
          <h3>🔍 Filtros</h3>
          {temFiltrosAtivos && (
            <button onClick={limparFiltros} className="btn-limpar">
              Limpar filtros
            </button>
          )}
        </div>

        <div className="filters-grid">
          {/* Filtro por Categoria */}
          <div className="filter-group">
            <label htmlFor="filtroCategoria">Categoria</label>
            <select
              id="filtroCategoria"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="select-field"
            >
              <option value="">Todas as categorias</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Preço Mínimo */}
          <div className="filter-group">
            <label htmlFor="precoMin">Preço mínimo (R$)</label>
            <input
              id="precoMin"
              type="number"
              placeholder="Ex: 10.00"
              value={precoMin}
              onChange={(e) => setPrecoMin(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          {/* Filtro por Preço Máximo */}
          <div className="filter-group">
            <label htmlFor="precoMax">Preço máximo (R$)</label>
            <input
              id="precoMax"
              type="number"
              placeholder="Ex: 100.00"
              value={precoMax}
              onChange={(e) => setPrecoMax(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* ---- INDICADOR DE RESULTADOS ---- */}
      <div className="results-info">
        <span>
          Exibindo <strong>{dadosFiltrados.length}</strong> de{' '}
          <strong>{dadosComJoin.length}</strong> produtos
          {temFiltrosAtivos && ' (filtrado)'}
        </span>
      </div>

      {/* ---- TABELA DO RELATÓRIO (usa GenericTable reutilizável) ---- */}
      {dadosComJoin.length > 0 ? (
        <GenericTable columns={colunas} data={dadosFiltrados} />
      ) : (
        <div className="empty-state glass-card">
          <span className="empty-icon">📋</span>
          <h3>Nenhum dado para exibir</h3>
          <p>
            Cadastre <strong>Usuários</strong>, <strong>Categorias</strong> e{' '}
            <strong>Produtos</strong> nos respectivos CRUDs para que o relatório
            com JOIN seja gerado automaticamente.
          </p>
        </div>
      )}

    </div>
  );
};

export default Reports;
