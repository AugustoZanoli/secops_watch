import { User, ShieldWarning, Gauge, MoonStars } from '@phosphor-icons/react'
import { useKpis } from '../../hooks/useKpis'
import { useDailyLogins } from '../../hooks/useDailyLogins'
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
  const { data: timeline } = useDailyLogins()

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} />
  if (!data) return null

  // dashboard_kpis não tem total de autenticações; somamos do login-timeline pra achar o %
  const totalAuth = timeline?.reduce((sum, d) => sum + d.authentications, 0)
  const afterHoursPct = totalAuth ? ((data.after_hours_logins / totalAuth) * 100).toFixed(1) : null

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard icon={<User size={20} />} label="Usuários totais" value={fmt(data.total_users)} accent="purple" />
      <KpiCard
        icon={<ShieldWarning size={20} />}
        label="Usuários suspeitos"
        value={fmt(data.suspicious_users)}
        sub={`${data.critical_users} críticos`}
        accent="amber"
      />
      <KpiCard icon={<Gauge size={20} />} label="Índice geral de risco" value={data.average_risk.toFixed(1)} accent="blue" />
      <KpiCard
        icon={<MoonStars size={20} />}
        label="Acessos fora do padrão"
        value={fmt(data.after_hours_logins)}
        sub={afterHoursPct ? `${afterHoursPct}% do total` : undefined}
        accent="green"
      />
    </div>
  )
}
