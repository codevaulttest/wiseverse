import { STATUS_LABELS } from '../mock/data'
import type { OrderStatus } from '../types'

interface Props {
  status: OrderStatus | 'available' | 'assigned'
  label?: string
}

export default function StatusBadge({ status, label }: Props) {
  const displayLabel = label ?? STATUS_LABELS[status] ?? status
  return (
    <span className={`status-badge ${status}`}>
      {displayLabel}
    </span>
  )
}
