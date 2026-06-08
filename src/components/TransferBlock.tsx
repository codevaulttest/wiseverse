import { useApp } from '../context/AppContext'
import type { TransferRecord } from '../types'

const MOCK_TRANSFERS: TransferRecord[] = [
  // address → address
  {
    date: '2026-06-06',
    from: '0x9F8E7D6C5B4A3210fedcba9876543210fedcba98',
    to: '0x12722727277227A8A6C3e92c07eDD18e7d6eA74',
    txHash: '0xd4f1a2b3c56789012345678901234567890abcdef1234567890abcdef12345678',
  },
  // address → email
  {
    date: '2026-06-02',
    from: '0x3dA9B63F1234567890abCDef1234567890ABcDeF',
    to: 'partner@globalagency.net',
    txHash: '0x7e8f9a0b1c2d3e4f5678901234567890abcdef1234567890abcdef1234567890',
  },
  // email → address
  {
    date: '2026-05-31',
    from: 'mike.zhang@studio.cc',
    to: '0x9F8E7D6C5B4A3210fedcba9876543210fedcba98',
    txHash: '0x2b3c4d5e6f7890ab1234567890abcdef1234567890abcdef1234567890abcdef',
  },
  // email → email
  {
    date: '2026-05-30',
    from: 'mike.zhang@studio.cc',
    to: 'licensor@eastmedia.com',
    txHash: '0x9c8b7a6d5e4f3012abcdef1234567890abcdef1234567890abcdef1234567890',
  },
  // initial (no from)
  {
    date: '2026-05-29',
    to: 'mike.zhang@studio.cc',
    txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
    initial: true,
  },
]

function shortId(val: string): string {
  if (val.startsWith('0x')) return val.slice(0, 6) + '…' + val.slice(-4)
  // email: show first 3 chars of local part + *** + @domain
  const at = val.indexOf('@')
  if (at > 0) {
    const local = val.slice(0, at)
    const domain = val.slice(at)
    return local.slice(0, 3) + '***' + domain
  }
  return val
}

export default function TransferBlock() {
  const { t } = useApp()

  return (
    <div className="transfer-section">
      <div className="transfer-block">
        <div className="onchain-header">
          <span className="onchain-label">{t.transfer_label}</span>
          <span className="onchain-line-dec" />
        </div>

        {MOCK_TRANSFERS.length === 0 ? (
          <div className="transfer-empty">{t.transfer_empty}</div>
        ) : (
          <div className="transfer-timeline">
            {MOCK_TRANSFERS.map((rec, i) => (
              <div key={i} className="transfer-item">
                <div className="transfer-dot" />
                <div className="transfer-content">

                  {rec.initial ? (
                    <div className="transfer-action transfer-action--initial">
                      {t.transfer_initial} →{' '}
                      <span className="transfer-action-label">{t.transfer_to}</span>
                      <a href="#" className="transfer-action-to" title={rec.to}>{shortId(rec.to)}</a>
                    </div>
                  ) : (
                    <div className="transfer-action">
                      <span className="transfer-action-from">
                        {t.transfer_from} <a href="#" title={rec.from}>{shortId(rec.from!)}</a>
                      </span>
                      <span className="transfer-action-arrow">→</span>
                      <span className="transfer-action-label">{t.transfer_to}</span>
                      <a href="#" className="transfer-action-to" title={rec.to}>{shortId(rec.to)}</a>
                    </div>
                  )}

                  <div className="transfer-meta">
                    <span className="transfer-date">{rec.date}</span>
                    <span className="transfer-meta-sep">·</span>
                    <a href="#" className="transfer-tx-hash">
                      {rec.txHash.slice(0, 8)}…{rec.txHash.slice(-6)}
                    </a>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
