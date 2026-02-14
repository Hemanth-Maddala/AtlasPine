import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from './Sidebar'

export default function Layout({ children, currentPage, onPageChange, user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-screen overflow-hidden text-slate-300 flex flex-col sm:flex-row" style={{ background: 'var(--bg-base)' }}>
      {/* Sidebar - fixed height so it never scrolls with content */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={onPageChange}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        user={user}
        onLogout={onLogout}
      />

      {/* Main Content Area - only this section scrolls */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Mobile Header */}
        <header
          className={`lg:hidden flex-shrink-0 border-b px-4 py-3 ${sidebarOpen ? "hidden" : "flex"}`}
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >          <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors"
          aria-label="Open menu"
        >
            ☰
          </button>
        </header>

        {/* Page Content - relative so absolute children (e.g. Home) don't cover the header */}
        <main className="flex-1 min-h-0 overflow-auto p-4 sm:p-6 lg:p-8 scrollbar-thin relative">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover />
    </div>
  )
}


