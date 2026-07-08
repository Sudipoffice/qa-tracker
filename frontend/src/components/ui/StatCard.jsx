const iconColors = {
  indigo: 'bg-[#6C5CE7]/10 text-[#6C5CE7]',
  blue: 'bg-[#3B82F6]/10 text-[#3B82F6]',
  green: 'bg-[#22C55E]/10 text-[#22C55E]',
  purple: 'bg-[#8B5CF6]/10 text-[#8B5CF6]',
  orange: 'bg-[#F97316]/10 text-[#F97316]',
  amber: 'bg-[#F59E0B]/10 text-[#D97706]',
  red: 'bg-[#EF4444]/10 text-[#EF4444]',
  yellow: 'bg-[#F59E0B]/10 text-[#B45309]',
  gray: 'bg-gray-100 text-gray-600',
}

export default function StatCard({ icon: Icon, label, value, color = 'indigo' }) {
  const iconColor = iconColors[color] || iconColors.indigo

  return (
    <div className="bg-white rounded-xl border border-[#EDEDF0] p-4 transition-all duration-150 hover:border-gray-200 hover:shadow-sm">
      <div className="flex items-center gap-3.5">
        {Icon && (
          <div className={`w-10 h-10 rounded-lg ${iconColor} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs text-gray-500 font-medium truncate">{label}</p>
          <p className="text-xl font-bold text-gray-900 mt-0.5 truncate">{value}</p>
        </div>
      </div>
    </div>
  )
}
