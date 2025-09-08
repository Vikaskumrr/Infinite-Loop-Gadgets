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
        <button onClick={onPrev}>↑</button>
        <button onClick={onNext}>↓</button>
      </div>
      <span className="tech-index">0{currentIndex + 1}</span>
    </>
  );
};

export default ArrowNav;
