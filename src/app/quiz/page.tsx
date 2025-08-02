'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface QuizData {
  loanAmount: string
  loanPurpose: string
  monthlyIncome: string
  existingDebt: string
  employmentStatus: string
  housingStatus: string
  creditHistory: string
}

const steps = [
  {
    id: 'amount',
    title: 'Hvor mye vil du låne?',
    subtitle: 'Velg ønsket lånebeløp'
  },
  {
    id: 'purpose',
    title: 'Hva skal lånet brukes til?',
    subtitle: 'Dette hjelper oss å finne de beste alternativene'
  },
  {
    id: 'income',
    title: 'Hva er din månedlige inntekt?',
    subtitle: 'Oppgi brutto månedsinntekt'
  },
  {
    id: 'debt',
    title: 'Har du eksisterende gjeld?',
    subtitle: 'Inkluder kredittkort, andre lån osv.'
  },
  {
    id: 'employment',
    title: 'Hva er din arbeidssituasjon?',
    subtitle: 'Dette påvirker lånemulighetene dine'
  },
  {
    id: 'housing',
    title: 'Hva er din boligsituasjon?',
    subtitle: 'Eier eller leier du bolig?'
  },
  {
    id: 'credit',
    title: 'Hvordan vurderer du din kredittverdighet?',
    subtitle: 'Har du betalingsanmerkninger eller inkasso?'
  }
]

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(0)
  const [quizData, setQuizData] = useState<QuizData>({
    loanAmount: '',
    loanPurpose: '',
    monthlyIncome: '',
    existingDebt: '',
    employmentStatus: '',
    housingStatus: '',
    creditHistory: ''
  })

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Submit quiz and redirect to results
      window.location.href = '/resultater'
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateQuizData = (field: keyof QuizData, value: string) => {
    setQuizData(prev => ({ ...prev, [field]: value }))
  }

  const isStepComplete = () => {
    const step = steps[currentStep]
    switch (step.id) {
      case 'amount': return quizData.loanAmount !== ''
      case 'purpose': return quizData.loanPurpose !== ''
      case 'income': return quizData.monthlyIncome !== ''
      case 'debt': return quizData.existingDebt !== ''
      case 'employment': return quizData.employmentStatus !== ''
      case 'housing': return quizData.housingStatus !== ''
      case 'credit': return quizData.creditHistory !== ''
      default: return false
    }
  }

  const renderStepContent = () => {
    const step = steps[currentStep]
    
    switch (step.id) {
      case 'amount':
        return (
          <div className="space-y-4">
            {['50.000 kr', '100.000 kr', '200.000 kr', '300.000 kr', '500.000 kr', 'Annet beløp'].map((amount) => (
              <button
                key={amount}
                onClick={() => updateQuizData('loanAmount', amount)}
                className={`w-full p-4 text-left border rounded-lg hover:bg-blue-50 transition-colors ${
                  quizData.loanAmount === amount ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                {amount}
              </button>
            ))}
          </div>
        )
      
      case 'purpose':
        return (
          <div className="space-y-4">
            {['Refinansiering', 'Bil', 'Renovering', 'Ferie', 'Bryllup', 'Annet'].map((purpose) => (
              <button
                key={purpose}
                onClick={() => updateQuizData('loanPurpose', purpose)}
                className={`w-full p-4 text-left border rounded-lg hover:bg-blue-50 transition-colors ${
                  quizData.loanPurpose === purpose ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                {purpose}
              </button>
            ))}
          </div>
        )
      
      case 'income':
        return (
          <div className="space-y-4">
            {['Under 300.000 kr', '300.000 - 500.000 kr', '500.000 - 700.000 kr', '700.000 - 1.000.000 kr', 'Over 1.000.000 kr'].map((income) => (
              <button
                key={income}
                onClick={() => updateQuizData('monthlyIncome', income)}
                className={`w-full p-4 text-left border rounded-lg hover:bg-blue-50 transition-colors ${
                  quizData.monthlyIncome === income ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                {income}
              </button>
            ))}
          </div>
        )
      
      case 'debt':
        return (
          <div className="space-y-4">
            {['Ingen gjeld', 'Under 100.000 kr', '100.000 - 300.000 kr', '300.000 - 500.000 kr', 'Over 500.000 kr'].map((debt) => (
              <button
                key={debt}
                onClick={() => updateQuizData('existingDebt', debt)}
                className={`w-full p-4 text-left border rounded-lg hover:bg-blue-50 transition-colors ${
                  quizData.existingDebt === debt ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                {debt}
              </button>
            ))}
          </div>
        )
      
      case 'employment':
        return (
          <div className="space-y-4">
            {['Fast ansatt', 'Midlertidig ansatt', 'Selvstendig næringsdrivende', 'Pensjonist', 'Student', 'Arbeidsledig'].map((status) => (
              <button
                key={status}
                onClick={() => updateQuizData('employmentStatus', status)}
                className={`w-full p-4 text-left border rounded-lg hover:bg-blue-50 transition-colors ${
                  quizData.employmentStatus === status ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )
      
      case 'housing':
        return (
          <div className="space-y-4">
            {['Eier bolig', 'Leier bolig', 'Bor hos foreldre', 'Annet'].map((housing) => (
              <button
                key={housing}
                onClick={() => updateQuizData('housingStatus', housing)}
                className={`w-full p-4 text-left border rounded-lg hover:bg-blue-50 transition-colors ${
                  quizData.housingStatus === housing ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                {housing}
              </button>
            ))}
          </div>
        )
      
      case 'credit':
        return (
          <div className="space-y-4">
            {['Meget god', 'God', 'Middels', 'Dårlig', 'Har betalingsanmerkninger'].map((credit) => (
              <button
                key={credit}
                onClick={() => updateQuizData('creditHistory', credit)}
                className={`w-full p-4 text-left border rounded-lg hover:bg-blue-50 transition-colors ${
                  quizData.creditHistory === credit ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                {credit}
              </button>
            ))}
          </div>
        )
      
      default:
        return null
    }
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
            <div className="text-sm text-gray-500">
              Steg {currentStep + 1} av {steps.length}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600">
              {steps[currentStep].subtitle}
            </p>
          </div>

          {renderStepContent()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center px-4 py-2 rounded-md ${
                currentStep === 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Tilbake
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepComplete()}
              className={`flex items-center px-6 py-2 rounded-md ${
                isStepComplete()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentStep === steps.length - 1 ? 'Se resultater' : 'Neste'}
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}