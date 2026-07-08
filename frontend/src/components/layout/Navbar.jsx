import { useContext, useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiSearch, FiBell, FiMenu, FiX, FiUser, FiLogOut, FiCommand } from 'react-icons/fi'
import { AuthContext } from '../../context/AuthContext'

const pageTitles = {
  '/dashboard': 'Project Dashboard',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
  '/profile': 'Profile',
}

const pageSubtitles = {
  '/dashboard': 'Manage and track your projects',
  '/projects': 'Manage and organize your projects',
  '/tasks': 'Track and manage all tasks',
}

const notifications = [
  { id: 1, text: 'Task "Login flow QA" assigned to you', time: '5m ago', unread: true },
  { id: 2, text: 'Project "Q3 Release" status updated to In Progress', time: '1h ago', unread: true },
  { id: 3, text: 'Critical bug #129 opened in Payments', time: '3h ago', unread: false },
  { id: 4, text: 'Sprint review starts in 30 minutes', time: '4h ago', unread: false },
]

export default function Navbar({ onMenuToggle, isMobileNavOpen }) {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const dropdownRef = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
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

  const pageTitle = pageTitles[location.pathname] || ''
  const pageSubtitle = pageSubtitles[location.pathname] || ''

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center h-16 px-4 lg:px-6">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileNavOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>

        <div className="hidden sm:block mr-8">
          {pageSubtitle && (
            <p className="text-xs text-gray-400 font-medium">{pageSubtitle}</p>
          )}
          {pageTitle && (
            <h1 className="text-xl font-bold text-gray-900 -mt-0.5">{pageTitle}</h1>
          )}
        </div>

        <div className="flex-1 flex items-center justify-end gap-3">
          <div className="relative w-full max-w-xs hidden md:block">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search tasks, projects..."
              className="w-full h-10 pl-10 pr-16 bg-gray-50 rounded-full text-sm text-gray-700 placeholder:text-gray-400 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 border border-gray-200"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gray-200 text-gray-500 text-[10px] font-medium">
              <FiCommand size={10} />K
            </span>
          </div>

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(prev => !prev)}
              className="relative flex items-center justify-center w-9 h-9 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <FiBell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-white" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-80 bg-white rounded-xl shadow-lg z-50 border border-gray-200 animate-slide-down">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  <span className="text-[11px] text-indigo-600 font-medium hover:text-indigo-700 cursor-pointer">Mark all read</span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${n.unread ? 'bg-indigo-50/50' : ''}`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-indigo-500' : 'bg-transparent'}`} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm ${n.unread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>{n.text}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 px-4 py-2.5 text-center">
                  <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="User menu"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500 text-white text-xs font-semibold shrink-0">
                {initials}
              </span>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-900 leading-tight">{user?.name || 'User'}</p>
                <p className="text-[11px] text-gray-400 leading-tight capitalize">{user?.role || ''}</p>
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-lg z-50 py-1.5 border border-gray-200 animate-slide-down">
                <div className="px-3.5 py-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email || ''}</p>
                </div>
                <div className="border-t border-gray-200 my-1" />
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
    </header>
  )
}
