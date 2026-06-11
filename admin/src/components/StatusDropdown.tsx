import { useState, useRef, useEffect } from 'react'
import type { OrderStatus } from '../types'
import { useLang } from '../context/LangContext'
import type { TransKey } from '../i18n'

const ALL_STATUSES: OrderStatus[] = ['paid', 'processing', 'on_chain', 'printing', 'shipped', 'completed']

interface Props {
  currentStatus: OrderStatus
  onSelect: (status: OrderStatus) => void
}

export default function StatusDropdown({ currentStatus, onSelect }: Props) {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        className={`status-badge ${currentStatus}`}
        style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
        onClick={e => { e.stopPropagation(); setOpen(o => !o) }}
      >
        {t(`status.${currentStatus}` as TransKey)}
        <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.6, flexShrink: 0 }}>
          <polyline points="4,6 8,10 12,6" />
        </svg>
      </button>

      {open && (
        <div className="status-dropdown-menu" onClick={e => e.stopPropagation()}>
          {ALL_STATUSES.map(status => (
            <button
              key={status}
              className={`status-dropdown-item${status === currentStatus ? ' current' : ''}`}
              onClick={() => { if (status !== currentStatus) onSelect(status); setOpen(false) }}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: status === currentStatus ? 1 : 0, flexShrink: 0 }}>
                <polyline points="2,8 6,12 14,4" />
              </svg>
              <span className={`status-badge ${status}`} style={{ pointerEvents: 'none' }}>
                {t(`status.${status}` as TransKey)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
