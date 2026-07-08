const iconColors = {
  indigo: 'bg-indigo-100 text-indigo-600',
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-emerald-100 text-emerald-600',
  purple: 'bg-violet-100 text-violet-600',
  orange: 'bg-orange-100 text-orange-600',
  amber: 'bg-amber-100 text-amber-600',
  red: 'bg-red-100 text-red-600',
  gray: 'bg-gray-100 text-gray-600',
  slate: 'bg-slate-100 text-slate-600',
}

export default function StatCard({ icon: Icon, label, value, color = 'indigo' }) {
  const iconColor = iconColors[color] || iconColors.indigo

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 transition-all duration-150 hover:border-gray-300 hover:shadow-sm hover:-translate-y-px">
      <div className="flex items-center gap-3.5">
        {Icon && (
          <div className={`w-10 h-10 rounded-lg ${iconColor} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs text-gray-500 font-medium truncate">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-0.5 tabular-nums truncate leading-tight">{value}</p>
        </div>
      </div>
    </div>
  )
}
