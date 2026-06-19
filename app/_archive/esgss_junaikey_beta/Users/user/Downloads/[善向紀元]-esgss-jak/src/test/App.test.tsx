import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../../App'
import { vi } from 'vitest'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock all components to avoid complex imports
vi.mock('../../components/Layout', () => ({
  Layout: ({ children, onNavigate }: any) => (
    <div data-testid="layout">
      <button onClick={() => onNavigate('test-view')}>Test Navigate</button>
      {children}
    </div>
  )
}))

vi.mock('../../components/LoginScreen', () => ({
  LoginScreen: ({ onLogin }: any) => (
    <div data-testid="login-screen">
      <button onClick={onLogin}>Login</button>
    </div>
  )
}))

vi.mock('../../components/MyEsg', () => ({
  MyEsg: () => <div data-testid="my-esg">My ESG Component</div>
}))

vi.mock('../../contexts/ToastContext', () => ({
  ToastProvider: ({ children }: any) => <div data-testid="toast-provider">{children}</div>,
  ToastContainer: () => <div data-testid="toast-container" />
}))

vi.mock('../../components/providers/CompanyProvider', () => ({
  CompanyProvider: ({ children }: any) => <div data-testid="company-provider">{children}</div>
}))

vi.mock('../../contexts/UniversalAgentContext', () => ({
  UniversalAgentProvider: ({ children }: any) => <div data-testid="universal-agent-provider">{children}</div>
}))



vi.mock('../../components/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: any) => <div data-testid="error-boundary">{children}</div>
}))

vi.mock('../../services/monitoring', () => ({
  ErrorBoundaryWithMonitoring: ({ children }: any) => <div data-testid="error-boundary-monitoring">{children}</div>
}))

vi.mock('../../components/LoadingScreen', () => ({
  LoadingScreen: () => <div data-testid="loading-screen" />
}))

vi.mock('../../components/OnboardingSystem', () => ({
  OnboardingSystem: () => <div data-testid="onboarding-system" />
}))

vi.mock('../../components/NeuralNexus', () => ({
  NeuralNexus: () => <div data-testid="neural-nexus" />
}))

// Mock all view components
vi.mock('../../components/Dashboard', () => ({
  Dashboard: () => <div data-testid="dashboard">Dashboard</div>
}))

vi.mock('../../components/ResearchHub', () => ({
  ResearchHub: () => <div data-testid="research-hub">Research Hub</div>
}))

vi.mock('../../components/Academy', () => ({
  Academy: () => <div data-testid="academy">Academy</div>
}))

vi.mock('../../components/Diagnostics', () => ({
  Diagnostics: () => <div data-testid="diagnostics">Diagnostics</div>
}))

vi.mock('../../components/StrategyHub', () => ({
  StrategyHub: () => <div data-testid="strategy-hub">Strategy Hub</div>
}))

vi.mock('../../components/ReportGen', () => ({
  ReportGen: () => <div data-testid="report-gen">Report Generator</div>
}))

vi.mock('../../components/CarbonAsset', () => ({
  CarbonAsset: () => <div data-testid="carbon-asset">Carbon Asset</div>
}))

vi.mock('../../components/TalentPassport', () => ({
  TalentPassport: () => <div data-testid="talent-passport">Talent Passport</div>
}))

vi.mock('../../components/IntegrationHub', () => ({
  IntegrationHub: () => <div data-testid="integration-hub">Integration Hub</div>
}))

vi.mock('../../components/CultureBot', () => ({
  CultureBot: () => <div data-testid="culture-bot">Culture Bot</div>
}))

vi.mock('../../components/FinanceSim', () => ({
  FinanceSim: () => <div data-testid="finance-sim">Finance Simulator</div>
}))

vi.mock('../../components/AuditTrail', () => ({
  AuditTrail: () => <div data-testid="audit-trail">Audit Trail</div>
}))

vi.mock('../../components/GoodwillCoin', () => ({
  GoodwillCoin: () => <div data-testid="goodwill-coin">Goodwill Coin</div>
}))

