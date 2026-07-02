import { LoadingSpinner } from './LoadingSpinner'
import { ErrorState } from './ErrorState'

export function ChartCard({ title, loading, error, children }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
        {title}
      </h3>
      {loading && <LoadingSpinner />}
      {error && <ErrorState message={error} />}
      {!loading && !error && children}
    </div>
  )
}
