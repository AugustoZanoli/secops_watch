import { useAnomalyTypes } from '../../hooks/useAnomalyTypes'
import { ChartCard } from '../ui/ChartCard'
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

export function AnomalyTypesChart() {
  const { data, loading, error } = useAnomalyTypes()

  return (
    <ChartCard title="Tipos de anomalia" loading={loading} error={error}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="type"
            tick={{ fontSize: 12, angle: -20, textAnchor: 'end' }}
            height={60}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
