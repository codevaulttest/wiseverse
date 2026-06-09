import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import type { Order, Work, WorkStatus, NfcTag, ActivityEntry } from '../types'
import { STATUS_LABELS, STATUS_ORDER } from '../mock/data'

interface Props {
  orders: Order[]
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
  nfcTags: NfcTag[]
  setNfcTags: React.Dispatch<React.SetStateAction<NfcTag[]>>
}

type ModalType =
  | { type: 'onchain'; workId: string }
  | { type: 'assign_nfc'; workId: string }
  | { type: 'ship'; workId: string }
  | { type: 'email' }
  | { type: 'export' }
  | null

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

function nextStatus(s: WorkStatus): WorkStatus | null {
  const idx = STATUS_ORDER.indexOf(s)
  if (idx < 0 || idx >= STATUS_ORDER.length - 1) return null
  return STATUS_ORDER[idx + 1]
}

function canAdvance(s: WorkStatus) {
  return s !== 'completed' && s !== 'pending_payment'
}

function actionLabel(s: WorkStatus): string {
  if (s === 'paid') return '开始处理'
  if (s === 'processing') return '标记已上链'
  if (s === 'on_chain') return '分配 NFC 芯片'
  if (s === 'printing') return '标记已寄出'
  if (s === 'shipped') return '标记已完成'
  return ''
}

