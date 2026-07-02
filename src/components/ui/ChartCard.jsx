import { LoadingSpinner } from './LoadingSpinner'
import { ErrorState } from './ErrorState'

export function ChartCard({ title, loading, error, action, children }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          {title}
        </h3>
        {action}
      </div>
      {loading && <LoadingSpinner />}
      {error && <ErrorState message={error} />}
      {!loading && !error && children}
    </div>
  )
}
