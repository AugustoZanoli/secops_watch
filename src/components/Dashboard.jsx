import { KpisRow } from './widgets/KpisRow'
import { RatiosCard } from './widgets/RatiosCard'
import { UserRiskDistribution } from './widgets/UserRiskDistribution'
import { FailedLoginsKpi } from './widgets/FailedLoginsKpi'
import { OutOfPatternKpi } from './widgets/OutOfPatternKpi'
import { FailedLoginsChart } from './widgets/FailedLoginsChart'
import { AnomalyTypesChart } from './widgets/AnomalyTypesChart'
import { AccessHeatmap } from './widgets/AccessHeatmap'
import { RequestsByIpChart } from './widgets/RequestsByIpChart'
import { DailyLoginsChart } from './widgets/DailyLoginsChart'
import { TopUsersChart } from './widgets/TopUsersChart'
import { TopComputersChart } from './widgets/TopComputersChart'
import { UserRiskTable } from './widgets/UserRiskTable'

function SectionHeader({ children }) {
  return (
    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 mt-8">
      {children}
    </h2>
  )
}

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">

      <header className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">SecOps Watch</h1>
          <p className="text-xs text-gray-500">Dashboard de segurança</p>
        </div>
        <div className="flex items-center gap-2">
          {['24h', '7d', '30d'].map(t => (
            <button
              key={t}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors"
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <main className="p-8 max-w-[1600px] mx-auto">

        <SectionHeader>Visão Geral</SectionHeader>
        <KpisRow />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <RatiosCard />
          <UserRiskDistribution />
        </div>

        <SectionHeader>Sinais de Risco</SectionHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FailedLoginsKpi />
          <OutOfPatternKpi />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <FailedLoginsChart />
          <AnomalyTypesChart />
        </div>
        <div className="mt-4">
          <AccessHeatmap />
        </div>
        <div className="mt-4">
          <RequestsByIpChart />
        </div>

        <SectionHeader>Atividade</SectionHeader>
        <DailyLoginsChart />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <TopUsersChart />
          <TopComputersChart />
        </div>

        <SectionHeader>Detalhamento</SectionHeader>
        <UserRiskTable />

      </main>
    </div>
  )
}
