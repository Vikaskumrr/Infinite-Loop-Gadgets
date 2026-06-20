import React from 'react';
import { CartContext } from '../CartContext';

export const useCart = () => {
  const value = React.useContext(CartContext);
  if (!value) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return value;
};
