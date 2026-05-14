import React from 'react';
import Button from '../../components/common/Button';
import GenericTable from '../../components/common/GenericTable';

const Suppliers = () => {
  const colunas = [{ header: 'Fornecedor', accessor: 'nome' }, { header: 'Contato', accessor: 'contato' }];
  const dados = [{ nome: 'Malte & Cia', contato: '(11) 9999-9999' }];

  return (
    <div className="container">
      <h1>Fornecedores (CRUD 3)</h1>
      <Button className="mb-2">Novo Fornecedor</Button>
      <GenericTable columns={colunas} data={dados} onEdit={() => {}} onDelete={() => {}} />
    </div>
  );
};

export default Suppliers;
