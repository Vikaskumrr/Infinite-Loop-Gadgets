import React from 'react';
import { Link } from 'react-router-dom';
import '../SubCategoryPage/SubCategoryPage.scss';

const NotFoundPage: React.FC = () => (
  <div className="category-state">
    <span className="state-kicker">404</span>
    <h1>This page moved or never existed.</h1>
    <p>Head back to the storefront to browse the latest gadgets.</p>
    <Link to="/">Return to storefront</Link>
  </div>
);

export default NotFoundPage;
