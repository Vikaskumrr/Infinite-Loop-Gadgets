import React from 'react';
import { Link } from 'react-router-dom';
import './Cart.scss';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import type { LanguageCode, TranslationMap } from '../../types';
import type { CartItem } from '../../cart/types';

interface CartProps {
  cartItems: CartItem[];
  onClose: () => void;
  onRemoveFromCart: (productId: string) => void | Promise<void>;
  onUpdateQuantity: (productId: string, quantity: number) => void | Promise<void>;
  onClearCart: () => void | Promise<void>;
  language: LanguageCode;
}

const Cart: React.FC<CartProps> = ({ cartItems, onClose, onRemoveFromCart, onUpdateQuantity, onClearCart, language }) => {
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

  const calculateTotal = () => cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
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
                  {cartItems.map((item) => (
                    <li key={item.productId} className="cart-item">
                      <OptimizedImage src={item.product.productImage} alt={item.product.name} className="cart-item-image" sizes="64px" />
                      <div className="cart-item-info">
                        <span className="cart-item-name">{item.product.name}</span>
                        <span className="cart-item-price">₹{item.subtotal.toFixed(2)}</span>
                        <span className="cart-item-stock">
                          {item.availabilityStatus === 'limited'
                            ? `Only ${item.stockQuantity} left in stock`
                            : item.availabilityStatus === 'out-of-stock'
                              ? 'Currently unavailable'
                              : `${item.quantity} x ₹${item.unitPrice.toFixed(2)}`}
                        </span>
                        <div className="cart-item-qty">
                          <button type="button" onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)} aria-label={`Decrease ${item.product.name} quantity`}>-</button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)} aria-label={`Increase ${item.product.name} quantity`}>+</button>
                        </div>
                      </div>
                      <button className="remove-btn" onClick={() => onRemoveFromCart(item.productId)} aria-label={`${getText('remove')} ${item.product.name}`}>&times;</button>
                    </li>
                  ))}
                </ul>
                <div className="cart-summary">
                  <span className="total-label">{itemCount} item{itemCount === 1 ? '' : 's'} · {getText('total')}:</span>
                  <span className="total-price">₹{calculateTotal().toFixed(2)}</span>
                </div>
                <button type="button" className="cart-clear-btn" onClick={() => onClearCart()}>Clear cart</button>
                <Link className="checkout-btn checkout-link" to="/checkout" onClick={onClose}>Proceed to Checkout</Link>
              </>
            )}
          </div>
        </div>
      </div>
  );
};

export default Cart;
