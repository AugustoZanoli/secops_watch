import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts'
import { useDailyLogins } from '../../hooks/useDailyLogins'
import { usePeriod } from '../../contexts/PeriodContext'
import { PeriodSelector } from '../ui/PeriodSelector'
import { ChartCard } from '../ui/ChartCard'

// day vem como YYYY-MM-DD (ISO); exibimos só DD/MM no eixo.
function formatDay(isoDate) {
  const [, month, day] = isoDate.split('-')
  return `${day}/${month}`
}

// login-timeline vem pré-agregado (58 dias fixos do dataset sintético, sem suporte
// a ?period= no backend) — filtramos os últimos N pontos da série no cliente.
// É o único widget do dashboard com granularidade diária pra isso fazer sentido;
// os demais (KPIs, risco, ranking) são agregados do dataset inteiro, sem coluna de data.
const PERIOD_DAYS = { '24h': 1, '7d': 7, '30d': 30, Tudo: Infinity }

export function DailyLoginsChart() {
  const { data: fullData, loading, error } = useDailyLogins()
  const { period } = usePeriod()

  const days = PERIOD_DAYS[period] ?? Infinity
  const data = fullData ? fullData.slice(-days) : fullData

  return (
    <ChartCard
      title="Tendência de logins diários"
      loading={loading}
      error={error}
      action={<PeriodSelector />}
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="day" tickFormatter={formatDay} stroke="#6b7280" tick={{ fontSize: 12 }} />
          <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
          <Tooltip
            labelFormatter={formatDay}
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #374151',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="authentications"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}