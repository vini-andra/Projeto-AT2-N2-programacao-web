import React from 'react';
import Button from '../../components/common/Button';
import GenericTable from '../../components/common/GenericTable';

const Categories = () => {
  const colunas = [{ header: 'Categoria', accessor: 'nome' }];
  const dados = [{ nome: 'Artesanal' }, { nome: 'Importada' }];

  return (
    <div className="container">
      <h1>Categorias (CRUD 2)</h1>
      <Button className="mb-2">Nova Categoria</Button>
      <GenericTable columns={colunas} data={dados} onEdit={() => {}} onDelete={() => {}} />
    </div>
  );
};

export default Categories;
