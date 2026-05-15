import React from 'react';
import logo from '../../assets/logo.png';

const Home = () => {
  return (
    <div className="home-page">
      <section className="inicio">
        <div className="inicio-img">
          <img src={logo} alt="Cevada Logo" style={{ width: '100%', objectFit: 'contain' }} />
        </div>
        <p className="inicio-txt">
          A CADA <br />
          GOLE <br />
          UMA SENSAÇÃO <br />
          ÚNICA
        </p>
      </section>
    </div>
  );
};

export default Home;
