import React from 'react';
import './SearchFilter.scss';
import type { SortOption } from '../../types';
import { readStoredJson, writeStoredJson } from '../../utils/storage';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ searchTerm, onSearchChange, sortOption, onSortChange }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [recentSearches, setRecentSearches] = React.useState<string[]>(() => readStoredJson('ilg.recentSearches', []));
  const suggestions = ['smartphone', 'headphones', 'console', 'power bank', 'verified price'];
  const visibleSuggestions = [
    ...recentSearches.map((term) => ({ label: term, type: 'Recent' })),
    ...suggestions.filter((term) => !recentSearches.includes(term)).map((term) => ({ label: term, type: 'Try' })),
  ].slice(0, 6);

  const commitSearch = (value: string) => {
    const nextValue = value.trim();
    if (!nextValue) return;
    const nextSearches = [nextValue, ...recentSearches.filter((term) => term !== nextValue)].slice(0, 4);
    setRecentSearches(nextSearches);
    writeStoredJson('ilg.recentSearches', nextSearches);
  };

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
          onFocus={() => setIsFocused(true)}
          onBlur={() => window.setTimeout(() => setIsFocused(false), 120)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              commitSearch(searchTerm);
            }
          }}
        />
        {isFocused && (
          <div className="search-suggestions" role="listbox" aria-label="Search suggestions">
            {visibleSuggestions.map((suggestion) => (
              <button
                type="button"
                key={`${suggestion.type}-${suggestion.label}`}
                onClick={() => {
                  onSearchChange(suggestion.label);
                  commitSearch(suggestion.label);
                }}
              >
                <span>{suggestion.type}</span>
                {suggestion.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="sort-select-wrapper">
        <label htmlFor="sort-select" className="visually-hidden">Sort products</label>
        <select id="sort-select" value={sortOption} onChange={(e) => onSortChange(e.target.value as SortOption)}>
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
