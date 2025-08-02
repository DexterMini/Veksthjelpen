import Link from 'next/link'
import { Calculator, Shield, Users, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">LånSammenligning</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#" className="text-gray-500 hover:text-gray-900">Sammenlign Lån</Link>
              <Link href="#" className="text-gray-500 hover:text-gray-900">Kalkulator</Link>
              <Link href="#" className="text-gray-500 hover:text-gray-900">Om Oss</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Finn ditt <span className="text-blue-600">perfekte lån</span>
            </h2>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Sammenlign lån fra Norges ledende banker. Spar opptil 50.000 kr årlig med våre AI-drevne anbefalinger.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/quiz"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Start sammenligning
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  href="/kalkulator"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Lånekalkulator
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-extrabold text-gray-900">
              Hvorfor velge LånSammenligning?
            </h3>
            <p className="mt-4 text-lg text-gray-500">
              Vi gjør det enkelt å finne det beste lånet for din situasjon
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <Calculator className="h-6 w-6" />
                </div>
                <h4 className="mt-4 text-lg font-medium text-gray-900">Smart Kalkulator</h4>
                <p className="mt-2 text-base text-gray-500">
                  Beregn månedlige avdrag og totalkostnader for alle låntyper
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <Shield className="h-6 w-6" />
                </div>
                <h4 className="mt-4 text-lg font-medium text-gray-900">Trygg og Sikker</h4>
                <p className="mt-2 text-base text-gray-500">
                  GDPR-kompatibel og registrert hos Finanstilsynet
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <Users className="h-6 w-6" />
                </div>
                <h4 className="mt-4 text-lg font-medium text-gray-900">Personlige Anbefalinger</h4>
                <p className="mt-2 text-base text-gray-500">
                  AI-drevne forslag basert på din økonomiske situasjon
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h4 className="mt-4 text-lg font-medium text-gray-900">Spar Penger</h4>
                <p className="mt-2 text-base text-gray-500">
                  Sammenlign renter og vilkår fra 15+ norske banker
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h3 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Klar til å spare penger?</span>
            <span className="block text-blue-200">Start sammenligningen i dag.</span>
          </h3>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Sammenlign nå
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-white text-lg font-semibold">LånSammenligning</h4>
              <p className="mt-2 text-gray-300 text-sm">
                Norges ledende plattform for sammenligning av lån og kredittkort.
                Vi hjelper deg med å finne de beste finansielle løsningene.
              </p>
            </div>
            <div>
              <h5 className="text-white font-medium">Tjenester</h5>
              <ul className="mt-2 space-y-1">
                <li><Link href="#" className="text-gray-300 hover:text-white text-sm">Forbrukslån</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white text-sm">Kredittkort</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white text-sm">Refinansiering</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-medium">Selskap</h5>
              <ul className="mt-2 space-y-1">
                <li><Link href="#" className="text-gray-300 hover:text-white text-sm">Om oss</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white text-sm">Personvern</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white text-sm">Vilkår</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8">
            <p className="text-gray-400 text-sm text-center">
              © 2024 LånSammenligning. Alle rettigheter reservert.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
