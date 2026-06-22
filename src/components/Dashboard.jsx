import { useKpis } from '../hooks/useKpis'

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K'
  return Math.round(n).toLocaleString('pt-BR')
}

function fmtFull(n) {
  return Math.round(n).toLocaleString('pt-BR')
}

function KpiCard({ label, value, sub, delta, meta, accent }) {
  const colors = {
    red:    { bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/20' },
    amber:  { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20' },
    blue:   { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  }
  const c = colors[accent] || colors.blue

  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-5 flex flex-col gap-2`}>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">{label}</p>
      <p className={`text-3xl font-bold ${c.text}`}>{value}</p>
      {delta && (
        <span className="text-xs text-red-400 font-medium">{delta}</span>
      )}
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
      {meta && <p className="text-xs text-gray-600 mt-1">{meta}</p>}
    </div>
  )
}

function StatBar({ label, value, max, color }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 w-36 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-800 rounded-full h-1.5 overflow-hidden">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-300 w-20 text-right shrink-0">
        {Math.round(value).toLocaleString('pt-BR')}
      </span>
    </div>
  )
}

export function Dashboard() {
  const { data, loading, error } = useKpis()

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-gray-800 flex flex-col p-4 gap-1">
        <div className="flex items-center gap-2 mb-6 px-2 pt-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-sm">🛡</div>
          <span className="font-semibold text-sm text-white">SecOps Watch</span>
        </div>

        {[
          { icon: '📊', label: 'Dashboard', active: true },
          { icon: '🔑', label: 'Logins' },
          { icon: '👤', label: 'Usuários' },
          { icon: '🖥️', label: 'Ativos' },
          { icon: '⚠️', label: 'Alertas' },
          { icon: '⚙️', label: 'Configurações' },
        ].map(({ icon, label, active }) => (
          <button
            key={label}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left
              ${active
                ? 'bg-blue-600/20 text-blue-400 font-medium'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">

        {/* Top bar */}
        <header className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">Dashboard</h1>
            <p className="text-xs text-gray-500">Visão geral · últimos {data?.period_days ?? '...'} dias</p>
          </div>
          <div className="flex items-center gap-2">
            {['24h', '7d', '30d'].map(t => (
              <button key={t}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors">
                {t}
              </button>
            ))}
          </div>
        </header>

        <div className="p-8">

          {/* Loading / Error */}
          {loading && (
            <div className="flex items-center justify-center h-64 gap-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Carregando KPIs...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-64 gap-2">
              <span className="text-3xl">⚠️</span>
              <p className="text-sm text-red-400 font-medium">Falha ao carregar dados</p>
              <p className="text-xs text-gray-500">{error}</p>
            </div>
          )}

          {data && <>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <KpiCard
                label="Total de logins"
                value={fmt(data.total_logins)}
                sub={`${fmtFull(data.total_logins)} eventos`}
                meta={`Período: ${data.period_days} dias`}
                accent="blue"
              />
              <KpiCard
                label="Usuários únicos"
                value={fmtFull(data.total_users)}
                sub="identificados no período"
                accent="purple"
              />
              <KpiCard
                label="Computadores ativos"
                value={fmtFull(data.total_computers)}
                sub="ativos registrados"
                accent="amber"
              />
              <KpiCard
                label="Média de logins/dia"
                value={fmt(data.avg_logins_per_day)}
                sub="média diária"
                accent="red"
              />
            </div>

            {/* Ratios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Índices calculados</p>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Computadores por usuário</span>
                    <span className="text-sm font-semibold text-white">
                      ~{(data.total_computers / data.total_users).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-800" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Logins por usuário/dia</span>
                    <span className="text-sm font-semibold text-white">
                      ~{Math.round(data.avg_logins_per_day / data.total_users).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="border-t border-gray-800" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Logins por computador/dia</span>
                    <span className="text-sm font-semibold text-white">
                      ~{Math.round(data.avg_logins_per_day / data.total_computers).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Volume relativo</p>
                <div className="flex flex-col gap-4">
                  <StatBar label="Logins totais"    value={data.total_logins}          max={data.total_logins} color="bg-blue-500" />
                  <StatBar label="Média diária"     value={data.avg_logins_per_day}    max={data.total_logins} color="bg-teal-400" />
                  <StatBar label="Computadores"     value={data.total_computers}       max={data.total_logins} color="bg-purple-400" />
                  <StatBar label="Usuários"         value={data.total_users}           max={data.total_logins} color="bg-amber-400" />
                </div>
              </div>
            </div>

            {/* Footer info */}
            <div className="border border-gray-800 rounded-xl p-4 flex items-center gap-3 bg-blue-500/5">
              <span className="text-blue-400 text-lg">ℹ️</span>
              <p className="text-xs text-gray-400">
                Dados referentes aos últimos <span className="text-white font-medium">{data.period_days} dias</span>.
                Total de <span className="text-white font-medium">{fmtFull(data.total_logins)}</span> eventos de autenticação monitorados,
                com média de <span className="text-white font-medium">{fmt(data.avg_logins_per_day)}</span> logins por dia.
              </p>
            </div>

          </>}
        </div>
      </main>
    </div>
  )
}