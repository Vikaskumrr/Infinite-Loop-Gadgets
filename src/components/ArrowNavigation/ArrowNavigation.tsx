import React from 'react';
import './ArrowNavigation.scss';

interface ArrowNavProps {
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalProducts: number;
}

const ArrowNav: React.FC<ArrowNavProps> = ({ onPrev, onNext, currentIndex, totalProducts }) => {
  const positionText = `${currentIndex + 1} of ${totalProducts}`;

  return (
    <>
      <div className="arrow-nav">
        <button type="button" onClick={onPrev} aria-label={`Previous product, ${positionText}`} title="Previous product">↑</button>
        <button type="button" onClick={onNext} aria-label={`Next product, ${positionText}`} title="Next product">↓</button>
      </div>
    </>
  );
};

export default ArrowNav;
