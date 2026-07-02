import { ShieldWarning } from '@phosphor-icons/react'

// TODO v2: substituir por hook useOutOfPatternKpi quando endpoint existir
// Endpoint planejado: GET /api/dashboard/out-of-pattern
// Depende de: tabela login_events
const MOCK_DATA = {
  out_of_pattern_count: 412,
  out_of_pattern_pct: 0.359,
  target_pct: 0.10,
}

export function OutOfPatternKpi() {
  const data = MOCK_DATA
  const pct = (data.out_of_pattern_pct * 100).toFixed(1)
  const targetPct = (data.target_pct * 100).toFixed(0)

  return (
    <div className="bg-gray-900 border border-amber-900/50 rounded-xl p-5 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <ShieldWarning size={16} className="text-amber-400" />
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Acessos fora do padrão
        </p>
      </div>
      <p className="text-4xl font-bold text-amber-400">{data.out_of_pattern_count.toLocaleString('pt-BR')}</p>
      <p className="text-sm text-amber-400/70">{pct}% do total</p>
      <p className="text-xs text-gray-500 mt-1">Meta: &lt;{targetPct}%</p>
    </div>
  )
}
