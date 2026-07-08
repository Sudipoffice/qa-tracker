const statusStyles = {
  'Todo': 'bg-orange-50 text-[#F97316]',
  'In Progress': 'bg-yellow-50 text-[#B45309]',
  'QA': 'bg-purple-50 text-[#6C5CE7]',
  'Done': 'bg-emerald-50 text-[#22C55E]',
}

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-700'

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${style}`}>
      {status}
    </span>
  )
}
