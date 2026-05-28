import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      {/* Seção Pilsen */}
      <section className="about-section section-pilsen">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ flex: 1 }}>
            <h2 className="yellow-txt-tt">PILSEN (SOL DA TARDE)</h2>
            <p className="yellow-txt">
              O estilo de cerveja artesanal Pilsen ou Pilsner 
              surgiu na República Tcheca. Como características marcantes, 
              a bebida apresenta aroma e sabor acentuados pelo lúpulo, 
              além da cor dourada vibrante.
            </p>
          </div>
          <div className="content-right" style={{ flex: 1, fontSize: '15em', textAlign: 'center' }}>🍺</div>
        </div>
      </section>

      {/* Onda 1: Pilsen to Tripel */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path 
            fill="var(--cevada-emerald)" 
            d="M0,0 C480,100 960,0 1440,100 L1440,120 L0,120 Z"
          ></path>
        </svg>
      </div>

      {/* Seção Tripel */}
      <section className="about-section section-tripel">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto', flexDirection: 'row-reverse' }}>
          <div style={{ flex: 1 }}>
            <h2 className="green-txt-tt">TRIPEL (FLOREST)</h2>
            <p className="green-txt">
              Criada na Bélgica, no Mosteiro Trapista de Westmalle, 
              a Tripel apresenta cor clara, sabor amargo cítrico e aroma frutado. 
              Uma cerveja forte, cremosa e inesquecível.
            </p>
          </div>
          <div className="content-right" style={{ flex: 1, fontSize: '15em', textAlign: 'center' }}>🌿</div>
        </div>
      </section>

      {/* Onda 2: Tripel to Weizen */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path 
            fill="var(--cevada-midnight)" 
            d="M0,0 C480,100 960,0 1440,100 L1440,120 L0,120 Z"
          ></path>
        </svg>
      </div>

      {/* Seção Weizen */}
      <section className="about-section section-weizen">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ flex: 1 }}>
            <h2 className="blue-txt-tt">WEIZENBIER (BLUE DARK)</h2>
            <p className="blue-txt">
              O estilo Weizenbier traz 50% de malte de trigo. 
              Sua cor é opaca, com sabor e aroma frutados, lembrando banana e cravo. 
              A Blue Dark é refrescante e moderada.
            </p>
          </div>
          <div className="content-right" style={{ flex: 1, fontSize: '15em', textAlign: 'center' }}>❄️</div>
        </div>
      </section>
    </div>
  );
};

export default About;
