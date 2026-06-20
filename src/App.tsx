import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './auth/useAuth';
import { useCart } from './cart/hooks/useCart';
import HomePage from './components/HomePage/HomePage';
import Header from './components/Header/Header';
import Cart from './components/Cart/Cart';
import Loader from './components/Loader/Loader';
import MouseTrailer from './components/MouseTrailer/MouseTrailer';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import RouteBoundary from './components/RouteBoundary/RouteBoundary';
import Seo from './components/Seo/Seo';
import OfflineBanner from './components/OfflineBanner/OfflineBanner';
import AdminRoute from './admin/AdminRoute';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import {
    clearMigratedGuestFeatureKeys,
    clearMigrationSkipped,
    readGuestFeatureData,
    runGuestDataMigration,
    shouldPromptForMigration,
    markMigrationSkipped,
} from './user/migrationService';
import { useCompare } from './user/hooks/useCompare';
import { useRecentlyViewed } from './user/hooks/useRecentlyViewed';
import { useWishlist } from './user/hooks/useWishlist';
import type { LanguageCode, SortOption, UserProfile } from './types';
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
const UserDataMigrationPrompt = lazy(() => import('./components/UserDataMigrationPrompt/UserDataMigrationPrompt'));
const CartMigrationPrompt = lazy(() => import('./components/CartMigrationPrompt/CartMigrationPrompt'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const ProductManagement = lazy(() => import('./admin/ProductManagement'));
const InventoryManagement = lazy(() => import('./admin/InventoryManagement'));
const OrderManagement = lazy(() => import('./admin/OrderManagement'));

const defaultProfile: UserProfile = {
    id: 'anonymous-shopper',
    name: 'Guest Shopper',
    email: 'guest@infiniteloopgadgets.example',
    mobileNumber: '',
    address: '',
    createdAt: new Date().toISOString(),
};

function App(): JSX.Element {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const {
        cart,
        addItem,
        addMany,
        updateQuantity,
        removeItem,
        clearCart,
        cartMigrationPrompt,
    } = useCart();
    const [language, setLanguage] = useState<LanguageCode>('en');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [profile, setProfile] = useLocalStorageState<UserProfile>('ilg.profile', defaultProfile);
    const {
        wishlistIds,
        toggleWishlist: handleToggleWishlist,
        importWishlist,
    } = useWishlist(token);
    const {
        compareIds,
        toggleCompare: handleToggleCompare,
        importCompare,
    } = useCompare(token);
    const {
        recentlyViewedIds,
        trackRecentlyViewed: handleTrackRecentlyViewed,
        importRecentlyViewed,
    } = useRecentlyViewed(token);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState<SortOption>('none');
    const isOnline = useOnlineStatus();
    const [showMigrationPrompt, setShowMigrationPrompt] = useState(false);
    const [migrationPreview, setMigrationPreview] = useState(() => readGuestFeatureData());
    const [migrationError, setMigrationError] = useState<string | null>(null);
    const [migrationLoading, setMigrationLoading] = useState(false);

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

    React.useEffect(() => {
        if (!user?.id) {
            setShowMigrationPrompt(false);
            return;
        }

        const nextPreview = readGuestFeatureData();
        setMigrationPreview(nextPreview);

        if (shouldPromptForMigration(user.id, nextPreview)) {
            setShowMigrationPrompt(true);
            setMigrationError(null);
            clearMigrationSkipped(user.id);
        } else {
            setShowMigrationPrompt(false);
        }
    }, [user?.id]);

    const handleSkipMigration = React.useCallback(() => {
        if (user?.id) {
            markMigrationSkipped(user.id);
        }
        setShowMigrationPrompt(false);
        setMigrationError(null);
    }, [user?.id]);

    const handleImportMigration = React.useCallback(async () => {
        if (!user?.id) {
            return;
        }

        setMigrationLoading(true);
        setMigrationError(null);

        try {
            const result = await runGuestDataMigration(migrationPreview, {
                importWishlist,
                importCompare,
                importRecentlyViewed,
            });

            clearMigratedGuestFeatureKeys(result);
            setMigrationPreview(readGuestFeatureData());

            if (result.failedKeys.length > 0) {
                setMigrationError(`We imported what we could, but ${result.failedKeys.join(', ')} still need attention.`);
            } else {
                setShowMigrationPrompt(false);
            }
        } catch (caughtError) {
            setMigrationError(caughtError instanceof Error ? caughtError.message : 'Unable to migrate your saved items right now.');
        } finally {
            setMigrationLoading(false);
        }
    }, [importCompare, importRecentlyViewed, importWishlist, migrationPreview, user?.id]);


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
                cartCount={cart.itemCount}
            />
            <OfflineBanner isOnline={isOnline} />
            <main className="content">
                <Suspense fallback={<Loader />}>
                  <Routes>
                      <Route path="/" element={withRoute('Premium Gadget Store', 'Shop curated gadgets with wishlist, compare, and demo checkout.', <HomePage
                          language={language}
                          onCloseCart={handleCloseCart}
                          onAddToCart={addItem}
                          onAddBundle={addMany}
                          searchTerm={searchTerm}
                          sortOption={sortOption}
                      />)} />
                      <Route path="/account" element={withRoute('Account', 'Manage your profile and review your order history.', <AccountDetailsPage profile={profile} onProfileChange={setProfile} />)} />
                      <Route path="/login" element={withRoute('Login', 'Log in to Infinite Loop Gadgets.', <LoginPage />)} />
                      <Route path="/register" element={withRoute('Register', 'Create an Infinite Loop Gadgets account.', <RegisterPage />)} />
                      <Route path="/about" element={withRoute('About', 'Learn about Infinite Loop Gadgets.', <AboutUs />)} />
                      <Route path="/products" element={withRoute('Products', 'Browse the full gadget catalog.', <SubCategoryPage language={language} onAddToCart={addItem} onWishlistToggle={handleToggleWishlist} onCompareToggle={handleToggleCompare} wishlistIds={wishlistIds} compareIds={compareIds} />)} />
                      <Route path="/categories/:categorySlug" element={withRoute('Category', 'Browse filtered gadget categories.', <SubCategoryPage language={language} onAddToCart={addItem} onWishlistToggle={handleToggleWishlist} onCompareToggle={handleToggleCompare} wishlistIds={wishlistIds} compareIds={compareIds} />)} />
                      <Route path="/categories/:categorySlug/:subCategorySlug" element={withRoute('Category', 'Browse filtered gadget categories.', <SubCategoryPage language={language} onAddToCart={addItem} onWishlistToggle={handleToggleWishlist} onCompareToggle={handleToggleCompare} wishlistIds={wishlistIds} compareIds={compareIds} />)} />
                      <Route path="/products/:productSlug" element={withRoute('Product Details', 'Inspect product specs, delivery, reviews, and recommendations.', <ProductRoutePage language={language} onAddToCart={addItem} onBuyNow={async (product) => {
                          await clearCart();
                          await addItem(product, 1);
                          navigate('/checkout/review');
                      }} onViewed={handleTrackRecentlyViewed} />)} />
                      <Route path="/wishlist" element={withRoute('Wishlist', 'Review products saved locally to your wishlist.', <WishlistPage wishlistIds={wishlistIds} compareIds={compareIds} onAddToCart={addItem} onWishlistToggle={handleToggleWishlist} onCompareToggle={handleToggleCompare} />)} />
                      <Route path="/recently-viewed" element={withRoute('Recently Viewed', 'Continue browsing recently viewed gadgets.', <RecentlyViewedPage recentlyViewedIds={recentlyViewedIds} wishlistIds={wishlistIds} compareIds={compareIds} onAddToCart={addItem} onWishlistToggle={handleToggleWishlist} onCompareToggle={handleToggleCompare} />)} />
                      <Route path="/compare" element={withRoute('Compare Gadgets', 'Compare shortlisted gadgets side by side.', <ComparePage compareIds={compareIds} onAddToCart={addItem} onCompareToggle={handleToggleCompare} />)} />
                      <Route path="/checkout" element={withRoute('Checkout', 'Complete the account checkout flow.', <CheckoutRoutePage language={language} />)} />
                      <Route path="/checkout/:step" element={withRoute('Checkout', 'Complete the account checkout flow.', <CheckoutRoutePage language={language} />)} />
                      <Route path="/catalog-lab" element={withRoute('Catalog Lab', 'Audit product data quality and price status.', <CatalogLabPage />)} />
                      <Route
                        path="/admin"
                        element={withRoute('Admin Dashboard', 'Manage products, inventory, and orders.', <AdminRoute><AdminLayout /></AdminRoute>)}
                      >
                        <Route index element={<AdminDashboard />} />
                        <Route path="products" element={<ProductManagement />} />
                        <Route path="inventory" element={<InventoryManagement />} />
                        <Route path="orders" element={<OrderManagement />} />
                      </Route>
                      <Route path="*" element={withRoute('Page Not Found', 'Return to the storefront.', <NotFoundPage />)} />
                  </Routes>
                </Suspense>
                {isCartOpen && (
                    <Cart
                        cartItems={cart.items}
                        onClose={handleCloseCart}
                        onRemoveFromCart={removeItem}
                        onUpdateQuantity={updateQuantity}
                        onClearCart={clearCart}
                        language={language}
                    />
                )}
                {showMigrationPrompt && (
                    <Suspense fallback={null}>
                        <UserDataMigrationPrompt
                            wishlistCount={migrationPreview.wishlistIds.length}
                            compareCount={migrationPreview.compareIds.length}
                            recentlyViewedCount={migrationPreview.recentlyViewedIds.length}
                            loading={migrationLoading}
                            error={migrationError}
                            onImport={handleImportMigration}
                            onSkip={handleSkipMigration}
                        />
                    </Suspense>
                )}
                {!showMigrationPrompt && cartMigrationPrompt.open && (
                    <Suspense fallback={null}>
                        <CartMigrationPrompt
                            itemCount={cartMigrationPrompt.items.reduce((total, item) => total + item.quantity, 0)}
                            loading={cartMigrationPrompt.loading}
                            error={cartMigrationPrompt.error}
                            onImport={() => { void cartMigrationPrompt.importGuestCart(); }}
                            onSkip={cartMigrationPrompt.skipGuestCartImport}
                        />
                    </Suspense>
                )}
            </main>
            <MouseTrailer />
        </div>
      </ErrorBoundary>
    );
}

export default App;
