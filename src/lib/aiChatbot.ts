export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    intent?: string
    confidence?: number
    entities?: Record<string, any>
    context?: ChatContext
  }
}

export interface ChatContext {
  userId?: string
  sessionId: string
  userProfile?: {
    name?: string
    age?: number
    income?: number
    existingLoans?: number
    creditScore?: 'excellent' | 'good' | 'fair' | 'poor'
    loanPurpose?: string
    preferredLanguage: 'no' | 'en'
  }
  conversationHistory: ChatMessage[]
  currentTopic?: 'loans' | 'savings' | 'investments' | 'insurance' | 'general'
  lastActivity: Date
}

export interface AIResponse {
  message: string
  intent: string
  confidence: number
  suggestedActions?: Array<{
    type: 'navigate' | 'calculate' | 'apply' | 'learn_more'
    label: string
    data?: any
  }>
  quickReplies?: string[]
}

// Norwegian financial knowledge base
export const NORWEGIAN_FINANCIAL_KNOWLEDGE = {
  loanTypes: {
    forbrukslån: {
      name: 'Forbrukslån',
      description: 'Usikret lån for private formål som bil, renovering, eller refinansiering',
      typicalRate: '5-25%',
      maxAmount: '2,000,000 NOK',
      requirements: ['Fast inntekt', 'Norsk personnummer', 'Minimum 18 år']
    },
    boliglån: {
      name: 'Boliglån',
      description: 'Sikret lån for kjøp av bolig med pant i eiendommen',
      typicalRate: '3-6%',
      maxAmount: '85% av boligverdi',
      requirements: ['Egenkapital minimum 15%', 'Stabil inntekt', 'Gjeldsgrad under 5x årsinntekt']
    },
    kredittkort: {
      name: 'Kredittkort',
      description: 'Revolving credit for daglige kjøp og kortere finansiering',
      typicalRate: '15-30%',
      maxAmount: '500,000 NOK',
      requirements: ['Fast inntekt', 'God kredittverdighet']
    }
  },
  
  regulations: {
    gjeldsgrad: {
      description: 'Maksimal gjeldsgrad er 5 ganger årsinntekt',
      authority: 'Finanstilsynet',
      exceptions: ['Første boligkjøp i Oslo kan ha høyere gjeldsgrad']
    },
    renteregulering: {
      description: 'Norges Bank setter styringsrenten som påvirker lånerenter',
      currentTrend: 'Økende renter i 2023-2024'
    }
  },

  banks: {
    'bank-norwegian': {
      name: 'Bank Norwegian',
      specialties: ['Forbrukslån', 'Kredittkort'],
      reputation: 'Konkurransedyktige renter, god kundeservice',
      pros: ['Ingen etableringsgebyr', 'Rask behandling'],
      cons: ['Begrenset produktutvalg']
    },
    'nordax': {
      name: 'Nordax Bank',
      specialties: ['Forbrukslån', 'Refinansiering'],
      reputation: 'Fleksible vilkår, aksepterer kunder med varierende kredittverdighet',
      pros: ['Fleksible krav', 'Personlig service'],
      cons: ['Høyere renter for høyrisiko kunder']
    }
  }
}

// Intent classification patterns
export const INTENT_PATTERNS = {
  loan_inquiry: [
    /(?:trenger|vil ha|søker|leter etter).*(lån|kredit)/i,
    /(?:hvor mye|kan jeg|låne)/i,
    /(?:rente|rentesats|prosent)/i
  ],
  loan_comparison: [
    /(?:sammenlign|beste|billigste).*(lån|bank)/i,
    /(?:hvilken bank|hvor skal jeg)/i,
    /(?:anbefal|foreslå|tips)/i
  ],
  calculation: [
    /(?:beregn|kalkuler|regn ut)/i,
    /(?:månedlig|avdrag|totalkostnad)/i,
    /(?:kalkulator|utregning)/i
  ],
  application_help: [
    /(?:søke|søknad|apply)/i,
    /(?:dokumenter|papirer|krav)/i,
    /(?:hvordan|prosess|steg)/i
  ],
  general_advice: [
    /(?:råd|tips|hjelp|veiledning)/i,
    /(?:økonomi|finans|penger)/i,
    /(?:spare|investere|budsjett)/i
  ]
}

