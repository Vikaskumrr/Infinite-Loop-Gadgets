import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import Header from './components/Header/Header';
import AccountDetailsPage from './components/AccountDetailsPage/AccountDetailsPage';
import Cart from './components/Cart/Cart';
import AboutUs from './components/AboutUs/AboutUs';
import './styles/app.scss';

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

    const handleCheckoutFromCart = () => {
      // Logic for handling checkout from cart
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
            />
            <main className="content">
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
