import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Logo.scss';

// A simple translation map for the logo text
const logoTextTranslations: { [key: string]: string } = {
  en: 'Infinite Loop Gadgets',
  es: 'Dispositivos de Bucle Infinito',
  fr: 'Gadgets à Boucle Infinie',
};

type LogoProps = {
  className?: string;
  language: string; // Add the language prop
};

export default function Logo({ className, language }: LogoProps): JSX.Element {
  const navigate = useNavigate();

  const goHome = () => navigate('/');

  const getLogoText = () => {
    // Return the translated text, or a default if the language is not found
    return logoTextTranslations[language] || logoTextTranslations.en;
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={className ?? 'logo'}
      onClick={goHome}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goHome();
        }
      }}
      aria-label="Go to home"
    >
      {getLogoText()}
    </div>
  );
}
