import { useKpis } from '../../hooks/useKpis'
import { ChartCard } from '../ui/ChartCard'
import { StatBar } from '../ui/StatBar'

export function RatiosCard() {
  const { data, loading, error } = useKpis()

  const ratios = data
    ? [
        { label: 'Taxa de usuários suspeitos', value: `${((data.suspicious_users / data.total_users) * 100).toFixed(1)}%` },
        { label: 'Taxa de usuários críticos', value: `${((data.critical_users / data.total_users) * 100).toFixed(1)}%` },
        { label: 'Taxa de falha de autenticação', value: `${(data.authentication_failure_rate * 100).toFixed(1)}%` },
      ]
    : []

  const maxVal = data
    ? Math.max(data.critical_users, data.high_users, data.medium_users, data.low_users)
    : 1

  return (
    <ChartCard title="Índices calculados" loading={loading} error={error}>
      <div className="flex flex-col gap-3 mb-5">
        {ratios.map(r => (
          <div key={r.label} className="flex justify-between text-sm">
            <span className="text-gray-400">{r.label}</span>
            <span className="text-white font-medium">{r.value}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <StatBar
          label="Críticos"
          value={data?.critical_users ?? 0}
          displayValue={String(data?.critical_users ?? '')}
          max={maxVal}
          color="bg-red-500"
        />
        <StatBar
          label="Altos"
          value={data?.high_users ?? 0}
          displayValue={String(data?.high_users ?? '')}
          max={maxVal}
          color="bg-orange-500"
        />
        <StatBar
          label="Médios"
          value={data?.medium_users ?? 0}
          displayValue={String(data?.medium_users ?? '')}
          max={maxVal}
          color="bg-yellow-500"
        />
        <StatBar
          label="Baixos"
          value={data?.low_users ?? 0}
          displayValue={String(data?.low_users ?? '')}
          max={maxVal}
          color="bg-blue-500"
        />
      </div>
    </ChartCard>
  )
}
