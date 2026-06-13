import React from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import Checkout from '../Checkout/Checkout';
import type { LanguageCode, Order, Product } from '../../types';
import '../SubCategoryPage/SubCategoryPage.scss';

interface CheckoutRoutePageProps {
  products: Product[];
  language: LanguageCode;
  onOrderPlaced: (order: Order) => void;
}

const CheckoutRoutePage: React.FC<CheckoutRoutePageProps> = ({ products, language, onOrderPlaced }) => {
  const navigate = useNavigate();
  const { step } = useParams();
  const currentStep = step || 'contact';
  const validSteps = ['contact', 'shipping', 'payment', 'review'];

  if (!validSteps.includes(currentStep)) {
    return <Navigate to="/checkout/contact" replace />;
  }

  if (products.length === 0) {
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
      products={products}
      language={language}
      onClose={() => navigate('/products')}
      onOrderPlaced={onOrderPlaced}
      presentation="page"
      currentStep={currentStep}
    />
  );
};

export default CheckoutRoutePage;