export default function OrderDetailPage({ orders, setOrders, nfcTags, setNfcTags }: Props) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [modal, setModal] = useState<ModalType>(null)
  const [tokenId, setTokenId] = useState('')
  const [issuerAddress, setIssuerAddress] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [selectedNfc, setSelectedNfc] = useState<string | null>(null)
  const [emailNotice, setEmailNotice] = useState<string | null>(null)

  const foundOrder = orders.find(o => o.id === id)
  if (!foundOrder) return (
    <div>
      <button className="back-link" onClick={() => navigate('/orders')}>← 返回订单列表</button>
      <p style={{ color: 'var(--text-60)' }}>订单不存在。</p>
    </div>
  )
  // eslint-disable-next-line prefer-const
  const order = foundOrder

  function addActivity(action: string, detail?: string): ActivityEntry {
    return {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'admin@wiseverse.net',
      action,
      detail,
    }
  }

  function updateWorkStatus(workId: string, newStatus: WorkStatus, extra?: Partial<Work>) {
    setOrders(prev => prev.map(o => {
      if (o.id !== order.id) return o
      const works = o.works.map(w =>
        w.id === workId ? { ...w, status: newStatus, ...extra } : w
      )
      const allStatuses = works.map(w => STATUS_ORDER.indexOf(w.status))
      const minIdx = Math.min(...allStatuses)
      const orderStatus = STATUS_ORDER[minIdx] as WorkStatus
      return { ...o, works, status: orderStatus }
    }))
  }

  function appendLog(entry: ActivityEntry) {
    setOrders(prev => prev.map(o =>
      o.id === order.id
        ? { ...o, activityLog: [...o.activityLog, entry] }
        : o
    ))
  }

  function handleStartProcessing(workId: string) {
    updateWorkStatus(workId, 'processing')
    appendLog(addActivity('开始处理'))
    setModal(null)
  }

  function handleOnChain() {
    if (!modal || modal.type !== 'onchain') return
    const { workId } = modal
    updateWorkStatus(workId, 'on_chain', {
      onChainTokenId: tokenId,
      onChainIssuerAddress: issuerAddress,
      issuedAt: new Date().toISOString(),
    })
    appendLog(addActivity('标记已上链', `Token ID: ${tokenId}`))
    setTokenId('')
    setIssuerAddress('')
    setModal(null)
  }

  function handleAssignNfc() {
    if (!modal || modal.type !== 'assign_nfc' || !selectedNfc) return
    const { workId } = modal
    const tag = nfcTags.find(t => t.id === selectedNfc)
    if (!tag) return
    const work = order.works.find(w => w.id === workId)
    const certNumber = work?.certNumber ?? `WV-SC-${String(Date.now()).slice(-3)}`
    updateWorkStatus(workId, 'printing', {
      nfcTagId: tag.sequenceNumber,
      certNumber,
    })
    setNfcTags(prev => prev.map(t =>
      t.id === selectedNfc
        ? { ...t, status: 'assigned', assignedToCertNumber: certNumber, assignedAt: new Date().toISOString() }
        : t
    ))
    appendLog(addActivity('分配 NFC 芯片', `${tag.sequenceNumber} → ${certNumber}`))
    setSelectedNfc(null)
    setModal(null)
  }

  function handleShip() {
    if (!modal || modal.type !== 'ship') return
    const { workId } = modal
    updateWorkStatus(workId, 'shipped', {
      trackingNumber,
      shippedAt: new Date().toISOString(),
    })
    appendLog(addActivity('标记已寄出', `快递单号: ${trackingNumber}`))
    setTrackingNumber('')
    setModal(null)
  }

  function handleComplete(workId: string) {
    updateWorkStatus(workId, 'completed')
    appendLog(addActivity('标记已完成'))
  }

  function handleSendEmail(template: 1 | 2) {
    appendLog(addActivity('确认邮件已发送', `模板 ${template}，发至 ${order.customerEmail}`))
    setEmailNotice(`邮件模板 ${template} 已发送至 ${order.customerEmail}`)
    setModal(null)
    setTimeout(() => setEmailNotice(null), 4000)
  }

  const availableTags = nfcTags.filter(t => t.status === 'available')
  const allCompleted = order.works.every(w => w.status === 'completed')

  return (
    <>
      <button className="back-link" onClick={() => navigate('/orders')}>← 返回订单列表</button>

      <div className="page-header">
        <h1 className="page-title">{order.referenceNumber}</h1>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <StatusBadge status={order.status} />
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setModal({ type: 'email' })}
          >
            发送邮件通知
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setModal({ type: 'export' })}
            disabled={!allCompleted}
            title={allCompleted ? '' : '所有作品完成后可导出'}
          >
            导出打印文件
          </button>
        </div>
      </div>

      {emailNotice && (
        <div className="notice notice-success">{emailNotice}</div>
      )}

      <div className="detail-grid">
        <div className="detail-card">
          <div className="detail-card-title">客户信息</div>
          <div className="detail-field">
            <span className="detail-field-label">联系人</span>
            <span className="detail-field-value">{order.customerName}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">公司</span>
            <span className="detail-field-value">{order.companyName}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Email</span>
            <span className="detail-field-value">{order.customerEmail}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">地址</span>
            <span className="detail-field-value">{order.address}, {order.country}</span>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-card-title">订单信息</div>
          <div className="detail-field">
            <span className="detail-field-label">Reference</span>
            <span className="detail-field-value mono">{order.referenceNumber}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">总额</span>
            <span className="detail-field-value">USD {order.totalAmount.toLocaleString()}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">作品数量</span>
            <span className="detail-field-value">{order.works.length}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">提交时间</span>
            <span className="detail-field-value">{formatDatetime(order.submittedAt)}</span>
          </div>
        </div>
      </div>

      <div className="works-section">
        <div className="section-title">作品列表</div>

        {order.works.map((work, idx) => (
          <div key={work.id} className="work-item">
            <div className="work-item-header">
              <div>
                <div className="work-title">#{idx + 1} {work.title}</div>
                <div className="work-hash">{work.videoHash.slice(0, 32)}…</div>
              </div>
              <StatusBadge status={work.status} />
            </div>

            <div className="work-meta">
              <span>{work.videoDuration}</span>
              <span>{work.videoSize}</span>
              <span>{work.videoCodec}</span>
              {work.certNumber && <span className="mono" style={{ color: 'var(--gold)', fontSize: 12 }}>{work.certNumber}</span>}
            </div>

            {(work.onChainTokenId || work.nfcTagId || work.trackingNumber) && (
              <div style={{ display: 'flex', gap: 16, marginBottom: 10, flexWrap: 'wrap' }}>
                {work.onChainTokenId && (
                  <div style={{ fontSize: 12 }}>
                    <span style={{ color: 'var(--text-28)' }}>Token ID: </span>
                    <span style={{ color: 'var(--text-60)', fontFamily: 'monospace' }}>{work.onChainTokenId.slice(0, 20)}…</span>
                  </div>
                )}
                {work.nfcTagId && (
                  <div style={{ fontSize: 12 }}>
                    <span style={{ color: 'var(--text-28)' }}>NFC: </span>
                    <span style={{ color: 'var(--text-60)' }}>{work.nfcTagId}</span>
                  </div>
                )}
                {work.trackingNumber && (
                  <div style={{ fontSize: 12 }}>
                    <span style={{ color: 'var(--text-28)' }}>快递: </span>
                    <span style={{ color: 'var(--text-60)' }}>{work.trackingNumber}</span>
                  </div>
                )}
              </div>
            )}

            <div className="work-actions">
              {work.status === 'paid' && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleStartProcessing(work.id)}
                >
                  开始处理
                </button>
              )}

              {work.status === 'processing' && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => { setTokenId(''); setIssuerAddress(''); setModal({ type: 'onchain', workId: work.id }) }}
                >
                  标记已上链
                </button>
              )}

              {work.status === 'on_chain' && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => { setSelectedNfc(null); setModal({ type: 'assign_nfc', workId: work.id }) }}
                  disabled={availableTags.length === 0}
                  title={availableTags.length === 0 ? '无可用 NFC 芯片' : ''}
                >
                  分配 NFC 芯片 {availableTags.length === 0 && '(库存不足)'}
                </button>
              )}

              {work.status === 'printing' && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => { setTrackingNumber(''); setModal({ type: 'ship', workId: work.id }) }}
                >
                  标记已寄出
                </button>
              )}

              {work.status === 'shipped' && (
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleComplete(work.id)}
                >
                  标记已完成
                </button>
              )}

              {canAdvance(work.status) && (
                <span style={{ fontSize: 12, color: 'var(--text-28)', marginLeft: 4 }}>
                  {STATUS_LABELS[work.status]}
                  {nextStatus(work.status) && ` → ${STATUS_LABELS[nextStatus(work.status)!]}`}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="detail-card">
        <div className="detail-card-title">操作历史</div>
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

      {modal?.type === 'onchain' && (
        <Modal
          title="标记已上链"
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>取消</button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleOnChain}
                disabled={!tokenId.trim() || !issuerAddress.trim()}
              >
                确认上链
              </button>
            </>
          }
        >
          <div className="inline-form">
            <div className="form-field">
              <label className="form-label">On-Chain Token ID</label>
              <input
                className="form-input"
                value={tokenId}
                onChange={e => setTokenId(e.target.value)}
                placeholder="0x000000000000000000000000000000xx"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Issuer Address</label>
              <input
                className="form-input"
                value={issuerAddress}
                onChange={e => setIssuerAddress(e.target.value)}
                placeholder="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
              />
            </div>
          </div>
        </Modal>
      )}

      {modal?.type === 'assign_nfc' && (
        <Modal
          title="分配 NFC 芯片"
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>取消</button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleAssignNfc}
                disabled={!selectedNfc}
              >
                确认分配
              </button>
            </>
          }
        >
          <p style={{ fontSize: 13, color: 'var(--text-60)', marginBottom: 14 }}>
            从库存中选择一枚未分配的 NFC 芯片：
          </p>
          <div className="select-list">
            {availableTags.map(tag => (
              <div
                key={tag.id}
                className={`select-item ${selectedNfc === tag.id ? 'selected' : ''}`}
                onClick={() => setSelectedNfc(tag.id)}
              >
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 400 }}>{tag.sequenceNumber}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-28)', fontFamily: 'monospace' }}>{tag.tagId}</div>
                </div>
                <StatusBadge status="available" label="可用" />
              </div>
            ))}
          </div>
        </Modal>
      )}

      {modal?.type === 'ship' && (
        <Modal
          title="标记已寄出"
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>取消</button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleShip}
                disabled={!trackingNumber.trim()}
              >
                确认寄出
              </button>
            </>
          }
        >
          <div className="form-field">
            <label className="form-label">快递单号</label>
            <input
              className="form-input"
              value={trackingNumber}
              onChange={e => setTrackingNumber(e.target.value)}
              placeholder="DHL-xxxxxxxxxxxx"
            />
          </div>
        </Modal>
      )}

      {modal?.type === 'email' && (
        <Modal
          title="发送邮件通知"
          onClose={() => setModal(null)}
        >
          <p style={{ fontSize: 13, color: 'var(--text-60)', marginBottom: 16 }}>
            将发送至：<strong style={{ color: 'var(--text)' }}>{order.customerEmail}</strong>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              className="btn btn-ghost"
              style={{ justifyContent: 'flex-start' }}
              onClick={() => handleSendEmail(1)}
            >
              <div>
                <div style={{ fontWeight: 500, color: 'var(--text)' }}>模板 1 — 标准确认</div>
                <div style={{ fontSize: 12, color: 'var(--text-28)', marginTop: 2 }}>不含数码证书，仅实体快递</div>
              </div>
            </button>
            <button
              className="btn btn-ghost"
              style={{ justifyContent: 'flex-start' }}
              onClick={() => handleSendEmail(2)}
            >
              <div>
                <div style={{ fontWeight: 500, color: 'var(--text)' }}>模板 2 — 含数码证书</div>
                <div style={{ fontSize: 12, color: 'var(--text-28)', marginTop: 2 }}>含数码证书随邮件交付说明</div>
              </div>
            </button>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>取消</button>
          </div>
        </Modal>
      )}

      {modal?.type === 'export' && (
        <Modal
          title="导出打印文件"
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>关闭</button>
              <button className="btn btn-primary btn-sm" onClick={() => setModal(null)}>
                下载 .xlsx
              </button>
            </>
          }
        >
          <p style={{ fontSize: 13, color: 'var(--text-60)', marginBottom: 14 }}>
            以下字段将被导出至 Excel，供印刷商使用：
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['证书号 (Cert Number)', '作品名称 (Title)', '权利人 (Rights Holder)', 'SHA-256 哈希', 'On-Chain Token ID', 'Issuer 地址', '签发日期'].map(field => (
              <div key={field} style={{
                padding: '8px 12px',
                background: 'var(--bg)',
                border: '1px solid var(--text-12)',
                borderRadius: 5,
                fontSize: 13,
                color: 'var(--text-60)',
              }}>
                {field}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-28)', marginTop: 14 }}>
            共 {order.works.length} 行，含本订单所有作品。
          </p>
        </Modal>
      )}
    </>
  )
}
