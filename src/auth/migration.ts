export interface UserDataMigrationPreview {
  hasLocalProfile: boolean;
  cartItems: number;
  wishlistItems: number;
  compareItems: number;
}

const readArrayLength = (key: string): number => {
  try {
    const value = localStorage.getItem(key);
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
};

export const prepareUserDataMigration = (): UserDataMigrationPreview => ({
  hasLocalProfile: Boolean(localStorage.getItem('ilg.profile')),
  cartItems: readArrayLength('ilg.cart'),
  wishlistItems: readArrayLength('ilg.wishlist'),
  compareItems: readArrayLength('ilg.compare'),
});
