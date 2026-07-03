import { useState, useEffect } from 'react'
import { api } from '../lib/api'

export function useAnomalyTypes() {
  const [result, setResult] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    let cancelled = false

    api.get('/dashboard/anomaly-types')
      .then(data => { if (!cancelled) setResult({ data, loading: false, error: null }) })
      .catch(err => { if (!cancelled) setResult({ data: null, loading: false, error: err.message }) })

    return () => { cancelled = true }
  }, [])

  return result
}
