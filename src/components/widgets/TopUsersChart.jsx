import { useTopUsers } from '../../hooks/useTopUsers'
import { ChartCard } from '../ui/ChartCard'
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

export function TopUsersChart() {
  const { data, loading, error } = useTopUsers()

  // top-users vem ordenado por risk_score; reordenamos por total_logins pro título do widget
  const top10 = data ? [...data].sort((a, b) => b.total_logins - a.total_logins).slice(0, 10) : []

  return (
    <ChartCard title="Top usuários por logins" loading={loading} error={error}>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart layout="vertical" data={top10}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="user_id" width={100} tick={{ fontSize: 16 }} />
          <Tooltip />
          <Bar dataKey="total_logins" fill="#3b82f6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}