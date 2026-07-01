import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartCard } from '../ui/ChartCard'

// TODO v2: substituir por hook quando endpoint existir
// Endpoint planejado: GET /api/dashboard/failed-logins-trend?days=7
// Depende de: tabela login_events
const MOCK_DATA = [
  { day: '16/06', failures: 32 },
  { day: '17/06', failures: 45 },
  { day: '18/06', failures: 28 },
  { day: '19/06', failures: 67 },
  { day: '20/06', failures: 89 },
  { day: '21/06', failures: 54 },
  { day: '22/06', failures: 156 }
]

export function FailedLoginsChart() {
  return (
    <ChartCard title="Evolução de falhas de login (7d)">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={MOCK_DATA} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="day" stroke="#6b7280" tick={{ fontSize: 12 }} />
          <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #374151',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="failures"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}