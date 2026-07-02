import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { usePeriod } from '../contexts/PeriodContext'

export function useUserRisk() {
  const { period } = usePeriod()
  // guarda o período junto do resultado: se for diferente do atual, ainda está carregando
  const [result, setResult] = useState({ period: null, data: null, error: null })

  useEffect(() => {
    let cancelled = false

    api.get(`/dashboard/user-risk?period=${period}`)
      .then(data => { if (!cancelled) setResult({ period, data, error: null }) })
      .catch(err => { if (!cancelled) setResult({ period, data: null, error: err.message }) })

    return () => { cancelled = true }
  }, [period])

  const loading = result.period !== period
  return {
    data: loading ? null : result.data,
    loading,
    error: loading ? null : result.error,
  }
}
