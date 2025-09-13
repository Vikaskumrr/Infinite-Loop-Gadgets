import React from 'react';
import Logo from '../Logo/Logo';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import SearchFilter from '../SearchFilter/SearchFilter';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';
import './Header.scss';

interface HeaderProps {
  language: string;
  onLanguageChange: (languageCode: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortOption: string;
  onSortChange: (option: string) => void;
  onOpenCart: () => void;
}

const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  searchTerm,
  onSearchChange,
  sortOption,
  onSortChange,
  onOpenCart,
}) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Logo language={language} />
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
        <LanguageSelector onLanguageChange={onLanguageChange} selectedLanguage={language} />
        <button className="cart-btn" onClick={onOpenCart}>🛒</button>
        <HamburgerMenu />
      </div>
    </nav>
  );
};

export default Header;
