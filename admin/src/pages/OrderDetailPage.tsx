import { useParams, useNavigate } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import type { Order } from '../types'

interface Props {
  orders: Order[]
}

function formatDatetime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function OrderDetailPage({ orders }: Props) {
  const { id } = useParams()
  const navigate = useNavigate()

  const order = orders.find(o => o.id === id)
  if (!order) return (
    <div>
      <button className="back-link" onClick={() => navigate('/orders')}>← Back to orders</button>
      <p style={{ color: 'var(--text-60)' }}>Order not found.</p>
    </div>
  )

  const work = order.works[0]

  return (
    <>
      <button className="back-link" onClick={() => navigate('/orders')}>← Back to orders</button>

      <div className="page-header">
        <h1 className="page-title">{order.referenceNumber}</h1>
        <StatusBadge status={order.status} />
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
                <span className="detail-field-value">{work.trackingNumber}</span>
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
    </>
  )
}
