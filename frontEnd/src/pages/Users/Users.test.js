import { render, screen, fireEvent } from '@testing-library/react';
import Users from './Users';
import { buscarComCache } from '../../services/cache';
import { apiCreate, apiUpdate } from '../../services/api';

jest.mock('../../services/cache');
jest.mock('../../services/api');

const ana = { id: 'u1', nome: 'Ana', email: 'ana@cevada.com', telefone: '61999990000', tipoDeConta: 'user' };

const preencher = (rotulo, valor) => fireEvent.change(screen.getByLabelText(rotulo), { target: { value: valor } });

beforeEach(() => {
  localStorage.clear();
  buscarComCache.mockResolvedValue({ dados: [ana], doCache: false });
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

test('cadastro com o backend fora do ar não guarda a senha no navegador', async () => {
  apiCreate.mockRejectedValue(new Error('Failed to fetch'));
  render(<Users />);
  await screen.findByText('Ana');

  preencher('Nome', 'Bia');
  preencher('Email', 'bia@cevada.com');
  preencher('Telefone', '61988880000');
  preencher('Senha', 'segredo123');
  fireEvent.click(screen.getByText('Cadastrar Usuário'));

  await screen.findByText('Bia');
  expect(apiCreate).toHaveBeenCalledWith('usuarios', expect.objectContaining({ senha: 'segredo123' }));
  expect(localStorage.getItem('cevada_usuarios')).not.toContain('segredo123');
});

test('editar sem digitar senha mantém a atual e não envia senha', async () => {
  apiUpdate.mockResolvedValue({ success: true, data: { id: 'u1' } });
  render(<Users />);
  fireEvent.click(await screen.findByText('Editar'));

  expect(screen.getByLabelText('Senha').value).toBe('');
  preencher('Nome', 'Ana Maria');
  fireEvent.click(screen.getByText('Atualizar'));

  await screen.findByText('Ana Maria');
  const [, , corpo] = apiUpdate.mock.calls[0];
  expect(corpo).not.toHaveProperty('senha');
});

test('trocar a senha na edição envia ao backend sem guardar no navegador', async () => {
  apiUpdate.mockResolvedValue({ success: true, data: { id: 'u1' } });
  render(<Users />);
  fireEvent.click(await screen.findByText('Editar'));

  preencher('Nome', 'Ana Maria');
  preencher('Senha', 'nova123');
  fireEvent.click(screen.getByText('Atualizar'));

  await screen.findByText('Ana Maria');
  expect(apiUpdate).toHaveBeenCalledWith('usuarios', 'u1', expect.objectContaining({ senha: 'nova123' }));
  expect(localStorage.getItem('cevada_usuarios')).not.toContain('nova123');
});
