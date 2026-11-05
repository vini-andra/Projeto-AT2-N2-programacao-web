import { apiGetAll, apiDelete, loginUser, salvarToken } from './api';

const respostaOk = (corpo) => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(corpo) });

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

test('envia o token Bearer quando o usuário está logado', async () => {
  salvarToken('abc123');
  fetch.mockReturnValue(respostaOk({ success: true, data: [] }));

  await apiGetAll('produtos');

  const [, opcoes] = fetch.mock.calls[0];
  expect(opcoes.headers.Authorization).toBe('Bearer abc123');
});

test('não envia Authorization sem login', async () => {
  fetch.mockReturnValue(respostaOk({ success: true }));

  await apiDelete('produtos', '1');

  const [url, opcoes] = fetch.mock.calls[0];
  expect(url).toMatch(/\/produtos\/1$/);
  expect(opcoes.headers.Authorization).toBeUndefined();
});

test('acesso negado (401) vira erro para a tela tratar', async () => {
  fetch.mockReturnValue(Promise.resolve({ ok: false, status: 401 }));

  await expect(apiGetAll('usuarios')).rejects.toThrow('401');
});

test('login com sucesso guarda o token', async () => {
  fetch.mockReturnValue(respostaOk({ success: true, user: { name: 'Admin' }, token: 'novo-token' }));

  await loginUser('admin@email.com', null, '1234');

  expect(localStorage.getItem('cevada_token')).toBe('novo-token');
});

test('login com backend fora do ar avisa que está offline', async () => {
  fetch.mockReturnValue(Promise.reject(new Error('Failed to fetch')));

  const resposta = await loginUser('admin@email.com', null, '1234');

  expect(resposta).toEqual(expect.objectContaining({ success: false, offline: true }));
  expect(localStorage.getItem('cevada_token')).toBeNull();
});
