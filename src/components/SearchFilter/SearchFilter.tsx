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
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="sort-select-wrapper">
        <select value={sortOption} onChange={(e) => onSortChange(e.target.value)}>
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
