import { useTopComputers } from '../../hooks/useTopComputers'
import { ChartCard } from '../ui/ChartCard'
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

// Substitui o antigo "Top IPs por requisições": o banco não guarda IP de origem,
// só top_computers (máquina mais próxima disponível de "origem de requisições").
export function TopComputersChart() {
  const { data, loading, error } = useTopComputers()

  const top10 = data?.slice(0, 10) ?? []

  return (
    <ChartCard title="Top computadores por autenticações" loading={loading} error={error}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart layout="vertical" data={top10}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="computer_id" width={110} tick={{ fontSize: 14 }} />
          <Tooltip />
          <Bar dataKey="total_authentications" fill="#06b6d4" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
