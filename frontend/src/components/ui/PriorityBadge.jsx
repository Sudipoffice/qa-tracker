const priorityStyles = {
  'Low': 'bg-gray-100 text-gray-600',
  'Medium': 'bg-amber-50 text-[#D97706]',
  'High': 'bg-orange-50 text-[#EA580C]',
  'Critical': 'bg-red-50 text-[#DC2626]',
}

export default function PriorityBadge({ priority }) {
  const style = priorityStyles[priority] || 'bg-gray-100 text-gray-600'

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${style}`}>
      {priority}
    </span>
  )
}
