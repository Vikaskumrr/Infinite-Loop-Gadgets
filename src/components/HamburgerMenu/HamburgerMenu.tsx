import React, { useState } from 'react';
import './HamburgerMenu.scss';
import { Link } from 'react-router-dom';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
          <li><a href="#">Settings</a></li>
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
    </>
  );
};

export default HamburgerMenu;