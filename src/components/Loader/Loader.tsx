import React from 'react';
import './Loader.scss';

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
    </div>
  );
};

export default Loader;