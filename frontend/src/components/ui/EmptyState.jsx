export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-gray-400" />
        </div>
      )}
      {title && (
        <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-gray-500 mb-5 text-center max-w-sm">{description}</p>
      )}
      {action && action}
    </div>
  )
}
