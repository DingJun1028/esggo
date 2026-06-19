/**
 * 🛠️ Developer Portal
 * --------------------------------------------------
 * Central hub for technical details, APIs, component library, and dev tools.
 */

import React, { useState } from 'react';
import { Code, Database, Layers, Package, Cpu, Activity, Terminal, GitBranch } from 'lucide-react';

export const DeveloperPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'components' | 'services' | 'api' | 'tools'
  >('overview');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Code className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Developer Portal
            </h1>
            <p className="text-slate-400">Developer Portal - ESG Sunshine JAK v1.0</p>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <StatCard title="Components" value="29+" icon={<Package />} color="purple" />
          <StatCard title="Services" value="19" icon={<Layers />} color="blue" />
          <StatCard title="Endpoints" value="15+" icon={<Database />} color="green" />
          <StatCard title="Status" value="Healthy" icon={<Activity />} color="emerald" />
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex gap-2 border-b border-slate-800">
          <TabButton
            title="Overview"
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <TabButton
            title="Components"
            active={activeTab === 'components'}
            onClick={() => setActiveTab('components')}
          />
          <TabButton
            title="Services"
            active={activeTab === 'services'}
            onClick={() => setActiveTab('services')}
          />
          <TabButton
            title="API Docs"
            active={activeTab === 'api'}
            onClick={() => setActiveTab('api')}
          />
          <TabButton
            title="Tools"
            active={activeTab === 'tools'}
            onClick={() => setActiveTab('tools')}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'overview' && <SystemOverview />}
        {activeTab === 'components' && <ComponentLibrary />}
        {activeTab === 'services' && <ServiceLayer />}
        {activeTab === 'api' && <ApiDocumentation />}
        {activeTab === 'tools' && <DevTools />}
      </div>
    </div>
  );
};

