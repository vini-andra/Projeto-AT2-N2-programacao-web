// ============================================
// RELATÓRIO COM JOIN — Integrante 6
// 
// Este componente implementa o relatório que combina dados de três entidades:
//   - Produtos (cevada_produtos)
//   - Categorias (cevada_categorias)
//   - Usuários (cevada_usuarios)
//
// O JOIN é feito em JavaScript puro usando map() + find(),
// simulando o comportamento de um JOIN SQL entre tabelas relacionadas.
//
// Relacionamentos (chaves estrangeiras):
//   Produto.categoriaId → Categoria.id
//   Produto.usuarioId   → Usuário.id
// ============================================

import React, { useState, useEffect, useMemo } from 'react';
import GenericTable from '../../components/common/GenericTable';
import './Reports.css';

// ============================================
// CHAVES DO LOCALSTORAGE — Combinado do grupo
// Devem ser idênticas às usadas nos CRUDs de cada entidade
// ============================================
const PRODUTOS_KEY = 'cevada_produtos';
const CATEGORIAS_KEY = 'cevada_categorias';
const USUARIOS_KEY = 'cevada_usuarios';

// ============================================
// FUNÇÕES AUXILIARES DE DADOS
// Separam a lógica de dados da lógica de renderização
// ============================================

/**
 * carregarDoLocalStorage — Lê e parseia dados do localStorage
 * @param {string} chave — chave do localStorage
 * @returns {Array} — array de objetos ou array vazio se não existir
 */
const carregarDoLocalStorage = (chave) => {
  try {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    console.error(`[Relatório] Erro ao carregar "${chave}" do localStorage:`, erro);
    return [];
  }
};

/**
 * resolverNomeCategoria — Resolve o nome da categoria a partir do categoriaId
 * Simula: SELECT categorias.nome FROM categorias WHERE categorias.id = produto.categoriaId
 *
 * @param {string} categoriaId — FK do produto
 * @param {Array} categorias — lista completa de categorias
 * @returns {string} — nome da categoria ou fallback
 */
const resolverNomeCategoria = (categoriaId, categorias) => {
  const categoriaEncontrada = categorias.find((cat) => cat.id === categoriaId);
  return categoriaEncontrada ? categoriaEncontrada.nome : 'Categoria não encontrada';
};

/**
 * resolverNomeUsuario — Resolve o nome do usuário a partir do usuarioId
 * Simula: SELECT usuarios.nome FROM usuarios WHERE usuarios.id = produto.usuarioId
 *
 * @param {string} usuarioId — FK do produto
 * @param {Array} usuarios — lista completa de usuários
 * @returns {string} — nome do usuário ou fallback
 */
const resolverNomeUsuario = (usuarioId, usuarios) => {
  const usuarioEncontrado = usuarios.find((user) => user.id === usuarioId);
  return usuarioEncontrado ? usuarioEncontrado.nome : 'Usuário não encontrado';
};

/**
 * realizarJoin — Combina produtos com categorias e usuários
 *
 * Equivalente SQL:
 *   SELECT p.nome, p.preco, c.nome AS categoria, u.nome AS cadastradoPor
 *   FROM produtos p
 *   LEFT JOIN categorias c ON p.categoriaId = c.id
 *   LEFT JOIN usuarios u ON p.usuarioId = u.id
 *
 * @param {Array} produtos — lista de produtos
 * @param {Array} categorias — lista de categorias
 * @param {Array} usuarios — lista de usuários
 * @returns {Array} — lista de produtos com nomes resolvidos
 */
const realizarJoin = (produtos, categorias, usuarios) => {
  return produtos.map((produto) => ({
    id: produto.id,
    nome: produto.nome,
    preco: produto.preco,
    precoFormatado: `R$ ${Number(produto.preco).toFixed(2)}`,
    categoria: resolverNomeCategoria(produto.categoriaId, categorias),
    categoriaId: produto.categoriaId,
    cadastradoPor: resolverNomeUsuario(produto.usuarioId, usuarios),
  }));
};

/**
 * aplicarFiltros — Filtra os dados do relatório por categoria e faixa de preço
 *
 * @param {Array} dados — dados já com JOIN realizado
 * @param {string} filtroCategoria — id da categoria selecionada ('' = todas)
 * @param {number} precoMin — preço mínimo do filtro
 * @param {number} precoMax — preço máximo do filtro
 * @returns {Array} — dados filtrados
 */
const aplicarFiltros = (dados, filtroCategoria, precoMin, precoMax) => {
  return dados.filter((item) => {
    // Filtro por categoria
    const passaCategoria = !filtroCategoria || item.categoriaId === filtroCategoria;

    // Filtro por faixa de preço
    const passaPrecoMin = !precoMin || item.preco >= parseFloat(precoMin);
    const passaPrecoMax = !precoMax || item.preco <= parseFloat(precoMax);

    return passaCategoria && passaPrecoMin && passaPrecoMax;
  });
};

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

  // ---- Carregar dados do localStorage ao montar o componente ----
  useEffect(() => {
    setProdutos(carregarDoLocalStorage(PRODUTOS_KEY));
    setCategorias(carregarDoLocalStorage(CATEGORIAS_KEY));
    setUsuarios(carregarDoLocalStorage(USUARIOS_KEY));
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
  const estatisticas = useMemo(() => {
    if (dadosFiltrados.length === 0) {
      return { total: 0, media: 0, maior: 0, menor: 0 };
    }

    const precos = dadosFiltrados.map((item) => item.preco);
    return {
      total: dadosFiltrados.length,
      media: (precos.reduce((acc, p) => acc + p, 0) / precos.length).toFixed(2),
      maior: Math.max(...precos).toFixed(2),
      menor: Math.min(...precos).toFixed(2),
    };
  }, [dadosFiltrados]);

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
  // RENDER — Separação clara entre lógica e visual
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

      {/* ---- EXPLICAÇÃO TÉCNICA DO JOIN ---- */}
      <div className="join-explanation glass-card">
        <h3>💡 Como funciona o JOIN neste relatório</h3>
        <div className="explanation-content">
          <div className="explanation-step">
            <span className="step-number">1</span>
            <div>
              <strong>Carregamento dos dados</strong>
              <p>
                Os dados de Produtos, Categorias e Usuários são carregados do{' '}
                <code>localStorage</code> usando as chaves combinadas pelo grupo.
              </p>
            </div>
          </div>
          <div className="explanation-step">
            <span className="step-number">2</span>
            <div>
              <strong>JOIN com map() + find()</strong>
              <p>
                Para cada produto, usamos <code>find()</code> para buscar a
                Categoria pelo <code>categoriaId</code> e o Usuário pelo{' '}
                <code>usuarioId</code>, resolvendo as chaves estrangeiras.
              </p>
            </div>
          </div>
          <div className="explanation-step">
            <span className="step-number">3</span>
            <div>
              <strong>Exibição combinada</strong>
              <p>
                O resultado é uma tabela unificada mostrando o nome do produto,
                preço, nome da categoria e quem cadastrou — dados de 3 entidades
                em uma única visualização.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
