import React from 'react';
import './common.css';

const InputField = ({ label, type = 'text', value, onChange, placeholder, error, name }) => {
  return (
    <div className="input-field-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 'input-error' : ''}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default InputField;
