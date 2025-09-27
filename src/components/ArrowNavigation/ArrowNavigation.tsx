import React from 'react';
import './ArrowNavigation.scss';

interface ArrowNavProps {
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalProducts: number;
}

const ArrowNav: React.FC<ArrowNavProps> = ({ onPrev, onNext, currentIndex, totalProducts }) => {
  return (
    <>
      <div className="arrow-nav">
        <button type="button" onClick={onPrev} aria-label="Previous product" title="Previous product">↑</button>
        <button type="button" onClick={onNext} aria-label="Next product" title="Next product">↓</button>
      </div>
    </>
  );
};

export default ArrowNav;
