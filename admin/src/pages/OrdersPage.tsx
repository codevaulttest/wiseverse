import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import type { Order, OrderStatus } from '../types'
import { STATUS_LABELS } from '../mock/data'

interface Props {
  orders: Order[]
}

const STATUS_FILTERS: Array<{ key: OrderStatus | 'all'; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'paid', label: '待处理' },
  { key: 'processing', label: '处理中' },
  { key: 'completed', label: '已完成' },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function countByFilter(orders: Order[], key: OrderStatus | 'all') {
  if (key === 'all') return orders.length
  if (key === 'paid') return orders.filter(o => o.status === 'paid' || o.status === 'pending_payment').length
  if (key === 'processing') return orders.filter(o => ['processing', 'on_chain', 'printing', 'shipped'].includes(o.status)).length
  if (key === 'completed') return orders.filter(o => o.status === 'completed').length
  return 0
}

function filterOrders(orders: Order[], key: OrderStatus | 'all') {
  const filtered = (() => {
    if (key === 'all') return orders
    if (key === 'paid') return orders.filter(o => o.status === 'paid' || o.status === 'pending_payment')
    if (key === 'processing') return orders.filter(o => ['processing', 'on_chain', 'printing', 'shipped'].includes(o.status))
    if (key === 'completed') return orders.filter(o => o.status === 'completed')
    return orders
  })()
  return [...filtered].sort((a, b) =>
    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  )
}

export default function OrdersPage({ orders }: Props) {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all')

  const visible = filterOrders(orders, activeFilter)

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
      </div>

      <div className="stats-row">
        {STATUS_FILTERS.map(({ key, label }) => (
          <button
            key={key}
            className={`stat-chip ${activeFilter === key ? 'active' : ''}`}
            onClick={() => setActiveFilter(key)}
          >
            {label}
            <span className="count">{countByFilter(orders, key)}</span>
          </button>
        ))}
      </div>

      <div className="filter-bar">
        <select
          className="filter-select"
          value={activeFilter}
          onChange={e => setActiveFilter(e.target.value as OrderStatus | 'all')}
        >
          <option value="all">所有状态</option>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Name</th>
              <th>Address</th>
              <th>Email address</th>
              <th>Video file name</th>
              <th>状态</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">暂无订单</div>
                </td>
              </tr>
            ) : (
              visible.map(order => (
                <tr key={order.id} onClick={() => navigate(`/orders/${order.id}`)}>
                  <td>
                    <span className="td-ref">{order.referenceNumber}</span>
                  </td>
                  <td>
                    <div className="td-name">{order.customerName}</div>
                    <div className="td-company">{order.companyName}</div>
                  </td>
                  <td className="td-date">{order.address}, {order.country}</td>
                  <td className="td-date">{order.customerEmail}</td>
                  <td style={{ maxWidth: 220 }}>
                    <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 400 }}>{order.works[0].title}</div>
                  </td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="td-arrow">→</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
