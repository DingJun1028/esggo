import { monitoringService } from '../../services/monitoring'

describe('Monitoring Service', () => {
  beforeEach(() => {
    // Clear events
    monitoringService['events'] = []
    monitoringService['metrics'] = {}
  })

  it('should track events', () => {
    monitoringService.trackEvent('user_action', 'button_click', { buttonId: 'submit' })

    const events = monitoringService.getRecentEvents()
    expect(events).toHaveLength(1)
    expect(events[0].type).toBe('user_action')
    expect(events[0].action).toBe('button_click')
    expect(events[0].data.buttonId).toBe('submit')
  })

  it('should track errors', () => {
    const testError = new Error('Test error')
    monitoringService.trackError('javascript_error', {
      message: testError.message,
      stack: testError.stack
    })

    const events = monitoringService.getRecentEvents()
    expect(events).toHaveLength(1)
    expect(events[0].type).toBe('error')
    expect(events[0].action).toBe('javascript_error')
    expect(events[0].data.message).toBe('Test error')
  })

  it('should record performance metrics', () => {
    monitoringService.recordMetric('LCP', 1200)

    const metrics = monitoringService.getPerformanceMetrics()
    expect(metrics.LCP).toBe(1200)
  })

  it('should track API calls', () => {
    monitoringService.trackApiCall('/api/data', 'GET', 500, 200)

    const events = monitoringService.getRecentEvents()
    expect(events).toHaveLength(1)
    expect(events[0].type).toBe('performance')
    expect(events[0].action).toBe('api_call')
    expect(events[0].data.endpoint).toBe('/api/data')
    expect(events[0].data.method).toBe('GET')
    expect(events[0].data.duration).toBe(500)
    expect(events[0].data.status).toBe(200)
    expect(events[0].data.success).toBe(true)
  })

  it('should track user actions', () => {
    monitoringService.trackUserAction('navigation', { from: 'home', to: 'about' })

    const events = monitoringService.getRecentEvents()
    expect(events).toHaveLength(1)
    expect(events[0].type).toBe('user_action')
    expect(events[0].action).toBe('navigation')
    expect(events[0].data.from).toBe('home')
    expect(events[0].data.to).toBe('about')
  })

  it('should track security events', () => {
    monitoringService.trackSecurityEvent('login_attempt', {
      ip: '192.168.1.1',
      success: false
    })

    const events = monitoringService.getRecentEvents()
    expect(events).toHaveLength(1)
    expect(events[0].type).toBe('security')
    expect(events[0].action).toBe('login_attempt')
    expect(events[0].data.ip).toBe('192.168.1.1')
    expect(events[0].data.success).toBe(false)
  })
})