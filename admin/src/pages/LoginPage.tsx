import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@wiseverse.net')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate('/orders')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo-wrap">
          <img src="/wiseverse-logo.svg" alt="Wiseverse" />
          <span className="brand">WISEVERSE</span>
          <span className="sub">Admin Console</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@wiseverse.net"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Password</label>
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
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
