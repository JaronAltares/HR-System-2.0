import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { UserRightsProvider } from './contexts/UserRightsContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserRightsProvider>
      <App />
    </UserRightsProvider>
  </React.StrictMode>,
)