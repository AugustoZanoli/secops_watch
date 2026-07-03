import { createContext, useContext, useState } from 'react'

const PeriodContext = createContext(null)

export function PeriodProvider({ children }) {
  const [period, setPeriod] = useState('Tudo')
  return (
    <PeriodContext.Provider value={{ period, setPeriod }}>
      {children}
    </PeriodContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePeriod() {
  const ctx = useContext(PeriodContext)
  if (!ctx) throw new Error('usePeriod deve estar dentro de <PeriodProvider>')
  return ctx
}
