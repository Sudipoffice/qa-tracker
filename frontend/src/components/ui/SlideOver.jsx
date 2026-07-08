import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'

export default function SlideOver({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-xl animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between px-5 h-14 border-b border-[#EDEDF0] shrink-0">
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100 p-1.5 -mr-1.5"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
