import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import Header from './components/Header/Header';
import Cart from './components/Cart/Cart';
import Loader from './components/Loader/Loader';
import MouseTrailer from './components/MouseTrailer/MouseTrailer';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import RouteBoundary from './components/RouteBoundary/RouteBoundary';
import Seo from './components/Seo/Seo';
import OfflineBanner from './components/OfflineBanner/OfflineBanner';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { getProductId } from './utils/productIdentity';
import type { LanguageCode, Order, Product, SortOption, UserProfile } from './types';
import './styles/app.scss';

const AccountDetailsPage = lazy(() => import('./components/AccountDetailsPage/AccountDetailsPage'));
const AboutUs = lazy(() => import('./components/AboutUs/AboutUs'));
const SubCategoryPage = lazy(() => import('./components/SubCategoryPage/SubCategoryPage'));
const ProductRoutePage = lazy(() => import('./components/ProductRoutePage/ProductRoutePage'));
const NotFoundPage = lazy(() => import('./components/NotFoundPage/NotFoundPage'));
const WishlistPage = lazy(() => import('./components/WishlistPage/WishlistPage'));
const ComparePage = lazy(() => import('./components/ComparePage/ComparePage'));
const CatalogLabPage = lazy(() => import('./components/CatalogLabPage/CatalogLabPage'));
const CheckoutRoutePage = lazy(() => import('./components/CheckoutRoutePage/CheckoutRoutePage'));
const RecentlyViewedPage = lazy(() => import('./components/RecentlyViewedPage/RecentlyViewedPage'));
const LoginPage = lazy(() => import('./components/AuthPage/LoginPage'));
const RegisterPage = lazy(() => import('./components/AuthPage/RegisterPage'));

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
    const [wishlistIds, setWishlistIds] = useLocalStorageState<string[]>('ilg.wishlist', []);
    const [compareIds, setCompareIds] = useLocalStorageState<string[]>('ilg.compare', []);
    const [recentlyViewedIds, setRecentlyViewedIds] = useLocalStorageState<string[]>('ilg.recentlyViewed', []);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState<SortOption>('none');
    const isOnline = useOnlineStatus();

    const withRoute = (title: string, description: string, element: React.ReactNode) => (
        <RouteBoundary>
            <Seo title={title} description={description} />
            {element}
        </RouteBoundary>
    );

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

    const handleToggleWishlist = (product: Product) => {
        const id = getProductId(product);
        setWishlistIds((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [id, ...ids]));
    };

    const handleToggleCompare = (product: Product) => {
        const id = getProductId(product);
        setCompareIds((ids) => {
            if (ids.includes(id)) {
                return ids.filter((item) => item !== id);
            }

            return [id, ...ids].slice(0, 4);
        });
    };

    const handleTrackRecentlyViewed = (product: Product) => {
        const id = getProductId(product);
        setRecentlyViewedIds((ids) => [id, ...ids.filter((item) => item !== id)].slice(0, 8));
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
            <OfflineBanner isOnline={isOnline} />
            <main className="content">
                <Suspense fallback={<Loader />}>
                  <Routes>
                      <Route path="/" element={withRoute('Premium Gadget Store', 'Shop curated gadgets with wishlist, compare, and demo checkout.', <HomePage
                          language={language}
                          onCloseCart={handleCloseCart}
                          cartItems={cartItems}
                          setCartItems={setCartItems}
                          searchTerm={searchTerm}
                          sortOption={sortOption}
                          onOrderPlaced={(order) => setOrders((currentOrders) => [order, ...currentOrders])}
                      />)} />
                      <Route path="/account" element={withRoute('Account', 'Manage your local demo profile and order history.', <AccountDetailsPage profile={profile} orders={orders} onProfileChange={setProfile} />)} />
                      <Route path="/login" element={withRoute('Login', 'Log in to Infinite Loop Gadgets.', <LoginPage />)} />
                      <Route path="/register" element={withRoute('Register', 'Create an Infinite Loop Gadgets account.', <RegisterPage />)} />
                      <Route path="/about" element={withRoute('About', 'Learn about Infinite Loop Gadgets.', <AboutUs />)} />
                      <Route path="/products" element={withRoute('Products', 'Browse the full gadget catalog.', <SubCategoryPage language={language} onAddToCart={handleAddToCart} onWishlistToggle={handleToggleWishlist} onCompareToggle={handleToggleCompare} wishlistIds={wishlistIds} compareIds={compareIds} />)} />
                      <Route path="/categories/:categorySlug" element={withRoute('Category', 'Browse filtered gadget categories.', <SubCategoryPage language={language} onAddToCart={handleAddToCart} onWishlistToggle={handleToggleWishlist} onCompareToggle={handleToggleCompare} wishlistIds={wishlistIds} compareIds={compareIds} />)} />
                      <Route path="/categories/:categorySlug/:subCategorySlug" element={withRoute('Category', 'Browse filtered gadget categories.', <SubCategoryPage language={language} onAddToCart={handleAddToCart} onWishlistToggle={handleToggleWishlist} onCompareToggle={handleToggleCompare} wishlistIds={wishlistIds} compareIds={compareIds} />)} />
                      <Route path="/products/:productSlug" element={withRoute('Product Details', 'Inspect product specs, delivery, reviews, and recommendations.', <ProductRoutePage language={language} onAddToCart={handleAddToCart} onBuyNow={(product) => setCartItems([product])} onViewed={handleTrackRecentlyViewed} />)} />
                      <Route path="/wishlist" element={withRoute('Wishlist', 'Review products saved locally to your wishlist.', <WishlistPage wishlistIds={wishlistIds} compareIds={compareIds} onAddToCart={handleAddToCart} onWishlistToggle={handleToggleWishlist} onCompareToggle={handleToggleCompare} />)} />
                      <Route path="/recently-viewed" element={withRoute('Recently Viewed', 'Continue browsing recently viewed gadgets.', <RecentlyViewedPage recentlyViewedIds={recentlyViewedIds} wishlistIds={wishlistIds} compareIds={compareIds} onAddToCart={handleAddToCart} onWishlistToggle={handleToggleWishlist} onCompareToggle={handleToggleCompare} />)} />
                      <Route path="/compare" element={withRoute('Compare Gadgets', 'Compare shortlisted gadgets side by side.', <ComparePage compareIds={compareIds} onAddToCart={handleAddToCart} onCompareToggle={handleToggleCompare} />)} />
                      <Route path="/checkout" element={withRoute('Checkout', 'Complete the demo checkout flow.', <CheckoutRoutePage products={cartItems} language={language} onOrderPlaced={(order) => {
                          setOrders((currentOrders) => [order, ...currentOrders]);
                          setCartItems([]);
                      }} />)} />
                      <Route path="/checkout/:step" element={withRoute('Checkout', 'Complete the demo checkout flow.', <CheckoutRoutePage products={cartItems} language={language} onOrderPlaced={(order) => {
                          setOrders((currentOrders) => [order, ...currentOrders]);
                          setCartItems([]);
                      }} />)} />
                      <Route path="/catalog-lab" element={withRoute('Catalog Lab', 'Audit product data quality and price status.', <CatalogLabPage />)} />
                      <Route path="*" element={withRoute('Page Not Found', 'Return to the storefront.', <NotFoundPage />)} />
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
