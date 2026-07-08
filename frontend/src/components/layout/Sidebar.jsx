import { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FiGrid, FiFolder, FiList, FiChevronLeft, FiChevronRight, FiUser, FiLogOut } from 'react-icons/fi'
import { AuthContext } from '../../context/AuthContext'

const navItems = [
  { to: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/projects', icon: FiFolder, label: 'Projects' },
  { to: '/tasks', icon: FiList, label: 'Tasks' },
]

export default function Sidebar({ collapsed, onToggle }) {
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
    <aside className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 ${collapsed ? 'w-[72px]' : 'w-56'} z-30 bg-white border-r border-gray-200 transition-all duration-200 ease-out`}>
      <div className={`flex items-center h-14 shrink-0 border-b border-gray-200 ${collapsed ? 'justify-center px-0' : 'justify-between px-5'}`}>
        {collapsed ? (
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500 text-white text-xs font-bold">
            QA
          </span>
        ) : (
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500 text-white text-xs font-bold">
              QA
            </span>
            <span className="text-sm font-semibold text-gray-900 tracking-tight">Tracker</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-6 h-6 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
        </button>
      </div>

      <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            Workspace
          </div>
        )}
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center rounded-lg transition-all duration-150 ${
                collapsed ? 'justify-center w-11 h-11 mx-auto' : 'gap-2.5 px-3 py-2'
              } ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
              }`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={collapsed ? 20 : 18} className="shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className={`shrink-0 px-${collapsed ? '2' : '3'} py-3 border-t border-gray-200`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'} px-3 py-2`}>
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-500 text-white text-[10px] font-semibold shrink-0">
            {initials}
          </span>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-900 truncate">{user?.name || user?.email}</p>
              <p className="text-[10px] text-gray-400 truncate capitalize">{user?.role || ''}</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="mt-1 space-y-0.5">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2.5 w-full px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiUser size={13} />
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiLogOut size={13} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
