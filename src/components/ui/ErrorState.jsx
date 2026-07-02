export function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-2">
      <span className="text-2xl">⚠️</span>
      <p className="text-sm text-red-400 font-medium">Falha ao carregar dados</p>
      {message && <p className="text-xs text-gray-500">{message}</p>}
    </div>
  )
}
