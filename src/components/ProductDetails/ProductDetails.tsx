import React from 'react';
import './ProductDetails.scss';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import ProductSpecifications from '../ProductSpecifications/ProductSpecifications';
import type { LanguageCode, Product, TranslationMap } from '../../types';
import { formatProductPrice } from '../../utils/products';
import { trackRelatedProductClicked } from '../../analytics';

interface ProductDetailsProps {
  product: Product;
  relatedProducts?: Product[];
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  language: LanguageCode;
  presentation?: 'modal' | 'page';
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, relatedProducts = [], onClose, onAddToCart, onBuyNow, language, presentation = 'modal' }) => {
  useEscapeKey(onClose);
  const TitleTag = presentation === 'page' ? 'h1' : 'h2';
  const [activeImage, setActiveImage] = React.useState(product.productImage);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState(product.color);
  const [selectedStorage, setSelectedStorage] = React.useState(product.specifications?.Storage || 'Standard');
  const [pincode, setPincode] = React.useState('');
  const galleryImages = React.useMemo(
    () => Array.from(new Set([...(product.images || []), product.productImage].filter(Boolean))),
    [product.images, product.productImage],
  );
  React.useEffect(() => {
    setActiveImage(galleryImages[0] || product.productImage);
  }, [galleryImages, product.productImage]);
  const reviewAverage = product.reviews?.length
    ? product.reviews.reduce((total, review) => total + review.stars, 0) / product.reviews.length
    : product.rating;
  const reviewCount = product.reviewCount ?? product.reviews?.length ?? 0;
  const availability = product.availabilityStatus || (product.stockStatus === 'out-of-stock' ? 'out-of-stock' : 'available');
  const isOutOfStock = availability === 'out-of-stock';
  const inventoryLabel = availability === 'out-of-stock'
    ? 'Out of stock'
    : availability === 'limited'
      ? `Limited stock${product.stockQuantity ? `: ${product.stockQuantity} left` : ''}`
      : 'Available';

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

  const content = (
      <div
        className={`product-details-modal ${presentation === 'page' ? 'product-details-page' : ''}`}
        role="dialog"
        aria-modal={presentation === 'modal' ? 'true' : undefined}
        aria-labelledby="product-details-title"
        onClick={(e) => e.stopPropagation()}
      >
        {presentation === 'modal' && (
          <button className="close-btn" onClick={onClose} aria-label={getText('close')}>
            &times;
          </button>
        )}
        <div className="product-details-content">
          <div className="product-gallery">
            <button type="button" className={`product-image-zoom ${isZoomed ? 'is-zoomed' : ''}`} onClick={() => setIsZoomed((value) => !value)} aria-label={`${isZoomed ? 'Reset' : 'Zoom'} ${product.name} image`}>
              <OptimizedImage src={activeImage} alt={product.name} className="product-image" sizes="(max-width: 760px) 92vw, 420px" />
            </button>
            <div className="gallery-thumbs" aria-label="Product image gallery">
              {galleryImages.map((image, index) => (
                <button type="button" key={`${image}-${index}`} className={activeImage === image ? 'active' : ''} onClick={() => setActiveImage(image)} aria-label={`View ${product.name} image ${index + 1}`}>
                  <OptimizedImage src={image} alt={`${product.name} thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="product-info">
            <TitleTag id="product-details-title">{product.name}</TitleTag>
            <p className="social-proof">
            <span role="img" aria-label="eye">👁️</span> 20 people viewed this recently.
            </p>
            <p className="product-brand">
              {product.brand}
              {product.category ? <span>{product.category}</span> : null}
              {product.subcategory ? <span>{product.subcategory}</span> : null}
            </p>
            <p className={`product-price ${product.priceStatus === 'todo' ? 'needs-verification' : ''}`}>
              {formatProductPrice(product)}
              {product.compareAtPrice ? <s>{product.compareAtPrice}</s> : null}
              <span className={`price-status-pill price-status-${product.priceStatus || 'fallback'}`}>
                {product.priceStatus === 'verified' ? 'Verified' : product.priceStatus === 'todo' ? 'Needs Verification' : 'Recently Updated'}
              </span>
            </p>
            <div className="rating">
              {getText('rating')}: {product.rating} ★ {reviewCount > 0 ? <span>({reviewCount} reviews)</span> : null}
            </div>
            <div className={`inventory-status inventory-status--${availability}`}>
              <strong>{inventoryLabel}</strong>
              <span>{isOutOfStock ? 'Purchasing is disabled until this item returns.' : 'Ready for demo cart checkout.'}</span>
            </div>
            <div className="variant-panel" aria-label="Product variants">
              <label>
                Color
                <select value={selectedColor} onChange={(event) => setSelectedColor(event.target.value)}>
                  {[product.color, 'Black', 'Silver', 'Graphite'].filter((value, index, arr) => arr.indexOf(value) === index).map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </label>
              <label>
                Storage
                <select value={selectedStorage} onChange={(event) => setSelectedStorage(event.target.value)}>
                  {[selectedStorage, '128 GB', '256 GB', '512 GB'].filter((value, index, arr) => arr.indexOf(value) === index).map((storage) => (
                    <option key={storage} value={storage}>{storage}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="delivery-estimator">
              <label htmlFor="delivery-pincode">Delivery estimate</label>
              <div>
                <input id="delivery-pincode" inputMode="numeric" value={pincode} onChange={(event) => setPincode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter pincode" />
                <span>{pincode.length === 6 ? 'Arrives in 2-4 business days' : 'Enter 6 digits'}</span>
              </div>
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
                <ProductSpecifications specifications={product.specifications} />
              </div>
            )}
            {product.reviews && product.reviews.length > 0 && (
              <div className="reviews">
                <h3>{getText('reviews')}</h3>
                <div className="review-summary">
                  <strong>{reviewAverage.toFixed(1)} ★</strong>
                  <span>{product.reviews.length} source-backed review notes</span>
                  <div><span style={{ width: `${Math.min(100, reviewAverage * 20)}%` }} /></div>
                </div>
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
            {relatedProducts.length > 0 && (
              <div className="related-products">
                <h3>You may also like</h3>
                <ul>
                  {relatedProducts.slice(0, 3).map((relatedProduct) => (
                    <li key={`${relatedProduct.brand}-${relatedProduct.name}`}>
                      <span>{relatedProduct.name}</span>
                      <button type="button" onClick={() => {
                        trackRelatedProductClicked(relatedProduct.id);
                        onAddToCart(relatedProduct);
                      }}>Add</button>
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
              <button className="add-to-cart-btn" disabled={isOutOfStock} onClick={() => onAddToCart(product)}>
                {getText('addToCart')}
              </button>
              <button className="buy-now-btn" disabled={isOutOfStock} onClick={() => onBuyNow(product)}>
                {getText('buyNow')}
              </button>
            </div>
            <div className="mobile-product-cta" aria-label="Product actions">
              <div>
                <span className="mobile-product-cta__price">{formatProductPrice(product)}</span>
                <span className="mobile-product-cta__stock">{inventoryLabel}</span>
              </div>
              <button className="add-to-cart-btn" disabled={isOutOfStock} onClick={() => onAddToCart(product)}>
                Add
              </button>
              <button className="buy-now-btn" disabled={isOutOfStock} onClick={() => onBuyNow(product)}>
                {getText('buyNow')}
              </button>
            </div>
          </div>
        </div>
      </div>
  );

  if (presentation === 'page') {
    return <div className="product-details-route">{content}</div>;
  }

  return (
    <div className="product-details-overlay" onClick={onClose}>
      {content}
    </div>
  );
};

export default ProductDetails;
