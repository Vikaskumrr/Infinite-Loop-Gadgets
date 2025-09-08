import React from 'react';
import './ProductDetails.scss';

interface ProductDetailsProps {
  product: {
    name: string;
    model: string;
    price: string;
    location: string;
    image: string;
    year: string;
    color: string;
    ram: string;
    description: string;
    rating: number;
    specifications: { key: string; value: string }[];
  };
  onClose: () => void;
  onAddToCart: (product: any) => void;
  onBuyNow: (product: any) => void;
  language: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onClose, onAddToCart, onBuyNow, language }) => {
  const translations: { [key: string]: { [key: string]: string } } = {
    en: {
      description: 'Description',
      rating: 'Rating',
      specifications: 'Specifications',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      close: 'Close',
    },
    es: {
      description: 'Descripción',
      rating: 'Calificación',
      specifications: 'Especificaciones',
      addToCart: 'Añadir al carrito',
      buyNow: 'Comprar ahora',
      close: 'Cerrar',
    },
    fr: {
      description: 'La description',
      rating: 'Évaluation',
      specifications: 'Caractéristiques',
      addToCart: 'Ajouter au panier',
      buyNow: 'Acheter maintenant',
      close: 'Fermer',
    },
  };

  const getText = (key: keyof typeof translations.en) => {
    return (translations[language] && translations[language][key]) || translations.en[key];
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
      );
    }
    return stars;
  };

  return (
    <div className="product-details-overlay" onClick={onClose}>
      <div className="product-details-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <div className="product-details-content">
          <div className="image-section">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="info-section">
            <h2>{product.name} <span className="model">{product.model}</span></h2>
            <div className="price">{product.price}</div>
            <div className="rating">
              <span className="rating-label">{getText('rating')}:</span>
              <div className="stars">
                {renderStars(product.rating)}
              </div>
            </div>
            <div className="description">
              <h3>{getText('description')}</h3>
              <p>{product.description}</p>
            </div>
            <div className="specifications">
              <h3>{getText('specifications')}</h3>
              <ul>
                {product.specifications.map((spec, index) => (
                  <li key={index}>
                    <strong>{spec.key}:</strong> {spec.value}
                  </li>
                ))}
              </ul>
            </div>
            <div className="button-group">
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
