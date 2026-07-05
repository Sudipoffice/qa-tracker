import { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FiGrid, FiFolder, FiUser, FiLogOut } from 'react-icons/fi'
import { AuthContext } from '../../context/AuthContext'

const navItems = [
  { to: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/projects', icon: FiFolder, label: 'Projects' },
  { to: '/profile', icon: FiUser, label: 'Profile' },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gray-950 text-gray-400 w-64">
      <div className="flex items-center gap-3 px-5 h-16 shrink-0 border-b border-gray-800">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 text-white text-sm font-bold leading-none">
          QA
        </span>
        <span className="text-base font-semibold tracking-tight text-white">
          Tracker
        </span>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-600/10 text-white'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-indigo-500 rounded-r-full" />
                )}
                <Icon size={18} className="shrink-0" />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-800 px-4 py-4 space-y-3">
        {user && (
          <div className="flex items-center gap-3 px-1">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-semibold shrink-0">
              {initials}
            </span>
            <span className="text-sm text-gray-300 truncate">{user.name || user.email}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors hover:text-red-400"
        >
          <FiLogOut size={16} className="shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:block fixed top-0 left-0 h-screen z-30">
        {sidebarContent}
      </aside>

      <aside
        className={`lg:hidden fixed top-0 left-0 h-screen z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
        />
      )}
    </>
  )
}
