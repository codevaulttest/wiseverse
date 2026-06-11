import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useLang } from '../context/LangContext'
import Modal from './Modal'
import type { AdminUser } from '../types'

export default function Sidebar({ currentUser, onLogout, onChangePassword }: { currentUser: AdminUser | null; onLogout: () => void; onChangePassword: (currentPwd: string, newPwd: string) => string | null }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { lang, setLang, t } = useLang()
  const [showPopover, setShowPopover] = useState(false)
  const [showChangePwd, setShowChangePwd] = useState(false)
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdError, setPwdError] = useState('')
  const [pwdSuccess, setPwdSuccess] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showPopover) return
    function onDown(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowPopover(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [showPopover])

  function openChangePwd() {
    setShowPopover(false)
    setCurrentPwd('')
    setNewPwd('')
    setConfirmPwd('')
    setPwdError('')
    setPwdSuccess(false)
    setShowChangePwd(true)
  }

  function handleChangePwd(e: React.FormEvent) {
    e.preventDefault()
    setPwdError('')
    if (newPwd.length < 6) { setPwdError(t('changePwd.errLength')); return }
    if (newPwd !== confirmPwd) { setPwdError(t('changePwd.errMatch')); return }
    const err = onChangePassword(currentPwd, newPwd)
    if (err === 'wrong_current') { setPwdError(t('changePwd.errCurrent')); return }
    setPwdSuccess(true)
    setTimeout(() => setShowChangePwd(false), 1200)
  }

  const initials = currentUser
    ? (currentUser.name?.trim().slice(0, 1) || currentUser.email.slice(0, 1)).toUpperCase()
    : '?'

  const NAV = [
    {
      to: '/orders',
      label: t('nav.orders'),
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
      label: t('nav.nfcTags'),
      icon: (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="2" y="4" width="12" height="8" rx="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <path d="M5.5 5.5 A3.5 3.5 0 0 0 5.5 10.5" />
          <path d="M10.5 5.5 A3.5 3.5 0 0 1 10.5 10.5" />
        </svg>
      ),
    },
    {
      to: '/email-preview',
      label: t('nav.emailTemplates'),
      icon: (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="1" y="3" width="14" height="10" rx="1.5" />
          <polyline points="1,3 8,9 15,3" />
        </svg>
      ),
    },
    {
      to: '/admin-users',
      label: t('nav.permissions'),
      icon: (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="8" cy="5" r="2.5" />
          <path d="M3 14c0-3 2.2-5 5-5s5 2 5 5" />
        </svg>
      ),
    },
  ]

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

      <div className="sidebar-label">{t('nav.menu')}</div>

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

      <div className="sidebar-footer" ref={popoverRef}>
        {showPopover && (
          <div className="sidebar-popover">
            <div className="sidebar-popover-header">
              <span className="sidebar-popover-email">{currentUser?.email ?? ''}</span>
            </div>
            <div className="sidebar-popover-section">
              <button className="sidebar-popover-action" onClick={openChangePwd}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="7" width="10" height="7" rx="1.5" />
                  <path d="M5 7V5a3 3 0 0 1 6 0v2" />
                </svg>
                {t('changePwd.btn')}
              </button>
            </div>
            <div className="sidebar-popover-sep" />
            <div className="sidebar-popover-section">
              <button className="sidebar-popover-action danger" onClick={handleLogout}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3" />
                  <polyline points="10,5 13,8 10,11" />
                  <line x1="13" y1="8" x2="5" y2="8" />
                </svg>
                {t('sidebar.signOut')}
              </button>
            </div>
          </div>
        )}

        <div className="sidebar-lang-toggle" style={{ marginBottom: 6, marginLeft: 8 }}>
          {(['en', 'zh'] as const).map(l => (
            <button
              key={l}
              className="sidebar-lang-btn"
              data-active={lang === l}
              onClick={() => setLang(l)}
            >
              {l === 'en' ? 'EN' : '中文'}
            </button>
          ))}
        </div>

        <button
          className="sidebar-profile-chip"
          onClick={() => setShowPopover(v => !v)}
        >
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-profile-info">
            <span className="sidebar-user-email">{currentUser?.email ?? ''}</span>
          </div>
          <svg className={`sidebar-chevron${showPopover ? ' open' : ''}`} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="6,4 10,8 6,12" />
          </svg>
        </button>
      </div>

      {showChangePwd && (
        <Modal title={t('changePwd.title')} onClose={() => setShowChangePwd(false)}>
          {pwdSuccess ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-88)' }}>
              {t('changePwd.success')}
            </div>
          ) : (
            <form onSubmit={handleChangePwd}>
              <div className="form-field">
                <label className="form-label">{t('changePwd.current')}</label>
                <input
                  type="password"
                  className="form-input"
                  value={currentPwd}
                  onChange={e => setCurrentPwd(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                />
              </div>
              <div className="form-field">
                <label className="form-label">{t('changePwd.new')}</label>
                <input
                  type="password"
                  className="form-input"
                  value={newPwd}
                  onChange={e => setNewPwd(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="form-field">
                <label className="form-label">{t('changePwd.confirm')}</label>
                <input
                  type="password"
                  className="form-input"
                  value={confirmPwd}
                  onChange={e => setConfirmPwd(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              {pwdError && (
                <div style={{ color: 'var(--red, #e55)', fontSize: 13, marginBottom: 8 }}>
                  {pwdError}
                </div>
              )}
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowChangePwd(false)}>
                  {t('common.cancel')}
                </button>
                <button type="submit" className="btn btn-primary">
                  {t('changePwd.submit')}
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </aside>
  )
}
