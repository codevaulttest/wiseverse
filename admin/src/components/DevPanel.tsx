import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const DISMISSED_KEY = 'wv-admin-dev-dismissed'

const PAGES = [
  { label: 'Login', path: '/login' },
  { label: 'Order list', path: '/orders' },
  { label: 'Order detail (paid)', path: '/orders/ord-007' },
  { label: 'Order detail (processing)', path: '/orders/ord-005' },
  { label: 'Order detail (on_chain)', path: '/orders/ord-004' },
  { label: 'Order detail (completed)', path: '/orders/ord-001' },
  { label: 'NFC Tags', path: '/nfc-tags' },
]

export default function DevPanel() {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(DISMISSED_KEY) === '1'
  )
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (dismissed) sessionStorage.setItem(DISMISSED_KEY, '1')
  }, [dismissed])

  if (dismissed) return null

  return (
    <div className="dev-capsule">
      {open && (
        <div className="dev-menu">
          <div className="dev-section-label">Navigate to</div>
          {PAGES.map(({ label, path }) => (
            <button
              key={path}
              className={`dev-btn ${location.pathname === path ? 'active' : ''}`}
              onClick={() => { navigate(path); setOpen(false) }}
            >
              {label}
            </button>
          ))}
          <div className="dev-section-label">Actions</div>
          <button
            className="dev-btn dev-dismiss"
            onClick={() => { setDismissed(true); setOpen(false) }}
          >
            ✕ Dismiss (reappears on reload)
          </button>
        </div>
      )}
      <button
        className="dev-toggle-btn"
        onClick={() => setOpen(o => !o)}
      >
        {open ? '✕ Dev' : 'Dev ◈'}
      </button>
    </div>
  )
}
