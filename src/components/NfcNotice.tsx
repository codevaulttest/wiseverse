import { useApp } from '../context/AppContext'

export default function NfcNotice() {
  const { state, t } = useApp()
  if (state !== 'onchain') return null

  return (
    <div className="nfc-notice">
      <span className="notice-icon">◈</span>
      <span className="notice-copy">{t.notice_copy}</span>
    </div>
  )
}
