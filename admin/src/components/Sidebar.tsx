import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const NAV = [
  {
    to: '/orders',
    label: 'Orders',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="2" y="2" width="12" height="12" rx="2" />
        <line x1="5" y1="6" x2="11" y2="6" />
        <line x1="5" y1="9" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    to: '/nfc-tags',
    label: 'NFC Tags',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="2" y="4" width="12" height="8" rx="1.5" />
        <circle cx="8" cy="8" r="1.5" />
        <path d="M5.5 5.5 A3.5 3.5 0 0 0 5.5 10.5" />
        <path d="M10.5 5.5 A3.5 3.5 0 0 1 10.5 10.5" />
      </svg>
    ),
  },
]

export default function Sidebar({ onLogout }: { onLogout: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()

  function handleLogout() {
    onLogout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/wiseverse-logo.svg" alt="" />
        <span className="sidebar-logo-text">WISEVERSE</span>
      </div>

      <div className="sidebar-label">Menu</div>

      <nav className="sidebar-nav">
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              'sidebar-link' + (isActive || location.pathname.startsWith(to) ? ' active' : '')
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div>Signed in as</div>
            <div className="sidebar-user-email">admin@wiseverse.net</div>
          </div>
          <button
            className="theme-toggle"
            onClick={toggle}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
        <button
          className="btn btn-ghost btn-sm btn-full"
          onClick={handleLogout}
          style={{ marginTop: 10 }}
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
