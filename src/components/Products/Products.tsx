import React from 'react';
import './Products.scss';

// Define the type for a product object
interface ProductProps {
  product: {
    name: string;
    model: string;
    price: string;
    location: string;
    image: string;
    year: string;
    color: string;
    ram: string;
  };
  language: string;
}

const Product: React.FC<ProductProps> = ({ product, language }) => {
  // A simple translation map for the captions
  const captions: { [key: string]: { [key: string]: string } } = {
    en: {
      year: 'Year',
      color: 'Color',
      ram: 'RAM',
      fullDetails: 'Full details →'
    },
    es: {
      year: 'Año',
      color: 'Color',
      ram: 'RAM',
      fullDetails: 'Detalles completos →'
    },
    fr: {
      year: 'Année',
      color: 'Couleur',
      ram: 'RAM',
      fullDetails: 'Détails complets →'
    }
  };

  const getCaption = (key: keyof typeof captions.en) => {
    return (captions[language] && captions[language][key]) || captions.en[key];
  };

  return (
    <section className="tech-main">
      <div className="tech-header">
        <h1>{product.name} <span className="model">{product.model}</span></h1>
        <div className="price-location">
          <span className="price">{product.price}</span>
          <span className="location"> {product.location}</span>
        </div>
      </div>
      <img src={product.image} alt={product.name} className="tech-image"/>
      <div className="tech-details">
        <div>
          <strong>{product.year}</strong> <div className="caption">{getCaption('year')}</div>
        </div>
        <div>
          <strong>{product.color}</strong> <div className="caption">{getCaption('color')}</div>
        </div>
        <div>
          <strong>{product.ram}</strong> <div className="caption">{getCaption('ram')}</div>
        </div>
        <button className="details-btn">{getCaption('fullDetails')}</button>
      </div>
    </section>
  );
};

export default Product;
