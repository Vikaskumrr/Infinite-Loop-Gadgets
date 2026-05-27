import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import Header from './components/Header/Header';
import Cart from './components/Cart/Cart';
import Loader from './components/Loader/Loader';
import SubCategoryPage from './components/SubCategoryPage/SubCategoryPage';
import MouseTrailer from './components/MouseTrailer/MouseTrailer';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import ProductRoutePage from './components/ProductRoutePage/ProductRoutePage';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import type { LanguageCode, Order, Product, SortOption, UserProfile } from './types';
import './styles/app.scss';

const AccountDetailsPage = lazy(() => import('./components/AccountDetailsPage/AccountDetailsPage'));
const AboutUs = lazy(() => import('./components/AboutUs/AboutUs'));

const defaultProfile: UserProfile = {
    id: 'anonymous-shopper',
    name: 'Guest Shopper',
    email: 'guest@infiniteloopgadgets.example',
    mobileNumber: '',
    address: '',
    createdAt: new Date().toISOString(),
};

function App(): JSX.Element {
    const [language, setLanguage] = useState<LanguageCode>('en');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useLocalStorageState<Product[]>('ilg.cart', []);
    const [orders, setOrders] = useLocalStorageState<Order[]>('ilg.orders', []);
    const [profile, setProfile] = useLocalStorageState<UserProfile>('ilg.profile', defaultProfile);
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

    const handleAddToCart = (product: Product) => {
        setCartItems((items) => [...items, product]);
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
                          onOrderPlaced={(order) => setOrders((currentOrders) => [order, ...currentOrders])}
                      />} />
                      <Route path="/account" element={<AccountDetailsPage profile={profile} orders={orders} onProfileChange={setProfile} />} />
                      <Route path="/about" element={<AboutUs />} />
                      <Route path="/products" element={<SubCategoryPage language={language} onAddToCart={handleAddToCart} />} />
                      <Route path="/categories/:categorySlug" element={<SubCategoryPage language={language} onAddToCart={handleAddToCart} />} />
                      <Route path="/categories/:categorySlug/:subCategorySlug" element={<SubCategoryPage language={language} onAddToCart={handleAddToCart} />} />
                      <Route path="/products/:productSlug" element={<ProductRoutePage language={language} onAddToCart={handleAddToCart} onBuyNow={(product) => setCartItems([product])} />} />
                      <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
                {isCartOpen && (
                    <Cart
                        cartItems={cartItems}
                        onClose={handleCloseCart}
                        onRemoveFromCart={handleRemoveFromCart}
                        language={language}
                        onOrderPlaced={(order) => {
                            setOrders((currentOrders) => [order, ...currentOrders]);
                            setCartItems([]);
                        }}
                    />
                )}
            </main>
            <MouseTrailer />
        </div>
      </ErrorBoundary>
    );
}

export default App;
