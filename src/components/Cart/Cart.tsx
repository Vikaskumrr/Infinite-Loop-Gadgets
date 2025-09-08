import React from 'react';
import './Cart.scss';

interface CartProps {
  cartItems: any[];
  onClose: () => void;
  onCheckout: () => void;
  language: string;
}

const Cart: React.FC<CartProps> = ({ cartItems, onClose, onCheckout, language }) => {
  const translations: { [key: string]: { [key: string]: string } } = {
    en: {
      cartTitle: 'Shopping Cart',
      emptyCart: 'Your cart is empty.',
      total: 'Total',
      checkout: 'Checkout',
      close: 'Close',
    },
    es: {
      cartTitle: 'Carrito de compras',
      emptyCart: 'Tu carrito está vacío.',
      total: 'Total',
      checkout: 'Pagar',
      close: 'Cerrar',
    },
    fr: {
      cartTitle: 'Panier',
      emptyCart: 'Votre panier est vide.',
      total: 'Total',
      checkout: 'Vérifier',
      close: 'Fermer',
    },
  };

  const getText = (key: keyof typeof translations.en) => {
    return (translations[language] && translations[language][key]) || translations.en[key];
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + parseFloat(item.price.replace(/[^0-9.-]+/g, "")), 0);
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h3>{getText('cartTitle')}</h3>
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart-message">{getText('emptyCart')}</div>
          ) : (
            <>
              <ul className="cart-items-list">
                {cartItems.map((item, index) => (
                  <li key={index} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-info">
                      <span className="cart-item-name">{item.name}</span>
                      <span className="cart-item-price">{item.price}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-summary">
                <span className="total-label">{getText('total')}:</span>
                <span className="total-price">${calculateTotal().toLocaleString()}</span>
              </div>
              <button className="checkout-btn" onClick={onCheckout}>
                {getText('checkout')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
