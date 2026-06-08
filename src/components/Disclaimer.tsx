import { useApp } from '../context/AppContext'

export default function Disclaimer() {
  const { t } = useApp()
  return <div className="disclaimer">{t.disclaimer}</div>
}
