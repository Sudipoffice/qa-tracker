import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'

const sizes = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-xl shadow-2xl p-6 w-full ${sizes[size]} animate-scale-in`}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100 p-1.5 -mr-1.5"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}
