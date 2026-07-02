import { useUserRisk } from '../../hooks/useUserRisk'
import { ChartCard } from '../ui/ChartCard'
import {
  PieChart, Pie, Cell,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const COLORS = {
  'Crítico': '#ef4444',
  'Alto':    '#f97316',
  'Médio':   '#eab308',
  'Baixo':   '#3b82f6',
}

function aggregateByLevel(users) {
  const counts = {}
  for (const u of users) {
    counts[u.risk_level] = (counts[u.risk_level] || 0) + 1
  }
  return Object.entries(counts).map(([level, value]) => ({ level, value }))
}

export function UserRiskDistribution() {
  const { data, loading, error } = useUserRisk()

  const chartData = data ? aggregateByLevel(data) : []

  return (
    <ChartCard title="Distribuição por severidade" loading={loading} error={error}>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="level"
            innerRadius={60}
            outerRadius={90}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={COLORS[entry.level] ?? '#6b7280'} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}