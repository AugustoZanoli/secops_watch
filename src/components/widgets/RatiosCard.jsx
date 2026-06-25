import { useKpis } from '../../hooks/useKpis'
import { ChartCard } from '../ui/ChartCard'
import { StatBar } from '../ui/StatBar'

export function RatiosCard() {
  const { data, loading, error } = useKpis()

  const ratios = data
    ? [
        { label: 'Computadores por usuário', value: (data.total_computers / data.total_users).toFixed(2) },
        { label: 'Logins por usuário/dia', value: (data.avg_logins_per_day / data.total_users).toFixed(2) },
        { label: 'Logins por computador/dia', value: (data.avg_logins_per_day / data.total_computers).toFixed(2) },
      ]
    : []

  const maxVal = data
    ? Math.max(data.avg_logins_per_day, data.total_computers, data.total_users)
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
          label="Média diária"
          value={data?.avg_logins_per_day ?? 0}
          displayValue={String(data?.avg_logins_per_day ?? '')}
          max={maxVal}
          color="bg-blue-500"
        />
        <StatBar
          label="Computadores"
          value={data?.total_computers ?? 0}
          displayValue={String(data?.total_computers ?? '')}
          max={maxVal}
          color="bg-green-500"
        />
        <StatBar
          label="Usuários"
          value={data?.total_users ?? 0}
          displayValue={String(data?.total_users ?? '')}
          max={maxVal}
          color="bg-purple-500"
        />
      </div>
    </ChartCard>
  )
}
