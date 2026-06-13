import React from 'react';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

interface RouteBoundaryProps {
  children: React.ReactNode;
}

const RouteBoundary: React.FC<RouteBoundaryProps> = ({ children }) => (
  <ErrorBoundary>
    {children}
  </ErrorBoundary>
);

export default RouteBoundary;
