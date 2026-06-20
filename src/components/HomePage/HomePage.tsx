import React, { useEffect, useState } from 'react';
import Product from '../Products/Products';
import ArrowNav from '../ArrowNavigation/ArrowNavigation';
import ProductDetails from '../ProductDetails/ProductDetails';
import Checkout from '../Checkout/Checkout';
import Footer from '../Footer/Footer';
import Loader from '../Loader/Loader';
import ChatboxAssistant from '../ChatboxAssistant/ChatboxAssistant';
import ProductCard from '../ProductCard/ProductCard';
import RetryState from '../RetryState/RetryState';
import { useProducts } from '../../hooks/useProducts';
import { categories, slugify } from '../../data/categories';
import type { LanguageCode, Order, Product as ProductType, SortOption } from '../../types';
import './HomePage.scss';

interface HomePageProps {
  language: LanguageCode;
  onCloseCart: () => void;
  onAddToCart: (product: ProductType, quantity?: number) => Promise<void> | void;
  onAddBundle: (products: ProductType[]) => Promise<void> | void;
  searchTerm: string;
  sortOption: SortOption;
  onOrderPlaced?: (order: Order) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  language,
  onCloseCart,
  onAddToCart,
  onAddBundle,
  searchTerm,
  sortOption,
  onOrderPlaced,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<ProductType[]>([]);
  const { filteredProducts, loading, error, retry } = useProducts(searchTerm, sortOption);

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

  const handleBuyNow = (product: ProductType) => {
    handleOpenCheckout([product]);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <RetryState
        title="We could not load the gadget lineup."
        message={error}
        actionLabel="Retry product feed"
        onRetry={retry}
      />
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
      <section className="home-commerce-hero" aria-label="Store highlights">
        <div>
          <span className="state-kicker">Premium gadget store</span>
          <h1>Find your next everyday upgrade.</h1>
          <p>Curated phones, audio, gaming, smart home, and productivity gear with transparent price confidence and local checkout demos.</p>
        </div>
        <div className="home-deal-strip">
          <strong>Today’s edit</strong>
          <span>Verified-price picks, category filters, compare tools, and wishlist shortcuts are ready.</span>
        </div>
      </section>

      <nav className="category-chip-row" aria-label="Shop quick categories">
        {categories.flatMap((category) => category.subcategories.slice(0, 2)).map((category) => (
          <a href={`/categories/${slugify(category)}`} key={category}>{category}</a>
        ))}
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
          onAddToCart={(product) => void onAddToCart(product, 1)}
          onBuyNow={handleBuyNow}
          language={language}
        />
      )}
      {isCheckoutOpen && (
        <Checkout
          products={checkoutItems}
          onClose={handleCloseCheckout}
          language={language}
          onOrderPlaced={onOrderPlaced}
        />
      )}
      <section className="storefront-section">
        <div className="section-heading">
          <span className="state-kicker">Top picks</span>
          <h2>Highest-rated gadgets</h2>
        </div>
        <div className="home-product-grid">
          {[...filteredProducts].sort((a, b) => b.rating - a.rating).slice(0, 4).map((product) => (
            <ProductCard key={`${product.brand}-${product.name}`} product={product} onAddToCart={(nextProduct) => onAddToCart(nextProduct, 1)} />
          ))}
        </div>
      </section>

      <section className="trust-row" aria-label="Store promises">
        <div><strong>Demo checkout</strong><span>No real payment processed</span></div>
        <div><strong>Persistent cart</strong><span>Syncs to your account after sign-in</span></div>
        <div><strong>Source-backed catalog</strong><span>Price status shown clearly</span></div>
        <div><strong>Compare tools</strong><span>Shortlist before buying</span></div>
      </section>

      <section className="bundle-builder">
        <div>
          <span className="state-kicker">Bundle builder</span>
          <h2>Build a travel tech kit</h2>
          <p>Pair a phone, headphones, and power bank for a complete mobile setup.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            const bundle = filteredProducts.filter((product) => /phone|headphone|power/i.test(`${product.name} ${product.subcategory}`)).slice(0, 3);
            void onAddBundle(bundle);
          }}
        >
          Add suggested bundle
        </button>
      </section>
      <Footer/>
    </div>
  );
};

export default HomePage;
