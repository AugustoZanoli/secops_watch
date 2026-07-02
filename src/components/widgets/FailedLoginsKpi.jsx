import { Warning } from '@phosphor-icons/react'

// TODO v2: substituir por hook useFailedLoginsKpi quando endpoint existir
// Endpoint planejado: GET /api/dashboard/failed-logins-rate
// Depende de: tabela login_events
const MOCK_DATA = {
  failure_rate: 0.261,
  baseline_rate: 0.138,
  delta_vs_baseline: 0.123,
  target_rate: 0.05,
}

export function FailedLoginsKpi() {
  const data = MOCK_DATA
  const failurePct = (data.failure_rate * 100).toFixed(1)
  const deltaPct = (data.delta_vs_baseline * 100).toFixed(1)
  const baselinePct = (data.baseline_rate * 100).toFixed(1)
  const targetPct = (data.target_rate * 100).toFixed(0)

  return (
    <div className="bg-gray-900 border border-red-900/50 rounded-xl p-5 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Warning size={16} className="text-red-400" />
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Taxa de falha de autenticação
        </p>
      </div>
      <p className="text-4xl font-bold text-red-400">{failurePct}%</p>
      <p className="text-sm text-red-400/70">+{deltaPct}pp vs média {baselinePct}%</p>
      <p className="text-xs text-gray-500 mt-1">Meta: &lt;{targetPct}%</p>
    </div>
  )
}
