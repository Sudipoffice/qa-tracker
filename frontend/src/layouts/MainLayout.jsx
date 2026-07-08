import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FiGrid, FiFolder, FiX } from 'react-icons/fi'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'

const navItems = [
  { to: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/projects', icon: FiFolder, label: 'Projects' },
]

function MobileSidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/40" onClick={onClose} />
      )}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-[#0F1117] z-40 transform transition-transform duration-200 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#6C5CE7] text-white text-xs font-bold">
              QA
            </span>
            <span className="text-sm font-semibold text-white/90">Tracker</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <FiX size={18} />
          </button>
        </div>
        <nav className="py-3 px-2.5 space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#6C5CE7]/10 text-white'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`
              }
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default function MainLayout({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <Sidebar />
      <MobileSidebar
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="lg:pl-56">
        <Navbar
          onMenuToggle={() => setMobileNavOpen(prev => !prev)}
          isMobileNavOpen={mobileNavOpen}
        />
        <main className="p-4 lg:p-6 xl:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
