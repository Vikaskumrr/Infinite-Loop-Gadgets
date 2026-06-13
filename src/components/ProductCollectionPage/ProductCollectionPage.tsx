import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import { ProductGridSkeleton } from '../Skeletons/Skeletons';
import { useProducts } from '../../hooks/useProducts';
import { getProductId } from '../../utils/productIdentity';
import type { Product } from '../../types';
import '../SubCategoryPage/SubCategoryPage.scss';

interface ProductCollectionPageProps {
  title: string;
  kicker: string;
  emptyTitle: string;
  emptyBody: string;
  productIds: string[];
  wishlistIds: string[];
  compareIds: string[];
  onAddToCart: (product: Product) => void;
  onWishlistToggle: (product: Product) => void;
  onCompareToggle: (product: Product) => void;
}

const ProductCollectionPage: React.FC<ProductCollectionPageProps> = ({
  title,
  kicker,
  emptyTitle,
  emptyBody,
  productIds,
  wishlistIds,
  compareIds,
  onAddToCart,
  onWishlistToggle,
  onCompareToggle,
}) => {
  const { products, loading } = useProducts('', 'rating');
  const collectionProducts = products.filter((product) => productIds.includes(getProductId(product)));

  if (loading) {
    return <ProductGridSkeleton />;
  }

  return (
    <div className="sub-category-container">
      <section className="category-hero">
        <span className="state-kicker">{kicker}</span>
        <h1>{title}</h1>
        <p>Personalized shortcuts saved locally on this device.</p>
      </section>

      {collectionProducts.length === 0 ? (
        <div className="category-state">
          <h2>{emptyTitle}</h2>
          <p>{emptyBody}</p>
        </div>
      ) : (
        <div className="category-grid">
          {collectionProducts.map((product) => (
            <ProductCard
              key={getProductId(product)}
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

export default ProductCollectionPage;
