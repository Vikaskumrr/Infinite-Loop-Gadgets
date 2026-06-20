import React from 'react';
import './CartMigrationPrompt.scss';

interface CartMigrationPromptProps {
  itemCount: number;
  loading: boolean;
  error: string | null;
  onImport: () => void;
  onSkip: () => void;
}

const CartMigrationPrompt: React.FC<CartMigrationPromptProps> = ({
  itemCount,
  loading,
  error,
  onImport,
  onSkip,
}) => (
  <div className="cart-migration-prompt" role="dialog" aria-modal="true" aria-labelledby="cart-migration-title">
    <div className="cart-migration-prompt__panel">
      <span className="cart-migration-prompt__eyebrow">Guest cart found</span>
      <h2 id="cart-migration-title">Bring your guest cart into this account?</h2>
      <p>You have {itemCount} item{itemCount === 1 ? '' : 's'} saved on this device. We can merge them into your account cart and re-check stock as we go.</p>
      <p>Unavailable items stay behind locally so nothing disappears without explanation.</p>
      {error ? <p className="cart-migration-prompt__error">{error}</p> : null}
      <div className="cart-migration-prompt__actions">
        <button type="button" onClick={onSkip} disabled={loading}>Skip for now</button>
        <button type="button" onClick={onImport} disabled={loading}>
          {loading ? 'Importing...' : 'Import cart'}
        </button>
      </div>
    </div>
  </div>
);

export default CartMigrationPrompt;
