export function RatioCard({ icon, label, value, desc }) {
  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-gray-400 text-base">{icon}</span>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{desc}</p>
    </div>
  )
}