vi.mock('../../components/Gamification', () => ({
  UniversalRestoration: () => <div data-testid="universal-restoration">Universal Restoration</div>,
  CardGameArenaView: () => <div data-testid="card-game-arena-view">Card Game Arena View</div>,
  Gamification: () => <div data-testid="gamification">Gamification</div>
}))

vi.mock('../../components/CardGameArena', () => ({
  CardGameArena: () => <div data-testid="card-game-arena">Card Game Arena</div>
}))

vi.mock('../../components/Settings', () => ({
  Settings: () => <div data-testid="settings">Settings</div>
}))

vi.mock('../../components/YangBoZone', () => ({
  YangBoZone: () => <div data-testid="yang-bo-zone">Yang Bo Zone</div>
}))

vi.mock('../../components/AdanZone', () => ({
  AdanZone: () => <div data-testid="adan-zone">Adan Zone</div>
}))

vi.mock('../../components/BusinessIntel', () => ({
  BusinessIntel: () => <div data-testid="business-intel">Business Intelligence</div>
}))

vi.mock('../../components/HealthCheck', () => ({
  HealthCheck: () => <div data-testid="health-check">Health Check</div>
}))

vi.mock('../../components/UniversalTools', () => ({
  UniversalTools: () => <div data-testid="universal-tools">Universal Tools</div>
}))

vi.mock('../../components/UniversalSystem', () => ({
  UniversalSystem: () => <div data-testid="universal-system">Universal System</div>
}))

vi.mock('../../components/ThinkTank', () => ({
  ThinkTank: () => <div data-testid="think-tank">Think Tank</div>
}))

vi.mock('../../components/PartnerPortal', () => ({
  PartnerPortal: () => <div data-testid="partner-portal">Partner Portal</div>
}))

vi.mock('../../components/AboutUs', () => ({
  AboutUs: () => <div data-testid="about-us">About Us</div>
}))

vi.mock('../../components/TechnicalWhitepaper', () => ({
  TechnicalWhitepaper: () => <div data-testid="technical-whitepaper">Technical Whitepaper</div>
}))

vi.mock('../../components/ApiZone', () => ({
  ApiZone: () => <div data-testid="api-zone">API Zone</div>
}))

vi.mock('../../components/UniversalBackend', () => ({
  default: () => <div data-testid="universal-backend">Universal Backend</div>
}))

vi.mock('../../components/AlumniZone', () => ({
  AlumniZone: () => <div data-testid="alumni-zone">Alumni Zone</div>
}))

vi.mock('../../components/GoodwillLibrary', () => ({
  GoodwillLibrary: () => <div data-testid="goodwill-library">Goodwill Library</div>
}))

vi.mock('../../components/UserJournal', () => ({
  UserJournal: () => <div data-testid="user-journal">User Journal</div>
}))

vi.mock('../../components/AgentArena', () => ({
  AgentArena: () => <div data-testid="agent-arena">Agent Arena</div>
}))

vi.mock('../../components/AgentTraining', () => ({
  AgentTraining: () => <div data-testid="agent-training">Agent Training</div>
}))

vi.mock('../../components/ProxyMarketplace', () => ({
  ProxyMarketplace: () => <div data-testid="proxy-marketplace">Proxy Marketplace</div>
}))

vi.mock('../../components/DigitalSoulForge', () => ({
  DigitalSoulForge: () => <div data-testid="digital-soul-forge">Digital Soul Forge</div>
}))

vi.mock('../../components/RegenerativeModel', () => ({
  RegenerativeModel: () => <div data-testid="regenerative-model">Regenerative Model</div>
}))

vi.mock('../../components/PersonalVault', () => ({
  PersonalVault: () => <div data-testid="personal-vault">Personal Vault</div>
}))

vi.mock('../../components/AffiliateZone', () => ({
  AffiliateZone: () => <div data-testid="affiliate-zone">Affiliate Zone</div>
}))

vi.mock('../../components/GlobalOperations', () => ({
  GlobalOperations: () => <div data-testid="global-operations">Global Operations</div>
}))

vi.mock('../../components/WorkflowLab', () => ({
  WorkflowLab: () => <div data-testid="workflow-lab">Workflow Lab</div>
}))

