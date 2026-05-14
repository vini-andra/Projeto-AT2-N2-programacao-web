import React from 'react';
import Navbar from '../Shared/Navbar';
import Footer from '../Shared/Footer';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
