import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 1. Safety Unregister: remove any legacy or third-party service workers so browsers never stay on a cached shell
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
    });
  }).catch(() => {});
}

// 2. Vite Chunk-Mismatch Auto-Reload: gracefully handle lazy route chunk 404s after new Vercel deploys
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    const lastReload = sessionStorage.getItem('bloom_chunk_reload');
    const now = Date.now();
    // Guard against infinite reload loops (maximum 1 reload every 15 seconds)
    if (!lastReload || now - parseInt(lastReload, 10) > 15000) {
      sessionStorage.setItem('bloom_chunk_reload', String(now));
      window.location.reload();
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
