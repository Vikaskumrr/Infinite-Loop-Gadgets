import React from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import { slugify } from '../../data/categories';
import { formatProductPrice } from '../../utils/products';
import type { Product } from '../../types';
import './ProductCard.scss';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => Promise<void> | void;
  onWishlistToggle?: (product: Product) => void;
  isWishlisted?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onWishlistToggle,
  isWishlisted = false,
}) => {
  const [isAdding, setIsAdding] = React.useState(false);
  const isOutOfStock = product.stockStatus === 'out-of-stock';
  const productSlug = slugify(product.name);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await onAddToCart(product);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <article className="product-card">
      <Link to={`/products/${productSlug}`} className="product-card__media" aria-label={`View ${product.name}`}>
        <OptimizedImage src={product.productImage} alt={product.name} className="product-card__image" sizes="(max-width: 760px) 92vw, 280px" />
        {product.badge && <span className="product-card__badge">{product.badge}</span>}
      </Link>

      <div className="product-card__body">
        <div className="product-card__meta">
          <span>{product.brand}</span>
          <span>{product.rating} ★</span>
        </div>
        <h2>
          <Link to={`/products/${productSlug}`}>{product.name}</Link>
        </h2>
        <p>{product.description || `${product.color} finish with ${product.rating} star rating.`}</p>
        {product.features && product.features.length > 0 && (
          <ul className="product-card__features" aria-label={`${product.name} key features`}>
            {product.features.slice(0, 3).map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="product-card__footer">
        <div className="product-card__price">
          <strong className={product.priceStatus === 'todo' ? 'needs-verification' : ''}>
            {formatProductPrice(product)}
          </strong>
          {product.compareAtPrice && <s>{product.compareAtPrice}</s>}
        </div>
        <div className="product-card__actions">
          {onWishlistToggle && (
            <button
              type="button"
              className="product-card__wishlist"
              aria-pressed={isWishlisted}
              aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              onClick={() => onWishlistToggle(product)}
            >
              {isWishlisted ? '♥' : '♡'}
            </button>
          )}
          <button
            type="button"
            className="product-card__add"
            disabled={isOutOfStock || isAdding}
            aria-busy={isAdding}
            onClick={handleAddToCart}
          >
            {isOutOfStock ? 'Out of Stock' : isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
