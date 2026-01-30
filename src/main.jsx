import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { DedicationsProvider } from './contexts/DedicationsContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/dedicate-a-song">
      <DedicationsProvider>
        <App />
      </DedicationsProvider>
    </BrowserRouter>
  </StrictMode>,
)
