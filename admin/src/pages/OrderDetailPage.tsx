import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import type { Order, OrderStatus, AdminUser } from '../types'
import { useLang } from '../context/LangContext'
import type { TransKey } from '../i18n'

interface Props {
  orders: Order[]
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
  currentUser: AdminUser | null
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

const ACTION_KEY: Partial<Record<OrderStatus, TransKey>> = {
  paid:       'action.startProcessing',
  processing: 'action.markOnChain',
  on_chain:   'action.markPrinted',
  printing:   'action.markShipped',
  shipped:    'action.markCompleted',
}

type ModalType = 'on_chain' | 'shipping' | 'confirm' | 'email' | 'customer' | null

export default function OrderDetailPage({ orders, setOrders, currentUser }: Props) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLang()

  const [modal, setModal] = useState<ModalType>(null)
  const [tokenId, setTokenId] = useState('')
  const [issuerAddress, setIssuerAddress] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shippingMethod, setShippingMethod] = useState('DHL')
  const [emailTemplate, setEmailTemplate] = useState<1 | 2>(1)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [draftCustomer, setDraftCustomer] = useState({ name: '', email: '', address: '', country: '', companyName: '' })

  const order = orders.find(o => o.id === id)
  if (!order) return (
    <div>
      <button className="back-link" onClick={() => navigate('/orders')}>{t('detail.back')}</button>
      <p style={{ color: 'var(--text-50)' }}>{t('detail.notFound')}</p>
    </div>
  )

  const work = order.works[0]
  const nextStatus = NEXT_STATUS[order.status]
  const actionKey = ACTION_KEY[order.status]
  const actionLabel = actionKey ? t(actionKey) : undefined

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
    showToast(t('detail.toastOnChain'))
  }

  function confirmShipping() {
    advanceStatus({ trackingNumber, shippingMethod })
    setModal(null); setTrackingNumber(''); setShippingMethod('DHL')
    showToast(t('detail.toastShipped'))
  }

  function confirmSimple() {
    advanceStatus()
    setModal(null)
    showToast(t('detail.toastStatus', { status: t(`status.${nextStatus}` as TransKey) }))
  }

  function sendEmail() {
    setModal(null)
    showToast(t('detail.toastEmail', { n: emailTemplate, email: order!.customerEmail }))
  }

  const canEditOrder = currentUser?.permissions.includes('edit_order') ?? false

  function openCustomerEdit() {
    setDraftCustomer({
      name: order!.customerName,
      email: order!.customerEmail,
      address: order!.address,
      country: order!.country,
      companyName: order!.companyName,
    })
    setModal('customer')
  }

  function saveCustomer() {
    setOrders(prev => prev.map(o =>
      o.id === order!.id
        ? { ...o, customerName: draftCustomer.name, customerEmail: draftCustomer.email, address: draftCustomer.address, country: draftCustomer.country, companyName: draftCustomer.companyName }
        : o
    ))
    setModal(null)
    showToast(t('detail.customerSaved'))
  }

  return (
    <>
      <button className="back-link" onClick={() => navigate('/orders')}>{t('detail.back')}</button>

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
          {t('detail.resendEmail')}
        </button>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div className="detail-card-title" style={{ marginBottom: 0 }}>{t('detail.customer')}</div>
            {canEditOrder && (
              <button className="btn btn-ghost btn-xs" onClick={openCustomerEdit}>{t('detail.editCustomer')}</button>
            )}
          </div>
          <div className="detail-field">
            <span className="detail-field-label">{t('detail.contact')}</span>
            <span className="detail-field-value">{order.customerName}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">{t('detail.email')}</span>
            <span className="detail-field-value">{order.customerEmail}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">{t('detail.address')}</span>
            <span className="detail-field-value">{order.address}, {order.country}</span>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-card-title">{t('detail.order')}</div>
          <div className="detail-field">
            <span className="detail-field-label">{t('detail.reference')}</span>
            <span className="detail-field-value mono">{order.referenceNumber}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">{t('detail.total')}</span>
            <span className="detail-field-value">USD {order.totalAmount.toLocaleString()}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">{t('detail.submitted')}</span>
            <span className="detail-field-value">{formatDatetime(order.submittedAt)}</span>
          </div>
        </div>
      </div>

      <div className="work-item" style={{ marginBottom: 24 }}>
        <div className="detail-card-title" style={{ marginBottom: 14 }}>{t('detail.work')}</div>
        <div className="work-item-header">
          <div className="work-title">{work.title}</div>
        </div>
        <div className="detail-field" style={{ marginTop: 10 }}>
          <span className="detail-field-label">{t('detail.sha256')}</span>
          <span className="work-hash">{work.videoHash}</span>
        </div>
        <div style={{ display: 'flex', gap: 32, marginTop: 8, flexWrap: 'wrap' }}>
          <div className="detail-field">
            <span className="detail-field-label">{t('detail.duration')}</span>
            <span className="detail-field-value">{work.videoDuration}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">{t('detail.size')}</span>
            <span className="detail-field-value">{work.videoSize}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">{t('detail.codec')}</span>
            <span className="detail-field-value">{work.videoCodec}</span>
          </div>
          {work.certNumber && (
            <div className="detail-field">
              <span className="detail-field-label">{t('detail.certNo')}</span>
              <span className="detail-field-value mono" style={{ color: 'var(--gold)' }}>{work.certNumber}</span>
            </div>
          )}
        </div>
        {(work.onChainTokenId || work.nfcTagId || work.trackingNumber) && (
          <div style={{ display: 'flex', gap: 32, marginTop: 8, flexWrap: 'wrap' }}>
            {work.onChainTokenId && (
              <div className="detail-field">
                <span className="detail-field-label">{t('detail.tokenId')}</span>
                <span className="detail-field-value" style={{ fontFamily: 'monospace' }}>{work.onChainTokenId}</span>
              </div>
            )}
            {work.nfcTagId && (
              <div className="detail-field">
                <span className="detail-field-label">{t('detail.nfcChip')}</span>
                <span className="detail-field-value">{work.nfcTagId}</span>
              </div>
            )}
            {work.trackingNumber && (
              <div className="detail-field">
                <span className="detail-field-label">{t('detail.tracking')}</span>
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
            <p style={{ fontSize: 14, color: 'var(--text-50)', marginBottom: 20 }}>
              {t('detail.moveTo', {
                from: t(`status.${order.status}` as TransKey),
                to: t(`status.${nextStatus}` as TransKey),
              })}
            </p>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>{t('common.cancel')}</button>
              <button className="btn btn-primary btn-sm" onClick={confirmSimple}>{t('common.confirm')}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Resend email modal ── */}
      {modal === 'email' && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Resend Email Notification</div>
            <p style={{ fontSize: 14, color: 'var(--text-50)', marginBottom: 16 }}>
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
                    <div style={{ fontSize: 13, color: 'var(--text-50)', marginTop: 2 }}>
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

      {/* ── Edit customer modal ── */}
      {modal === 'customer' && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{t('detail.editCustomer')}</div>
            <div className="modal-field">
              <label className="modal-label">{t('detail.contact')}</label>
              <input className="modal-input" value={draftCustomer.name} onChange={e => setDraftCustomer(d => ({ ...d, name: e.target.value }))} />
            </div>
            <div className="modal-field">
              <label className="modal-label">{t('detail.company')}</label>
              <input className="modal-input" value={draftCustomer.companyName} onChange={e => setDraftCustomer(d => ({ ...d, companyName: e.target.value }))} />
            </div>
            <div className="modal-field">
              <label className="modal-label">{t('detail.email')}</label>
              <input className="modal-input" value={draftCustomer.email} onChange={e => setDraftCustomer(d => ({ ...d, email: e.target.value }))} />
            </div>
            <div className="modal-field">
              <label className="modal-label">{t('detail.address')}</label>
              <input className="modal-input" value={draftCustomer.address} onChange={e => setDraftCustomer(d => ({ ...d, address: e.target.value }))} />
            </div>
            <div className="modal-field">
              <label className="modal-label">{t('detail.country')}</label>
              <input className="modal-input" value={draftCustomer.country} onChange={e => setDraftCustomer(d => ({ ...d, country: e.target.value }))} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>{t('common.cancel')}</button>
              <button className="btn btn-primary btn-sm" onClick={saveCustomer}>{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </>
  )
}
