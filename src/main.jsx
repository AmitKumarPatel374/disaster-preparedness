import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { registerSW } from 'virtual:pwa-register'


// register service worker (vite-plugin-pwa provides virtual helper)
const updateSW = registerSW({
  onNeedRefresh() { },
  onOfflineReady() { }
})


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)