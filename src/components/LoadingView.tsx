import { useApp } from '../context/AppContext'

export default function LoadingView() {
  const { t } = useApp()

  return (
    <div className="loading-view">
      <div className="loading-ring-wrap">
        <div className="loading-arc" />
        <img className="loading-icon" src="/loading-verification-illustration.svg" alt="" />
      </div>
      <div className="loading-title">{t.loading_title}</div>
      <div className="loading-sub">{t.loading_sub}</div>
      <div className="loading-dots">
        <span /><span /><span />
      </div>
    </div>
  )
}
