import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Categories.scss';

const categories = [
  {
    name: 'Electronics',
    subcategories: ['Laptops', 'Smartphones', 'Tablets', 'Wearables']
  },
  {
    name: 'Gaming',
    subcategories: ['Consoles', 'PC Gaming', 'Accessories']
  },
  {
    name: 'Home & Office',
    subcategories: ['Smart Home', 'Printers', 'Monitors']
  },
  {
    name: 'Accessories',
    subcategories: ['Headphones', 'Speakers', 'Power Banks']
  }
];

const Categories: React.FC = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [clickedCategory, setClickedCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<number | null>(null); // Ref to hold the timeout ID

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setHoveredCategory(null);
        setClickedCategory(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [dropdownRef]);

  const handleMouseEnter = (categoryName: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredCategory(categoryName);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = window.setTimeout(() => {
      setHoveredCategory(null);
    }, 200);
  };

  const handleCategoryClick = (categoryName: string) => {
    setClickedCategory(clickedCategory === categoryName ? null : categoryName);
  };

  const getActiveCategory = () => {
    return clickedCategory || hoveredCategory;
  };

  return (
    <div className="categories-menu" ref={dropdownRef}>
      {categories.map((category) => (
        <div
          key={category.name}
          className="category-item-wrapper"
          onMouseEnter={() => handleMouseEnter(category.name)}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className={`category-item ${getActiveCategory() === category.name ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.name)}
          >
            {category.name}
          </button>
          {getActiveCategory() === category.name && (
            <ul className="subcategory-dropdown">
              {category.subcategories.map((sub) => (
                <li key={sub}>
                  <Link to={`/products?category=${sub.toLowerCase()}`} className='subcategory-item'>
                    {/* You might want to add an icon here dynamically based on subcategory */}
                    <span>{sub}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Categories;