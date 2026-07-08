import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

export default function Input({
  label,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2 rounded-lg border transition-all duration-150 outline-none text-sm ${
            error
              ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-400'
              : 'border-[#EDEDF0] focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7]'
          } ${isPassword ? 'pr-10' : ''} ${className}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