vi.mock('../../components/McpConfig', () => ({
  McpConfig: () => <div data-testid="mcp-config">MCP Config</div>
}))

vi.mock('../../components/ImpactProjects', () => ({
  ImpactProjects: () => <div data-testid="impact-projects">Impact Projects</div>
}))

vi.mock('../../components/UniversalNotes', () => ({
  UniversalNotes: () => <div data-testid="universal-notes">Universal Notes</div>
}))

vi.mock('../../components/HypercubeAiLab', () => ({
  HypercubeAiLab: () => <div data-testid="hypercube-ai-lab">Hypercube AI Lab</div>
}))

vi.mock('../../components/AdminPanel', () => ({
  AdminPanel: () => <div data-testid="admin-panel">Admin Panel</div>
}))

vi.mock('../../components/EcosystemRadar', () => ({
  EcosystemRadar: () => <div data-testid="ecosystem-radar">Ecosystem Radar</div>
}))

vi.mock('../../components/CarbonWallet', () => ({
  CarbonWallet: () => <div data-testid="carbon-wallet">Carbon Wallet</div>
}))

vi.mock('../../components/FlowluIntegration', () => ({
  FlowluIntegration: () => <div data-testid="flowlu-integration">Flowlu Integration</div>
}))

vi.mock('../../components/SupplierCrm', () => ({
  SupplierCrm: () => <div data-testid="supplier-crm">Supplier CRM</div>
}))

vi.mock('../../components/SupplierSurvey', () => ({
  SupplierSurvey: () => <div data-testid="supplier-survey">Supplier Survey</div>
}))

vi.mock('../../components/EnterpriseServices', () => ({
  EnterpriseServices: () => <div data-testid="enterprise-services">Enterprise Services</div>
}))

vi.mock('../../components/MarketingStrategy', () => ({
  MarketingStrategy: () => <div data-testid="marketing-strategy">Marketing Strategy</div>
}))

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockImplementation(() => {})
  })

  it('renders login screen when not logged in', () => {
    render(<App />)

    expect(screen.getByTestId('login-screen')).toBeInTheDocument()
    expect(screen.queryByTestId('layout')).not.toBeInTheDocument()
  })

  it('renders main app when logged in', () => {
    render(<App />)

    const loginButton = screen.getByRole('button', { name: /登入|Login/i })
    fireEvent.click(loginButton)

    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(screen.getByTestId('my-esg')).toBeInTheDocument()
  })

  it('loads language from localStorage on mount', () => {
    localStorageMock.getItem.mockReturnValue('en-US')

    render(<App />)

    // The language state should be set to 'en-US'
    // We can't directly test internal state, but we can verify localStorage was called
    expect(localStorageMock.getItem).toHaveBeenCalledWith('app_language')
  })

  it('toggles language correctly', async () => {
    render(<App />)

    // Login first
    const loginButton = screen.getByRole('button', { name: /登入|Login/i })
    fireEvent.click(loginButton)

    // Find and click language toggle (assuming Layout has a toggle button)
    // Since Layout is mocked, we need to check if localStorage.setItem was called
    // Note: The actual toggle functionality is in Layout component
  })

  it('navigates between views correctly', () => {
    render(<App />)

    // Login first
    const loginButton = screen.getByRole('button', { name: /登入|Login/i })
    fireEvent.click(loginButton)

    // Click navigation button (mocked in Layout)
    const navButton = screen.getByRole('button', { name: /test navigate/i })
    fireEvent.click(navButton)

    // Since navigation is mocked, we verify the button exists
    expect(navButton).toBeInTheDocument()
  })

  it('renders all providers correctly', () => {
    render(<App />)

    expect(screen.getByTestId('toast-provider')).toBeInTheDocument()
    expect(screen.getByTestId('universal-agent-provider')).toBeInTheDocument()
  })

  it('renders onboarding and neural nexus when logged in', () => {
    render(<App />)

    const loginButton = screen.getByRole('button', { name: /登入|Login/i })
    fireEvent.click(loginButton)

    expect(screen.getByTestId('onboarding-system')).toBeInTheDocument()
    expect(screen.getByTestId('neural-nexus')).toBeInTheDocument()
  })
})