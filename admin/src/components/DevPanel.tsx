import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const DISMISSED_KEY = 'wv-admin-dev-dismissed'

const PAGES = [
  { label: '登录页', path: '/login' },
  { label: '订单列表', path: '/orders' },
  { label: '订单详情 (paid)', path: '/orders/ord-007' },
  { label: '订单详情 (processing)', path: '/orders/ord-005' },
  { label: '订单详情 (on_chain)', path: '/orders/ord-004' },
  { label: '订单详情 (completed)', path: '/orders/ord-001' },
  { label: 'NFC Tags', path: '/nfc-tags' },
  { label: '邮件模板', path: '/email-preview' },
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
          <div className="dev-section-label">页面跳转</div>
          {PAGES.map(({ label, path }) => (
            <button
              key={path}
              className={`dev-btn ${location.pathname === path ? 'active' : ''}`}
              onClick={() => { navigate(path); setOpen(false) }}
            >
              {label}
            </button>
          ))}
          <div className="dev-section-label">操作</div>
          <button
            className="dev-btn dev-dismiss"
            onClick={() => { setDismissed(true); setOpen(false) }}
          >
            ✕ 关闭（刷新后重现）
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
