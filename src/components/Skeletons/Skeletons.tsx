import React from 'react';
import './Skeletons.scss';

export const ProductGridSkeleton: React.FC = () => (
  <div className="product-grid skeleton-grid" aria-label="Loading products" aria-busy="true">
    {Array.from({ length: 8 }).map((_, index) => (
      <article className="skeleton-card" key={index}>
        <div className="skeleton skeleton-image" />
        <div className="skeleton skeleton-line skeleton-short" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line skeleton-medium" />
        <div className="skeleton skeleton-button" />
      </article>
    ))}
  </div>
);

export const ProductDetailSkeleton: React.FC = () => (
  <section className="detail-skeleton" aria-label="Loading product details" aria-busy="true">
    <div className="skeleton detail-skeleton__image" />
    <div className="detail-skeleton__copy">
      <div className="skeleton skeleton-line skeleton-short" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line skeleton-medium" />
      <div className="skeleton skeleton-button" />
    </div>
  </section>
);
