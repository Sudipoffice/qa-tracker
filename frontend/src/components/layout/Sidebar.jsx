import { useContext, useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FiGrid, FiFolder, FiChevronDown, FiUser, FiLogOut } from 'react-icons/fi'
import { AuthContext } from '../../context/AuthContext'

const navItems = [
  { to: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/projects', icon: FiFolder, label: 'Projects' },
]

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [accountOpen, setAccountOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAccountOpen(false)
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
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-56 z-30 bg-slate-900">
      <div className="flex items-center gap-2.5 h-14 px-5 shrink-0 border-b border-white/10">
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500 text-white text-xs font-bold">
          QA
        </span>
        <span className="text-sm font-semibold text-white/90 tracking-tight">
          Tracker
        </span>
      </div>

      <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
          Workspace
        </div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400 border-l-[3px] border-indigo-500 rounded-l-none'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`
            }
          >
            <Icon size={16} className="shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 px-3 py-3 border-t border-white/10" ref={dropdownRef}>
        <button
          onClick={() => setAccountOpen(!accountOpen)}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all duration-150"
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-white text-[10px] font-semibold shrink-0">
            {initials}
          </span>
          <span className="text-xs truncate flex-1 text-left">{user?.name || user?.email}</span>
          <FiChevronDown size={12} className={`transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
        </button>

        {accountOpen && (
          <div className="mt-1 py-1 bg-slate-800 rounded-lg border border-white/10 animate-slide-down">
            <button
              onClick={() => { navigate('/profile'); setAccountOpen(false) }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors rounded-lg"
            >
              <FiUser size={14} />
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors rounded-lg"
            >
              <FiLogOut size={14} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
