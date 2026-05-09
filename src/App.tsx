import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import Header from './components/Header/Header';
import Cart from './components/Cart/Cart';
import Loader from './components/Loader/Loader';
import SubCategoryPage from './components/SubCategoryPage/SubCategoryPage';
import MouseTrailer from './components/MouseTrailer/MouseTrailer';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import type { LanguageCode, Product, SortOption } from './types';
import './styles/app.scss';

const AccountDetailsPage = lazy(() => import('./components/AccountDetailsPage/AccountDetailsPage'));
const AboutUs = lazy(() => import('./components/AboutUs/AboutUs'));

function App(): JSX.Element {
    const [language, setLanguage] = useState<LanguageCode>('en');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState<SortOption>('none');

    const handleOpenCart = () => {
        setIsCartOpen(true);
    };

    const handleCloseCart = () => {
        setIsCartOpen(false);
    };

    const handleRemoveFromCart = (index: number) => {
      const newCartItems = [...cartItems];
      newCartItems.splice(index, 1);
      setCartItems(newCartItems);
    };


    return (
      <ErrorBoundary>
        <div className="app">
            <Header
                language={language}
                onLanguageChange={setLanguage}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                sortOption={sortOption}
                onSortChange={setSortOption}
                onOpenCart={handleOpenCart}
                cartCount={cartItems.length}
            />
            <main className="content">
                <Suspense fallback={<Loader />}>
                  <Routes>
                      <Route path="/" element={<HomePage
                          language={language}
                          onCloseCart={handleCloseCart}
                          cartItems={cartItems}
                          setCartItems={setCartItems}
                          searchTerm={searchTerm}
                          sortOption={sortOption}
                      />} />
                      <Route path="/account" element={<AccountDetailsPage />} />
                      <Route path="/about" element={<AboutUs />} />
                      <Route path="/products" element={<SubCategoryPage />} />
                  </Routes>
                </Suspense>
                {isCartOpen && (
                    <Cart
                        cartItems={cartItems}
                        onClose={handleCloseCart}
                        onRemoveFromCart={handleRemoveFromCart}
                        language={language}
                    />
                )}
            </main>
            <MouseTrailer />
        </div>
      </ErrorBoundary>
    );
}

export default App;
