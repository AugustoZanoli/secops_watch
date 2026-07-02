import { useUserRisk } from '../../hooks/useUserRisk'
import { ChartCard } from '../ui/ChartCard'

// o backend usa 3 níveis em inglês (HIGH/MEDIUM/LOW), não os 4 em português do spec
const SEVERITY_STYLES = {
  HIGH:   'bg-red-500/20 text-red-400',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400',
  LOW:    'bg-blue-500/20 text-blue-400',
}

const SEVERITY_LABELS = {
  HIGH:   'Alto',
  MEDIUM: 'Médio',
  LOW:    'Baixo',
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
      <span className="text-xs text-gray-400 w-6 text-right shrink-0">{score}</span>
    </div>
  )
}

export function UserRiskTable() {
  const { data, loading, error } = useUserRisk()
  const sorted = data ? [...data].sort((a, b) => b.risk_score - a.risk_score) : []

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
            {sorted.map(row => (
              <tr key={row.user_id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                <td className="py-2.5 text-gray-200 font-mono text-xs">{row.user_id}</td>
                <td className="py-2.5"><SeverityBadge level={row.risk_level} /></td>
                <td className="py-2.5"><ScoreBar score={row.risk_score} /></td>
                <td className="py-2.5 text-right text-gray-300">{row.login_count}</td>
                <td className="py-2.5 text-right text-gray-300">{row.unique_computers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  )
}
