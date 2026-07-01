// TODO v2: substituir por hook useAnomalyTypes quando endpoint existir
// Endpoint planejado: GET /api/dashboard/anomaly-types
// Depende de: tabela login_events

const MOCK_DATA = [
  { type: 'Falha de login',        count: 218 },
  { type: 'IP desconhecido',       count: 145 },
  { type: 'Excesso de tentativas', count: 92 },
  { type: 'Horário incomum',       count: 67 },
  { type: 'Dispositivo novo',      count: 41 },
]

import { ChartCard } from '../ui/ChartCard'
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

export function AnomalyTypesChart() {
  const data = MOCK_DATA

  return (
    <ChartCard title="Tipos de anomalia">
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