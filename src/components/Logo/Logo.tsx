import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Logo.scss';

const logoTextTranslations: { [key: string]: string } = {
  en: 'Infinite Loop Gadgets',
  es: 'Dispositivos de Bucle Infinito',
  fr: 'Gadgets à Boucle Infinie',
};

type LogoProps = {
  className?: string;
  language: string;
};

export default function Logo({ className, language }: LogoProps): JSX.Element {
  const navigate = useNavigate();

  const goHome = () => navigate('/');
  const getLogoText = () => logoTextTranslations[language] || logoTextTranslations.en;

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
      <img
        src="https://cdn.builder.io/api/v1/image/assets%2Fe8d1f38f840a44c4906154cf3410267e%2F29036dda7f2a4390942a2fbf672b7ed8?format=webp&width=800"
        alt={getLogoText()}
        className="logo-image"
        loading="eager"
        decoding="async"
      />
      <span className="logo-text">{getLogoText()}</span>
    </div>
  );
}
