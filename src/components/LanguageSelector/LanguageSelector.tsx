import React, { useState } from 'react';
import './LanguageSelector.scss';

const languages = [
  { code: 'en', label: 'ENG' },
  { code: 'es', label: 'ESP' },
  { code: 'fr', label: 'FRA' },
];

interface LanguageSelectorProps {
  onLanguageChange: (languageCode: string) => void;
  selectedLanguage: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange, selectedLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (language: { code: string, label: string }) => {
    onLanguageChange(language.code);
    setIsOpen(false);
  };

  const currentLanguageLabel = languages.find(lang => lang.code === selectedLanguage)?.label || 'ENG';

  return (
    <div className="language-selector-container">
      <div className="language-selector-display" onClick={() => setIsOpen(!isOpen)}>
        {currentLanguageLabel} ▼
      </div>
      {isOpen && (
        <div className="language-selector-dropdown">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className={`language-option ${selectedLanguage === lang.code ? 'selected' : ''}`}
              onClick={() => handleLanguageChange(lang)}
            >
              {lang.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
