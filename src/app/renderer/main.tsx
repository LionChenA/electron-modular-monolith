import './assets/main.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { OrpcProvider } from './providers/OrpcProvider';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <OrpcProvider>
        <App />
      </OrpcProvider>
    </StrictMode>,
  );
}
