import { Warning } from '@phosphor-icons/react'
import { useRedteamSummary } from '../../hooks/useRedteamSummary'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { ErrorState } from '../ui/ErrorState'

// Substitui a antiga "taxa de falha de autenticação" (dado inexistente: failed_logins
// está zerado em 100% das linhas — problema do pipeline, não da API). Enquanto isso não
// é corrigido, usamos o sinal real mais próximo de comprometimento: atividade Red Team.
export function FailedLoginsKpi() {
  const { data, loading, error } = useRedteamSummary()

  return (
    <div className="bg-gray-900 border border-red-900/50 rounded-xl p-5 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Warning size={16} className="text-red-400" />
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Eventos de Red Team
        </p>
      </div>
      {loading && <LoadingSpinner />}
      {error && <ErrorState message={error} />}
      {!loading && !error && data && (
        <>
          <p className="text-4xl font-bold text-red-400">{data.total_redteam_events}</p>
          <p className="text-sm text-red-400/70">{data.affected_users} usuários afetados</p>
          <p className="text-xs text-gray-500 mt-1">
            {data.source_computers} máquinas de origem · {data.target_computers} de destino
          </p>
        </>
      )}
    </div>
  )
}
