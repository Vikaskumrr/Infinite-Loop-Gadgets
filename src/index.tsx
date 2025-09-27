import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/app.scss';
// Dynamically load optional modules only when env vars are provided to avoid build/runtime errors
if (process.env.REACT_APP_SENTRY_DSN) {
  import('./sentry').catch(() => {});
}
if (process.env.REACT_APP_GA_ID) {
  import('./analytics').catch(() => {});
}

// Apply saved or default theme before app mounts
(() => {
  const saved = localStorage.getItem('theme');
  const theme = saved || 'gradient';
  const cls = document.body.classList;
  cls.remove('theme-gradient', 'theme-neutral', 'theme-dark', 'dark-mode');
  if (theme === 'gradient') cls.add('theme-gradient');
  if (theme === 'neutral') cls.add('theme-neutral');
  if (theme === 'dark') { cls.add('theme-dark'); cls.add('dark-mode'); }
  if (!saved) localStorage.setItem('theme', theme);
})();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
