import React, { useState } from 'react';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import './Settings.scss';

interface SettingsProps {
  onClose: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose, language, onLanguageChange }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  };

  const handleToggleNotifications = () => {
    setIsNotificationsEnabled(!isNotificationsEnabled);
  };

  const handleToggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2 className="settings-title">Settings</h2>
        <div className="setting-item">
          <label htmlFor="theme-toggle">Dark Mode</label>
          <input
            type="checkbox"
            id="theme-toggle"
            checked={isDarkMode}
            onChange={handleToggleTheme}
          />
        </div>
        <div className="setting-item">
          <label>Language</label>
          <LanguageSelector onLanguageChange={onLanguageChange} selectedLanguage={language} />
        </div>
        <div className="setting-item">
          <label htmlFor="notifications-toggle">Notifications</label>
          <input
            type="checkbox"
            id="notifications-toggle"
            checked={isNotificationsEnabled}
            onChange={handleToggleNotifications}
          />
        </div>
        <div className="setting-item">
          <label htmlFor="sound-toggle">Sounds</label>
          <input
            type="checkbox"
            id="sound-toggle"
            checked={isSoundEnabled}
            onChange={handleToggleSound}
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
