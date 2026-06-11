import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Download } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import StatusDropdown from '../components/StatusDropdown'
import type { Order, OrderStatus } from '../types'
import { useLang } from '../context/LangContext'
import type { TransKey } from '../i18n'

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

function filterOrders(orders: Order[], key: OrderStatus | 'all', query: string, sortOrder: 'asc' | 'desc') {
  let result = key === 'all' ? orders : orders.filter(o => o.status === key)
  if (query.trim()) result = result.filter(o => matchesSearch(o, query))
  return [...result].sort((a, b) => {
    const cmp = a.referenceNumber.localeCompare(b.referenceNumber)
    return sortOrder === 'asc' ? cmp : -cmp
  })
}

const PAGE_SIZE = 10

export default function OrdersPage({ orders, setOrders }: Props) {
  const navigate = useNavigate()
  const { t } = useLang()

  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showExportModal, setShowExportModal] = useState(false)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const [actionOrder, setActionOrder] = useState<Order | null>(null)
  const [activeModal, setActiveModal] = useState<ActionModal>(null)
  const [tokenId, setTokenId] = useState('')
  const [issuerAddress, setIssuerAddress] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shippingMethod, setShippingMethod] = useState('DHL')
  const [emailTemplate, setEmailTemplate] = useState<1 | 2>(1)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const filtered = filterOrders(orders, activeFilter, query, sortOrder)
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

  function setStatus(order: Order, target: OrderStatus, extra?: Partial<Order['works'][0]>) {
    const now = new Date().toISOString()
    setOrders(prev => prev.map(o => {
      if (o.id !== order.id) return o
      const updatedWork = extra ? { ...o.works[0], ...extra } : o.works[0]
      return {
        ...o, status: target,
        works: [{ ...updatedWork, status: target }],
        activityLog: [...o.activityLog, {
          id: `log-${Date.now()}`, timestamp: now,
          actor: 'admin',
          action: `Status changed to ${target.replace('_', '-')}`,
        }],
      }
    }))
  }

  function handleStatusSelect(order: Order, target: OrderStatus) {
    if (target === 'on_chain') { setActionOrder(order); setActiveModal('on_chain'); return }
    if (target === 'shipped')  { setActionOrder(order); setActiveModal('shipping'); return }
    setStatus(order, target)
    showToast(t('detail.toastStatus', { status: t(`status.${target}` as TransKey) }))
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
    setStatus(actionOrder, 'on_chain', { onChainTokenId: tokenId, onChainIssuerAddress: issuerAddress })
    showToast(t('detail.toastOnChain'))
    closeModal()
  }

  function confirmShipping() {
    if (!actionOrder) return
    setStatus(actionOrder, 'shipped', { trackingNumber, shippingMethod })
    showToast(t('detail.toastShipped'))
    closeModal()
  }

  function sendEmail() {
    if (!actionOrder) return
    showToast(t('detail.toastEmail', { n: emailTemplate, email: actionOrder.customerEmail }))
    closeModal()
  }

  const selectedOrders = orders.filter(o => selected.has(o.id))

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">{t('orders.title')}</h1>
        <div className="search-wrap">
          <svg className="search-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="6.5" cy="6.5" r="4.5" />
            <line x1="10" y1="10" x2="14" y2="14" />
          </svg>
          <input
            className="search-input"
            type="search"
            placeholder={t('orders.search')}
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
            {key === 'all' ? t('orders.all') : t(`status.${key}` as TransKey)}
            <span className="count">
              {key === 'all' ? orders.length : orders.filter(o => o.status === key).length}
            </span>
          </button>
        ))}
        <div style={{ marginLeft: 'auto' }}>
          {selected.size > 0 && (
            <button className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={() => setShowExportModal(true)}>
              <Download size={14} />
              {t('orders.exportSelected', { n: selected.size })}
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
              <th
                style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap', verticalAlign: 'middle' }}
                onClick={() => setSortOrder(s => s === 'asc' ? 'desc' : 'asc')}
              >
                {t('orders.col.orderId')}
                <span style={{ marginLeft: 8, display: 'inline-flex', flexDirection: 'column', gap: 1, verticalAlign: 'middle', lineHeight: 1, position: 'relative', top: -1 }}>
                  <span style={{ fontSize: 8, opacity: sortOrder === 'asc' ? 1 : 0.3, lineHeight: 1 }}>▲</span>
                  <span style={{ fontSize: 8, opacity: sortOrder === 'desc' ? 1 : 0.3, lineHeight: 1 }}>▼</span>
                </span>
              </th>
              <th>{t('orders.col.name')}</th>
              <th>{t('orders.col.videoFile')}</th>
              <th>{t('orders.col.status')}</th>
              <th>{t('orders.col.actions')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={6}><div className="empty-state">{t('orders.empty')}</div></td></tr>
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
                    <div style={{ fontSize: 13, color: 'var(--text-50)', marginTop: 2, fontWeight: 400 }}>{formatDate(order.submittedAt)}</div>
                  </td>
                  <td>
                    <div className="td-name">{order.customerName}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-50)', marginTop: 2, fontWeight: 400 }}>{order.customerEmail}</div>
                  </td>
                  <td style={{ maxWidth: 200 }}>
                    <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 400 }}>{order.works[0].title}</div>
                  </td>
                  <td onClick={e => e.stopPropagation()} style={{ overflow: 'visible' }}>
                    <StatusDropdown
                      currentStatus={order.status}
                      onSelect={target => handleStatusSelect(order, target)}
                    />
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <button
                      onClick={e => handleEmailAction(order, e)}
                      title={t('detail.resendEmail')}
                      className="icon-btn"
                    >
                      <Mail size={17} />
                    </button>
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
          <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>{t('orders.prev')}</button>
          <span className="pagination-info">{t('orders.page', { page, total: totalPages })}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>{t('orders.next')}</button>
        </div>
      )}

      {/* ── Export modal ── */}
      {showExportModal && (
        <div className="modal-backdrop" onClick={() => setShowExportModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{t('exportModal.title')}</div>
            <div style={{ fontSize: 14, color: 'var(--text-50)', marginBottom: 16 }}>
              {t('exportModal.desc', { n: selectedOrders.length, plural: selectedOrders.length !== 1 ? 's' : '' })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 20 }}>
              {EXPORT_FIELDS.map(field => (
                <div key={field} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                  <span style={{ color: 'var(--success)', fontSize: 12, lineHeight: 1 }}>✓</span>
                  <span style={{ color: 'var(--text-50)' }}>{field}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--text-12)', paddingTop: 12, marginBottom: 4 }}>
              <div style={{ fontSize: 13, color: 'var(--text-50)', lineHeight: 1.6 }}>
                {selectedOrders.map(o => o.referenceNumber).join(' · ')}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={() => setShowExportModal(false)}>{t('common.cancel')}</button>
              <button className="btn btn-primary btn-sm" onClick={() => setShowExportModal(false)}>{t('exportModal.download')}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mark On-chain modal ── */}
      {activeModal === 'on_chain' && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{t('onChainModal.title', { ref: actionOrder?.referenceNumber ?? '' })}</div>
            <div className="modal-field">
              <label className="modal-label">{t('onChainModal.tokenId')} <span className="modal-required">*</span></label>
              <input className="modal-input" placeholder="0x000000…" value={tokenId} onChange={e => setTokenId(e.target.value)} />
            </div>
            <div className="modal-field">
              <label className="modal-label">{t('onChainModal.issuerAddress')} <span className="modal-required">*</span></label>
              <input className="modal-input" placeholder="0xd8dA6B…" value={issuerAddress} onChange={e => setIssuerAddress(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={closeModal}>{t('common.cancel')}</button>
              <button className="btn btn-primary btn-sm" disabled={!tokenId.trim() || !issuerAddress.trim()} onClick={confirmOnChain}>{t('common.confirm')}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mark Shipped modal ── */}
      {activeModal === 'shipping' && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{t('shippingModal.title', { ref: actionOrder?.referenceNumber ?? '' })}</div>
            <div className="modal-field">
              <label className="modal-label">{t('shippingModal.method')} <span className="modal-required">*</span></label>
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
              <label className="modal-label">{t('shippingModal.tracking')} <span className="modal-required">*</span></label>
              <input className="modal-input" placeholder="e.g. SF1234567890" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={closeModal}>{t('common.cancel')}</button>
              <button className="btn btn-primary btn-sm" disabled={!trackingNumber.trim()} onClick={confirmShipping}>{t('common.confirm')}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Resend email modal ── */}
      {activeModal === 'email' && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{t('emailModal.title')}</div>
            <p style={{ fontSize: 14, color: 'var(--text-50)', marginBottom: 16 }}>
              {t('emailModal.sendTo')} <span style={{ color: 'var(--text)' }}>{actionOrder?.customerEmail}</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {([1, 2] as const).map(n => (
                <label key={n} className="modal-radio-row" onClick={() => setEmailTemplate(n)}>
                  <input type="radio" name="email-template" checked={emailTemplate === n} onChange={() => setEmailTemplate(n)} style={{ accentColor: 'var(--gold)' }} />
                  <div>
                    <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 400 }}>
                      {t(n === 1 ? 'emailModal.t1name' : 'emailModal.t2name')}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-50)', marginTop: 2 }}>
                      {t(n === 1 ? 'emailModal.t1desc' : 'emailModal.t2desc')}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={closeModal}>{t('common.cancel')}</button>
              <button className="btn btn-primary btn-sm" onClick={sendEmail}>{t('emailModal.send')}</button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && <div className="toast">{toastMsg}</div>}
    </>
  )
}
