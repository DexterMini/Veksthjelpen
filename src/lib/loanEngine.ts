export interface QuizData {
  loanAmount: string
  loanPurpose: string
  monthlyIncome: string
  existingDebt: string
  employmentStatus: string
  housingStatus: string
  creditHistory: string
}

export interface BankProduct {
  id: string
  bankName: string
  productName: string
  minAmount: number
  maxAmount: number
  minRate: number
  maxRate: number
  establishmentFee: number
  features: string[]
  requirements: {
    minIncome: number
    maxDebtRatio: number
    employmentTypes: string[]
    creditRequirement: string[]
  }
  affiliateUrl: string
  commission: number
}

export interface LoanRecommendation {
  bank: BankProduct
  estimatedRate: number
  monthlyPayment: number
  totalCost: number
  matchScore: number
  recommended: boolean
}

// Norwegian bank products database
export const bankProducts: BankProduct[] = [
  {
    id: 'bank-norwegian-forbruk',
    bankName: 'Bank Norwegian',
    productName: 'Forbrukslån',
    minAmount: 50000,
    maxAmount: 500000,
    minRate: 5.9,
    maxRate: 19.9,
    establishmentFee: 0,
    features: [
      'Ingen etableringsgebyr',
      'Fleksible nedbetalinger',
      'Tidlig innfrielse uten gebyr',
      'Rask behandling'
    ],
    requirements: {
      minIncome: 250000,
      maxDebtRatio: 0.4,
      employmentTypes: ['Fast ansatt', 'Selvstendig næringsdrivende'],
      creditRequirement: ['Meget god', 'God', 'Middels']
    },
    affiliateUrl: 'https://banknorwegian.no/?ref=lansammenligning',
    commission: 800
  },
  {
    id: 'nordax-forbruk',
    bankName: 'Nordax Bank',
    productName: 'Forbrukslån',
    minAmount: 30000,
    maxAmount: 600000,
    minRate: 6.4,
    maxRate: 22.9,
    establishmentFee: 1500,
    features: [
      'Rask behandling',
      'Konkurransedyktige renter',
      'Personlig service',
      'Fleksible vilkår'
    ],
    requirements: {
      minIncome: 200000,
      maxDebtRatio: 0.45,
      employmentTypes: ['Fast ansatt', 'Midlertidig ansatt', 'Selvstendig næringsdrivende'],
      creditRequirement: ['Meget god', 'God', 'Middels']
    },
    affiliateUrl: 'https://nordax.no/?ref=lansammenligning',
    commission: 600
  },
  {
    id: 'instabank-forbruk',
    bankName: 'Instabank',
    productName: 'Forbrukslån',
    minAmount: 25000,
    maxAmount: 500000,
    minRate: 7.1,
    maxRate: 24.9,
    establishmentFee: 2000,
    features: [
      'Digital søknadsprosess',
      'Svar på minutter',
      'Fleksible vilkår',
      'Ingen skjulte kostnader'
    ],
    requirements: {
      minIncome: 180000,
      maxDebtRatio: 0.5,
      employmentTypes: ['Fast ansatt', 'Midlertidig ansatt', 'Selvstendig næringsdrivende', 'Pensjonist'],
      creditRequirement: ['Meget god', 'God', 'Middels', 'Dårlig']
    },
    affiliateUrl: 'https://instabank.no/?ref=lansammenligning',
    commission: 500
  },
  {
    id: 'komplett-forbruk',
    bankName: 'Komplett Bank',
    productName: 'Forbrukslån',
    minAmount: 50000,
    maxAmount: 400000,
    minRate: 6.9,
    maxRate: 21.9,
    establishmentFee: 1000,
    features: [
      'Norsk kundeservice',
      'Ingen bindingstid',
      'Gratis refinansiering',
      'Transparent prising'
    ],
    requirements: {
      minIncome: 300000,
      maxDebtRatio: 0.35,
      employmentTypes: ['Fast ansatt'],
      creditRequirement: ['Meget god', 'God']
    },
    affiliateUrl: 'https://komplettbank.no/?ref=lansammenligning',
    commission: 700
  },
  {
    id: 'santander-forbruk',
    bankName: 'Santander Consumer Bank',
    productName: 'Forbrukslån',
    minAmount: 20000,
    maxAmount: 600000,
    minRate: 8.2,
    maxRate: 25.9,
    establishmentFee: 2500,
    features: [
      'Fleksible nedbetalinger',
      'Mulighet for betalingsfri periode',
      'Refinansieringsmuligheter',
      'Erfaren långiver'
    ],
    requirements: {
      minIncome: 150000,
      maxDebtRatio: 0.55,
      employmentTypes: ['Fast ansatt', 'Midlertidig ansatt', 'Selvstendig næringsdrivende', 'Pensjonist'],
      creditRequirement: ['Meget god', 'God', 'Middels', 'Dårlig']
    },
    affiliateUrl: 'https://santanderconsumer.no/?ref=lansammenligning',
    commission: 400
  }
]

