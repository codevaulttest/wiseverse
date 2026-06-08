import { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { VerifyState } from '../types'

export default function DevPanel() {
  const { state, setState, theme, toggleTheme, startLoading } = useApp()
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  const setDemoState = (s: VerifyState) => setState(s)

  return (
    <div className={`dev-toggle${open ? ' open' : ''}`}>
      <div className="dev-menu">
        <button
          className={`demo-btn${state === 'verified' ? ' active' : ''}`}
          onClick={() => setDemoState('verified')}
        >
          ✓ 已验证
        </button>
        <button
          className={`demo-btn${state === 'onchain' ? ' active' : ''}`}
          onClick={() => setDemoState('onchain')}
        >
          ◈ 仅链上
        </button>
        <button
          className={`demo-btn${state === 'invalid' ? ' active' : ''}`}
          onClick={() => setDemoState('invalid')}
        >
          ✕ 无效
        </button>
        <button className="demo-btn" onClick={startLoading}>
          ↻ 加载页
        </button>
        <div className="dev-sep" />
        <button className="dev-theme-btn" onClick={toggleTheme}>
          {theme === 'dark' ? '☀ Light' : '☾ Dark'}
        </button>
        <button className="dev-close" onClick={() => setVisible(false)} title="Dismiss">
          ✕
        </button>
      </div>
      <button className="dev-pill" onClick={() => setOpen(o => !o)}>
        Dev
      </button>
    </div>
  )
}
