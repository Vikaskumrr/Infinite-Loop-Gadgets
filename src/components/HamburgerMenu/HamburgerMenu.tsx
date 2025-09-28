import React, { useEffect, useRef, useState } from 'react';
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

  const toggleMenu = () => setIsOpen((v) => !v);

  // Prevent body scroll when drawer is open and manage focus trap
  const menuRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // focus first focusable
      const focusables = menuRef.current?.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      focusables && focusables[0]?.focus();
    } else {
      document.body.style.overflow = originalOverflow;
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const onKeyDownTrap = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }
    if (e.key !== 'Tab') return;
    const focusables = menuRef.current?.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // Simple swipe-to-close on mobile
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 60) setIsOpen(false);
    touchStartX.current = null;
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
      <nav
        id="main-menu"
        ref={menuRef as any}
        className={`menu-list ${isOpen ? 'active' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        onKeyDown={onKeyDownTrap}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <ul className="menu-groups">
          <li>
            <Link to="/account" onClick={toggleMenu} className="menu-item">
              <span className="mi-icon" aria-hidden>👤</span>
              <span>Account</span>
            </Link>
          </li>
          <li>
            <button type="button" onClick={handleOpenSettings} className="menu-item">
              <span className="mi-icon" aria-hidden>⚙️</span>
              <span>Settings</span>
            </button>
          </li>
          <li>
            <Link to="/about" onClick={toggleMenu} className="menu-item">
              <span className="mi-icon" aria-hidden>ℹ️</span>
              <span>About</span>
            </Link>
          </li>
          <li>
            <button type="button" onClick={(e) => e.preventDefault()} className="menu-item">
              <span className="mi-icon" aria-hidden>⁉️</span>
              <span>Help</span>
            </button>
          </li>
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
