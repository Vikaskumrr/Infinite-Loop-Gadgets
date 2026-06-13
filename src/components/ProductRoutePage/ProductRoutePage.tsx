import React from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductDetails from '../ProductDetails/ProductDetails';
import RetryState from '../RetryState/RetryState';
import { ProductDetailSkeleton } from '../Skeletons/Skeletons';
import { useProducts } from '../../hooks/useProducts';
import { fetchRelatedProductsFromApi } from '../../services/products';
import { getProductSlug } from '../../utils/productIdentity';
import { trackProductView } from '../../analytics';
import type { LanguageCode, Product } from '../../types';

interface ProductRoutePageProps {
  language: LanguageCode;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onViewed?: (product: Product) => void;
}

const ProductRoutePage: React.FC<ProductRoutePageProps> = ({ language, onAddToCart, onBuyNow, onViewed }) => {
  const { productSlug } = useParams();
  const { products, loading, error, retry } = useProducts('', 'none');
  const product = products.find((item) => getProductSlug(item) === productSlug);
  const [apiRelatedProducts, setApiRelatedProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    if (product) {
      onViewed?.(product);
      trackProductView(product.name, product.id);
    }
  }, [onViewed, product]);

  React.useEffect(() => {
    let isMounted = true;
    if (!product?.id && !product?.slug) return;

    void fetchRelatedProductsFromApi(product.id || product.slug || '')
      .then((relatedProducts) => {
        if (isMounted) setApiRelatedProducts(relatedProducts);
      })
      .catch(() => {
        if (isMounted) setApiRelatedProducts([]);
      });

    return () => {
      isMounted = false;
    };
  }, [product?.id, product?.slug]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error) {
    return (
      <RetryState
        title="We could not load this product."
        message={error}
        actionLabel="Retry product"
        onRetry={retry}
      />
    );
  }

  if (!product) {
    return (
      <div className="category-state">
        <span className="state-kicker">404</span>
        <h1>This product moved or is no longer available.</h1>
        <p>Return to the storefront to keep browsing the current catalog.</p>
        <Link to="/">Return to storefront</Link>
      </div>
    );
  }

  return (
    <ProductDetails
      product={product}
      relatedProducts={(apiRelatedProducts.length > 0 ? apiRelatedProducts : products.filter((item) => item.name !== product.name && (item.category === product.category || item.subcategory === product.subcategory))).slice(0, 4)}
      onClose={() => window.history.back()}
      onAddToCart={onAddToCart}
      onBuyNow={onBuyNow}
      language={language}
      presentation="page"
    />
  );
};

export default ProductRoutePage;
