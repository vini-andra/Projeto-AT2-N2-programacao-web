// ============================================
// Regras do relatório com JOIN, separadas da tela
//
// Relacionamentos (chaves estrangeiras):
//   Produto.categoriaId → Categoria.id
//   Produto.usuarioId   → Usuário.id
// ============================================

const nomePorId = (lista, id, padrao) => {
  const encontrado = lista.find((item) => item.id === id);
  return encontrado ? encontrado.nome : padrao;
};

/**
 * realizarJoin — Combina produtos com categorias e usuários
 *
 * Equivalente SQL:
 *   SELECT p.nome, p.preco, c.nome AS categoria, u.nome AS cadastradoPor
 *   FROM produtos p
 *   LEFT JOIN categorias c ON p.categoriaId = c.id
 *   LEFT JOIN usuarios u ON p.usuarioId = u.id
 */
export const realizarJoin = (produtos, categorias, usuarios) => {
  return produtos.map((produto) => ({
    id: produto.id,
    nome: produto.nome,
    preco: produto.preco,
    precoFormatado: `R$ ${Number(produto.preco).toFixed(2)}`,
    categoria: nomePorId(categorias, produto.categoriaId, 'Categoria não encontrada'),
    categoriaId: produto.categoriaId,
    cadastradoPor: nomePorId(usuarios, produto.usuarioId, 'Usuário não encontrado'),
  }));
};

export const aplicarFiltros = (dados, filtroCategoria, precoMin, precoMax) => {
  return dados.filter((item) => {
    const passaCategoria = !filtroCategoria || item.categoriaId === filtroCategoria;
    const passaPrecoMin = !precoMin || item.preco >= parseFloat(precoMin);
    const passaPrecoMax = !precoMax || item.preco <= parseFloat(precoMax);

    return passaCategoria && passaPrecoMin && passaPrecoMax;
  });
};

export const calcularEstatisticas = (dados) => {
  if (dados.length === 0) {
    return { total: 0, media: 0, maior: 0, menor: 0 };
  }

  const precos = dados.map((item) => item.preco);
  return {
    total: dados.length,
    media: (precos.reduce((acc, p) => acc + p, 0) / precos.length).toFixed(2),
    maior: Math.max(...precos).toFixed(2),
    menor: Math.min(...precos).toFixed(2),
  };
};
