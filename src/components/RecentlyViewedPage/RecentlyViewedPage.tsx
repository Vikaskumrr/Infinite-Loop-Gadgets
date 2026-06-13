import React from 'react';
import ProductCollectionPage from '../ProductCollectionPage/ProductCollectionPage';
import type { Product } from '../../types';

interface RecentlyViewedPageProps {
  recentlyViewedIds: string[];
  wishlistIds: string[];
  compareIds: string[];
  onAddToCart: (product: Product) => void;
  onWishlistToggle: (product: Product) => void;
  onCompareToggle: (product: Product) => void;
}

const RecentlyViewedPage: React.FC<RecentlyViewedPageProps> = (props) => (
  <ProductCollectionPage
    title="Recently Viewed"
    kicker="Continue browsing"
    emptyTitle="No recent products yet."
    emptyBody="Open a product detail page and it will show up here."
    productIds={props.recentlyViewedIds}
    wishlistIds={props.wishlistIds}
    compareIds={props.compareIds}
    onAddToCart={props.onAddToCart}
    onWishlistToggle={props.onWishlistToggle}
    onCompareToggle={props.onCompareToggle}
  />
);

export default RecentlyViewedPage;
