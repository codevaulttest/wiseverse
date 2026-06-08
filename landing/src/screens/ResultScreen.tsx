import { useLang } from '../context/LangContext'

export type ResultState = 'payment-success' | 'payment-failed' | 'already-certified'

interface Props {
  result: ResultState
  onReset: () => void
}

const MOCK_CERT = {
  id:    'WV-SC-20260001007',
  hash:  '05bd857af7f70bf51b6aac9d4e112a8f3c7b2e91f4d6a0c8e5b3d2f1a7c9e4b6',
  date:  '2026-05-14',
  chain: 'SuperAIChain',
}

function StepItem({ n, text }: { n: number; text: string }) {
  return (
    <div className="result-step">
      <span className="result-step-n">{n}</span>
      <span>{text}</span>
    </div>
  )
}

export default function ResultScreen({ result, onReset }: Props) {
  const { t } = useLang()

  if (result === 'payment-success') {
    return (
      <div className="result-page result-success">
        <div className="result-inner">
          <div className="result-seal result-seal-ok">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <p className="result-eyebrow">{t.pricing_eyebrow}</p>
          <h1 className="result-title">{t.pay_ok_title}</h1>
          <p className="result-body">{t.pay_ok_body}</p>

          <div className="result-steps-wrap">
            <p className="result-steps-label">{t.pay_ok_next}</p>
            <StepItem n={1} text={t.step2_title} />
            <StepItem n={2} text={t.step3_title} />
            <StepItem n={3} text={t.step4_title} />
          </div>

          <button className="result-btn-primary" onClick={onReset}>
            {t.pay_ok_home}
          </button>
        </div>
      </div>
    )
  }

  if (result === 'payment-failed') {
    return (
      <div className="result-page result-failed">
        <div className="result-inner">
          <div className="result-seal result-seal-fail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="result-eyebrow">{t.pricing_eyebrow}</p>
          <h1 className="result-title">{t.pay_fail_title}</h1>
          <p className="result-body">{t.pay_fail_body}</p>

          <div className="result-actions">
            <button className="result-btn-primary" onClick={onReset}>
              {t.pay_fail_retry}
            </button>
            <a
              className="result-btn-ghost"
              href="mailto:contact@wiseverse.net"
            >
              {t.pay_fail_contact}
            </a>
          </div>
        </div>
      </div>
    )
  }

  // already-certified
  return (
    <div className="result-page result-dupe">
      <div className="result-inner">
        <div className="result-seal result-seal-dupe">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <p className="result-eyebrow">{t.pricing_eyebrow}</p>
        <h1 className="result-title">{t.pay_dupe_title}</h1>
        <p className="result-body">{t.pay_dupe_body}</p>

        <div className="result-cert-card">
          <div className="result-cert-row">
            <span className="result-cert-label">Certificate ID</span>
            <span className="result-cert-value result-cert-mono">{MOCK_CERT.id}</span>
          </div>
          <div className="result-cert-row">
            <span className="result-cert-label">SHA-256</span>
            <span className="result-cert-value result-cert-mono result-cert-hash">{MOCK_CERT.hash}</span>
          </div>
          <div className="result-cert-row">
            <span className="result-cert-label">Registered</span>
            <span className="result-cert-value">{MOCK_CERT.date}</span>
          </div>
          <div className="result-cert-row">
            <span className="result-cert-label">Chain</span>
            <span className="result-cert-value">{MOCK_CERT.chain}</span>
          </div>
        </div>

        <div className="result-actions">
          <a
            className="result-btn-primary"
            href="https://verify.wiseverse.net"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.pay_dupe_view}
          </a>
          <button className="result-btn-ghost" onClick={onReset}>
            {t.pay_dupe_back}
          </button>
        </div>
      </div>
    </div>
  )
}
