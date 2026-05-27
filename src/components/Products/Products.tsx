import React, { useState, useEffect } from 'react';
import './Products.scss';
import ImageLoader from '../ImageLoader/ImageLoader';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import type { LanguageCode, Product as ProductType, TranslationMap } from '../../types';
import { formatProductPrice } from '../../utils/products';

interface ProductProps {
  product: ProductType;
  language: LanguageCode;
  onDetailsClick: () => void;
}

const Product: React.FC<ProductProps> = ({ product, language, onDetailsClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [product?.productImage]);

  const captions: TranslationMap<'brand' | 'color' | 'rating' | 'fullDetails'> = {
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
      color: 'Couleur',
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
          <span className="price">{formatProductPrice(product)}</span>
        </div>
      </div>
      <div className="image-wrapper">
        {showImageLoader && (
          <ImageLoader />
        )}
        {product?.productImage && (
          <OptimizedImage
            src={product?.productImage}
            alt={product?.name}
            className={`tech-image ${imageLoaded ? 'is-visible' : 'hidden-until-loaded'}`}
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
