import React from 'react';
import SnakeGame from '../components/SnakeGame/SnakeGame';
import './SubCategoryPage.scss';

const SubCategoryPage: React.FC = () => {
  return (
    <div className="sub-category-container">
      <div className="construction-notice">
        <h1>🚧 Page Under Construction 🚧</h1>
        <p>This part of our store is still being built.</p>
        <p>While you wait, why not play a quick game?</p>
      </div>
      <SnakeGame />
    </div>
  );
};

export default SubCategoryPage;
