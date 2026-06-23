export function StatBar({ label, value, displayValue, max, color = 'bg-blue-500' }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-500 w-40 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-700 w-28 text-right shrink-0">{displayValue}</span>
    </div>
  )
}
