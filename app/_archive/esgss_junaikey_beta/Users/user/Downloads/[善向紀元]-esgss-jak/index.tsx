
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';
import { injectGenesisData } from './utils/seed';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// 注入 ESGss 創世種子數據
injectGenesisData();

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);