// Helper Components

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <div className={`bg-slate-900 rounded-xl p-4 border border-slate-800`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-slate-400">{title}</span>
      <div className={`text-${color}-400`}>{icon}</div>
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

const TabButton: React.FC<{ title: string; active: boolean; onClick: () => void }> = ({
  title,
  active,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-medium transition-all ${
      active ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-200'
    }`}
  >
    {title}
  </button>
);

const SystemOverview: React.FC = () => (
  <div className="space-y-6">
    <section className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Cpu className="text-purple-400" />
        Tech Stack
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <TechItem title="Frontend" content="React 19.2.3 + TypeScript 5.9.3" />
        <TechItem title="Styling" content="Tailwind CSS 4.1.18" />
        <TechItem title="Animation" content="Framer Motion 12.23.26" />
        <TechItem title="Icons" content="Lucide React 0.562.0" />
        <TechItem title="State" content="React Context API + Zustand" />
        <TechItem title="Routing" content="React Router DOM 7.12.0" />
      </div>
    </section>

    <section className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <h2 className="text-2xl font-bold mb-4">Architecture</h2>
      <div className="bg-slate-950 rounded-lg p-6 font-mono text-sm">
        <pre className="text-slate-300">{`
┌─────────────────────────────────────────┐
│         ESG Sunshine JAK v1.0           │
├─────────────────────────────────────────┤
│  User Layer                             │
│  ├─ Auth & Identity                     │
│  ├─ User Passport                       │
│  └─ RBAC                                │
├─────────────────────────────────────────┤
│  App Layer                              │
│  ├─ ESG Platform (6 Components)        │
│  ├─ OmniAdminPanel (4 Modules)          │
│  └─ i18n System                         │
├─────────────────────────────────────────┤
│  Service Layer                          │
│  ├─ OmniCrystal (19 Cores)              │
│  ├─ Awakening Protocol (v8.0)           │
│  ├─ AI Processors                       │
│  └─ Data Management                     │
├─────────────────────────────────────────┤
│  Infrastructure                         │
│  ├─ Caching System                      │
│  ├─ Logging System                      │
│  └─ Performance Monitor                 │
└─────────────────────────────────────────┘
                `}</pre>
      </div>
    </section>
  </div>
);

const ComponentLibrary: React.FC = () => (
  <div className="space-y-6">
    <section className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <h2 className="text-2xl font-bold mb-4">ESG Platform Components</h2>
      <div className="space-y-3">
        <ComponentItem
          name="Sustainability Report"
          path="src/components/ESG/SustainabilityReport.tsx"
          status="✅"
        />
        <ComponentItem name="Impact Radar" path="src/components/ESG/ImpactRadar.tsx" status="✅" />
        <ComponentItem
          name="Daily ESG News"
          path="src/components/ESG/DailyESGNews.tsx"
          status="✅"
        />
        <ComponentItem
          name="Holistic Education Assessment"
          path="src/components/ESG/HolisticEducationAssessment.tsx"
          status="✅"
        />
        <ComponentItem
          name="AI Digital Twin"
          path="src/components/ESG/AIDigitalTwin.tsx"
          status="✅"
        />
        <ComponentItem
          name="Carbon Asset Trading"
          path="src/components/ESG/CarbonAssetTrading.tsx"
          status="✅"
        />
      </div>
    </section>

    <section className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <h2 className="text-2xl font-bold mb-4">Auth & Admin Components</h2>
      <div className="space-y-3">
        <ComponentItem
          name="User Authentication"
          path="src/components/Auth/UserAuthentication.tsx"
          status="✅"
        />
        <ComponentItem
          name="OmniAdminPanel"
          path="src/components/Admin/OmniAdminPanel.tsx"
          status="✅"
        />
        <ComponentItem name="i18n System" path="src/utils/i18n.tsx" status="✅" />
      </div>
    </section>
  </div>
);

const ServiceLayer: React.FC = () => (
  <div className="space-y-6">
    <section className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <h2 className="text-2xl font-bold mb-4">OmniCrystal Core Services</h2>
      <div className="grid grid-cols-2 gap-3">
        <ServiceItem name="RAG Engine" path="ragEngine.ts" />
        <ServiceItem name="Zero Hallucination Guard" path="zeroHallucinationGuard.ts" />
        <ServiceItem name="Message Queue" path="messageQueue.ts" />
        <ServiceItem name="Multi-Task Processor" path="multiTaskProcessor.ts" />
        <ServiceItem name="Task Decomposition" path="taskDecomposition.ts" />
        <ServiceItem name="Predictive Intent" path="predictiveIntent.ts" />
        <ServiceItem name="Bilingual Knowledge" path="bilingualKnowledge.ts" />
        <ServiceItem name="Vision System" path="visionSystem.ts" />
        <ServiceItem name="Insight Generator" path="insightfulGenerator.ts" />
        <ServiceItem name="Auto Completion" path="autoCompletion.ts" />
        <ServiceItem name="MECE Classification" path="meceClassification.ts" />
        <ServiceItem name="Cache Manager" path="cacheManager.ts" />
        <ServiceItem name="Performance Monitor" path="performanceMonitor.ts" />
        <ServiceItem name="Error Handler" path="errorHandler.ts" />
      </div>
    </section>
  </div>
);

const ApiDocumentation: React.FC = () => (
  <div className="space-y-6">
    <section className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <h2 className="text-2xl font-bold mb-4">Auth API</h2>
      <div className="space-y-3">
        <ApiItem method="POST" endpoint="/api/auth/login" description="User Login" />
        <ApiItem method="POST" endpoint="/api/auth/logout" description="User Logout" />
        <ApiItem method="GET" endpoint="/api/auth/profile" description="Get User Profile" />
        <ApiItem method="PUT" endpoint="/api/auth/profile" description="Update User Profile" />
      </div>
    </section>

    <section className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <h2 className="text-2xl font-bold mb-4">ESG Data API</h2>
      <div className="space-y-3">
        <ApiItem method="GET" endpoint="/api/esg/report" description="Get Sustainability Report" />
        <ApiItem
          method="GET"
          endpoint="/api/esg/supply-chain"
          description="Get Supply Chain Data"
        />
        <ApiItem method="GET" endpoint="/api/esg/news" description="Get ESG News" />
        <ApiItem method="POST" endpoint="/api/esg/assessment" description="Submit Assessment" />
      </div>
    </section>
  </div>
);

const DevTools: React.FC = () => (
  <div className="space-y-6">
    <section className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Terminal className="text-green-400" />
        NPM Scripts
      </h2>
      <div className="space-y-2 font-mono text-sm">
        <ScriptItem command="npm run dev:ui" description="Start Frontend Dev Server" />
        <ScriptItem command="npm run build" description="Build for Production" />
        <ScriptItem command="npm run type-check" description="TypeScript Type Check" />
        <ScriptItem command="npm run lint" description="Lint Code" />
        <ScriptItem command="npm run format" description="Format Code" />
      </div>
    </section>

    <section className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <GitBranch className="text-orange-400" />
        Git Workflow
      </h2>
      <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm text-slate-300">
        <pre>{`
# Feature Development
git checkout -b feature/new-feature
git add .
git commit -m "feat: description of changes"
git push origin feature/new-feature

# Main Branches
main - Production
develop - Development
                `}</pre>
      </div>
    </section>
  </div>
);

const TechItem: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div className="bg-slate-950 rounded-lg p-4">
    <div className="text-sm text-slate-400 mb-1">{title}</div>
    <div className="font-mono text-sm text-blue-400">{content}</div>
  </div>
);

const ComponentItem: React.FC<{ name: string; path: string; status: string }> = ({
  name,
  path,
  status,
}) => (
  <div className="flex items-center justify-between bg-slate-950 rounded-lg p-4">
    <div>
      <div className="font-medium">{name}</div>
      <div className="text-sm text-slate-400 font-mono">{path}</div>
    </div>
    <span className="text-green-400">{status}</span>
  </div>
);

const ServiceItem: React.FC<{ name: string; path: string }> = ({ name, path }) => (
  <div className="bg-slate-950 rounded-lg p-3">
    <div className="font-medium mb-1">{name}</div>
    <div className="text-xs text-slate-400 font-mono">{path}</div>
  </div>
);

const ApiItem: React.FC<{ method: string; endpoint: string; description: string }> = ({
  method,
  endpoint,
  description,
}) => (
  <div className="flex items-center gap-4 bg-slate-950 rounded-lg p-4">
    <span
      className={`px-3 py-1 rounded font-mono text-sm ${
        method === 'GET'
          ? 'bg-blue-900 text-blue-200'
          : method === 'POST'
            ? 'bg-green-900 text-green-200'
            : method === 'PUT'
              ? 'bg-yellow-900 text-yellow-200'
              : 'bg-red-900 text-red-200'
      }`}
    >
      {method}
    </span>
    <div className="flex-1">
      <div className="font-mono text-sm text-blue-400">{endpoint}</div>
      <div className="text-sm text-slate-400">{description}</div>
    </div>
  </div>
);

const ScriptItem: React.FC<{ command: string; description: string }> = ({
  command,
  description,
}) => (
  <div className="flex items-center gap-4 bg-slate-950 rounded-lg p-3">
    <code className="text-green-400">{command}</code>
    <span className="text-slate-400">- {description}</span>
  </div>
);

export default DeveloperPortal;