export class FinanceGPTChatbot {
  private context: ChatContext
  private knowledgeBase = NORWEGIAN_FINANCIAL_KNOWLEDGE

  constructor(sessionId: string, userProfile?: ChatContext['userProfile']) {
    this.context = {
      sessionId,
      userProfile,
      conversationHistory: [],
      lastActivity: new Date(),
      currentTopic: 'general'
    }
  }

  async processMessage(userMessage: string): Promise<AIResponse> {
    const message: ChatMessage = {
      id: this.generateMessageId(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }

    // Add to conversation history
    this.context.conversationHistory.push(message)
    this.context.lastActivity = new Date()

    // Classify intent
    const intent = this.classifyIntent(userMessage)
    const confidence = this.calculateConfidence(userMessage, intent)

    // Generate response based on intent
    const response = await this.generateResponse(userMessage, intent, confidence)

    // Add assistant response to history
    const assistantMessage: ChatMessage = {
      id: this.generateMessageId(),
      role: 'assistant',
      content: response.message,
      timestamp: new Date(),
      metadata: {
        intent,
        confidence,
        context: { ...this.context }
      }
    }

    this.context.conversationHistory.push(assistantMessage)

    return response
  }

  private classifyIntent(message: string): string {
    const normalizedMessage = message.toLowerCase()

    for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(normalizedMessage)) {
          return intent
        }
      }
    }

    return 'general'
  }

  private calculateConfidence(message: string, intent: string): number {
    // Simple confidence calculation based on keyword matches
    const patterns = INTENT_PATTERNS[intent as keyof typeof INTENT_PATTERNS] || []
    const matches = patterns.filter(pattern => pattern.test(message.toLowerCase()))
    return Math.min(0.9, 0.3 + (matches.length * 0.2))
  }

  private async generateResponse(message: string, intent: string, confidence: number): Promise<AIResponse> {
    const language = this.context.userProfile?.preferredLanguage || 'no'
    
    switch (intent) {
      case 'loan_inquiry':
        return this.handleLoanInquiry(message, language)
      
      case 'loan_comparison':
        return this.handleLoanComparison(message, language)
      
      case 'calculation':
        return this.handleCalculation(message, language)
      
      case 'application_help':
        return this.handleApplicationHelp(message, language)
      
      case 'general_advice':
        return this.handleGeneralAdvice(message, language)
      
      default:
        return this.handleGeneral(message, language)
    }
  }

  private handleLoanInquiry(message: string, language: 'no' | 'en'): AIResponse {
    const responses = {
      no: {
        message: `Jeg kan hjelpe deg med å finne det beste lånet! 🏦

Basert på din forespørsel kan jeg anbefale:

**Forbrukslån** - For bil, renovering, eller refinansiering
• Renter fra 5.9% (Bank Norwegian)
• Opptil 2 millioner kroner
• Ingen sikkerhet kreves

**Boliglån** - For kjøp av bolig
• Renter fra 3.5%
• Opptil 85% av boligverdi
• Krever egenkapital

Vil du at jeg skal hjelpe deg med å sammenligne alternativer basert på din situasjon?`,
        quickReplies: [
          'Sammenlign forbrukslån',
          'Se boliglån',
          'Beregn månedlige avdrag',
          'Hva trenger jeg for å søke?'
        ]
      },
      en: {
        message: `I can help you find the best loan! 🏦

Based on your inquiry, I can recommend:

**Consumer Loans** - For cars, renovation, or refinancing
• Rates from 5.9% (Bank Norwegian)
• Up to 2 million NOK
• No collateral required

**Mortgage Loans** - For home purchases
• Rates from 3.5%
• Up to 85% of property value
• Requires down payment

Would you like me to help you compare options based on your situation?`,
        quickReplies: [
          'Compare consumer loans',
          'View mortgages',
          'Calculate monthly payments',
          'What do I need to apply?'
        ]
      }
    }

    return {
      message: responses[language].message,
      intent: 'loan_inquiry',
      confidence: 0.9,
      suggestedActions: [
        {
          type: 'navigate',
          label: language === 'no' ? 'Start sammenligning' : 'Start comparison',
          data: { route: '/quiz' }
        },
        {
          type: 'calculate',
          label: language === 'no' ? 'Åpne kalkulator' : 'Open calculator',
          data: { route: '/kalkulator' }
        }
      ],
      quickReplies: responses[language].quickReplies
    }
  }

  private handleLoanComparison(message: string, language: 'no' | 'en'): AIResponse {
    const userProfile = this.context.userProfile
    const responses = {
      no: {
        message: `La meg hjelpe deg med å sammenligne lån! 📊

**Topp 3 anbefalinger for deg:**

🥇 **Bank Norwegian** - 5.9% rente
• Ingen etableringsgebyr
• Rask behandling (24-48 timer)
• Opptil 500.000 kr

🥈 **Nordax Bank** - 6.4% rente  
• Fleksible vilkår
• Aksepterer varierende kredittverdighet
• Opptil 600.000 kr

🥉 **Instabank** - 7.1% rente
• Digital søknadsprosess
• Svar på minutter
• Opptil 500.000 kr

${userProfile?.income ? `Basert på din inntekt på ${userProfile.income} kr kan du låne opptil ${Math.floor(userProfile.income * 5).toLocaleString()} kr.` : ''}`,
        quickReplies: [
          'Søk hos Bank Norwegian',
          'Se alle detaljer',
          'Beregn mine avdrag',
          'Hva påvirker renten?'
        ]
      },
      en: {
        message: `Let me help you compare loans! 📊

**Top 3 recommendations for you:**

🥇 **Bank Norwegian** - 5.9% rate
• No establishment fee
• Fast processing (24-48 hours)
• Up to 500,000 NOK

🥈 **Nordax Bank** - 6.4% rate
• Flexible terms
• Accepts varying creditworthiness
• Up to 600,000 NOK

🥉 **Instabank** - 7.1% rate
• Digital application process
• Response in minutes
• Up to 500,000 NOK

${userProfile?.income ? `Based on your income of ${userProfile.income} NOK, you can borrow up to ${Math.floor(userProfile.income * 5).toLocaleString()} NOK.` : ''}`,
        quickReplies: [
          'Apply at Bank Norwegian',
          'See all details',
          'Calculate my payments',
          'What affects the rate?'
        ]
      }
    }

    return {
      message: responses[language].message,
      intent: 'loan_comparison',
      confidence: 0.85,
      suggestedActions: [
        {
          type: 'navigate',
          label: language === 'no' ? 'Se detaljert sammenligning' : 'View detailed comparison',
          data: { route: '/resultater' }
        }
      ],
      quickReplies: responses[language].quickReplies
    }
  }

  private handleCalculation(message: string, language: 'no' | 'en'): AIResponse {
    const responses = {
      no: {
        message: `Jeg kan hjelpe deg med å beregne lånekostnader! 🧮

**Lånekalkulator:**
• Månedlige avdrag
• Totalkostnad over låneperioden
• Effektiv rente (inkl. alle gebyrer)
• Sammenligning av ulike scenarier

**Eksempel:** 
Lån på 200.000 kr over 5 år:
• Bank Norwegian (5.9%): 3.831 kr/mnd
• Nordax (6.4%): 3.901 kr/mnd
• Forskjell: 4.200 kr over 5 år

Vil du bruke kalkulatoren for dine tall?`,
        quickReplies: [
          'Åpne kalkulator',
          'Beregn 300.000 kr',
          'Sammenlign 3 vs 5 år',
          'Hva koster etablering?'
        ]
      },
      en: {
        message: `I can help you calculate loan costs! 🧮

**Loan Calculator:**
• Monthly payments
• Total cost over loan period
• Effective rate (incl. all fees)
• Comparison of different scenarios

**Example:**
200,000 NOK loan over 5 years:
• Bank Norwegian (5.9%): 3,831 NOK/month
• Nordax (6.4%): 3,901 NOK/month
• Difference: 4,200 NOK over 5 years

Would you like to use the calculator for your numbers?`,
        quickReplies: [
          'Open calculator',
          'Calculate 300,000 NOK',
          'Compare 3 vs 5 years',
          'What does setup cost?'
        ]
      }
    }

    return {
      message: responses[language].message,
      intent: 'calculation',
      confidence: 0.8,
      suggestedActions: [
        {
          type: 'navigate',
          label: language === 'no' ? 'Åpne lånekalkulator' : 'Open loan calculator',
          data: { route: '/kalkulator' }
        }
      ],
      quickReplies: responses[language].quickReplies
    }
  }

  private handleApplicationHelp(message: string, language: 'no' | 'en'): AIResponse {
    const responses = {
      no: {
        message: `Jeg hjelper deg gjennom søknadsprosessen! 📋

**Dokumenter du trenger:**
✅ Gyldig ID (pass/førerkort)
✅ Siste 3 lønnslipper
✅ Skattemelding (siste år)
✅ Kontoutskrift (siste 3 måneder)
✅ Oversikt over eksisterende gjeld

**Søknadsprosess:**
1. **Forhåndsgodkjenning** (2-24 timer)
2. **Dokumentinnsending** (digitalt)
3. **Kredittvurdering** (1-3 dager)
4. **Endelig godkjenning** (samme dag)
5. **Utbetaling** (1-2 dager)

**Tips for bedre godkjenning:**
• Ha stabil inntekt i 6+ måneder
• Betal ned eksisterende gjeld
• Unngå nye kredittforespørsler`,
        quickReplies: [
          'Start søknad nå',
          'Sjekk mine sjanser',
          'Hva hvis jeg blir avslått?',
          'Kan jeg søke flere steder?'
        ]
      },
      en: {
        message: `I'll guide you through the application process! 📋

**Documents you need:**
✅ Valid ID (passport/driver's license)
✅ Last 3 pay slips
✅ Tax return (last year)
✅ Bank statement (last 3 months)
✅ Overview of existing debt

**Application process:**
1. **Pre-approval** (2-24 hours)
2. **Document submission** (digital)
3. **Credit assessment** (1-3 days)
4. **Final approval** (same day)
5. **Disbursement** (1-2 days)

**Tips for better approval:**
• Have stable income for 6+ months
• Pay down existing debt
• Avoid new credit inquiries`,
        quickReplies: [
          'Start application now',
          'Check my chances',
          'What if I get rejected?',
          'Can I apply multiple places?'
        ]
      }
    }

    return {
      message: responses[language].message,
      intent: 'application_help',
      confidence: 0.75,
      suggestedActions: [
        {
          type: 'navigate',
          label: language === 'no' ? 'Start søknad' : 'Start application',
          data: { route: '/quiz' }
        }
      ],
      quickReplies: responses[language].quickReplies
    }
  }

  private handleGeneralAdvice(message: string, language: 'no' | 'en'): AIResponse {
    const responses = {
      no: {
        message: `Jeg er her for å hjelpe med dine finansielle spørsmål! 💡

**Populære råd:**

**💰 Lånestrategi:**
• Sammenlign alltid flere tilbud
• Fokuser på totalkostnad, ikke bare rente
• Vurder kortere løpetid for å spare renter

**📊 Økonomisk helse:**
• Hold gjeldsgrad under 4x årsinntekt
• Bygg opp bufferkonto (3-6 måneder utgifter)
• Refinansier når renten faller

**🎯 Smart låning:**
• Bruk forbrukslån til verdiskapende investeringer
• Unngå å låne til forbruk du ikke trenger
• Betal ekstra avdrag når du kan

Hva vil du vite mer om?`,
        quickReplies: [
          'Refinansieringstips',
          'Hvordan forbedre kredittscore',
          'Gjeldskonsolidering',
          'Spare vs betale ned lån'
        ]
      },
      en: {
        message: `I'm here to help with your financial questions! 💡

**Popular advice:**

**💰 Loan Strategy:**
• Always compare multiple offers
• Focus on total cost, not just interest rate
• Consider shorter terms to save on interest

**📊 Financial Health:**
• Keep debt ratio under 4x annual income
• Build emergency fund (3-6 months expenses)
• Refinance when rates drop

**🎯 Smart Borrowing:**
• Use consumer loans for value-creating investments
• Avoid borrowing for unnecessary consumption
• Make extra payments when possible

What would you like to know more about?`,
        quickReplies: [
          'Refinancing tips',
          'How to improve credit score',
          'Debt consolidation',
          'Save vs pay down loans'
        ]
      }
    }

    return {
      message: responses[language].message,
      intent: 'general_advice',
      confidence: 0.7,
      quickReplies: responses[language].quickReplies
    }
  }

  private handleGeneral(message: string, language: 'no' | 'en'): AIResponse {
    const responses = {
      no: {
        message: `Hei! Jeg er FinanceGPT, din personlige finansrådgiver! 👋

Jeg kan hjelpe deg med:
• 🏦 Finne det beste lånet for din situasjon
• 📊 Sammenligne renter og vilkår fra norske banker
• 🧮 Beregne månedlige avdrag og totalkostnader
• 📋 Veilede deg gjennom søknadsprosessen
• 💡 Gi personlige finansielle råd

Hva kan jeg hjelpe deg med i dag?`,
        quickReplies: [
          'Jeg trenger et lån',
          'Sammenlign banker',
          'Beregn lånekostnader',
          'Finansielle råd'
        ]
      },
      en: {
        message: `Hi! I'm FinanceGPT, your personal financial advisor! 👋

I can help you with:
• 🏦 Finding the best loan for your situation
• 📊 Comparing rates and terms from Norwegian banks
• 🧮 Calculating monthly payments and total costs
• 📋 Guiding you through the application process
• 💡 Providing personal financial advice

What can I help you with today?`,
        quickReplies: [
          'I need a loan',
          'Compare banks',
          'Calculate loan costs',
          'Financial advice'
        ]
      }
    }

    return {
      message: responses[language].message,
      intent: 'general',
      confidence: 0.5,
      quickReplies: responses[language].quickReplies
    }
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Public methods for context management
  public updateUserProfile(profile: Partial<ChatContext['userProfile']>): void {
    this.context.userProfile = {
      preferredLanguage: 'no',
      ...this.context.userProfile,
      ...profile
    }
  }

  public getContext(): ChatContext {
    return { ...this.context }
  }

  public clearHistory(): void {
    this.context.conversationHistory = []
  }

  public setLanguage(language: 'no' | 'en'): void {
    if (!this.context.userProfile) {
      this.context.userProfile = { preferredLanguage: language }
    } else {
      this.context.userProfile.preferredLanguage = language
    }
  }
}

// Utility functions for integration
export function createChatbotInstance(sessionId: string, userProfile?: ChatContext['userProfile']): FinanceGPTChatbot {
  return new FinanceGPTChatbot(sessionId, userProfile)
}

export function formatCurrency(amount: number, currency: string = 'NOK'): string {
  return new Intl.NumberFormat('no-NO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function calculateMonthlyPayment(principal: number, rate: number, years: number): number {
  const monthlyRate = rate / 100 / 12
  const numberOfPayments = years * 12
  
  if (monthlyRate === 0) return principal / numberOfPayments
  
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
         (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
}