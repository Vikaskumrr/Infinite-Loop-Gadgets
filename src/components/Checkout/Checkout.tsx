import React, { useState } from 'react';
import './Checkout.scss';

interface CheckoutProps {
  products: any[];
  onClose: () => void;
  language: string;
}

const Checkout: React.FC<CheckoutProps> = ({ products, onClose, language }) => {
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const translations: { [key: string]: { [key: string]: string } } = {
    en: {
      checkoutTitle: 'Checkout',
      thankYou: 'Thank you for your purchase!',
      orderSummary: 'Order Summary',
      total: 'Total',
      close: 'Close',
      placeOrder: 'Place Order',
      cancel: 'Cancel',
    },
    es: {
      checkoutTitle: 'Pagar',
      thankYou: '¡Gracias por tu compra!',
      orderSummary: 'Resumen del pedido',
      total: 'Total',
      close: 'Cerrar',
      placeOrder: 'Realizar pedido',
      cancel: 'Cancelar',
    },
    fr: {
      checkoutTitle: 'Vérifier',
      thankYou: 'Merci pour votre achat!',
      orderSummary: 'Récapitulatif de la commande',
      total: 'Total',
      close: 'Fermer',
      placeOrder: 'Passer la commande',
      cancel: 'Annuler',
    },
  };

  const getText = (key: keyof typeof translations.en) => {
    return (translations[language] && translations[language][key]) || translations.en[key];
  };

  const calculateTotal = () => {
    return products.reduce((acc, item) => acc + item.price, 0);
  };

  const handlePlaceOrder = () => {
    setIsOrderPlaced(true);
    // You can add logic here to process the order, e.g., send data to a server
  };

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h3>{getText('checkoutTitle')}</h3>
        {isOrderPlaced ? (
          <p className="thank-you-message">{getText('thankYou')}</p>
        ) : (
          <>
            <div className="order-summary">
              <h4>{getText('orderSummary')}</h4>
              <ul className="order-items-list">
                {products.map((item, index) => (
                  <li key={index} className="order-item">
                    <img src={item.productImage} alt={item.name} className="order-item-image" />
                    <div className="order-item-info">
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-price">${item.price.toFixed(2)}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="order-total">
                <span className="total-label">{getText('total')}:</span>
                <span className="total-price">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            <div className="checkout-buttons">
              <button className="btn-primary" onClick={handlePlaceOrder}>
                {getText('placeOrder')}
              </button>
              <button className="btn-secondary" onClick={onClose}>
                {getText('cancel')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
