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
      <div
        className={`hamburger-container ${isOpen ? 'active' : ''}`}
        onClick={toggleMenu}
      >
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
      </div>
      <nav className={`menu-list ${isOpen ? 'active' : ''}`}>
        <ul>
          <li><Link to="/account" onClick={toggleMenu}>Account</Link></li>
          <li><a href="#" onClick={handleOpenSettings}>Settings</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Help</a></li>
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
