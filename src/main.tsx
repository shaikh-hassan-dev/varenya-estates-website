import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Variable Inter with the optical-size axis, as used by the reference design.
import '@fontsource-variable/inter/opsz.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
