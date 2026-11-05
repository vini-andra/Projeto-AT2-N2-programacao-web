import { render, screen, fireEvent } from '@testing-library/react';
import GenericTable from './GenericTable';

const colunas = [
  { header: 'Produto', accessor: 'nome' },
  { header: 'Preço', accessor: 'precoFormatado' },
];
const dados = [
  { id: 'p1', nome: 'Pilsen', precoFormatado: 'R$ 12.90' },
  { id: 'p2', nome: 'Tripel', precoFormatado: 'R$ 18.90' },
];

test('mostra uma linha por item', () => {
  render(<GenericTable columns={colunas} data={dados} />);

  expect(screen.getByText('Pilsen')).toBeInTheDocument();
  expect(screen.getByText('R$ 18.90')).toBeInTheDocument();
  expect(screen.queryByText('Ações')).not.toBeInTheDocument();
});

test('botão Excluir entrega o item certo para a tela', () => {
  const onDelete = jest.fn();
  render(<GenericTable columns={colunas} data={dados} onDelete={onDelete} />);

  fireEvent.click(screen.getAllByText('Excluir')[1]);

  expect(onDelete).toHaveBeenCalledWith(dados[1]);
});

test('lista vazia mostra aviso', () => {
  render(<GenericTable columns={colunas} data={[]} />);

  expect(screen.getByText('Nenhum dado encontrado')).toBeInTheDocument();
});
