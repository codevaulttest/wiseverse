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

const EXPORT_FIELDS = [
  'Certificate No.',
  'Order Reference',
  'Customer Name',
  'Delivery Address',
  'Country',
  'Work Title',
  'SHA-256 Hash',
  'Video Duration',
  'Video Size',
  'Video Codec',
  'On-chain Token ID',
  'NFC Chip Sequence No.',
  'NFC Tag ID',
  'Submitted At',
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
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showExportModal, setShowExportModal] = useState(false)

  const filtered = filterOrders(orders, activeFilter, query)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const visibleIds = visible.map(o => o.id)
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every(id => selected.has(id))
  const someVisibleSelected = visibleIds.some(id => selected.has(id))

  function handleFilter(key: OrderStatus | 'all') {
    setActiveFilter(key)
    setPage(1)
    setSelected(new Set())
  }

  function handleSearch(q: string) {
    setQuery(q)
    setPage(1)
    setSelected(new Set())
  }

  function toggleRow(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (allVisibleSelected) {
      setSelected(prev => {
        const next = new Set(prev)
        visibleIds.forEach(id => next.delete(id))
        return next
      })
    } else {
      setSelected(prev => new Set([...prev, ...visibleIds]))
    }
  }

  const selectedOrders = orders.filter(o => selected.has(o.id))

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
        <div style={{ marginLeft: 'auto' }}>
          {selected.size > 0 && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowExportModal(true)}
            >
              Export selected ({selected.size})
            </button>
          )}
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: 40, paddingRight: 0 }}>
                <input
                  type="checkbox"
                  className="row-checkbox"
                  checked={allVisibleSelected}
                  ref={el => { if (el) el.indeterminate = someVisibleSelected && !allVisibleSelected }}
                  onChange={toggleAll}
                />
              </th>
              <th>Order ID</th>
              <th>Name</th>
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
                <tr
                  key={order.id}
                  className={selected.has(order.id) ? 'row-selected' : ''}
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <td
                    style={{ paddingRight: 0 }}
                    onClick={e => { e.stopPropagation(); toggleRow(order.id) }}
                  >
                    <input
                      type="checkbox"
                      className="row-checkbox"
                      checked={selected.has(order.id)}
                      onChange={() => toggleRow(order.id)}
                    />
                  </td>
                  <td>
                    <div className="td-ref">{order.referenceNumber}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-28)', marginTop: 2 }}>{formatDate(order.submittedAt)}</div>
                  </td>
                  <td>
                    <div className="td-name">{order.customerName}</div>
                  </td>
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

      {showExportModal && (
        <div className="modal-backdrop" onClick={() => setShowExportModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Export for Printing</div>

            <div style={{ fontSize: 14, color: 'var(--text-60)', marginBottom: 16 }}>
              {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected — the following fields will be included in the Excel file:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 20 }}>
              {EXPORT_FIELDS.map(field => (
                <div key={field} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                  <span style={{ color: 'var(--success)', fontSize: 12, lineHeight: 1 }}>✓</span>
                  <span style={{ color: 'var(--text-60)' }}>{field}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--text-12)', paddingTop: 12, marginBottom: 4 }}>
              <div style={{ fontSize: 13, color: 'var(--text-28)', lineHeight: 1.6 }}>
                {selectedOrders.map(o => o.referenceNumber).join(' · ')}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={() => setShowExportModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setShowExportModal(false)}>
                Download Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
