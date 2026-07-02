import { ChartCard } from '../ui/ChartCard'

// TODO v2: substituir por hook useAccessHeatmap quando endpoint existir
// Endpoint planejado: GET /api/dashboard/access-heatmap?days=7
// Depende de: tabela login_events

// 168 células (7 dias × 24h), cada uma { day, hour, count, is_anomaly }
const MOCK_DATA = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => {
    const isWorkHour = hour >= 8 && hour <= 18 && day >= 1 && day <= 5
    const baseCount = isWorkHour
      ? 80 + Math.floor(Math.random() * 80)
      : Math.floor(Math.random() * 20)
    const isAnomaly = !isWorkHour && baseCount > 15
    return { day, hour, count: baseCount, is_anomaly: isAnomaly }
  })
).flat()

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// Helper de cor: retorna a classe Tailwind conforme o count e se é anomalia
function cellColor(count, isAnomaly) {
  if (isAnomaly) return 'bg-orange-500'
  if (count >= 120) return 'bg-blue-300'
  if (count >= 60) return 'bg-blue-500'
  if (count > 0) return 'bg-blue-900'
  return 'bg-gray-800'
}

export function AccessHeatmap() {
  const data = MOCK_DATA

  return (
    <ChartCard title="Mapa de calor de acessos (7d × 24h)">
      <div className="overflow-x-auto">
        {/* Header com horas */}
        <div className="flex gap-1 ml-10 mb-1">
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} className="w-5 text-[10px] text-gray-400 text-center">
              {h % 3 === 0 ? h : ''}
            </div>
          ))}
        </div>
        {/* Linhas (1 por dia) */}
        {DAYS.map((dayLabel, dayIdx) => (
          <div key={dayIdx} className="flex items-center gap-1 mb-1">
            <span className="w-9 text-xs text-gray-400 text-right pr-1">{dayLabel}</span>
            {Array.from({ length: 24 }, (_, hour) => {
              const cell = data.find(c => c.day === dayIdx && c.hour === hour)
              return (
                <div
                  key={hour}
                  className={`w-5 h-5 rounded-sm ${cellColor(cell.count, cell.is_anomaly)}`}
                  title={`${dayLabel} ${hour}h — ${cell.count} acessos${cell.is_anomaly ? ' (anomalia)' : ''}`}
                />
              )
            })}
          </div>
        ))}
        {/* Legenda */}
        <div className="flex items-center gap-4 mt-3 ml-10 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-blue-900" />
            <span>Baixo</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-blue-500" />
            <span>Médio</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-blue-300" />
            <span>Alto</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-orange-500" />
            <span>Anomalia</span>
          </div>
        </div>
      </div>
    </ChartCard>
  )
}