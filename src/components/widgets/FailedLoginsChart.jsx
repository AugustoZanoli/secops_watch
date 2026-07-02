import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useRedteamSummary } from '../../hooks/useRedteamSummary'
import { ChartCard } from '../ui/ChartCard'

// Substitui a antiga "evolução de falhas de login": failed_logins está zerado em 100%
// das linhas (pipeline upstream, não corrigível na API). redteam_summary não tem série
// temporal, só totais — por isso viramos um comparativo de barras em vez de uma linha.
export function FailedLoginsChart() {
  const { data, loading, error } = useRedteamSummary()

  const chartData = data
    ? [
        { label: 'Eventos', value: data.total_redteam_events },
        { label: 'Usuários afetados', value: data.affected_users },
        { label: 'Máquinas origem', value: data.source_computers },
        { label: 'Máquinas destino', value: data.target_computers },
      ]
    : []

  return (
    <ChartCard title="Atividade Red Team" loading={loading} error={error}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="label" stroke="#6b7280" tick={{ fontSize: 12 }} />
          <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #374151',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
