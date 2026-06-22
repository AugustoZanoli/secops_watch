import { useState, useEffect } from 'react'

export function useKpis() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/dashboard/kpis')
      .then(res => {
        if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`)
        return res.json()
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}
