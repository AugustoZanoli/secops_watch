import { KpisRow } from './widgets/KpisRow'
import { RatiosCard } from './widgets/RatiosCard'
import { UserRiskDistribution } from './widgets/UserRiskDistribution'
import { FailedLoginsKpi } from './widgets/FailedLoginsKpi'
import { FailedLoginsChart } from './widgets/FailedLoginsChart'
import { AnomalyTypesChart } from './widgets/AnomalyTypesChart'
import { AccessHeatmap } from './widgets/AccessHeatmap'
import { TopComputersChart } from './widgets/TopComputersChart'
import { DailyLoginsChart } from './widgets/DailyLoginsChart'
import { TopUsersChart } from './widgets/TopUsersChart'
import { UserRiskTable } from './widgets/UserRiskTable'
import { PeriodProvider } from '../contexts/PeriodContext'

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
      </header>

      <main className="p-8 max-w-[1600px] mx-auto">

        <SectionHeader>Visão Geral</SectionHeader>
        <KpisRow />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <RatiosCard />
          <UserRiskDistribution />
        </div>

        <SectionHeader>Sinais de Risco</SectionHeader>
        <FailedLoginsKpi />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <FailedLoginsChart />
          <AnomalyTypesChart />
        </div>
        <div className="mt-4">
          <AccessHeatmap />
        </div>
        <div className="mt-4">
          <TopComputersChart />
        </div>

        <SectionHeader>Atividade</SectionHeader>
        <PeriodProvider>
          <DailyLoginsChart />
        </PeriodProvider>
        <div className="mt-4">
          <TopUsersChart />
        </div>

        <SectionHeader>Detalhamento</SectionHeader>
        <UserRiskTable />

      </main>
    </div>
  )
}
