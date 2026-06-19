import fs from 'fs';
import path from 'path';

const dirs = [
  'src/contexts',
  'src/components/providers',
  'src/components/universal',
  'src/components',
];

dirs.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const components = [
  'MyEsg',
  'StrategyHub',
  'CarbonAsset',
  'FinanceSim',
  'TalentPassport',
  'CultureBot',
  'GoodwillCoin',
  'Gamification',
  'Settings',
  'Academy',
  'AdminPanel',
  'AuditTrail',
  'BusinessIntel',
  'ResearchHub',
  'ReportGen',
  'IntegrationHub',
  'AnalyticsDashboard',
  'ESGAiAssistant',
  'HypercubeAiLab',
  'OmniManager',
];

const componentTemplate = name => `import React from 'react';
import { Language } from '../types';

export const ${name}: React.FC<{ language?: Language; onNavigate?: any }> = ({ language }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">${name}</h2>
    <p>Component placeholder for ${name}</p>
  </div>
);
`;

components.forEach(name => {
  const filePath = path.join('src/components', `${name}.tsx`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, componentTemplate(name));
    console.log(`Created ${filePath}`);
  }
});

// ErrorBoundary
const ebContent = `import React from 'react';
export class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="p-4 text-red-500">Something went wrong.</div>;
    return this.props.children;
  }
}`;
fs.writeFileSync('src/components/ErrorBoundary.tsx', ebContent);
console.log('Created src/components/ErrorBoundary.tsx');

// Contexts
const contexts = ['ToastContext', 'UniversalAgentContext', 'ThemeContext'];
const contextTemplate = name => `import React, { createContext, useContext } from 'react';
const Context = createContext<any>(null);
export const ${name.replace('Context', '')}Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Context.Provider value={{}}>{children}</Context.Provider>
);
export const use${name.replace('Context', '')} = () => useContext(Context);
export const ToastContainer = () => null;
`;

contexts.forEach(name => {
  const filePath = path.join('src/contexts', `${name}.tsx`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, contextTemplate(name));
    console.log(`Created ${filePath}`);
  }
});

// CompanyProvider
const cpContent = `import React from 'react';
export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;`;
fs.writeFileSync('src/components/providers/CompanyProvider.tsx', cpContent);
console.log('Created src/components/providers/CompanyProvider.tsx');

// CardArena
const caContent = `import React from 'react';
const CardArena: React.FC<{ onCardAction?: (cardId: string, action: string) => void }> = () => <div>Card Arena Placeholder</div>;
export default CardArena;`;
fs.writeFileSync('src/components/universal/CardArena.tsx', caContent);
console.log('Created src/components/universal/CardArena.tsx');
