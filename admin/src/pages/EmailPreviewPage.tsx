import { useState } from 'react'
import type { EmailTemplate } from '../types'
import { useLang } from '../context/LangContext'
import type { TransKey } from '../i18n'

const MOCK_VARS: Record<string, string> = {
  CLIENT_NAME: 'Zhang Wei',
  COMPANY_NAME: 'Futureworks Media Ltd.',
  CERT_REF: 'WV-2026-001',
  NUM_WORKS: '3',
  ORDER_TOTAL: '1,500.00',
  SUBMISSION_DATE: '12 May 2026',
  DELIVERY_DATE: '26 May 2026',
  WORKS_LIST: '  1. The Last Migration — Director\'s Cut\n  2. Echoes of the Pearl River\n  3. Neon Solstice',
}

const TPL_LABEL_KEY: Record<number, TransKey> = {
  1: 'email.tpl1.label',
  2: 'email.tpl2.label',
}
const TPL_DESC_KEY: Record<number, TransKey> = {
  1: 'email.tpl1.desc',
  2: 'email.tpl2.desc',
}

function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`)
}

interface Props {
  templates: EmailTemplate[]
  setTemplates: React.Dispatch<React.SetStateAction<EmailTemplate[]>>
  canEdit: boolean
}

export default function EmailPreviewPage({ templates, setTemplates, canEdit }: Props) {
  const { t } = useLang()
  const [active, setActive] = useState(templates[0]?.id ?? 1)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draftSubject, setDraftSubject] = useState('')
  const [draftBody, setDraftBody] = useState('')

  const tpl = templates.find(t => t.id === active)!
  const filledSubject = fillTemplate(tpl.subject, MOCK_VARS)
  const filledBody = fillTemplate(tpl.body, MOCK_VARS)

  function startEdit() {
    setDraftSubject(tpl.subject)
    setDraftBody(tpl.body)
    setEditingId(tpl.id)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  function saveEdit() {
    setTemplates(prev =>
      prev.map(t =>
        t.id === editingId ? { ...t, subject: draftSubject, body: draftBody } : t
      )
    )
    setEditingId(null)
  }

  const isEditing = editingId === tpl.id

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">{t('email.pageTitle')}</h1>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-50)', marginBottom: 20 }}>
        {t('email.previewHint')}
      </p>

      <div className="email-tabs">
        {templates.map(tpl => (
          <button
            key={tpl.id}
            className={`email-tab ${active === tpl.id ? 'active' : ''}`}
            onClick={() => {
              if (isEditing) cancelEdit()
              setActive(tpl.id)
            }}
          >
            {TPL_LABEL_KEY[tpl.id] ? t(TPL_LABEL_KEY[tpl.id]) : tpl.label}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-50)', marginBottom: 14 }}>
        {TPL_DESC_KEY[tpl.id] ? t(TPL_DESC_KEY[tpl.id]) : tpl.desc}
      </p>

      {isEditing ? (
        <div className="email-preview-wrap">
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--text-50)', marginBottom: 4, letterSpacing: '0.06em' }}>
              {t('email.subject')}
            </label>
            <input
              type="text"
              className="form-input"
              value={draftSubject}
              onChange={e => setDraftSubject(e.target.value)}
              style={{ fontFamily: 'monospace', fontSize: 13 }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--text-50)', marginBottom: 4, letterSpacing: '0.06em' }}>
              {t('email.body')}
            </label>
            <textarea
              className="form-input"
              value={draftBody}
              onChange={e => setDraftBody(e.target.value)}
              rows={28}
              style={{ fontFamily: 'monospace', fontSize: 13, resize: 'vertical', width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={saveEdit}>{t('common.save')}</button>
            <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>{t('common.cancel')}</button>
          </div>
        </div>
      ) : (
        <div className="email-preview-wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="email-subject">{filledSubject}</div>
              <div className="email-meta">
                From: no-reply@wiseverse.net &nbsp;·&nbsp; To: {MOCK_VARS.CLIENT_NAME} &lt;client@example.com&gt;
              </div>
            </div>
            {canEdit && (
              <button className="btn btn-primary btn-sm" onClick={startEdit} style={{ marginLeft: 16, flexShrink: 0 }}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 13, height: 13 }}>
                  <path d="M11 2l3 3-8 8H3v-3L11 2z" />
                </svg>
                {t('email.editBtn')}
              </button>
            )}
          </div>
          <div className="email-body">{filledBody}</div>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <div className="detail-card-title" style={{ marginBottom: 10, fontSize: 11 }}>{t('email.mergeVars')}</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t('email.col.variable')}</th>
                <th>{t('email.col.mockVal')}</th>
                <th>{t('email.col.source')}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(MOCK_VARS).map(([key, val]) => (
                <tr key={key} style={{ cursor: 'default' }}>
                  <td><code style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--gold)' }}>{`{{${key}}}`}</code></td>
                  <td style={{ fontSize: 12, color: 'var(--text)' }}>{val.includes('\n') ? t('email.multiLine') : val}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-50)' }}>{t('email.sourceVal')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
