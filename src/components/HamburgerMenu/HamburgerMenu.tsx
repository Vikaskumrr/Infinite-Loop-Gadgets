import React, { useState } from 'react';
import './HamburgerMenu.scss';

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
          <li><a href="#">Account</a></li>
          <li><a href="#">Settings</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Help</a></li>
        </ul>
      </nav>

      {/* New overlay element to close the menu when clicked outside */}
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