import Button from './Button'

export default function EmptyState({ icon: Icon, title, description, action }) {
  const renderAction = () => {
    if (!action) return null
    if (typeof action === 'object' && action.label && action.onClick) {
      return <Button onClick={action.onClick}>{action.label}</Button>
    }
    return <div>{action}</div>
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {Icon && (
        <div className="text-4xl text-gray-300 mb-4">
          <Icon />
        </div>
      )}
      {title && (
        <h3 className="text-lg font-medium text-gray-500 mb-1">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-gray-400 mb-4 text-center max-w-sm">{description}</p>
      )}
      {renderAction()}
    </div>
  );
}
