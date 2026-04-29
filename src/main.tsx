import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Register service worker (vite-plugin-pwa handles this in prod)
// In dev we skip to avoid confusion
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register('/sw.js');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
