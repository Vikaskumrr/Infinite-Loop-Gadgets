import React, { useState, useRef, useEffect } from 'react';
import './LanguageSelector.scss';

// Add more languages with their native names for better user experience
const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'zh', label: '中文' },
];

interface LanguageSelectorProps {
  onLanguageChange: (languageCode: string) => void;
  selectedLanguage: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange, selectedLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  // Close the dropdown if the user clicks outside of it
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleLanguageChange = (language: { code: string, label: string }) => {
    onLanguageChange(language.code);
    setIsOpen(false);
  };

  const currentLanguageLabel = languages.find(lang => lang.code === selectedLanguage)?.label || 'English';

  return (
    <div className="language-selector-container" ref={selectorRef}>
      <button
        className="language-selector-display"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="language-label">{currentLanguageLabel}</span>
        <span className="icon-arrow" aria-hidden="true">▼</span>
      </button>
      {isOpen && (
        <div className="language-selector-dropdown" role="menu">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${selectedLanguage === lang.code ? 'selected' : ''}`}
              onClick={() => handleLanguageChange(lang)}
              role="menuitem"
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
