import { useState, useRef, useEffect } from 'react'
import {
  CreditCard, Loader, Link2, Printer, Truck, CheckCircle, ChevronDown, Check,
} from 'lucide-react'
import type { OrderStatus } from '../types'
import { useLang } from '../context/LangContext'
import type { TransKey } from '../i18n'

const ALL_STATUSES: OrderStatus[] = ['paid', 'processing', 'on_chain', 'printing', 'shipped', 'completed']

const STATUS_ICON: Record<OrderStatus, React.ReactNode> = {
  paid:       <CreditCard size={13} />,
  processing: <Loader size={13} />,
  on_chain:   <Link2 size={13} />,
  printing:   <Printer size={13} />,
  shipped:    <Truck size={13} />,
  completed:  <CheckCircle size={13} />,
}

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
        {STATUS_ICON[currentStatus]}
        {t(`status.${currentStatus}` as TransKey)}
        <ChevronDown size={11} style={{ opacity: 0.6, flexShrink: 0 }} />
      </button>

      {open && (
        <div className="status-dropdown-menu" onClick={e => e.stopPropagation()}>
          {ALL_STATUSES.map(status => (
            <button
              key={status}
              className={`status-dropdown-item${status === currentStatus ? ' current' : ''}`}
              onClick={() => { if (status !== currentStatus) onSelect(status); setOpen(false) }}
            >
              <Check size={12} color="var(--gold)" style={{ opacity: status === currentStatus ? 1 : 0, flexShrink: 0 }} />
              <span className={`status-badge ${status}`} style={{ pointerEvents: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                {STATUS_ICON[status]}
                {t(`status.${status}` as TransKey)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
