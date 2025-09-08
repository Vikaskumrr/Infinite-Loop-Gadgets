import React from 'react';
import './Checkout.scss';

interface CheckoutProps {
  products: any[];
  onClose: () => void;
  language: string;
}

const Checkout: React.FC<CheckoutProps> = ({ products, onClose, language }) => {
  const translations: { [key: string]: { [key: string]: string } } = {
    en: {
      checkoutTitle: 'Checkout',
      thankYou: 'Thank you for your purchase!',
      orderSummary: 'Order Summary',
      total: 'Total',
      close: 'Close',
    },
    es: {
      checkoutTitle: 'Pagar',
      thankYou: '¡Gracias por tu compra!',
      orderSummary: 'Resumen del pedido',
      total: 'Total',
      close: 'Cerrar',
    },
    fr: {
      checkoutTitle: 'Vérifier',
      thankYou: 'Merci pour votre achat!',
      orderSummary: 'Récapitulatif de la commande',
      total: 'Total',
      close: 'Fermer',
    },
  };

  const getText = (key: keyof typeof translations.en) => {
    return (translations[language] && translations[language][key]) || translations.en[key];
  };

  const calculateTotal = () => {
    return products.reduce((acc, item) => acc + parseFloat(item.price.replace(/[^0-9.-]+/g, "")), 0);
  };

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h3>{getText('checkoutTitle')}</h3>
        <p className="thank-you-message">{getText('thankYou')}</p>
        <div className="order-summary">
          <h4>{getText('orderSummary')}</h4>
          <ul className="order-items-list">
            {products.map((item, index) => (
              <li key={index} className="order-item">
                <img src={item.image} alt={item.name} className="order-item-image" />
                <div className="order-item-info">
                  <span className="order-item-name">{item.name}</span>
                  <span className="order-item-price">{item.price}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="order-total">
            <span className="total-label">{getText('total')}:</span>
            <span className="total-price">${calculateTotal().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
