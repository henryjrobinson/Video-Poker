import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Import debug version for deployment testing
import AppDebug from './App.debug'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppDebug />
  </StrictMode>,
)
