import { useRiskSummary } from '../../hooks/useRiskSummary'
import { ChartCard } from '../ui/ChartCard'
import {
  PieChart, Pie, Cell,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

// backend devolve 4 níveis capitalizados em inglês: Critical/High/Medium/Low
const LEVELS = [
  { key: 'Critical', label: 'Crítico', color: '#dc2626' },
  { key: 'High',     label: 'Alto',    color: '#f97316' },
  { key: 'Medium',   label: 'Médio',   color: '#eab308' },
  { key: 'Low',      label: 'Baixo',   color: '#3b82f6' },
]

export function UserRiskDistribution() {
  const { data, loading, error } = useRiskSummary()

  const chartData = data
    ? LEVELS
        .map(l => ({ label: l.label, color: l.color, value: data[l.key] ?? 0 }))
        .filter(entry => entry.value > 0)
    : []

  return (
    <ChartCard title="Distribuição por severidade" loading={loading} error={error}>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="label"
            innerRadius={60}
            outerRadius={90}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
