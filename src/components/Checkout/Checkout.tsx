import React, { useState } from 'react';
import './Checkout.scss';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import type { LanguageCode, Order, TranslationMap } from '../../types';
import type { CartItem } from '../../cart/types';
import type { CheckoutPayload } from '../../orders/types';

interface CheckoutProps {
  cartItems: CartItem[];
  onClose: () => void;
  language: LanguageCode;
  onSubmitOrder?: (payload: CheckoutPayload) => Promise<Order>;
  presentation?: 'modal' | 'page';
  currentStep?: string;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, onClose, language, onSubmitOrder, presentation = 'modal', currentStep = 'review' }) => {
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const calculateTotal = () => cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  const steps = ['contact', 'shipping', 'payment', 'review'];
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [couponCode, setCouponCode] = useState('');

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const payload: CheckoutPayload = {
        email,
        fullName,
        shippingAddress,
        paymentMethod,
        couponCode,
      };
      const order = await onSubmitOrder?.(payload);
      if (order) {
        setPlacedOrder(order);
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to place order.');
    } finally {
      setIsProcessing(false);
    }
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
        {placedOrder ? (
          <div className="thank-you-message">
            <p>{getText('thankYou')}</p>
            <p>Order {placedOrder.id} is now {placedOrder.status.replace('_', ' ')}.</p>
          </div>
        ) : (
          <div className="checkout-layout">
            <section className="checkout-form" aria-label="Checkout information">
              <div className={`checkout-step-panel ${currentStep === 'contact' ? 'active' : ''}`}>
              <div className="checkout-field">
                <label htmlFor="checkout-email">Email</label>
                <input id="checkout-email" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>
              <div className="checkout-field">
                <label htmlFor="checkout-name">Full name</label>
                <input id="checkout-name" type="text" placeholder="Guest Shopper" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
              </div>
              </div>
              <div className={`checkout-step-panel ${currentStep === 'shipping' ? 'active' : ''}`}>
                <div className="checkout-field">
                  <label htmlFor="checkout-address">Shipping address</label>
                  <input id="checkout-address" type="text" placeholder="Apartment, street, city" autoComplete="street-address" value={shippingAddress} onChange={(event) => setShippingAddress(event.target.value)} />
                </div>
              </div>
              <div className={`checkout-step-panel ${currentStep === 'payment' ? 'active' : ''}`}>
                <div className="checkout-field">
                  <label htmlFor="checkout-payment">Payment method</label>
                  <input id="checkout-payment" type="text" placeholder="Demo card ending 4242" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} />
                </div>
              </div>
              <div className={`checkout-step-panel ${currentStep === 'review' ? 'active' : ''}`}>
              <div className="coupon-row">
                <label htmlFor="coupon-code">Coupon</label>
                <div>
                  <input id="coupon-code" type="text" placeholder="SAVE10" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} />
                  <button type="button">Apply Coupon</button>
                </div>
              </div>
              <p className="checkout-trust">Checkout validates live inventory and stores an order snapshot. No real payment is processed in this demo.</p>
              </div>
            </section>
            <div className="order-summary">
              <h4>{getText('orderSummary')}</h4>
              <ul className="order-items-list">
                {cartItems.map((item) => (
                  <li key={item.productId} className="order-item">
                    <OptimizedImage src={item.product.productImage} alt={item.product.name} className="order-item-image" sizes="56px" />
                    <div className="order-item-info">
                      <span className="order-item-name">{item.product.name}</span>
                      <span className="order-item-price">{item.quantity} x ₹{item.unitPrice.toFixed(2)}</span>
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
              {error ? <p className="checkout-error" role="alert">{error}</p> : null}
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
