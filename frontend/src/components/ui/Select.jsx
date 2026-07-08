export default function Select({
  label,
  options,
  value,
  onChange,
  error,
  className = '',
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all duration-150 bg-white text-gray-900 ${
          error
            ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-400'
            : 'border-[#EDEDF0] focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7]'
        } ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
