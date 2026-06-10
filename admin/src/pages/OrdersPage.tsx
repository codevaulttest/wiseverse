import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import type { Order, OrderStatus } from '../types'
import { STATUS_LABELS } from '../mock/data'

interface Props {
  orders: Order[]
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
}

const STATUS_FILTER_KEYS: Array<OrderStatus | 'all'> = [
  'all', 'paid', 'processing', 'on_chain', 'printing', 'shipped', 'completed',
]

const EXPORT_FIELDS = [
  'Certificate No.', 'Order Reference', 'Customer Name', 'Delivery Address',
  'Country', 'Work Title', 'SHA-256 Hash', 'Video Duration', 'Video Size',
  'Video Codec', 'On-chain Token ID', 'NFC Chip Sequence No.', 'NFC Tag ID', 'Submitted At',
]

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  paid: 'processing', processing: 'on_chain', on_chain: 'printing',
  printing: 'shipped', shipped: 'completed',
}

const ACTION_LABEL: Partial<Record<OrderStatus, string>> = {
  paid: 'Start Processing', processing: 'Mark On-chain', on_chain: 'Mark Printed',
  printing: 'Mark Shipped', shipped: 'Mark Completed',
}

type ActionModal = 'on_chain' | 'shipping' | 'email' | null

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function matchesSearch(order: Order, q: string) {
  const s = q.toLowerCase()
  return (
    order.referenceNumber.toLowerCase().includes(s) ||
    order.customerName.toLowerCase().includes(s) ||
    order.customerEmail.toLowerCase().includes(s) ||
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

export default function OrdersPage({ orders, setOrders }: Props) {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showExportModal, setShowExportModal] = useState(false)

  // Action modal state
  const [actionOrder, setActionOrder] = useState<Order | null>(null)
  const [activeModal, setActiveModal] = useState<ActionModal>(null)
  const [tokenId, setTokenId] = useState('')
  const [issuerAddress, setIssuerAddress] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shippingMethod, setShippingMethod] = useState('DHL')
  const [emailTemplate, setEmailTemplate] = useState<1 | 2>(1)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const filtered = filterOrders(orders, activeFilter, query)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const visibleIds = visible.map(o => o.id)
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every(id => selected.has(id))
  const someVisibleSelected = visibleIds.some(id => selected.has(id))

  function handleFilter(key: OrderStatus | 'all') { setActiveFilter(key); setPage(1); setSelected(new Set()) }
  function handleSearch(q: string) { setQuery(q); setPage(1); setSelected(new Set()) }

  function toggleRow(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function toggleAll() {
    if (allVisibleSelected) {
      setSelected(prev => { const n = new Set(prev); visibleIds.forEach(id => n.delete(id)); return n })
    } else {
      setSelected(prev => new Set([...prev, ...visibleIds]))
    }
  }

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  function advance(order: Order, extra?: Partial<Order['works'][0]>) {
    const next = NEXT_STATUS[order.status]
    if (!next) return
    const now = new Date().toISOString()
    setOrders(prev => prev.map(o => {
      if (o.id !== order.id) return o
      const updatedWork = extra ? { ...o.works[0], ...extra } : o.works[0]
      return {
        ...o, status: next,
        works: [{ ...updatedWork, status: next }],
        activityLog: [...o.activityLog, {
          id: `log-${Date.now()}`, timestamp: now,
          actor: 'admin@wiseverse.net',
          action: `Status changed to ${next.replace('_', '-')}`,
        }],
      }
    }))
  }

  function handleAction(order: Order, e: React.MouseEvent) {
    e.stopPropagation()
    if (order.status === 'processing') { setActionOrder(order); setActiveModal('on_chain'); return }
    if (order.status === 'printing')   { setActionOrder(order); setActiveModal('shipping'); return }
    advance(order)
    showToast(`${order.referenceNumber} → ${NEXT_STATUS[order.status]?.replace('_', '-')}`)
  }

  function handleEmailAction(order: Order, e: React.MouseEvent) {
    e.stopPropagation()
    setActionOrder(order)
    setActiveModal('email')
  }

  function closeModal() {
    setActiveModal(null); setActionOrder(null)
    setTokenId(''); setIssuerAddress(''); setTrackingNumber(''); setShippingMethod('DHL')
  }

  function confirmOnChain() {
    if (!actionOrder) return
    advance(actionOrder, { onChainTokenId: tokenId, onChainIssuerAddress: issuerAddress })
    showToast(`${actionOrder.referenceNumber} marked on-chain`)
    closeModal()
  }

  function confirmShipping() {
    if (!actionOrder) return
    advance(actionOrder, { trackingNumber, shippingMethod })
    showToast(`${actionOrder.referenceNumber} marked shipped`)
    closeModal()
  }

  function sendEmail() {
    if (!actionOrder) return
    showToast(`Template ${emailTemplate} sent to ${actionOrder.customerEmail}`)
    closeModal()
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
            <button className="btn btn-primary btn-sm" onClick={() => setShowExportModal(true)}>
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
              <th>Video file name</th>
              <th>Status</th>
              <th>Actions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={6}><div className="empty-state">No orders</div></td></tr>
            ) : (
              visible.map(order => (
                <tr
                  key={order.id}
                  className={selected.has(order.id) ? 'row-selected' : ''}
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <td style={{ paddingRight: 0 }} onClick={e => { e.stopPropagation(); toggleRow(order.id) }}>
                    <input type="checkbox" className="row-checkbox" checked={selected.has(order.id)} onChange={() => toggleRow(order.id)} />
                  </td>
                  <td>
                    <div className="td-ref">{order.referenceNumber}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-28)', marginTop: 2 }}>{formatDate(order.submittedAt)}</div>
                  </td>
                  <td>
                    <div className="td-name">{order.customerName}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-28)', marginTop: 2 }}>{order.customerEmail}</div>
                  </td>
                  <td style={{ maxWidth: 200 }}>
                    <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 400 }}>{order.works[0].title}</div>
                  </td>
                  <td><StatusBadge status={order.status} /></td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {ACTION_LABEL[order.status] && (
                        <button
                          className="btn btn-primary btn-xs"
                          onClick={e => handleAction(order, e)}
                        >
                          {ACTION_LABEL[order.status]}
                        </button>
                      )}
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={e => handleEmailAction(order, e)}
                        title="Resend email notification"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 8px' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <rect x="1" y="3" width="14" height="10" rx="1.5" />
                          <polyline points="1,3 8,9.5 15,3" />
                        </svg>
                      </button>
                    </div>
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
          <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Prev</button>
          <span className="pagination-info">Page {page} / {totalPages}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next →</button>
        </div>
      )}

      {/* ── Export modal ── */}
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
              <button className="btn btn-ghost btn-sm" onClick={() => setShowExportModal(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={() => setShowExportModal(false)}>Download Excel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mark On-chain modal ── */}
      {activeModal === 'on_chain' && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Mark On-chain — {actionOrder?.referenceNumber}</div>
            <div className="modal-field">
              <label className="modal-label">Token ID <span className="modal-required">*</span></label>
              <input className="modal-input" placeholder="0x000000…" value={tokenId} onChange={e => setTokenId(e.target.value)} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Issuer Address <span className="modal-required">*</span></label>
              <input className="modal-input" placeholder="0xd8dA6B…" value={issuerAddress} onChange={e => setIssuerAddress(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary btn-sm" disabled={!tokenId.trim() || !issuerAddress.trim()} onClick={confirmOnChain}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mark Shipped modal ── */}
      {activeModal === 'shipping' && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Mark Shipped — {actionOrder?.referenceNumber}</div>
            <div className="modal-field">
              <label className="modal-label">Shipping Method <span className="modal-required">*</span></label>
              <select className="modal-input" value={shippingMethod} onChange={e => setShippingMethod(e.target.value)}>
                <option value="DHL">DHL</option>
                <option value="FedEx">FedEx</option>
                <option value="UPS">UPS</option>
                <option value="SF Express">SF Express</option>
                <option value="USPS">USPS</option>
                <option value="EMS">EMS</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="modal-field">
              <label className="modal-label">Tracking Number <span className="modal-required">*</span></label>
              <input className="modal-input" placeholder="e.g. SF1234567890" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary btn-sm" disabled={!trackingNumber.trim()} onClick={confirmShipping}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Resend email modal ── */}
      {activeModal === 'email' && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Resend Email Notification</div>
            <p style={{ fontSize: 14, color: 'var(--text-60)', marginBottom: 16 }}>
              Send to: <span style={{ color: 'var(--text)' }}>{actionOrder?.customerEmail}</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {([1, 2] as const).map(n => (
                <label key={n} className="modal-radio-row" onClick={() => setEmailTemplate(n)}>
                  <input type="radio" name="email-template" checked={emailTemplate === n} onChange={() => setEmailTemplate(n)} style={{ accentColor: 'var(--gold)' }} />
                  <div>
                    <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 400 }}>
                      {n === 1 ? 'Template 1 — Payment & submission confirmation' : 'Template 2 — Delivery & digital certificate'}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-28)', marginTop: 2 }}>
                      {n === 1 ? 'Sent after payment confirmed + video received' : 'Sent when physical + digital package is dispatched'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={sendEmail}>Send</button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && <div className="toast">{toastMsg}</div>}
    </>
  )
}
