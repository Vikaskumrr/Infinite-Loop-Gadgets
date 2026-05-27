import React from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductDetails from '../ProductDetails/ProductDetails';
import { ProductDetailSkeleton } from '../Skeletons/Skeletons';
import { useProducts } from '../../hooks/useProducts';
import { slugify } from '../../data/categories';
import type { LanguageCode, Product } from '../../types';

interface ProductRoutePageProps {
  language: LanguageCode;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

const ProductRoutePage: React.FC<ProductRoutePageProps> = ({ language, onAddToCart, onBuyNow }) => {
  const { productSlug } = useParams();
  const { products, loading, error } = useProducts('', 'none');
  const product = products.find((item) => slugify(item.name) === productSlug);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="category-state" role="alert">
        <span className="state-kicker">Product unavailable</span>
        <h1>We could not load this product.</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="category-state">
        <span className="state-kicker">404</span>
        <h1>This product moved or is no longer available.</h1>
        <p>Return to the storefront to keep browsing the current catalog.</p>
        <Link to="/">Return to storefront</Link>
      </div>
    );
  }

  return (
    <ProductDetails
      product={product}
      onClose={() => window.history.back()}
      onAddToCart={onAddToCart}
      onBuyNow={onBuyNow}
      language={language}
      presentation="page"
    />
  );
};

export default ProductRoutePage;
