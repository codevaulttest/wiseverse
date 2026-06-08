import { useApp } from '../context/AppContext'

export default function StatusPill() {
  const { state, t } = useApp()
  const text = state === 'verified' ? t.pill_verified
             : state === 'onchain'  ? t.pill_onchain
             : t.pill_invalid

  return (
    <div className="status-pill">
      <span className="pill-dot" />
      <span>{text}</span>
    </div>
  )
}
