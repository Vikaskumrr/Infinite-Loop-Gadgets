import React, { useState, useEffect } from 'react';
import Logo from '../Logo/Logo';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import Product from '../Products/Products';
import ArrowNav from '../ArrowNavigation/ArrowNavigation';
import ProductDetails from '../ProductDetails/ProductDetails';
import Cart from '../Cart/Cart';
import Checkout from '../Checkout/Checkout';
import SearchFilter from '../SearchFilter/SearchFilter';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu'; // Assuming HamburgerMenu.tsx is in the same folder
import './HomePage.scss';

const HomePage: React.FC = () => {
  const [language, setLanguage] = useState('en');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('none');
  const binId: any = '68bf1a1ed0ea881f4076533c'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`);

        // Log the response status for debugging
        if (!response.ok) {
          console.error('API request failed with status:', response.status);
          throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        // Log the full API response to the console
        console.log('API Response:', data);
        
        // Correctly access the 'products' key, which is nested under the 'record' key
        if (data && data.record && Array.isArray(data.record.products)) {
          setProducts(data.record.products);
          setFilteredProducts(data.record.products); // Initialize filtered products
        } else {
          // If the products key is not an array, set a specific error message
          setError('Invalid data format received from API. Expected an array under the "products" key.');
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

  // Effect for filtering and sorting products
  useEffect(() => {
    let newFilteredProducts = [...products];

    // Filter by search term
    if (searchTerm) {
      newFilteredProducts = newFilteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    if (sortOption === 'price-asc') {
      newFilteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      newFilteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      newFilteredProducts.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(newFilteredProducts);
    setCurrentIndex(0); // Reset index after filtering/sorting
  }, [searchTerm, sortOption, products]);

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
  };

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
      <nav className="navbar">
        <div className="logo">
          <Logo language={language} />
        </div>
        <div>
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortOption={sortOption}
          onSortChange={setSortOption}
        />
        </div>
        <div>
          <LanguageSelector onLanguageChange={handleLanguageChange} selectedLanguage={language} />
        </div>
        <button className="cart-btn" onClick={handleOpenCart}>🛒</button>
        <HamburgerMenu />
      </nav>

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
          onClose={handleCloseCart}
          onCheckout={handleCheckoutFromCart}
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
    </div>
  );
};

export default HomePage;
