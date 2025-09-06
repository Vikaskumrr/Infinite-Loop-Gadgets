// src/components/HomePage.tsx

import React from 'react';
import './HomePage.scss';

const HomePage: React.FC = () => (
  <div className="homepage-bg">
    <nav className="navbar">
      <div className="logo">Infinite loop gadgets</div>
      <button className="hamburger-menu">☰</button>
      <div className="language">ENG ▼</div>
      <button className="search-btn">🔍</button>
    </nav>
    <section className="tech-main">
      <div className="tech-header">
        <h1>Alienware x18 <span className="model">Intel ultra 9</span></h1>
        <div className="price-location">
          <span className="price">$1,495,000</span>
          <span className="location"> India, Delhi</span>
        </div>
      </div>
      <img src="tech_IMAGE_URL" alt="Alienware x18" className="tech-image"/>
      <div className="tech-details">
        <div>
          <strong>2025</strong> <div className="caption">Year</div>
        </div>
        <div>
          <strong>Midnight black</strong> <div className="caption">Color</div>
        </div>
        <div>
          <strong>64 GB</strong> <div className="caption">RAM</div>
        </div>
        <button className="details-btn">Full details →</button>
      </div>
      <div className="arrow-nav">
        <button>↑</button>
        <button>↓</button>
      </div>
      <span className="tech-index">01</span>
    </section>
  </div>
);

export default HomePage;
