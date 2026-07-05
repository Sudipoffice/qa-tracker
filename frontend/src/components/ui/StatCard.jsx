const gradients = {
  indigo: 'from-indigo-500/10 to-indigo-500/5 text-indigo-600',
  blue: 'from-blue-500/10 to-blue-500/5 text-blue-600',
  green: 'from-emerald-500/10 to-emerald-500/5 text-emerald-600',
  purple: 'from-purple-500/10 to-purple-500/5 text-purple-600',
  orange: 'from-orange-500/10 to-orange-500/5 text-orange-600',
  rose: 'from-rose-500/10 to-rose-500/5 text-rose-600',
  emerald: 'from-emerald-500/10 to-emerald-500/5 text-emerald-600',
  sky: 'from-sky-500/10 to-sky-500/5 text-sky-600',
  slate: 'from-slate-500/10 to-slate-500/5 text-slate-600',
  amber: 'from-amber-500/10 to-amber-500/5 text-amber-600',
}

export default function StatCard({ icon: Icon, label, value, color = 'indigo' }) {
  const gradient = gradients[color] || gradients.indigo

  return (
    <div className="bg-white rounded-xl border border-gray-200/60 p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm text-gray-500 font-medium truncate">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5 truncate">{value}</p>
        </div>
      </div>
    </div>
  )
}
