import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import { getProductId } from '../../utils/productIdentity';
import '../SubCategoryPage/SubCategoryPage.scss';

const CatalogLabPage: React.FC = () => {
  const { products, loading } = useProducts('', 'rating');
  const missingImages = products.filter((product) => !product.productImage || product.productImage.startsWith('data:'));
  const pricesToVerify = products.filter((product) => product.priceStatus === 'todo');
  const missingSources = products.filter((product) => !product.sourceUrl);
  const categories = Array.from(new Set(products.map((product) => product.subcategory || product.category || 'Uncategorized')));

  if (loading) {
    return <div className="category-state">Auditing catalog...</div>;
  }

  return (
    <main className="sub-category-container">
      <section className="category-hero">
        <span className="state-kicker">Catalog Lab</span>
        <h1>Product data health</h1>
        <p>A production-style internal QA view for price confidence, images, source URLs, and category coverage.</p>
      </section>

      <div className="catalog-lab-grid">
        <article className="category-state">
          <span className="state-kicker">Products</span>
          <h2>{products.length}</h2>
          <p>Total catalog entries after API enrichment and local fallback merge.</p>
        </article>
        <article className="category-state">
          <span className="state-kicker">Verify prices</span>
          <h2>{pricesToVerify.length}</h2>
          <p>Products marked with volatile or unverified regional pricing.</p>
        </article>
        <article className="category-state">
          <span className="state-kicker">Missing source</span>
          <h2>{missingSources.length}</h2>
          <p>Products without a source URL for specs or pricing review.</p>
        </article>
        <article className="category-state">
          <span className="state-kicker">Categories</span>
          <h2>{categories.length}</h2>
          <p>Unique category/subcategory groups represented.</p>
        </article>
      </div>

      <section className="category-state">
        <h2>Products needing price review</h2>
        <ul className="lab-list">
          {pricesToVerify.map((product) => (
            <li key={getProductId(product)}>
              <strong>{product.name}</strong>
              <span>{product.priceDisplay || 'No price label'}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="category-state">
        <h2>Image fallback watchlist</h2>
        <p>{missingImages.length === 0 ? 'No catalog entries are missing image URLs.' : 'These products rely on fallback imagery.'}</p>
      </section>
    </main>
  );
};

export default CatalogLabPage;
