import { render, screen } from '@testing-library/react'
import { HypercubeAiLab } from '../../components/HypercubeAiLab'

// Mock contexts
vi.mock('../../contexts/ToastContext', () => ({
  useToast: () => ({
    addToast: vi.fn()
  })
}))

vi.mock('../../components/providers/CompanyProvider', () => ({
  useCompany: () => ({
    addNote: vi.fn()
  })
}))

vi.mock('../../services/ai-service', () => ({
  runMcpAction: vi.fn(),
  performWebSearch: vi.fn(),
  analyzeMedia: vi.fn(() => Promise.resolve('Test analysis result')),
  streamChat: vi.fn(),
  generateLegoImage: vi.fn(() => Promise.resolve('test-image-url'))
}))

vi.mock('../../services/evolutionEngine', () => ({
  universalIntelligence: {
    vitals$: { subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })) },
    triggerSynergy: vi.fn(),
    triggerEvolution: vi.fn()
  },
  SystemVital: {}
}))

vi.mock('marked', () => ({
  marked: {
    parse: vi.fn((text) => `<p>${text}</p>`)
  }
}))

describe('HypercubeAiLab Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn(() => JSON.stringify({ nodes: [] })),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn()
    }
  })

  it('renders the lab interface', () => {
    render(<HypercubeAiLab language="zh-TW" />)

    expect(screen.getByText('超立方指揮中心')).toBeInTheDocument()
    expect(screen.getByText('Manifestation_Wall')).toBeInTheDocument()
  })

  it('handles language switching', () => {
    const { rerender } = render(<HypercubeAiLab language="en" />)

    expect(screen.getByText('Hypercube Command')).toBeInTheDocument()

    rerender(<HypercubeAiLab language="zh-TW" />)
    expect(screen.getByText('超立方指揮中心')).toBeInTheDocument()
  })
})