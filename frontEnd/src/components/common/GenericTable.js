import React from 'react';
import './common.css';

const GenericTable = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="generic-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
            {(onEdit || onDelete) && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>{item[col.accessor]}</td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="table-actions">
                    {onEdit && (
                      <button onClick={() => onEdit(item)} className="btn-edit">Editar</button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(item)} className="btn-delete">Excluir</button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="no-data">Nenhum dado encontrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GenericTable;
