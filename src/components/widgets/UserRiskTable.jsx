import { useState } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { useUserRisk } from '../../hooks/useUserRisk'
import { ChartCard } from '../ui/ChartCard'

const PAGE_SIZE = 10

// backend devolve 4 níveis capitalizados em inglês: Critical/High/Medium/Low
const SEVERITY_STYLES = {
  Critical: 'bg-red-600/20 text-red-500',
  High:     'bg-orange-500/20 text-orange-400',
  Medium:   'bg-yellow-500/20 text-yellow-400',
  Low:      'bg-blue-500/20 text-blue-400',
}

const SEVERITY_LABELS = {
  Critical: 'Crítico',
  High:     'Alto',
  Medium:   'Médio',
  Low:      'Baixo',
}

function SeverityBadge({ level }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${SEVERITY_STYLES[level] ?? 'bg-gray-500/20 text-gray-400'}`}>
      {SEVERITY_LABELS[level] ?? level}
    </span>
  )
}

function ScoreBar({ score }) {
  const color =
    score >= 80 ? 'bg-red-500' :
    score >= 60 ? 'bg-orange-500' :
    score >= 40 ? 'bg-yellow-500' :
    'bg-blue-500'

  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 bg-gray-800 rounded-full h-1.5 overflow-hidden">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-8 text-right shrink-0">{score.toFixed(1)}</span>
    </div>
  )
}

export function UserRiskTable() {
  const { data, loading, error } = useUserRisk()
  const [page, setPage] = useState(0)

  const sorted = data ? [...data].sort((a, b) => b.risk_score - a.risk_score) : []
  const pageCount = Math.ceil(sorted.length / PAGE_SIZE)
  const paged = sorted.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  return (
    <ChartCard title="Ranking de usuários por risco" loading={loading} error={error}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-gray-800">
              <th className="text-left pb-2 font-medium">Usuário</th>
              <th className="text-left pb-2 font-medium">Severidade</th>
              <th className="text-left pb-2 font-medium">Score</th>
              <th className="text-right pb-2 font-medium">Logins</th>
              <th className="text-right pb-2 font-medium">Computadores</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(row => (
              <tr key={row.user_id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                <td className="py-2.5 text-gray-200 font-mono text-xs">{row.user_id}</td>
                <td className="py-2.5"><SeverityBadge level={row.risk_level} /></td>
                <td className="py-2.5"><ScoreBar score={row.risk_score} /></td>
                <td className="py-2.5 text-right text-gray-300">{row.total_logins}</td>
                <td className="py-2.5 text-right text-gray-300">{row.unique_computers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
          <span>
            Página {page + 1} de {pageCount} · {sorted.length} usuários
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg border border-gray-700 hover:border-blue-500 hover:text-blue-400 disabled:opacity-30 disabled:hover:border-gray-700 disabled:hover:text-gray-400 transition-colors"
            >
              <CaretLeft size={14} />
            </button>
            <button
              onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))}
              disabled={page >= pageCount - 1}
              className="p-1.5 rounded-lg border border-gray-700 hover:border-blue-500 hover:text-blue-400 disabled:opacity-30 disabled:hover:border-gray-700 disabled:hover:text-gray-400 transition-colors"
            >
              <CaretRight size={14} />
            </button>
          </div>
        </div>
      )}
    </ChartCard>
  )
}
