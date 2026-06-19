import { render, screen } from '@testing-library/react'
import { EnterpriseServices } from '../../components/EnterpriseServices'

// Mock all the hooks and contexts
vi.mock('../../hooks/useScalability', () => ({
  useResourcePreloader: () => ({ preloadResources: vi.fn() }),
  useVirtualScroll: () => ({}),
  useDebounce: () => vi.fn()
}))

vi.mock('../../services/scalability', () => ({
  globalCache: {}
}))

vi.mock('../../src/utils/security', () => ({
  SecurityUtils: {
    validateEmail: vi.fn(() => true),
    validateInputLength: vi.fn(() => true),
    sanitizeHtml: vi.fn((str) => str),
    generateCSRFToken: vi.fn(() => 'test-token')
  },
  ESGSecurityValidator: {
    validateESGData: vi.fn(() => ({ isValid: true, errors: [] }))
  }
}))

vi.mock('../../components/ui/EnhancedUI', () => ({
  EnhancedInput: ({ children, ...props }: any) => <input {...props} />,
  EnhancedSelect: ({ children, ...props }: any) => <select {...props}>{children}</select>,
  EnhancedButton: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  LoadingSpinner: () => <div>Loading...</div>
}))

describe('EnterpriseServices Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders overview by default', () => {
    render(<EnterpriseServices language="zh-TW" />)

    expect(screen.getByText('企業ESG服務')).toBeInTheDocument()
    expect(screen.getByText('協助企業永續轉型')).toBeInTheDocument()
  })

  it('displays service cards in overview', () => {
    render(<EnterpriseServices language="zh-TW" />)

    expect(screen.getByText('員工ESG訓練')).toBeInTheDocument()
    expect(screen.getByText('ESG成熟度評估')).toBeInTheDocument()
    expect(screen.getByText('企業ESG聯賽')).toBeInTheDocument()
    expect(screen.getByText('成效追蹤報告')).toBeInTheDocument()
  })

  it('handles language switching', () => {
    const { rerender } = render(<EnterpriseServices language="en" />)

    expect(screen.getByText('Enterprise ESG Services')).toBeInTheDocument()

    rerender(<EnterpriseServices language="zh-TW" />)
    expect(screen.getByText('企業ESG服務')).toBeInTheDocument()
  })
})