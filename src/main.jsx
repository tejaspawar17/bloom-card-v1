import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Unregister any legacy service workers to prevent stale cached shells
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((r) => r.unregister())
  }).catch(() => {})
}

// Vite dynamic import / chunk mismatch auto-reload with sessionStorage guard
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  const key = 'bloom_chunk_reload'
  const lastReload = parseInt(sessionStorage.getItem(key) || '0', 10)
  const now = Date.now()
  if (now - lastReload > 15000) {
    sessionStorage.setItem(key, String(now))
    window.location.reload()
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
