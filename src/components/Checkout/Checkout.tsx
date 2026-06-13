import React, { useState } from 'react';
import './Checkout.scss';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import type { LanguageCode, Product, TranslationMap } from '../../types';
import type { Order } from '../../types';

interface CheckoutProps {
  products: Product[];
  onClose: () => void;
  language: LanguageCode;
  onOrderPlaced?: (order: Order) => void;
  presentation?: 'modal' | 'page';
  currentStep?: string;
}

const Checkout: React.FC<CheckoutProps> = ({ products, onClose, language, onOrderPlaced, presentation = 'modal', currentStep = 'review' }) => {
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  useEscapeKey(onClose);

  const translations: TranslationMap<'checkoutTitle' | 'thankYou' | 'orderSummary' | 'total' | 'close' | 'placeOrder' | 'cancel'> = {
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
  const steps = ['contact', 'shipping', 'payment', 'review'];

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    onOrderPlaced?.({
      id: `ILG-${Date.now().toString(36).toUpperCase()}`,
      items: products,
      total: calculateTotal(),
      createdAt: new Date().toISOString(),
      status: 'placed',
    });
    window.setTimeout(() => {
      setIsProcessing(false);
      setIsOrderPlaced(true);
    }, 450);
  };

  const content = (
      <div className={`checkout-modal ${presentation === 'page' ? 'checkout-page-modal' : ''}`} role="dialog" aria-modal={presentation === 'modal' ? 'true' : undefined} aria-labelledby="checkout-title" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label={getText('close')}>
          &times;
        </button>
        <h3 id="checkout-title">{getText('checkoutTitle')}</h3>
        {presentation === 'page' && (
          <nav className="checkout-stepper" aria-label="Checkout steps">
            {steps.map((step) => (
              <a className={currentStep === step ? 'active' : ''} href={`/checkout/${step}`} key={step}>
                {step}
              </a>
            ))}
          </nav>
        )}
        {isOrderPlaced ? (
          <p className="thank-you-message">{getText('thankYou')}</p>
        ) : (
          <div className="checkout-layout">
            <section className="checkout-form" aria-label="Checkout information">
              <div className={`checkout-step-panel ${currentStep === 'contact' ? 'active' : ''}`}>
              <div className="checkout-field">
                <label htmlFor="checkout-email">Email</label>
                <input id="checkout-email" type="email" placeholder="you@example.com" autoComplete="email" />
              </div>
              <div className="checkout-field">
                <label htmlFor="checkout-name">Full name</label>
                <input id="checkout-name" type="text" placeholder="Guest Shopper" autoComplete="name" />
              </div>
              </div>
              <div className={`checkout-step-panel ${currentStep === 'shipping' ? 'active' : ''}`}>
                <div className="checkout-field">
                  <label htmlFor="checkout-address">Shipping address</label>
                  <input id="checkout-address" type="text" placeholder="Apartment, street, city" autoComplete="street-address" />
                </div>
              </div>
              <div className={`checkout-step-panel ${currentStep === 'payment' ? 'active' : ''}`}>
                <div className="checkout-field">
                  <label htmlFor="checkout-payment">Payment method</label>
                  <input id="checkout-payment" type="text" placeholder="Demo card ending 4242" />
                </div>
              </div>
              <div className={`checkout-step-panel ${currentStep === 'review' ? 'active' : ''}`}>
              <div className="coupon-row">
                <label htmlFor="coupon-code">Coupon</label>
                <div>
                  <input id="coupon-code" type="text" placeholder="SAVE10" />
                  <button type="button">Apply Coupon</button>
                </div>
              </div>
              <p className="checkout-trust">Secure demo checkout. Your cart is safe and no real payment is processed.</p>
              </div>
            </section>
            <div className="order-summary">
              <h4>{getText('orderSummary')}</h4>
              <ul className="order-items-list">
                {products.map((item, index) => (
                  <li key={index} className="order-item">
                    <OptimizedImage src={item.productImage} alt={item.name} className="order-item-image" sizes="56px" />
                    <div className="order-item-info">
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-price">₹{item.price.toFixed(2)}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="order-total">
                <span className="total-label">{getText('total')}:</span>
                <span className="total-price">₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            <div className="checkout-buttons">
              <button className="btn-primary" onClick={handlePlaceOrder} disabled={isProcessing} aria-busy={isProcessing}>
                {isProcessing ? 'Processing...' : getText('placeOrder')}
              </button>
              <button className="btn-secondary" onClick={onClose}>
                {getText('cancel')}
              </button>
            </div>
          </div>
        )}
      </div>
  );

  if (presentation === 'page') {
    return <main className="checkout-page">{content}</main>;
  }

  return (
    <div className="checkout-overlay" onClick={onClose}>
      {content}
    </div>
  );
};

export default Checkout;
