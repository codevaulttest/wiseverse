import { useApp } from '../context/AppContext'

export default function OnChainBlock() {
  const { state, t } = useApp()

  return (
    <div className="onchain-block">
      <div className="onchain-header">
        <span className="onchain-label">{t.onchain_label}</span>
        <span className="onchain-line-dec" />
      </div>

      <div className="chain-row">
        <span className="ch-key">{t.ch_sig}</span>
        <span className="ch-val">
          {state === 'verified' ? (
            <span>
              {t.ch_sig_verified}<br />
              0x0EF376766C69400A8A6C3e92c07eDD18e7d6eA74
            </span>
          ) : (
            <span style={{ color: 'var(--text-28)', fontSize: '12px', fontStyle: 'italic' }}>
              {t.ch_sig_none}
            </span>
          )}
        </span>
      </div>

      <div className="chain-row">
        <span className="ch-key">{t.ch_token}</span>
        <span className="ch-val">
          <a href="#">53234914853141795189840113938456271650482947316</a>
        </span>
      </div>

      <div className="chain-row">
        <span className="ch-key">{t.ch_tx}</span>
        <span className="ch-val">
          <a href="#">0xa89df6537e7998a5f9dfb288a9262d80f50c26c60a5174ce1de7a10616c3b95f</a>
        </span>
      </div>

      <div className="chain-row">
        <span className="ch-key">{t.ch_issuer}</span>
        <span className="ch-val">0x0EF376766C69400A8A6C3e92c07eDD18e7d6eA74</span>
      </div>
    </div>
  )
}
