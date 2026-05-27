import React, { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { categories, slugify } from '../../data/categories';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../ProductCard/ProductCard';
import { ProductGridSkeleton } from '../Skeletons/Skeletons';
import type { LanguageCode, Product } from '../../types';
import './SubCategoryPage.scss';

interface SubCategoryPageProps {
  language: LanguageCode;
  onAddToCart: (product: Product) => void;
}

const SubCategoryPage: React.FC<SubCategoryPageProps> = ({ onAddToCart }) => {
  const [searchParams] = useSearchParams();
  const { categorySlug, subCategorySlug } = useParams();
  const category = subCategorySlug || categorySlug || searchParams.get('category') || 'electronics';
  const displayName = useMemo(() => {
    const allCategories = categories.flatMap((item) => [item.name, ...item.subcategories]);
    return allCategories.find((item) => slugify(item) === category) || category.replace(/-/g, ' ');
  }, [category]);
  const { filteredProducts, loading, error } = useProducts('', 'rating', displayName);

  if (loading) {
    return <ProductGridSkeleton />;
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
            <ProductCard
              key={`${product.brand}-${product.name}`}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubCategoryPage;
