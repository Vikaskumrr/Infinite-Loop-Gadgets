import React, { useState } from 'react';
import './Cart.scss';
import Checkout from '../Checkout/Checkout';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import type { LanguageCode, Order, Product, TranslationMap } from '../../types';

interface CartProps {
  cartItems: Product[];
  onClose: () => void;
  onRemoveFromCart: (index: number) => void;
  language: LanguageCode;
  onOrderPlaced?: (order: Order) => void;
}

const Cart: React.FC<CartProps> = ({ cartItems, onClose, onRemoveFromCart, language, onOrderPlaced }) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  useEscapeKey(onClose);

  const translations: TranslationMap<'cartTitle' | 'emptyCart' | 'total' | 'checkout' | 'close' | 'remove'> = {
    en: {
      cartTitle: 'Shopping Cart',
      emptyCart: 'Your cart is ready when you are. Browse the storefront to add your next upgrade.',
      total: 'Total',
      checkout: 'Checkout',
      close: 'Close',
      remove: 'Remove',
    },
    es: {
      cartTitle: 'Carrito de compras',
      emptyCart: 'Tu carrito está vacío.',
      total: 'Total',
      checkout: 'Pagar',
      close: 'Cerrar',
      remove: 'Eliminar',
    },
    fr: {
      cartTitle: 'Panier',
      emptyCart: 'Votre panier est vide.',
      total: 'Total',
      checkout: 'Vérifier',
      close: 'Fermer',
      remove: 'Retirer',
    },
  };

  const getText = (key: keyof typeof translations.en) => {
    return (translations[language] && translations[language][key]) || translations.en[key];
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price, 0);
  };

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
  };

  return (
    <>
      <div className="cart-overlay" onClick={onClose}>
        <div className="cart-modal" role="dialog" aria-modal="true" aria-labelledby="cart-title" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose} aria-label={getText('close')}>
            &times;
          </button>
          <h3 id="cart-title">{getText('cartTitle')}</h3>
          <div className="cart-content">
            {cartItems.length === 0 ? (
              <div className="empty-cart-message">{getText('emptyCart')}</div>
            ) : (
              <>
                <ul className="cart-items-list">
                  {cartItems.map((item, index) => (
                    <li key={index} className="cart-item">
                      <OptimizedImage src={item.productImage} alt={item.name} className="cart-item-image" sizes="64px" />
                      <div className="cart-item-info">
                        <span className="cart-item-name">{item.name}</span>
                        <span className="cart-item-price">₹{item.price.toFixed(2)}</span>
                      </div>
                      <button className="remove-btn" onClick={() => onRemoveFromCart(index)} aria-label={`${getText('remove')} ${item.name}`}>&times;</button>
                    </li>
                  ))}
                </ul>
                <div className="cart-summary">
                  <span className="total-label">{getText('total')}:</span>
                  <span className="total-price">₹{calculateTotal().toFixed(2)}</span>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
              </>
            )}
          </div>
        </div>
      </div>
      {isCheckoutOpen && (
        <Checkout
          products={cartItems}
          onClose={handleCloseCheckout}
          language={language}
          onOrderPlaced={onOrderPlaced}
        />
      )}
    </>
  );
};

export default Cart;
