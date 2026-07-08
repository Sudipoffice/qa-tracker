import { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FiGrid, FiFolder, FiLogOut } from 'react-icons/fi'
import { AuthContext } from '../../context/AuthContext'

const navItems = [
  { to: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/projects', icon: FiFolder, label: 'Projects' },
]

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-56 z-30 bg-[#0F1117]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 h-14 px-5 shrink-0 border-b border-white/5">
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#6C5CE7] text-white text-xs font-bold">
          QA
        </span>
        <span className="text-sm font-semibold text-white/90 tracking-tight">
          Tracker
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                isActive
                  ? 'bg-[#6C5CE7]/10 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`
            }
          >
            <Icon size={16} className="shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User area */}
      <div className="shrink-0 px-3 py-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all duration-150"
        >
          <FiLogOut size={16} className="shrink-0" />
          <span>Sign out</span>
        </button>
        <div className="flex items-center gap-2.5 px-3 py-2 mt-0.5">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#6C5CE7] text-white text-[10px] font-semibold shrink-0">
            {initials}
          </span>
          <span className="text-xs text-gray-400 truncate">{user?.name || user?.email}</span>
        </div>
      </div>
    </aside>
  )
}
