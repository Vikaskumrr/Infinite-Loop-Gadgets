import React, { useState, useEffect } from 'react';
import Product from '../Products/Products';
import ArrowNav from '../ArrowNavigation/ArrowNavigation';
import ProductDetails from '../ProductDetails/ProductDetails';
import Cart from '../Cart/Cart';
import Checkout from '../Checkout/Checkout';
import Footer from '../Footer/Footer';
import './HomePage.scss';

interface HomePageProps {
  language: string;
  isCartOpen: boolean;
  onOpenCart: () => void;
  onCloseCart: () => void;
  cartItems: any[];
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  sortOption: string;
  setSortOption: React.Dispatch<React.SetStateAction<string>>;
}

const HomePage: React.FC<HomePageProps> = ({
  language,
  isCartOpen,
  onOpenCart,
  onCloseCart,
  cartItems,
  setCartItems,
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const binId: any = '68bf1a1ed0ea881f4076533c'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`);
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.record && Array.isArray(data.record.products)) {
          setProducts(data.record.products);
          setFilteredProducts(data.record.products);
        } else {
          setError('Invalid data format from API.');
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let newFilteredProducts = [...products];

    if (searchTerm) {
      newFilteredProducts = newFilteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOption === 'price-asc') {
      newFilteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      newFilteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      newFilteredProducts.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(newFilteredProducts);
    setCurrentIndex(0);
  }, [searchTerm, sortOption, products]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredProducts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredProducts.length) % filteredProducts.length);
  };

  const handleOpenDetails = () => {
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  const handleOpenCheckout = (items: any[]) => {
    setCheckoutItems(items);
    setIsCheckoutOpen(true);
    setIsDetailsOpen(false);
    onCloseCart();
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

  const handleRemoveFromCart = (index: number) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
  };

  if (loading) {
    return <div className="homepage-bg">Loading products...</div>;
  }

  if (error) {
    return <div className="homepage-bg">Error: {error}</div>;
  }

  if (filteredProducts.length === 0) {
    return <div className="homepage-bg">No products found.</div>;
  }

  return (
    <div className="homepage-bg">
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
      {isCartOpen && (
        <Cart
          cartItems={cartItems}
          onClose={onCloseCart}
          onRemoveFromCart={handleRemoveFromCart}
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
