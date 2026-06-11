import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'

export default function LoginPage({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState('admin@wiseverse.net')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { t } = useLang()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onLogin(email)
    navigate('/orders')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo-wrap">
          <img src="/wiseverse-logo.svg" alt="Wiseverse" />
          <span className="brand">WISEVERSE</span>
          <span className="sub">{t('login.sub')}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">{t('login.email')}</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@wiseverse.net"
            />
          </div>
          <div className="form-field">
            <label className="form-label">{t('login.password')}</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <button type="submit" className="btn btn-primary btn-full">
              {t('login.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
