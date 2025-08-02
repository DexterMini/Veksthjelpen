export interface AnalyticsEvent {
  event: string
  properties: Record<string, any>
  timestamp: Date
  userId?: string
  sessionId: string
}

export interface ConversionEvent {
  bankName: string
  loanAmount: number
  estimatedRate: number
  commission: number
  quizData: any
}

class AnalyticsService {
  private sessionId: string
  private events: AnalyticsEvent[] = []

  constructor() {
    this.sessionId = this.generateSessionId()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private track(event: string, properties: Record<string, any> = {}) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: new Date(),
      sessionId: this.sessionId
    }

    this.events.push(analyticsEvent)

    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, {
        custom_parameter_1: properties.bankName,
        custom_parameter_2: properties.loanAmount,
        session_id: this.sessionId,
        ...properties
      })
    }

    // Store in localStorage for later batch sending
    this.storeEvent(analyticsEvent)
  }

  private storeEvent(event: AnalyticsEvent) {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('analytics_events') || '[]'
        const events = JSON.parse(stored)
        events.push(event)
        
        // Keep only last 100 events
        if (events.length > 100) {
          events.splice(0, events.length - 100)
        }
        
        localStorage.setItem('analytics_events', JSON.stringify(events))
      } catch (error) {
        console.warn('Failed to store analytics event:', error)
      }
    }
  }

  // Quiz tracking
  trackQuizStart() {
    this.track('quiz_started', {
      page: 'quiz',
      step: 1
    })
  }

  trackQuizStep(step: number, answer: string, question: string) {
    this.track('quiz_step_completed', {
      step,
      question,
      answer,
      page: 'quiz'
    })
  }

  trackQuizCompleted(quizData: any) {
    this.track('quiz_completed', {
      ...quizData,
      page: 'quiz'
    })
  }

  // Results tracking
  trackResultsViewed(recommendations: any[]) {
    this.track('results_viewed', {
      page: 'results',
      num_recommendations: recommendations.length,
      top_bank: recommendations[0]?.bank?.bankName,
      top_rate: recommendations[0]?.estimatedRate
    })
  }

  trackLoanDetailsViewed(bankName: string, loanAmount: number, rate: number) {
    this.track('loan_details_viewed', {
      bankName,
      loanAmount,
      rate,
      page: 'results'
    })
  }

  // Conversion tracking - most important for affiliate revenue
  trackConversion(conversionData: ConversionEvent) {
    this.track('loan_application_started', {
      ...conversionData,
      page: 'results',
      conversion_value: conversionData.commission
    })

    // Also send to affiliate tracking systems
    this.sendAffiliateConversion(conversionData)
  }

  private sendAffiliateConversion(data: ConversionEvent) {
    // This would integrate with affiliate networks like Adservice, Financer etc.
    if (typeof window !== 'undefined') {
      try {
        // Example: Send to affiliate tracking pixel
        const trackingPixel = new Image()
        trackingPixel.src = `https://tracking.adservice.no/conversion?` +
          `bank=${encodeURIComponent(data.bankName)}&` +
          `amount=${data.loanAmount}&` +
          `rate=${data.estimatedRate}&` +
          `session=${this.sessionId}&` +
          `timestamp=${Date.now()}`
        
        // Store conversion for internal tracking
        const conversion = {
          ...data,
          sessionId: this.sessionId,
          timestamp: new Date().toISOString()
        }
        
        const conversions = JSON.parse(localStorage.getItem('conversions') || '[]')
        conversions.push(conversion)
        localStorage.setItem('conversions', JSON.stringify(conversions))
        
      } catch (error) {
        console.warn('Failed to send affiliate conversion:', error)
      }
    }
  }

  // Calculator tracking
  trackCalculatorUsed(loanAmount: number, rate: number, term: number) {
    this.track('calculator_used', {
      loanAmount,
      rate,
      term,
      page: 'calculator'
    })
  }

  // Page tracking
  trackPageView(page: string, additionalData: Record<string, any> = {}) {
    this.track('page_view', {
      page,
      url: typeof window !== 'undefined' ? window.location.href : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      ...additionalData
    })
  }

  // Get stored events for batch sending
  getStoredEvents(): AnalyticsEvent[] {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('analytics_events') || '[]'
        return JSON.parse(stored)
      } catch (error) {
        console.warn('Failed to retrieve stored events:', error)
        return []
      }
    }
    return []
  }

  // Clear stored events (after successful batch send)
  clearStoredEvents() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('analytics_events')
    }
  }

  // Send batch events to server
  async sendBatchEvents() {
    const events = this.getStoredEvents()
    if (events.length === 0) return

    try {
      // This would send to your analytics backend
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ events })
      })

      if (response.ok) {
        this.clearStoredEvents()
      }
    } catch (error) {
      console.warn('Failed to send batch events:', error)
    }
  }
}

// Singleton instance
export const analytics = new AnalyticsService()

// GDPR compliance utilities
export class GDPRService {
  private consentKey = 'gdpr_consent'
  private consentTimestampKey = 'gdpr_consent_timestamp'

  hasConsent(): boolean {
    if (typeof window === 'undefined') return false
    
    const consent = localStorage.getItem(this.consentKey)
    const timestamp = localStorage.getItem(this.consentTimestampKey)
    
    if (!consent || !timestamp) return false
    
    // Check if consent is still valid (1 year)
    const consentDate = new Date(timestamp)
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    
    return consentDate > oneYearAgo && consent === 'accepted'
  }

  giveConsent() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.consentKey, 'accepted')
      localStorage.setItem(this.consentTimestampKey, new Date().toISOString())
    }
  }

  revokeConsent() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.consentKey)
      localStorage.removeItem(this.consentTimestampKey)
      localStorage.removeItem('analytics_events')
      localStorage.removeItem('conversions')
    }
  }

  getConsentStatus() {
    return {
      hasConsent: this.hasConsent(),
      timestamp: typeof window !== 'undefined' ? 
        localStorage.getItem(this.consentTimestampKey) : null
    }
  }
}

export const gdpr = new GDPRService()