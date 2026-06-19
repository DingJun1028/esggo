import { analyticsService } from '../../services/analytics'

describe('Analytics Service', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear()
    // Reset service state
    analyticsService['events'] = []
    analyticsService['abTests'] = []
  })

  it('should track page views', () => {
    analyticsService.trackPageView('Home')

    const events = analyticsService.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].eventType).toBe('page_view')
    expect(events[0].eventName).toBe('page_view')
    expect(events[0].properties.page).toBe('Home')
  })

  it('should track user clicks', () => {
    analyticsService.trackClick('button')

    const events = analyticsService.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].eventType).toBe('click')
    expect(events[0].eventName).toBe('element_click')
    expect(events[0].properties.element).toBe('button')
  })

  it('should track form submissions', () => {
    analyticsService.trackFormSubmit('contact')

    const events = analyticsService.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].eventType).toBe('form_submit')
    expect(events[0].eventName).toBe('form_submit')
    expect(events[0].properties.form).toBe('contact')
  })

  it('should create A/B tests', () => {
    const testId = analyticsService.createABTest({
      name: 'Test Experiment',
      description: 'Testing button color',
      variants: [
        { id: 'red', name: 'Red Button', weight: 50, users: 0, conversions: 0 },
        { id: 'blue', name: 'Blue Button', weight: 50, users: 0, conversions: 0 }
      ],
      startDate: Date.now(),
      endDate: Date.now() + 86400000
    })

    expect(testId).toBeDefined()
    const tests = analyticsService.getABTests()
    expect(tests).toHaveLength(1)
    expect(tests[0].name).toBe('Test Experiment')
  })

  it('should track ESG metrics', () => {
    analyticsService.trackESGMetrics({
      carbonReduction: 100,
      learningProgress: 25
    })

    const events = analyticsService.getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].eventType).toBe('engagement')
    expect(events[0].eventName).toBe('esg_metrics')
    expect(events[0].properties.carbonReduction).toBe(100)
    expect(events[0].properties.learningProgress).toBe(25)
  })
})