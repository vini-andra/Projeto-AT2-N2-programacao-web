import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="text-fot">
      <p>&copy; {new Date().getFullYear()} Cevada. Criado e desenvolvido por Cevada Design Gráfico @</p>
    </footer>
  );
};

export default Footer;
