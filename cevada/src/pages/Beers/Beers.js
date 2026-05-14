import React from 'react';
import Button from '../../components/common/Button';
import GenericTable from '../../components/common/GenericTable';

const Beers = () => {
  const colunas = [
    { header: 'Nome', accessor: 'nome' },
    { header: 'Estilo', accessor: 'estilo' },
    { header: 'ABV', accessor: 'abv' }
  ];

  const dados = [
    { nome: 'Cevada Lager', estilo: 'Lager', abv: '4.5%' },
    { nome: 'Cevada IPA', estilo: 'IPA', abv: '6.5%' }
  ];

  return (
    <div className="container">
      <h1>Gerenciar Cervejas (CRUD 1)</h1>
      <Button className="mb-2">Adicionar Nova</Button>
      <GenericTable columns={colunas} data={dados} onEdit={() => {}} onDelete={() => {}} />
    </div>
  );
};

export default Beers;
