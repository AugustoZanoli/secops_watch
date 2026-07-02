import { useActivityHeatmap } from '../../hooks/useActivityHeatmap'
import { ChartCard } from '../ui/ChartCard'

// backend usa dow: 0=segunda ... 6=domingo (day % 7 sobre um dataset ancorado numa segunda)
const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const EMPTY_CELL = { authentications: 0, is_anomaly: false }

// Helper de cor: retorna a classe Tailwind conforme o volume e se é anomalia
function cellColor(count, isAnomaly) {
  if (isAnomaly) return 'bg-orange-500'
  if (count >= 300_000) return 'bg-blue-300'
  if (count >= 150_000) return 'bg-blue-500'
  if (count > 0) return 'bg-blue-900'
  return 'bg-gray-800'
}

export function AccessHeatmap() {
  const { data, loading, error } = useActivityHeatmap()

  const avg = data?.length
    ? data.reduce((sum, c) => sum + c.authentications, 0) / data.length
    : 0

  // anomalia = fora do horário comercial (madrugada ou fim de semana) com volume acima da média
  const cellMap = new Map(
    (data ?? []).map(c => {
      const offHours = c.dow >= 5 || c.hour < 7 || c.hour >= 20
      return [`${c.dow}-${c.hour}`, { ...c, is_anomaly: offHours && c.authentications > avg }]
    })
  )

  return (
    <ChartCard title="Mapa de calor de acessos (7d × 24h)" loading={loading} error={error}>
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
              const cell = cellMap.get(`${dayIdx}-${hour}`) ?? EMPTY_CELL
              return (
                <div
                  key={hour}
                  className={`w-5 h-5 rounded-sm ${cellColor(cell.authentications, cell.is_anomaly)}`}
                  title={`${dayLabel} ${hour}h — ${cell.authentications.toLocaleString('pt-BR')} acessos${cell.is_anomaly ? ' (anomalia)' : ''}`}
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
