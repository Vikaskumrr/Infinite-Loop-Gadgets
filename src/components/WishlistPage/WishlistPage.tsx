import React from 'react';
import ProductCollectionPage from '../ProductCollectionPage/ProductCollectionPage';
import type { Product } from '../../types';

interface WishlistPageProps {
  wishlistIds: string[];
  compareIds: string[];
  onAddToCart: (product: Product) => void;
  onWishlistToggle: (product: Product) => void;
  onCompareToggle: (product: Product) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = (props) => (
  <ProductCollectionPage
    title="Wishlist"
    kicker="Saved products"
    emptyTitle="Your wishlist is waiting for a spark."
    emptyBody="Save products from category pages to build your shortlist."
    productIds={props.wishlistIds}
    wishlistIds={props.wishlistIds}
    compareIds={props.compareIds}
    onAddToCart={props.onAddToCart}
    onWishlistToggle={props.onWishlistToggle}
    onCompareToggle={props.onCompareToggle}
  />
);

export default WishlistPage;
