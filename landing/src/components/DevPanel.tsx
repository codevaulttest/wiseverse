import { useState } from 'react'
import type { ResultState } from '../screens/ResultScreen'

interface Props {
  current: ResultState | null
  onSelect: (r: ResultState) => void
}


const OPTIONS: { state: ResultState; label: string }[] = [
  { state: 'payment-success',    label: '✓ Pay OK' },
  { state: 'payment-failed',     label: '✕ Pay Fail' },
  { state: 'already-certified',  label: '◈ Duplicate' },
]

export default function DevPanel({ current, onSelect }: Props) {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className={`dev-toggle${open ? ' open' : ''}`}>
      <div className="dev-menu">
        {OPTIONS.map(({ state, label }) => (
          <button
            key={state}
            className={`demo-btn${current === state ? ' active' : ''}`}
            onClick={() => { onSelect(state); setOpen(false) }}
          >
            {label}
          </button>
        ))}
        <div className="dev-sep" />
        <button className="dev-close" onClick={() => setVisible(false)} title="Dismiss">✕</button>
      </div>
      <button className="dev-pill" onClick={() => setOpen(o => !o)}>
        Dev
      </button>
    </div>
  )
}
