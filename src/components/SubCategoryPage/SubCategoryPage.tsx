import React, { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { categories, slugify } from '../../data/categories';
import { useProducts } from '../../hooks/useProducts';
import { getProductId } from '../../utils/productIdentity';
import ProductCard from '../ProductCard/ProductCard';
import RetryState from '../RetryState/RetryState';
import { ProductGridSkeleton } from '../Skeletons/Skeletons';
import type { LanguageCode, Product } from '../../types';
import './SubCategoryPage.scss';

interface SubCategoryPageProps {
  language: LanguageCode;
  onAddToCart: (product: Product) => void;
  onWishlistToggle?: (product: Product) => void;
  onCompareToggle?: (product: Product) => void;
  wishlistIds?: string[];
  compareIds?: string[];
}

const SubCategoryPage: React.FC<SubCategoryPageProps> = ({
  onAddToCart,
  onWishlistToggle,
  onCompareToggle,
  wishlistIds = [],
  compareIds = [],
}) => {
  const [searchParams] = useSearchParams();
  const { categorySlug, subCategorySlug } = useParams();
  const category = subCategorySlug || categorySlug || searchParams.get('category') || 'electronics';
  const displayName = useMemo(() => {
    const allCategories = categories.flatMap((item) => [item.name, ...item.subcategories]);
    return allCategories.find((item) => slugify(item) === category) || category.replace(/-/g, ' ');
  }, [category]);
  const [brandFilter, setBrandFilter] = React.useState('all');
  const [priceFilter, setPriceFilter] = React.useState('all');
  const [verifiedOnly, setVerifiedOnly] = React.useState(false);
  const [categorySearch, setCategorySearch] = React.useState('');
  const { filteredProducts, loading, error, retry } = useProducts(categorySearch, 'rating', displayName);

  const brands = useMemo(() => Array.from(new Set(filteredProducts.map((product) => product.brand))).sort(), [filteredProducts]);
  const discoveryProducts = useMemo(() => filteredProducts.filter((product) => {
    const matchesBrand = brandFilter === 'all' || product.brand === brandFilter;
    const matchesVerified = !verifiedOnly || product.priceStatus === 'verified';
    const matchesPrice = priceFilter === 'all'
      || (priceFilter === 'under-50000' && product.price < 50000)
      || (priceFilter === '50000-100000' && product.price >= 50000 && product.price <= 100000)
      || (priceFilter === 'over-100000' && product.price > 100000);
    return matchesBrand && matchesVerified && matchesPrice;
  }), [brandFilter, filteredProducts, priceFilter, verifiedOnly]);

  if (loading) {
    return <ProductGridSkeleton />;
  }

  if (error) {
    return (
      <RetryState
        title="We could not load this category."
        message={error}
        actionLabel="Retry category"
        onRetry={retry}
      />
    );
  }

  return (
    <div className="sub-category-container">
      <section className="category-hero">
        <span className="state-kicker">Shop category</span>
        <h1>{displayName}</h1>
        <p>Curated products from the live catalog, ranked by customer rating.</p>
      </section>

      <section className="discovery-bar" aria-label="Product discovery filters">
        <label>
          <span>Search</span>
          <input value={categorySearch} onChange={(event) => setCategorySearch(event.target.value)} placeholder="Find gadgets..." />
        </label>
        <label>
          <span>Brand</span>
          <select value={brandFilter} onChange={(event) => setBrandFilter(event.target.value)}>
            <option value="all">All brands</option>
            {brands.map((brand) => <option value={brand} key={brand}>{brand}</option>)}
          </select>
        </label>
        <label>
          <span>Price</span>
          <select value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)}>
            <option value="all">Any price</option>
            <option value="under-50000">Under ₹50k</option>
            <option value="50000-100000">₹50k-₹100k</option>
            <option value="over-100000">Over ₹100k</option>
          </select>
        </label>
        <label className="discovery-check">
          <input type="checkbox" checked={verifiedOnly} onChange={(event) => setVerifiedOnly(event.target.checked)} />
          <span>Verified prices only</span>
        </label>
      </section>

      {discoveryProducts.length === 0 ? (
        <div className="category-state">
          <h2>No category matches yet.</h2>
          <p>Try clearing a filter, searching less specifically, or return to the full storefront.</p>
          <Link to="/">Browse all products</Link>
        </div>
      ) : (
        <div className="category-grid">
          {discoveryProducts.map((product) => (
            <ProductCard
              key={`${product.brand}-${product.name}`}
              product={product}
              onAddToCart={onAddToCart}
              onWishlistToggle={onWishlistToggle}
              onCompareToggle={onCompareToggle}
              isWishlisted={wishlistIds.includes(getProductId(product))}
              isCompared={compareIds.includes(getProductId(product))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubCategoryPage;
