// TODO v2: substituir por hook useRequestsByIp quando endpoint existir
// Endpoint planejado: GET /api/dashboard/top-ips?limit=10
// Depende de: tabela login_events

const MOCK_DATA = [
  { ip: '10.0.10.73', requests: 1247 },
  { ip: '10.0.32.54', requests: 982 },
  { ip: '10.0.45.12', requests: 743 },
  { ip: '10.0.18.91', requests: 612 },
  { ip: '10.0.27.33', requests: 488 },
  { ip: '10.0.51.07', requests: 392 },
  { ip: '10.0.62.18', requests: 274 },
]

import { ChartCard } from '../ui/ChartCard'
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

export function RequestsByIpChart() {
  const data = MOCK_DATA

  return (
    <ChartCard title="Top IPs por requisições">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart layout="vertical" data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="ip" width={110} tick={{ fontSize: 16 }} />
          <Tooltip />
          <Bar dataKey="requests" fill="#06b6d4" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}