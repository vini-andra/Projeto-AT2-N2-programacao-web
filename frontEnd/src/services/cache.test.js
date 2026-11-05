import { buscarComCache } from './cache';
import { apiGetAll } from './api';

jest.mock('./api');

beforeEach(() => {
  localStorage.clear();
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

test('usa os dados do backend e guarda uma cópia', async () => {
  apiGetAll.mockResolvedValue({ success: true, data: [{ id: 'cat1' }] });

  const resultado = await buscarComCache('categorias');

  expect(resultado).toEqual({ dados: [{ id: 'cat1' }], doCache: false });
  expect(JSON.parse(localStorage.getItem('cevada_categorias'))).toEqual([{ id: 'cat1' }]);
});

test('com o backend fora do ar devolve a última cópia salva', async () => {
  localStorage.setItem('cevada_categorias', JSON.stringify([{ id: 'antiga' }]));
  apiGetAll.mockRejectedValue(new Error('Failed to fetch'));

  const resultado = await buscarComCache('categorias');

  expect(resultado).toEqual({ dados: [{ id: 'antiga' }], doCache: true });
});

test('sem backend e sem cópia devolve lista vazia', async () => {
  apiGetAll.mockRejectedValue(new Error('Failed to fetch'));

  expect(await buscarComCache('produtos')).toEqual({ dados: [], doCache: true });
});
