import { usePeriod } from '../../contexts/PeriodContext'

const OPTIONS = ['24h', '7d', '30d', 'Tudo']

export function PeriodSelector() {
  const { period, setPeriod } = usePeriod()

  return (
    <div className="flex items-center gap-2">
      {OPTIONS.map(opt => (
        <button
          key={opt}
          onClick={() => setPeriod(opt)}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
            period === opt
              ? 'border-blue-500 text-blue-400 bg-blue-500/10'
              : 'border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
