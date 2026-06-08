import { useState } from 'react'
import { LangProvider } from './context/LangContext'
import { ThemeProvider } from './context/ThemeContext'
import Header from './sections/Header'
import Hero from './sections/Hero'
import WhatWeProvide from './sections/WhatWeProvide'
import HowItWorks from './sections/HowItWorks'
import Pricing from './sections/Pricing'
import Compliance from './sections/Compliance'
import FAQ from './sections/FAQ'
import Footer from './sections/Footer'
import ResultScreen, { type ResultState } from './screens/ResultScreen'
import DevPanel from './components/DevPanel'

export default function App() {
  const [result, setResult] = useState<ResultState | null>(null)

  const handleReset = () => {
    setResult(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <ThemeProvider>
      <LangProvider>
        {result ? (
          <ResultScreen result={result} onReset={handleReset} />
        ) : (
          <>
            <Header />
            <main>
              <Hero />
              <WhatWeProvide />
              <HowItWorks />
              <Pricing onResult={setResult} />
              <Compliance />
              <FAQ />
            </main>
            <Footer />
          </>
        )}
        <DevPanel current={result} onSelect={setResult} />
      </LangProvider>
    </ThemeProvider>
  )
}
