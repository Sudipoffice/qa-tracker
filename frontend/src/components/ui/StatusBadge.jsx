const statusStyles = {
  'Todo': 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  'QA': 'bg-violet-100 text-violet-700',
  'Done': 'bg-emerald-100 text-emerald-700',
}

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-700'

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${style}`}>
      {status}
    </span>
  )
}
