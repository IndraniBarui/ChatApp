import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Store from './components/Rudux/Store.jsx'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={Store}>
    <App />
    <ToastContainer />
    </Provider>
  </StrictMode>,
)
