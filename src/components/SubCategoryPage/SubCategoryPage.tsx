import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { categories, slugify } from '../../data/categories';
import { useProducts } from '../../hooks/useProducts';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import Loader from '../Loader/Loader';
import type { LanguageCode, Product } from '../../types';
import { formatProductPrice } from '../../utils/products';
import './SubCategoryPage.scss';

interface SubCategoryPageProps {
  language: LanguageCode;
  onAddToCart: (product: Product) => void;
}

const SubCategoryPage: React.FC<SubCategoryPageProps> = ({ onAddToCart }) => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'electronics';
  const displayName = useMemo(() => {
    const allCategories = categories.flatMap((item) => [item.name, ...item.subcategories]);
    return allCategories.find((item) => slugify(item) === category) || category.replace(/-/g, ' ');
  }, [category]);
  const { filteredProducts, loading, error } = useProducts('', 'rating', displayName);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="category-state" role="alert">
        <span className="state-kicker">Category unavailable</span>
        <h1>We could not load products.</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="sub-category-container">
      <section className="category-hero">
        <span className="state-kicker">Shop category</span>
        <h1>{displayName}</h1>
        <p>Curated products from the live catalog, ranked by customer rating.</p>
      </section>

      {filteredProducts.length === 0 ? (
        <div className="category-state">
          <h2>No category matches yet.</h2>
          <p>Try another category or return to the full storefront.</p>
          <Link to="/">Browse all products</Link>
        </div>
      ) : (
        <div className="category-grid">
          {filteredProducts.map((product) => (
            <article key={`${product.brand}-${product.name}`} className="category-product-card">
              <OptimizedImage src={product.productImage} alt={product.name} className="category-product-image" sizes="(max-width: 760px) 92vw, 280px" />
              <div className="category-product-copy">
                <span>{product.brand}</span>
                <h2>{product.name}</h2>
                <p>{product.description || `${product.color} finish with ${product.rating} star rating.`}</p>
                {product.features && product.features.length > 0 && (
                  <ul className="category-feature-list" aria-label={`${product.name} key features`}>
                    {product.features.slice(0, 3).map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="category-product-actions">
                <strong className={product.priceStatus === 'todo' ? 'needs-verification' : ''}>
                  {formatProductPrice(product)}
                </strong>
                <button type="button" onClick={() => onAddToCart(product)}>Add to Cart</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubCategoryPage;
