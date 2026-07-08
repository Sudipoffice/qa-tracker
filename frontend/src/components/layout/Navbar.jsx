import { useContext, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiBell, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi'
import { AuthContext } from '../../context/AuthContext'

export default function Navbar({ onMenuToggle, isMobileNavOpen }) {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-[#EDEDF0]">
      <div className="flex items-center h-14 px-4 lg:px-6">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileNavOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>

        <div className="flex-1 flex items-center justify-between ml-2 lg:ml-0">
          <div className="relative w-full max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-9 pl-9 pr-3 bg-[#F4F4F5] rounded-lg text-sm text-gray-700 placeholder:text-gray-400 outline-none transition-colors focus:bg-white focus:border focus:border-[#EDEDF0]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Notifications">
              <FiBell size={16} />
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#6C5CE7] text-white text-xs font-semibold hover:opacity-90 transition-opacity shrink-0"
                aria-label="User menu"
              >
                {initials}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-lg z-50 py-1.5 border border-[#EDEDF0] animate-slide-down">
                  <div className="px-3.5 py-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email || ''}</p>
                  </div>
                  <div className="border-t border-[#EDEDF0] my-1" />
                  <button
                    onClick={() => { navigate('/profile'); setDropdownOpen(false) }}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FiUser size={14} className="text-gray-400" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FiLogOut size={14} className="text-gray-400" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
