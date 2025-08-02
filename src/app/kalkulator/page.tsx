'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calculator, TrendingDown, Info } from 'lucide-react'

interface LoanCalculation {
  monthlyPayment: number
  totalCost: number
  totalInterest: number
  effectiveRate: number
}

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(200000)
  const [interestRate, setInterestRate] = useState<number>(6.5)
  const [loanTerm, setLoanTerm] = useState<number>(5)
  const [establishmentFee, setEstablishmentFee] = useState<number>(2000)
  const [calculation, setCalculation] = useState<LoanCalculation | null>(null)

  const calculateLoan = () => {
    const principal = loanAmount
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    // Calculate monthly payment using PMT formula
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    const totalCost = monthlyPayment * numberOfPayments + establishmentFee
    const totalInterest = totalCost - principal
    
    // Calculate effective annual rate including fees
    const effectiveRate = ((totalCost / principal) ** (1 / loanTerm) - 1) * 100

    setCalculation({
      monthlyPayment: Math.round(monthlyPayment),
      totalCost: Math.round(totalCost),
      totalInterest: Math.round(totalInterest),
      effectiveRate: Math.round(effectiveRate * 100) / 100
    })
  }

  useEffect(() => {
    calculateLoan()
  }, [loanAmount, interestRate, loanTerm, establishmentFee])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
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
              <Link href="/quiz" className="text-gray-500 hover:text-gray-900">Sammenlign Lån</Link>
              <Link href="#" className="text-gray-500 hover:text-gray-900">Om Oss</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Calculator Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Calculator className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Lånekalkulator
            </h1>
            <p className="text-gray-600">
              Beregn månedlige avdrag og totalkostnader for ditt lån
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Lånedetaljer</h2>
            
            <div className="space-y-6">
              {/* Loan Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lånebeløp
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="50000"
                    max="1000000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>50.000 kr</span>
                    <span>1.000.000 kr</span>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rente (%)
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="3"
                    max="15"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>3%</span>
                    <span>15%</span>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Loan Term */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nedbetalingstid (år)
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 år</span>
                    <span>15 år</span>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Establishment Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etableringsgebyr
                </label>
                <input
                  type="number"
                  value={establishmentFee}
                  onChange={(e) => setEstablishmentFee(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Beregning</h2>
            
            {calculation && (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {formatCurrency(calculation.monthlyPayment)}
                    </div>
                    <div className="text-gray-600">Månedlig avdrag</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(calculation.totalCost)}
                    </div>
                    <div className="text-sm text-gray-600">Totalkostnad</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(calculation.totalInterest)}
                    </div>
                    <div className="text-sm text-gray-600">Total rente</div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <TrendingDown className="h-5 w-5 text-yellow-600 mr-2" />
                    <div>
                      <div className="font-medium text-yellow-800">
                        Effektiv rente: {calculation.effectiveRate}%
                      </div>
                      <div className="text-sm text-yellow-700">
                        Inkluderer alle kostnader
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white text-center">
                  <h3 className="text-lg font-bold mb-2">Finn bedre renter?</h3>
                  <p className="text-blue-100 mb-4">
                    Sammenlign tilbud fra flere banker og spar penger
                  </p>
                  <Link
                    href="/quiz"
                    className="inline-block bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                  >
                    Sammenlign lån
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-start">
            <Info className="h-6 w-6 text-blue-600 mt-1 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Slik fungerer lånekalkulatoren
              </h3>
              <div className="text-gray-600 space-y-2">
                <p>
                  Kalkulatoren beregner månedlige avdrag basert på annuitetslån med fast rente. 
                  Dette er den vanligste lånetypen for forbrukslån i Norge.
                </p>
                <p>
                  <strong>Effektiv rente</strong> inkluderer alle kostnader som etableringsgebyr 
                  og gir deg det reelle bildet av lånets totalkostnad.
                </p>
                <p>
                  Husk at faktiske renter kan variere basert på din kredittvurdering og bankens 
                  vurdering av din økonomi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}