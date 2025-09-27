import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Settings from '../Settings/Settings';
import './HamburgerMenu.scss';

interface HamburgerMenuProps {
  language: string;
  onLanguageChange: (lang: string) => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ language, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
    setIsOpen(false);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={`hamburger-container ${isOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="main-menu"
      >
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
      </button>
      <nav id="main-menu" className={`menu-list ${isOpen ? 'active' : ''}`}>
        <ul>
          <li><Link to="/account" onClick={toggleMenu}>Account</Link></li>
          <li><button type="button" onClick={handleOpenSettings}>Settings</button></li>
          <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
          <li><button type="button" onClick={(e) => e.preventDefault()}>Help</button></li>
        </ul>
      </nav>
      {isOpen && (
        <div
          className="menu-overlay"
          onClick={toggleMenu}
        />
      )}
      {isSettingsOpen && <Settings onClose={handleCloseSettings} language={language} onLanguageChange={onLanguageChange} />}
    </>
  );
};

export default HamburgerMenu;
