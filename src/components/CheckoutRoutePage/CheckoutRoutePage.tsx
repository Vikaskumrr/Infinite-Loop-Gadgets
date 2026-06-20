import React from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { useCart } from '../../cart/hooks/useCart';
import Checkout from '../Checkout/Checkout';
import { useOrders } from '../../orders/hooks/useOrders';
import type { LanguageCode } from '../../types';
import '../SubCategoryPage/SubCategoryPage.scss';

interface CheckoutRoutePageProps {
  language: LanguageCode;
}

const CheckoutRoutePage: React.FC<CheckoutRoutePageProps> = ({ language }) => {
  const navigate = useNavigate();
  const { step } = useParams();
  const { user } = useAuth();
  const { cart, refreshCart } = useCart();
  const { checkout } = useOrders();
  const currentStep = step || 'contact';
  const validSteps = ['contact', 'shipping', 'payment', 'review'];

  if (!validSteps.includes(currentStep)) {
    return <Navigate to="/checkout/contact" replace />;
  }

  if (!user) {
    return (
      <div className="category-state">
        <span className="state-kicker">Checkout</span>
        <h1>Sign in to place your order.</h1>
        <p>Your cart can stay local while browsing, but order creation requires an account.</p>
        <Link to="/login">Log in</Link>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="category-state">
        <span className="state-kicker">Checkout</span>
        <h1>Your cart is ready when you are.</h1>
        <p>Add a product before starting checkout.</p>
        <Link to="/products">Browse products</Link>
      </div>
    );
  }

  return (
    <Checkout
      cartItems={cart.items}
      language={language}
      onClose={() => navigate('/products')}
      onSubmitOrder={async (payload) => {
        const order = await checkout(payload);
        await refreshCart();
        return order;
      }}
      presentation="page"
      currentStep={currentStep}
    />
  );
};

export default CheckoutRoutePage;
