import React from 'react';
import './UserDataMigrationPrompt.scss';

interface UserDataMigrationPromptProps {
  wishlistCount: number;
  compareCount: number;
  recentlyViewedCount: number;
  loading: boolean;
  error: string | null;
  onImport: () => void;
  onSkip: () => void;
}

const UserDataMigrationPrompt: React.FC<UserDataMigrationPromptProps> = ({
  wishlistCount,
  compareCount,
  recentlyViewedCount,
  loading,
  error,
  onImport,
  onSkip,
}) => (
  <div className="migration-prompt" role="dialog" aria-modal="true" aria-labelledby="migration-prompt-title">
    <div className="migration-prompt__panel">
      <span className="migration-prompt__eyebrow">Saved guest session</span>
      <h2 id="migration-prompt-title">Move your saved products into this account?</h2>
      <p>
        We found {wishlistCount} wishlist item{wishlistCount === 1 ? '' : 's'}, {compareCount} compare item{compareCount === 1 ? '' : 's'}, and {recentlyViewedCount} recently viewed product{recentlyViewedCount === 1 ? '' : 's'} on this device.
      </p>
      <p>Import keeps your account shortlist in sync across sessions. Skipping leaves the guest data on this browser for now.</p>
      {error ? <p className="migration-prompt__error">{error}</p> : null}
      <div className="migration-prompt__actions">
        <button type="button" onClick={onSkip} disabled={loading}>Skip for now</button>
        <button type="button" onClick={onImport} disabled={loading}>
          {loading ? 'Importing...' : 'Import saved items'}
        </button>
      </div>
    </div>
  </div>
);

export default UserDataMigrationPrompt;