// Loan recommendation engine
export class LoanRecommendationEngine {
  private parseAmount(amountString: string): number {
    const match = amountString.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      return parseInt(match[1].replace('.', '')) * 1000;
    }
    return 200000; // Default
  }

  private parseIncome(incomeString: string): number {
    if (incomeString.includes('Under 300.000')) return 250000;
    if (incomeString.includes('300.000 - 500.000')) return 400000;
    if (incomeString.includes('500.000 - 700.000')) return 600000;
    if (incomeString.includes('700.000 - 1.000.000')) return 850000;
    if (incomeString.includes('Over 1.000.000')) return 1200000;
    return 400000; // Default
  }

  private parseDebt(debtString: string): number {
    if (debtString.includes('Ingen gjeld')) return 0;
    if (debtString.includes('Under 100.000')) return 50000;
    if (debtString.includes('100.000 - 300.000')) return 200000;
    if (debtString.includes('300.000 - 500.000')) return 400000;
    if (debtString.includes('Over 500.000')) return 600000;
    return 0; // Default
  }

  private calculateMatchScore(bank: BankProduct, quizData: QuizData): number {
    let score = 0;
    const loanAmount = this.parseAmount(quizData.loanAmount);
    const income = this.parseIncome(quizData.monthlyIncome);
    const debt = this.parseDebt(quizData.existingDebt);
    const debtRatio = debt / income;

    // Amount compatibility (30 points)
    if (loanAmount >= bank.minAmount && loanAmount <= bank.maxAmount) {
      score += 30;
    } else if (loanAmount < bank.minAmount) {
      score += Math.max(0, 30 - (bank.minAmount - loanAmount) / 10000);
    }

    // Income requirement (25 points)
    if (income >= bank.requirements.minIncome) {
      score += 25;
    } else {
      score += Math.max(0, 25 - (bank.requirements.minIncome - income) / 10000);
    }

    // Debt ratio (20 points)
    if (debtRatio <= bank.requirements.maxDebtRatio) {
      score += 20;
    } else {
      score += Math.max(0, 20 - (debtRatio - bank.requirements.maxDebtRatio) * 100);
    }

    // Employment status (15 points)
    if (bank.requirements.employmentTypes.includes(quizData.employmentStatus)) {
      score += 15;
    }

    // Credit history (10 points)
    if (bank.requirements.creditRequirement.includes(quizData.creditHistory)) {
      score += 10;
    }

    return Math.min(100, Math.max(0, score));
  }

  private estimateInterestRate(bank: BankProduct, quizData: QuizData, matchScore: number): number {
    const baseRate = bank.minRate;
    const rateSpread = bank.maxRate - bank.minRate;
    
    // Better match score = lower rate
    const scoreMultiplier = (100 - matchScore) / 100;
    const estimatedRate = baseRate + (rateSpread * scoreMultiplier);
    
    // Credit history adjustment
    let creditAdjustment = 0;
    switch (quizData.creditHistory) {
      case 'Meget god': creditAdjustment = -0.5; break;
      case 'God': creditAdjustment = 0; break;
      case 'Middels': creditAdjustment = 1.0; break;
      case 'Dårlig': creditAdjustment = 2.5; break;
      case 'Har betalingsanmerkninger': creditAdjustment = 4.0; break;
    }

    return Math.min(bank.maxRate, Math.max(bank.minRate, estimatedRate + creditAdjustment));
  }

  private calculateMonthlyPayment(amount: number, rate: number, years: number): number {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = years * 12;
    
    if (monthlyRate === 0) return amount / numberOfPayments;
    
    return amount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  public generateRecommendations(quizData: QuizData): LoanRecommendation[] {
    const loanAmount = this.parseAmount(quizData.loanAmount);
    const loanTermYears = 5; // Default loan term
    
    const recommendations: LoanRecommendation[] = bankProducts
      .map(bank => {
        const matchScore = this.calculateMatchScore(bank, quizData);
        const estimatedRate = this.estimateInterestRate(bank, quizData, matchScore);
        const monthlyPayment = this.calculateMonthlyPayment(loanAmount, estimatedRate, loanTermYears);
        const totalCost = monthlyPayment * loanTermYears * 12 + bank.establishmentFee;

        return {
          bank,
          estimatedRate,
          monthlyPayment: Math.round(monthlyPayment),
          totalCost: Math.round(totalCost),
          matchScore,
          recommended: false
        };
      })
      .filter(rec => rec.matchScore > 30) // Only show viable options
      .sort((a, b) => {
        // Sort by total cost, but boost high match scores
        const aScore = a.totalCost - (a.matchScore * 1000);
        const bScore = b.totalCost - (b.matchScore * 1000);
        return aScore - bScore;
      });

    // Mark the best option as recommended
    if (recommendations.length > 0) {
      recommendations[0].recommended = true;
    }

    return recommendations.slice(0, 5); // Return top 5 recommendations
  }
}