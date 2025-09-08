import React, { useState } from 'react';
import Logo from '../Logo/Logo';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import Product from '../Products/Products';
import ArrowNav from '../ArrowNavigation/ArrowNavigation';
import './HomePage.scss';

// Mock product data
const products = [
  {
    name: 'Alienware x18',
    model: 'Intel ultra 9',
    price: '$1,495,000',
    location: 'India, Delhi',
    image: 'https://placehold.co/600x400/000000/FFFFFF?text=Laptop',
    year: '2025',
    color: 'Midnight black',
    ram: '64 GB',
  },
  {
    name: 'Samsung Galaxy',
    model: 'S25 Ultra',
    price: '$1,200',
    location: 'USA, New York',
    image: 'https://placehold.co/600x400/808080/FFFFFF?text=Mobile',
    year: '2025',
    color: 'Space Grey',
    ram: '16 GB',
  },
  {
    name: 'Apple',
    model: 'Vision Pro 2',
    price: '$3,499',
    location: 'USA, California',
    image: 'https://placehold.co/600x400/D3D3D3/000000?text=VR+Headset',
    year: '2025',
    color: 'White',
    ram: '32 GB',
  },
];

const HomePage: React.FC = () => {
  const [language, setLanguage] = useState('en');
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  return (
    <div className="homepage-bg">
      <nav className="navbar">
        <div className="logo">
          <Logo language={language} />
        </div>
        <div>
          <LanguageSelector onLanguageChange={handleLanguageChange} selectedLanguage={language} />
        </div>
        <button className="search-btn">🔍</button>
        <button className="hamburger-menu">☰</button>
      </nav>
      <Product product={products[currentIndex]} language={language} />
      <ArrowNav
        onPrev={handlePrev}
        onNext={handleNext}
        currentIndex={currentIndex}
        totalProducts={products.length}
      />
    </div>
  );
};

export default HomePage;
