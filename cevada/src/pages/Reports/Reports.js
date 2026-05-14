import React from 'react';
import GenericTable from '../../components/common/GenericTable';

const Reports = () => {
  const colunas = [
    { header: 'Produto', accessor: 'produto' },
    { header: 'Categoria', accessor: 'categoria' },
    { header: 'Estoque', accessor: 'estoque' }
  ];

  const dadosJoin = [
    { produto: 'Cevada Lager', categoria: 'Pilsen', estoque: '50' },
    { produto: 'Cevada IPA', categoria: 'Artesanal', estoque: '20' }
  ];

  return (
    <div className="container">
      <h1>Relatório Geral (JOIN)</h1>
      <p>Simulação de cruzamento entre Cervejas e Categorias</p>
      <GenericTable columns={colunas} data={dadosJoin} />
    </div>
  );
};

export default Reports;
