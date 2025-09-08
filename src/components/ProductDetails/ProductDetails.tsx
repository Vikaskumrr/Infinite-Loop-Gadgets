import React from 'react';
import './ProductDetails.scss';

interface Review {
  user: string;
  stars: number;
  comment: string;
}

interface ProductDetailsProps {
  product: {
    name: string;
    brand: string;
    price: number;
    description: string;
    productImage: string;
    rating: number;
    reviews?: Review[];
    specifications: { [key: string]: string };
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
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      reviews: 'Customer Reviews',
      specifications: 'Specifications',
      close: 'Close',
    },
    es: {
      description: 'Descripción',
      rating: 'Calificación',
      addToCart: 'Añadir al carrito',
      buyNow: 'Comprar ahora',
      reviews: 'Reseñas de clientes',
      specifications: 'Especificaciones',
      close: 'Cerrar',
    },
    fr: {
      description: 'La description',
      rating: 'Évaluation',
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
      <div className="product-details-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <div className="product-details-content">
          <img src={product.productImage} alt={product.name} className="product-image" />
          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="product-brand">{product.brand}</p>
            <p className="product-price">₹{product.price.toFixed(2)}</p>
            <div className="rating">
              {getText('rating')}: {product.rating} ★
            </div>
            <div className="description">
              <h3>{getText('description')}</h3>
              <p>{product.description}</p>
            </div>
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
