import React from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import ReactDOM from 'react-dom/client';
import { Buffer } from 'buffer';

// Polyfill Buffer for browser environment
globalThis.Buffer = Buffer;

import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { OmniThemeProvider } from '@/omni/infrastructure/ui/OmniThemeProvider';
import { LocalizationProvider } from './contexts/LocalizationContext';
import { AuthProvider } from '@/components/auth/UserAuth';

const rootElement = document.getElementById('root');

if (!rootElement) {
  omniLogger.error(LogCategory.SYSTEM, '[main] [FATAL] Root element not found');
  document.body.innerHTML =
    '<div style="color:white;background:red;padding:20px;">System Initialization Failed: Root element missing.</div>';
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    omniLogger.error(LogCategory.SYSTEM, '[main] [FATAL] Render Error', { error });
    if (rootElement) {
      const isProd = import.meta.env.PROD;
      const errorMsg = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error && !isProd ? error.stack : '';

      rootElement.textContent = ''; // Clear existing
      const container = document.createElement('div');
      container.style.cssText = 'color:red;padding:20px;font-family:monospace;background:#111;';

      const h1 = document.createElement('h1');
      h1.textContent = 'Runtime Error';
      container.appendChild(h1);

      const pre = document.createElement('pre');
      pre.textContent = errorMsg + (errorStack ? '\n\n' + errorStack : '');
      container.appendChild(pre);

      if (isProd) {
        const p = document.createElement('p');
        p.textContent = 'For security reasons, technical details are hidden in production.';
        container.appendChild(p);
      }

      rootElement.appendChild(container);
    }
  }
}
