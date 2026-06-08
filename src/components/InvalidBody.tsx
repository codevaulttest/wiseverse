import { useApp } from '../context/AppContext'

export default function InvalidBody() {
  const { t } = useApp()

  return (
    <div className="invalid-body">
      <img className="inv-glyph" src="/invalid-certificate-illustration.svg" alt="" />
      <div className="inv-title">{t.inv_title}</div>
      <div className="inv-body">{t.inv_body}</div>
      <a href="mailto:support@wiseverse.net" className="inv-contact">
        support@wiseverse.net
      </a>
    </div>
  )
}
