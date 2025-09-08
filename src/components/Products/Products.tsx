import React from 'react';
import './Products.scss';

// Define the type for a product object based on the new API data
interface ProductProps {
  product: {
    name: string;
    brand: string;
    price: number;
    rating: number;
    productImage: string; // Changed from 'image'
    color: string;
  };
  language: string;
  onDetailsClick: () => void;
}

const Product: React.FC<ProductProps> = ({ product, language, onDetailsClick }) => {
  // A simple translation map for the captions
  const captions: { [key: string]: { [key: string]: string } } = {
    en: {
      brand: 'Brand',
      color: 'Color',
      rating: 'Rating',
      fullDetails: 'Full details →'
    },
    es: {
      brand: 'Marca',
      color: 'Color',
      rating: 'Calificación',
      fullDetails: 'Detalles completos →'
    },
    fr: {
      brand: 'Marque',
      colour: 'Colour',
      rating: 'Évaluation',
      fullDetails: 'Détails complets →'
    }
  };

  const getCaption = (key: keyof typeof captions.en) => {
    return (captions[language] && captions[language][key]) || captions.en[key];
  };

  return (
    <section className="tech-main">
      <div className="tech-header">
        <h1>{product?.name}</h1>
        <div className="price-location">
          <span className="price">₹{product?.price.toFixed(2)}</span>
        </div>
      </div>
      <img src={product?.productImage} alt={product?.name} className="tech-image" />
      <div className="tech-details">
        <div>
          <strong>{product?.brand}</strong> <div className="caption">{getCaption('brand')}</div>
        </div>
        <div>
          <strong>{product?.color}</strong> <div className="caption">{getCaption('color')}</div>
        </div>
        <div>
          <strong>{product?.rating} ★</strong> <div className="caption">{getCaption('rating')}</div>
        </div>
        <button className="details-btn" onClick={onDetailsClick}>
          {getCaption('fullDetails')}
        </button>
      </div>
    </section>
  );
};

export default Product;
