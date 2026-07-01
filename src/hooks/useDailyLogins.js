import { useState, useEffect } from 'react'
import { api } from '../lib/api'

export function useDailyLogins() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    api.get('/dashboard/daily-logins')
      .then(result => { if (!cancelled) setData(result) })
      .catch(err =>    { if (!cancelled) setError(err.message) })
      .finally(() =>   { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [])

  return { data, loading, error }
}
