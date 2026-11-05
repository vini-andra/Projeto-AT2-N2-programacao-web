import { realizarJoin, aplicarFiltros, calcularEstatisticas } from './relatorio';

const categorias = [
  { id: 'cat1', nome: 'Cervejas Artesanais' },
  { id: 'cat2', nome: 'Insumos' },
];
const usuarios = [{ id: 'user1', nome: 'Administrador Cevada' }];
const produtos = [
  { id: 'p1', nome: 'Pilsen', preco: 12.9, categoriaId: 'cat1', usuarioId: 'user1' },
  { id: 'p2', nome: 'Malte', preco: 30, categoriaId: 'cat2', usuarioId: 'user1' },
  { id: 'p3', nome: 'Órfão', preco: 5, categoriaId: 'apagada', usuarioId: 'sumiu' },
];

test('JOIN troca os ids pelos nomes de categoria e usuário', () => {
  const [pilsen] = realizarJoin(produtos, categorias, usuarios);

  expect(pilsen.categoria).toBe('Cervejas Artesanais');
  expect(pilsen.cadastradoPor).toBe('Administrador Cevada');
  expect(pilsen.precoFormatado).toBe('R$ 12.90');
});

test('JOIN marca produto órfão em vez de quebrar', () => {
  const orfao = realizarJoin(produtos, categorias, usuarios)[2];

  expect(orfao.categoria).toBe('Categoria não encontrada');
  expect(orfao.cadastradoPor).toBe('Usuário não encontrado');
});

test('filtros por categoria e faixa de preço', () => {
  const dados = realizarJoin(produtos, categorias, usuarios);

  expect(aplicarFiltros(dados, 'cat2', '', '').map((p) => p.id)).toEqual(['p2']);
  expect(aplicarFiltros(dados, '', '10', '20').map((p) => p.id)).toEqual(['p1']);
  expect(aplicarFiltros(dados, '', '', '')).toHaveLength(3);
});

test('estatísticas de preço do relatório', () => {
  const dados = realizarJoin(produtos, categorias, usuarios);

  expect(calcularEstatisticas(dados)).toEqual({ total: 3, media: '15.97', maior: '30.00', menor: '5.00' });
  expect(calcularEstatisticas([])).toEqual({ total: 0, media: 0, maior: 0, menor: 0 });
});
