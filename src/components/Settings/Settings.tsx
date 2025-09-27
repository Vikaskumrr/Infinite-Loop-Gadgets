import React, { useMemo, useState } from 'react';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import './Settings.scss';

interface SettingsProps {
  onClose: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
}

type ThemeChoice = 'gradient' | 'neutral' | 'dark';

const applyTheme = (choice: ThemeChoice) => {
  const cls = document.body.classList;
  cls.remove('theme-gradient', 'theme-neutral', 'theme-dark', 'dark-mode');
  if (choice === 'gradient') cls.add('theme-gradient');
  if (choice === 'neutral') cls.add('theme-neutral');
  if (choice === 'dark') { cls.add('theme-dark'); cls.add('dark-mode'); }
};

const Settings: React.FC<SettingsProps> = ({ onClose, language, onLanguageChange }) => {
  const initialTheme = (localStorage.getItem('theme') as ThemeChoice) || 'gradient';
  const [theme, setTheme] = useState<ThemeChoice>(initialTheme);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  useMemo(() => {
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

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
