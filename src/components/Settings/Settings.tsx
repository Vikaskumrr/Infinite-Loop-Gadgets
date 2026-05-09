import React, { useEffect, useState } from 'react';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import type { LanguageCode, ThemeChoice } from '../../types';
import { getStoredTheme, persistTheme } from '../../utils/theme';
import './Settings.scss';

interface SettingsProps {
  onClose: () => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose, language, onLanguageChange }) => {
  const initialTheme = getStoredTheme();
  const [theme, setTheme] = useState<ThemeChoice>(initialTheme);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  useEscapeKey(onClose);

  useEffect(() => {
    persistTheme(theme);
  }, [theme]);

  const handleToggleNotifications = () => {
    setIsNotificationsEnabled(!isNotificationsEnabled);
  };

  const handleToggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <button className="close-btn" onClick={onClose} aria-label="Close settings">&times;</button>
        <h2 className="settings-title" id="settings-title">Settings</h2>

        <div className="setting-item">
          <label className="setting-label" htmlFor="display-theme">Display</label>
          <div className="display-select">
            <select id="display-theme" value={theme} onChange={(e) => setTheme(e.target.value as ThemeChoice)}>
              <option value="gradient">Gradient Modern</option>
              <option value="neutral">Minimalist Neutrals</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>
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
