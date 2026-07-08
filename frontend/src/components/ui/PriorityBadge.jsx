const priorityStyles = {
  'Low': 'bg-gray-100 text-gray-600',
  'Medium': 'bg-amber-100 text-amber-700',
  'High': 'bg-orange-100 text-orange-700',
  'Critical': 'bg-red-100 text-red-700',
}

export default function PriorityBadge({ priority }) {
  const style = priorityStyles[priority] || 'bg-gray-100 text-gray-600'

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${style}`}>
      {priority}
    </span>
  )
}
