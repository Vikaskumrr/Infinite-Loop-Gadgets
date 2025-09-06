import React, { useState } from 'react';
import Logo from '../Logo/Logo';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import './HomePage.scss';

const HomePage: React.FC = () => {
  const [language, setLanguage] = useState('en');

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
    // Here you would also update any state that depends on the language,
    // like the text content of your components.
    console.log(`Language state in HomePage updated to: ${languageCode}`);
  };

  return (
    <div className="homepage-bg">
      <nav className="navbar">
        <div className="logo">
          <Logo language={language} />
        </div>
        <button className="hamburger-menu">☰</button>
        <LanguageSelector onLanguageChange={handleLanguageChange} selectedLanguage={language} />
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
};

export default HomePage;
