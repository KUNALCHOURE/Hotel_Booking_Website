import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/authcontext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
     {/* <Toaster position="top-right" /> */}
      <App />
   
  </StrictMode>,
)
