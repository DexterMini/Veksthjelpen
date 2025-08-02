'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Star, Shield, Calculator, Info } from 'lucide-react'

interface LoanOffer {
  id: string
  bankName: string
  bankLogo: string
  loanType: string
  interestRate: number
  monthlyPayment: number
  totalCost: number
  processingFee: number
  features: string[]
  rating: number
  affiliateUrl: string
  recommended?: boolean
}

const mockLoanOffers: LoanOffer[] = [
  {
    id: '1',
    bankName: 'Bank Norwegian',
    bankLogo: '/logos/bank-norwegian.png',
    loanType: 'Forbrukslån',
    interestRate: 5.9,
    monthlyPayment: 2156,
    totalCost: 259200,
    processingFee: 0,
    features: ['Ingen etableringsgebyr', 'Fleksible nedbetalinger', 'Tidlig innfrielse uten gebyr'],
    rating: 4.5,
    affiliateUrl: 'https://banknorwegian.no/?ref=lansammenligning',
    recommended: true
  },
  {
    id: '2',
    bankName: 'Nordax Bank',
    bankLogo: '/logos/nordax.png',
    loanType: 'Forbrukslån',
    interestRate: 6.4,
    monthlyPayment: 2198,
    totalCost: 263760,
    processingFee: 1500,
    features: ['Rask behandling', 'Konkurransedyktige renter', 'Personlig service'],
    rating: 4.2,
    affiliateUrl: 'https://nordax.no/?ref=lansammenligning'
  },
  {
    id: '3',
    bankName: 'Instabank',
    bankLogo: '/logos/instabank.png',
    loanType: 'Forbrukslån',
    interestRate: 7.1,
    monthlyPayment: 2267,
    totalCost: 272040,
    processingFee: 2000,
    features: ['Digital søknadsprosess', 'Svar på minutter', 'Fleksible vilkår'],
    rating: 4.0,
    affiliateUrl: 'https://instabank.no/?ref=lansammenligning'
  }
]

export default function Results() {
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null)

  const handleApplyNow = (offer: LoanOffer) => {
    // Track conversion for affiliate system
    if (typeof window !== 'undefined') {
      // Analytics tracking
      window.gtag?.('event', 'loan_application_click', {
        bank_name: offer.bankName,
        interest_rate: offer.interestRate,
        loan_amount: 200000 // This would come from quiz data
      })
    }
    
    // Redirect to affiliate URL
    window.open(offer.affiliateUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              LånSammenligning
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/kalkulator" className="text-gray-500 hover:text-gray-900">Kalkulator</Link>
              <Link href="/quiz" className="text-gray-500 hover:text-gray-900">Ny sammenligning</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Results Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dine låneforslag
            </h1>
            <p className="text-gray-600 mb-4">
              Basert på dine svar har vi funnet de beste lånealternativene for deg
            </p>
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm">
              <Info className="h-4 w-4 mr-2" />
              Du kan spare opptil 13.560 kr ved å velge det beste alternativet
            </div>
          </div>
        </div>
      </div>

      {/* Loan Offers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {mockLoanOffers.map((offer, index) => (
            <div 
              key={offer.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                offer.recommended ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {offer.recommended && (
                <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium">
                  🏆 Anbefalt for deg
                </div>
              )}
              
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Bank Info */}
                  <div className="flex items-center mb-4 lg:mb-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-lg font-bold text-gray-600">
                        {offer.bankName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{offer.bankName}</h3>
                      <p className="text-gray-600">{offer.loanType}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < Math.floor(offer.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {offer.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Loan Details */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 lg:mb-0">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {offer.interestRate}%
                      </div>
                      <div className="text-sm text-gray-600">Rente</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {offer.monthlyPayment.toLocaleString()} kr
                      </div>
                      <div className="text-sm text-gray-600">Per måned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {offer.totalCost.toLocaleString()} kr
                      </div>
                      <div className="text-sm text-gray-600">Totalkostnad</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {offer.processingFee.toLocaleString()} kr
                      </div>
                      <div className="text-sm text-gray-600">Etablering</div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleApplyNow(offer)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      Søk nå
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </button>
                    <button
                      onClick={() => setSelectedOffer(selectedOffer === offer.id ? null : offer.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      {selectedOffer === offer.id ? 'Skjul detaljer' : 'Vis detaljer'}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedOffer === offer.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Fordeler:</h4>
                    <ul className="space-y-2">
                      {offer.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-600">
                          <Shield className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Tools */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <Calculator className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Vil du beregne selv?
            </h3>
            <p className="text-gray-600 mb-4">
              Bruk vår lånekalkulator for å sammenligne ulike scenarier
            </p>
            <Link
              href="/kalkulator"
              className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Åpne kalkulator
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <Info className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Viktig informasjon:</p>
              <p>
                Rentene som vises er veiledende og kan variere basert på din kredittvurdering. 
                Endelig rente fastsettes av banken etter søknad. Vi mottar provisjon fra bankene 
                når du søker gjennom våre lenker, men dette påvirker ikke våre anbefalinger.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}