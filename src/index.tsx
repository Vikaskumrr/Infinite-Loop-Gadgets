import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/app.scss';
import { getStoredTheme, persistTheme } from './utils/theme';

// Dynamically load optional modules only when env vars are provided to avoid build/runtime errors
if (import.meta.env.VITE_SENTRY_DSN) {
  import('./sentry').catch(() => {});
}
if (import.meta.env.VITE_GA_ID) {
  import('./analytics').catch(() => {});
}

// Apply saved or default theme before app mounts
persistTheme(getStoredTheme());

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
