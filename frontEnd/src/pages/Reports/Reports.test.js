import { render, screen, fireEvent } from '@testing-library/react';
import Reports from './Reports';
import { buscarComCache } from '../../services/cache';

jest.mock('../../services/cache');

const banco = {
  produtos: [
    { id: 'p1', nome: 'Pilsen', preco: 12.9, categoriaId: 'cat1', usuarioId: 'user1' },
    { id: 'p2', nome: 'Malte', preco: 30, categoriaId: 'cat2', usuarioId: 'user1' },
  ],
  categorias: [
    { id: 'cat1', nome: 'Cervejas Artesanais' },
    { id: 'cat2', nome: 'Insumos' },
  ],
  usuarios: [{ id: 'user1', nome: 'Administrador Cevada' }],
};

const responderCom = (doCache) => {
  buscarComCache.mockImplementation((entidade) => Promise.resolve({ dados: banco[entidade], doCache }));
};

test('tela do relatório mostra os produtos com o JOIN e filtra por categoria', async () => {
  responderCom(false);
  render(<Reports />);

  expect(await screen.findByText('Pilsen')).toBeInTheDocument();
  expect(screen.getAllByText('Administrador Cevada')).toHaveLength(2);

  fireEvent.change(screen.getByLabelText('Categoria'), { target: { value: 'cat2' } });

  expect(screen.queryByText('Pilsen')).not.toBeInTheDocument();
  expect(screen.getByText('Malte')).toBeInTheDocument();
});

test('tela do relatório avisa quando os dados vieram do cache', async () => {
  responderCom(true);
  render(<Reports />);

  expect(await screen.findByText(/cache local/)).toBeInTheDocument();
});
