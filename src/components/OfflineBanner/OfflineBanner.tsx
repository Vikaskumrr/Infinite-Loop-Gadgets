import React from 'react';
import './OfflineBanner.scss';

interface OfflineBannerProps {
  isOnline: boolean;
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline }) => {
  if (isOnline) {
    return null;
  }

  return (
    <div className="offline-banner" role="status">
      You appear to be offline. Your cart and wishlist are saved locally and will keep working.
    </div>
  );
};

export default OfflineBanner;
