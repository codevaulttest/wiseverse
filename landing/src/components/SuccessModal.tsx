import { useEffect } from 'react'
import { useLang } from '../context/LangContext'

interface Props {
  onClose: () => void
}

export default function SuccessModal({ onClose }: Props) {
  const { t } = useLang()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-box">
        <div className="modal-seal" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="modal-title" id="modal-title">{t.modal_title}</h2>
        <p className="modal-body">{t.modal_body}</p>
        <button className="modal-close" onClick={onClose}>
          {t.modal_close}
        </button>
      </div>
    </div>
  )
}
