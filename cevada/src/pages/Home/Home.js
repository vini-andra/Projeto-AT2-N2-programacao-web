import React from 'react';
import Button from '../../components/common/Button';
import './Home.css';

const Home = () => {
  const categoriasExemplo = ['Lagers', 'IPAs', 'Stouts', 'Artesanais'];
  
  const cervejasDestaque = [
    { nome: 'Cevada Golden', preco: 'R$ 12,90', tag: 'Mais Vendida', img: '🍺' },
    { nome: 'Dark Malte', preco: 'R$ 15,90', tag: 'Premium', img: '🍺' },
    { nome: 'Hops Master', preco: 'R$ 18,90', tag: 'Intensa', img: '🍺' },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <header className="hero container">
        <h1>Cervejaria <span>Cevada</span></h1>
        <p>A pureza do malte, a tradição do sabor.</p>
        <div className="hero-btns">
          <Button variant="primary">Ver Cardápio Completo</Button>
          <Button variant="secondary" className="ml-2">Nossa História</Button>
        </div>
      </header>

      {/* Categorias */}
      <section className="categories-section container">
        <div className="section-title">
          <h2>Nossos <span>Estilos</span></h2>
          <div className="title-underline"></div>
        </div>
        <div className="categories-grid">
          {categoriasExemplo.map((cat, i) => (
            <div key={i} className="glass-card category-card">
              <span>🍺</span>
              <h4>{cat}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Vitrine de Produtos */}
      <section className="products-showcase container">
        <div className="section-title">
          <h2>Destaques da <span>Casa</span></h2>
          <div className="title-underline"></div>
        </div>
        <div className="products-grid">
          {cervejasDestaque.map((beer, i) => (
            <div key={i} className="glass-card product-card">
              <div className="product-tag">{beer.tag}</div>
              <div className="product-icon">{beer.img}</div>
              <h3>{beer.nome}</h3>
              <p className="price">{beer.preco}</p>
              <Button variant="primary" className="btn-small">Detalhes</Button>
            </div>
          ))}
        </div>
      </section>

      {/* Features Antigas */}
      <section className="features container">
        <div className="glass-card feature-item">
          <h3>Qualidade Premium</h3>
          <p>Ingredientes selecionados para o melhor paladar.</p>
        </div>
        <div className="glass-card feature-item">
          <h3>Tradição</h3>
          <p>Receitas clássicas com um toque moderno.</p>
        </div>
        <div className="glass-card feature-item">
          <h3>Artesanal</h3>
          <p>Produção cuidadosa em cada lote.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
