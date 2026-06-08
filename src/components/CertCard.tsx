import { useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import OnChainBlock from './OnChainBlock'
import NfcNotice from './NfcNotice'
import InvalidBody from './InvalidBody'

export default function CertCard() {
  const { state, t } = useApp()
  const cardRef = useRef<HTMLDivElement>(null)
  const prevState = useRef(state)

  useEffect(() => {
    if (prevState.current !== state) {
      const card = cardRef.current
      if (card) {
        card.classList.remove('re-animate')
        void card.offsetWidth
        card.classList.add('re-animate')
      }
      prevState.current = state
    }
  }, [state])

  const pillText = state === 'verified' ? t.pill_verified
                 : state === 'onchain'  ? t.pill_onchain
                 : t.pill_invalid

  return (
    <div className="cert-card" ref={cardRef}>
      <div className="corners"><i /><i /><i /><i /></div>

      {/* Unified status header: seal (verified only) + pill */}
      <div className="cert-status-head">
        {state === 'verified' && (
          <img
            src="/verified-seal.svg"
            alt="Verified"
            className="verified-seal-icon"
          />
        )}
        <div className="status-pill">
          <span className="pill-dot" />
          <span>{pillText}</span>
        </div>
      </div>

      {state !== 'invalid' && (
        <>
          <div className="cert-main">
            <div className="cert-eyebrow">{t.cert_eyebrow}</div>
            <div className="cert-number">WV-SC-20260001007</div>
            <div className="cert-rule" />

            <div className="field">
              <span className="f-label">{t.label_holder}</span>
              <div>
                {state === 'verified'
                  ? <div className="f-val">Mike Zhang</div>
                  : <div className="f-val dim">b***@x**.cc</div>
                }
              </div>
            </div>

            <div className="field">
              <span className="f-label">{t.label_date}</span>
              <span className="f-val">{t.val_date}</span>
            </div>

            <div className="field">
              <span className="f-label">{t.label_fingerprint}</span>
              <span className="f-val mono">
                05bd857af7f70bf51b6aac9d4e112a8f3c7b2e91f4d6a0c8e5b3d2f1a7c9e4b6
              </span>
            </div>

            <div className="field">
              <span className="f-label">{t.label_duration}</span>
              <span className="f-val mono-plain">02:34</span>
            </div>

            <div className="field">
              <span className="f-label">{t.label_created}</span>
              <span className="f-val mono-plain">2026-05-29 14:32:18</span>
            </div>

            <div className="field">
              <span className="f-label">{t.label_dimensions}</span>
              <span className="f-val mono-plain">1920 × 1080</span>
            </div>

            <div className="field">
              <span className="f-label">{t.label_codec}</span>
              <span className="f-val mono-plain">H.264 / AAC</span>
            </div>
          </div>

          <OnChainBlock />
          <NfcNotice />
        </>
      )}

      {state === 'invalid' && <InvalidBody />}

      {state !== 'invalid' && (
        <div className="card-foot">
          <div className="foot-row">
            <span className="foot-item">{t.foot_issued}</span>
            <span className="foot-sep" />
            <span className="foot-item">{t.foot_secured}</span>
          </div>
        </div>
      )}
    </div>
  )
}
