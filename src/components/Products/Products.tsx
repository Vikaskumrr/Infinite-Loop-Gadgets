import React, { useState, useEffect } from 'react';
import './Products.scss';
import ImageLoader from '../ImageLoader/ImageLoader';

// Define the type for a product object based on the new API data
interface ProductProps {
  product: {
    name: string;
    brand: string;
    price: number;
    rating: number;
    productImage: string;
    color: string;
  };
  language: string;
  onDetailsClick: () => void;
}

const Product: React.FC<ProductProps> = ({ product, language, onDetailsClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [product?.productImage]);

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

  const showImageLoader = !product?.productImage || !imageLoaded;

  return (
    <section className="tech-main">
      <div className="tech-header">
        <h1>{product?.name}</h1>
        <div className="price-location">
          <span className="price">₹{product?.price.toFixed(2)}</span>
        </div>
      </div>
      <div className="image-wrapper">
        {showImageLoader && (
          <ImageLoader />
        )}
        {product?.productImage && (
          <img
            src={product?.productImage}
            alt={product?.name}
            className="tech-image"
            style={{ display: imageLoaded ? 'block' : 'none' }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
        )}
      </div>
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
