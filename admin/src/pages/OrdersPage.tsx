import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import type { Order, OrderStatus } from '../types'
import { STATUS_LABELS } from '../mock/data'

interface Props {
  orders: Order[]
}

const STATUS_FILTER_KEYS: Array<OrderStatus | 'all'> = [
  'all', 'paid', 'processing', 'on_chain', 'printing', 'shipped', 'completed',
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function matchesSearch(order: Order, q: string) {
  const s = q.toLowerCase()
  return (
    order.referenceNumber.toLowerCase().includes(s) ||
    order.customerName.toLowerCase().includes(s) ||
    order.customerEmail.toLowerCase().includes(s) ||
    order.address.toLowerCase().includes(s) ||
    order.works[0].title.toLowerCase().includes(s)
  )
}

function filterOrders(orders: Order[], key: OrderStatus | 'all', query: string) {
  let result = key === 'all' ? orders : orders.filter(o => o.status === key)
  if (query.trim()) result = result.filter(o => matchesSearch(o, query))
  return [...result].sort((a, b) =>
    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  )
}

const PAGE_SIZE = 10

export default function OrdersPage({ orders }: Props) {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = filterOrders(orders, activeFilter, query)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleFilter(key: OrderStatus | 'all') {
    setActiveFilter(key)
    setPage(1)
  }

  function handleSearch(q: string) {
    setQuery(q)
    setPage(1)
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <div className="search-wrap">
          <svg className="search-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="6.5" cy="6.5" r="4.5" />
            <line x1="10" y1="10" x2="14" y2="14" />
          </svg>
          <input
            className="search-input"
            type="search"
            placeholder="Search reference, name, video…"
            value={query}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="stats-row">
        {STATUS_FILTER_KEYS.map(key => (
          <button
            key={key}
            className={`stat-chip ${activeFilter === key ? 'active' : ''}`}
            onClick={() => handleFilter(key)}
          >
            {key === 'all' ? 'All' : STATUS_LABELS[key]}
            <span className="count">
              {key === 'all' ? orders.length : orders.filter(o => o.status === key).length}
            </span>
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Email address</th>
              <th>Video file name</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">No orders</div>
                </td>
              </tr>
            ) : (
              visible.map(order => (
                <tr key={order.id} onClick={() => navigate(`/orders/${order.id}`)}>
                  <td>
                    <div className="td-ref">{order.referenceNumber}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-28)', marginTop: 2 }}>{formatDate(order.submittedAt)}</div>
                  </td>
                  <td>
                    <div className="td-name">{order.customerName}</div>
                  </td>
                  <td className="td-date">{order.address}, {order.country}</td>
                  <td className="td-date">{order.customerEmail}</td>
                  <td style={{ maxWidth: 220 }}>
                    <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 400 }}>{order.works[0].title}</div>
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

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
          >
            ← Prev
          </button>
          <span className="pagination-info">
            Page {page} / {totalPages}
          </span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </>
  )
}
