import React from 'react';
import './common.css';

const Modal = ({ isOpen, onClose, title, children, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          {onConfirm && (
            <button className="btn btn-danger" onClick={onConfirm}>Confirmar</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
