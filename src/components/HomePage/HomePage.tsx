import React, { useEffect, useState } from 'react';
import Product from '../Products/Products';
import ArrowNav from '../ArrowNavigation/ArrowNavigation';
import ProductDetails from '../ProductDetails/ProductDetails';
import Checkout from '../Checkout/Checkout';
import Footer from '../Footer/Footer';
import Loader from '../Loader/Loader';
import ChatboxAssistant from '../ChatboxAssistant/ChatboxAssistant';
import { useProducts } from '../../hooks/useProducts';
import type { LanguageCode, Product as ProductType, SortOption } from '../../types';
import './HomePage.scss';

interface HomePageProps {
  language: LanguageCode;
  onCloseCart: () => void;
  cartItems: ProductType[];
  setCartItems: React.Dispatch<React.SetStateAction<ProductType[]>>;
  searchTerm: string;
  sortOption: SortOption;
}

const HomePage: React.FC<HomePageProps> = ({
  language,
  onCloseCart,
  cartItems,
  setCartItems,
  searchTerm,
  sortOption,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<ProductType[]>([]);
  const { filteredProducts, loading, error } = useProducts(searchTerm, sortOption);

  useEffect(() => {
    setCurrentIndex(0);
  }, [searchTerm, sortOption, filteredProducts.length]);

  const handleNext = () => {
    if (filteredProducts.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredProducts.length);
  };

  const handlePrev = () => {
    if (filteredProducts.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredProducts.length) % filteredProducts.length);
  };

  const handleOpenDetails = () => {
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  const handleOpenCheckout = (items: ProductType[]) => {
    setCheckoutItems(items);
    setIsCheckoutOpen(true);
    setIsDetailsOpen(false);
    onCloseCart();
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setCheckoutItems([]);
  };

  const handleAddToCart = (product: ProductType) => {
    setCartItems([...cartItems, product]);
  };

  const handleBuyNow = (product: ProductType) => {
    handleOpenCheckout([product]);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="homepage-state" role="alert">
        <span className="state-kicker">Product feed unavailable</span>
        <h1>We could not load the gadget lineup.</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="homepage-state">
        <span className="state-kicker">No matches</span>
        <h1>No products found.</h1>
        <p>Try a broader search or reset the sort filter.</p>
      </div>
    );
  }

  return (
    <div className="animated-bg-container">
      <ChatboxAssistant />
      <Product product={filteredProducts[currentIndex]} language={language} onDetailsClick={handleOpenDetails} />
      <ArrowNav
        onPrev={handlePrev}
        onNext={handleNext}
        currentIndex={currentIndex}
        totalProducts={filteredProducts.length}
      />
      {isDetailsOpen && (
        <ProductDetails
          product={filteredProducts[currentIndex]}
          onClose={handleCloseDetails}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
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
      <Footer/>
    </div>
  );
};

export default HomePage;
