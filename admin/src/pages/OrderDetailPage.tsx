import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import type { Order, OrderStatus } from '../types'

interface Props {
  orders: Order[]
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
}

function formatDatetime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  paid:       'processing',
  processing: 'on_chain',
  on_chain:   'printing',
  printing:   'shipped',
  shipped:    'completed',
}

const ACTION_LABEL: Partial<Record<OrderStatus, string>> = {
  paid:       'Start Processing',
  processing: 'Mark On-chain',
  on_chain:   'Mark Printed',
  printing:   'Mark Shipped',
  shipped:    'Mark Completed',
}

type ModalType = 'on_chain' | 'shipping' | 'confirm' | 'email' | null

export default function OrderDetailPage({ orders, setOrders }: Props) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [modal, setModal] = useState<ModalType>(null)
  const [tokenId, setTokenId] = useState('')
  const [issuerAddress, setIssuerAddress] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shippingMethod, setShippingMethod] = useState('DHL')
  const [emailTemplate, setEmailTemplate] = useState<1 | 2>(1)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const order = orders.find(o => o.id === id)
  if (!order) return (
    <div>
      <button className="back-link" onClick={() => navigate('/orders')}>← Back to orders</button>
      <p style={{ color: 'var(--text-60)' }}>Order not found.</p>
    </div>
  )

  const work = order.works[0]
  const nextStatus = NEXT_STATUS[order.status]
  const actionLabel = ACTION_LABEL[order.status]

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  function advanceStatus(extra?: Partial<Order['works'][0]>) {
    if (!nextStatus) return
    const now = new Date().toISOString()
    setOrders(prev => prev.map(o => {
      if (o.id !== order!.id) return o
      const updatedWork = extra ? { ...o.works[0], ...extra } : o.works[0]
      return {
        ...o,
        status: nextStatus,
        works: [{ ...updatedWork, status: nextStatus }],
        activityLog: [
          ...o.activityLog,
          {
            id: `log-${Date.now()}`,
            timestamp: now,
            actor: 'admin@wiseverse.net',
            action: `Status changed to ${nextStatus.replace('_', '-')}`,
          },
        ],
      }
    }))
  }

  function handlePrimaryAction() {
    if (order!.status === 'processing') { setModal('on_chain'); return }
    if (order!.status === 'printing')   { setModal('shipping'); return }
    setModal('confirm')
  }

  function confirmOnChain() {
    advanceStatus({ onChainTokenId: tokenId, onChainIssuerAddress: issuerAddress })
    setModal(null); setTokenId(''); setIssuerAddress('')
    showToast('Order marked as on-chain')
  }

  function confirmShipping() {
    advanceStatus({ trackingNumber, shippingMethod })
    setModal(null); setTrackingNumber(''); setShippingMethod('DHL')
    showToast('Tracking number saved — order marked as shipped')
  }

  function confirmSimple() {
    advanceStatus()
    setModal(null)
    showToast(`Status updated to ${nextStatus!.replace('_', '-')}`)
  }

  function sendEmail() {
    setModal(null)
    showToast(`Template ${emailTemplate} sent to ${order!.customerEmail}`)
  }

  return (
    <>
      <button className="back-link" onClick={() => navigate('/orders')}>← Back to orders</button>

      <div className="page-header">
        <h1 className="page-title">{order.referenceNumber}</h1>
        <StatusBadge status={order.status} />
      </div>

      {/* Action bar */}
      <div className="action-bar">
        {actionLabel && (
          <button className="btn btn-primary btn-sm" onClick={handlePrimaryAction}>
            {actionLabel}
          </button>
        )}
        <button className="btn btn-ghost btn-sm" onClick={() => setModal('email')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="1" y="3" width="14" height="10" rx="1.5" />
            <polyline points="1,3 8,9.5 15,3" />
          </svg>
          Resend email notification
        </button>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <div className="detail-card-title">Customer</div>
          <div className="detail-field">
            <span className="detail-field-label">Contact</span>
            <span className="detail-field-value">{order.customerName}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Email</span>
            <span className="detail-field-value">{order.customerEmail}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Address</span>
            <span className="detail-field-value">{order.address}, {order.country}</span>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-card-title">Order</div>
          <div className="detail-field">
            <span className="detail-field-label">Reference</span>
            <span className="detail-field-value mono">{order.referenceNumber}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Total</span>
            <span className="detail-field-value">USD {order.totalAmount.toLocaleString()}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Submitted</span>
            <span className="detail-field-value">{formatDatetime(order.submittedAt)}</span>
          </div>
        </div>
      </div>

      <div className="work-item" style={{ marginBottom: 24 }}>
        <div className="detail-card-title" style={{ marginBottom: 14 }}>Work</div>
        <div className="work-item-header">
          <div className="work-title">{work.title}</div>
        </div>
        <div className="detail-field" style={{ marginTop: 10 }}>
          <span className="detail-field-label">SHA-256</span>
          <span className="work-hash">{work.videoHash}</span>
        </div>
        <div style={{ display: 'flex', gap: 32, marginTop: 8, flexWrap: 'wrap' }}>
          <div className="detail-field">
            <span className="detail-field-label">Duration</span>
            <span className="detail-field-value">{work.videoDuration}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Size</span>
            <span className="detail-field-value">{work.videoSize}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Codec</span>
            <span className="detail-field-value">{work.videoCodec}</span>
          </div>
          {work.certNumber && (
            <div className="detail-field">
              <span className="detail-field-label">Cert No.</span>
              <span className="detail-field-value mono" style={{ color: 'var(--gold)' }}>{work.certNumber}</span>
            </div>
          )}
        </div>
        {(work.onChainTokenId || work.nfcTagId || work.trackingNumber) && (
          <div style={{ display: 'flex', gap: 32, marginTop: 8, flexWrap: 'wrap' }}>
            {work.onChainTokenId && (
              <div className="detail-field">
                <span className="detail-field-label">Token ID</span>
                <span className="detail-field-value" style={{ fontFamily: 'monospace' }}>{work.onChainTokenId}</span>
              </div>
            )}
            {work.nfcTagId && (
              <div className="detail-field">
                <span className="detail-field-label">NFC Chip</span>
                <span className="detail-field-value">{work.nfcTagId}</span>
              </div>
            )}
            {work.trackingNumber && (
              <div className="detail-field">
                <span className="detail-field-label">Tracking</span>
                <span className="detail-field-value">{work.shippingMethod ? `${work.shippingMethod} — ${work.trackingNumber}` : work.trackingNumber}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="detail-card">
        <div className="detail-card-title">Activity Log</div>
        <div className="timeline">
          {[...order.activityLog].reverse().map((entry, idx) => (
            <div key={entry.id} className="timeline-item">
              <div style={{ position: 'relative' }}>
                <div className="timeline-dot" />
                {idx < order.activityLog.length - 1 && <div className="timeline-line" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                  <span className="timeline-action">{entry.action}</span>
                  <span className="timeline-actor">{entry.actor}</span>
                </div>
                {entry.detail && <div className="timeline-detail">{entry.detail}</div>}
                <div className="timeline-time">{formatDatetime(entry.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mark On-chain modal ── */}
      {modal === 'on_chain' && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Mark On-chain</div>
            <div className="modal-field">
              <label className="modal-label">Token ID <span className="modal-required">*</span></label>
              <input className="modal-input" placeholder="0x000000…" value={tokenId} onChange={e => setTokenId(e.target.value)} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Issuer Address <span className="modal-required">*</span></label>
              <input className="modal-input" placeholder="0xd8dA6B…" value={issuerAddress} onChange={e => setIssuerAddress(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary btn-sm" disabled={!tokenId.trim() || !issuerAddress.trim()} onClick={confirmOnChain}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mark Shipped modal ── */}
      {modal === 'shipping' && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Mark Shipped</div>
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
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary btn-sm" disabled={!trackingNumber.trim()} onClick={confirmShipping}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Simple confirm modal ── */}
      {modal === 'confirm' && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{actionLabel}</div>
            <p style={{ fontSize: 14, color: 'var(--text-60)', marginBottom: 20 }}>
              Move this order from <strong style={{ color: 'var(--text)' }}>{order.status.replace('_', '-')}</strong> to <strong style={{ color: 'var(--text)' }}>{nextStatus?.replace('_', '-')}</strong>?
            </p>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={confirmSimple}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Resend email modal ── */}
      {modal === 'email' && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Resend Email Notification</div>
            <p style={{ fontSize: 14, color: 'var(--text-60)', marginBottom: 16 }}>
              Send to: <span style={{ color: 'var(--text)' }}>{order.customerEmail}</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {([1, 2] as const).map(n => (
                <label key={n} className="modal-radio-row" onClick={() => setEmailTemplate(n)}>
                  <input type="radio" name="email-template" checked={emailTemplate === n} onChange={() => setEmailTemplate(n)} style={{ accentColor: 'var(--gold)' }} />
                  <div>
                    <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 400 }}>
                      {n === 1 ? 'Template 1 — Payment & submission confirmation' : 'Template 2 — Delivery & digital certificate'}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-60)', marginTop: 2 }}>
                      {n === 1 ? 'Sent after payment confirmed + video received' : 'Sent when physical + digital package is dispatched'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={sendEmail}>Send</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </>
  )
}
