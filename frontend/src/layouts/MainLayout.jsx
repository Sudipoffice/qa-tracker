import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { FiGrid, FiFolder, FiList, FiX } from 'react-icons/fi'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'

const navItems = [
  { to: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/projects', icon: FiFolder, label: 'Projects' },
  { to: '/tasks', icon: FiList, label: 'Tasks' },
]

function MobileSidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="lg:hidden fixed inset-0 z-30 bg-black/40" onClick={onClose} />}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white z-40 transform transition-transform duration-200 ease-out border-r border-gray-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500 text-white text-xs font-bold">QA</span>
            <span className="text-sm font-semibold text-gray-900">Tracker</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><FiX size={18} /></button>
        </div>
        <nav className="py-3 px-2.5 space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to} to={to} onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon size={16} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default function MainLayout({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved === 'true'
  })

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed))
  }, [sidebarCollapsed])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EEF1F6' }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <MobileSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className={`transition-all duration-200 ease-out ${sidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-56'}`}>
        <Navbar onMenuToggle={() => setMobileNavOpen(prev => !prev)} isMobileNavOpen={mobileNavOpen} />
        <div className="mx-auto" style={{ maxWidth: '1440px' }}>
          <div className="bg-[#FBFBFC] rounded-[28px] border border-gray-200/60 shadow-sm m-4 lg:m-6 overflow-hidden">
            <main className="p-5 lg:p-7 xl:p-8">
              <div className="max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
