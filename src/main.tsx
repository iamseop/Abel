import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { SessionContextProvider } from './components/SessionContextProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SessionContextProvider>
        <App />
      </SessionContextProvider>
    </BrowserRouter>
  </StrictMode>
);