import React, { useState } from 'react';
import Logo from '../Logo/Logo';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import Product from '../Products/Products';
import ArrowNav from '../ArrowNavigation/ArrowNavigation';
import ProductDetails from '../ProductDetails/ProductDetails';
import Cart from '../Cart/Cart';
import Checkout from '../Checkout/Checkout';
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
    description: 'The Alienware x18 is a high-performance gaming laptop designed for the most demanding games and creative tasks. It features the latest Intel Ultra 9 processor, a high-refresh-rate display, and a sleek, compact design.',
    rating: 4,
    specifications: [
      { key: 'CPU', value: 'Intel Ultra 9' },
      { key: 'GPU', value: 'NVIDIA GeForce RTX 4090' },
      { key: 'Storage', value: '2 TB SSD' },
      { key: 'Display', value: '18" QHD+ (2560 x 1600) 240Hz' },
      { key: 'OS', value: 'Windows 11 Pro' },
    ],
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
    description: 'The Samsung Galaxy S25 Ultra is the pinnacle of smartphone technology, with an advanced camera system, a stunning AMOLED display, and a long-lasting battery. It is perfect for both productivity and entertainment.',
    rating: 5,
    specifications: [
      { key: 'Processor', value: 'Snapdragon 9 Gen 1' },
      { key: 'Display', value: '6.8" Dynamic AMOLED 2X' },
      { key: 'Camera', value: '200MP Main, 10x Optical Zoom' },
      { key: 'Battery', value: '5000mAh' },
      { key: 'Storage', value: '512 GB' },
    ],
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
    description: 'Apple Vision Pro 2 is a mixed-reality headset that seamlessly blends the digital and physical worlds. It features a high-resolution display, spatial audio, and an intuitive control system for a truly immersive experience.',
    rating: 4,
    specifications: [
      { key: 'Chipset', value: 'Apple R1' },
      { key: 'Display', value: 'Micro-OLED, 23 million pixels' },
      { key: 'Audio', value: 'Spatial Audio with dynamic head tracking' },
      { key: 'Controls', value: 'Hand and Eye Tracking' },
      { key: 'Connectivity', value: 'Wi-Fi 6E, Bluetooth 5.3' },
    ],
  },
];

const HomePage: React.FC = () => {
  const [language, setLanguage] = useState('en');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  const handleOpenDetails = () => {
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const handleOpenCheckout = (items: any[]) => {
    setCheckoutItems(items);
    setIsCheckoutOpen(true);
    // Close other modals
    setIsDetailsOpen(false);
    setIsCartOpen(false);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setCheckoutItems([]);
  };

  const handleAddToCart = (product: any) => {
    setCartItems([...cartItems, product]);
  };

  const handleBuyNow = (product: any) => {
    handleOpenCheckout([product]);
  };

  const handleCheckoutFromCart = () => {
    handleOpenCheckout(cartItems);
    setCartItems([]);
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
        <button className="cart-btn" onClick={handleOpenCart}>🛒</button>
        <button className="hamburger-menu">☰</button>
      </nav>
      <Product product={products[currentIndex]} language={language} onDetailsClick={handleOpenDetails} />
      <ArrowNav
        onPrev={handlePrev}
        onNext={handleNext}
        currentIndex={currentIndex}
        totalProducts={products.length}
      />
      {isDetailsOpen && (
        <ProductDetails
          product={products[currentIndex]}
          onClose={handleCloseDetails}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          language={language}
        />
      )}
      {isCartOpen && (
        <Cart
          cartItems={cartItems}
          onClose={handleCloseCart}
          onCheckout={handleCheckoutFromCart}
          language={language}
        />
      )}
      {isCheckoutOpen && (
        <Checkout
          products={checkoutItems}
          onClose={handleCloseCheckout}
          language={language}
        />
      )}
    </div>
  );
};

export default HomePage;
