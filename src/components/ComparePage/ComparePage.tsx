import React from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import { useProducts } from '../../hooks/useProducts';
import { getProductId, getProductSlug } from '../../utils/productIdentity';
import { formatProductPrice } from '../../utils/products';
import type { Product } from '../../types';
import './ComparePage.scss';

interface ComparePageProps {
  compareIds: string[];
  onAddToCart: (product: Product) => void;
  onCompareToggle: (product: Product) => void;
}

const rows = ['brand', 'price', 'rating', 'category', 'subcategory', 'color'] as const;

const ComparePage: React.FC<ComparePageProps> = ({ compareIds, onAddToCart, onCompareToggle }) => {
  const { products, loading } = useProducts('', 'rating');
  const comparedProducts = products.filter((product) => compareIds.includes(getProductId(product))).slice(0, 4);

  if (loading) {
    return <div className="category-state">Loading comparison...</div>;
  }

  if (comparedProducts.length === 0) {
    return (
      <div className="category-state">
        <span className="state-kicker">Compare</span>
        <h1>No products selected.</h1>
        <p>Use the compare button on product cards to build a side-by-side gadget shortlist.</p>
        <Link to="/products">Browse products</Link>
      </div>
    );
  }

  return (
    <main className="compare-page">
      <section className="category-hero">
        <span className="state-kicker">Compare</span>
        <h1>Gadget showdown</h1>
        <p>Compare up to four products by price, category, rating, and key specs.</p>
      </section>

      <div className="compare-table" role="table" aria-label="Product comparison">
        <div className="compare-row compare-row--products" role="row">
          <div role="columnheader">Product</div>
          {comparedProducts.map((product) => (
            <article role="cell" key={getProductId(product)}>
              <OptimizedImage src={product.productImage} alt={product.name} />
              <h2><Link to={`/products/${getProductSlug(product)}`}>{product.name}</Link></h2>
              <button type="button" onClick={() => onCompareToggle(product)}>Remove</button>
            </article>
          ))}
        </div>

        {rows.map((row) => (
          <div className="compare-row" role="row" key={row}>
            <div role="rowheader">{row}</div>
            {comparedProducts.map((product) => (
              <div role="cell" key={`${getProductId(product)}-${row}`}>
                {row === 'price' ? formatProductPrice(product) : String(product[row] || 'Not listed')}
              </div>
            ))}
          </div>
        ))}

        <div className="compare-row" role="row">
          <div role="rowheader">Actions</div>
          {comparedProducts.map((product) => (
            <div role="cell" key={`${getProductId(product)}-action`}>
              <button type="button" onClick={() => onAddToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ComparePage;
