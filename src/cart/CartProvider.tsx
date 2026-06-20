import React from 'react';
import { useAuth } from '../auth/useAuth';
import type { Product } from '../types';
import { getProductId } from '../utils/productIdentity';
import { readStoredJson, writeStoredJson } from '../utils/storage';
import { cartService } from './cartService';
import { CartContext, type CartContextValue } from './CartContext';
import {
  applyGuestCartMigrationResult,
  clearCartMigrationSkip,
  markCartMigrationSkipped,
  readGuestCartItems,
  shouldPromptForCartMigration,
  type GuestCartItem,
  type GuestCartMigrationResult,
} from './cartMigrationService';
import type { CartItem, CartState } from './types';

const CART_KEY = 'ilg.cart';

const emptyCart: CartState = {
  items: [],
  subtotal: 0,
  itemCount: 0,
};

const normalizeLocalCart = (products: Product[]): CartState => {
  const grouped = new Map<string, CartItem>();

  for (const product of products) {
    const productId = getProductId(product);
    const existing = grouped.get(productId);
    if (existing) {
      existing.quantity += 1;
      existing.subtotal = existing.unitPrice * existing.quantity;
    } else {
      grouped.set(productId, {
        productId,
        quantity: 1,
        unitPrice: product.price,
        subtotal: product.price,
        availabilityStatus: product.availabilityStatus || 'available',
        stockQuantity: product.stockQuantity || 99,
        product,
      });
    }
  }

  const items = Array.from(grouped.values());
  return {
    items,
    subtotal: items.reduce((total, item) => total + item.subtotal, 0),
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
  };
};

const readLocalCart = () => normalizeLocalCart(readStoredJson<Product[]>(CART_KEY, []));

const expandCartItems = (items: CartItem[]): Product[] =>
  items.flatMap((item) => Array.from({ length: item.quantity }, () => item.product));

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();
  const [cart, setCart] = React.useState<CartState>(() => readLocalCart());
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [migrationOpen, setMigrationOpen] = React.useState(false);
  const [migrationItems, setMigrationItems] = React.useState<GuestCartItem[]>(() => readGuestCartItems());
  const [migrationLoading, setMigrationLoading] = React.useState(false);
  const [migrationError, setMigrationError] = React.useState<string | null>(null);

  const refreshCart = React.useCallback(async () => {
    if (!token) {
      setCart(readLocalCart());
      return;
    }

    const nextCart = await cartService.getCart(token);
    setCart(nextCart);
  }, [token]);

  React.useEffect(() => {
    if (!token) {
      setCart(readLocalCart());
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    void refreshCart()
      .then(() => {
        if (!isMounted) return;
        setError(null);
      })
      .catch((caughtError) => {
        if (!isMounted) return;
        setCart(readLocalCart());
        setError(caughtError instanceof Error ? caughtError.message : 'Unable to load cart.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [refreshCart, token]);

  React.useEffect(() => {
    if (!user?.id) {
      setMigrationOpen(false);
      return;
    }

    const nextItems = readGuestCartItems();
    setMigrationItems(nextItems);
    if (shouldPromptForCartMigration(user.id)) {
      clearCartMigrationSkip(user.id);
      setMigrationOpen(true);
      setMigrationError(null);
    } else {
      setMigrationOpen(false);
    }
  }, [user?.id]);

  const persistLocalCart = React.useCallback((nextCart: CartState) => {
    setCart(nextCart);
    writeStoredJson(CART_KEY, expandCartItems(nextCart.items));
  }, []);

  const addItem = React.useCallback(async (product: Product, quantity = 1) => {
    if (!token) {
      const current = readLocalCart();
      const nextProducts = [...expandCartItems(current.items), ...Array.from({ length: quantity }, () => product)];
      persistLocalCart(normalizeLocalCart(nextProducts));
      return;
    }

    const nextCart = await cartService.addItem(token, getProductId(product), quantity);
    setCart(nextCart);
  }, [persistLocalCart, token]);

  const addMany = React.useCallback(async (products: Product[]) => {
    for (const product of products) {
      await addItem(product, 1);
    }
  }, [addItem]);

  const updateQuantity = React.useCallback(async (productId: string, quantity: number) => {
    if (!token) {
      const currentProducts = expandCartItems(readLocalCart().items).filter((product) => getProductId(product) !== productId);
      const item = cart.items.find((entry) => entry.productId === productId);
      const nextProducts = item
        ? [...currentProducts, ...Array.from({ length: quantity }, () => item.product)]
        : currentProducts;
      persistLocalCart(normalizeLocalCart(nextProducts));
      return;
    }

    const nextCart = await cartService.updateQuantity(token, productId, quantity);
    setCart(nextCart);
  }, [cart.items, persistLocalCart, token]);

  const removeItem = React.useCallback(async (productId: string) => {
    await updateQuantity(productId, 0);
  }, [updateQuantity]);

  const clearCart = React.useCallback(async () => {
    if (!token) {
      persistLocalCart(emptyCart);
      return;
    }

    const nextCart = await cartService.clearCart(token);
    setCart(nextCart);
  }, [persistLocalCart, token]);

  const importGuestCart = React.useCallback(async () => {
    if (!token) return;

    setMigrationLoading(true);
    setMigrationError(null);

    try {
      const result: GuestCartMigrationResult = {
        importedProductIds: [],
        failedProductIds: [],
      };

      for (const item of migrationItems) {
        try {
          await cartService.addItem(token, getProductId(item.product), item.quantity);
          result.importedProductIds.push(getProductId(item.product));
        } catch {
          result.failedProductIds.push(getProductId(item.product));
        }
      }

      applyGuestCartMigrationResult(result);
      setCart(await cartService.getCart(token));
      setMigrationItems(readGuestCartItems());

      if (result.failedProductIds.length > 0) {
        setMigrationError('Some guest cart items could not be imported because stock or availability changed.');
      } else {
        setMigrationOpen(false);
      }
    } catch (caughtError) {
      setMigrationError(caughtError instanceof Error ? caughtError.message : 'Unable to import guest cart.');
    } finally {
      setMigrationLoading(false);
    }
  }, [migrationItems, token]);

  const skipGuestCartImport = React.useCallback(() => {
    if (user?.id) {
      markCartMigrationSkipped(user.id);
    }
    setMigrationOpen(false);
    setMigrationError(null);
  }, [user?.id]);

  const value = React.useMemo<CartContextValue>(() => ({
    cart,
    loading,
    error,
    addItem,
    addMany,
    updateQuantity,
    removeItem,
      clearCart,
      refreshCart,
      expandedProducts: expandCartItems(cart.items),
    cartMigrationPrompt: {
      open: migrationOpen,
      items: migrationItems,
      loading: migrationLoading,
      error: migrationError,
      importGuestCart,
      skipGuestCartImport,
    },
  }), [addItem, addMany, cart, clearCart, error, importGuestCart, loading, migrationError, migrationItems, migrationLoading, migrationOpen, refreshCart, removeItem, skipGuestCartImport, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
