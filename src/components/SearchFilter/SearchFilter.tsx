import React from 'react';
import './SearchFilter.scss';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ searchTerm, onSearchChange, sortOption, onSortChange }) => {
  return (
    <div className="search-filter-container">
      <div className="search-input-wrapper">
        <label htmlFor="product-search" className="visually-hidden">Search products</label>
        <input
          id="product-search"
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="sort-select-wrapper">
        <label htmlFor="sort-select" className="visually-hidden">Sort products</label>
        <select id="sort-select" value={sortOption} onChange={(e) => onSortChange(e.target.value)}>
          <option value="none">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilter;
