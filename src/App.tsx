import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import Header from './components/Header/Header';
import Cart from './components/Cart/Cart';
import Loader from './components/Loader/Loader';
import './styles/app.scss';

const AccountDetailsPage = lazy(() => import('./components/AccountDetailsPage/AccountDetailsPage'));
const AboutUs = lazy(() => import('./components/AboutUs/AboutUs'));

function App(): JSX.Element {
    const [language, setLanguage] = useState('en');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('none');

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
                          isCartOpen={isCartOpen}
                          onOpenCart={handleOpenCart}
                          onCloseCart={handleCloseCart}
                          cartItems={cartItems}
                          setCartItems={setCartItems}
                          searchTerm={searchTerm}
                          setSearchTerm={setSearchTerm}
                          sortOption={sortOption}
                          setSortOption={setSortOption}
                      />} />
                      <Route path="/account" element={<AccountDetailsPage />} />
                      <Route path="/about" element={<AboutUs />} />
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
        </div>
    );
}

export default App;
