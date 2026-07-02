import { Key, User, Desktop, ChartBar } from '@phosphor-icons/react'
import { useKpis } from '../../hooks/useKpis'
import { KpiCard } from '../ui/KpiCard'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { ErrorState } from '../ui/ErrorState'

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

export function KpisRow() {
  const { data, loading, error } = useKpis()

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} />
  if (!data) return null

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard icon={<Key size={20} />} label="Total de logins" value={fmt(data.total_logins)} accent="blue" />
      <KpiCard icon={<User size={20} />} label="Usuários únicos" value={fmt(data.total_users)} accent="purple" />
      <KpiCard icon={<Desktop size={20} />} label="Computadores ativos" value={fmt(data.total_computers)} accent="green" />
      <KpiCard
        icon={<ChartBar size={20} />}
        label="Média logins/dia"
        value={fmt(data.avg_logins_per_day)}
        sub={`${data.period_days} dias analisados`}
        accent="amber"
      />
    </div>
  )
}
