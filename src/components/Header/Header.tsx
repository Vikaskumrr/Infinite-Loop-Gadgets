import React from 'react';
import Logo from '../Logo/Logo';
import SearchFilter from '../SearchFilter/SearchFilter';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';
import Categories from '../Categories/Categories'; // Import the new component
import { FiShoppingBag } from 'react-icons/fi';
import type { LanguageCode, SortOption } from '../../types';
import './Header.scss';

interface HeaderProps {
  language: LanguageCode;
  onLanguageChange: (languageCode: LanguageCode) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  onOpenCart: () => void;
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  searchTerm,
  onSearchChange,
  sortOption,
  onSortChange,
  onOpenCart,
  cartCount,
}) => {
  return (
    <nav className="navbar">
      <div className="logo-and-categories">
        <div className="logo">
          <Logo language={language} />
        </div>
        <Categories />
      </div>
      <div className="search-and-sort">
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          sortOption={sortOption}
          onSortChange={onSortChange}
        />
      </div>
      <div className="controls">
        <button type="button" className="cart-btn" onClick={onOpenCart} aria-label={`Open cart with ${cartCount} item${cartCount === 1 ? '' : 's'}`}>
          <FiShoppingBag className="cart-icon" aria-hidden />
          {cartCount > 0 && (
            <span className="cart-qty-badge" aria-live="polite">{cartCount}</span>
          )}
        </button>
        <HamburgerMenu language={language} onLanguageChange={onLanguageChange} />
      </div>
    </nav>
  );
};

export default Header;
