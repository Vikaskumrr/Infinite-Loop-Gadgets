import React from 'react';
import './ProductDetails.scss';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import type { LanguageCode, Product, TranslationMap } from '../../types';
import { formatProductPrice } from '../../utils/products';

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  language: LanguageCode;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onClose, onAddToCart, onBuyNow, language }) => {
  useEscapeKey(onClose);

  const translations: TranslationMap<'description' | 'rating' | 'features' | 'addToCart' | 'buyNow' | 'reviews' | 'specifications' | 'close'> = {
    en: {
      description: 'Description',
      rating: 'Rating',
      features: 'Key features',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      reviews: 'Customer Reviews',
      specifications: 'Specifications',
      close: 'Close',
    },
    es: {
      description: 'Descripción',
      rating: 'Calificación',
      features: 'Características clave',
      addToCart: 'Añadir al carrito',
      buyNow: 'Comprar ahora',
      reviews: 'Reseñas de clientes',
      specifications: 'Especificaciones',
      close: 'Cerrar',
    },
    fr: {
      description: 'La description',
      rating: 'Évaluation',
      features: 'Fonctionnalités clés',
      addToCart: 'Ajouter au panier',
      buyNow: 'Acheter maintenant',
      reviews: 'Avis des clients',
      specifications: 'Spécifications',
      close: 'Fermer',
    },
  };

  const getText = (key: keyof typeof translations.en) => {
    return (translations[language] && translations[language][key]) || translations.en[key];
  };

  const renderStars = (starCount: number) => {
    const filledStars = '★'.repeat(starCount);
    const emptyStars = '☆'.repeat(5 - starCount);
    return filledStars + emptyStars;
  };

  return (
    <div className="product-details-overlay" onClick={onClose}>
      <div
        className="product-details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-details-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose} aria-label={getText('close')}>
          &times;
        </button>
        <div className="product-details-content">
          <OptimizedImage src={product.productImage} alt={product.name} className="product-image" sizes="(max-width: 760px) 92vw, 420px" />
          <div className="product-info">
            <h2 id="product-details-title">{product.name}</h2>
            <p className="social-proof">
            <span role="img" aria-label="eye">👁️</span> 20 people viewed this recently.
            </p>
            <p className="product-brand">
              {product.brand}
              {product.subcategory ? <span>{product.subcategory}</span> : null}
            </p>
            <p className={`product-price ${product.priceStatus === 'todo' ? 'needs-verification' : ''}`}>
              {formatProductPrice(product)}
            </p>
            <div className="rating">
              {getText('rating')}: {product.rating} ★
            </div>
            <div className="description">
              <h3>{getText('description')}</h3>
                <p>{product.description || 'A carefully selected gadget designed for everyday performance.'}</p>
            </div>
            {product.features && product.features.length > 0 && (
              <div className="features">
                <h3>{getText('features')}</h3>
                <ul>
                  {product.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="specifications">
                <h3>{getText('specifications')}</h3>
                <ul>
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <li key={index}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.reviews && product.reviews.length > 0 && (
              <div className="reviews">
                <h3>{getText('reviews')}</h3>
                <ul>
                  {product.reviews.map((review, index) => (
                    <li key={index}>
                      <span className="review-user">{review.user}</span>: {review.comment}
                      <div className="review-stars">{renderStars(review.stars)}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.sourceUrl && (
              <a className="product-source-link" href={product.sourceUrl} target="_blank" rel="noreferrer">
                View source details
              </a>
            )}
            <div className="action-buttons">
              <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
                {getText('addToCart')}
              </button>
              <button className="buy-now-btn" onClick={() => onBuyNow(product)}>
                {getText('buyNow')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
